# Essential Development Commands

## Installation & Setup
```bash
pnpm install              # Install all dependencies
```

## Development
```bash
pnpm dev                  # Start all apps in parallel
pnpm --filter @coquinate/web dev      # Start web app only
pnpm --filter @coquinate/admin dev    # Start admin app only
pnpm --filter @coquinate/ui storybook  # Start Storybook
```

## Code Quality (Run before completing any task!)
```bash
pnpm lint                 # Lint all packages
pnpm format              # Format code with Prettier
pnpm test                # Run all tests
pnpm test:run            # Run tests once
pnpm test:coverage       # Run with coverage
pnpm test:e2e            # Run Playwright E2E tests
```

## Build
```bash
pnpm build               # Build all apps
pnpm --filter @coquinate/web build    # Build web app only
```

## Clean
```bash
pnpm clean               # Remove build artifacts and node_modules
```

## Git Workflow
```bash
git status               # Check changes
git add .                # Stage changes
git commit -m "feat: description"     # Commit with conventional format
git push                 # Push to remote
```

## Task Master Commands
```bash
task-master next         # Get next task
task-master show <id>    # View task details
task-master set-status --id=<id> --status=done    # Mark complete
```

## System Utils (Linux)
```bash
ls -la                   # List files with details
cd <directory>           # Change directory
grep -r "pattern" .      # Search in files
find . -name "*.tsx"     # Find files by name
```