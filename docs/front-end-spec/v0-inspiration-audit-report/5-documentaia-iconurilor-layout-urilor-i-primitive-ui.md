# 5. Documentația Iconurilor, Layout-urilor și Primitive UI ✅

## 5.1 ICONURI COMPLETE - @tabler/icons-react

### 5.1.1 Iconuri Funcționale (Interactive)

#### Navigation & UI Flow
```typescript
// workflow-visualization.tsx
IconChefHat      // size={20} în desktop, size={12} în mobile - Cooking action
IconFileText     // size={20} în desktop, size={12} în mobile - Documentation/reuse  
IconStack2       // size={20} în desktop, size={12} în mobile - Stacking/creative reuse
IconArrowDown    // size={12} - Mobile workflow direction indicators

// features-section.tsx  
IconMapPin       // size={28} - Local ingredients feature
IconClipboardCheck // size={28} - Interactive shopping lists
IconCircleCheck  // size={28} - Zero waste feature  
IconChefHat      // size={28} - AI Chef feature (duplicate usage)

// progress-indicator.tsx
IconUsers        // size={16} - User count indicator
IconTrendingUp   // size={12} - Remaining spots indicator
```

#### Form & State Indicators
```typescript
// email-capture.tsx
IconCircleCheck  // size={16} - Email validation success (real-time)
IconCircleCheck  // size={20} - Success message confirmation (larger, with animate-bounce)
IconAlertCircle  // size={16} - Email validation error (real-time)
IconAlertCircle  // size={14} - Error message display
IconLoader2      // size={16} - Submission loading spinner (animate-spin)

// checkbox.tsx (ui component)
IconCheck        // size={3.5} - Checkbox indicator (in primitive)
```

#### Social & Sharing
```typescript
// footer.tsx
IconBrandFacebook  // size={18} - Social link (hover:text-blue-400)
IconBrandInstagram // size={18} - Social link (hover:text-pink-400)  
IconBrandTwitter   // size={18} - Social link (hover:text-sky-400)
IconMail          // size={18} - Email contact (hover:text-green-400)
IconHeart         // size={12} - Footer tagline accent (animate-pulse)
IconHeart         // size={12} - Easter egg reveal message (animate-pulse)

// share-component.tsx
IconShare2        // size={14} - Native share button (mobile only)
IconBrandFacebook // size={14} - Facebook share
IconMessageCircle // size={14} - WhatsApp share (not WhatsApp icon)
IconMail          // size={14} - Email share
IconCopy          // size={14} - Copy link (default state)
IconCheck         // size={14} - Copy success feedback (text-green-600)
```

#### Audio & Interaction
```typescript
// sound-toggle.tsx
IconVolume2       // size={20} - Sound enabled state (text-primary-warm)
IconVolumeX       // size={20} - Sound disabled state (text-muted)
```

### 5.1.2 Iconuri Decorative (Non-interactive)

#### Pure Visual Elements
- **Navigation counter dots**: HTML entities `w-2 h-2 bg-[var(--accent-coral)] rounded-full animate-subtle-pulse` 
- **Timeline dots**: `w-2.5 h-2.5 bg-[var(--accent-coral)] rounded-full border-2 border-white shadow-sm`
- **Workflow icons backgrounds**: `bg-[var(--accent-coral-soft)] rounded-lg w-10 h-10 flex items-center justify-center`

#### Text Accents & Embellishments  
```typescript
// email-capture.tsx
"✓" // Unicode checkmark în benefit text (text-[var(--accent-coral)] font-bold)

// footer.tsx
"🍳✨🥘" // Easter egg emojis (text-4xl animate-bounce)
```

### 5.1.3 Icon Size System

#### Size Hierarchy (by usage context)
```typescript
// Extra Small: 12px
size={12} // IconArrowDown (mobile workflows), IconTrendingUp, IconHeart

// Small: 14px  
size={14} // Share buttons, IconAlertCircle (error messages)

// Medium: 16px
size={16} // Form validation, IconUsers, IconLoader2

// Large: 18px
size={18} // Social footer links

// Extra Large: 20px
size={20} // Desktop workflow icons, sound toggle

// XXL: 28px
size={28} // Feature section icons (primary feature indicators)
```

#### Responsive Icon Patterns
- **Desktop workflow**: `size={20}` cu `w-10 h-10` backgrounds
- **Mobile workflow**: `size={12}` cu `w-6 h-6` backgrounds
- **Consistent social**: `size={18}` across all footer links
- **Form feedback**: `size={16}` pentru real-time validation
- **Feature highlights**: `size={28}` pentru main feature cards

### 5.1.4 Icon Color Patterns

#### State-based Coloring
```typescript
// Success States
'text-green-500'    // Success validation icons
'text-[#2F855A]'    // Success message icons

// Error States  
'text-red-500'      // Error validation icons
'text-red-600'      // Error message icons

// Brand Colors
'text-[var(--accent-coral)]'      // Most decorative icons
'text-[var(--primary-warm)]'      // Primary interactive icons
'text-[var(--text-muted)]'        // Disabled/inactive icons

// Social Brand Colors
'text-blue-400'     // Facebook hover
'text-pink-400'     // Instagram hover  
'text-sky-400'      // Twitter hover
'text-green-400'    // Email hover
```

