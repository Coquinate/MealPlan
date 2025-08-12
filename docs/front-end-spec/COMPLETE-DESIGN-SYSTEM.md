# Complete Design System Reference

_Consolidated from ALL front-end specification documents_

## 🎯 Design Token System (packages/config/tailwind/design-tokens.js)

### **Complete OKLCH Color Palette**

#### **Semantic Base Colors (Tailwind v4 Optimized - Flat Structure)**

```javascript
const semanticColors = {
  // Primary system - More variants for customization
  primary: 'oklch(62% 0.05 250)', // Main brand
  'primary-50': 'oklch(96% 0.02 250)', // Lightest
  'primary-100': 'oklch(92% 0.03 250)', // Very light
  'primary-200': 'oklch(88% 0.04 250)', // Light
  'primary-300': 'oklch(78% 0.04 250)', // Medium light
  'primary-400': 'oklch(70% 0.045 250)', // Medium
  'primary-500': 'oklch(62% 0.05 250)', // Base (DEFAULT)
  'primary-600': 'oklch(54% 0.055 250)', // Medium dark
  'primary-700': 'oklch(46% 0.06 250)', // Dark
  'primary-800': 'oklch(38% 0.055 250)', // Very dark
  'primary-900': 'oklch(25% 0.03 250)', // Darkest

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

  // Surface system - Simplified hierarchy
  surface: 'oklch(98% 0 0)', // Base surface
  'surface-raised': 'oklch(100% 0 0)', // Elevated cards
  'surface-sunken': 'oklch(96% 0 0)', // Inset areas
  'surface-hover': 'oklch(94% 0 0)', // Hover states

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
  'border-focus': 'oklch(62% 0.05 250)', // Focus borders
};
```

#### **Context-Aware Color Modes**

```javascript
const contextColors = {
  // Planning Mode - Calm decision-making
  planning: {
    primary: 'oklch(62% 0.05 250)', // Calm blue
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
```

#### **Food Freshness Indicator Colors (Sustainability Feature)**

```javascript
const freshnessColors = {
  fresh: 'oklch(65% 0.15 145)', // >7 days - green
  good: 'oklch(70% 0.08 145)', // 4-7 days - muted green
  'use-soon': 'oklch(75% 0.15 85)', // 2-3 days - yellow
  'use-today': 'oklch(70% 0.18 45)', // 1 day - orange
  expired: 'oklch(60% 0.2 25)', // 0 days - red
};
```

### **Typography Scale (Context-Aware)**

#### **Font Families**

```javascript
const fontFamily = {
  // Primary system font stack for reliability and performance
  primary: [
    '"Inter var"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    '"Roboto"',
    '"Oxygen"',
    '"Ubuntu"',
    '"Helvetica Neue"',
    'system-ui',
    'sans-serif',
  ],

  // Monospace for nutritional data and timers
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
```

#### **Font Size & Line Height Scale**

```javascript
const fontSize = {
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
```

#### **Font Weight Scale**

```javascript
const fontWeight = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
```

### **Full Spacing Scale (4px Base System - Tailwind v4 Optimized)**

```javascript
const spacing = {
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
```

### **Border Radius Values**

```javascript
const borderRadius = {
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
```

### **Shadow/Elevation System**

```javascript
const boxShadow = {
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

  // Focus states
  'focus-ring': '0 0 0 3px oklch(62% 0.05 250 / 0.5)', // Primary focus
  'error-ring': '0 0 0 3px oklch(60% 0.2 25 / 0.5)', // Error focus
};
```

### **Animation Timing Tokens (Battery-Conscious)**

```javascript
const transitionDuration = {
  fast: '150ms', // Immediate feedback (hover, active)
  normal: '250ms', // Standard transitions (page changes)
  slow: '350ms', // Page transitions, modals
};

const transitionTimingFunction = {
  'ease-out': 'ease-out', // Default for most interactions
  'ease-in-out': 'ease-in-out', // Smooth bidirectional
  'ease-in': 'ease-in', // Subtle entries
};

// Specific animation presets
const keyframes = {
  // Shopping list check-off animation
  'check-item': {
    '0%': { transform: 'translateX(0)', opacity: '1' },
    '50%': { transform: 'translateX(10px)', opacity: '0.5' },
    '100%': { transform: 'translateX(0)', opacity: '0.3' },
  },

  // Gentle shimmer for loading (battery conscious)
  shimmer: {
    '0%': { backgroundPosition: '-200px 0' },
    '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
  },

  // Subtle fade in
  'fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },

  // Toast slide in
  'slide-up': {
    '0%': { transform: 'translateY(20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
};
```

