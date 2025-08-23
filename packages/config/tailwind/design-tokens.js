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

  // Grayscale system - Unified with CSS variables for theming
  gray: 'var(--color-gray)', // Base gray
  'gray-50': 'var(--color-gray-50)', // Almost white
  'gray-100': 'var(--color-gray-100)', // Very light
  'gray-200': 'var(--color-gray-200)', // Light
  'gray-300': 'var(--color-gray-300)', // Medium light
  'gray-400': 'var(--color-gray-400)', // Medium
  'gray-600': 'var(--color-gray-600)', // Medium dark
  'gray-700': 'var(--color-gray-700)', // Dark
  'gray-800': 'var(--color-gray-800)', // Very dark
  'gray-900': 'var(--color-gray-900)', // Darkest

  // Status colors - Complete CSS variable scales for consistent theming
  error: 'var(--color-error)', // Base error (500)
  'error-50': 'var(--color-error-50)', // Lightest error
  'error-100': 'var(--color-error-100)', // Very light error
  'error-200': 'var(--color-error-200)', // Light error
  'error-300': 'var(--color-error-300)', // Medium-light error
  'error-400': 'var(--color-error-400)', // Medium error
  'error-500': 'var(--color-error-500)', // Base error
  'error-600': 'var(--color-error-600)', // Medium-dark error
  'error-700': 'var(--color-error-700)', // Dark error
  'error-800': 'var(--color-error-800)', // Very dark error
  'error-900': 'var(--color-error-900)', // Darkest error

  success: 'var(--color-success)', // Base success (500)
  'success-50': 'var(--color-success-50)', // Lightest success
  'success-100': 'var(--color-success-100)', // Very light success
  'success-200': 'var(--color-success-200)', // Light success
  'success-300': 'var(--color-success-300)', // Medium-light success
  'success-400': 'var(--color-success-400)', // Medium success
  'success-500': 'var(--color-success-500)', // Base success
  'success-600': 'var(--color-success-600)', // Medium-dark success
  'success-700': 'var(--color-success-700)', // Dark success
  'success-800': 'var(--color-success-800)', // Very dark success
  'success-900': 'var(--color-success-900)', // Darkest success

  warning: 'var(--color-warning)', // Base warning (500)
  'warning-50': 'var(--color-warning-50)', // Lightest warning
  'warning-100': 'var(--color-warning-100)', // Very light warning
  'warning-200': 'var(--color-warning-200)', // Light warning
  'warning-300': 'var(--color-warning-300)', // Medium-light warning
  'warning-400': 'var(--color-warning-400)', // Medium warning
  'warning-500': 'var(--color-warning-500)', // Base warning
  'warning-600': 'var(--color-warning-600)', // Medium-dark warning
  'warning-700': 'var(--color-warning-700)', // Dark warning
  'warning-800': 'var(--color-warning-800)', // Very dark warning
  'warning-900': 'var(--color-warning-900)', // Darkest warning

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

  // Surface system - Unified CSS variables for theming
  surface: 'var(--color-surface)', // Base surface
  'surface-white': 'var(--color-surface-white)', // Pure white (for nav, cards)
  'surface-eggshell': 'var(--color-surface-eggshell)', // Eggshell background (from mockup)
  'surface-raised': 'var(--color-surface-raised)', // Elevated cards
  'surface-sunken': 'var(--color-surface-sunken)', // Inset areas
  'surface-hover': 'var(--color-surface-hover)', // Hover states
  
  // Coming Soon Page Surface Variants - Subtle differentiation
  'surface-section': 'var(--color-surface-section)', // Subtle section background
  'surface-highlight': 'var(--color-surface-highlight)', // Highlighted sections
  'surface-muted': 'var(--color-surface-muted)', // Muted gray background

  // Modern Hearth Glass Morphism Surfaces (using CSS variables)
  'surface-glass': 'var(--color-surface-glass)', // Glass base
  'surface-glass-elevated': 'var(--color-surface-glass-elevated)', // Elevated glass
  'surface-glass-border': 'var(--color-surface-glass-border)', // Glass borders
  'surface-glass-subtle': 'var(--color-surface-glass-subtle)', // Subtle glass
  
  // Glass transparency levels for components
  'white/95': 'rgba(255, 255, 255, 0.95)', // Almost opaque white
  'white/80': 'rgba(255, 255, 255, 0.80)', // Email capture background
  'white/75': 'rgba(255, 255, 255, 0.75)', // Progress indicator background
  'white/60': 'rgba(255, 255, 255, 0.60)', // Header on scroll

  // Text system - Unified CSS variables for theming
  text: 'var(--color-text)', // Primary text
  'text-secondary': 'var(--color-text-secondary)', // Secondary text
  'text-muted': 'var(--color-text-muted)', // Muted text
  'text-subtle': 'var(--color-text-subtle)', // Subtle text
  'text-inverse': 'var(--color-text-inverse)', // On dark backgrounds
  'text-disabled': 'var(--color-text-disabled)', // Disabled state

  // Border system - Unified CSS variables for theming
  border: 'var(--color-border)', // Default border
  'border-light': 'var(--color-border-light)', // Light borders (for sections)
  'border-strong': 'var(--color-border-strong)', // Strong borders
  'border-subtle': 'var(--color-border-subtle)', // Subtle dividers
  'border-muted': 'var(--color-border-muted)', // Muted borders
  'border-focus': 'var(--color-border-focus)', // Focus borders - Updated to new primary
  
  // Border transparency variants
  'border-light/60': 'oklch(94% 0 0 / 0.6)', // Header normal state
  'border-light/50': 'oklch(94% 0 0 / 0.5)', // Semi-transparent
  'border-light/40': 'oklch(94% 0 0 / 0.4)', // Email capture
  'border-light/30': 'oklch(94% 0 0 / 0.3)', // Progress indicator
  'gray-200/30': 'oklch(92% 0 0 / 0.3)', // Gray border 30%
  'gray-200/20': 'oklch(92% 0 0 / 0.2)', // Gray border 20%
  'gray-700/50': 'oklch(35% 0 0 / 0.5)', // Dark gray border 50%
  'gray-700/30': 'oklch(35% 0 0 / 0.3)', // Dark gray border 30%
  'accent-coral/30': 'oklch(70% 0.18 20 / 0.3)', // Coral border 30%

  // Dark surface variants for feature sections - CSS variables for consistency
  'dark-surface': 'var(--color-dark-surface)', // Dark background with subtle teal
  'dark-surface-raised': 'var(--color-dark-surface-raised)', // Elevated dark cards
  
  // Dark mode transparency variants
  'black/70': 'rgba(0, 0, 0, 0.70)', // Header dark mode on scroll 70%
  'black/60': 'rgba(0, 0, 0, 0.60)', // Header dark mode on scroll 60%
  'text-light': 'var(--color-text-light)', // Light text for dark backgrounds
  
  // Brand colors for social media integrations
  'brand-facebook': '#1877F2', // Facebook brand blue
  'brand-facebook-hover': '#166FE5', // Facebook hover blue
  'brand-whatsapp': '#25D366', // WhatsApp brand green
  'brand-whatsapp-hover': '#22C55E', // WhatsApp hover green
  
  // Semantic text colors - Unified CSS variables (formerly surface-XX tokens)
  'text-muted-secondary': 'var(--color-text-muted-secondary)', // Medium gray text (was surface-60)
  'text-high-contrast': 'var(--color-text-high-contrast)', // Dark text (was surface-20)
  'text-medium-contrast': 'var(--color-text-medium-contrast)', // Medium dark text (was surface-45)
  // Note: border-light and border-subtle already defined above in border system
};