#### Icon Background Patterns
```typescript
// Standard Icon Backgrounds
'bg-[var(--accent-coral-soft)]'           // Most icon backgrounds
'bg-[var(--accent-coral-soft)]/10'        // Dark theme icon backgrounds

// Special Cases
'bg-white/10 backdrop-blur-sm border border-white/20' // Footer social (glass effect)
'bg-[var(--surface-eggshell)] border border-[var(--border-light)]' // Copy button
```

## 5.2 LAYOUT SYSTEMS DETALIATE

### 5.2.1 Grid Systems Utilizate

#### CSS Grid Implementations
```typescript
// Hero Section (Desktop) - Asymmetric Grid
'grid grid-cols-[1.1fr_1fr] gap-16 items-center'
// Left column (1.1fr): Content (text, stats, email form)
// Right column (1fr): Workflow visualization
// Gap: 64px între coloane

// Features Section - Responsive Grid  
'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8'
// Mobile: Single column, gap 16px
// Tablet: Single column, gap 24px  
// Desktop: 2 columns, gap 32px

// Statistics Grid (Hero Section)
'grid grid-cols-3 gap-6 mb-10 py-6 border-t border-b'
// Desktop: 3 equal columns, gap 24px
'grid grid-cols-3 gap-2 mb-6 py-4 border-t border-b'  
// Mobile: 3 equal columns, gap 8px (compressed)

// Workflow Mobile Timeline - No Grid
// Uses absolute positioning cu timeline line
```

#### Flexbox Dominant Patterns  
```typescript
// Navigation Layout
'flex justify-between items-center'
// Logo left, counter right, vertically centered

// Button Groups (Email Form)
'flex flex-col sm:flex-row gap-3 mb-3'
// Mobile: Stacked vertically
// Desktop: Horizontal row

// Icon + Text Combinations
'flex items-center gap-2'        // Standard icon-text pairing
'flex items-center gap-3 mb-2'   // Workflow cards (larger gap)
'flex items-center justify-center gap-2 mb-2' // Success messages

// Social Share Buttons
'flex justify-center gap-3'      // Horizontal centered layout

// Footer Social Icons  
'flex justify-center gap-4 mb-4 sm:mb-6'
// Responsive gap: 16px → 24px
```

### 5.2.2 Container Width Patterns

#### Max-Width Hierarchy
```typescript
// Standard Content Container
'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'
// Width: 1152px max, responsive padding
// Usage: Navigation, Hero, Features sections

// Narrow Content Container  
'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'
// Width: 896px max
// Usage: CTA section (focused content)

// Text Content Container
'max-w-2xl mx-auto'              // 672px max
'max-w-[550px]'                  // Custom: 550px max (hero description)
'max-w-[500px] mx-auto'          // Mobile hero description

// Constrained Components
'max-w-[280px] mx-auto'          // Mobile workflow visualization
'max-w-[220px]'                  // Desktop workflow cards width
```

#### Responsive Padding System
```typescript
// Standard Responsive Padding
'px-4 sm:px-6 lg:px-8'
// Mobile: 16px, Tablet: 24px, Desktop: 32px

// Section Vertical Padding  
'py-16 sm:py-20 md:py-24'       // CTA, Features sections
// Mobile: 64px, Tablet: 80px, Desktop: 96px

'py-8 sm:py-12'                 // Footer
// Mobile: 32px, Tablet: 48px

'py-2 md:py-3'                  // Navigation  
// Mobile: 8px, Desktop: 12px

// Component Internal Padding
'p-4 sm:p-6 md:p-8'             // Email capture, feature cards
// Mobile: 16px, Tablet: 24px, Desktop: 32px
```

### 5.2.3 Layout Composition Patterns

#### Section Stacking Pattern
```typescript
// Standard Page Flow (Mobile & Desktop)
<Navigation />        // Sticky header cu scroll progress
<HeroSection />       // py-24 (96px top/bottom)
<FeaturesSection />   // py-16 sm:py-20 md:py-24
<CTASection />        // py-16 sm:py-20 md:py-24  
<Footer />           // py-8 sm:py-12

// Background Transitions
// Hero: --surface-eggshell (light)
// Features: --dark-surface (dark theme switch)
// CTA: gradient background (coral to warm)
// Footer: --dark-surface (continues dark)
```

#### Responsive Layout Switches
```typescript
// Hero Section Layout Switch
// Desktop (lg:): Grid cu 2 coloane (content | visualization)
'hidden lg:block' + 'grid-cols-[1.1fr_1fr]'

// Mobile/Tablet (lg:hidden): Stacked layout
'lg:hidden' + 'text-center mb-6' + stacked workflow

// Email Form Layout Switch
'flex-col sm:flex-row'
// Mobile: Email input stacked above button
// Desktop: Email input beside button (inline)

// Workflow Visualization Switch
// Mobile: Timeline vertical cu absolute positioning
// Desktop: SVG positioning cu scattered cards
```

