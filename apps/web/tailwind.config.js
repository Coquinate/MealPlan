/**
 * Tailwind CSS Configuration for Web App
 * Maps design tokens to utility classes for UI components
 */

import { designTokens } from '@coquinate/config/tailwind/design-tokens';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Include design system components
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // Colors - Map design tokens to semantic classes
      colors: {
        // Primary color system
        primary: {
          DEFAULT: designTokens.colors.primary,
          50: designTokens.colors['primary-50'],
          100: designTokens.colors['primary-100'],
          200: designTokens.colors['primary-200'],
          300: designTokens.colors['primary-300'],
          400: designTokens.colors['primary-400'],
          500: designTokens.colors['primary-500'],
          600: designTokens.colors['primary-600'],
          700: designTokens.colors['primary-700'],
          800: designTokens.colors['primary-800'],
          900: designTokens.colors['primary-900'],
        },

        // Gray system
        gray: {
          DEFAULT: designTokens.colors.gray,
          50: designTokens.colors['gray-50'],
          100: designTokens.colors['gray-100'],
          200: designTokens.colors['gray-200'],
          300: designTokens.colors['gray-300'],
          400: designTokens.colors['gray-400'],
          500: designTokens.colors['gray-500'],
          600: designTokens.colors['gray-600'],
          700: designTokens.colors['gray-700'],
          800: designTokens.colors['gray-800'],
          900: designTokens.colors['gray-900'],
        },

        // Status colors
        error: {
          DEFAULT: designTokens.colors.error,
          50: designTokens.colors['error-50'],
          100: designTokens.colors['error-100'],
          500: designTokens.colors['error-500'],
          700: designTokens.colors['error-700'],
          900: designTokens.colors['error-900'],
        },

        success: {
          DEFAULT: designTokens.colors.success,
          50: designTokens.colors['success-50'],
          100: designTokens.colors['success-100'],
          500: designTokens.colors['success-500'],
          700: designTokens.colors['success-700'],
          900: designTokens.colors['success-900'],
        },

        warning: {
          DEFAULT: designTokens.colors.warning,
          50: designTokens.colors['warning-50'],
          100: designTokens.colors['warning-100'],
          500: designTokens.colors['warning-500'],
          700: designTokens.colors['warning-700'],
          900: designTokens.colors['warning-900'],
        },

        // Semantic surface colors
        surface: designTokens.colors.surface,
        'surface-raised': designTokens.colors['surface-raised'],
        'surface-sunken': designTokens.colors['surface-sunken'],
        'surface-hover': designTokens.colors['surface-hover'],

        // Semantic text colors
        text: {
          DEFAULT: designTokens.colors.text,
          secondary: designTokens.colors['text-secondary'],
          muted: designTokens.colors['text-muted'],
          subtle: designTokens.colors['text-subtle'],
          inverse: designTokens.colors['text-inverse'],
          disabled: designTokens.colors['text-disabled'],
        },

        // Border colors
        border: {
          DEFAULT: designTokens.colors.border,
          strong: designTokens.colors['border-strong'],
          subtle: designTokens.colors['border-subtle'],
          muted: designTokens.colors['border-muted'],
          focus: designTokens.colors['border-focus'],
        },

        // Background convenience
        background: designTokens.colors.surface,
      },

      // Semantic font sizes matching component usage
      fontSize: {
        ...designTokens.fontSize,
        // Specific semantic sizes for components
        'heading-xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '600' }],
        'heading-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
        'heading-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'heading-lg': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '700' }],
        'heading-xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        'heading-2xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '800' }],
        'heading-3xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '800' }],
      },

      // Semantic spacing with original scale plus semantic names
      spacing: {
        ...designTokens.spacing,
      },

      // Semantic border radius
      borderRadius: {
        ...designTokens.borderRadius,
        button: designTokens.borderRadius.md, // 8px for buttons
        card: designTokens.borderRadius.lg, // 12px for cards
        input: designTokens.borderRadius.md, // 8px for inputs
        modal: designTokens.borderRadius.xl, // 16px for modals
      },

      // Box shadow system
      boxShadow: {
        ...designTokens.boxShadow,
      },
    },
  },

  plugins: [],
};