// UNIFIED DARK MODE STRATEGY
// ===========================
// Dark mode is now handled through CSS variables defined in the global CSS.
// All colors in semanticColors use var(--color-*) which automatically adapt
// to light/dark themes through CSS custom properties.
//
// Benefits:
// - Single source of truth for colors
// - Runtime theme switching
// - Easier maintenance and consistency
// - Better performance (no duplicate definitions)
//
// Implementation:
// Light mode values are defined as :root CSS variables
// Dark mode values override these in .dark or [data-theme="dark"] selectors
//
// Example CSS structure:
// :root {
//   --color-primary: /* light mode primary color */;
//   --color-surface: /* light mode surface color */;
// }
// .dark {
//   --color-primary: /* dark mode primary color */;
//   --color-surface: /* dark mode surface color */;
// }

// Context-Aware Color Modes - Unified with CSS Variables (Duplications Removed)
export const contextColors = {
  // Planning Mode - Uses default color system (references base colors)
  planning: {
    primary: 'var(--color-primary)', // References main primary color
    surface: 'var(--color-surface)', // References main surface
    'surface-raised': 'var(--color-surface-raised)', // References main raised surface
    text: 'var(--color-text)', // References main text
    'text-secondary': 'var(--color-text-secondary)', // References main secondary text
    border: 'var(--color-border)', // References main border
  },

  // Shopping Mode - High contrast for stores/sunlight (unique values only)
  shopping: {
    primary: 'var(--color-gray-900)', // Maximum contrast - reference existing gray
    surface: 'var(--color-surface-white)', // Pure white
    checked: 'var(--color-success)', // Check-off green - reference success
    text: 'var(--color-gray-900)', // Pure black - reference existing gray
    highlight: 'var(--color-warning-100)', // Yellow highlight - reference warning light
    border: 'var(--color-border-strong)', // Stronger borders - reference existing
  },

  // Cooking Mode - Warm and engaging (unique context-specific colors)
  cooking: {
    primary: 'var(--color-cooking-primary)', // Energetic orange - unique context color
    surface: 'var(--color-cooking-surface)', // Warm white - unique context color
    'active-step': 'var(--color-cooking-active-step)', // Current step highlight - unique
    'timer-urgent': 'var(--color-error)', // References main error color
    complete: 'var(--color-success)', // References main success color
    text: 'var(--color-cooking-text)', // Warm black - unique context color
  },
};

