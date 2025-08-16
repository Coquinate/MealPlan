/**
 * Design Token System for MealPlan Application
 * Tailwind CSS v4 Configuration with OKLCH Color System
 * @module design-tokens
 */

// Semantic Base Colors (Tailwind v4 Optimized - Flat Structure)
export const semanticColors = {
  // Modern Hearth Primary System - Warm Teal Evolution (using CSS variables)
  primary: 'var(--color-primary)', // Main brand - warm teal
  'primary-50': 'var(--color-primary-50)', // Lightest
  'primary-100': 'var(--color-primary-100)', // Very light
  'primary-200': 'var(--color-primary-200)', // Light
  'primary-300': 'var(--color-primary-300)', // Medium light
  'primary-400': 'var(--color-primary-400)', // Medium
  'primary-500': 'var(--color-primary-500)', // Base (DEFAULT)
  'primary-600': 'var(--color-primary-600)', // Medium dark
  'primary-700': 'var(--color-primary-700)', // Dark
  'primary-800': 'var(--color-primary-800)', // Very dark
  'primary-900': 'var(--color-primary-900)', // Darkest

  // Modern Hearth Warm Variants
  'primary-warm': 'var(--color-primary-warm)', // Warm teal main
  'primary-warm-light': 'var(--color-primary-warm-light)', // Light warm
  'primary-warm-dark': 'var(--color-primary-warm-dark)', // Dark warm

  // Grayscale system - Perfect for UI elements
  gray: 'oklch(50% 0 0)', // Base gray
  'gray-50': 'oklch(98% 0 0)', // Almost white
  'gray-100': 'oklch(96% 0 0)', // Very light
  'gray-200': 'oklch(92% 0 0)', // Light
  'gray-300': 'oklch(86% 0 0)', // Medium light
  'gray-400': 'oklch(70% 0 0)', // Medium
  'gray-500': 'oklch(50% 0 0)', // Base
  'gray-600': 'oklch(45% 0 0)', // Medium dark
  'gray-700': 'oklch(35% 0 0)', // Dark
  'gray-800': 'oklch(25% 0 0)', // Very dark
  'gray-900': 'oklch(15% 0 0)', // Darkest

  // Status colors - Flat for easy customization
  error: 'oklch(60% 0.2 25)', // Base error
  'error-50': 'oklch(96% 0.08 25)', // Error background
  'error-100': 'oklch(92% 0.12 25)', // Light error
  'error-500': 'oklch(60% 0.2 25)', // Base
  'error-700': 'oklch(45% 0.25 25)', // Dark error
  'error-900': 'oklch(30% 0.22 25)', // Darkest error

  success: 'oklch(65% 0.15 145)', // Base success
  'success-50': 'oklch(95% 0.06 145)', // Success background
  'success-100': 'oklch(90% 0.1 145)', // Light success
  'success-500': 'oklch(65% 0.15 145)', // Base
  'success-700': 'oklch(50% 0.18 145)', // Dark success
  'success-900': 'oklch(35% 0.16 145)', // Darkest success

  warning: 'oklch(75% 0.15 85)', // Base warning
  'warning-50': 'oklch(96% 0.06 85)', // Warning background
  'warning-100': 'oklch(92% 0.1 85)', // Light warning
  'warning-500': 'oklch(75% 0.15 85)', // Base
  'warning-700': 'oklch(65% 0.18 85)', // Dark warning
  'warning-900': 'oklch(45% 0.16 85)', // Darkest warning

  // Modern Hearth Coral Accent System (using CSS variables)
  'accent-coral': 'var(--color-accent-coral)', // Base coral accent
  'accent-coral-50': 'var(--color-accent-coral-50)', // Coral background
  'accent-coral-100': 'var(--color-accent-coral-100)', // Light coral
  'accent-coral-200': 'var(--color-accent-coral-200)', // Medium light coral
  'accent-coral-300': 'var(--color-accent-coral-300)', // Medium coral
  'accent-coral-400': 'var(--color-accent-coral-400)', // Coral
  'accent-coral-500': 'var(--color-accent-coral-500)', // Base (DEFAULT)
  'accent-coral-600': 'var(--color-accent-coral-600)', // Medium dark coral
  'accent-coral-700': 'var(--color-accent-coral-700)', // Dark coral
  'accent-coral-800': 'var(--color-accent-coral-800)', // Very dark coral
  'accent-coral-900': 'var(--color-accent-coral-900)', // Darkest coral

  // Modern Hearth Coral Variants
  'accent-coral-soft': 'var(--color-accent-coral-soft)', // Soft coral
  'accent-coral-deep': 'var(--color-accent-coral-deep)', // Deep coral

  // Surface system - Simplified hierarchy
  surface: 'oklch(98% 0 0)', // Base surface
  'surface-raised': 'oklch(100% 0 0)', // Elevated cards
  'surface-sunken': 'oklch(96% 0 0)', // Inset areas
  'surface-hover': 'oklch(94% 0 0)', // Hover states

  // Modern Hearth Glass Morphism Surfaces (using CSS variables)
  'surface-glass': 'var(--color-surface-glass)', // Glass base
  'surface-glass-elevated': 'var(--color-surface-glass-elevated)', // Elevated glass
  'surface-glass-border': 'var(--color-surface-glass-border)', // Glass borders
  'surface-glass-subtle': 'var(--color-surface-glass-subtle)', // Subtle glass

  // Text system - Multiple variants
  text: 'oklch(20% 0 0)', // Primary text
  'text-secondary': 'oklch(45% 0 0)', // Secondary text
  'text-muted': 'oklch(65% 0 0)', // Muted text
  'text-subtle': 'oklch(75% 0 0)', // Subtle text
  'text-inverse': 'oklch(95% 0 0)', // On dark backgrounds
  'text-disabled': 'oklch(80% 0 0)', // Disabled state

  // Border system - Multiple weights
  border: 'oklch(92% 0 0)', // Default border
  'border-strong': 'oklch(85% 0 0)', // Strong borders
  'border-subtle': 'oklch(96% 0 0)', // Subtle dividers
  'border-muted': 'oklch(94% 0 0)', // Muted borders
  'border-focus': 'oklch(58% 0.08 200)', // Focus borders - Updated to new primary
};

