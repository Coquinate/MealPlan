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

## 📦 Deployment

Deployment documentation will be added as the project progresses.

## 📝 License

This project is private and unlicensed.

---

Built with ❤️ by the Coquinate Team
