# Components

## User-Facing Web Application

**Responsibility:** Main React 19 PWA for Romanian families to access meal plans, recipes, and shopping lists.

**Key Interfaces:**

- tRPC client for type-safe API calls
- Standard auto-save with 60-second intervals (FR16)
- Service Worker for offline support
- Zustand stores for state management

**Dependencies:** tRPC router, Supabase client, Stripe checkout

**Technology Stack:** React 19.1.0, TypeScript 5.9, Vite 7.0, Tailwind 4.1, shadcn/ui, PWA manifest

## Admin Dashboard

**Responsibility:** Mission-critical admin interface for single operator to manage recipes, create meal plans, and monitor analytics.

**Key Interfaces:**

- Admin-specific tRPC endpoints
- Real-time validation feedback via WebSockets
- Auto-save functionality (every 60s server, 10s local)
- AI integration for recipe/plan generation

**Dependencies:** Admin auth service, AI validation service, publishing scheduler

**Technology Stack:** React 19.1.0, TypeScript 5.9, TanStack Table 8.x, Recharts for analytics

## Edge Functions API

**Responsibility:** Serverless backend running on Supabase Edge Functions (Deno runtime) handling all business logic.

**Key Interfaces:**

- tRPC routers for all API endpoints
- Supabase client for database access
- External API integrations (Stripe, Gemini, Resend)
- Scheduled jobs via pg_cron

**Dependencies:** PostgreSQL database, Redis cache, external services

**Technology Stack:** Deno 2.1+, TypeScript 5.9, tRPC 11.4.3, Supabase JS 2.54

## Database Layer

**Responsibility:** PostgreSQL database with Row Level Security managing all application data.

**Key Interfaces:**

- Direct SQL access from Edge Functions
- RLS policies for multi-tenant isolation
- HTTP-based auto-save API calls
- pg_cron for scheduled tasks

**Dependencies:** None (foundational layer)

**Technology Stack:** PostgreSQL 15.x, Supabase platform, RLS policies

## Caching Layer

**Responsibility:** Upstash Redis for Vercel AI SDK response caching only (as per PRD).

**Key Interfaces:**

- Edge-compatible Redis client
- TTL-based cache invalidation
- Session storage for auth

**Dependencies:** Edge Functions

**Technology Stack:** Upstash Redis (serverless)

## File Storage

**Responsibility:** Supabase Storage for recipe images and PDF exports.

**Key Interfaces:**

- Authenticated upload/download URLs
- Image transformation API
- CDN distribution

**Dependencies:** Auth service for access control

**Technology Stack:** Supabase Storage with built-in CDN

## Component Relationship Diagrams

The following diagrams illustrate the relationships and data flow between major system components:

### High-Level Component Dependencies

```mermaid
graph TB
    subgraph "Frontend Layer"
        WEB[User Web App<br/>React 19 PWA]
        ADMIN[Admin Dashboard<br/>React 19 SPA]
    end

    subgraph "API Layer"
        API[Edge Functions<br/>tRPC + Deno 2.1]
        WS[Supabase Realtime<br/>WebSocket Server]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL<br/>Supabase + RLS)]
        CACHE[(Redis Cache<br/>Upstash)]
        STORAGE[File Storage<br/>Supabase Storage]
    end

    subgraph "External Services"
        STRIPE[Stripe Payments]
        GEMINI[Gemini AI]
        EMAIL[Resend Email]
        FOOD[OpenFoodFacts]
    end

    %% Frontend to API connections
    WEB -->|tRPC HTTP| API
    WEB -->|WebSocket| WS
    ADMIN -->|tRPC HTTP| API
    ADMIN -->|WebSocket| WS

    %% API to Data connections
    API --> DB
    API --> CACHE
    API --> STORAGE
    WS --> DB

    %% API to External Services
    API --> STRIPE
    API --> GEMINI
    API --> EMAIL
    API --> FOOD

    %% Styling
    style WEB fill:#e1f5fe
    style ADMIN fill:#fff3e0
    style API fill:#f3e5f5
    style DB fill:#e8f5e9
    style CACHE fill:#fce4ec
    style STORAGE fill:#f1f8e9
```

