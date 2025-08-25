# Repository Guidelines

## Project Structure & Module Organization
- `apps/web`: Next.js app (App Router in `src/app`, API routes in `src/pages/api`).
- `apps/admin`: Vite + React admin UI (`src/*`, Tailwind configured).
- `packages/ui`, `packages/i18n`, `packages/shared`, `packages/config`: Reusable UI, i18n utilities, shared stores/utils, and tooling configs.
- `supabase`: Local database setup, migrations (`supabase/migrations/*`), and Edge Functions (`supabase/functions/*`).
- `scripts`: One-off maintenance/build helpers.
- `tests`, `e2e`: Unit/integration specs and Playwright E2E suites.

## Build, Test, and Development Commands
- Root dev: `pnpm dev` (runs web and admin in parallel).
- App dev: `pnpm -F @coquinate/web dev`, `pnpm -F @coquinate/admin dev`.
- Build: `pnpm build` (web), or per-app `pnpm -F <pkg> build`.
- Lint/format: `pnpm lint`, `pnpm format` (Prettier + ESLint across workspaces).
- Unit tests: `pnpm test` (per app: `pnpm -F @coquinate/web test`, `pnpm -F @coquinate/admin test`).
- Coverage: `pnpm -F @coquinate/web test:coverage`.
- E2E: `pnpm -F @coquinate/web test:e2e` (Playwright auto-starts web at :3000 and admin at :3001 per `playwright.config.ts`).
- Design tokens: `pnpm validate:tokens`.

## Coding Style & Naming Conventions
- Language: TypeScript, 2-space indentation; Prettier enforced (see `.prettierrc`).
- Linting: ESLint with TypeScript + React rules; fix warnings where feasible.
- React: Export components in PascalCase. Use local conventions for filenames (Next pages lower-case; UI components commonly kebab-case).
- CSS: Tailwind v4; prefer tokens/utilities from `@coquinate/config` over arbitrary values.

## Testing Guidelines
- Frameworks: Vitest for unit tests; Playwright for E2E.
- Locations: Co-locate unit tests or use `tests/` and `e2e/` (see existing patterns).
- Naming: `*.spec.ts(x)` or `*.test.ts(x)`.
- Expectations: Add meaningful tests for new logic; keep E2E deterministic (set `baseURL` via config when needed).

## Commit & Pull Request Guidelines
- Commits: Conventional Commits enforced via Commitlint (e.g., `feat: add recipe filters`, `fix(admin): correct 2FA flow`).
- PRs: Include clear description, linked issues, test plan, and screenshots for UI changes. Ensure `pnpm lint`, `pnpm test`, and (when affected) `pnpm -F @coquinate/web test:e2e` pass locally.
- Branches: Prefer short, scoped names like `feat/…`, `fix/…`, `chore/…`.

## Security & Configuration Tips
- Secrets: Never commit `.env*`; use `.env.local`. Rotate keys if exposed.
- Supabase: Keep migrations atomic and reversible under `supabase/migrations/*`; review Edge Functions in `supabase/functions/*` for least-privilege access.
