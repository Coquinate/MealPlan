# Technical Assumptions

## Repository Structure

**Monorepo** - Single repository with pnpm workspaces containing apps (web, admin) and packages (ui, database, i18n, theme). Clear separation of concerns, shared dependencies, single deployment pipeline.

## Service Architecture

**Serverless within Monorepo** - Supabase for backend (PostgreSQL + Auth + Edge Functions), Vercel for hosting. No microservices complexity, scales automatically, minimal DevOps overhead. All business logic in Edge Functions, no custom backend server.

## Testing Requirements

**Critical Paths + Comprehensive Admin Testing** - Vitest for unit tests focusing on business logic. Comprehensive testing suite for admin dashboard (meal plan generation, validation, publishing). Integration tests for payment flows. Manual testing for user-facing features initially. Admin dashboard must have 90%+ test coverage - if admin fails, service fails.

## AI Integration Strategy

**Vercel AI SDK with Gemini** - Use Vercel AI SDK (free, open-source) for all LLM interactions. Gemini 2.0/2.5 Flash as primary model (free tier). Focus on SDK's stable features only - streaming chat UI, error handling, conversation management. Skip experimental RSC streaming components, multi-provider setups, and complex tool calling to maintain KISS principle.

**What We Use from Vercel AI SDK:**

- `useChat` hook for streaming chat UI (stable, production-ready)
- `streamText` for server-side streaming responses
- Built-in error handling and retry logic
- Conversation history management
- Simple Gemini provider setup (@ai-sdk/google)
- Caching middleware with Upstash Redis (reduces API costs by ~70%)

**What We Skip (Too Complex/Experimental):**

1. **RSC Streaming Components (streamUI)**
   - _What it is:_ Lets AI generate actual React components and stream them to the client in real-time
   - _Use case:_ AI creating interactive widgets like calendars, charts, or forms on the fly
   - _Example:_ User asks "show me a chart of calories" → AI generates a Chart component
   - _Why we skip:_ Still experimental, requires App Router RSC setup, adds complexity for minimal benefit. Our cooking assistant just needs text responses, not dynamic UI generation

2. **Multi-Provider Setup**
   - _What it is:_ Configure multiple AI providers (OpenAI, Claude, Mistral) with automatic fallback
   - _Use case:_ High-availability apps that switch providers if one fails or is rate-limited
   - _Example:_ Try Gemini → if down, try OpenAI → if down, try Claude
   - _Why we skip:_ Gemini's free tier is generous (1500 requests/day), we don't need redundancy for MVP, adds API key management complexity

3. **Complex Tool Calling (tools parameter)**
   - _What it is:_ AI can call predefined functions in your code and use their results
   - _Use case:_ AI booking appointments, checking inventory, or modifying databases
   - _Example:_ "Add eggs to my shopping list" → AI calls addToShoppingList() function
   - _Why we skip:_ Security risk if not properly sandboxed, our cooking assistant should only advise not modify data, adds significant testing complexity

4. **generateObject/streamObject**
   - _What it is:_ Forces AI to respond with structured JSON matching a schema
   - _Use case:_ Extracting structured data like forms, generating API responses
   - _Example:_ "Extract ingredients" → `{ingredients: [{name: "tomato", amount: "2", unit: "pieces"}]}`
   - _Why we skip:_ We already have structured recipe data, chat responses are better as natural text, adds schema validation overhead

5. **Agents & ReAct Patterns**
   - _What it is:_ AI that reasons through multiple steps, potentially calling tools at each step
   - _Use case:_ Complex research tasks, multi-step workflows, autonomous task completion
   - _Example:_ "Plan a dinner party" → AI researches recipes → checks inventory → creates shopping list → books delivery
   - _Why we skip:_ Our cooking assistant has a simple bounded context (one recipe), multi-step reasoning is overkill, harder to control and predict behavior

6. **Embedding & RAG (Retrieval)**
   - _What it is:_ Convert text to vectors for semantic search, retrieve relevant context before answering
   - _Use case:_ Searching large document sets, finding similar recipes, contextual help systems
   - _Example:_ "Find recipes similar to this one" using vector similarity
   - _Why we skip:_ Our recipe set is small and curated, full-text search is sufficient, adds vector database requirement

