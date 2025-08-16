/**
 * Tailwind configuration for UI components package
 */
import baseConfig from '@coquinate/config/tailwind/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './.storybook/**/*.{js,ts,jsx,tsx,mdx}',
    './src/stories/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
      // Add animation keyframes for Radix UI animations
      keyframes: {
        in: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        out: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'zoom-in': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'zoom-out': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.95)' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-left': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-from-right': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        in: 'in 150ms ease-out',
        out: 'out 150ms ease-in',
        'fade-in': 'fade-in 150ms ease-out',
        'fade-out': 'fade-out 150ms ease-in',
        'zoom-in-95': 'zoom-in 150ms ease-out',
        'zoom-out-95': 'zoom-out 150ms ease-in',
        'slide-in-from-top-2': 'slide-in-from-top 150ms ease-out',
        'slide-in-from-bottom-2': 'slide-in-from-bottom 150ms ease-out',
        'slide-in-from-left-2': 'slide-in-from-left 150ms ease-out',
        'slide-in-from-right-2': 'slide-in-from-right 150ms ease-out',
      },
    },
  },
  plugins: [
    ...baseConfig.plugins,
    // Plugin for animation utilities
    function ({ addUtilities }) {
      addUtilities({
        '.animate-in': {
          animationName: 'in',
          animationDuration: '150ms',
          '--tw-enter-opacity': 'initial',
          '--tw-enter-scale': 'initial',
          '--tw-enter-rotate': 'initial',
          '--tw-enter-translate-x': 'initial',
          '--tw-enter-translate-y': 'initial',
        },
        '.animate-out': {
          animationName: 'out',
          animationDuration: '150ms',
          '--tw-exit-opacity': 'initial',
          '--tw-exit-scale': 'initial',
          '--tw-exit-rotate': 'initial',
          '--tw-exit-translate-x': 'initial',
          '--tw-exit-translate-y': 'initial',
        },
        '.fade-in-0': { '--tw-enter-opacity': '0' },
        '.fade-out-0': { '--tw-exit-opacity': '0' },
        '.zoom-in-95': { '--tw-enter-scale': '.95' },
        '.zoom-out-95': { '--tw-exit-scale': '.95' },
        '.slide-in-from-top-2': { '--tw-enter-translate-y': '-0.5rem' },
        '.slide-in-from-bottom-2': { '--tw-enter-translate-y': '0.5rem' },
        '.slide-in-from-left-2': { '--tw-enter-translate-x': '-0.5rem' },
        '.slide-in-from-right-2': { '--tw-enter-translate-x': '0.5rem' },
      });
    },
  ],
};
