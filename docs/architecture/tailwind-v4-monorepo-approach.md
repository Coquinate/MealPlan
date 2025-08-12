# Tailwind v4 Monorepo Approach

## Why We Use JS-Based Configuration Instead of CSS @theme

Our monorepo uses JavaScript-based Tailwind configuration in `packages/config` rather than the new v4 CSS-first `@theme` directive. This is intentional:

1. **Programmatic Access**: Design tokens are exportable as JS modules, allowing utilities like `romanianUtils` to format dates/currency using the same tokens
2. **Type Safety**: TypeScript can import and type-check our design tokens
3. **Package Architecture**: Config packages provide tokens to apps; apps import Tailwind CSS directly to avoid double-processing
4. **DRY Principle**: Define once in JS, use in both CSS (via Tailwind config) and JS (via imports)

Apps import Tailwind in their own `globals.css` and consume our tokens via `@coquinate/config/tailwind`. This separation ensures build performance and maximum flexibility in a monorepo context.
