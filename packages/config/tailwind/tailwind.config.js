/**
 * Tailwind CSS v4 Configuration
 * Semantic token-only configuration with OKLCH color system
 * @module tailwind-config
 */

import { designTokens } from './design-tokens.js'

/** @type {import('tailwindcss').Config} */
export default {
  // Content paths will be configured per app
  content: [],
  
  // Disable arbitrary values - ONLY semantic tokens allowed
  blocklist: [
    // Block all arbitrary values
    /\[.*\]/,
  ],
  
  theme: {
    // Strict mode - replace ALL defaults with our tokens
    colors: designTokens.colors,
    fontFamily: designTokens.fontFamily,
    fontSize: designTokens.fontSize,
    fontWeight: designTokens.fontWeight,
    spacing: designTokens.spacing,
    borderRadius: designTokens.borderRadius,
    boxShadow: designTokens.boxShadow,
    screens: designTokens.screens,
    zIndex: designTokens.zIndex,
    opacity: designTokens.opacity,
    width: designTokens.width,
    ringWidth: designTokens.ringWidth,
    ringOffsetWidth: designTokens.ringOffsetWidth,
    lineClamp: designTokens.lineClamp,
    scale: designTokens.scale,
    rotate: designTokens.rotate,
    blur: designTokens.blur,
    maxWidth: designTokens.maxWidth,
    aspectRatio: designTokens.aspectRatio,
    gridTemplateColumns: designTokens.gridTemplateColumns,
    gridTemplateRows: designTokens.gridTemplateRows,
    transitionDuration: designTokens.transitionDuration,
    transitionTimingFunction: designTokens.transitionTimingFunction,
    
    extend: {
      // Context-aware CSS variables for runtime switching
      backgroundColor: ({ theme }) => ({
        ...theme('colors'),
        'context-primary': 'var(--color-primary)',
        'context-surface': 'var(--color-surface)',
        'context-surface-raised': 'var(--color-surface-raised)',
      }),
      
      textColor: ({ theme }) => ({
        ...theme('colors'),
        'context-text': 'var(--color-text)',
        'context-text-secondary': 'var(--color-text-secondary)',
      }),
      
      borderColor: ({ theme }) => ({
        ...theme('colors'),
        'context-border': 'var(--color-border)',
      }),
      
      // Custom properties for component states
      aria: {
        'current': 'current="true"',
        'selected': 'selected="true"',
        'disabled': 'disabled="true"',
      },
      
      // Data attributes for context modes
      data: {
        'mode-planning': 'mode="planning"',
        'mode-shopping': 'mode="shopping"',
        'mode-cooking': 'mode="cooking"',
      },
    },
  },
  
  plugins: [
    // Plugin to add CSS variables for runtime theming
    function({ addBase, theme }) {
      addBase({
        ':root': {
          // Default to planning mode colors
          '--color-primary': theme('colors.primary'),
          '--color-surface': theme('colors.surface'),
          '--color-surface-raised': theme('colors.surface-raised'),
          '--color-text': theme('colors.text'),
          '--color-text-secondary': theme('colors.text-secondary'),
          '--color-border': theme('colors.border'),
        },
        
        // Planning mode (default)
        '[data-mode="planning"]': {
          '--color-primary': theme('colors.context.planning.primary'),
          '--color-surface': theme('colors.context.planning.surface'),
          '--color-surface-raised': theme('colors.context.planning.surface-raised'),
          '--color-text': theme('colors.context.planning.text'),
          '--color-text-secondary': theme('colors.context.planning.text-secondary'),
          '--color-border': theme('colors.context.planning.border'),
        },
        
        // Shopping mode
        '[data-mode="shopping"]': {
          '--color-primary': theme('colors.context.shopping.primary'),
          '--color-surface': theme('colors.context.shopping.surface'),
          '--color-text': theme('colors.context.shopping.text'),
          '--color-border': theme('colors.context.shopping.border'),
          '--color-checked': theme('colors.context.shopping.checked'),
          '--color-highlight': theme('colors.context.shopping.highlight'),
        },
        
        // Cooking mode
        '[data-mode="cooking"]': {
          '--color-primary': theme('colors.context.cooking.primary'),
          '--color-surface': theme('colors.context.cooking.surface'),
          '--color-text': theme('colors.context.cooking.text'),
          '--color-active-step': theme('colors.context.cooking.active-step'),
          '--color-timer-urgent': theme('colors.context.cooking.timer-urgent'),
          '--color-complete': theme('colors.context.cooking.complete'),
        },
      })
    },
    
    // Plugin to enforce semantic token usage
    function({ addUtilities }) {
      // Add utility classes for context modes
      addUtilities({
        '.mode-planning': {
          '&': {
            'data-mode': 'planning',
          },
        },
        '.mode-shopping': {
          '&': {
            'data-mode': 'shopping',
          },
        },
        '.mode-cooking': {
          '&': {
            'data-mode': 'cooking',
          },
        },
      })
    },
  ],
  
  // Disable features that allow arbitrary values
  corePlugins: {
    // Disable arbitrary value support
    arbitraryValues: false,
  },
  
  // SafeList for dynamic classes
  safelist: [
    // Color modes
    'mode-planning',
    'mode-shopping',
    'mode-cooking',
    
    // Common state classes
    'text-error',
    'text-success',
    'text-warning',
    'bg-error-50',
    'bg-success-50',
    'bg-warning-50',
    'border-error',
    'border-success',
    'border-warning',
    
    // Freshness indicators
    'text-fresh',
    'text-good',
    'text-use-soon',
    'text-use-today',
    'text-expired',
  ],
}

// Export a preset for apps to use
export const mealPlanPreset = {
  theme: {
    extend: {
      colors: designTokens.colors,
      fontFamily: designTokens.fontFamily,
      fontSize: designTokens.fontSize,
      fontWeight: designTokens.fontWeight,
      spacing: designTokens.spacing,
      borderRadius: designTokens.borderRadius,
      boxShadow: designTokens.boxShadow,
      screens: designTokens.screens,
      zIndex: designTokens.zIndex,
      opacity: designTokens.opacity,
      width: designTokens.width,
      ringWidth: designTokens.ringWidth,
      ringOffsetWidth: designTokens.ringOffsetWidth,
      lineClamp: designTokens.lineClamp,
      scale: designTokens.scale,
      rotate: designTokens.rotate,
      blur: designTokens.blur,
      maxWidth: designTokens.maxWidth,
      aspectRatio: designTokens.aspectRatio,
      gridTemplateColumns: designTokens.gridTemplateColumns,
      gridTemplateRows: designTokens.gridTemplateRows,
      transitionDuration: designTokens.transitionDuration,
      transitionTimingFunction: designTokens.transitionTimingFunction,
    }
  }
}