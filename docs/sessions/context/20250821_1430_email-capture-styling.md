# Email Capture Styling Research - 2025-08-21 14:30

## Research Findings on Design System & Available Tokens

### OKLCH Color System

**Primary Colors:**
- [Token]: `primary` - `var(--color-primary)` → `oklch(58% 0.08 200)` (Modern Hearth warm teal)
- [Token]: `primary-warm` - `var(--color-primary-warm)` → `oklch(58% 0.08 200)` (reference to primary)
- [Token]: `primary-warm-light` - `var(--color-primary-warm-light)` → `oklch(72% 0.06 200)`
- [Token]: `primary-warm-dark` - `var(--color-primary-warm-dark)` → `oklch(45% 0.09 200)`

**Status Colors:**
- [Token]: `success` - `var(--color-success)` → `oklch(65% 0.15 145)` (for success states)
- [Token]: `error` - `var(--color-error)` → `oklch(60% 0.2 25)` (for error states)
- [Token]: `warning` - `var(--color-warning)` → `oklch(75% 0.15 85)` (for warning states)

**Surface Colors:**
- [Token]: `surface` - `var(--color-surface)` → `oklch(99.5% 0.003 75)` (eggshell default)
- [Token]: `surface-white` - `var(--color-surface-white)` → `oklch(100% 0 0)` (pure white)
- [Token]: `surface-raised` - `var(--color-surface-raised)` → `oklch(100% 0 0)` (elevated cards)
- [Token]: `surface-hover` - `var(--color-surface-hover)` → `oklch(94% 0 0)` (hover states)

**Text Colors:**
- [Token]: `text` - `var(--color-text)` → `oklch(20% 0 0)` (primary text)
- [Token]: `text-secondary` - `var(--color-text-secondary)` → `oklch(45% 0 0)` (secondary text)
- [Token]: `text-muted` - `var(--color-text-muted)` → `oklch(50% 0 0)` (muted text)
- [Token]: `text-subtle` - `var(--color-text-subtle)` → `oklch(75% 0 0)` (subtle text)

**Border Colors:**
- [Token]: `border` - `var(--color-border)` → `oklch(92% 0 0)` (default border)
- [Token]: `border-light` - `var(--color-border-light)` → `oklch(94% 0 0)` (light borders)
- [Token]: `border-subtle` - `var(--color-border-subtle)` → `oklch(96% 0 0)` (subtle dividers)
- [Token]: `border-strong` - `var(--color-border-strong)` → `oklch(85% 0 0)` (strong borders)
- [Token]: `border-focus` - `var(--color-border-focus)` → `oklch(58% 0.08 200)` (focus borders)

### Glass Morphism System

**Glass Effects (from packages/ui/src/styles/globals.css):**
- [Pattern]: `globals.css:59-64` - `.glass` base class with `oklch(98% 0.004 75 / 0.8)` background + `blur(10px)`
- [Pattern]: `globals.css:78-84` - `.glass-elevated` enhanced glass with `oklch(98% 0.004 75 / 0.85)` + `blur(12px)` + `box-shadow`
- [Pattern]: `globals.css:92-101` - `.glass-input` input-specific glass with `oklch(100% 0 0 / 0.7)` + `blur(8px)`

**Glass Utilities:**
- [Token]: `surface-glass` - `var(--color-surface-glass)` → `oklch(98% 0 0 / 0.8)` (glass base)
- [Token]: `surface-glass-elevated` - `var(--color-surface-glass-elevated)` → `oklch(100% 0 0 / 0.9)` (elevated glass)
- [Token]: `surface-glass-border` - `var(--color-surface-glass-border)` → `oklch(100% 0 0 / 0.2)` (glass borders)

### Animation & Motion Tokens

**Animation Durations:**
- [Token]: `duration-instant` - `50ms` (micro interactions)
- [Token]: `duration-fast` - `150ms` (quick transitions)
- [Token]: `duration-normal` - `250ms` (default transitions)
- [Token]: `duration-slow` - `350ms` (complex animations)
- [Token]: `duration-slower` - `500ms` (emphasis animations)

