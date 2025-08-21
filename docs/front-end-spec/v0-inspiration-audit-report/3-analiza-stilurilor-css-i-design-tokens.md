# 3. Analiza Stilurilor CSS și Design Tokens ✅

## 3.1 Design Tokens CSS Variables

### Coquinate Custom Colors
```css
/* Coquinate Color Palette */
--primary-warm: oklch(58% 0.08 200);
--primary-warm-dark: oklch(45% 0.09 200);
--accent-coral: oklch(70% 0.18 20);
--accent-coral-soft: oklch(78% 0.12 20);

--surface-eggshell: oklch(98% 0.004 75);
--surface-white: oklch(100% 0 0);

--dark-surface: oklch(15% 0.01 200);
--dark-surface-raised: oklch(18% 0.01 200);

--text-primary: oklch(20% 0 0);
--text-secondary: oklch(45% 0 0);
--text-light: oklch(92% 0 0);
--text-muted: oklch(60% 0 0);

--border-light: oklch(90% 0 0);
--shadow-soft: 0 4px 20px oklch(0% 0 0 / 0.06);
--shadow-hover: 0 8px 30px oklch(0% 0 0 / 0.1);
```

### Shadcn/UI System Variables (Light Theme)
```css
--background: oklch(1 0 0);
--foreground: oklch(0.145 0 0);
--card: oklch(1 0 0);
--card-foreground: oklch(0.145 0 0);
--popover: oklch(1 0 0);
--popover-foreground: oklch(0.145 0 0);
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
--secondary: oklch(0.97 0 0);
--secondary-foreground: oklch(0.205 0 0);
--muted: oklch(0.97 0 0);
--muted-foreground: oklch(0.556 0 0);
--accent: oklch(0.97 0 0);
--accent-foreground: oklch(0.205 0 0);
--destructive: oklch(0.577 0.245 27.325);
--destructive-foreground: oklch(0.577 0.245 27.325);
--border: oklch(0.922 0 0);
--input: oklch(0.922 0 0);
--ring: oklch(0.708 0 0);
--radius: 0.625rem;
```

### Chart Colors (Data Visualization)
```css
--chart-1: oklch(0.646 0.222 41.116);
--chart-2: oklch(0.6 0.118 184.704);
--chart-3: oklch(0.398 0.07 227.392);
--chart-4: oklch(0.828 0.189 84.429);
--chart-5: oklch(0.769 0.188 70.08);
```

### Sidebar Component System
```css
--sidebar: oklch(0.985 0 0);
--sidebar-foreground: oklch(0.145 0 0);
--sidebar-primary: oklch(0.205 0 0);
--sidebar-primary-foreground: oklch(0.985 0 0);
--sidebar-accent: oklch(0.97 0 0);
--sidebar-accent-foreground: oklch(0.205 0 0);
--sidebar-border: oklch(0.922 0 0);
--sidebar-ring: oklch(0.708 0 0);
```

### Dark Theme Override
```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  /* ... rest of dark theme variables */
}
```

## 3.2 Color System Completă

### Paleta Primară
- **Primary Warm**: `oklch(58% 0.08 200)` - Albastru cald principal
- **Primary Warm Dark**: `oklch(45% 0.09 200)` - Varianta întunecată
- **Accent Coral**: `oklch(70% 0.18 20)` - Coral vibrant pentru accenturi
- **Accent Coral Soft**: `oklch(78% 0.12 20)` - Coral moale pentru backgrounds

### Suprafețe și Backgrounds
- **Surface Eggshell**: `oklch(98% 0.004 75)` - Background principal off-white
- **Surface White**: `oklch(100% 0 0)` - Alb pur pentru cards
- **Dark Surface**: `oklch(15% 0.01 200)` - Background dark mode
- **Dark Surface Raised**: `oklch(18% 0.01 200)` - Elevated dark surfaces

