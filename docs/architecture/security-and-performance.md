# Security and Performance

## Security - Keep It Simple

**What We Use:**

- Supabase Auth handles authentication securely
- HTTPS everywhere (Vercel + Supabase default)
- Environment variables for secrets
- Zod validation for all API inputs

**What We Don't Need:**

- Complex CSP headers (Vercel defaults are fine)
- Custom rate limiting (Supabase handles this)
- Complex session management (Supabase Auth built-in)

## Performance Requirements

**From PRD:**

- API responses < 500ms
- Lazy load images

**Simple Optimizations:**

- Database indexes on foreign keys (created in DDL)
- React lazy loading for route code splitting
- Vercel Image Optimization (built-in)

**What We Don't Need:**

- Complex caching strategies
- Bundle size micro-optimization
- Service workers (PWA requirement handled by Vite PWA plugin)