// Modern Hearth Dark Mode Colors (Expert Feedback: Reduce coral saturation by 10-15%)
export const darkModeColors = {
  // Primary warm teal in dark mode
  primary: 'oklch(65% 0.08 200)',
  'primary-50': 'oklch(25% 0.06 200)', // Inverted hierarchy for dark
  'primary-100': 'oklch(30% 0.06 200)',
  'primary-200': 'oklch(35% 0.07 200)',
  'primary-300': 'oklch(45% 0.07 200)',
  'primary-400': 'oklch(55% 0.08 200)',
  'primary-500': 'oklch(65% 0.08 200)', // Base (DEFAULT)
  'primary-600': 'oklch(70% 0.07 200)',
  'primary-700': 'oklch(75% 0.06 200)',
  'primary-800': 'oklch(80% 0.05 200)',
  'primary-900': 'oklch(90% 0.03 200)', // Lightest in dark

  'primary-warm': 'oklch(65% 0.08 200)',
  'primary-warm-light': 'oklch(75% 0.06 200)',
  'primary-warm-dark': 'oklch(55% 0.09 200)',

  // Modern coral accent - REDUCED saturation for dark mode (0.18 → 0.15, -17%)
  'accent-coral': 'oklch(75% 0.15 20)', // Reduced from 0.18 to 0.15
  'accent-coral-50': 'oklch(45% 0.13 20)', // Dark base
  'accent-coral-100': 'oklch(50% 0.13 20)',
  'accent-coral-200': 'oklch(55% 0.14 20)',
  'accent-coral-300': 'oklch(60% 0.14 20)',
  'accent-coral-400': 'oklch(65% 0.15 20)',
  'accent-coral-500': 'oklch(75% 0.15 20)', // Base
  'accent-coral-600': 'oklch(80% 0.14 20)',
  'accent-coral-700': 'oklch(85% 0.13 20)',
  'accent-coral-800': 'oklch(90% 0.12 20)',
  'accent-coral-900': 'oklch(95% 0.10 20)', // Lightest

  'accent-coral-soft': 'oklch(82% 0.10 20)', // Reduced from 0.12 to 0.10
  'accent-coral-deep': 'oklch(65% 0.17 20)', // For buttons with more contrast

  // Dark surfaces with warmth
  surface: 'oklch(15% 0.01 200)', // Slight teal tint
  'surface-raised': 'oklch(18% 0.01 200)',
  'surface-sunken': 'oklch(12% 0.01 200)',
  'surface-hover': 'oklch(20% 0.01 200)',
  'surface-glass': 'var(--color-surface-glass)',
  'surface-glass-elevated': 'var(--color-surface-glass-elevated)',
  'surface-glass-border': 'var(--color-surface-glass-border)',
  'surface-glass-subtle': 'var(--color-surface-glass-subtle)',

  // Text hierarchy for dark
  text: 'oklch(92% 0 0)',
  'text-secondary': 'oklch(70% 0 0)',
  'text-muted': 'oklch(50% 0 0)',
  'text-subtle': 'oklch(40% 0 0)',
  'text-inverse': 'oklch(15% 0 0)',
  'text-disabled': 'oklch(45% 0 0)',

  // Borders softer in dark
  border: 'oklch(25% 0.01 200)',
  'border-strong': 'oklch(35% 0.01 200)',
  'border-subtle': 'oklch(20% 0.01 200)',
  'border-muted': 'oklch(22% 0.01 200)',
  'border-focus': 'oklch(65% 0.08 200)',
};