**Animation Easings:**
- [Token]: `ease-in` - `cubic-bezier(0.4, 0, 1, 1)` (entry animations)
- [Token]: `ease-out` - `cubic-bezier(0, 0, 0.2, 1)` (exit animations)
- [Token]: `ease-in-out` - `cubic-bezier(0.4, 0, 0.2, 1)` (balanced animations)
- [Token]: `ease-bounce` - `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (playful bounce)

**Pre-defined Animations:**
- [Pattern]: `globals.css:122-131` - `.hover-lift` class with `transform: translateY(-2px)` hover effect
- [Pattern]: `globals.css:142-157` - `.animate-float` with custom keyframes for floating effect
- [Pattern]: `globals.css:165-176` - `.animate-spin` for loading spinners

### Spacing & Layout Tokens

**Semantic Spacing:**
- [Token]: `space-xs` - `4px` (inline elements, tight spacing)
- [Token]: `space-sm` - `8px` (related items, component internal)
- [Token]: `space-md` - `16px` (section spacing, card padding)
- [Token]: `space-lg` - `24px` (group separation, component gaps)
- [Token]: `space-xl` - `32px` (major sections, page regions)
- [Token]: `space-2xl` - `48px` (page sections, hero spacing)

**Component-Specific Spacing:**
- [Token]: `touch-target` - `44px` (minimum touch target size)
- [Token]: `touch-spacing` - `8px` (minimum between touch targets)

### Border Radius System

**Semantic Radius:**
- [Token]: `button` - `8px` (button border radius)
- [Token]: `input` - `8px` (input field border radius)
- [Token]: `card` - `16px` (card border radius) - Updated per audit
- [Token]: `modal` - `16px` (modal border radius)

### Shadow System

**Component Shadows:**
- [Token]: `shadow-soft` - `0 4px 20px rgba(0, 0, 0, 0.06)` (soft shadow from mockup)
- [Token]: `shadow-hover` - `0 8px 30px rgba(0, 0, 0, 0.1)` (hover shadow from mockup)
- [Token]: `shadow-card` - `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- [Token]: `shadow-email-card` - `0 4px 12px rgba(0, 0, 0, 0.08)` (mockup specification)

### Typography Tokens

**Font Families:**
- [Token]: `font-primary` - Inter font stack with Romanian support
- [Token]: `font-display` - Lexend for warm, readable headlines

**Context-Aware Font Sizes:**
- [Token]: `form-title` - `1.125rem` with `lineHeight: 1.4` and `fontWeight: 600` (18px for form titles)
- [Token]: `description` - `0.875rem` with `lineHeight: 1.5` (14px for secondary text)

### Focus & Interaction Patterns

**Focus States:**
- [Pattern]: `globals.css:110-114` - `.focus-glass` with primary color ring and subtle shadow
- [Pattern]: `globals.css:116-119` - `.focus-premium-warm` with enhanced primary color shadow
- [Guideline]: Always use `focus:outline-none` with custom focus styles for accessibility

### Email Capture Specific Patterns

**From packages/ui/src/components/email-capture/styles.ts:**

**Input Styling Patterns:**
- [Pattern]: `styles.ts:43` - Glass input: `glass-input w-full focus-glass text-text placeholder:text-text-muted/60`
- [Pattern]: `styles.ts:44` - Simple input: `border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary-warm`
- [Pattern]: `styles.ts:46` - Mockup input: `border-2 border-border-subtle focus:border-primary focus:shadow-[0_0_0_3px_oklch(58%_0.08_200_/_0.2)]`

**Button Styling Patterns:**
- [Pattern]: `styles.ts:84` - Glass button: `bg-gradient-to-r from-primary-warm to-primary-warm-light text-white hover:shadow-sm`
- [Pattern]: `styles.ts:87` - Standard button: `bg-primary text-white hover:bg-primary-600`

**Container Patterns:**
- [Pattern]: `styles.ts:134` - Glass container: `glass glass-elevated rounded-card p-6 sm:p-8 relative z-10 hover-lift`
- [Pattern]: `styles.ts:144` - Mockup container: `bg-white border-2 border-border-light rounded-xl p-8 shadow-email-card`

### Dark Mode Support

