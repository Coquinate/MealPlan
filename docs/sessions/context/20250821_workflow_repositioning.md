# Librarian Report: WorkflowVisualization și WorkflowStep Analysis

## Query
Analiza componentelor WorkflowVisualization și WorkflowStep din packages/ui/src/components/landing/components/workflow/, concentrându-se pe logica de poziționare, structura nodurilor, randarea conexiunilor și pattern-urile de animație.

## Answer
Sistemul de workflow este implementat printr-un design responsiv cu două moduri distincte: timeline vertical pentru mobil și noduri flotante cu conexiuni SVG pentru desktop.

## Evidence

### Fișiere Analizate
- `/home/alexandru/Projects/MealPlan/packages/ui/src/components/landing/components/workflow/WorkflowVisualization.tsx`
- `/home/alexandru/Projects/MealPlan/packages/ui/src/components/landing/components/workflow/WorkflowStep.tsx`
- `/home/alexandru/Projects/MealPlan/packages/ui/src/components/landing/components/workflow/WorkflowTimeline.tsx`
- `/home/alexandru/Projects/MealPlan/packages/ui/src/components/landing/components/workflow/index.ts`

### 1. Logica de Poziționare Actuală

#### Desktop Steps - Poziționare Absolută (liniile 56-78, WorkflowVisualization.tsx)
```typescript
const desktopSteps = [
  {
    position: { top: "2%", left: "20%" },   // Step 1: Sus-stânga
    animationDelay: 0
  },
  {
    position: { top: "48%", left: "70%" },  // Step 2: Mijloc-dreapta  
    animationDelay: 1000
  },
  {
    position: { top: "88%", left: "15%" },  // Step 3: Jos-stânga
    animationDelay: 2000
  }
]
```

**Container**: Poziționare relativă cu `min-h-96` (384px), utilizează `absolute` pentru noduri.

#### Mobile Timeline - Poziționare Flexibilă (WorkflowTimeline.tsx)
- Sistem de timeline vertical centralizat
- Noduri alternante left/right prin `alignment` property
- Container `max-w-xs mx-auto` pentru centrare

### 2. Structura Nodurilor

#### Interface WorkflowStepProps (liniile 6-15, WorkflowStep.tsx)
```typescript
export interface WorkflowStepProps {
  icon: ReactNode           // Icon component din Tabler Icons
  title: string            // Titlul pasului
  description: string      // Descrierea detaliată
  alignment?: "left" | "right" | "center"  // Aliniament text
  isActive?: boolean       // Stare activă
  animationDelay?: number  // Delay animație (ms)
  className?: string       // CSS classes adiționale
  size?: "sm" | "md" | "lg"  // Dimensiune predefinită
}
```

#### Sizing System (liniile 17-39, WorkflowStep.tsx)
```typescript
const sizeClasses = {
  sm: { container: "p-2", iconWrapper: "w-6 h-6", title: "text-xs" },
  md: { container: "p-3", iconWrapper: "w-8 h-8", title: "text-sm" },
  lg: { container: "p-4", iconWrapper: "w-10 h-10", title: "text-base" }
}
```

### 3. Randarea Conexiunilor/Liniilor

#### Desktop - SVG Path (liniile 154-169, WorkflowVisualization.tsx)
```typescript
<svg className="absolute top-0 left-0 w-full h-full z-0" viewBox="0 0 300 300">
  <m.path
    d="M 120 30 C 40 120, 30 200, 80 240 C 130 280, 200 300, 250 340"
    className="stroke-gray-200"
    fill="transparent"
    strokeWidth="2"
    strokeDasharray="4 4"
    variants={pathVariants}
  />
</svg>
```

**Path Details**:
- Curbă Bézier complexă cu două puncte de control
- Start: `M 120 30` (sus-centru)
- Control 1: `C 40 120` (mijloc-stânga)
- Control 2: `30 200` (jos-stânga)
- End: `80 240 C 130 280, 200 300, 250 340` (jos-dreapta)
- Style: Linie punctată gri cu `strokeDasharray="4 4"`

#### Mobile - Timeline Line (liniile 102-107, WorkflowTimeline.tsx)
```typescript
<m.div 
  className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-accent-coral-500 via-primary-600 to-accent-coral-500 opacity-30"
  initial={{ height: 0 }}
  animate={{ height: "100%" }}
  transition={{ duration: 1, ease: "easeInOut" }}
/>
```

**Timeline Features**:
- Linie verticală centrală cu gradient colorat
- Animație de creștere din sus în jos
- Puncte de conexiune cu nodurile prin dots colorați

### 4. Pattern-uri de Animație

