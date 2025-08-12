# Source Tree

## Project Structure

```
MealPlan/
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
│   │   └── tests/              # Frontend tests
│   └── admin/                  # Admin dashboard
│       └── src/
│           ├── components/     # Admin UI components
│           ├── pages/          # Admin routes
│           └── features/       # Admin features
├── packages/                   # Shared packages
│   ├── shared/                 # Shared types/utilities
│   │   └── src/
│   │       ├── types/          # TypeScript interfaces
│   │       ├── constants/      # Shared constants
│   │       ├── schemas/        # Zod schemas
│   │       └── utils/          # Shared utilities
│   ├── ui/                     # Shared UI components
│   ├── database/               # Database utilities
│   │   └── src/
│   │       └── repositories/   # Data access layer
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
│   └── migrations/            # Database migrations
├── scripts/                    # Build/deploy scripts
├── docs/                       # Documentation
│   ├── prd/                   # PRD shards
│   ├── architecture/          # Architecture docs
│   └── stories/               # User stories
├── .bmad-core/                # BMad agent system
├── .taskmaster/               # Task Master system
└── .github/                   # CI/CD workflows
```

## Key Directories

- **apps/web**: Main React application for users
- **apps/admin**: Admin dashboard for recipe and meal plan management
- **packages/shared**: Shared types, schemas, and utilities between frontend/backend
- **packages/database**: Repository pattern for database access
- **supabase/functions**: Edge Functions for API endpoints
- **supabase/migrations**: Database schema migrations