### 5.2.4 Spacing Relationships

#### Gap Systems by Context
```typescript
// Tight Spacing (components internals)
'gap-1'     // 4px - Icon + text very close
'gap-2'     // 8px - Button internals, small elements  
'gap-3'     // 12px - Standard component spacing

// Medium Spacing (section internals)
'gap-4'     // 16px - Card grids mobile
'gap-6'     // 24px - Statistics, standard gaps
'gap-8'     // 32px - Card grids desktop

// Wide Spacing (major sections)
'gap-16'    // 64px - Hero grid desktop columns
```

#### Margin/Padding Relationships
```typescript
// Consistent Vertical Rhythm
'mb-4'      // 16px - Standard paragraph spacing
'mb-6'      // 24px - Section internal spacing  
'mb-10'     // 40px - Major element separation
'mb-16'     // 64px - Between major sections

// Responsive Vertical Rhythm
'mb-4 sm:mb-6'         // 16px → 24px
'mb-6 mb-10'           // 24px → 40px
'mb-12 sm:mb-16'       // 48px → 64px
```

## 5.3 PRIMITIVE UI COMPONENTS DETALIATE

### 5.3.1 Button Component (ui/button.tsx)

#### Button Variants (CVA System)
```typescript
// Default Variant
variant: "default"
'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'

// Destructive Variant  
variant: "destructive"
'bg-destructive text-white shadow-xs hover:bg-destructive/90'
'focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40'

// Outline Variant
variant: "outline"  
'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground'
'dark:bg-input/30 dark:border-input dark:hover:bg-input/50'

// Secondary Variant
variant: "secondary"
'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80'

// Ghost Variant  
variant: "ghost"
'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50'

// Link Variant
variant: "link"
'text-primary underline-offset-4 hover:underline'
```

#### Button Sizes (CVA System)
```typescript
// Default Size
size: "default" 
'h-9 px-4 py-2 has-[>svg]:px-3'    // 36px height, adaptive padding for icons

// Small Size
size: "sm"
'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5'  // 32px height

// Large Size  
size: "lg"
'h-10 rounded-md px-6 has-[>svg]:px-4'            // 40px height

// Icon Size
size: "icon"
'size-9'                                          // 36px × 36px square
```

#### Button Accessibility Features
```typescript
// Focus Management
'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'

// ARIA Support
'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40'
'aria-invalid:border-destructive'

// Disabled States
'disabled:pointer-events-none disabled:opacity-50'

// Icon Accessibility
'[&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4'
'[&_svg]:shrink-0' // Prevents icon deformation
```

#### Button Usage Patterns în v0-inspiration
```typescript
// Email Capture Primary Button
<Button
  type="submit"
  disabled={!email || !gdprConsent || isSubmitting || !isEmailValid}
  className="py-3 sm:py-3.5 px-6 sm:px-8 bg-[var(--primary-warm)] text-[var(--surface-white)]"
>
// Override default styles cu project colors
// Custom responsive padding
// Complex disabled logic
```

### 5.3.2 Input Component (ui/input.tsx)

#### Input Base Implementation
```typescript
function Input({ className, type, ...props }: React.ComponentProps<"input">)

// Base Classes
'file:text-foreground placeholder:text-muted-foreground'
'selection:bg-primary selection:text-primary-foreground'
'dark:bg-input/30 border-input'
'flex h-9 w-full min-w-0 rounded-md border bg-transparent'
'px-3 py-1 text-base shadow-xs transition-[color,box-shadow]'
'outline-none'

// File Upload Styling
'file:inline-flex file:h-7 file:border-0 file:bg-transparent'
'file:text-sm file:font-medium'

// Disabled States
'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

// Responsive Typography
'md:text-sm'  // Smaller text on desktop
```

#### Input Accessibility & Focus
```typescript
// Focus Ring System
'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'

// Error States
'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40'
'aria-invalid:border-destructive'

// Data Attributes
'data-slot="input"'  // For CSS targeting
```

#### Input Usage în Email Capture
```typescript
<Input
  type="email"
  placeholder="adresa@email.com"
  value={email}
  onChange={handleEmailChange}
  required
  disabled={isSubmitting}
  className={`w-full py-3 sm:py-3.5 px-4 sm:px-5 border rounded-lg text-sm sm:text-base bg-[var(--surface-eggshell)] transition-all duration-200 min-h-[44px] ${
    emailError
      ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]'
      : isEmailValid
        ? 'border-green-400 focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.2)]'
        : 'border-[var(--border-light)] focus:border-[var(--primary-warm)] focus:shadow-[0_0_0_3px_oklch(58%_0.08_200_/_0.2)]'
  }`}
/>

// Dynamic validation styling
// Custom responsive padding override
// Touch target compliance (min-h-44px)
// Custom focus ring colors per state
```