**Dark Mode Variables (from context-variables.css):**
- [Token]: All color tokens automatically adapt through CSS variables
- [Pattern]: `context-variables.css:186-301` - Complete dark mode color overrides using `@media (prefers-color-scheme: dark)`
- [Guideline]: Use CSS variables only - no separate dark: classes needed

### Component Architecture Guidelines

**Class Variance Authority (CVA) Pattern:**
- [Pattern]: `styles.ts:1-2` - Import `cva` from 'class-variance-authority'
- [Pattern]: `styles.ts:6-18` - Use cva with variants object for component variants
- [Guideline]: Always use CVA for component styling variants instead of conditional classes

**CSS Custom Properties Strategy:**
- [Guideline]: All colors use `var(--color-*)` format for runtime theme switching
- [Guideline]: Single source of truth through CSS variables defined in context-variables.css
- [Guideline]: No hardcoded OKLCH values in components - always reference design tokens

### Accessibility Patterns

**WCAG Compliance:**
- [Guideline]: Minimum 44px touch targets (use `touch-target` token)
- [Guideline]: Always provide focus indicators with custom focus styles
- [Guideline]: Use semantic HTML with proper ARIA labels
- [Guideline]: Support reduced motion with `@media (prefers-reduced-motion: reduce)`

### Implementation Guidelines

**Token Usage Rules:**
- [Guideline]: NO arbitrary Tailwind values allowed (`blocklist: [/\[.*\]/]` in config)
- [Guideline]: ONLY semantic tokens from design-tokens.js
- [Guideline]: Use CSS variables for all color references
- [Guideline]: Follow component variant pattern with CVA for scalable styling

**Performance Guidelines:**
- [Guideline]: Use `transform` and `opacity` for animations (GPU accelerated)
- [Guideline]: Limit backdrop-filter blur values (performance impact)
- [Guideline]: Prefer CSS transitions over JavaScript animations

### Available Utility Classes

**Glass Morphism:**
- `.glass` - Base glass effect
- `.glass-elevated` - Enhanced glass with elevation
- `.glass-input` - Input-specific glass styling

**Motion:**
- `.hover-lift` - Hover lift effect with shadow
- `.animate-float` - Floating animation
- `.animate-spin` - Loading spinner

**Focus:**
- `.focus-glass` - Glass-style focus ring
- `.focus-premium-warm` - Enhanced warm focus effect

**Typography:**
- `.font-primary` - Primary font family
- `.font-display` - Display font family
- `.text-romanian` - Romanian-optimized line height and kerning

---

## Test Scenarios for Email Capture Styling Improvements

### Visual Regression Testing

**[Test]: Visual regression baseline capture**
- [Coverage]: Screenshot comparison for each variant (glass, simple, inline, promo)
- [Coverage]: All component states (idle, loading, success, error)
- [Coverage]: Dark mode compatibility testing
- [Coverage]: Floating elements positioning verification (glass variant)

**[Test]: Layout integrity across variants**
- [Coverage]: Container positioning and dimensions consistency
- [Coverage]: Glass morphism effect rendering accuracy
- [Coverage]: Gradient application on buttons and backgrounds
- [Coverage]: OKLCH color rendering verification

**[Test]: Typography and spacing consistency**
- [Coverage]: Romanian text rendering with proper line-height
- [Coverage]: Touch target size validation (minimum 44px)
- [Coverage]: Semantic spacing token application
- [Coverage]: Font family and weight application

### Responsive Behavior Testing

**[Test]: Responsive breakpoint transitions**
- [Coverage]: Mobile viewport (320px-768px) layout adaptation
- [Coverage]: Tablet viewport (768px-1024px) component scaling
- [Coverage]: Desktop viewport (1024px+) full feature display
- [Coverage]: Ultra-wide display (1440px+) content centering

**[Test]: Touch interaction testing**
- [Coverage]: Touch target accessibility on mobile devices
- [Coverage]: Hover effects graceful fallback on touch devices
- [Coverage]: Focus states visibility on touch navigation
- [Coverage]: Glass morphism performance on mobile browsers

