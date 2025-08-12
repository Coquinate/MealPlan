# Admin Data Models

All admin-specific data models are automatically generated from the database schema using Supabase's type generation. See the "TypeScript Type Generation from Database" section for the automated pipeline that creates these types.

The admin tables in the database (admin_users, validation_queue, admin_meal_plans, admin_recipes, admin_metrics) are the single source of truth. TypeScript types are generated automatically via:

```bash
npx supabase gen types typescript --project-id [project-id] > packages/shared/types/database.types.ts
```

This ensures type safety without manual duplication or drift between database and application code.