// Context-Aware Color Modes (Updated for Modern Hearth)
export const contextColors = {
  // Planning Mode - Calm decision-making with warm teal
  planning: {
    primary: 'oklch(58% 0.08 200)', // Modern Hearth warm teal
    surface: 'oklch(98% 0 0)', // Clean white
    'surface-raised': 'oklch(100% 0 0)', // Pure white cards
    text: 'oklch(20% 0 0)', // Near black
    'text-secondary': 'oklch(45% 0 0)', // Subdued gray
    border: 'oklch(92% 0 0)', // Light borders
  },

  // Shopping Mode - High contrast for stores/sunlight
  shopping: {
    primary: 'oklch(20% 0 0)', // Maximum contrast black
    surface: 'oklch(100% 0 0)', // Pure white
    checked: 'oklch(55% 0.18 145)', // Check-off green
    text: 'oklch(10% 0 0)', // Pure black
    highlight: 'oklch(95% 0.15 85)', // Yellow highlight
    border: 'oklch(85% 0 0)', // Stronger borders
  },

  // Cooking Mode - Warm and engaging
  cooking: {
    primary: 'oklch(65% 0.18 35)', // Energetic orange
    surface: 'oklch(98% 0.02 40)', // Warm white
    'active-step': 'oklch(70% 0.2 30)', // Current step highlight
    'timer-urgent': 'oklch(60% 0.2 25)', // Timer warning
    complete: 'oklch(65% 0.15 145)', // Step complete
    text: 'oklch(25% 0.02 40)', // Warm black
  },
};

// Food Freshness Indicator Colors (Sustainability Feature)
export const freshnessColors = {
  fresh: 'oklch(65% 0.15 145)', // >7 days - green
  good: 'oklch(70% 0.08 145)', // 4-7 days - muted green
  'use-soon': 'oklch(75% 0.15 85)', // 2-3 days - yellow
  'use-today': 'oklch(70% 0.18 45)', // 1 day - orange
  expired: 'oklch(60% 0.2 25)', // 0 days - red
};

// Modern Hearth Font Families (Shared Design System)
export const fontFamily = {
  // Primary body font - Inter with Romanian support
  primary: [
    'var(--font-inter)',
    '"Inter"',
    '"Inter var"',
    'Roboto', // Better Romanian diacritics support
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'system-ui',
    'sans-serif',
  ],

  // Display font - Lexend for warm, readable headlines
  display: ['var(--font-lexend)', '"Lexend"', '"Lexend var"', '"Inter"', 'system-ui', 'sans-serif'],

  // Monospace for nutritional data and timers (unchanged)
  mono: [
    '"SF Mono"',
    '"Monaco"',
    '"Inconsolata"',
    '"Fira Code"',
    '"Fira Mono"',
    '"Droid Sans Mono"',
    '"Courier New"',
    'monospace',
  ],
};

// Font Size & Line Height Scale
export const fontSize = {
  // Context-aware sizes
  'meal-title': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }], // 24px - Planning
  'recipe-name': ['1.125rem', { lineHeight: '1.4', fontWeight: '500' }], // 18px - Clickable
  description: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px - Secondary
  tags: ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }], // 12px - Compact

  // Shopping/Cooking Context (Never below 18px in kitchen/store)
  'list-item': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }], // 18px minimum
  'current-step': ['1.25rem', { lineHeight: '1.5', fontWeight: '500' }], // 20px - Active focus
  timer: ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }], // 28px - Glanceable
  ingredients: ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }], // 18px minimum
  'next-step': ['1rem', { lineHeight: '1.5', fontWeight: '400' }], // 16px - Preview

  // Standard sizes
  xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
  base: ['1rem', { lineHeight: '1.5rem' }], // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
};