#### Container Staggered Animation (liniile 81-90, WorkflowVisualization.tsx)
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,    // Delay între copii
      delayChildren: 0.2       // Delay inițial
    }
  }
}
```

#### Floating Animation pentru Desktop (liniile 93-103, WorkflowVisualization.tsx)
```typescript
const floatingVariants = {
  initial: { y: 0 },
  animate: shouldReduceMotion ? { y: 0 } : {
    y: [-5, 5, -5],           // Mișcare verticală subtilă
    transition: {
      duration: 4,             // Ciclu complet 4 secunde
      repeat: Infinity,        // Repetare infinită
      ease: [0.4, 0, 0.2, 1]  // Cubic bezier easing
    }
  }
}
```

#### Path Drawing Animation (liniile 106-116, WorkflowVisualization.tsx)
```typescript
const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,           // Desenare completă
    opacity: 1,
    transition: {
      pathLength: { duration: 2, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.5 }
    }
  }
}
```

#### Step Animation (liniile 73-89, WorkflowStep.tsx)
```typescript
const containerVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,                   // Intrare din jos
    scale: 0.95             // Ușor micșorat
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: animationDelay / 1000,  // Delay configurat per step
      ease: [0.25, 0.1, 0.25, 1]    // Custom cubic bezier
    }
  }
}
```

### 5. Structura de Date pentru Workflow Steps

#### Mobile Timeline Steps (liniile 31-53, WorkflowVisualization.tsx)
```typescript
const workflowSteps = [
  {
    id: "sunday",
    icon: <IconChefHat size={12} className="text-accent-coral" />,
    title: t("workflow.cook_sunday.title", "Gătești Duminică"),
    description: t("workflow.cook_sunday.description", "Prepari o masă principală"),
    alignment: "left" as const
  },
  // ... similar pentru monday, tuesday
]
```

#### Desktop Steps cu Poziționare (liniile 56-78, WorkflowVisualization.tsx)
```typescript
const desktopSteps = [
  {
    icon: <IconChefHat size={20} className="text-accent-coral" />,
    title: t("workflow.cook_sunday.title", "Gătești Duminică"),
    description: t("workflow.cook_sunday.description", "Prepari o masă principală."),
    position: { top: "2%", left: "20%" },
    animationDelay: 0
  },
  // ... similar pentru celelalte steps
]
```

### Additional Findings

#### Responsive Design Strategy
- **Mobile (< lg)**: Timeline vertical cu WorkflowTimeline component
- **Desktop (≥ lg)**: Noduri flotante absolute cu SVG path background

#### Animation Features
- **Reduced Motion Support**: Respectă `prefers-reduced-motion` prin `useReducedMotion()`
- **Hover Effects**: Scale, shadow și translate effects pe hover
- **Staggered Reveals**: Container animations cu delay progresiv

#### Styling System
- **Design Tokens**: Utilizează culorile `accent-coral` și `primary` din design system
- **Responsive**: Sizing system sm/md/lg pentru diferite contexte
- **Shadow System**: Gradient shadows cu OKLCH colors în hover states

#### I18n Integration
- **Localization**: Toate textele folosesc `useI18nWithFallback` hook
- **Fallbacks**: Texte româneși ca fallback pentru missing translations

## Observații Tehnice

1. **Poziționarea absolută** pe desktop permite flexibilitate completă dar necesită management manual
2. **SVG Path** folosește coordonate hardcoded care s-ar putea să nu se scaleze perfect
3. **Z-index management**: Path la `z-0`, noduri la `z-10`
4. **Performance**: Animation repeat infinite poate consuma resurse
5. **Accessibility**: Respectă reduced motion dar ar putea beneficia de mai mult focus management

Sistemul actual oferă o experiență vizuală bogată cu animații sofisticate și design responsiv, dar poziționarea hardcoded limitează flexibilitatea pentru reconfigurări viitoare ale layout-ului.

---

## Tailwind Configuration & Design Tokens Analysis

### Spacing Tokens pentru Corner Positioning

#### Token-uri Semantice pentru Spacing
**File**: `/home/alexandru/Projects/MealPlan/packages/config/tailwind/design-tokens.js`

```javascript
export const spacing = {
  // Semantic spacing - Flat structure for easy customization
  'space-xs': '4px',     // Inline elements, tight spacing
  'space-sm': '8px',     // Related items, component internal
  'space-md': '16px',    // Section spacing, card padding
  'space-lg': '24px',    // Group separation, component gaps
  'space-xl': '32px',    // Major sections, page regions
  'space-2xl': '48px',   // Page sections, hero spacing
  'space-3xl': '64px',   // Large separations
  'space-4xl': '80px',   // Maximum spacing

  // Component-specific spacing
  'touch-target': '44px',   // Minimum touch target (Apple HIG)
  'touch-spacing': '8px',   // Minimum between touch targets
  'focus-offset': '2px',    // Focus outline offset
  'focus-width': '3px',     // Focus outline width

  // Enhanced Tailwind scale (granular control)
  0: '0px',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  // ... up to 96: '384px'
}
```

#### Recomandări pentru Corner Positioning
- **Pentru colțuri apropiate**: Folosește `space-md` (16px) sau `space-lg` (24px)
- **Pentru colțuri îndepărtate**: Folosește `space-xl` (32px) sau `space-2xl` (48px)
- **Touch-friendly gaps**: Minimum `touch-spacing` (8px) între noduri

### Animation/Transition Utilities

#### Animation Timing Tokens
```javascript
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
}
```

#### Transition Duration Scale
```javascript
export const transitionDuration = {
  75: '75ms',
  100: '100ms',
  150: '150ms',    // Matches animation.duration-fast
  200: '200ms',
  300: '300ms',    // Close to animation.duration-normal
  500: '500ms',    // Matches animation.duration-slower
  700: '700ms',
  1000: '1000ms',
}
```

#### Transition Timing Functions
```javascript
export const transitionTimingFunction = {
  DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}
