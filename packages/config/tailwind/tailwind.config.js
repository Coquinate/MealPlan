/**
 * Tailwind CSS v4 Configuration
 * Semantic token-only configuration with OKLCH color system
 * @module tailwind-config
 */

import { designTokens } from './design-tokens.js';

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
    colors: {
      ...designTokens.colors,
      // Modern Hearth single-source tokens for anti-drift strategy
      primary: 'var(--color-primary)',
      'primary-warm': 'var(--color-primary-warm)',
      'primary-warm-light': 'var(--color-primary-warm-light)',
      'primary-warm-dark': 'var(--color-primary-warm-dark)',
      'accent-coral': 'var(--color-accent-coral)',
      'accent-coral-soft': 'var(--color-accent-coral-soft)',
      'accent-coral-deep': 'var(--color-accent-coral-deep)',
      'surface-glass': 'var(--color-surface-glass)',
      'surface-glass-elevated': 'var(--color-surface-glass-elevated)',
      'surface-glass-border': 'var(--color-surface-glass-border)',
    },
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

      // Modern Hearth ring colors for focus states
      ringColor: ({ theme }) => ({
        ...theme('colors'),
        'primary-warm': 'var(--color-primary-warm)',
        'accent-coral': 'var(--color-accent-coral)',
      }),

      ringOffsetColor: ({ theme }) => ({
        surface: 'var(--color-surface)',
        'surface-glass': 'var(--color-surface-glass)',
      }),

      // Custom properties for component states
      aria: {
        current: 'current="true"',
        selected: 'selected="true"',
        disabled: 'disabled="true"',
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
    function ({ addBase, theme }) {
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
      });
    },

    // Plugin to enforce semantic token usage
    function ({ addUtilities }) {
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
      });
    },

    // Modern Hearth Plugin - Glass Morphism & Focus States
    function ({ addUtilities }) {
      addUtilities({
        // Premium focus states with ring offset
        '.focus-premium': {
          '&:focus-visible': {
            outline: 'none',
            ringWidth: '2px',
            ringColor: 'var(--color-primary-warm)',
            ringOffsetWidth: '2px',
            ringOffsetColor: 'var(--color-surface)',
            transition: 'box-shadow 0.2s',
          },
        },

        // Glass morphism utilities
        '.glass': {
          background: 'var(--color-surface-glass)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid var(--color-surface-glass-border)',
          willChange: 'backdrop-filter',
          transform: 'translateZ(0)', // GPU acceleration
        },

        '.glass-elevated': {
          background: 'var(--color-surface-glass-elevated)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--color-surface-glass-border)',
        },

        // Motion policy utilities
        '.hover-lift': {
          transition: 'transform 0.2s ease-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },

        // Performance fallbacks
        '.performance-mode .glass': {
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          background: 'var(--color-surface)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      });
    },
  ],

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

    // Modern Hearth utilities
    'glass',
    'glass-elevated',
    'glass-input',
    'shadow-glow',
    'focus-premium',
    'focus-premium-warm',
    'focus-premium-coral',
    'focus-glass',
    'focus-high-contrast',
    'focus-skip',
    'hover-lift',
    'bg-primary',
    'bg-primary-600',
    'bg-primary-700',
    'bg-primary-warm',
    'bg-accent-coral',
    'bg-accent-coral-soft',
    'bg-accent-coral-deep',
    'text-primary',
    'text-primary-warm',
    'text-text-inverse',
    'text-accent-coral',
    'border-primary',
    'border-primary-warm',
    'border-accent-coral',
    'ring-primary',
    'ring-primary-warm',
    'ring-accent-coral',
    'font-display',
    'font-primary',
    'gradient-text',
    'gradient-primary',
    'gradient-accent',
    'animate-float',
    'floating-orb',
    'text-romanian',
  ],
};

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
    },
  },
};
