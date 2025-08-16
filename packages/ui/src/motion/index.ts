/**
 * Motion system exports for Modern Hearth Theme
 * Provides hooks and utilities for animations
 */

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
export { MotionProvider, useMotionSettings, MotionDebugPanel } from './MotionProvider';

// Re-export motion CSS for easy importing
export const motionStyles = '/styles/motion.css';