```

### Z-Index Scale pentru Layering

```javascript
export const zIndex = {
  0: '0',
  10: '10',      // Base level
  20: '20',      // Elevated cards
  30: '30',      // Sticky elements
  40: '40',      // Fixed headers
  50: '50',      // Dropdowns
  60: '60',      // Modals
  70: '70',      // Notifications
  80: '80',      // Tooltips
  90: '90',      // Critical overlays
  100: '100',    // Maximum priority - navigation
  confetti: '9999', // Confetti overlay effect
}
```

### Grid/Layout Patterns

#### Grid Template Columns
```javascript
export const gridTemplateColumns = {
  // Standard grid layouts
  1: 'repeat(1, minmax(0, 1fr))',
  2: 'repeat(2, minmax(0, 1fr))',
  3: 'repeat(3, minmax(0, 1fr))',
  4: 'repeat(4, minmax(0, 1fr))',
  7: 'repeat(7, minmax(0, 1fr))',    // Week view
  12: 'repeat(12, minmax(0, 1fr))',

  // Custom meal grid layouts
  'meal-week': 'repeat(7, minmax(280px, 1fr))',  // Desktop week view
  'meal-day': 'repeat(4, 1fr)',                  // Meals per day
  'hero-split': '1.1fr 1fr',                     // Content-focused split
}
```

#### Grid Template Rows
```javascript
export const gridTemplateRows = {
  1: 'repeat(1, minmax(0, 1fr))',
  2: 'repeat(2, minmax(0, 1fr))',
  3: 'repeat(3, minmax(0, 1fr))',
  4: 'repeat(4, minmax(0, 1fr))',    // Meal types
  5: 'repeat(5, minmax(0, 1fr))',
  6: 'repeat(6, minmax(0, 1fr))',
}
```

### Blocklist Configuration (Important!)

**File**: `/home/alexandru/Projects/MealPlan/packages/config/tailwind/tailwind.config.js`

```javascript
// Disable arbitrary values - ONLY semantic tokens allowed
blocklist: [
  // Block all arbitrary values
  /\[.*\]/,
],
```

**⚠️ IMPORTANT**: Configurația blochează complet utilizarea valorilor arbitrare (`[value]`). Toate spațierile și poziționările TREBUIE să folosească token-urile predefinite.

### Patterns Recomandate pentru Corner Positioning

#### 1. Folosing Inset Utilities cu Token-uri
```css
/* Example pentru colțuri */
.top-space-lg      /* top: 24px */
.right-space-xl    /* right: 32px */
.bottom-space-2xl  /* bottom: 48px */
.left-space-lg     /* left: 24px */

/* Combined inset */
.inset-space-md    /* all sides: 16px */
```

#### 2. Z-Index pentru Layering
```css
.z-20             /* Cards/elevated elements */
.z-30             /* Sticky workflow elements */
.z-50             /* Dropdowns/overlays */
```

#### 3. Animation Classes Disponibile
```css
.duration-fast     /* 150ms */
.duration-normal   /* 250ms */
.duration-slow     /* 350ms */

.ease-out         /* cubic-bezier(0, 0, 0.2, 1) */
.ease-in-out      /* cubic-bezier(0.4, 0, 0.2, 1) */
.ease-bounce      /* cubic-bezier(0.68, -0.55, 0.265, 1.55) */
```

#### 4. Grid Layout Options
```css
.grid-cols-4      /* 4 equal columns */
.grid-cols-7      /* Week view layout */
.grid-cols-meal-day /* Custom 4-column meal layout */
```

### Lipsuri Identificate

1. **Nu există pattern-uri predefinite pentru corner positioning**: Trebuie combinate manual utilități `top-*`, `right-*`, etc.
2. **Lipsă grid templates pentru corner layouts**: Nu există template-uri predefinite pentru poziționarea în colțuri
3. **Nu există utilități pentru responsive corner positioning**: Trebuie gestionat manual cu responsive prefixes

### Sugestii pentru Workflow Repositioning

#### Utilizarea Token-urilor Existente
- **Corner spacing**: Folosește `space-lg` (24px) ca spacing minim între noduri și margini
- **Staggered positioning**: Combină `space-xl` și `space-2xl` pentru spacing variate
- **Transitions**: Folosește `duration-normal` (250ms) cu `ease-out` pentru animații smooth

#### Pattern-uri CSS Recomandate
```css
/* Corner positioning cu token-uri */
.absolute.top-space-lg.left-space-lg      /* Top-left corner */
.absolute.top-space-xl.right-space-xl     /* Top-right corner */
.absolute.bottom-space-2xl.left-space-md  /* Bottom-left corner */
.absolute.bottom-space-lg.right-space-2xl /* Bottom-right corner */
```