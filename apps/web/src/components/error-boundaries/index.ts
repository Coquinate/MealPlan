/**
 * Enhanced Error Boundary System
 *
 * Provides comprehensive client-side error catching with:
 * - Immediate admin alerts for critical errors
 * - Structured error logging with correlation IDs
 * - User-friendly Romanian error messages
 * - Automatic retry mechanisms
 * - Development debugging tools
 */

export { RootErrorBoundary } from './RootErrorBoundary';
export { AuthErrorBoundary, useAuthErrorHandler } from '../features/auth/AuthErrorBoundary';
export { ComponentErrorBoundary, useComponentErrorBoundary } from './ComponentErrorBoundary';
export {
  CacheErrorBoundary,
  withCacheErrorBoundary,
  useCacheErrorHandler,
} from './CacheErrorBoundary';

// Type exports for easier usage
export type { ErrorBoundaryState } from './RootErrorBoundary';
export type { Props as AuthErrorBoundaryProps } from '../features/auth/AuthErrorBoundary';
export type { Props as ComponentErrorBoundaryProps } from './ComponentErrorBoundary';
export type { Props as CacheErrorBoundaryProps } from './CacheErrorBoundary';