### 5.3.3 Checkbox Component (ui/checkbox.tsx)

#### Checkbox Implementation (Radix UI)
```typescript
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { IconCheck } from "@tabler/icons-react"

// Root Checkbox
<CheckboxPrimitive.Root
  data-slot="checkbox"
  className="peer border-input dark:bg-input/30"
  // State styling
  "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
  "dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary"
  // Focus system
  "focus-visible:border-ring focus-visible:ring-ring/50"
  // Size and shape
  "size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none"
  // Disabled states  
  "disabled:cursor-not-allowed disabled:opacity-50"
  // Error states
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
>

// Checkbox Indicator
<CheckboxPrimitive.Indicator data-slot="checkbox-indicator">
  <IconCheck className="size-3.5" />  // 14px check icon
</CheckboxPrimitive.Indicator>
```

#### Checkbox Usage în GDPR Consent
```typescript
<Checkbox
  id="gdpr"
  checked={gdprConsent}
  onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
  disabled={isSubmitting}
  className="mt-0.5 flex-shrink-0"
/>
<label htmlFor="gdpr" className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
  // Associated label for accessibility
</label>

// Proper id-label association
// Boolean type safety with TypeScript casting
// Disabled state coordination
// Flex positioning to align with multi-line label
```

#### Checkbox Accessibility Features
- **Keyboard Navigation**: Space/Enter pentru toggle
- **Screen Reader Support**: Radix UI handled ARIA
- **Focus Management**: Focus ring integrated
- **Label Association**: htmlFor attribute linking
- **State Announcements**: checked/unchecked announced

## 5.4 RESPONSIVE DESIGN PATTERNS DETALIATE

### 5.4.1 Mobile-First Approach Validation
```typescript
// Base Mobile Styles (no prefix)
'py-16'          // Mobile: 64px padding
'text-[2.75rem]' // Mobile: 44px font size
'px-4'           // Mobile: 16px padding
'gap-2'          // Mobile: 8px gap

// Progressive Enhancement
'sm:py-20'       // Tablet: 80px padding (640px+)
'md:py-24'       // Desktop: 96px padding (768px+)
'lg:text-[3.5rem]' // Large desktop: 56px font size (1024px+)
```

### 5.4.2 Breakpoint Behavior Patterns

#### Navigation Responsive Behavior
```typescript
// Desktop Navigation
'hidden sm:flex items-center gap-3 px-4 py-2'  // Full counter cu text
'text-sm'                                      // 14px text

// Mobile Navigation  
'flex sm:hidden items-center gap-2 px-3 py-1.5' // Compressed counter
'text-xs'                                        // 12px text
// Shows "347/500" instead of "347/500 înscriși"
```

#### Hero Section Responsive Patterns
```typescript
// Desktop Layout (lg+)
'hidden lg:block'
'grid grid-cols-[1.1fr_1fr] gap-16 items-center'

// Mobile/Tablet Layout
'lg:hidden'  
'text-center mb-6'          // Centered alignment
'grid grid-cols-3 gap-2'    // Compressed stats
'max-w-[500px] mx-auto'     // Constrained width
```

#### Typography Responsive Scaling
```typescript
// Headings Progressive Scale
'text-2xl sm:text-3xl md:text-4xl'    // 24px → 30px → 36px
'font-serif text-[3.5rem]'            // Desktop hero: 56px
'font-serif text-[2.75rem]'           // Mobile hero: 44px

// Body Text Scale
'text-base sm:text-lg'                // 16px → 18px  
'text-[1.2rem]'                       // Lead paragraph: 19.2px
'text-xs sm:text-sm'                  // Small text: 12px → 14px

// Button Text Scale
'text-sm sm:text-base'                // 14px → 16px
'text-base sm:text-lg'                // 16px → 18px (CTA buttons)
```

### 5.4.3 Layout Reorganization Patterns

#### Grid to Stack Transitions
```typescript
// Features Section
'grid grid-cols-1 md:grid-cols-2'
// Mobile: Single vertical stack
// Desktop: 2-column grid

// Statistics Display
'grid grid-cols-3'  // Always 3 columns, but content adapts
// Mobile: Compressed text ("5 Ore" vs "Până la 5 Ore")
// Desktop: Full descriptive text
```

#### Flex Direction Changes
```typescript
// Email Form Layout
'flex flex-col sm:flex-row gap-3'
// Mobile: Input above button (vertical stack)  
// Desktop: Input beside button (horizontal row)

// Workflow Cards Mobile
// Mobile: Timeline vertical cu absolute positioning
// Desktop: SVG scattered positioning
```

### 5.4.4 Touch Target Optimization

#### Minimum Touch Targets (44px iOS, 48px Android)
```typescript
// Email Input
'min-h-[44px]'                    // Explicit minimum height

// Button Sizing
'py-3 sm:py-3.5 px-6 sm:px-8'     // Responsive padding ensuring 44px+
'h-9'                             // Default: 36px (need padding boost)

// Social Icons  
'p-2'                             // 8px padding + 18px icon = 34px (needs container)
'rounded-full bg-white/10'        // Container provides adequate touch area

// Navigation Elements
'px-3 py-1.5'                     // Mobile counter: adequate touch area
'px-4 py-2'                       // Desktop counter: larger comfortable area
```

