# Core Workflows

## User Registration and Trial Flow

```mermaid
sequenceDiagram
    participant U as User
    participant W as Web App
    participant API as Edge Function
    participant DB as Database
    participant E as Email Service

    U->>W: Register with email
    W->>API: register.mutation()
    API->>DB: Create user record
    API->>DB: Setup 3-day trial
    API->>DB: Assign trial menu
    API->>E: Send welcome email
    API-->>W: Return user + trial menu
    W-->>U: Show trial dashboard

    Note over U,DB: FR8: 3-day trial with fixed menu

    alt Trial Conversion
        U->>W: Complete payment
        W->>API: convertToPaid.mutation()
        API->>DB: Update subscription
        API->>DB: Grant immediate week access
        API-->>W: Access granted
        W-->>U: Show full meal plan
    end
```

## Weekly Meal Plan Generation and Publishing

```mermaid
sequenceDiagram
    participant A as Admin
    participant AD as Admin Dashboard
    participant API as Edge Function
    participant AI as Gemini AI
    participant DB as Database
    participant CRON as pg_cron

    A->>AD: Create draft meal plan
    AD->>API: createDraftMealPlan()
    API->>DB: Save draft (auto-save 60s)

    loop Meal Selection
        A->>AD: Add recipes to days
        AD->>API: updateDraftMeal()
        API->>DB: Update draft
        AD-->>A: Show leftover connections
    end

    A->>AD: Request validation
    AD->>API: validateMealPlan()
    API->>AI: Check nutrition, variety
    AI-->>API: Validation results
    API->>DB: Save validation
    API-->>AD: Show warnings/suggestions

    A->>AD: Schedule publication
    AD->>API: publishMealPlan()
    API->>DB: Set Thursday 6 AM

    Note over CRON,DB: Thursday 6 AM trigger
    CRON->>DB: Activate meal plans
    CRON->>DB: Generate shopping lists
```

## Shopping List Generation with Ingredient Lookup

```mermaid
sequenceDiagram
    participant U as User
    participant W as Web App
    participant API as Edge Function
    participant DB as Database
    participant OFF as OpenFoodFacts
    participant PDF as PDF Service

    U->>W: View shopping list
    W->>API: getCurrentShoppingList()

    API->>DB: Get week's recipes
    API->>DB: Get recipe ingredients

    loop For each ingredient
        API->>DB: Check local ingredients table
        alt Not found locally
            API->>OFF: Search ingredient
            OFF-->>API: Nutrition data
            API->>DB: Cache ingredient
        end
    end

    API->>API: Aggregate quantities
    API->>API: Apply custom categories
    API-->>W: Categorized shopping list
    W-->>U: Display list

    alt Export PDF
        U->>W: Export as PDF
        W->>API: exportPDF()
        API->>PDF: Generate PDF
        PDF-->>API: PDF URL
        API-->>W: Download link
        W-->>U: Download PDF
    end
```
