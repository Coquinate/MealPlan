# Structura Detaliată a Codebase-ului

## Apps

### /apps/web
- **Framework**: Next.js 15 cu App Router
- **Purpose**: Aplicația principală pentru utilizatori
- **Key Features**:
  - Server Components și streaming SSR
  - AI-powered meal planning
  - Stripe integration pentru plăți
  - Supabase auth și database
- **Scripts**: dev, build, test, lint

### /apps/admin
- **Framework**: React cu Vite
- **Purpose**: Dashboard pentru managementul conținutului
- **Key Features**:
  - Managementul rețetelor și ingredientelor
  - Moderare conținut utilizator
  - Analytics și rapoarte
- **Router**: react-router-dom v7

## Packages

### /packages/shared
- **Purpose**: Cod partajat între aplicații
- **Conține**:
  - TypeScript types și interfaces
  - Utilități comune (cn, formatters)
  - AI service abstractions
  - Zustand store definitions
  - Cache utilities cu lz-string

### /packages/ui
- **Purpose**: Bibliotecă de componente React
- **Development**: Storybook-driven
- **Conține**:
  - Componente React reutilizabile
  - Design tokens Tailwind
  - Stories pentru documentație
  - MSW mocks pentru development
- **Icons**: @tabler/icons-react, @phosphor-icons/react

### /packages/i18n
- **Purpose**: Internaționale și localizare
- **Conține**:
  - Configurare i18next
  - Traduceri română/engleză
  - Formatters pentru date/numere
  - Scripts pentru detectarea keys lipsă
  - Hot-reload pentru development

### /packages/config
- **Purpose**: Configurări partajate
- **Conține**:
  - ESLint config (flat config v9)
  - TypeScript base config
  - Tailwind design tokens
  - Romanian-specific utilities

### /packages/database
- **Purpose**: Utilități database (planificat)
- **Va conține**:
  - Supabase client wrappers
  - Type generators
  - Migration helpers

## Directoare Suport

### /docs
- **architecture/**: Diagrame și documentație tehnică
  - core-workflows.md
  - database-schema.md
  - frontend-architecture.md
  - error-handling.md
  - ai-implementation-architecture.md
- **front-end-spec/**: Specificații UI/UX
  - UNIFIED-DESIGN-SYSTEM.md
  - COMPONENT-TECHNICAL-REFERENCE.md
  - STORYBOOK-PRACTICAL-SETUP.md
- **prd/**: Product Requirements Documents
- **testing/**: Strategii și ghiduri de testare

### /supabase
- **functions/**: Edge Functions (Deno runtime)
- **migrations/**: SQL migrations pentru schema
- **seed.sql**: Date inițiale pentru development

### /.taskmaster
- **Purpose**: Task Master AI integration
- **tasks/**: Task files și tasks.json
- **docs/**: PRD și documentație
- **config.json**: Configurare AI models
- **CLAUDE.md**: Instrucțiuni pentru Claude Code

## Fișiere Config Root
- **pnpm-workspace.yaml**: Definește workspace-urile monorepo
- **tsconfig.json**: TypeScript config de bază cu paths
- **eslint.config.js**: ESLint flat config
- **.prettierrc**: Formatare cod
- **vercel.json**: Deployment config
- **commitlint.config.js**: Conventional commits

## Patterns de Import
```typescript
// Workspace packages
import { Button } from '@coquinate/ui';
import { aiService } from '@coquinate/shared';
import { useTranslation } from '@coquinate/i18n';

// Path aliases (în apps)
import { Component } from '@/components/Component';
import { util } from '@/utils/util';
```

## Environment Variables Critice
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- GEMINI_API_KEY
- STRIPE_SECRET_KEY
- RESEND_API_KEY

## Note Importante
- Folosește pnpm workspaces pentru dependencies
- Toate componentele noi în @coquinate/ui cu Stories
- Database queries prin Supabase client, nu ORM
- AI calls prin @ai-sdk/google, nu direct API