### Text Colors
- **Text Primary**: `oklch(20% 0 0)` - Text principal foarte întunecat
- **Text Secondary**: `oklch(45% 0 0)` - Text secundar mediu
- **Text Light**: `oklch(92% 0 0)` - Text pe backgrounds întunecați
- **Text Muted**: `oklch(60% 0 0)` - Text atenuated/hints

## 3.3 Spacing System

### Padding și Margin Patterns
- **Small screens**: `p-4`, `px-4`, `py-8` (16px, 32px)
- **Medium screens**: `sm:p-6`, `sm:px-6`, `sm:py-12` (24px, 48px)
- **Large screens**: `md:p-8`, `lg:px-8` (32px)

### Component Specific Spacing
- **Email Capture**: `p-4 sm:p-6 md:p-8` (16px → 24px → 32px)
- **CTA Section**: `py-16 sm:py-20 md:py-24` (64px → 80px → 96px)
- **Features Section**: `py-16 sm:py-20 md:py-24` (64px → 80px → 96px)
- **Footer**: `py-8 sm:py-12` (32px → 48px)

### Gap Systems
- **Button Groups**: `gap-2`, `gap-3` (8px, 12px)
- **Grid Systems**: `gap-4 sm:gap-6 md:gap-8` (16px → 24px → 32px)

## 3.4 Typography System

### Font Families
```css
--font-sans: var(--font-inter);  /* Default sans-serif */
--font-serif: var(--font-lexend); /* Headers și accents */
```

### Font Sizes și Weights
- **Hero Titles**: `text-[3.5rem]` desktop, `text-[2.75rem]` mobile
- **Section Titles**: `text-2xl sm:text-3xl md:text-4xl` (responsive)
- **Body Text**: `text-base sm:text-lg` cu `text-[1.2rem]` pentru leads
- **Small Text**: `text-xs sm:text-sm` (12px → 14px)
- **Stats/Numbers**: `text-[1.75rem]` cu `font-serif font-semibold`

### Line Heights
- **Headers**: `leading-[1.15]`, `leading-tight`
- **Body**: `leading-relaxed` (1.625)
- **Compact**: `leading-snug` (1.375)

## 3.5 Animation Keyframes

### Core Animations
```css
@keyframes subtle-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-left {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fade-in-right {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes breathing {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```

### Animation Classes
- `.animate-subtle-pulse` - 3s ease-in-out infinite
- `.animate-fade-in-up` - 0.8s ease-out forwards
- `.animate-fade-in-left` - 0.8s ease-out forwards
- `.animate-fade-in-right` - 0.8s ease-out forwards
- `.animate-breathing` - 4s ease-in-out infinite
- `.animate-float` - 6s ease-in-out infinite

### Animation Delays
- `.animate-delay-200` - 0.2s
- `.animate-delay-400` - 0.4s
- `.animate-delay-600` - 0.6s

## 3.6 Utility Classes Custom

### Hover Effects
```css
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px oklch(0% 0 0 / 0.15);
}

.hover-glow {
  transition: all 0.3s ease;
}
.hover-glow:hover {
  box-shadow: 0 0 30px oklch(70% 0.18 20 / 0.3);
}
```

### Workflow Card Cursors
```css
.workflow-card {
  cursor: pointer;
}
.workflow-card:hover { cursor: grab; }
.workflow-card:active { cursor: grabbing; }
```

### CTA Button Glow
```css
.cta-glow-button::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}
```

## 3.7 Layout Classes și Grid Systems

### Container Patterns
- **Max Width**: `max-w-6xl mx-auto` (standard container)
- **Max Width Restricted**: `max-w-4xl mx-auto` (CTA sections)
- **Max Width Small**: `max-w-2xl mx-auto` (text content)

### Grid Layouts
- **Hero Desktop**: `grid-cols-[1.1fr_1fr]` (content + visual)
- **Features**: `grid-cols-1 md:grid-cols-2` (responsive 2-column)
- **Statistics**: `grid-cols-3` (3 equal columns)

### Flexbox Patterns
- **Center Content**: `flex items-center justify-center`
- **Space Between**: `flex justify-between items-center`
- **Column Stack**: `flex flex-col gap-3`