7. **Custom Model Middleware**
   - _What it is:_ Intercept and modify AI requests/responses with custom logic
   - _Use case:_ Adding custom headers, logging, response filtering, token counting
   - _Example:_ Automatically adding user context to every request
   - _Why we skip:_ Simple system prompt is enough for recipe bounding, middleware adds debugging complexity

8. **Experimental Models (o1, computer-use)**
   - _What it is:_ Cutting-edge models with special capabilities like deep reasoning or screen control
   - _Use case:_ Complex reasoning tasks, automated testing, visual analysis
   - _Example:_ o1 for mathematical proofs, computer-use for automated UI testing
   - _Why we skip:_ Expensive, our cooking questions are simple, Gemini Flash is perfect for our needs

**Caching Strategy (3-Layer Approach):**

1. **Browser Cache (localStorage)** - 7-day TTL for recipe Q&A, handles ~60% of requests, zero cost
2. **Edge Cache (Upstash Redis)** - 24-hour TTL, shared across users, 500K free operations/month
3. **Pre-computed Responses** - Hardcoded answers for top 20 questions ("too salty", "burning", etc.)

This phased approach starts simple (just localStorage) and adds layers as usage grows, potentially reducing API costs by 70-80% while keeping response times under 100ms for cached hits.

## Additional Technical Assumptions and Requests

**Frontend Stack:**

- React 19 with TypeScript (strict mode, ESModules)
- Vite for build tooling (ESM-only, lightning fast HMR)
- Tailwind v4 with native CSS variables theming
- shadcn/ui as component base + selective Magic UI animations
- i18next (Romanian only, structure ready for English)
- Zustand for state management (simpler than Redux)
- Prettier + ESLint with existing plugins
- PWA setup optional (manifest + service worker)

**Tailwind v4 Theming Strategy:**

```javascript
// tailwind.config.js - Semantic tokens ONLY
{
  theme: {
    colors: {
      // ONLY semantic colors allowed
      primary: 'oklch(var(--color-primary) / <alpha-value>)',
      secondary: 'oklch(var(--color-secondary) / <alpha-value>)',
      surface: 'oklch(var(--color-surface) / <alpha-value>)',
      background: 'oklch(var(--color-background) / <alpha-value>)',
      text: 'oklch(var(--color-text) / <alpha-value>)',
      error: 'oklch(var(--color-error) / <alpha-value>)',
      success: 'oklch(var(--color-success) / <alpha-value>)',
      warning: 'oklch(var(--color-warning) / <alpha-value>)',
      // NO Tailwind defaults - forces semantic usage
    },
    // Custom semantic spacing
    spacing: {
      'section': 'var(--spacing-section)',
      'card': 'var(--spacing-card)',
      // Keep numeric scale for flexibility
      ...defaultTheme.spacing
    }
  }
}

// app.css - CSS variables (easy to change themes)
@layer base {
  :root {
    --color-primary: 59.2% 0.2 250;     /* Blue */
    --color-secondary: 70% 0.15 160;    /* Green */
    --color-surface: 96% 0.01 247;      /* Light gray */
    --color-error: 54% 0.22 29;         /* Red */
    --color-success: 72% 0.19 149;      /* Green */
    --spacing-section: 2rem;
    --spacing-card: 1.5rem;
  }

  [data-theme="dark"] {
    --color-surface: 15% 0.01 247;      /* Dark gray */
    /* Other dark mode overrides */
  }
}
```

**Internationalization Strategy:**

- i18next setup with Romanian locale only
- File structure ready for English (empty en.json files)
- Database schema supports multi-language (name_ro, name_en columns)
- No hardcoded text anywhere in codebase
- Admin can stay English (internal tool)

**Backend Stack:**