#### Finger-Friendly Spacing
```typescript
// Button Groups
'gap-3'                           // 12px between buttons (adequate separation)

// Social Share Buttons  
'gap-3'                           // 12px prevents accidental taps

// Form Elements
'mb-3'                            // 12px vertical spacing between form elements
```

### 5.4.5 Content Adaptation Strategies

#### Text Content Responsive Adaptation
```typescript
// Navigation Counter
// Desktop: "347/500 înscriși" 
// Mobile: "347/500"
{/* Conditional rendering based on screen size */}

// Statistics Labels
// Desktop: "Până la 5 Ore" + "economisite săptămânal"
// Mobile: "5 Ore" + "economisite"
{/* Abbreviated versions for space constraints */}

// Feature Descriptions
// Desktop: Full paragraph descriptions
// Mobile: Same content, but different line-height și spacing
```

#### Interactive Element Adaptations
```typescript
// Share Component
// Desktop: All share options visible
// Mobile: Native share button appears when available
{typeof window !== "undefined" && navigator.share && (
  <button onClick={handleNativeShare}>
    <IconShare2 size={14} />
    Distribuie
  </button>
)}
```

## 5.5 ACCESSIBILITY FEATURES DETALIATE

### 5.5.1 ARIA Labels și Roles

#### Explicit ARIA Usage
```typescript
// Button Accessibility
'aria-invalid:ring-destructive/20'        // Visual feedback pentru invalid state
'aria-invalid:border-destructive'         // Border feedback pentru errors

// Checkbox ARIA (handled by Radix UI)
// Automatic role="checkbox"
// aria-checked state management
// aria-describedby for error messages

// Form Validation ARIA
// Real-time validation cu visual și screen reader feedback
```

#### Semantic HTML Structure
```typescript
// Navigation Semantic
<nav className="...">                      // Proper nav landmark

// Form Semantics
<form onSubmit={handleSubmit}>             // Proper form submission
<label htmlFor="gdpr">...</label>          // Explicit label association  
<input required />                         // HTML5 validation

// Button Semantics  
<button type="submit" disabled={...}>      // Proper button roles

// Section Landmarks
<section className="...">                  // Proper section landmarks
<footer className="...">                   // Footer landmark
```

### 5.5.2 Focus Management

#### Focus Ring System
```typescript
// Universal Focus Ring
'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'

// Custom Focus Colors per State
// Default Focus
'focus:border-[var(--primary-warm)] focus:shadow-[0_0_0_3px_oklch(58%_0.08_200_/_0.2)]'

// Error Focus
'focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]'

// Success Focus  
'focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.2)]'
```

#### Keyboard Navigation Support
```typescript
// Tab Order Management
// Natural document order maintained
// No tabindex manipulation needed
// Skip links implicit in structure

// Button Keyboard Support
// Space/Enter activation (native button behavior)
// Focus states clearly visible

// Checkbox Keyboard Support  
// Space toggle (Radix UI handled)
// Arrow key navigation în form groups
```

### 5.5.3 Screen Reader Support

#### Screen Reader Optimizations
```typescript
// Loading State Announcements
{isSubmitting ? 'Se trimite...' : 'Prinde oferta!'}
// Text content changes announced automatically

// Success State Announcements
<IconCircleCheck size={20} className="text-[#2F855A] animate-bounce" />
<strong>Mulțumim pentru înscriere!</strong>
// Strong emphasis announced with importance

// Error Message Announcements
{emailError && (
  <div className="mb-3 text-red-600 text-xs sm:text-sm flex items-center gap-2">
    <IconAlertCircle size={14} />
    {emailError}
  </div>
)}
// Error messages announced when they appear
```

#### Hidden Content pentru Screen Readers
```typescript
// Visual-only decorative elements
'pointer-events-none'                    // Particles, confetti
'aria-hidden="true"'                     // Would be ideal pentru decorative icons

// Skip Link Opportunities (missing)
// Could benefit from skip navigation links
// Especially pentru mobile users cu screen readers
```

### 5.5.4 Color Contrast Analysis

#### High Contrast Combinations
```typescript
// Primary Text on Light Background
'text-[var(--text-primary)]'            // oklch(20% 0 0) on white
// Contrast Ratio: Very High (>7:1)

// Secondary Text on Light Background  
'text-[var(--text-secondary)]'          // oklch(45% 0 0) on white
// Contrast Ratio: High (4.5:1+)

// Light Text on Dark Backgrounds
'text-[var(--text-light)]'              // oklch(92% 0 0) on dark
// Contrast Ratio: Very High (>7:1)

// Error Text Contrast
'text-red-600'                           // #dc2626 on white
// Contrast Ratio: High (4.5:1+)

// Success Text Contrast
'text-green-500'                         // #22c55e on white  
// Contrast Ratio: High (4.5:1+)
```

