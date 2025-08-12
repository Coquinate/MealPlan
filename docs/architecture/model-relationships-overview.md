# Model Relationships Overview

**Entity Relationships:**

- User (1) ←→ (∞) MealPlan
- User (1) ←→ (∞) ShoppingList
- User (1) ←→ (∞) RecipeFeedback
- MealPlan (1) ←→ (1) ShoppingList
- MealPlan (∞) ←→ (∞) Recipe (through PlannedMeal)
- Recipe (1) ←→ (∞) RecipeFeedback
