# Epic 1: Foundation & Core Infrastructure

**Epic Goal:** Establish the complete technical foundation that all features will build upon, keeping it simple and practical for a solo developer.

## Story 1.1: Initialize Monorepo Structure

**As a** developer,  
**I want** a properly configured monorepo with workspace management,  
**so that** all apps and packages can share code efficiently.

**Acceptance Criteria:**

1. pnpm workspace configured with apps/ and packages/ directories
2. TypeScript configuration with strict mode and path aliases working
3. ESLint and Prettier configured with agreed rules (no hardcoded values, i18n enforcement)
4. Git hooks set up for pre-commit linting and formatting
5. Basic README with setup instructions
6. Environment variable structure defined (.env.example created)
7. Folder structure created for all planned packages

## Story 1.2: Database Schema & Supabase Setup

**As a** developer,  
**I want** the core database schema implemented with Supabase native SQL DDL,  
**so that** we have type-safe database access ready.

**Acceptance Criteria:**

1. Supabase CLI installed and configured for migrations and type generation
2. Core tables created: users, recipes, meal_plans, subscriptions, meal_plan_weeks, recipe_ingredients
3. Multi-language support structure in schema (name_ro, name_en fields)
4. Migrations folder properly structured with SQL DDL files
5. Seed script with basic test data (SQL format)
6. Row Level Security (RLS) policies implemented directly in migrations
7. Database types automatically generated using Supabase CLI

## Story 1.3: Design System & Component Library Setup

**As a** developer,  
**I want** the complete design system tokens and base components,  
**so that** all UI development follows consistent patterns.

**Acceptance Criteria:**

1. Tailwind v4 configured with OKLCH color system
2. Semantic color tokens defined (primary, secondary, surface, etc.)
3. Base components created: Button, Card, Input, Select, Modal, Toast
4. shadcn/ui integrated with CVA for component variants
5. All components use semantic tokens only
6. ESLint rules enforce token usage
7. Component library package exportable to both web and admin apps

## Story 1.4: Internationalization Setup

**As a** developer,  
**I want** i18next fully configured across the monorepo,  
**so that** no hardcoded text ever enters the codebase.

**Acceptance Criteria:**

1. i18next configured in packages/i18n
2. Romanian translation files structured by feature
3. English translation files with empty strings (ready for future)
4. ESLint rule blocking hardcoded strings in JSX
5. Translation keys auto-complete working in IDE
6. Namespace structure defined (common, auth, meals, admin, etc.)
7. Date and number formatting configured for Romanian locale

## Story 1.5: Authentication System

**As a** developer,  
**I want** Supabase Auth configured with all user flows,  
**so that** authentication is ready for the app.

**Acceptance Criteria:**

1. Supabase Auth configured with email/password and Google OAuth
2. User profile structure linked to auth.users
3. Registration flow with household preferences in metadata
4. Password reset flow configured
5. Session management with automatic refresh
6. Protected route middleware/HOC created
7. Test accounts for different states (trial, paid, expired, admin)
8. Production admin account created with secure password (stored in environment variable)

## Story 1.6: Deployment Pipeline & Health Check

**As a** developer,  
**I want** simple deployment to Vercel with basic health checks,  
**so that** code deploys reliably to production.

**Acceptance Criteria:**

1. Vercel connected to GitHub repo (auto-deploy on push to main)
2. Environment variables configured in Vercel dashboard
3. /api/health endpoint that checks database connection
4. Build command runs type-check and lint
5. Simple deployment notification (Discord webhook or email)
6. One-click rollback available in Vercel dashboard

## Story 1.7: Basic Landing Page (Proof of Life)

**As a** developer,  
**I want** a minimal landing page using all our infrastructure,  
**so that** we validate the entire stack works end-to-end.

**Acceptance Criteria:**

1. Simple landing page at / with "Coquinate - Coming Soon"
2. Uses design system components and tokens
3. Pulls one translation key from i18n
4. Has working "Login" button (goes to auth page)
5. Includes health check display (connected/not connected)
6. Deploys successfully to production
7. Loads in under 2 seconds

## Story 1.8: Routing & Error Pages Setup