#### Potential Contrast Issues
```typescript
// Muted Text Combinations
'text-[var(--text-muted)]'              // oklch(60% 0 0) on white
// Contrast Ratio: Borderline (may be <4.5:1 în some conditions)

// Placeholder Text
'placeholder:text-muted-foreground'      // May need validation

// Disabled Elements
'disabled:opacity-50'                    // Reduces contrast intentionally
```

### 5.5.5 Motion și Animation Accessibility

#### Respectful Motion Design
```typescript
// Subtle Animations Only
// No aggressive flashing or strobing
// Breathing animations are gentle (scale 1 → 1.02)
// Float animations are minimal (-10px movement)

// User Preference Respect (Missing)
// Could benefit from prefers-reduced-motion detection
@media (prefers-reduced-motion: reduce) {
  .animate-breathing { animation: none; }
  .animate-float { animation: none; }
  // etc.
}
```

#### Animation Performance
```typescript
// Transform-based Animations (Good)
'transform: translateY(-8px)'           // Hardware accelerated
'transform: scale(1.02)'                // Hardware accelerated

// Opacity Transitions (Good)
'opacity: 0 → 1'                        // Hardware accelerated

// No Layout-Triggering Animations (Good)
// Avoiding width/height animations
// Avoiding margin/padding animations during interactions
```

## 5.6 LAYOUT COMPOSITION PATTERNS DETALIATE

### 5.6.1 Component Composition Architecture

#### Sectional Composition Strategy
```typescript
// Page-Level Composition
<Navigation />              // Sticky header cu scroll progress
  <ScrollProgress />        // Integrated progress indicator

<HeroSection />            // Primary conversion section
  <ProgressIndicator />    // Social proof element
  <EmailCapture />         // Primary CTA
    <ConfettiEffect />     // Success celebration
    <ShareComponent />     // Post-signup sharing

<FeaturesSection />        // Feature explanation
  {features.map(...)}      // Mapped feature cards

<CTASection />            // Secondary conversion point  
  <FloatingParticles />    // Background enhancement

<Footer />                // Contact și legal
  // Easter egg integrated în footer
```

#### Component Nesting Patterns
```typescript
// Complex Nested Components
<EmailCapture>
  <form>
    <div> // Input group
      <Input />
      <ValidationIcon />    // Conditional rendering
    </div>
    <Button>
      <LoadingSpinner />    // Conditional rendering
    </Button>
  </form>
  <Checkbox />
  <ErrorMessage />         // Conditional rendering
  <SuccessState>          // Conditional full replacement
    <ShareComponent />
  </SuccessState>
</EmailCapture>
```

### 5.6.2 Visual Hierarchy Patterns

#### Content Hierarchy (Z-axis)
```typescript
// Background Layer (z-0)
// SVG decorations, blurred shapes
'absolute inset-0 opacity-5 pointer-events-none'

// Content Layer (z-10)  
// Main content, cards, text
'relative z-10'

// Floating UI (z-40)
// Floating share button, tooltips
'fixed bottom-4 right-4 ... z-40'

// Overlays (z-50)
// Navigation, modals, dropdowns  
'sticky top-0 z-50'

// Special Effects (z-confetti)
// Confetti, special animations
'fixed inset-0 pointer-events-none z-confetti'
```

#### Visual Weight Distribution
```typescript
// Primary Focal Point: Email Capture Form
'bg-[var(--surface-white)] rounded-xl p-4 sm:p-6 md:p-8 border shadow-[var(--shadow-soft)]'
// Highest contrast, most visual weight, central positioning

// Secondary Focal Points: Feature Cards
'bg-[var(--dark-surface-raised)] ... hover-lift hover-glow'
// Medium contrast, interactive feedback, grid positioning

// Supporting Elements: Statistics  
'border-t border-b border-[var(--border-light)]'
// Subtle borders, integrated în content flow

// Background Elements: Decorative
'absolute ... opacity-5 pointer-events-none blur-3xl'
// Minimal visual weight, purely decorative
```

### 5.6.3 Spacing Relationships Between Sections

#### Vertical Rhythm System
```typescript
// Major Section Separation
'py-16 sm:py-20 md:py-24'              // 64px → 80px → 96px
// Usage: Features, CTA sections

// Hero Section Special Spacing
'py-24'                                 // 96px fixed
// Larger spacing for impact

// Navigation Compact Spacing  
'py-2 md:py-3'                         // 8px → 12px
// Minimal spacing to preserve screen real estate

// Footer Medium Spacing
'py-8 sm:py-12'                        // 32px → 48px
// Adequate separation without excessive whitespace
```

#### Component Internal Spacing
```typescript
// Card Internal Spacing
'p-4 sm:p-6 md:p-8'                    // Progressive internal padding

// Form Element Spacing
'mb-3'                                 // 12px between related form elements
'mb-4'                                 // 16px between form sections
'mb-6'                                 // 24px between major form sections

// Icon-Text Relationships
'gap-2'                                // 8px for tight icon-text pairs
'gap-3 mb-2'                           // 12px for comfortable icon-text + spacing
```