### **Touch Target & Accessibility Tokens**

```javascript
const accessibility = {
  // The Grocery Store Test - Critical measurements
  minTouchTarget: '44px', // Apple HIG standard
  minSpacing: '8px', // Between interactive elements
  thumbReachZone: '60%', // Bottom 60% of screen height

  // Focus indicators
  focusWidth: '3px', // Focus outline width
  focusOffset: '2px', // Focus outline offset

  // Contrast ratios (WCAG AA)
  minContrast: '4.5:1', // Text contrast
  minContrastLarge: '3:1', // Large text contrast
  minContrastUi: '3:1', // UI element contrast
};
```

### **Responsive Breakpoints**

```javascript
const screens = {
  sm: '640px', // Large phones, small tablets
  md: '768px', // Tablets
  lg: '1024px', // Desktops
  xl: '1280px', // Large desktops
  '2xl': '1536px', // Very large screens

  // Custom breakpoints for meal planning
  'week-grid': '896px', // When week view shows all 7 days
  'meal-cards': '512px', // When meal cards can be full width
};
```

## 🎨 Tailwind v4 CSS Implementation (Taking Full Advantage)

### **Native CSS Variables (Tailwind v4 Direct Integration)**

```css
/* Tailwind v4 automatically generates these - we just define the base values */
@layer base {
  :root {
    /* Primary color system - Tailwind v4 will generate all utilities */
    --primary: 62% 0.05 250;
    --primary-50: 96% 0.02 250;
    --primary-100: 92% 0.03 250;
    --primary-200: 88% 0.04 250;
    --primary-300: 78% 0.04 250;
    --primary-400: 70% 0.045 250;
    --primary-500: 62% 0.05 250;
    --primary-600: 54% 0.055 250;
    --primary-700: 46% 0.06 250;
    --primary-800: 38% 0.055 250;
    --primary-900: 25% 0.03 250;

    /* Surface system */
    --surface: 98% 0 0;
    --surface-raised: 100% 0 0;
    --surface-sunken: 96% 0 0;
    --surface-hover: 94% 0 0;

    /* Text system */
    --text: 20% 0 0;
    --text-secondary: 45% 0 0;
    --text-muted: 65% 0 0;
    --text-subtle: 75% 0 0;
    --text-inverse: 95% 0 0;
    --text-disabled: 80% 0 0;

    /* Status colors */
    --error: 60% 0.2 25;
    --error-50: 96% 0.08 25;
    --error-500: 60% 0.2 25;
    --error-900: 30% 0.22 25;

    --success: 65% 0.15 145;
    --success-50: 95% 0.06 145;
    --success-500: 65% 0.15 145;
    --success-900: 35% 0.16 145;

    --warning: 75% 0.15 85;
    --warning-50: 96% 0.06 85;
    --warning-500: 75% 0.15 85;
    --warning-900: 45% 0.16 85;

    /* Border system */
    --border: 92% 0 0;
    --border-strong: 85% 0 0;
    --border-subtle: 96% 0 0;
    --border-muted: 94% 0 0;
    --border-focus: 62% 0.05 250;

    /* Food freshness system */
    --fresh: 65% 0.15 145;
    --good: 70% 0.08 145;
    --use-soon: 75% 0.15 85;
    --use-today: 70% 0.18 45;
    --expired: 60% 0.2 25;
  }
}

/* Context-aware mode switching - Tailwind v4 CSS Variables */
[data-mode='shop'] {
  --primary: 20% 0 0; /* High contrast black */
  --surface: 100% 0 0; /* Pure white */
  --text: 10% 0 0; /* Pure black */
  --border: 85% 0 0; /* Stronger borders */
  --checked: 55% 0.18 145; /* Check-off green */
  --highlight: 95% 0.15 85; /* Yellow highlight */
}

[data-mode='cook'] {
  --primary: 65% 0.18 35; /* Energetic orange */
  --surface: 98% 0.02 40; /* Warm white */
  --text: 25% 0.02 40; /* Warm black */
  --active-step: 70% 0.2 30; /* Current step highlight */
  --timer-urgent: 60% 0.2 25; /* Timer warning */
  --complete: 65% 0.15 145; /* Step complete */
}

/* Accessibility: True motion respect */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
}

/* Logical properties support (Tailwind v4) */
@supports (margin-inline-start: 0) {
  .meal-card {
    padding-inline: var(--space-md);
    margin-block: var(--space-sm);
    border-inline-start: 3px solid oklch(var(--primary));
  }
}
```

