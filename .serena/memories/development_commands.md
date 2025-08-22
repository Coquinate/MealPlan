# Essential Development Commands

## Core Commands
```bash
# Install dependencies (MUST use pnpm)
pnpm install

# Development
pnpm dev                              # Start all apps in parallel
pnpm --filter @coquinate/web dev      # Start web app only  
pnpm --filter @coquinate/admin dev    # Start admin app only

# Build
pnpm build                            # Build web app for production
pnpm --filter @coquinate/admin build  # Build admin app

# Testing
pnpm test                             # Run all tests
pnpm test:run                         # Run tests once (no watch)
pnpm test:coverage                    # Run with coverage
pnpm test:e2e                         # Run Playwright E2E tests
pnpm --filter @coquinate/web test     # Test web app only
pnpm --filter @coquinate/shared test  # Test shared package only

# Code Quality
pnpm lint                             # Lint all packages
pnpm format                           # Format code with Prettier

# Clean
pnpm clean                            # Remove build artifacts and node_modules
```

## Key Guidelines
- ALWAYS use pnpm for package operations
- Follow existing component patterns
- Use design tokens for Tailwind (no arbitrary values)
- Implement error boundaries for all major features
- Add i18n keys for ALL user-facing text
- Run lint checks before completing any implementation