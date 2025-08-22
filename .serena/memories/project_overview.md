# Coquinate Project Overview

## Project Description
Coquinate is a Romanian meal planning and nutrition tracking platform with AI-powered features for personalized meal planning.

## Technology Stack
- **Frontend**: React 19.1 + Next.js 15 (App Router, Server Components)
- **Styling**: Tailwind CSS v4.1 (design tokens, no arbitrary values)
- **State Management**: Zustand 5.0 + react-hook-form for forms
- **Backend**: Supabase (PostgreSQL + Edge Functions with Deno 2.1)
- **Database**: Supabase PostgreSQL with Row Level Security
- **Testing**: Vitest for unit testing, Playwright for E2E and component testing
- **Package Manager**: pnpm 10.14.0 (DO NOT use npm or yarn)
- **Runtime**: Node.js 22.x (DO NOT use Node 18.x - EOL)

## Key Architectural Principles
- React 19 manages optimizations automatically - no manual React.memo usage
- Server Components by default, Client Components only when interactivity is needed
- Monorepo with pnpm workspaces for shared and reusable components

## Monorepo Structure
- **apps/web**: User-facing Next.js 15 application with React 19
- **apps/admin**: Admin dashboard for content management
- **packages/shared**: Shared TypeScript types, utilities, AI services
- **packages/ui**: Shared React components library
- **packages/i18n**: Internationalization configuration and translations
- **packages/config**: Shared ESLint, TypeScript, and build configurations