// Font Weight Scale
export const fontWeight = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Full Spacing Scale (4px Base System - Tailwind v4 Optimized)
export const spacing = {
  // Semantic spacing - Flat structure for easy customization
  'space-xs': '4px', // Inline elements, tight spacing
  'space-sm': '8px', // Related items, component internal
  'space-md': '16px', // Section spacing, card padding
  'space-lg': '24px', // Group separation, component gaps
  'space-xl': '32px', // Major sections, page regions
  'space-2xl': '48px', // Page sections, hero spacing
  'space-3xl': '64px', // Large separations
  'space-4xl': '80px', // Maximum spacing

  // Component-specific spacing
  'touch-target': '44px', // Minimum touch target (Apple HIG)
  'touch-spacing': '8px', // Minimum between touch targets
  'focus-offset': '2px', // Focus outline offset
  'focus-width': '3px', // Focus outline width

  // Micro-spacing for fine control
  'micro-1': '1px', // Hairline borders
  'micro-2': '2px', // Fine adjustments
  'micro-3': '3px', // Small details

  // Enhanced Tailwind scale (more variants)
  0: '0px',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  4.5: '18px', // Added more granular control
  5: '20px',
  5.5: '22px', // Added
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px', // Standard touch target
  12: '48px',
  13: '52px', // Added
  14: '56px',
  15: '60px', // Added
  16: '64px',
  18: '72px', // Added
  20: '80px',
  22: '88px', // Added
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px', // Added
  40: '160px', // Added
  44: '176px', // Added
  48: '192px', // Added
  52: '208px', // Added
  56: '224px', // Added
  60: '240px', // Added
  64: '256px', // Added
  72: '288px', // Added
  80: '320px', // Added
  96: '384px', // Added
};

// Border Radius Values
export const borderRadius = {
  none: '0px',
  sm: '4px', // Small elements, buttons
  md: '8px', // Cards, inputs (DEFAULT)
  lg: '12px', // Large cards, modals
  xl: '16px', // Hero cards
  full: '9999px', // Pills, avatars

  // Semantic names
  button: '8px',
  card: '12px',
  input: '8px',
  modal: '16px',
};

// Shadow/Elevation System
export const boxShadow = {
  none: 'none',

  // Subtle depth system
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Subtle borders
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Cards
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Modals
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // Dropdowns

  // Semantic shadows
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  button: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

  // Context-specific shadows
  'meal-card': '0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
  'meal-card-hover': '0 4px 8px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)',

  // Focus shadows
  'focus-ring': '0 0 0 3px rgba(59, 130, 246, 0.5)',
};