## 3.8 Responsive Breakpoints

### Tailwind Default Breakpoints Utilized
- **sm**: `640px` - Tablets în portret
- **md**: `768px` - Tablets în landscape
- **lg**: `1024px` - Desktop mic
- **xl**: `1280px` - Desktop mare (nu folosit explicit)
- **2xl**: `1536px` - Desktop foarte mare (nu folosit)

### Layout Changes by Breakpoint
- **Mobile**: Single column, stacked layout
- **sm**: Adjusted spacing și font sizes
- **md**: Intermediate layouts, 2-column grids
- **lg**: Full desktop layout cu sidebar columns

### Typography Responsive Patterns
- Headers: `text-2xl sm:text-3xl md:text-4xl`
- Body: `text-sm sm:text-base`
- Small text: `text-xs sm:text-sm`

## 3.9 Z-index System

### Z-index Hierarchy (în ordine crescătoare)
```css
z-0     /* Background elements (SVG paths) */
z-10    /* Standard elevated content, cards, workflow steps */
z-40    /* Floating elements (share button) */
z-50    /* Navigation bar, modals, sound toggle */
z-confetti /* Custom z-index pentru confetti effect (cel mai sus) */
```

### Usage Patterns
- **Background**: `z-0` pentru SVG decorations
- **Content**: `z-10` pentru cards și content normal
- **Floating UI**: `z-40` pentru floating action buttons
- **Overlays**: `z-50` pentru modals și navigation
- **Special Effects**: `z-confetti` pentru animații speciale

## 3.10 Shadow System

### Predefined Shadows
```css
--shadow-soft: 0 4px 20px oklch(0% 0 0 / 0.06);    /* Soft subtle shadow */
--shadow-hover: 0 8px 30px oklch(0% 0 0 / 0.1);    /* Hover state shadow */
```

### Hover Shadow Effects
```css
/* Lift effect */
box-shadow: 0 20px 40px oklch(0% 0 0 / 0.15);

/* Glow effect */  
box-shadow: 0 0 30px oklch(70% 0.18 20 / 0.3);

/* CTA button complex shadow */
box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3), 
           0 0 20px rgba(255, 255, 255, 0.4), 
           inset 0 1px 0 rgba(255, 255, 255, 0.2);
```

### Shadow Progressive Enhancement
- **Default**: Subtle software cu `--shadow-soft`
- **Hover**: Enhanced shadow pentru depth
- **Interactive**: Glow effects pentru accent elements

## 3.11 Stiluri Inline și Clase Tailwind Importante

### Gradient Backgrounds
```typescript
// Text gradients pentru titles
"bg-gradient-to-r from-[var(--primary-warm)] to-[var(--accent-coral)] bg-clip-text text-transparent"

// Section backgrounds
"bg-gradient-to-br from-[var(--primary-warm)] to-[var(--accent-coral)]"

// Progress bars
"bg-gradient-to-r from-[var(--accent-coral)] to-[var(--primary-warm)]"
```

### Dynamic Inline Styles
```typescript
// Scroll parallax
style={{ transform: `translateY(${scrollY * 0.1}px)` }}

// Progress width
style={{ width: `${progressPercentage}%` }}

// Animation delays
style={{ animationDelay: `${index * 0.2}s` }}
```

### Touch Target Optimization
- **Minimum Touch Target**: `min-h-[44px]` (Apple guideline)
- **Button Padding**: `py-3 sm:py-3.5` (adequate touch area)
- **Interactive Elements**: Consistent 44px+ height/width

### Critical Color Combinations Identificate
- **Primary on White**: `text-[var(--primary-warm)]` on `bg-[var(--surface-white)]`
- **Coral Accents**: `text-[var(--accent-coral)]` pentru highlights
- **Error States**: `border-red-400 text-red-600` 
- **Success States**: `border-green-400 text-green-500`
- **Muted Content**: `text-[var(--text-muted)]` pentru secondary info