**As a** developer,  
**I want** proper routing structure and error handling pages,  
**so that** users have a smooth experience even when things go wrong.

**Acceptance Criteria:**

1. Next.js App Router structure configured with route groups
2. Layout hierarchy: root → (marketing) → (app) → (admin)
3. Middleware for protected routes (redirect to login)
4. 404 page with friendly Romanian message and navigation
5. 500 error page with support contact
6. Error boundary components at multiple levels
7. Maintenance mode page (toggleable via environment variable)
8. All error pages use design system and i18n

## Story 1.9: Trial Menu Seed Data

**As a** developer,  
**I want** the 3-day trial menu data ready in the database,  
**so that** new users can immediately experience value.

**Acceptance Criteria:**

1. 12 recipes created (4 meals × 3 days) showcasing best content
2. Recipe data includes Romanian instructions and ingredients
3. Proper leftover connections configured (Sunday roast → Monday sandwich)
4. Shopping list data pre-calculated
5. Nutritional information included
6. High-quality placeholder images referenced
7. Seed script adds this data to fresh database
8. Data marked as "trial_menu" type for special handling

## Story 1.10: Image Storage & Optimization Setup

**As a** developer,  
**I want** image storage and optimization configured,  
**so that** recipe photos load fast on all devices.

**Acceptance Criteria:**

1. Supabase Storage for original image files
2. Vercel Image Optimization API configured
3. Next.js Image component with automatic optimization
4. Responsive image sizes (mobile, tablet, desktop)
5. WebP/AVIF format with fallbacks
6. Blur placeholder during loading
7. Fallback image for missing photos
8. CDN caching via Vercel Edge Network

## Story 1.11: Testing Infrastructure

**As a** developer,  
**I want** comprehensive testing setup,  
**so that** critical features are protected from regression.

**Acceptance Criteria:**

1. Vitest configured for unit tests
2. React Testing Library for components
3. Playwright setup for E2E critical paths
4. Test database separate from development
5. CI runs all tests before deployment
6. Coverage requirements: Admin >90%, Payment flows >95%
7. Test data factories for consistent testing

## Story 1.12: Monitoring & Error Tracking

**As a** developer,  
**I want** visibility into production issues,  
**so that** problems are caught immediately.

**Acceptance Criteria:**

1. Vercel Analytics for performance monitoring
2. Structured error logging with context
3. Admin dashboard errors alert immediately (email/Discord)
4. Payment failures trigger instant alerts
5. Weekly error summary report
6. Client-side error boundary reporting
7. API response time tracking

## Story 1.13: Vercel AI SDK Setup

**As a** developer,  
**I want** Vercel AI SDK configured with Gemini,  
**so that** AI features can be implemented consistently across the application.

**Acceptance Criteria:**

1. Install @ai-sdk/google and ai packages
2. Configure GEMINI_API_KEY environment variable
3. Create base AI service module with error handling
4. Implement reusable chat UI components using useChat hook
5. Set up streaming response handlers with proper error states
6. Add rate limiting wrapper for free tier (1500 requests/day)
7. Create system prompt templates for recipe-bounded context
8. Unit tests for AI service module

## Story 1.14: AI Response Caching Infrastructure

**As a** developer,  
**I want** multi-layer caching for AI responses,  
**so that** we minimize API costs and improve response times.

**Acceptance Criteria:**

1. Phase 1: Browser localStorage caching (immediate MVP)
   - Cache recipe assistant responses for 7 days
   - Key strategy: `ai_${recipeId}_${questionHash}`
   - Maximum 50 cached responses per user
2. Phase 2: Upstash Redis setup (when approaching limits)
   - Free tier account (500K commands/month)
   - Vercel AI SDK caching middleware integration
   - 24-hour TTL for recipe questions, 1-hour for admin
3. Phase 3: Pre-computed responses (based on analytics)
   - Hardcoded responses for top 20 common questions
   - Instant response, no API call needed
4. Smart cache key normalization (group similar questions)
5. Cache invalidation on recipe updates
6. Basic analytics: cache hit rate tracking
7. Cache warming script for new recipes (pre-populate common Q&A)