- Supabase for hosting (PostgreSQL database + Auth + Storage)
- Supabase native SQL DDL for database management (schema, migrations, RLS policies)
- Supabase CLI for TypeScript type generation
- Stripe for payments (well-integrated in Romania)
- SendGrid/Resend for transactional emails
- Row Level Security (RLS) for data protection
- Edge Functions for serverless API (Supabase or Vercel)

**Testing Stack:**

- Vitest for unit testing (fast, Vite-integrated)
- Playwright for E2E critical paths
- React Testing Library for components
- Admin dashboard: comprehensive test suite required

**Code Quality Enforcement:**

```javascript
// ESLint config using existing plugins
{
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:i18next/recommended",
    "plugin:tailwindcss/recommended"
  ],
  "rules": {
    "i18next/no-literal-string": ["error", {
      "markupOnly": true,        // Only check JSX text
      "ignoreAttribute": ["className", "to", "href"]
    }],
    "tailwindcss/no-arbitrary-value": "error",  // Completely forbidden
    "tailwindcss/classnames-order": "warn",    // Consistent ordering
    "@typescript-eslint/no-magic-numbers": ["error", {
      "ignore": [0, 1, -1],      // Common safe values
      "ignoreArrayIndexes": true
    }]
  }
}
```

**Definition of Done (Every Story):**

- ✅ No ESLint errors (especially hardcoded values)
- ✅ All text through i18n keys
- ✅ All styles through design tokens
- ✅ Unit tests for logic (Vitest passing)
- ✅ TypeScript strict mode passing
- ✅ Prettier formatted
- ✅ PR approved

**Infrastructure:**

- Vercel hosting (auto-scaling, preview deployments)
- Vercel Image Optimization (included free tier)
- GitHub Actions CI/CD
- pnpm workspaces for monorepo
- Environments: development, staging, production

**Development Principles:**

- KISS for user features, rigorous for admin
- Semantic tokens over arbitrary values
- Type safety everywhere (strict TypeScript)
- Admin dashboard treated as mission-critical
- Single developer workflow (no PR reviews needed)
- ESModules everywhere (no CommonJS)
- Prettier + ESLint enforced in CI/CD

**Monorepo Structure:**

```
coquinate/
├── apps/
│   ├── web/          # User-facing PWA
│   └── admin/        # Admin dashboard (heavily tested)
├── packages/
│   ├── database/     # SQL migrations and seed data
│   ├── shared/       # Shared TypeScript types from Supabase
│   ├── ui/           # Shared components
│   ├── theme/        # Full token system
│   ├── i18n/         # Translations (RO only)
│   └── meal-engine/  # Core business logic
```

**Tailwind v4 Best Practices:**

```jsx
// ✅ CORRECT - Semantic tokens ONLY
<button className="bg-primary text-white rounded-card p-card">

// ❌ FORBIDDEN - No standard Tailwind colors
<button className="bg-gray-500 text-white rounded-lg p-4">

// ❌ FORBIDDEN - No arbitrary values
<button className="bg-[#2563EB] text-white rounded-[12px] p-[18px]">

// Component Patterns with CVA (class-variance-authority)
const buttonVariants = cva(
  "rounded-card font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        ghost: "hover:bg-surface"
      },
      size: {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
)
```

**Database Schema Strategy (Supabase Native SQL):**

```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ro VARCHAR NOT NULL,          -- Romanian name
  name_en VARCHAR,                    -- English name (nullable for now)
  steps_ro TEXT[] NOT NULL,           -- Romanian instructions
  steps_en TEXT[],                    -- English instructions (nullable)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Normalized ingredient relationship (better for shopping lists)
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id),
  quantity DECIMAL(8,2) NOT NULL,
  unit VARCHAR NOT NULL,
  notes VARCHAR
);

-- RLS policies for data isolation
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
```

**Rationale:**

- Tailwind v4's native CSS variables eliminate need for complex token packages
- Supabase owns schema/migrations with native SQL DDL and RLS policies
- Normalized ingredient relationships enable efficient shopping list generation
- ESLint plugins exist (no custom rules needed)
- shadcn/ui provides solid foundation, Magic UI adds polish selectively
