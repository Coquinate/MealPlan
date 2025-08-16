# Coquinate - Meal Planning & Nutrition Tracking Application

A modern, full-stack monorepo application for personalized meal planning and nutrition tracking.

## 🏗️ Architecture

This project uses a monorepo structure powered by pnpm workspaces:

```
coquinate/
├── apps/
│   ├── web/         # User-facing React application
│   └── admin/       # Admin dashboard
├── packages/
│   ├── shared/      # Shared types and utilities
│   ├── ui/          # Shared UI components
│   ├── database/    # Database utilities
│   └── config/      # Shared configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or 22.x
- pnpm 10.14.0 or higher

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd coquinate
```

2. Install pnpm globally (if not already installed):

```bash
npm install -g pnpm@10.14.0
```

3. Install dependencies:

```bash
pnpm install
```

4. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your actual values
```

5. Start development servers:

```bash
pnpm dev
```

## 📝 Available Scripts

### Root Level Commands

- `pnpm dev` - Start all development servers in parallel
- `pnpm build` - Build all applications
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all files with Prettier
- `pnpm clean` - Clean all build outputs and node_modules

### Workspace Commands

Run commands for specific workspaces:

```bash
# Run dev server for web app only
pnpm --filter @coquinate/web dev

# Build admin app
pnpm --filter @coquinate/admin build

# Test shared package
pnpm --filter @coquinate/shared test
```

## 🛠️ Technology Stack

- **Package Manager**: pnpm (workspace-enabled monorepo)
- **Framework**: React 19 with Next.js 15
- **Language**: TypeScript 5.9 (strict mode)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Email**: Resend
- **AI**: Google Gemini
- **Linting**: ESLint 9 (flat config)
- **Formatting**: Prettier 3.6
- **Git Hooks**: Husky + lint-staged

## 📂 Project Structure

### Apps

- **web**: User-facing application for meal planning
- **admin**: Administrative dashboard for content management

### Packages

- **shared**: Shared TypeScript types, utilities, and constants
- **ui**: Reusable React components
- **database**: Database models and utilities
- **config**: Shared configuration (ESLint, TypeScript, etc.)

## 🔧 Configuration

### AI Response Caching

The application implements a sophisticated multi-layer caching system to minimize API costs and improve response times:

#### Cache Layers

1. **Static Responses** (0ms, $0) - Instant answers for common questions
2. **localStorage Cache** (50-100ms, $0) - Recent personalized responses
3. **Gemini Implicit Cache** (200-500ms, 75% discount) - API-level repeated prefixes
4. **Fresh API Calls** (800-2000ms, full cost) - New requests only when needed

#### Configuration

Add these environment variables to your `.env` file:

```bash
# Core Cache Settings
NEXT_PUBLIC_CACHE_ENABLED=true              # Enable AI response caching
NEXT_PUBLIC_CACHE_MAX_ITEMS=50              # Maximum cached responses
NEXT_PUBLIC_CACHE_TTL_DAYS=7                # Cache time-to-live in days
NEXT_PUBLIC_CACHE_MAX_SIZE_MB=4             # Maximum cache size in MB

# Performance Features
NEXT_PUBLIC_CACHE_STATIC_RESPONSES=true     # Enable static response lookup
NEXT_PUBLIC_CACHE_ANALYTICS_ENABLED=true    # Track cache performance metrics
```

#### Performance Targets

- Cache hit rate: >60%
- Cost reduction: >50%
- Cached response time: <100ms

See `docs/architecture/cache-strategy.md` for detailed implementation and tuning guidelines.

### TypeScript

The project uses a base TypeScript configuration with strict mode enabled. Each workspace extends this base configuration.

### ESLint

ESLint 9 with flat config is configured with:

- TypeScript support
- React 19 compatibility
- i18n enforcement (no hardcoded strings)
- Tailwind CSS token enforcement (no arbitrary values)

### Prettier

Code formatting is handled by Prettier with a consistent configuration across all packages.

### Git Hooks

Pre-commit hooks ensure:

- Code is linted and formatted
- Commit messages follow conventional format

## 🤝 Contributing

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Maintenance tasks

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint` and `pnpm format`
4. Commit with conventional commit message
5. Push and create a pull request

## 📄 Environment Variables

See `.env.example` for all required environment variables. Key configurations include:

- Supabase credentials
- Stripe API keys
- Resend email service
- Google Gemini AI
- Application URLs

## 🤖 AI Configuration

### Model Selection

The application uses **Google Gemini 2.0 Flash** through the Vercel AI SDK 4.2 for the following reasons:

- **Production Ready**: Gemini 2.0 Flash is generally available (GA) with stable APIs
- **Cost Effective**: Optimized for high-volume applications with competitive pricing
- **Fast Response Times**: Optimized for low-latency streaming responses
- **High Rate Limits**: 60 requests per minute default, scalable with project tier
- **Romanian Language Support**: Excellent multilingual capabilities including Romanian
- **Message Parts Support**: AI SDK 4.2 compatibility for mixed content (text + future image support)

### AI SDK Integration

- **Package**: `@ai-sdk/google` (official Google provider for Vercel AI SDK)
- **Version**: AI SDK 4.2 with latest features including streaming, caching, and message parts
- **Rate Limiting**: Tier-based system with automatic scaling
- **Caching**: Built-in request caching to reduce API costs

## 🚨 Important Notes

- **DO NOT use npm or yarn** - This project is optimized for pnpm
- All shared types must be defined in `packages/shared`
- Follow the established file naming conventions (kebab-case)
- Ensure all text content uses i18n (no hardcoded strings)
- Use design tokens for Tailwind CSS (no arbitrary values)

## 📚 Documentation

Additional documentation can be found in the `docs/` directory:

- Architecture decisions
- API documentation
- Deployment guides

## 🐛 Troubleshooting

### Common Issues

1. **pnpm not recognized**: Ensure pnpm is installed globally
2. **TypeScript errors**: Run `pnpm install` to ensure all types are installed
3. **Port conflicts**: Check if ports 3000 (web) and 3001 (admin) are available
4. **Next.js 15.4.6 Build Error**: Production builds may fail with webpack minification error
   - **Workaround**: Minification is temporarily disabled in `apps/web/next.config.js`
   - **Solution for production**: Downgrade to Next.js 15.4.5 or wait for 15.4.7
   - **Status**: Acceptable for development, larger bundle size not critical

## 📦 Deployment

Deployment documentation will be added as the project progresses.

## 📝 License

This project is private and unlicensed.

---

Built with ❤️ by the Coquinate Team

# Git configuration updated
