/**
 * Motion system exports for Modern Hearth Theme
 * Provides hooks and utilities for animations
 * Updated pentru Framer Motion v12+ compatibility
 */

// Existing exports
export { useMotionPolicy } from './useMotionPolicy';
export type { MotionPolicy } from './useMotionPolicy';
export { useReducedMotion } from './useReducedMotion';
export { useStagger } from './useStagger';
export { useViewTransition } from './useViewTransition';
export { createRipple, attachRipple, useRipple } from './ripple';
export {
  useGPUOptimization,
  shouldReduceAnimations,
  forceGPUAcceleration,
  removeGPUAcceleration,
} from './useGPUOptimization';
export { usePerformanceMonitor, useAdaptiveQuality } from './usePerformanceMonitor';
export { useMotionSettings, MotionDebugPanel } from './MotionProvider';

// Framer Motion v12+ configuration și variants
export { 
  MotionProvider, 
  MotionProviderMax, 
  motionConfig,
  m  // Lazy motion component
} from './config';
export * from './variants';

// Framer Motion v12+ hooks
export {
  useScrollMotion,
  useScrollProgress,
  useParallaxScroll,
  useScrollFadeIn,
  useScrollScale,
  useScrollVelocity,
  useStickyHeader,
  useConcurrentAnimation,
  useDeferredMotion,
  scrollHooks,
} from './hooks/useScrollMotion';

// Loading animation components
export {
  Skeleton,
  SkeletonCard,
  ProgressiveList,
  LoadingSpinner,
  MotionLoadingDots,
  loadingComponents,
} from './loading';

// Coming-soon page skeleton components
export {
  NavigationSkeleton,
  HeroSectionSkeleton,
  FeaturesSectionSkeleton,
  CTASectionSkeleton,
  FooterSkeleton,
  ComingSoonPageSkeleton,
  comingSoonSkeletons,
} from './coming-soon-skeleton';

// Interaction animation components
export {
  MotionInteractiveCard,
  HoverButton,
  IconButton,
  HoverImage,
  Tooltip,
  interactionComponents,
} from './interactions';

// Form validation animation components
export {
  ValidatedInput,
  FormField,
  PasswordStrength,
  SubmitButton,
  validationComponents,
} from './validation';

// Re-export motion CSS for easy importing
export const motionStyles = '/styles/motion.css';
