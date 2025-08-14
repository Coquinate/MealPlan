# Test Database Setup

## Overview

This document outlines the simple test database setup for the MealPlan testing infrastructure. We use a separate Supabase project for testing to avoid contaminating production data.

## Test Database Requirements

- **Separate Supabase Project**: Create a dedicated test project (not branches)
- **Free Tier**: Use Supabase free tier for cost efficiency
- **Schema Consistency**: Mirror production schema with test data
- **Simple Cleanup**: Basic utilities to reset test data between runs

## Setup Instructions

### 1. Create Test Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project: `mealplan-test`
3. Region: Same as production for consistency
4. Database password: Store securely

### 2. Environment Configuration

Create `.env.test` in project root:

```bash
# Test Database Configuration
NEXT_PUBLIC_SUPABASE_TEST_URL=https://your-test-project.supabase.co
NEXT_PUBLIC_SUPABASE_TEST_ANON_KEY=your-test-anon-key
SUPABASE_TEST_SERVICE_ROLE_KEY=your-test-service-key

# Test Environment Flag
NODE_ENV=test
TESTING=true
```

### 3. Schema Migration

Copy production schema to test database:

1. Export schema from production:

   ```bash
   npx supabase db dump --schema-only --file test-schema.sql
   ```

2. Apply to test project:
   ```bash
   npx supabase db reset --db-url="postgresql://postgres:[password]@db.[test-ref].supabase.co:5432/postgres"
   ```

### 4. Test Data Setup

Create seed data for consistent testing:

```sql
-- Test users
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES
  ('test-admin-id', 'admin@test.com', now(), now(), now()),
  ('test-user-id', 'user@test.com', now(), now(), now());

-- Test recipes
INSERT INTO recipes (id, title, description, user_id, status)
VALUES
  ('test-recipe-1', 'Test Romanian Recipe', 'Test description', 'test-admin-id', 'published'),
  ('test-recipe-2', 'Draft Recipe', 'Draft test', 'test-admin-id', 'draft');
```

## Test Database Utilities

### Database Connection

```typescript
// src/test/test-db.ts
import { createClient } from '@supabase/supabase-js';

export const createTestClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_TEST_URL) {
    throw new Error('Test database URL not configured');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_TEST_URL,
    process.env.SUPABASE_TEST_SERVICE_ROLE_KEY || ''
  );
};
```

### Cleanup Utilities

```typescript
// src/test/test-cleanup.ts
import { createTestClient } from './test-db';

export async function cleanupTestData() {
  const supabase = createTestClient();

  // Clear test data in dependency order
  await supabase.from('meal_plan_recipes').delete().neq('id', '');
  await supabase.from('meal_plans').delete().neq('id', '');
  await supabase.from('recipes').delete().neq('id', '');
}

export async function seedTestData() {
  const supabase = createTestClient();

  // Insert consistent test data
  const { data: recipe } = await supabase
    .from('recipes')
    .insert({
      title: 'Test Romanian Recipe',
      description: 'Test recipe for automation',
      user_id: 'test-admin-id',
      status: 'published',
    })
    .select()
    .single();

  return { testRecipe: recipe };
}
```

## CI Integration

For GitHub Actions:

```yaml
# .github/workflows/test.yml
env:
  NEXT_PUBLIC_SUPABASE_TEST_URL: ${{ secrets.SUPABASE_TEST_URL }}
  SUPABASE_TEST_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_TEST_SERVICE_KEY }}

steps:
  - name: Setup test database
    run: |
      npm run test:db:setup

  - name: Run tests
    run: |
      npm run test
      npm run test:e2e:admin
```

## Security Considerations

- **Test-only data**: Never use production data in tests
- **Isolated environment**: Test database completely separate from production
- **Key rotation**: Regularly rotate test service role keys
- **Access control**: Limit test database access to CI and development

## Cost Management

- **Free tier limits**: Monitor usage to stay within Supabase free tier
- **Cleanup automation**: Automated cleanup prevents data accumulation
- **Single project**: One test project shared across all environments

## Testing Best Practices

1. **Clean state**: Each test starts with clean, predictable data
2. **Isolation**: Tests don't depend on each other's data
3. **Realistic data**: Test data mirrors production structure
4. **Performance**: Keep test data minimal for fast test execution

## Verification

Test the setup:

```bash
# Unit tests with test database
npm run test

# E2E tests with test database
npm run test:e2e:admin

# Database connectivity test
npm run test:db:connection
```

## Maintenance

- **Weekly**: Review test database size and cleanup
- **Monthly**: Update test schema to match production changes
- **Quarterly**: Rotate access keys and review security
