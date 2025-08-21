/**
 * V0 Landing Page Components
 * 
 * Componente descărcate de la v0.app pentru landing page.
 * ATENȚIE: Aceste componente necesită adaptare înainte de folosire în producție!
 * 
 * Probleme cunoscute:
 * - Folosesc lucide-react în loc de @tabler/icons-react
 * - Texte hardcodate în română (necesită i18n)
 * - CSS variables custom (necesită adaptare la design tokens)
 */

// Componente principale
export { HeroSection } from './hero-section'
export { FeaturesSection } from './features-section'
export { CTASection } from './cta-section'
export { Navigation } from './navigation'
export { Footer } from './footer'

// Componente de workflow și vizualizare
export { WorkflowVisualization } from './workflow-visualization'
export { ProgressIndicator } from './progress-indicator'

// Componente de interacțiune
export { EmailCapture } from './email-capture'
export { ShareComponent } from './share-component'
export { FloatingShare } from './floating-share'
export { SoundToggle } from './sound-toggle'

// Efecte vizuale
export { ConfettiEffect } from './confetti-effect'
export { FloatingParticles } from './floating-particles'
export { ScrollProgress } from './scroll-progress'

// Hooks
export { useScrollAnimation } from './use-scroll-animation'

// Componente UI (shadcn/ui)
export { Button } from './ui/button'
export { Input } from './ui/input'
export { Checkbox } from './ui/checkbox'

// Type exports (dacă există)
export type { ButtonProps } from './ui/button'
export type { InputProps } from './ui/input'
export type { CheckboxProps } from './ui/checkbox'