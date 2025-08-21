# Coquinate Project Overview

## Purpose
Coquinate is a Romanian meal planning and nutrition tracking platform for families, focused on personalized meal planning with AI-powered features.

## Tech Stack
- **Monorepo**: pnpm workspaces
- **Runtime**: Node.js 22.x
- **Package Manager**: pnpm 10.14.0
- **Frontend**: React 19.1 + Next.js 15 + TypeScript 5.9
- **Styling**: Tailwind CSS 4.1 with OKLCH colors (NO arbitrary values)
- **State**: Zustand 5.0
- **Database**: Supabase (PostgreSQL 15.x with RLS)
- **AI**: Gemini 2.0 Flash via @ai-sdk/google
- **Testing**: Vitest 3.2 + Playwright 1.54
- **i18n**: i18next 24.x + react-i18next 15.6

## Structure
- apps/web: User-facing Next.js app
- apps/admin: Admin dashboard
- packages/shared: Shared types and utilities
- packages/ui: Component library
- packages/i18n: Translations
- packages/config: Build configs

## Key Principles
- Romanian-first development
- No hardcoded strings (use i18n)
- Semantic design tokens only
- Error boundaries everywhere
- Component-first development in Storybook