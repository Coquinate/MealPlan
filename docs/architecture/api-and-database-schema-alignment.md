# API and Database Schema Alignment

Two specific schema gaps require attention for full API compatibility:

## 1. Missing User Trial Progress Tracking

**Issue:** API endpoints reference `UserTrial.completedMeals` and `UserTrial.convertedAt` for detailed trial progress, but no `user_trials` table exists.

**Required Database Addition:**

```sql
CREATE TABLE user_trials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_meals JSONB DEFAULT '[]'::jsonb, -- Array of completed recipe IDs
  converted_at TIMESTAMPTZ, -- When trial converted to paid
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id) -- One trial record per user
);
```

**Affected APIs:** Trial progress tracking, conversion status, gift recipe access

## 2. Missing Recipe Testing Fields

**Issue:** Admin recipe testing workflow expects `tested_by` and `tested_at` fields, but recipes table lacks these columns.

**Required Database Addition:**

```sql
ALTER TABLE recipes
ADD COLUMN tested_by UUID REFERENCES admin_users(id),
ADD COLUMN tested_at TIMESTAMPTZ;
```

**Affected APIs:** Admin recipe approval workflow, testing audit trail

---

**Note:** All other user model fields mentioned in API documentation (default_view_preference, custom_shopping_categories, trial_ends_at, subscription_paused_until) already exist in the database schema.