### 5.6.4 Content Flow și Reading Patterns

#### F-Pattern Layout (Desktop)
```typescript
// Hero Section F-Pattern
// Horizontal 1: Logo și counter (navigation)
// Horizontal 2: Main headline
// Vertical: Left column content (description, stats, form)
// Horizontal 3: CTA button
// Right side: Visual element (workflow)
```

#### Z-Pattern Layout (Mobile)  
```typescript
// Mobile Z-Pattern  
// Top-left: Logo
// Top-right: Counter
// Center: Hero content (stacked)
// Bottom: CTA form
// Visual: Workflow below fold
```

#### Reading Flow Optimization
```typescript
// Progressive Disclosure
1. Navigation (trust signals)
2. Hero headline (value proposition)  
3. Description (benefit explanation)
4. Social proof (progress indicator)
5. Primary action (email capture)
6. Secondary information (features)
7. Final action (CTA section)
8. Support/contact (footer)
```

### 5.5 COMPONENTE AVANSATE SUPLIMENTARE

#### 5.5.1 Sound Toggle Component
**Fișier:** `/v0-inspiration/sound-toggle.tsx`

```typescript
// Sound Control Icons
<IconVolume2 size={20} className="text-[var(--primary-warm)]" />     // Sound ON state
<IconVolumeX size={20} className="text-[var(--text-muted)]" />       // Sound OFF state

// Fixed Position Pattern
className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-md border border-white/30 rounded-full p-3 shadow-lg hover:bg-white/90 transition-all duration-200 z-50"

// LocalStorage Integration
localStorage.getItem("coquinate-sound-enabled")
localStorage.setItem("coquinate-sound-enabled", newState.toString())

// Web Audio API Success Sound
playTone(523.25, 0.2, 0)   // C5
playTone(659.25, 0.2, 100) // E5  
playTone(783.99, 0.3, 200) // G5
```

#### 5.5.2 Scroll Progress Component
**Fișier:** `/v0-inspiration/scroll-progress.tsx`

```typescript
// Progress Calculation
const scrollPx = document.documentElement.scrollTop
const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight
const scrolled = (scrollPx / winHeightPx) * 100

// Visual Progress Bar
<div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--border-light)]">
  <div
    className="h-full bg-gradient-to-r from-[var(--accent-coral)] to-[var(--primary-warm)] transition-all duration-150 ease-out"
    style={{ width: `${scrollProgress}%` }}
  />
</div>
```

#### 5.5.3 Progress Indicator Component
**Fișier:** `/v0-inspiration/progress-indicator.tsx`

```typescript
// Progress Icon Usage
<IconUsers size={16} className="text-[var(--accent-coral)]" />        // User count indicator
<IconTrendingUp size={12} />                                          // Trending up icon

// Animated Counter Logic
const increment = currentCount / steps
setSignupCount(Math.floor(current))

// Progress Bar Visual
<div className="w-full bg-[var(--border-light)] rounded-full h-2 mb-2">
  <div
    className="bg-gradient-to-r from-[var(--accent-coral)] to-[var(--primary-warm)] h-2 rounded-full transition-all duration-1000 ease-out"
    style={{ width: `${progressPercentage}%` }}
  />
</div>

// Color-coded Status Text
<strong className="text-[var(--accent-coral)]">{Math.round(progressPercentage)}%</strong>
```

#### 5.5.4 Floating Share Component  
**Fișier:** `/v0-inspiration/floating-share.tsx`

```typescript
// Floating Action Button Icons
<IconShare2 size={20} />    // Primary share icon
<IconX size={20} />         // Close modal icon

// Fixed Position Pattern
className="fixed bottom-6 right-6 bg-[var(--accent-coral)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--accent-coral-soft)] hover:scale-110 transition-all duration-300 z-40 hover-glow"

// Modal Layout Structure
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-xl p-6 max-w-md w-full animate-fade-in-up">
    // ShareComponent embedded
  </div>
</div>
```

#### 5.5.5 Floating Particles Component
**Fișier:** `/v0-inspiration/floating-particles.tsx`

```typescript
// Particle System Interface
interface Particle {
  id: number
  x: number        // Position X (0-100%)
  y: number        // Position Y (0-100%)  
  size: number     // 2-6px particle size
  opacity: number  // 0.1-0.4 opacity range
  speed: number    // 0.2-0.7 animation speed
  color: string    // Semi-transparent white variants
}

// Color System
const colors = ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)", "rgba(255,255,255,0.15)"]

// Animation Loop (50ms intervals)
setParticles((prev) =>
  prev.map((particle) => ({
    ...particle,
    y: particle.y <= -10 ? 110 : particle.y - particle.speed,
  }))
)

// Particle Rendering
style={{
  left: `${particle.x}%`,
  top: `${particle.y}%`,
  width: particle.size,
  height: particle.size,
  backgroundColor: particle.color,
  opacity: particle.opacity,
  transition: "none",
}}
```

