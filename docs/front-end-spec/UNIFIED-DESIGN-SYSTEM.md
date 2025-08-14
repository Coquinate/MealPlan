# Unified Design System Reference

_Complete system combining design tokens with component inventory_

## 🎯 System Overview

Acest document unifică toate aspectele sistemului de design pentru aplicația Coquinate:

- **Design tokens** (culori, spacing, tipografie) din COMPLETE-DESIGN-SYSTEM.md
- **Component inventory** și arhitectura din component-library-design-system.md

## ⚡ Quick Navigation

- [**Design Tokens**](#design-tokens) - Culori OKLCH, spacing, tipografie
- [**Component Library**](#component-library) - Toate componentele React
- [**Implementation Guide**](#implementation) - Structura tehncică

---

## 🎨 Design Tokens

### **Complete OKLCH Color Palette**

#### **Semantic Base Colors (Tailwind v4 Optimized)**

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
    'surface-raised': 'oklch(96% 0 0)', // Slight contrast
    text: 'oklch(10% 0 0)', // Near black
    'text-secondary': 'oklch(30% 0 0)', // Dark gray
    border: 'oklch(80% 0 0)', // Strong borders
  },

  // Cooking Mode - Warm, food-focused
  cooking: {
    primary: 'oklch(65% 0.12 45)', // Warm orange
    surface: 'oklch(98% 0.01 45)', // Warm white
    'surface-raised': 'oklch(100% 0 0)', // Pure white
    text: 'oklch(25% 0.02 45)', // Warm black
    'text-secondary': 'oklch(50% 0.05 45)', // Warm gray
    border: 'oklch(90% 0.02 45)', // Warm borders
  },
};
```

### **Food Freshness System**

```javascript
const freshnessColors = {
  // Days 1-2: Fresh (Green spectrum)
  'fresh-bright': 'oklch(70% 0.15 145)', // Vibrant green
  'fresh-medium': 'oklch(65% 0.12 140)', // Standard green

  // Days 3-4: Good (Yellow-green spectrum)
  'good-bright': 'oklch(75% 0.12 110)', // Yellow-green
  'good-medium': 'oklch(72% 0.10 105)', // Muted yellow-green

  // Days 5-6: Caution (Orange spectrum)
  'caution-bright': 'oklch(75% 0.15 75)', // Orange
  'caution-medium': 'oklch(70% 0.12 70)', // Muted orange

  // Day 7+: Urgent (Red spectrum)
  'urgent-bright': 'oklch(65% 0.20 25)', // Red
  'urgent-medium': 'oklch(60% 0.18 20)', // Dark red
};
```

### **Typography Scale**

```javascript
const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Inter', 'system-ui', 'sans-serif'], // Same as sans for simplicity
  },

  // Font sizes (optimized for Romanian text)
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }], // 12px - Fine print
    sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px - Secondary text
    base: ['1rem', { lineHeight: '1.5rem' }], // 16px - Body text
    lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px - Large body
    xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px - Headings
    '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px - Large headings
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - Page titles
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
```

### **Spacing & Layout**

```javascript
const spacing = {
  // Touch-friendly spacing (minimum 44px touch targets)
  xs: '0.25rem', // 4px - Fine spacing
  sm: '0.5rem', // 8px - Small spacing
  base: '1rem', // 16px - Default spacing
  md: '1.5rem', // 24px - Medium spacing
  lg: '2rem', // 32px - Large spacing
  xl: '3rem', // 48px - Extra large
  '2xl': '4rem', // 64px - Section spacing

  // Touch targets
  'touch-min': '2.75rem', // 44px minimum
  'touch-comfortable': '3rem', // 48px comfortable
  'touch-generous': '3.5rem', // 56px generous
};
```

---

## 📚 Component Library

### **Core Principles**

- **Mobile-first:** Designed for touch and small screens
- **Romanian-first:** All UI text in Romanian
- **Performance-focused:** Minimal animations, fast interactions
- **Accessibility-ready:** WCAG AA compliance
- **Type-safe:** Full TypeScript coverage

### **Technology Stack**

- **Base:** React 19+ with TypeScript 5.9+
- **Component Library:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS with custom design tokens
- **State Management:** Zustand for global, React Query for server
- **Forms:** React Hook Form + Zod validation
- **Icons:** Custom meal emojis + Tabler Icons for UI

### **Complete Component Inventory**

#### **1. Navigation Components**

```typescript
// Core navigation for app structure
interface NavigationComponents {
  WeekNavigator: ComponentProps<'div'>; // Week selector with arrows (◀ Săpt 15-21 Ian 2024 ▶)
  BottomTabBar: ComponentProps<'nav'>; // Mobile navigation (Azi | Săptămână | Listă | Cont)
  BackButton: ComponentProps<'button'>; // Simple back navigation (◀ Înapoi)
  BreadcrumbTrail: ComponentProps<'nav'>; // Admin navigation breadcrumb
}
```

#### **2. Meal Planning Components**

```typescript
// Primary meal planning interface
interface MealPlanningComponents {
  MealCard: {
    variant: 'compact' | 'expanded' | 'today';
    meal: MealData;
    status: 'planned' | 'cooked' | 'skipped';
    showLeftovers?: boolean;
  };
  WeekGrid: {
    layout: '7x4' | '5x4'; // 7 days or 5 weekdays
    meals: MealData[][];
    responsive: boolean;
  };
  LeftoverArrow: {
    direction: 'right' | 'down' | 'curved';
    animated: boolean;
  };
  MealStatusIcon: ComponentProps<'span'>; // ✓, ✅, ❌, 🔄
  TodayMealCard: ComponentProps<'div'>; // Expanded with image and actions
  CookingActionButton: ComponentProps<'button'>; // Marchează Gătit ✓
}
```

#### **3. Shopping & Lists Components**

```typescript
// Shopping list functionality
interface ShoppingComponents {
  SearchBar: ComponentProps<'input'>; // 🔍 Caută...
  ShoppingCategory: {
    title: string;
    items: ShoppingItem[];
    collapsible: boolean;
    defaultExpanded?: boolean;
  };
  ShoppingItem: {
    checked: boolean;
    quantity: string;
    name: string;
    category: string;
  };
  ProgressCounter: ComponentProps<'div'>; // ✓ 2/15 articole
  ExportButton: {
    format: 'pdf' | 'email';
    variant: 'primary' | 'secondary';
  };
}
```

#### **4. Recipe & Cooking Components**

```typescript
// Recipe display and cooking assistance
interface RecipeComponents {
  RecipeHeader: {
    title: string;
    time: number; // minutes
    portions: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
  IngredientsList: {
    ingredients: Ingredient[];
    scalable: boolean; // Can adjust portions
  };
  InstructionsList: {
    steps: CookingStep[];
    interactive: boolean; // Can check off steps
  };
  BatchNote: ComponentProps<'div'>; // Special batch cooking instructions
  CookingTimer: {
    duration: number;
    autoStart?: boolean;
  };
  ProgressRing: {
    progress: number; // 0-100
    size: 'small' | 'medium' | 'large';
  };
}
```

#### **5. Feedback & Status Components**

```typescript
// User feedback and system status
interface FeedbackComponents {
  FeedbackModal: {
    isOpen: boolean;
    onClose: () => void;
    meal: MealData;
    options: FeedbackOption[];
  };
  ToastNotification: {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    action?: ToastAction;
    duration?: number;
  };
  LoadingSkeleton: {
    variant: 'meal-card' | 'list-item' | 'recipe' | 'custom';
    count?: number;
  };
  ErrorBoundary: ComponentProps<'div'>;
  EmptyState: {
    icon: React.ReactNode;
    title: string;
    message: string;
    action?: React.ReactNode;
  };
  Badge: {
    variant: 'default' | 'success' | 'warning' | 'error';
    size: 'small' | 'medium';
  };
}
```

#### **6. Form & Input Components**

```typescript
// All form controls with validation
interface FormComponents {
  TextInput: {
    label: string;
    error?: string;
    placeholder?: string;
    required?: boolean;
  };
  PasswordInput: {
    showToggle: boolean;
    strength?: 'weak' | 'medium' | 'strong';
  };
  SelectDropdown: {
    options: SelectOption[];
    searchable?: boolean;
    multiple?: boolean;
  };
  Checkbox: {
    label: string;
    indeterminate?: boolean;
  };
  RadioGroup: {
    name: string;
    options: RadioOption[];
    direction: 'horizontal' | 'vertical';
  };
  ToggleSwitch: {
    label: string;
    size: 'small' | 'medium';
  };
  DatePicker: {
    format: 'dd/mm/yyyy' | 'relative';
    minDate?: Date;
    maxDate?: Date;
  };
  NumberStepper: {
    min: number;
    max: number;
    step: number;
    unit?: string;
  };
}
```

#### **7. Admin & Analytics Components**

```typescript
// Admin dashboard components
interface AdminComponents {
  DataTable: {
    columns: TableColumn[];
    data: any[];
    sortable: boolean;
    filterable: boolean;
    pagination?: PaginationOptions;
  };
  AnalyticsCard: {
    title: string;
    value: string | number;
    change?: number; // percentage change
    trend: 'up' | 'down' | 'neutral';
  };
  ConstraintCheckbox: {
    constraints: Constraint[];
    selected: string[];
    onChange: (selected: string[]) => void;
  };
  MealSlotSelector: {
    slots: MealSlot[];
    autoAssign: boolean;
  };
  StatsPanel: {
    cost: number;
    time: number; // minutes
    calories: number;
    servings: number;
  };
  AdminActionBar: {
    actions: AdminAction[];
    loading?: boolean;
  };
}
```

#### **8. Marketing & Onboarding Components**

```typescript
// Homepage and marketing components
interface MarketingComponents {
  HeroSection: {
    title: string;
    subtitle: string;
    cta: CTAButton;
    backgroundImage?: string;
  };
  PricingCard: {
    plan: PricingPlan;
    featured?: boolean;
    annualDiscount?: number;
  };
  FeatureGrid: {
    features: Feature[];
    columns: 2 | 3 | 4;
  };
  TestimonialCard: {
    testimonial: Testimonial;
    showAvatar: boolean;
  };
  FAQAccordion: {
    questions: FAQItem[];
    searchable?: boolean;
  };
  OnboardingCard: {
    step: number;
    totalSteps: number;
    title: string;
    content: React.ReactNode;
  };
  TrialBenefitsList: {
    benefits: string[];
    animated?: boolean;
  };
}
```

#### **9. Utility & Layout Components**

```typescript
// Layout and utility components
interface UtilityComponents {
  Container: {
    size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    padding?: boolean;
  };
  Grid: {
    columns: number | 'auto';
    gap: keyof typeof spacing;
    responsive?: boolean;
  };
  FilterBar: {
    filters: Filter[];
    onFilterChange: (filters: ActiveFilter[]) => void;
  };
  Tooltip: {
    content: string;
    placement: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
  };
  Modal: {
    isOpen: boolean;
    onClose: () => void;
    size: 'sm' | 'md' | 'lg' | 'xl';
    title?: string;
  };
  SavingsCounter: {
    amount: number;
    currency: 'RON';
    animated: boolean;
    period: 'weekly' | 'monthly' | 'yearly';
  };
}
```

---

## 🛠 Implementation Guide

### **File Structure**

```
packages/ui/
├── components/
│   ├── navigation/          # Navigation components
│   ├── meal-planning/       # Meal planning components
│   ├── shopping/           # Shopping list components
│   ├── recipe/             # Recipe display components
│   ├── feedback/           # Feedback & status components
│   ├── forms/              # Form & input components
│   ├── admin/              # Admin dashboard components
│   ├── marketing/          # Marketing & onboarding
│   └── utility/            # Layout & utility components
├── hooks/                  # Shared component hooks
├── utils/                  # Component utilities
└── tokens/                 # Design tokens
    ├── colors.ts           # OKLCH color system
    ├── typography.ts       # Font scales & families
    ├── spacing.ts          # Spacing scale
    └── index.ts            # Unified export
```

### **Component Development Standards**

#### **Base Component Template**

```typescript
// components/base/BaseComponent.tsx
import { forwardRef } from 'react';
import { cn } from '../utils';
import { baseComponentVariants } from './variants';

interface BaseComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const BaseComponent = forwardRef<HTMLDivElement, BaseComponentProps>(
  ({ className, variant = 'default', size = 'md', disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          baseComponentVariants({ variant, size, disabled }),
          className
        )}
        aria-disabled={disabled}
        {...props}
      />
    );
  }
);