### **Tailwind v4 Utility Class Examples (Taking Full Advantage)**

```html
<!-- Direct CSS variable usage - Tailwind v4 native support -->
<div class="bg-[oklch(var(--surface))] text-[oklch(var(--text))] p-[var(--space-md)]">
  Planning mode content
</div>

<!-- Context-aware components using data attributes -->
<div
  class="bg-surface text-text data-[mode=shop]:bg-surface data-[mode=shop]:text-text 
            data-[mode=cook]:bg-surface data-[mode=cook]:text-text"
>
  Auto-switching context content
</div>

<!-- Freshness indicators with state -->
<span
  class="inline-flex h-[var(--space-sm)] w-[var(--space-sm)] rounded-full 
           bg-[oklch(var(--fresh))] 
           data-[expiry=good]:bg-[oklch(var(--good))]
           data-[expiry=soon]:bg-[oklch(var(--use-soon))]
           data-[expiry=today]:bg-[oklch(var(--use-today))]
           data-[expiry=expired]:bg-[oklch(var(--expired))]"
>
</span>

<!-- Enhanced touch targets with semantic spacing -->
<button
  class="min-h-[var(--touch-target)] min-w-[var(--touch-target)] 
               px-[var(--space-md)] py-[var(--space-sm)]
               rounded-[var(--border-radius-md)]
               bg-[oklch(var(--primary))] text-[oklch(var(--text-inverse))]
               focus:ring-[var(--focus-width)] focus:ring-[oklch(var(--border-focus))]
               focus:ring-offset-[var(--focus-offset)]
               transition-colors duration-[var(--transition-fast)]"
>
  Touch-optimized button
</button>

<!-- Meal card with comprehensive token usage -->
<div
  class="group relative overflow-hidden
            rounded-[var(--border-radius-lg)]
            bg-[oklch(var(--surface-raised))]
            shadow-[var(--shadow-card)]
            border border-[oklch(var(--border-subtle))]
            p-[var(--space-md)]
            hover:bg-[oklch(var(--surface-hover))]
            hover:border-[oklch(var(--border))]
            hover:shadow-[var(--shadow-md)]
            transition-all duration-[var(--transition-normal)]"
>
  <!-- Leftover indicator using flat tokens -->
  <div
    class="absolute -top-[var(--micro-1)] -right-[var(--micro-1)]
              h-[var(--space-lg)] w-[var(--space-lg)]
              rounded-full bg-[oklch(var(--warning))]
              flex items-center justify-center
              text-[var(--font-size-sm)] font-[var(--font-weight-medium)]"
  >
    🔄
  </div>

  <!-- Cooking time badge -->
  <span
    class="inline-flex items-center gap-[var(--space-xs)]
               px-[var(--space-sm)] py-[var(--micro-2)]
               rounded-[var(--border-radius-sm)]
               bg-[oklch(var(--primary-50))] text-[oklch(var(--primary-700))]
               text-[var(--font-size-sm)] font-[var(--font-weight-medium)]"
  >
    ⏱ 25min
  </span>
</div>

<!-- Context switching example -->
<div class="meal-planner" data-mode="planning">
  <!-- Planning mode: calm colors -->
  <div class="bg-[oklch(var(--surface))] text-[oklch(var(--text))]">Plan your meals</div>
</div>

<div class="meal-planner" data-mode="shop">
  <!-- Shopping mode: high contrast -->
  <div class="bg-[oklch(var(--surface))] text-[oklch(var(--text))]">Check off items</div>
</div>

<div class="meal-planner" data-mode="cook">
  <!-- Cooking mode: warm colors -->
  <div class="bg-[oklch(var(--surface))] text-[oklch(var(--text))]">Follow recipe steps</div>
</div>
```