// Animation Timing Tokens
export const animation = {
  // Durations
  'duration-instant': '50ms',
  'duration-fast': '150ms',
  'duration-normal': '250ms',
  'duration-slow': '350ms',
  'duration-slower': '500ms',

  // Easings
  'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// Breakpoints (Mobile-First)
export const screens = {
  sm: '640px', // Small devices
  md: '768px', // Tablets
  lg: '1024px', // Laptops
  xl: '1280px', // Desktop
  '2xl': '1536px', // Large screens
};

// Z-Index Scale
export const zIndex = {
  0: '0',
  10: '10', // Base level
  20: '20', // Elevated cards
  30: '30', // Sticky elements
  40: '40', // Fixed headers
  50: '50', // Dropdowns
  60: '60', // Modals
  70: '70', // Notifications
  80: '80', // Tooltips
  90: '90', // Critical overlays
  100: '100', // Maximum priority
};

// Opacity Scale
export const opacity = {
  0: '0', // Fully transparent
  5: '0.05', // Barely visible
  10: '0.1', // Very subtle
  20: '0.2', // Subtle
  30: '0.3', // Light
  40: '0.4', // Medium-light
  50: '0.5', // Half opacity
  60: '0.6', // Medium-dark
  70: '0.7', // Dark
  80: '0.8', // Heavy
  90: '0.9', // Nearly opaque
  95: '0.95', // Almost opaque
  100: '1', // Fully opaque
};

// Component-specific widths
export const width = {
  // Meal card widths
  'meal-card-mobile': '280px', // Mobile carousel width
  'meal-card-desktop': '100%', // Desktop grid fill

  // Modal widths (handled by max-w classes)
  'toast-max': '420px', // Toast notification max width

  // Form elements
  'input-min': '200px', // Minimum input width
  'select-min': '150px', // Minimum select width
};

// Ring widths for focus states
export const ringWidth = {
  0: '0px',
  1: '1px',
  2: '2px',
  3: '3px', // Default focus ring
  4: '4px',
  8: '8px',
};

// Ring offset widths
export const ringOffsetWidth = {
  0: '0px',
  1: '1px',
  2: '2px', // Default offset
  4: '4px',
  8: '8px',
};

// Line clamp for text truncation
export const lineClamp = {
  1: '1', // Single line
  2: '2', // Two lines
  3: '3', // Three lines
  4: '4', // Four lines
  5: '5', // Five lines
  6: '6', // Six lines
  none: 'none', // No clamping
};

// Transform scale values
export const scale = {
  0: '0',
  50: '.5',
  75: '.75',
  90: '.9',
  95: '.95',
  100: '1',
  105: '1.05',
  110: '1.1',
  125: '1.25',
  150: '1.5',
};

// Rotate values
export const rotate = {
  0: '0deg',
  1: '1deg',
  2: '2deg',
  3: '3deg',
  6: '6deg',
  12: '12deg',
  45: '45deg',
  90: '90deg',
  180: '180deg',
};

// Blur values for backdrop filters
export const blur = {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
};

// Max width values for containers
export const maxWidth = {
  none: 'none',
  xs: '20rem', // 320px
  sm: '24rem', // 384px
  md: '28rem', // 448px
  lg: '32rem', // 512px
  xl: '36rem', // 576px
  '2xl': '42rem', // 672px
  '3xl': '48rem', // 768px
  '4xl': '56rem', // 896px
  '5xl': '64rem', // 1024px
  '6xl': '72rem', // 1152px
  '7xl': '80rem', // 1280px
  full: '100%',
  prose: '65ch', // Readable width
};

// Aspect ratios
export const aspectRatio = {
  auto: 'auto',
  square: '1 / 1',
  video: '16 / 9',
  portrait: '3 / 4',
  landscape: '4 / 3',
};

// Grid template columns
export const gridTemplateColumns = {
  none: 'none',
  1: 'repeat(1, minmax(0, 1fr))',
  2: 'repeat(2, minmax(0, 1fr))',
  3: 'repeat(3, minmax(0, 1fr))',
  4: 'repeat(4, minmax(0, 1fr))',
  5: 'repeat(5, minmax(0, 1fr))',
  6: 'repeat(6, minmax(0, 1fr))',
  7: 'repeat(7, minmax(0, 1fr))', // Week view
  12: 'repeat(12, minmax(0, 1fr))',
  // Custom meal grid layouts
  'meal-week': 'repeat(7, minmax(280px, 1fr))', // Desktop week view
  'meal-day': 'repeat(4, 1fr)', // Meals per day
};

// Grid template rows
export const gridTemplateRows = {
  none: 'none',
  1: 'repeat(1, minmax(0, 1fr))',
  2: 'repeat(2, minmax(0, 1fr))',
  3: 'repeat(3, minmax(0, 1fr))',
  4: 'repeat(4, minmax(0, 1fr))', // Meal types
  5: 'repeat(5, minmax(0, 1fr))',
  6: 'repeat(6, minmax(0, 1fr))',
};

// Transition durations (matching our animation tokens)
export const transitionDuration = {
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',
  300: '300ms',
  500: '500ms',
  700: '700ms',
  1000: '1000ms',
};

// Transition timing functions
export const transitionTimingFunction = {
  DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// Romanian-Specific Formatting Tokens
export const romanianFormats = {
  // Number formatting
  numberFormat: {
    locale: 'ro-RO',
    decimal: ',',
    thousands: '.',
    precision: 2,
  },

  // Currency formatting
  currencyFormat: {
    locale: 'ro-RO',
    currency: 'RON',
    symbol: 'lei',
    position: 'suffix', // "25 lei"
    spacing: true,
  },

  // Date formatting
  dateFormat: {
    locale: 'ro-RO',
    weekStartsOn: 1, // Monday
    formats: {
      short: 'DD.MM.YYYY',
      long: 'D MMMM YYYY',
      dayMonth: 'D MMM',
      weekday: 'dddd',
      time: 'HH:mm',
    },
  },

  // Time formatting
  timeFormat: {
    use24Hour: true,
    separator: ':',
  },
};

// Complete Design Tokens Export
export const designTokens = {
  colors: {
    ...semanticColors,
    dark: darkModeColors,
    context: contextColors,
    freshness: freshnessColors,
  },
  fontFamily,
  fontSize,
  fontWeight,
  spacing,
  borderRadius,
  boxShadow,
  animation,
  screens,
  zIndex,
  opacity,
  width,
  ringWidth,
  ringOffsetWidth,
  lineClamp,
  scale,
  rotate,
  blur,
  maxWidth,
  aspectRatio,
  gridTemplateColumns,
  gridTemplateRows,
  transitionDuration,
  transitionTimingFunction,
  romanian: romanianFormats,
};

// Romanian utilities alias
export const romanianUtils = romanianFormats;

// Default export for Tailwind config
export default designTokens;