**[Test]: Responsive content adaptation**
- [Coverage]: Text overflow handling in confined spaces
- [Coverage]: Button text truncation prevention
- [Coverage]: Input field width adaptation
- [Coverage]: Status message positioning consistency

### Animation and Interaction Testing

**[Test]: Glass morphism animation performance**
- [Coverage]: Backdrop-filter blur rendering smoothness
- [Coverage]: Hover-lift transition timing and easing
- [Coverage]: Glass container opacity transitions
- [Coverage]: Inner glow gradient animation stability

**[Test]: Loading state animations**
- [Coverage]: Spinner animation smoothness and timing
- [Coverage]: Button state transition accuracy
- [Coverage]: Loading text content switching
- [Coverage]: Disabled state visual feedback

**[Test]: Floating elements motion**
- [Coverage]: Floating orbs animation fluidity
- [Coverage]: Particle effects trigger timing
- [Coverage]: Performance impact on lower-end devices
- [Coverage]: Animation cleanup on component unmount

**[Test]: Focus and interaction feedback**
- [Coverage]: Focus ring visibility and styling
- [Coverage]: Hover state transition smoothness
- [Coverage]: Active state visual feedback
- [Coverage]: Keyboard navigation indicators

### Accessibility Testing

**[Test]: Color contrast compliance**
- [Coverage]: WCAG AA contrast ratios for all text elements
- [Coverage]: Focus indicator visibility against glass backgrounds
- [Coverage]: Error message color accessibility
- [Coverage]: Placeholder text readability

**[Test]: Screen reader compatibility**
- [Coverage]: ARIA labels and descriptions accuracy
- [Coverage]: Status messages announcements
- [Coverage]: Form field associations
- [Coverage]: Loading state announcements

**[Test]: Keyboard navigation flow**
- [Coverage]: Tab order logical progression
- [Coverage]: Focus trap within component boundaries
- [Coverage]: Escape key handling for modals/overlays
- [Coverage]: Enter key form submission

**[Test]: Reduced motion compliance**
- [Coverage]: Animation disabling with prefers-reduced-motion
- [Coverage]: Glass effects static fallback
- [Coverage]: Essential animations preservation
- [Coverage]: Floating elements behavior adjustment

### Cross-Browser Testing

**[Test]: Modern browser glass effects**
- [Coverage]: Chrome backdrop-filter rendering
- [Coverage]: Firefox glass morphism compatibility
- [Coverage]: Safari iOS glass effects performance
- [Coverage]: Edge Chromium feature parity

**[Test]: Fallback behavior testing**
- [Coverage]: Graceful degradation for unsupported features
- [Coverage]: Alternative styling for older browsers
- [Coverage]: Progressive enhancement verification
- [Coverage]: Feature detection accuracy

### Performance Testing

**[Test]: Rendering performance metrics**
- [Coverage]: Initial paint time with glass effects
- [Coverage]: Layout shift prevention during state changes
- [Coverage]: Memory usage with floating animations
- [Coverage]: CPU impact of backdrop-filter effects

**[Test]: Bundle size impact**
- [Coverage]: CSS file size with new styling tokens
- [Coverage]: JavaScript bundle impact assessment
- [Coverage]: Tree-shaking effectiveness verification
- [Coverage]: Critical CSS extraction accuracy

### Component State Testing

**[Test]: Form validation styling**
- [Coverage]: Invalid input border color changes
- [Coverage]: Error message styling consistency
- [Coverage]: Success state visual confirmation
- [Coverage]: GDPR checkbox styling (promo variant)

**[Test]: Dynamic content adaptation**
- [Coverage]: Long error message handling
- [Coverage]: Multiple error states display
- [Coverage]: Success message positioning
- [Coverage]: Content overflow prevention

### Design Token Integration Testing

**[Test]: Token consistency verification**
- [Coverage]: OKLCH color values accurate rendering
- [Coverage]: Semantic spacing application verification
- [Coverage]: Typography token implementation
- [Coverage]: Shadow system token usage

**[Test]: Theme switching compatibility**
- [Coverage]: Dark mode token adaptation
- [Coverage]: Glass effects color scheme adjustment
- [Coverage]: Contrast maintenance across themes
- [Coverage]: Border visibility in all themes