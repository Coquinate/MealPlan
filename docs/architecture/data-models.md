# Data Models

This section defines the core data models and entities that will be shared between frontend and backend, establishing clear business logic before the technical database implementation.

## Core Business Entities

Based on the PRD requirements and system architecture, we identify these key business entities that represent the conceptual foundation of the Coquinate platform:

## User Model

**Purpose:** Represents Romanian families using the meal planning service with their preferences and subscription status.

**Key Attributes:**

- id: string - Unique identifier
- email: string - Authentication email
- householdSize: number - Family size (1-6 people per FR5)
- menuType: 'omnivore' | 'vegetarian' - Dietary preference (FR4)
- subscriptionStatus: SubscriptionStatus - Current subscription state
- preferences: UserPreferences - Personalization settings

### TypeScript Interface

```typescript
interface User {
  id: string;
  email: string;
  householdSize: number;
  menuType: 'omnivore' | 'vegetarian';
  subscriptionStatus: 'none' | 'trial' | 'active' | 'paused' | 'cancelled' | 'expired';
  hasActiveTrial: boolean;
  hasTrialGiftAccess: boolean;
  defaultViewPreference: 'week' | 'today';
  customShoppingCategories: string[];
  guestModeEnabled: boolean; // FR40: Manual quantity adjustment mode
  trialEndsAt?: Date;
  subscriptionPausedUntil?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Relationships

- User (1) ←→ (∞) MealPlan
- User (1) ←→ (∞) ShoppingList
- User (1) ←→ (∞) RecipeFeedback
- User (1) ←→ (1) UserTrial

## Recipe Model

**Purpose:** Represents Romanian recipes with bilingual content, ingredients, and cooking instructions for the meal planning system.

**Key Attributes:**

- id: string - Unique identifier
- titles: BilingualText - Recipe names in Romanian/English
- descriptions: BilingualText - Recipe descriptions
- ingredients: RecipeIngredient[] - Normalized ingredient list
- instructions: BilingualInstructions - Step-by-step cooking guide
- metadata: RecipeMetadata - Cooking time, difficulty, servings

### TypeScript Interface

```typescript
interface Recipe {
  id: string;
  titleRo: string;
  titleEn: string;
  descriptionRo?: string;
  descriptionEn?: string;
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  activeCookingTime: number; // minutes - FR15: Active hands-on cooking time
  servings: number;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  imageUrl?: string;
  instructionsRo: string;
  instructionsEn: string;
  status: 'draft' | 'published' | 'archived';
  createdBy?: string; // admin user id
  sourceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RecipeIngredient {
  id: string;
  recipeId: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  notes?: string;
}
```

### Relationships

- Recipe (∞) ←→ (∞) Ingredient (through RecipeIngredient)
- Recipe (1) ←→ (∞) PlannedMeal
- Recipe (1) ←→ (∞) RecipeFeedback

## MealPlan Model

**Purpose:** Represents a weekly meal plan for a specific user with complete breakfast, lunch, dinner, and snack planning.

**Key Attributes:**

- id: string - Unique identifier
- userId: string - Owner reference
- weekStartDate: Date - Thursday start date (per FR3)
- status: string - Plan status
- meals: PlannedMeal[] - All meals for the week

### TypeScript Interface

```typescript
interface MealPlan {
  id: string;
  userId: string;
  weekStartDate: Date;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
}

interface PlannedMeal {
  id: string;
  mealPlanId: string;
  recipeId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  scheduledDate: Date;
  servings: number;
  completed: boolean;
}
```

### Relationships

- MealPlan (1) ←→ (∞) PlannedMeal
- MealPlan (1) ←→ (1) ShoppingList
- MealPlan (∞) ←→ (∞) Recipe (through PlannedMeal)

## ShoppingList Model

**Purpose:** Auto-generated shopping lists from meal plans with Romanian shopping categories and user customization (FR6, FR28).

**Key Attributes:**

- id: string - Unique identifier
- userId: string - Owner reference
- mealPlanId: string - Source meal plan
- items: ShoppingListItem[] - Categorized shopping items
- status: string - List status

### TypeScript Interface

```typescript
interface ShoppingList {
  id: string;
  userId: string;
  mealPlanId?: string;
  status: 'pending' | 'active' | 'completed';
  generatedAt: Date;
  guestModeEnabled: boolean; // FR40: Tracks if quantities need manual adjustment
  quantityAdjustmentReminder?: string; // FR40: User reminder message for guest mode
}

interface ShoppingListItem {
  id: string;
  shoppingListId: string;
  ingredientId?: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  category?: string;
  checked: boolean;
  alreadyHave: boolean; // FR12 requirement
  createdAt: Date;
}
```

### Relationships

- ShoppingList (1) ←→ (∞) ShoppingListItem
- ShoppingList (∞) ←→ (1) User
- ShoppingList (∞) ←→ (1) MealPlan

## Ingredient Model

**Purpose:** Normalized ingredient database with OpenFoodFacts integration for nutrition data and Romanian names.

**Key Attributes:**

- id: string - Unique identifier
- names: BilingualText - Romanian and English names
- nutritionData: NutritionInfo - OpenFoodFacts data
- category: string - Ingredient category

### TypeScript Interface

```typescript
interface Ingredient {
  id: string;
  openFoodFactsId?: string;
  nameEn: string;
  nameRo: string;
  category?: string;
  nutritionData?: Record<string, any>; // OpenFoodFacts JSON
  createdAt: Date;
}
```

### Relationships

- Ingredient (∞) ←→ (∞) Recipe (through RecipeIngredient)

## RecipeFeedback Model

**Purpose:** Simple thumbs up/down feedback system for recipe improvement and analytics (FR7).

### TypeScript Interface

```typescript
interface RecipeFeedback {
  id: string;
  userId: string;
  recipeId: string;
  rating: 'liked' | 'disliked';
  feedbackText?: string;
  createdAt: Date;
}
```

### Relationships

- RecipeFeedback (∞) ←→ (1) User
- RecipeFeedback (∞) ←→ (1) Recipe

## Admin Models

## AdminUser Model

**Purpose:** Admin operators managing recipe content and meal plan creation with 2FA security (Story 3.1).

### TypeScript Interface

```typescript
interface AdminUser {
  id: string;
  email: string;
  hashedPassword: string;
  totpSecretEncrypted?: string; // 2FA support
  role: 'admin';
  createdAt: Date;
}
```

## TrialMenu Model

**Purpose:** Fixed 3-day showcase menu for trial users (FR8, FR29).

### TypeScript Interface

```typescript
interface TrialMenu {
  id: string;
  recipeId: string;
  mealType: 'lunch' | 'dinner' | 'snacks'; // Only 3 meals per day for trial
  dayNumber: 1 | 2 | 3;
  approvedBy?: string; // admin user id
  createdAt: Date;
}
```