#### 5.5.6 Confetti Effect Component
**Fișier:** `/v0-inspiration/confetti-effect.tsx`

```typescript
// Advanced Confetti Physics Interface
interface ConfettiPiece {
  id: number
  x: number           // X position (pixels)
  y: number           // Y position (pixels)
  vx: number          // X velocity (-2 to 2)
  vy: number          // Y velocity (2-5)  
  color: string       // CSS color value
  size: number        // 4-12px size
  rotation: number    // 0-360 degrees
  rotationSpeed: number // Rotation velocity
}

// Color Palette
const colors = [
  "var(--accent-coral)",    // Brand coral
  "var(--primary-warm)",    // Brand blue
  "var(--accent-coral-soft)", // Soft coral
  "#FFD700",               // Gold
  "#FF6B6B",               // Red
  "#4ECDC4",               // Teal
]

// Physics Animation (16ms intervals)
x: piece.x + piece.vx,           // X movement
y: piece.y + piece.vy,           // Y movement  
rotation: piece.rotation + piece.rotationSpeed, // Rotation
vy: piece.vy + 0.1,              // Gravity effect

// 3-second Lifecycle
setTimeout(() => {
  clearInterval(interval)
  setConfetti([])
}, 3000)
```

#### 5.5.7 Scroll Animation Hook
**Fișier:** `/v0-inspiration/use-scroll-animation.ts`

```typescript
// Intersection Observer Hook
export function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  // Observer Configuration
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)  // One-time trigger
      }
    },
    { threshold }
  )

  return { ref, isVisible }  // Returns ref for element & visibility state
}

// Usage Pattern în Components
const { ref, isVisible } = useScrollAnimation(0.1)
<div ref={ref} className={isVisible ? 'animate-fade-in-up' : 'opacity-0'}>
```

## 5.6 PATTERN-URI DE LAYOUT ȘI ANIMAȚIE IDENTIFICATE

### 5.6.1 Animation System Complet

#### CSS Keyframes Definite
```css
@keyframes subtle-pulse    // 3s infinite opacity 0.8-1
@keyframes fade-in-up      // 0.8s opacity 0→1, translateY 30px→0  
@keyframes fade-in-left    // 0.8s opacity 0→1, translateX -30px→0
@keyframes fade-in-right   // 0.8s opacity 0→1, translateX 30px→0
@keyframes float           // 6s infinite translateY 0→-10px→0
@keyframes breathing       // 4s infinite scale 1→1.02→1
```

#### Animation Classes Usage
```typescript
.animate-subtle-pulse      // Hero elements breathing effect
.animate-fade-in-up        // Primary entrance animation
.animate-fade-in-left      // Side entrance animations
.animate-fade-in-right     // Opposite side entrances
.animate-breathing         // Gentle scale animations
.animate-float             // Floating elements
.animate-delay-200         // Staggered animation timing
.animate-delay-400         // Progressive revelation
.animate-delay-600         // Sequential appearances
```

#### Hover Effect Systems
```css
.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px oklch(0% 0 0 / 0.15);
}

.hover-glow:hover {
  box-shadow: 0 0 30px oklch(70% 0.18 20 / 0.3);
}

.workflow-card:hover { cursor: grab; }
.workflow-card:active { cursor: grabbing; }
```

### 5.6.2 Advanced Layout Composition

#### Grid Systems Hierarchy
```typescript
// Main Layout Grid
'grid grid-cols-[1.1fr_1fr] gap-16'        // Hero asymmetric layout
'grid grid-cols-1 md:grid-cols-2 gap-8'    // Features responsive grid
'grid grid-cols-3 gap-2'                   // Compact stats grid

// Complex Nested Grids
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
  <div className="bg-gradient-to-br p-6 rounded-xl">
    <div className="flex items-center gap-3 mb-3">
      // Nested flex within grid
    </div>
  </div>
</div>
```

#### Flexbox Patterns Advanced
```typescript
// Navigation Flex Patterns
'flex items-center justify-between'         // Header layout
'flex items-center gap-3 px-4 py-2'       // Counter components
'flex items-start gap-4'                   // Feature descriptions

// Form Layout Patterns
'flex flex-col gap-2 sm:gap-3'            // Vertical form stack
'flex flex-col sm:flex-row gap-3'         // Responsive form row
'flex items-center gap-2'                 // Inline form elements
```

#### Positioning Strategies
```typescript
// Fixed Position System
'fixed top-0 left-0 right-0 z-50'         // Header sticky
'fixed bottom-4 right-4 z-50'             // Sound toggle
'fixed bottom-6 right-6 z-40'             // Share button
'fixed inset-0 z-50'                      // Modal overlay

// Absolute Position Patterns
'absolute inset-0'                         // Full overlay
'absolute bottom-0 left-0 w-full h-0.5'   // Progress bar
'absolute -top-8 left-1/2 transform -translate-x-1/2' // Centered tooltip
```

**Status:** COMPLETAT ✅
