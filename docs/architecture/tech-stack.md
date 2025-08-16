# Tech Stack

## Technology Stack Table (Verified August 2025)

| Category             | Technology                | Version   | Purpose               | Rationale                                       |
| -------------------- | ------------------------- | --------- | --------------------- | ----------------------------------------------- |
| Package Manager      | pnpm                      | 10.14.0   | Dependency management | 2x faster than npm, content-addressable storage |
| Frontend Language    | TypeScript                | 5.9.x     | Type-safe development | Latest stable, no deprecated features           |
| Frontend Framework   | React                     | 19.1.0    | UI framework          | Stable with Server Components, streaming SSR    |
| Web Framework        | Next.js                   | 15.4.6    | Full-stack React      | App Router, RSC, Edge Runtime support           |
| UI Component Library | @coquinate/ui + shadcn/ui | monorepo  | Shared components     | Storybook-driven development, cross-app reuse   |
| UI Animations        | Magic UI                  | latest    | Animation components  | 150+ animated components for polish             |
| State Management     | Zustand                   | 5.0.7     | Client state          | React 19 compatible, smaller bundle             |
| Data Grid            | TanStack Table            | 8.21.3    | Table components      | Headless, powerful data handling                |
| Backend Language     | TypeScript                | 5.9.x     | Type-safe backend     | Shared types with frontend                      |
| Backend Framework    | Supabase Edge Functions   | 1.60+     | Serverless functions  | Deno 2.1 runtime, auto-scaling                  |
| API Style            | tRPC                      | 11.4.3    | Type-safe API         | Edge runtime support, RSC compatible            |
| Database             | PostgreSQL (Supabase)     | 15.x      | Primary datastore     | RLS support, managed by Supabase                |
| Database Client      | @supabase/supabase-js     | 2.54.0    | DB access             | Native TypeScript types, no ORM needed          |
| Auth Client          | @supabase/auth-js         | 2.x       | Authentication        | Part of supabase-js                             |
| Cache                | Upstash Redis             | latest    | Vercel AI SDK caching | For AI response caching only (as per PRD)       |
| File Storage         | Supabase Storage          | -         | Recipe images         | Integrated with auth, CDN included              |
| Authentication       | Supabase Auth             | -         | User management       | Social logins, magic links, RLS                 |
| i18n                 | i18next                   | 24.x      | Internationalization  | React 19 compatible                             |
| i18n React           | react-i18next             | 15.6.1    | React i18n            | Proven solution, SSR support                    |
| Frontend Testing     | Vitest                    | 3.2.x     | Unit tests            | Vite 7 compatible, fast                         |
| Backend Testing      | Deno Test                 | built-in  | Edge function tests   | Native to runtime                               |
| E2E Testing          | Playwright                | 1.54.0    | Integration tests     | Latest browsers, AI debugging                   |
| Build Tool           | Vite                      | 7.0.x     | Frontend bundler      | Rolldown coming, 5x faster                      |
| Bundler              | Rollup/Rolldown           | 4.x/beta  | Production builds     | Moving to Rolldown for speed                    |
| Linter               | ESLint                    | 9.33.x    | Code quality          | Flat config, TypeScript support                 |
| Formatter            | Prettier                  | 3.4.x     | Code formatting       | Consistent style                                |
| CI/CD                | GitHub Actions            | -         | Automation            | Native integration                              |
| Monitoring           | Vercel Analytics          | -         | Performance metrics   | Core Web Vitals                                 |
| Logging              | Supabase Logs             | -         | Application logs      | Platform integrated                             |
| CSS Framework        | Tailwind CSS              | 4.1.11    | Styling system        | Native CSS variables, stable                    |
| CSS Variants         | CVA                       | 1.0.x     | Component variants    | Type-safe styling                               |
| Class Utils          | clsx                      | 2.1.x     | Class merging         | Conditional classes                             |
| Icons Primary        | @tabler/icons-react       | 3.x       | UI icons              | 3500+ consistent icons                          |
| Icons Secondary      | @phosphor-icons/react     | 2.x       | Decorative icons      | Multiple weights                                |
| Font Primary         | Inter                     | variable  | Body text             | Excellent readability                           |
| Font Display         | Satoshi                   | variable  | Headings              | Modern, distinctive                             |
| Email Service        | Resend                    | latest    | Transactional email   | Better than SendGrid                            |
| Payments             | Stripe                    | latest    | Payment processing    | Romanian support                                |
| AI Model             | Gemini                    | 2.0 Flash | AI assistance         | Free tier, fast                                 |
| AI SDK               | @ai-sdk/google + ai       | 4.2       | AI integration        | Message parts, streaming, caching               |