BaseComponent.displayName = 'BaseComponent';

export { BaseComponent, type BaseComponentProps };
```

#### **Variant System with CVA**

```typescript
// components/base/variants.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const baseComponentVariants = cva(
  // Base styles - always applied
  'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 py-2 px-4',
        lg: 'h-11 px-8 text-lg',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      disabled: false,
    },
  }
);

export type BaseComponentVariants = VariantProps<typeof baseComponentVariants>;
```

### **Design Token Integration**

```typescript
// tokens/colors.ts - Export for Tailwind config
export const semanticColors = {
  // All OKLCH colors from above
} as const;

// tailwind.config.js - Import and use
import { semanticColors } from './packages/ui/tokens/colors';

export default {
  theme: {
    extend: {
      colors: {
        ...semanticColors,
        // Context-aware colors
        'planning-primary': 'var(--planning-primary)',
        'shopping-primary': 'var(--shopping-primary)',
        'cooking-primary': 'var(--cooking-primary)',
      },
    },
  },
};
```

### **Accessibility Standards**

- **WCAG AA compliance** for all interactive components
- **Keyboard navigation** for all focusable elements
- **Screen reader support** with proper ARIA labels
- **High contrast mode** support via CSS custom properties
- **Touch targets** minimum 44px for mobile interfaces
- **Focus indicators** clearly visible and consistent

### **Performance Requirements**

- **Bundle splitting** by component category
- **Lazy loading** for non-critical components
- **Tree shaking** support via ES modules
- **Zero runtime CSS-in-JS** (Tailwind only)
- **Minimal JavaScript** for basic interactions
- **Fast re-renders** with proper React.memo usage

### **Romanian Localization**

- **All component text** in Romanian by default
- **Date/number formatting** using Romanian locale
- **Currency display** in RON format (47,50 lei)
- **Proper diacritics** in all text content
- **RTL support** not required (Romanian is LTR)

---

## ✅ Implementation Checklist

### **Phase 1: Foundation**

- [ ] Set up design token system with OKLCH colors
- [ ] Configure Tailwind with custom tokens
- [ ] Create base component templates
- [ ] Set up variant system with CVA
- [ ] Implement accessibility foundations

### **Phase 2: Core Components**

- [ ] Navigation components (WeekNavigator, BottomTabBar)
- [ ] Meal planning components (MealCard, WeekGrid)
- [ ] Form components (TextInput, SelectDropdown)
- [ ] Feedback components (Toast, LoadingSkeleton)

### **Phase 3: Advanced Components**

- [ ] Shopping components (ShoppingCategory, ProgressCounter)
- [ ] Recipe components (RecipeHeader, InstructionsList)
- [ ] Admin components (DataTable, AnalyticsCard)
- [ ] Marketing components (HeroSection, PricingCard)

### **Phase 4: Polish & Testing**

- [ ] Accessibility audit with axe-core
- [ ] Performance optimization
- [ ] Romanian localization review
- [ ] Mobile responsiveness testing
- [ ] Component documentation with Storybook

---

_This unified system provides the complete foundation for developing the Coquinate application with consistent design and robust component architecture._
