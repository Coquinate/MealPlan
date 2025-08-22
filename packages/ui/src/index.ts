/**
 * Main entry point for @coquinate/ui package
 * Exports all components, hooks, and utilities
 * @module @coquinate/ui
 */

// Component exports
export * from './components';

// Animated component exports
export * from './components/animated';

// Landing page components exports
export { HeroSection } from './components/landing/sections/HeroSection';
export { FeaturesSection } from './components/landing/sections/FeaturesSection';
export { CTASection } from './components/landing/sections/CTASection';
export { ScrollProgress } from './components/landing/effects/ScrollProgress';
export { ProgressIndicator } from './components/landing/components/ProgressIndicator';
export { ShareWidget } from './components/landing/components/ShareWidget';
export { ConfettiEffect } from './components/landing/effects/ConfettiEffect';
export { useScrollAnimation } from './components/landing/hooks/useScrollAnimation';

// New Framer Motion v12+ components
export { FloatingParticles } from './components/landing/components/FloatingParticles';
export { SoundToggleButton } from './components/landing/components/sound/SoundToggleButton';
export { WorkflowVisualization } from './components/landing/components/workflow/WorkflowVisualization';
export { WorkflowStep } from './components/landing/components/workflow/WorkflowStep';
export { WorkflowTimeline } from './components/landing/components/workflow/WorkflowTimeline';

// Sound system hooks
export { useSoundPreferences } from './components/landing/components/sound/useSoundPreferences';
export { useAudioEngine } from './components/landing/components/sound/useAudioEngine';

// Background animation components
export { MorphingBlobs } from './components/backgrounds/morphing-blobs';
export { KitchenSteam } from './components/backgrounds/kitchen-steam';
export { AnimatedSteam } from './components/backgrounds/animated-steam';
export { FloatingFoodParticles } from './components/backgrounds/floating-food-particles';

// Landing page TypeScript interfaces for reusability
export type { ProgressIndicatorProps } from './components/landing/components/ProgressIndicator';
export type { ShareWidgetProps } from './components/landing/components/ShareWidget';
export type { ConfettiEffectProps } from './components/landing/effects/ConfettiEffect';
export type { WorkflowVisualizationProps } from './components/landing/components/workflow/WorkflowVisualization';
export type { WorkflowStepProps } from './components/landing/components/workflow/WorkflowStep';

// Hook exports
export * from './hooks';

// Motion system exports
export * from './motion';

// Utility exports
export * from './utils';

// Navigation component exports
export * from './navigation';

// Re-export specific utilities for convenience
export { cn } from './utils/cn';

// Provider exports
export { I18nProvider } from './providers/I18nProvider';
