# Testing Strategy

## Testing Approach

**Focus:** Admin dashboard functionality (90%+ coverage as per requirements)  
**Philosophy:** One developer with AI - test critical paths only, leverage TypeScript for compile-time safety

## Test Organization

```
apps/web/tests/
└── admin/           # Admin dashboard tests (90% coverage target)
    ├── recipe-management.test.tsx
    ├── meal-plan-creation.test.tsx
    ├── validation-queue.test.tsx
    └── analytics-view.test.tsx

supabase/functions/tests/
└── admin/           # Admin API endpoint tests
    ├── recipe-crud.test.ts
    └── plan-publishing.test.ts
```

## What We Test

### Admin Dashboard Testing (Priority - 90% Coverage)

Admin functionality receives comprehensive test coverage due to high impact on all users. Tests validate form validation, bilingual content handling, and critical workflows.

### User Features (Manual Testing During Development)

- Registration flow - test manually with real email
- Meal plan viewing - visual verification during development
- Shopping list generation - verify with actual recipes

## Running Tests

```bash

```
