#!/bin/bash
# Build all packages in correct order
npx pnpm@10.14.0 --filter @coquinate/shared build
npx pnpm@10.14.0 --filter @coquinate/ui build
npx pnpm@10.14.0 --filter @coquinate/i18n build
npx pnpm@10.14.0 --filter @coquinate/database build
npx pnpm@10.14.0 --filter @coquinate/config build
npx pnpm@10.14.0 --filter @coquinate/web build