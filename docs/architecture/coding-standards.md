# Coding Standards

## Critical Fullstack Rules

- **Type Sharing:** Always define types in packages/shared and import from there
- **API Calls:** Never make direct HTTP calls - use the tRPC service layer
- **Environment Variables:** Access only through config objects, never process.env directly
- **Error Handling:** All API routes must use the standard error handler
- **State Updates:** Never mutate state directly - use proper Zustand actions
- **Database Access:** Use repository pattern, never raw SQL in components
- **Auth Checks:** Always verify JWT in Edge Functions, use RLS in database
- **Validation:** Zod schemas for all API inputs and outputs
- **No Hardcoded Text:** Use the I18n system, romanian only
- **Create JSDoc:** for vital functions
- NO ANY TYPES

## Performance Standards for React 19

- **Lazy Loading:** Use React.lazy() for route-based code splitting
- **Suspense Boundaries:** Proper loading states for async operations
- **Key Props:** Stable keys for dynamic lists (meal plans, recipes)
- **State Colocation:** Keep state close to where it's used
- **tRPC Caching:** Leverage tRPC's built-in query caching
- **Bundle Size:** Monitor bundle size, especially for PWA
- **Image Optimization:** Use Vercel Image for recipe photos
- **Database Queries:** Avoid N+1 queries in Supabase calls
- **Edge Function Performance:** Keep cold starts minimal

## Tailwind CSS v4 Standards

- **Design Tokens Only:** Never use arbitrary values or inline styles
- **Token System:** Use predefined design tokens from tailwind.config.js
- **No Random Classes:** Avoid one-off utility combinations
- **Semantic Naming:** Use component-based classes over utility soup
- **Custom Properties:** Define CSS custom properties for dynamic values
- **Theme Consistency:** All colors, spacing, typography from design system

## Naming Conventions

| Element         | Frontend             | Backend     | Example             |
| --------------- | -------------------- | ----------- | ------------------- |
| Components      | PascalCase           | -           | `UserProfile.tsx`   |
| Hooks           | camelCase with 'use' | -           | `useAuth.ts`        |
| API Routes      | -                    | kebab-case  | `/api/user-profile` |
| Database Tables | -                    | snake_case  | `user_profiles`     |
| Type Interfaces | PascalCase           | PascalCase  | `MealPlan`          |
| Constants       | UPPER_SNAKE          | UPPER_SNAKE | `MAX_RETRIES`       |
| File Names      | kebab-case           | kebab-case  | `meal-card.tsx`     |