### Component Communication Patterns

```mermaid
sequenceDiagram
    participant U as User Web App
    participant A as Admin Dashboard
    participant API as Edge Functions
    participant DB as PostgreSQL
    participant RT as Realtime
    participant EXT as External APIs

    Note over U,EXT: Component Interaction Flow

    %% User Web App Flow
    U->>API: tRPC Query (getCurrentMealPlan)
    API->>DB: SQL Query with RLS
    DB-->>API: User's meal plan data
    API-->>U: Type-safe response

    %% Admin Dashboard Flow
    A->>API: tRPC Mutation (createRecipe)
    API->>EXT: AI validation (Gemini)
    EXT-->>API: Validation results
    API->>DB: Insert recipe with validation
    DB-->>RT: Trigger real-time update
    RT-->>A: Live update notification

    %% Real-time Updates
    RT-->>U: Meal plan published notification
    RT-->>A: Recipe validation complete

    Note over U,EXT: All communication is type-safe via tRPC
```

### Data Flow Architecture

```mermaid
flowchart LR
    subgraph "User Experience"
        TRIAL[Trial Users]
        PAID[Paid Users]
    end

    subgraph "Content Creation"
        RECIPES[Recipe Database]
        PLANS[Meal Plans]
        TRIALS[Trial Menus]
    end

    subgraph "Business Logic"
        SHOPPING[Shopping Lists]
        FEEDBACK[User Feedback]
        ANALYTICS[Admin Analytics]
    end

    subgraph "External Data"
        NUTRITION[OpenFoodFacts]
        PAYMENTS[Stripe]
        AI[Gemini AI]
    end

    %% User flows
    TRIAL --> TRIALS
    PAID --> PLANS

    %% Content flows
    RECIPES --> PLANS
    RECIPES --> TRIALS
    RECIPES --> SHOPPING

    %% Data flows
    PLANS --> SHOPPING
    PAID --> FEEDBACK
    FEEDBACK --> ANALYTICS

    %% External integrations
    NUTRITION --> RECIPES
    PAYMENTS --> PAID
    AI --> RECIPES
    AI --> PLANS

    %% Styling for clarity
    style TRIAL fill:#fff3e0
    style PAID fill:#e8f5e9
    style RECIPES fill:#e1f5fe
    style PLANS fill:#f3e5f5
    style SHOPPING fill:#fce4ec
```

### Component Scaling Strategy

```mermaid
graph TB
    subgraph "Scaling Boundaries"
        subgraph "Stateless Scaling"
            EDGE1[Edge Function 1]
            EDGE2[Edge Function 2]
            EDGE3[Edge Function N]
        end

        subgraph "Managed Scaling"
            DB_PRIMARY[(Primary DB)]
            DB_REPLICA[(Read Replicas)]
            REDIS_CLUSTER[(Redis Cluster)]
        end

        subgraph "CDN Scaling"
            CDN[Vercel Edge Network]
            STORAGE_CDN[Supabase CDN]
        end
    end

    subgraph "Auto-Scaling Services"
        SUPABASE[Supabase Platform]
        VERCEL[Vercel Platform]
        UPSTASH[Upstash Redis]
    end

    %% Edge functions scale automatically
    EDGE1 -.-> DB_PRIMARY
    EDGE2 -.-> DB_REPLICA
    EDGE3 -.-> REDIS_CLUSTER

    %% CDN scaling
    CDN --> STORAGE_CDN

    %% Platform scaling
    SUPABASE --> DB_PRIMARY
    VERCEL --> EDGE1
    UPSTASH --> REDIS_CLUSTER

    style EDGE1 fill:#f3e5f5
    style EDGE2 fill:#f3e5f5
    style EDGE3 fill:#f3e5f5
```

These diagrams illustrate the key architectural decisions:

1. **Clean Separation**: Frontend, API, and Data layers are clearly separated
2. **Type Safety**: tRPC ensures type safety across all component boundaries
3. **Standard Auto-Save**: HTTP-based periodic saves per FR16 requirement
4. **Auto-Scaling**: Serverless components scale automatically
5. **External Integration**: Clean interfaces to third-party services