### **Practical Advantages of This Flat Structure**

1. **Easy Customization**: `text-primary-600` vs nested objects
2. **Better Tree-shaking**: Tailwind v4 only includes used variants
3. **Semantic Naming**: `space-md` is clearer than `4` in context
4. **Runtime Switching**: CSS variables change context without JS
5. **Fewer Layers**: Direct access without deep object traversal

### **Component Variant Examples Using Flat Tokens**

```typescript
// CVA variants using flat token structure
const mealCardVariants = cva(
  // Base styles using flat tokens
  'relative rounded-[var(--border-radius-lg)] bg-[oklch(var(--surface-raised))] p-[var(--space-md)]',
  {
    variants: {
      status: {
        default: 'border-[oklch(var(--border-subtle))]',
        cooked: 'border-[oklch(var(--success))] bg-[oklch(var(--success-50))]',
        leftover: 'border-[oklch(var(--warning))] bg-[oklch(var(--warning-50))]',
        locked: 'opacity-60 border-[oklch(var(--border-muted))] bg-[oklch(var(--surface-sunken))]',
      },
      size: {
        compact: 'p-[var(--space-sm)]',
        default: 'p-[var(--space-md)]',
        expanded: 'p-[var(--space-lg)]',
      },
      context: {
        planning: 'hover:bg-[oklch(var(--surface-hover))]',
        shopping: 'data-[checked]:opacity-50',
        cooking: 'ring-2 ring-[oklch(var(--active-step))]',
      },
    },
  }
);
```

## 🏗️ Component Library Strategy

### **Tier 1: shadcn/ui Foundation (85% of components)**

- Button, Input, Select, Checkbox, Radio, Toggle
- Modal, Toast, Tooltip, Dropdown, Badge
- Card, Skeleton, Tabs, Accordion
- Form components with validation

### **Tier 2: Custom MealPlan Components (10% of components)**

- MealCard (leftover arrows, cooking status)
- WeekGrid (7×4 responsive with connections)
- ShoppingListItem (swipe, expiry warnings)
- RecipeStep (cooking mode optimized)
- SavingsDisplay (Romanian currency)
- BottomTabBar (Romanian navigation)

### **Tier 3: MagicUI Polish (5% of components)**

- AnimatedNumber (savings counter)
- Progress rings (completion tracking)
- Smooth transitions (week navigation)
- Loading enhancements

## ✅ Implementation Checklist

### **Phase 1: Foundation**

- [ ] Create design tokens file with ALL tokens above
- [ ] Configure Tailwind v4 with semantic tokens only
- [ ] Install shadcn/ui canary for React 19 compatibility
- [ ] Set up CVA for component variants
- [ ] Test Romanian text rendering and number formatting

### **Phase 2: Core Components**

- [ ] Implement Button with all variants using tokens
- [ ] Build MealCard component (most complex custom component)
- [ ] Create WeekGrid with responsive behavior
- [ ] Implement ShoppingListItem with gestures

### **Phase 3: Polish**

- [ ] Add MagicUI animated counter for savings
- [ ] Implement context-aware color mode switching
- [ ] Add accessibility features (focus management)
- [ ] Test battery-conscious animations

## 🎯 Critical Success Metrics

- **Token Usage**: 0 arbitrary Tailwind values allowed
- **Touch Targets**: 100% compliance with 44px minimum
- **Performance**: All animations under 250ms
- **Accessibility**: WCAG AA compliance (4.5:1 contrast)
- **Romanian Support**: Perfect text rendering and number formatting

---

_This design system consolidates every design token mentioned across all 16 front-end specification documents. Every color, spacing, typography, shadow, and animation value needed for implementation is included above._
