# Branding & Style Guide

## Visual Identity

**Brand Philosophy:** "Coquinate helps you eat well without the stress" - Every design decision reduces friction between planning and eating.

## Context-Aware Color System

The app adapts its color palette based on user context:

### Mode-Based Palettes

```css
/* Planning Mode - Calm decision-making */
[data-mode='plan'] {
  --primary: oklch(62% 0.05 250); /* Calm blue */
  --surface: oklch(98% 0 0); /* Clean white */
  --surface-raised: oklch(100% 0 0); /* Pure white for cards */
  --text: oklch(20% 0 0); /* Near black */
  --text-secondary: oklch(45% 0 0); /* Subdued gray */
  --border: oklch(92% 0 0); /* Light borders */
}

/* Shopping Mode - High contrast for stores */
[data-mode='shop'] {
  --primary: oklch(20% 0 0); /* Maximum contrast black */
  --surface: oklch(100% 0 0); /* Pure white */
  --checked: oklch(55% 0.18 145); /* Check-off green */
  --text: oklch(10% 0 0); /* Pure black */
  --highlight: oklch(95% 0.15 85); /* Yellow highlight for current item */
  --border: oklch(85% 0 0); /* Stronger borders for sunlight */
}

/* Cooking Mode - Warm and engaging */
[data-mode='cook'] {
  --primary: oklch(65% 0.18 35); /* Energetic orange */
  --surface: oklch(98% 0.02 40); /* Warm white */
  --active-step: oklch(70% 0.2 30); /* Current step highlight */
  --timer-urgent: oklch(60% 0.2 25); /* Timer warning */
  --complete: oklch(65% 0.15 145); /* Step complete */
  --text: oklch(25% 0.02 40); /* Warm black */
}
```

### Food Freshness Indicators

```css
/* Expiration gradient system for sustainability */
.freshness {
  --fresh: oklch(65% 0.15 145); /* >7 days - green */
  --good: oklch(70% 0.08 145); /* 4-7 days - muted green */
  --use-soon: oklch(75% 0.15 85); /* 2-3 days - yellow */
  --use-today: oklch(70% 0.18 45); /* 1 day - orange */
  --expired: oklch(60% 0.2 25); /* 0 days - red */
}
```

## Typography

### Font Stack Strategy

```css
/* System fonts for reliability and performance */
--font-system:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Helvetica Neue',
  system-ui, sans-serif;

/* Fallback to Inter for consistency across platforms */
--font-primary: 'Inter var', var(--font-system);

/* Monospace for nutritional data and timers */
--font-mono:
  'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Droid Sans Mono', 'Courier New',
  monospace;
```

### Context-Aware Type Scale

| Context      | Element      | Size              | Line Height | Notes            |
| ------------ | ------------ | ----------------- | ----------- | ---------------- |
| **Planning** | Meal Title   | 1.5rem (24px)     | 1.3         | Scannable        |
|              | Recipe Name  | 1.125rem (18px)   | 1.4         | Clickable target |
|              | Description  | 0.875rem (14px)   | 1.5         | Secondary info   |
|              | Tags         | 0.75rem (12px)    | 1.4         | Compact          |
| **Shopping** | List Item    | 1.125rem (18px)\* | 1.6         | Never smaller    |
|              | Quantity     | 1rem (16px)       | 1.4         | High contrast    |
|              | Aisle        | 0.875rem (14px)   | 1.3         | Helper text      |
| **Cooking**  | Current Step | 1.25rem (20px)    | 1.5         | Active focus     |
|              | Timer        | 1.75rem (28px)    | 1.2         | Glanceable       |
|              | Ingredients  | 1.125rem (18px)\* | 1.6         | Kitchen minimum  |
|              | Next Step    | 1rem (16px)       | 1.5         | Preview          |

\*Minimum 18px enforced in kitchen/shopping contexts for usability

## Logo & Brand Mark

### Logo System Architecture

