# Database Schema

## Critical Architecture Fix Applied ✅

**❌ Issue Identified**: Recipe ingredient modeling flaw would prevent efficient shopping list generation and ingredient queries.

**✅ Fix Implemented**: Proper normalized many-to-many relationship between recipes and ingredients using junction table.

## Data Access Strategy: Supabase-Native SQL DDL

**Decision Made**: Supabase-native SQL DDL approach (no ORM dependencies)

**Rationale:**

- Direct SQL control for optimal Edge Runtime performance
- No ORM overhead or compatibility issues
- Native Supabase TypeScript type generation
- Simpler deployment without build-time schema compilation
- Direct RLS policy integration without abstraction layers

## Complete Database Schema (16 Tables)

### Core Enums

```sql
-- User and subscription enums
CREATE TYPE menu_type_enum AS ENUM ('vegetarian', 'omnivore');
CREATE TYPE subscription_status_enum AS ENUM ('none', 'trial', 'active', 'paused', 'cancelled', 'expired');
CREATE TYPE view_preference_enum AS ENUM ('week', 'today');

-- Recipe and meal enums
CREATE TYPE recipe_status_enum AS ENUM ('draft', 'published', 'archived');
CREATE TYPE meal_type_enum AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- Admin workflow enums
CREATE TYPE draft_status_enum AS ENUM ('draft', 'validating', 'approved', 'published');
CREATE TYPE validation_type_enum AS ENUM ('ai_nutrition', 'ai_variety', 'manual_review', 'weekday_dinner_time');
CREATE TYPE validation_status_enum AS ENUM ('pass', 'fail', 'warning');
CREATE TYPE import_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed');
```

### 1. Users Table (Enhanced)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,

  -- PRD Requirements
  household_size INTEGER CHECK (household_size >= 1 AND household_size <= 6), -- FR5
  menu_type menu_type_enum NOT NULL, -- FR4
  subscription_status subscription_status_enum DEFAULT 'none',
  has_active_trial BOOLEAN DEFAULT false,
  has_trial_gift_access BOOLEAN DEFAULT false, -- FR8
  default_view_preference view_preference_enum DEFAULT 'week', -- FR32
  custom_shopping_categories TEXT[] DEFAULT '{}', -- FR28
  guest_mode_enabled BOOLEAN DEFAULT false, -- FR40

  -- Subscription management
  trial_ends_at TIMESTAMPTZ,
  subscription_paused_until TIMESTAMPTZ, -- FR19
  stripe_customer_id VARCHAR,
  stripe_subscription_id VARCHAR,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Ingredients Table (OpenFoodFacts Integration)

```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  openfoodfacts_id VARCHAR UNIQUE, -- External reference
  name_en VARCHAR NOT NULL,
  name_ro VARCHAR NOT NULL, -- Multi-language support
  category VARCHAR,
  nutrition_data JSONB, -- Flexible nutrition info from OpenFoodFacts
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_openfoodfacts ON ingredients(openfoodfacts_id);
```

### 3. Recipes Table (Enhanced)

```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en VARCHAR NOT NULL,
  title_ro VARCHAR NOT NULL,
  description_en TEXT,
  description_ro TEXT,
  instructions_en TEXT NOT NULL,
  instructions_ro TEXT NOT NULL,

  -- Recipe metadata
  prep_time INTEGER, -- minutes
  cook_time INTEGER, -- minutes
  active_cooking_time INTEGER NOT NULL DEFAULT 30, -- FR15: Active hands-on time
  servings INTEGER DEFAULT 4,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  image_url VARCHAR,

  -- Admin features
  source_url VARCHAR, -- For recipe imports
  status recipe_status_enum DEFAULT 'draft',
  created_by UUID REFERENCES admin_users(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recipes_status ON recipes(status);
```

### 4. Recipe Ingredients Junction Table (CRITICAL FIX)

```sql
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id),
  quantity DECIMAL(8,2) NOT NULL,
  unit VARCHAR NOT NULL, -- 'g', 'ml', 'pieces', etc.
  notes VARCHAR, -- Optional prep notes

  UNIQUE(recipe_id, ingredient_id)
);

CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient_id);
```

### 5. Meal Plans Table

```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL, -- Thursday per PRD
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meal_plans_user_week ON meal_plans(user_id, week_start_date);
```

### 6. Planned Meals Junction Table