## Critical Version Notes (August 2025)

**Package Manager:**

- pnpm 10.14.0 with built-in Node/Deno runtime management
- Node.js 20.x or 22.x required (18.x EOL'd April 2025)
- DO NOT use npm or yarn - monorepo optimized for pnpm

**React & UI Stack:**

- React 19.1.0 is stable (released March 2025)
- @coquinate/ui: Component library with Storybook development
- shadcn/ui use `npx shadcn@canary init` for v4/React 19 support (base primitives)
- Storybook 8.6+ with Vite builder for component development
- MSW for API mocking in stories and tests
- Zustand 5.0.7 requires React 18+ (drops use-sync-external-store)
- TanStack Table 8.x (no v9 yet) - works with React 19 but not React Compiler

**Build Tools:**

- Vite 7.0.x requires Node.js 20.19+ or 22.12+
- Vitest 3.2+ required for Vite 7 compatibility
- ESLint 9.33.x uses flat config by default (eslintrc deprecated)
- Rolldown integration coming - will replace Rollup eventually

**Supabase Stack:**

- @supabase/supabase-js 2.54.0 (no v3 yet)
- Supabase CLI for type generation: `npx supabase gen types`
- Edge Functions use Deno 2.1+ runtime
- NO Prisma - incompatible with edge runtime without paid Accelerate

**CSS & Styling:**

- Tailwind CSS 4.1.11 with native CSS variables
- CVA for component variants (replaces manual className logic)
- clsx for conditional classes
- NO arbitrary values in Tailwind (enforced by ESLint)

**Testing:**

- Playwright 1.54.0 with AI debugging features
- Vitest 3.2.x for Vite 7 compatibility
- React Testing Library with React 19 support

**AI Integration:**

- AI SDK 4.2 with message parts support (text + images)
- @ai-sdk/google package for Gemini integration (not @google/generative-ai)
- gemini-2.0-flash model (production-ready, not experimental)
- Built-in streaming and caching features
- Environment: GEMINI_MODEL=gemini-2.0-flash (update from gemini-pro)

## Known Issues & Workarounds

### Next.js 15.4.6 Minification Bug

**Issue**: Production builds fail with `_webpack.WebpackError is not a constructor`
**Status**: Temporary workaround applied in `apps/web/next.config.js`
**Workaround**: Minification disabled for production builds

```javascript
webpack: (config, { dev }) => {
  if (!dev) {
    config.optimization.minimize = false;
  }
  return config;
};
```

**Resolution Options**:

- **Production**: Downgrade to Next.js 15.4.5 (stable minification)
- **Development**: Keep workaround until Next.js 15.4.7 release
- **Current Impact**: Larger bundle size (acceptable during development)

**Critical Compatibility Matrix:**

```
React 19.1 + TypeScript 5.9 + Tailwind 4.1 + Vite 7.0 = ✅
Vitest 3.2 + Vite 7.0 = ✅
tRPC 11.4 + Edge Functions = ✅
Supabase JS 2.54 + Deno 2.1 = ✅
shadcn/ui canary + Tailwind 4 + React 19 = ✅
Zustand 5.0 + React 19 = ✅
ESLint 9.33 flat config + TypeScript 5.9 = ✅
AI SDK 4.2 + @ai-sdk/google + gemini-2.0-flash = ✅
```

**Migration Risks:**

- No Prisma migration path without major refactor
- React Compiler not supported by TanStack Table yet
- Rolldown still beta - stick with Rollup for now
- i18next major version jump may require config updates