**Primary Logo**: LogoWeeklyRhythm component with Q-dots pattern representing weekly meal rhythm
- Located in: `packages/ui/src/components/brand/LogoQDots.tsx`
- Sizes: xxs (48px), xs (64px), sm (96px), md (128px), lg (192px), xl (256px), xxl (384px)

### SVG Sharpness Optimization for Small Sizes

For logos and favicons displayed at ≤48px, we employ a multi-layer optimization technique documented in:
**[SVG Sharpness Technique Documentation](/packages/ui/docs/SVG-SHARPNESS-TECHNIQUE.md)**

Key techniques applied:
- **2x Internal Resolution**: Render at double size, display at target size
- **Dual-Stroke Technique**: Subtle black outlines for edge definition on white backgrounds
- **Vector-Effect Non-Scaling**: Consistent stroke widths at all scales
- **CSS Enhancement**: `filter: contrast()` and GPU rendering optimizations

This ensures crisp, sharp rendering of the brand mark across all contexts, particularly important for:
- Browser favicon (32px)
- Navigation header (48px)
- Footer mark (48px)

## Iconography

### Primary Icon System

**Tabler Icons** - 3,500+ consistent icons

- Stroke width: 1.5 (default), 2 (emphasis), 1 (subtle)
- Sizes: 20px (inline), 24px (buttons), 32px (features)

### Food & Kitchen Specific Icons

Custom icon requirements for meal planning:

- Meal type indicators (breakfast, lunch, dinner, snack)
- Dietary restrictions (vegetarian, vegan, gluten-free, etc.)
- Cooking methods (oven, stovetop, no-cook, slow-cooker)
- Portion size indicators (visual serving guides)
- Freshness states (fresh, frozen, pantry, leftover)

## Spacing & Touch Targets

### The Grocery Store Test

All interactive elements must pass three criteria:

1. **Minimum 44px touch target** (Apple HIG standard)
2. **8px minimum spacing** between targets
3. **Thumb-reachable** critical actions in bottom 60% of screen

### Spacing Scale

```css
/* Base unit: 4px for tighter control in compact layouts */
--space-xs: 4px; /* Inline elements */
--space-sm: 8px; /* Related items */
--space-md: 16px; /* Section spacing */
--space-lg: 24px; /* Group separation */
--space-xl: 32px; /* Major sections */
--space-2xl: 48px; /* Page sections */
```

## Motion & Feedback

### Micro-interactions

```css
/* Subtle feedback for actions */
--transition-fast: 150ms ease-out; /* Immediate feedback */
--transition-normal: 250ms ease-out; /* Standard transitions */
--transition-slow: 350ms ease-in-out; /* Page transitions */

/* Shopping list check-off animation */
@keyframes check-item {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
    opacity: 0.5;
  }
  100% {
    transform: translateX(0);
    opacity: 0.3;
  }
}
```

## Accessibility Overlays

### High Contrast Mode

```css
[data-contrast='high'] {
  --min-contrast: 7: 1; /* WCAG AAA */
  --primary: oklch(30% 0 0);
  --surface: oklch(100% 0 0);
  --border-width: 2px; /* Thicker borders */
}
```

### Focus Indicators

```css
:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

## Sustainability Visual Language

### Visual Indicators

- **Seasonal badge**: Subtle leaf icon with gradient
- **Local indicator**: Distance radius visualization
- **Leftover-friendly**: Container icon with number
- **Batch cooking**: Stack icon showing portions
- **Zero-waste**: Circular arrow with percentage

## Performance Constraints

### Image Loading Strategy

```css
/* Progressive loading for recipe images */
.recipe-image {
  background: linear-gradient(135deg, oklch(95% 0 0) 0%, oklch(92% 0 0) 100%);
  /* Blur-up technique for image loading */
  filter: blur(5px);
  transition: filter 0.3s;
}

.recipe-image[data-loaded='true'] {
  filter: blur(0);
}
```
