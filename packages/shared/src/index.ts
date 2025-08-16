/**
 * Main export file for @coquinate/shared package
 */

export * from './types';

// Authentication exports
export * from './stores/authStore';
export * from './hooks/useAuth';
export * from './components/ProtectedRoute';
export * from './middleware/authMiddleware';

// Image components
export * from './components/RecipeImage';

// Utilities
export * from './utils';