```sql
CREATE TABLE planned_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id),
  meal_type meal_type_enum NOT NULL,
  scheduled_date DATE NOT NULL,
  servings INTEGER DEFAULT 4,
  completed BOOLEAN DEFAULT false,

  UNIQUE(meal_plan_id, scheduled_date, meal_type)
);

CREATE INDEX idx_planned_meals_meal_plan ON planned_meals(meal_plan_id);
CREATE INDEX idx_planned_meals_recipe ON planned_meals(recipe_id);
```

### 7. Leftover Connections Table (FR2)

```sql
CREATE TABLE leftover_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_meal_id UUID NOT NULL REFERENCES planned_meals(id),
  target_meal_id UUID NOT NULL REFERENCES planned_meals(id),
  connection_type VARCHAR DEFAULT 'leftover', -- 'batch_cooking', 'ingredient_reuse'
  notes TEXT,

  UNIQUE(source_meal_id, target_meal_id)
);
```

### 8. Shopping Lists Table

```sql
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES meal_plans(id),
  status VARCHAR DEFAULT 'pending',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  guest_mode_enabled BOOLEAN DEFAULT false, -- FR40
  quantity_adjustment_reminder TEXT -- FR40: Message for manual adjustment
);

CREATE INDEX idx_shopping_lists_user ON shopping_lists(user_id);
```

### 9. Shopping List Items Table

```sql
CREATE TABLE shopping_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id),
  ingredient_name VARCHAR NOT NULL, -- Denormalized for custom items
  quantity DECIMAL(8,2) NOT NULL,
  unit VARCHAR NOT NULL,
  category VARCHAR, -- Custom categories per FR28
  checked BOOLEAN DEFAULT false,
  already_have BOOLEAN DEFAULT false, -- FR12

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shopping_list_items_list ON shopping_list_items(shopping_list_id);
```

### 10. Recipe Feedback Table (FR7)

```sql
CREATE TABLE recipe_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  rating VARCHAR CHECK (rating IN ('liked', 'disliked')), -- Simple per FR7
  feedback_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, recipe_id)
);
```

### 11. Trial Menus Table (FR8, FR29)

```sql
CREATE TABLE trial_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id),
  meal_type meal_type_enum NOT NULL,
  day_number INTEGER CHECK (day_number >= 1 AND day_number <= 3),
  approved_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(day_number, meal_type) -- One recipe per meal per day
);
```

### 12. Admin Users Table

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  totp_secret_encrypted VARCHAR, -- For 2FA authentication (Story 3.1)
  role VARCHAR DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 13. Draft Meal Plans Table (Admin Workflow)

```sql
CREATE TABLE draft_meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start_date DATE NOT NULL,
  menu_type menu_type_enum NOT NULL, -- FR27 separate omnivore/vegetarian
  status draft_status_enum DEFAULT 'draft',
  created_by UUID REFERENCES admin_users(id),
  validation_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(week_start_date, menu_type)
);
```

### 14. Validation Results Table (AI Validation)

```sql
CREATE TABLE validation_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_meal_plan_id UUID NOT NULL REFERENCES draft_meal_plans(id) ON DELETE CASCADE,
  validation_type validation_type_enum NOT NULL,
  status validation_status_enum NOT NULL,
  details JSONB, -- AI feedback and suggestions
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 15. Recipe Imports Table (Admin Feature)

```sql
CREATE TABLE recipe_imports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_url VARCHAR NOT NULL,
  imported_by UUID REFERENCES admin_users(id),
  recipe_id UUID REFERENCES recipes(id), -- Set when successful
  status import_status_enum DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 16. Published Weeks Table (Publishing Workflow)

```sql
CREATE TABLE published_weeks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start_date DATE NOT NULL,
  menu_type menu_type_enum NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  published_by UUID REFERENCES admin_users(id),

  UNIQUE(week_start_date, menu_type)
);
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_feedback ENABLE ROW LEVEL SECURITY;

-- User data isolation policies
CREATE POLICY users_own_data ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY meal_plans_own_data ON meal_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY shopping_lists_own_data ON shopping_lists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY recipe_feedback_own_data ON recipe_feedback FOR ALL USING (auth.uid() = user_id);

-- Public read access for published content
CREATE POLICY recipes_public_read ON recipes FOR SELECT USING (status = 'published');
CREATE POLICY ingredients_public_read ON ingredients FOR SELECT USING (true);
CREATE POLICY trial_menus_public_read ON trial_menus FOR SELECT USING (true);
```
