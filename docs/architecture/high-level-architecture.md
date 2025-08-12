# High Level Architecture

## Technical Summary

Coquinate is a serverless-first, event-driven architecture deployed on Vercel with Supabase as the backend platform. The frontend uses React 19 (stable) with TypeScript in a Vite-powered monorepo, while the backend leverages Supabase Edge Functions (Deno runtime) with PostgreSQL. The platform connects frontend and backend through tRPC over HTTP for type-safe API calls, with standard auto-save functionality. Infrastructure is managed through Vercel and Supabase platforms, achieving the PRD's goal of minimal DevOps overhead while maintaining scalability for the Romanian market's 4.8M potential users.

## Platform and Infrastructure Choice

**Platform:** Vercel + Supabase Hybrid Architecture
**Key Services:**

- Vercel: Static hosting, Image Optimization, Edge Network, Analytics
- Supabase: PostgreSQL, Auth, Storage, Edge Functions, Vector embeddings
  **Deployment Host and Regions:**
- Vercel: Global Edge Network (closest edge to Romania: Frankfurt)
- Supabase: EU-Central (Frankfurt) for GDPR compliance and low latency

## Repository Structure

**Structure:** Monorepo with pnpm workspaces
**Monorepo Tool:** pnpm workspaces (built-in, no Nx/Turborepo overhead)
**Package Organization:**

- Apps isolation (web, admin, edge-functions)
- Shared packages for types, UI, database schemas
- Clear dependency boundaries with workspace protocol

## High Level Architecture Diagram

```mermaid
graph TB
    subgraph "Users"
        U[Romanian Families<br/>Mobile/Desktop]
        A[Admin Operator<br/>Desktop Only]
    end

    subgraph "CDN & Edge"
        CF[Vercel Edge Network<br/>Frankfurt Region]
        IMG[Vercel Image<br/>Optimization]
    end

    subgraph "Frontend Apps"
        WEB[React 19 Web App<br/>PWA-ready]
        ADMIN[React 19 Admin<br/>Dashboard]
    end

    subgraph "API Layer"
        TRPC[tRPC Router<br/>Edge Functions]
        SA[Standard Auto-Save<br/>HTTP API]
    end

    subgraph "Supabase Platform"
        AUTH[Supabase Auth<br/>JWT + RLS]
        DB[(PostgreSQL<br/>RLS Enabled)]
        STORE[Supabase Storage<br/>Recipe Images]
        EDGE[Edge Functions<br/>Deno Runtime]
        CRON[pg_cron<br/>Scheduled Tasks]
    end

    subgraph "External Services"
        STRIPE[Stripe<br/>Payments]
        GEMINI[Gemini AI<br/>2.0 Flash]
        REDIS[Upstash Redis<br/>Cache]
        EMAIL[Resend<br/>Emails]
    end

    U -->|HTTPS| CF
    A -->|HTTPS + 2FA| CF
    CF --> WEB
    CF --> ADMIN
    CF --> IMG

    WEB -->|tRPC/HTTP| TRPC
    ADMIN -->|tRPC/HTTP| TRPC
    WEB -->|WebSocket| WS

    TRPC --> EDGE
    EDGE --> AUTH
    EDGE --> DB
    EDGE --> STORE

    EDGE -->|API| STRIPE
    EDGE -->|API| GEMINI
    EDGE -->|API| REDIS
    EDGE -->|API| EMAIL

    CRON -->|Thursday 6AM| DB
    WS --> DB

    style WEB fill:#e1f5fe
    style ADMIN fill:#fff3e0
    style DB fill:#e8f5e9
    style EDGE fill:#f3e5f5
```

## Architectural Patterns

- **Jamstack Architecture:** Static generation with dynamic API routes - _Rationale:_ Optimal performance and SEO for marketing pages while maintaining dynamic functionality
- **Edge-First Compute:** Deno Edge Functions for API logic - _Rationale:_ Lower latency for Romanian users, automatic scaling, no cold starts
- **Component-Based UI:** React 19 with Server Components where beneficial - _Rationale:_ Better performance with streaming SSR, reduced bundle size
- **API Gateway Pattern:** tRPC as single entry point for all API calls - _Rationale:_ Type safety across stack, automatic client generation
- **Standard Auto-Save:** Local draft storage with periodic saves - _Rationale:_ FR16 explicitly prohibits real-time collaboration
- **Offline-First PWA:** Service Worker with cache-first strategy - _Rationale:_ Handle Romanian mobile network inconsistencies

## Technical Reality Check (August 2025)

- **React 19:** Now stable and production-ready with full ecosystem support
- **Tailwind v4:** Stable release with native CSS variables, full shadcn/ui compatibility
- **Database Access:** Pure Supabase with native TypeScript types - no ORM needed
- **Deno Edge Functions:** Mature and stable, excellent performance
- **tRPC:** v11 with improved Edge runtime support
