/**
 * Tailwind Configuration Exports
 * Central export point for all Tailwind-related configurations
 * @module @coquinate/config/tailwind
 */

export { designTokens, semanticColors, contextColors, freshnessColors, romanianFormats } from './design-tokens.js'
export { default as tailwindConfig, mealPlanPreset } from './tailwind.config.js'

// Re-export as default for convenience
import tailwindConfig from './tailwind.config.js'
export default tailwindConfig