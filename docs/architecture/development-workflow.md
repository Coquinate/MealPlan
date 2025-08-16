# Development Workflow

## Local Development Setup

### Prerequisites

- Node.js 22.x
- pnpm 10.14.0
- Git

### Component Development Workflow

**1. Shared UI Components (Primary):**

```bash
# Start Storybook for component development
pnpm --filter @coquinate/ui storybook

# Develop components with stories
# http://localhost:6006 - See all component variations
```

**2. App Integration:**

```bash
# Build UI library
pnpm --filter @coquinate/ui build

# Start web app (consumes @coquinate/ui components)
pnpm --filter @coquinate/web dev

# Start admin app (consumes @coquinate/ui components)
pnpm --filter @coquinate/admin dev
```

**3. Implementation Guide:**
Follow `docs/front-end-spec/STORYBOOK-PRACTICAL-SETUP.md` for complete setup process.