// Food Freshness Indicator Colors - Unified with Main Color System (Duplications Removed)
export const freshnessColors = {
  fresh: 'var(--color-success)', // >7 days - references main success color
  good: 'var(--color-freshness-good)', // 4-7 days - unique muted green
  'use-soon': 'var(--color-warning)', // 2-3 days - references main warning color
  'use-today': 'var(--color-freshness-use-today)', // 1 day - unique orange
  expired: 'var(--color-error)', // 0 days - references main error color
};

// Workflow Dark Mode Specific Colors - Manual Control
export const workflowDarkMode = {
  // Card styling
  'workflow-card-bg-dark': '#000000', // Pure black to match page background
  'workflow-card-border-dark': 'oklch(70% 0.15 20)', // Bright coral-tinted border
  'workflow-card-shadow-dark': '0 0 20px oklch(70% 0.18 20 / 0.3)', // Glowing shadow
  
  // Text colors
  'workflow-title-dark': '#ffffff', // Pure white for maximum contrast
  'workflow-description-dark': 'oklch(85% 0 0)', // Bright gray (gray-300 equivalent)
  
  // Icon styling
  'workflow-icon-color-dark': 'oklch(75% 0.18 20)', // Bright coral (accent-coral-400)
  'workflow-icon-bg-dark': 'oklch(35% 0.15 20)', // Dark coral background
  
  // Timeline and connectors
  'workflow-line-dark': 'oklch(70% 0.15 20)', // Bright coral line
  'workflow-dot-dark': 'oklch(75% 0.18 20)', // Bright coral dots
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

  // Landing page specific sizes
  logo: ['1.875rem', { lineHeight: '1.2', fontWeight: '600' }], // 30px - Main logo
  'footer-logo': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }], // 24px - Footer logo  
  'form-title': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }], // 18px - Email capture title

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
  workflow: '500px', // Workflow visualization height
};

// Border Radius Values
export const borderRadius = {
  none: '0px',
  sm: '4px', // Small elements, buttons
  md: '8px', // Cards, inputs (DEFAULT)
  lg: '12px', // Large cards, modals
  xl: '16px', // Hero cards
  full: '9999px', // Pills, avatars

  // Semantic names - Updated to match mockup (16px for cards)
  button: '8px',
  card: '16px', // Updated from 12px to 16px per audit report
  input: '8px',
  modal: '16px',
};

// Shadow/Elevation System
export const boxShadow = {
  none: 'none',

  // Subtle depth system - Updated to match mockup specifications
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Subtle borders
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Cards
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Modals
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // Dropdowns

  // Semantic shadows
  soft: '0 4px 20px rgba(0, 0, 0, 0.06)', // Soft shadow from mock
  hover: '0 8px 30px rgba(0, 0, 0, 0.1)', // Hover shadow from mock
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  button: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

  // Landing page specific shadows (from audit report)
  'email-card': '0 4px 12px rgba(0, 0, 0, 0.08)', // Mockup specification for email capture
  'feature-card': '0 2px 4px rgba(0, 0, 0, 0.05)', // Minimal elevation for feature cards
  'workflow-card': '0 2px 8px rgba(0, 0, 0, 0.06)', // Subtle workflow card shadows

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
  100: '100', // Maximum priority - navigation
  confetti: '9999', // Confetti overlay effect
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
  
  // Landing page workflow nodes
  'workflow-card': '220px', // Width for workflow visualization cards
};

// Component-specific heights
export const height = {
  // Navigation and layout
  header: '88px', // Main header height
  'progress-bar': '2px', // Progress indicator height
};

// Minimum height values
export const minHeight = {
  // Landing page workflow
  'workflow-min': '500px', // Minimum height for workflow visualization container
  // Standard values for consistency
  0: '0px',
  full: '100%',
  screen: '100vh',
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
  content: '550px', // Content max width for landing page
  container: '1200px', // Main layout container max width
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
  'hero-split': '2fr 1fr', // Hero section main + sidebar with workflow. must leave it as 1.8fr
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


// Complete Design Tokens Export - Unified CSS Variables Strategy
export const designTokens = {
  colors: {
    ...semanticColors,
    // Note: Dark mode now handled through CSS variables, no separate dark object needed
    context: contextColors,
    freshness: freshnessColors,
    
    // Glass morphism opacity variants for components
    'white-95': 'rgba(255, 255, 255, 0.95)',
    'white-80': 'rgba(255, 255, 255, 0.80)',
    'white-75': 'rgba(255, 255, 255, 0.75)',
    'white-60': 'rgba(255, 255, 255, 0.60)',
    
    // Dark mode opacity variants
    'black-70': 'rgba(0, 0, 0, 0.70)',
    'black-60': 'rgba(0, 0, 0, 0.60)',
    workflow: workflowDarkMode,
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
  height,
  minHeight, // Minimum height tokens
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
};


// Default export for Tailwind config
export default designTokens;
