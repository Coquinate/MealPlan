# Unified Project Structure

```
coquinate/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── ci.yaml            # Test and lint on PR
│       └── deploy.yaml        # Deploy to Vercel/Supabase
├── apps/                       # Application packages
│   ├── web/                    # User-facing React app
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   │   ├── ui/        # shadcn/ui base
│   │   │   │   ├── features/  # Feature components
│   │   │   │   └── layout/    # Layout components
│   │   │   ├── pages/          # Page components/routes
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── services/       # API client services
│   │   │   ├── stores/         # Zustand state stores
│   │   │   ├── styles/         # Global styles/themes
│   │   │   └── utils/          # Frontend utilities
│   │   ├── public/             # Static assets
│   │   │   ├── manifest.json   # PWA manifest
│   │   │   └── icons/         # App icons
│   │   ├── tests/              # Frontend tests
│   │   └── package.json
│   └── admin/                  # Admin dashboard
│       ├── src/
│       │   ├── components/     # Admin UI components
│       │   ├── pages/          # Admin routes
│       │   ├── features/       # Admin features
│       │   │   ├── recipes/    # Recipe management
│       │   │   ├── meal-plans/ # Meal plan builder
│       │   │   └── analytics/  # Analytics views
│       │   └── utils/
│       └── package.json
├── packages/                   # Shared packages
│   ├── shared/                 # Shared types/utilities
│   │   ├── src/
│   │   │   ├── types/          # TypeScript interfaces
│   │   │   │   ├── database.types.ts  # Supabase generated
│   │   │   │   ├── api.types.ts       # API types
│   │   │   │   └── domain.types.ts    # Business types
│   │   │   ├── constants/      # Shared constants
│   │   │   ├── schemas/        # Zod schemas
│   │   │   └── utils/          # Shared utilities
│   │   └── package.json
│   ├── ui/                     # Shared UI components
│   │   ├── src/
│   │   │   └── components/     # Reusable components
│   │   └── package.json
│   ├── database/               # Database utilities
│   │   ├── src/
│   │   │   └── repositories/   # Data access layer
│   │   └── package.json
│   └── config/                 # Shared configuration
│       ├── eslint/            # ESLint config
│       ├── typescript/        # TypeScript config
│       └── tailwind/          # Tailwind config
├── supabase/                   # Supabase project
│   ├── functions/              # Edge Functions
│   │   ├── _shared/           # Shared function code
│   │   ├── auth/              # Auth endpoints
│   │   ├── meal-plans/        # Meal plan endpoints
│   │   ├── recipes/           # Recipe endpoints
│   │   ├── shopping/          # Shopping endpoints
│   │   ├── admin/             # Admin endpoints
│   │   └── scheduled/         # Cron jobs
│   ├── migrations/            # Database migrations
│   │   ├── 00001_initial.sql
│   │   ├── 00002_add_trial_system.sql
│   │   └── 00003_add_admin_tables.sql
│   └── seed.sql              # Seed data
├── scripts/                    # Build/deploy scripts
│   ├── generate-types.ts      # Type generation
│   └── deploy.sh             # Deployment script
├── docs/                       # Documentation
│   ├── prd.md                # Product requirements
│   ├── front-end-spec.md     # Frontend specification
│   └── architecture.md       # This document
├── .env.example                # Environment template
├── package.json                # Root package.json
├── pnpm-workspace.yaml        # pnpm workspace config
├── turbo.json                 # Turborepo config (if used)
└── README.md                  # Project readme
```
