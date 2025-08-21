# Coquinate Fullstack Architecture Document

## Table of Contents

- [Coquinate Fullstack Architecture Document](#table-of-contents)
  - [Version 1.0 - Cutting Edge Stack Implementation](./version-10-cutting-edge-stack-implementation.md)
  - [Introduction](./introduction.md)
    - [Starter Template or Existing Project](./introduction.md#starter-template-or-existing-project)
    - [Change Log](./introduction.md#change-log)
  - [High Level Architecture](./high-level-architecture.md)
    - [Technical Summary](./high-level-architecture.md#technical-summary)
    - [Platform and Infrastructure Choice](./high-level-architecture.md#platform-and-infrastructure-choice)
    - [Repository Structure](./high-level-architecture.md#repository-structure)
    - [High Level Architecture Diagram](./high-level-architecture.md#high-level-architecture-diagram)
    - [Architectural Patterns](./high-level-architecture.md#architectural-patterns)
    - [Technical Reality Check (August 2025)](./high-level-architecture.md#technical-reality-check-august-2025)
  - [Tech Stack](./tech-stack.md)
    - [Technology Stack Table (Verified August 2025)](./tech-stack.md#technology-stack-table-verified-august-2025)
    - [Critical Version Notes (August 2025)](./tech-stack.md#critical-version-notes-august-2025)
  - [Data Models](./data-models.md)
    - [Core Business Entities](./data-models.md#core-business-entities)
    - [User Model](./data-models.md#user-model)
      - [TypeScript Interface](./data-models.md#typescript-interface)
      - [Relationships](./data-models.md#relationships)
    - [Recipe Model](./data-models.md#recipe-model)
      - [TypeScript Interface](./data-models.md#typescript-interface)
      - [Relationships](./data-models.md#relationships)
    - [MealPlan Model](./data-models.md#mealplan-model)
      - [TypeScript Interface](./data-models.md#typescript-interface)
      - [Relationships](./data-models.md#relationships)
    - [ShoppingList Model](./data-models.md#shoppinglist-model)
      - [TypeScript Interface](./data-models.md#typescript-interface)
      - [Relationships](./data-models.md#relationships)
    - [Ingredient Model](./data-models.md#ingredient-model)
      - [TypeScript Interface](./data-models.md#typescript-interface)
      - [Relationships](./data-models.md#relationships)
    - [RecipeFeedback Model](./data-models.md#recipefeedback-model)
      - [TypeScript Interface](./data-models.md#typescript-interface)
      - [Relationships](./data-models.md#relationships)
    - [Admin Models](./data-models.md#admin-models)
    - [AdminUser Model](./data-models.md#adminuser-model)
      - [TypeScript Interface](./data-models.md#typescript-interface)
    - [TrialMenu Model](./data-models.md#trialmenu-model)
      - [TypeScript Interface](./data-models.md#typescript-interface)
  - [Model Relationships Overview](./model-relationships-overview.md)
  - [Database Schema](./database-schema.md)
    - [Critical Architecture Fix Applied ✅](./database-schema.md#critical-architecture-fix-applied)
    - [Data Access Strategy: Supabase-Native SQL DDL](./database-schema.md#data-access-strategy-supabase-native-sql-ddl)
    - [Complete Database Schema (16 Tables)](./database-schema.md#complete-database-schema-16-tables)
      - [Core Enums](./database-schema.md#core-enums)
      - [1. Users Table (Enhanced)](./database-schema.md#1-users-table-enhanced)
      - [2. Ingredients Table (OpenFoodFacts Integration)](./database-schema.md#2-ingredients-table-openfoodfacts-integration)
      - [3. Recipes Table (Enhanced)](./database-schema.md#3-recipes-table-enhanced)
      - [4. Recipe Ingredients Junction Table (CRITICAL FIX)](./database-schema.md#4-recipe-ingredients-junction-table-critical-fix)
      - [5. Meal Plans Table](./database-schema.md#5-meal-plans-table)
      - [6. Planned Meals Junction Table](./database-schema.md#6-planned-meals-junction-table)
      - [7. Leftover Connections Table (FR2)](./database-schema.md#7-leftover-connections-table-fr2)
      - [8. Shopping Lists Table](./database-schema.md#8-shopping-lists-table)
      - [9. Shopping List Items Table](./database-schema.md#9-shopping-list-items-table)
      - [10. Recipe Feedback Table (FR7)](./database-schema.md#10-recipe-feedback-table-fr7)
      - [11. Trial Menus Table (FR8, FR29)](./database-schema.md#11-trial-menus-table-fr8-fr29)
      - [12. Admin Users Table](./database-schema.md#12-admin-users-table)
      - [13. Draft Meal Plans Table (Admin Workflow)](./database-schema.md#13-draft-meal-plans-table-admin-workflow)
      - [14. Validation Results Table (AI Validation)](./database-schema.md#14-validation-results-table-ai-validation)
      - [15. Recipe Imports Table (Admin Feature)](./database-schema.md#15-recipe-imports-table-admin-feature)
      - [16. Published Weeks Table (Publishing Workflow)](./database-schema.md#16-published-weeks-table-publishing-workflow)
    - [Row Level Security (RLS) Policies](./database-schema.md#row-level-security-rls-policies)
  - [Model Relationships Overview](./model-relationships-overview.md)
  - [Zod Schema Generation from Database](./zod-schema-generation-from-database.md)
    - [Automated Type Safety Pipeline](./zod-schema-generation-from-database.md#automated-type-safety-pipeline)
      - [1. Generate TypeScript Types from Database](./zod-schema-generation-from-database.md#1-generate-typescript-types-from-database)
      - [2. Generate Zod Schemas from Database Types](./zod-schema-generation-from-database.md#2-generate-zod-schemas-from-database-types)
      - [3. Extend Base Schemas for API Validation](./zod-schema-generation-from-database.md#3-extend-base-schemas-for-api-validation)
    - [Key Synchronization Points](./zod-schema-generation-from-database.md#key-synchronization-points)
    - [Critical Fixes Applied](./zod-schema-generation-from-database.md#critical-fixes-applied)
  - [Comprehensive PRD Validation Report](./comprehensive-prd-validation-report.md)
    - [✅ Core User Experience (Epic 4)](./comprehensive-prd-validation-report.md#core-user-experience-epic-4)
    - [✅ Admin Dashboard (Epic 3)](./comprehensive-prd-validation-report.md#admin-dashboard-epic-3)
    - [✅ Trial System (Epic 2)](./comprehensive-prd-validation-report.md#trial-system-epic-2)
    - [✅ Subscription & Payment (Epic 1)](./comprehensive-prd-validation-report.md#subscription-payment-epic-1)
    - [✅ Technical Requirements](./comprehensive-prd-validation-report.md#technical-requirements)
    - [✅ Automation & Scheduling](./comprehensive-prd-validation-report.md#automation-scheduling)
    - [Gap Analysis: ALL GAPS RESOLVED ✅](./comprehensive-prd-validation-report.md#gap-analysis-all-gaps-resolved)
  - [tRPC Router Definitions](./trpc-router-definitions.md)
    - [User Authentication Router](./trpc-router-definitions.md#user-authentication-router)
    - [Meal Plan Router](./trpc-router-definitions.md#meal-plan-router)
    - [Recipe Router](./trpc-router-definitions.md#recipe-router)
    - [Shopping List Router](./trpc-router-definitions.md#shopping-list-router)
    - [Subscription Router](./trpc-router-definitions.md#subscription-router)
    - [Admin Router (Epic 3)](./trpc-router-definitions.md#admin-router-epic-3)
  - [API Authentication & Security](./api-authentication-security.md)
  - [Rate Limiting Configuration](./rate-limiting-configuration.md)
  - [WebSocket Events (Real-time Updates)](./websocket-events-real-time-updates.md)
  - [API and Database Schema Alignment](./api-and-database-schema-alignment.md)
    - [1. Missing User Trial Progress Tracking](./api-and-database-schema-alignment.md#1-missing-user-trial-progress-tracking)
    - [2. Missing Recipe Testing Fields](./api-and-database-schema-alignment.md#2-missing-recipe-testing-fields)
  - [TypeScript Type Generation from Database](./typescript-type-generation-from-database.md)
    - [Supabase Type Generation Setup](./typescript-type-generation-from-database.md#supabase-type-generation-setup)
      - [Installation & Configuration](./typescript-type-generation-from-database.md#installation-configuration)
      - [Generated Database Types Structure](./typescript-type-generation-from-database.md#generated-database-types-structure)
      - [Type-Safe Database Client Usage](./typescript-type-generation-from-database.md#type-safe-database-client-usage)
      - [Automation Script for Type Generation](./typescript-type-generation-from-database.md#automation-script-for-type-generation)
    - [Key Benefits of Supabase Type Generation](./typescript-type-generation-from-database.md#key-benefits-of-supabase-type-generation)
  - [Components](./components.md)
    - [User-Facing Web Application](./components.md#user-facing-web-application)
    - [Admin Dashboard](./components.md#admin-dashboard)
    - [Edge Functions API](./components.md#edge-functions-api)
    - [Database Layer](./components.md#database-layer)
    - [Caching Layer](./components.md#caching-layer)
    - [File Storage](./components.md#file-storage)
    - [Component Relationship Diagrams](./components.md#component-relationship-diagrams)
      - [High-Level Component Dependencies](./components.md#high-level-component-dependencies)
      - [Component Communication Patterns](./components.md#component-communication-patterns)
      - [Data Flow Architecture](./components.md#data-flow-architecture)
      - [Component Scaling Strategy](./components.md#component-scaling-strategy)
  - [External APIs](./external-apis.md)
    - [Gemini 2.0 Flash API](./external-apis.md#gemini-20-flash-api)
    - [Resend API](./external-apis.md#resend-api)
    - [Stripe API](./external-apis.md#stripe-api)
    - [Upstash Redis API](./external-apis.md#upstash-redis-api)
    - [OpenFoodFacts API](./external-apis.md#openfoodfacts-api)
  - [Core Workflows](./core-workflows.md)
    - [User Registration and Trial Flow](./core-workflows.md#user-registration-and-trial-flow)
    - [Weekly Meal Plan Generation and Publishing](./core-workflows.md#weekly-meal-plan-generation-and-publishing)
    - [Shopping List Generation with Ingredient Lookup](./core-workflows.md#shopping-list-generation-with-ingredient-lookup)
  - [Frontend Architecture](./frontend-architecture.md)
    - [Component Architecture](./frontend-architecture.md#component-architecture)
      - [Component Organization](./frontend-architecture.md#component-organization)
      - [Component Architecture](./frontend-architecture.md#component-architecture)
    - [State Management Architecture](./frontend-architecture.md#state-management-architecture)
      - [State Management Architecture](./frontend-architecture.md#state-management-architecture)
    - [Coordination Hooks Pattern](./frontend-architecture.md#coordination-hooks-pattern)
      - [Implementation Pattern](./frontend-architecture.md#implementation-pattern)
      - [Component Usage - Before vs After](./frontend-architecture.md#component-usage-before-vs-after)
      - [Benefits Achieved](./frontend-architecture.md#benefits-achieved)
      - [Coordination Hook Responsibilities](./frontend-architecture.md#coordination-hook-responsibilities)
      - [Implementation Guidelines](./frontend-architecture.md#implementation-guidelines)
    - [Routing Architecture](./frontend-architecture.md#routing-architecture)
      - [Route Organization](./frontend-architecture.md#route-organization)
      - [Protected Route Pattern](./frontend-architecture.md#protected-route-pattern)
    - [Frontend Services Layer](./frontend-architecture.md#frontend-services-layer)
      - [Frontend Services Layer](./frontend-architecture.md#frontend-services-layer)
  - [Backend Architecture](./backend-architecture.md)
    - [Service Architecture](./backend-architecture.md#service-architecture)
      - [Function Organization](./backend-architecture.md#function-organization)
      - [Edge Function Architecture](./backend-architecture.md#edge-function-architecture)
    - [Database Architecture](./backend-architecture.md#database-architecture)
      - [Schema Design](./backend-architecture.md#schema-design)
      - [Database Access Patterns](./backend-architecture.md#database-access-patterns)
    - [Authentication and Authorization](./backend-architecture.md#authentication-and-authorization)
      - [Auth Flow](./backend-architecture.md#auth-flow)
      - [Authentication Middleware](./backend-architecture.md#authentication-middleware)
  - [Unified Project Structure](./unified-project-structure.md)
  - [Development Workflow](./development-workflow.md)
    - [Local Development Setup](./development-workflow.md#local-development-setup)
      - [Prerequisites](./development-workflow.md#prerequisites)
      - [Initial Setup](./development-workflow.md#initial-setup)
      - [Development Commands](./development-workflow.md#development-commands)
    - [Environment Configuration](./development-workflow.md#environment-configuration)
      - [Required Environment Variables](./development-workflow.md#required-environment-variables)
  - [Deployment](./deployment.md)
    - [Simple Deployment Setup](./deployment.md#simple-deployment-setup)
    - [CI/CD - Minimal GitHub Actions](./deployment.md#cicd-minimal-github-actions)
    - [Environments](./deployment.md#environments)
  - [Launch Mode System](./launch-mode-system.md)
    - [Overview](./launch-mode-system.md#overview)
    - [How It Works](./launch-mode-system.md#how-it-works)
    - [Launch Modes](./launch-mode-system.md#launch-modes)
    - [Configuration](./launch-mode-system.md#configuration)
    - [Implementation Files](./launch-mode-system.md#implementation-files)
    - [Testing Launch Modes](./launch-mode-system.md#testing-launch-modes)
    - [Security Benefits](./launch-mode-system.md#security-benefits)
  - [Multi-Domain Support](#multi-domain-support)
    - [Domain Configuration](#domain-configuration)
    - [Domain Detection](#domain-detection)
    - [URL Generation](#url-generation)
    - [Implementation Files](#implementation-files-1)
  - [Security and Performance](./security-and-performance.md)
    - [Security - Keep It Simple](./security-and-performance.md#security-keep-it-simple)
    - [Performance Requirements](./security-and-performance.md#performance-requirements)
  - [Testing Strategy](./testing-strategy.md)
    - [Testing Approach](./testing-strategy.md#testing-approach)
    - [Test Organization](./testing-strategy.md#test-organization)
    - [What We Test](./testing-strategy.md#what-we-test)
      - [Admin Dashboard Testing (Priority - 90% Coverage)](./testing-strategy.md#admin-dashboard-testing-priority-90-coverage)
      - [User Features (Manual Testing During Development)](./testing-strategy.md#user-features-manual-testing-during-development)
    - [Running Tests](./testing-strategy.md#running-tests)
    - [Why This Approach?](./testing-strategy.md#why-this-approach)
    - [Test Code Examples](./testing-strategy.md#test-code-examples)
      - [Frontend Component Test Example](./testing-strategy.md#frontend-component-test-example)
      - [Backend API Test Example](./testing-strategy.md#backend-api-test-example)
      - [End-to-End Test Example](./testing-strategy.md#end-to-end-test-example)
  - [Coding Standards](./coding-standards.md)
    - [Critical Fullstack Rules](./coding-standards.md#critical-fullstack-rules)
    - [Naming Conventions](./coding-standards.md#naming-conventions)
  - [Error Handling](./error-handling.md)
    - [Simple Error Handling Approach](./error-handling.md#simple-error-handling-approach)
    - [Error Messages](./error-handling.md#error-messages)
    - [Error Flow Sequence Diagrams](./error-handling.md#error-flow-sequence-diagrams)
      - [API Error Handling Flow](./error-handling.md#api-error-handling-flow)
      - [Payment Error Handling Flow](./error-handling.md#payment-error-handling-flow)
      - [Authentication Error Handling Flow](./error-handling.md#authentication-error-handling-flow)
      - [Real-time Error Handling Flow](./error-handling.md#real-time-error-handling-flow)
  - [Monitoring](./monitoring.md)
    - [Minimal Monitoring (As Per PRD)](./monitoring.md#minimal-monitoring-as-per-prd)
  - [Checklist Results Report](./checklist-results-report.md)
    - [Architecture Validation Checklist ✅](./checklist-results-report.md#architecture-validation-checklist)
  - [AI Implementation Architecture](./ai-implementation-architecture.md)
    - [Overview](./ai-implementation-architecture.md#overview)
    - [AI Service Integration Points](./ai-implementation-architecture.md#ai-service-integration-points)
      - [1. Recipe Validation Pipeline](./ai-implementation-architecture.md#1-recipe-validation-pipeline)
      - [2. AI Edge Function Architecture](./ai-implementation-architecture.md#2-ai-edge-function-architecture)
      - [3. AI Database Integration](./ai-implementation-architecture.md#3-ai-database-integration)
      - [4. AI Workflow Integration](./ai-implementation-architecture.md#4-ai-workflow-integration)
    - [AI Configuration and Limits](./ai-implementation-architecture.md#ai-configuration-and-limits)
  - [Session Management Architecture](./session-management-architecture.md)
    - [Single Session Enforcement](./session-management-architecture.md#single-session-enforcement)
      - [Implementation Strategy](./session-management-architecture.md#implementation-strategy)
      - [Database Schema](./session-management-architecture.md#database-schema)
    - [No Real-Time Collaboration](./session-management-architecture.md#no-real-time-collaboration)
  - [PWA and Offline Support Architecture](./pwa-and-offline-support-architecture.md)
    - [Progressive Web App Implementation](./pwa-and-offline-support-architecture.md#progressive-web-app-implementation)
      - [PWA Configuration](./pwa-and-offline-support-architecture.md#pwa-configuration)
      - [Offline Data Storage](./pwa-and-offline-support-architecture.md#offline-data-storage)
      - [Offline-First Architecture](./pwa-and-offline-support-architecture.md#offline-first-architecture)
  - [Push Notification System Architecture](./push-notification-system-architecture.md)
    - [Web Push Notifications](./push-notification-system-architecture.md#web-push-notifications)
      - [Push Notification Flow](./push-notification-system-architecture.md#push-notification-flow)
      - [Notification Database Schema](./push-notification-system-architecture.md#notification-database-schema)
      - [Frontend Push Registration](./push-notification-system-architecture.md#frontend-push-registration)
      - [Email Fallback System](./push-notification-system-architecture.md#email-fallback-system)
  - [Admin Backup and Restore System](./admin-backup-and-restore-system.md)
    - [Comprehensive Data Backup Architecture](./admin-backup-and-restore-system.md#comprehensive-data-backup-architecture)
      - [Backup System Implementation](./admin-backup-and-restore-system.md#backup-system-implementation)
      - [Database Schema for Backups](./admin-backup-and-restore-system.md#database-schema-for-backups)
      - [Automated Backup Scheduling](./admin-backup-and-restore-system.md#automated-backup-scheduling)
      - [Backup Workflow Architecture](./admin-backup-and-restore-system.md#backup-workflow-architecture)
      - [Restore Process Implementation](./admin-backup-and-restore-system.md#restore-process-implementation)
    - [Final Status: ARCHITECTURE COMPLETE ✅](./admin-backup-and-restore-system.md#final-status-architecture-complete)

## Multi-Domain Support

Coquinate supports multiple domains to serve different markets and languages while maintaining a unified codebase and infrastructure.

### Domain Configuration

The application operates on two primary domains:

- **coquinate.ro** - Primary Romanian market domain
- **coquinate.com** - International/English market domain

Both domains share the same Next.js application, database, and backend services, with domain-specific customization handled through runtime detection and configuration.

### Domain Detection

The system automatically detects the current domain through request headers and provides appropriate domain-specific behavior:

```typescript
// Domain detection based on request headers
function getDomain(headers?: Headers): 'ro' | 'com' {
  const host = headers.get('host') || '';
  if (host.includes('coquinate.com')) {
    return 'com';
  }
  return 'ro'; // Default to .ro
}
```

### URL Generation

Canonical and alternate URL generation ensures proper SEO and cross-domain navigation:

```typescript
// Generate canonical URLs for current domain
function getCanonicalUrl(pathname: string, domain?: 'ro' | 'com'): string {
  const baseDomain = domain === 'com' 
    ? 'https://coquinate.com' 
    : 'https://coquinate.ro';
  return `${baseDomain}${pathname}`;
}

// Generate alternate URLs for SEO hreflang
function getAlternateUrls(pathname: string): { ro: string; com: string } {
  return {
    ro: `https://coquinate.ro${pathname}`,
    com: `https://coquinate.com${pathname}`,
  };
}
```

### Implementation Files

**Core Domain Utilities:**
- `/apps/web/src/lib/domain-utils.ts` - Domain detection and URL generation utilities

**Integration Points:**
- `/apps/web/src/app/layout.tsx` - Metadata base URL configuration
- `/apps/web/src/middleware.ts` - Domain-aware request handling
- [Launch Mode System](./launch-mode-system.md) - Works seamlessly across both domains

**Configuration Examples:**
```typescript
// Next.js metadata configuration
metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://coquinate.ro'),
alternates: {
  languages: {
    'ro-RO': 'https://coquinate.ro',
    'en-US': 'https://coquinate.com',
  },
}
```

The multi-domain architecture ensures that both Romanian and international users receive optimized experiences while maintaining operational efficiency through a single codebase and infrastructure setup.
