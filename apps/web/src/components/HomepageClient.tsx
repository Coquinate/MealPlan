'use client';

/**
 * Client Component wrapper for Homepage UI components
 * Handles domain-specific content and responsive layout
 */

import { 
  HeroSection, 
  FeaturesSection, 
  CTASection,
  ScrollProgress,
  FloatingParticles,
  SoundToggleButton,
  ShareWidget,
  ConfettiEffect,
  MotionProvider,
  SiteNavigation,
  SiteFooter
} from '@coquinate/ui';
import type { DomainConfig } from '@/lib/domain-utils';

interface HomepageClientProps {
  domain: 'ro' | 'com';
  config: DomainConfig;
}

export function HomepageClient({ domain: _domain, config: _config }: HomepageClientProps) {
  return (
    <MotionProvider>
      {/* Site Navigation - Header with logo and menu */}
      <SiteNavigation />
      
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Background Floating Particles Effect */}
      <FloatingParticles />
      
      {/* Sound Toggle Button - Floating bottom-right */}
      <SoundToggleButton />
      
      {/* Hero Section - Full Width with Constrained Content */}
      <HeroSection
        emailCaptureVariant="promo"
        showWorkflowNodes={true}
      />


      {/* Features Section - Dark Background for Contrast */}
      <FeaturesSection />

      {/* Final CTA Section - Gradient Background */}
      <CTASection />
      
      {/* Share Widget - Positioned near footer */}
      <ShareWidget />
      
      {/* Site Footer - Legal links and company info */}
      <SiteFooter />
      
      {/* Confetti Effect - Triggered on success actions */}
      <ConfettiEffect trigger={false} />
    </MotionProvider>
  );
}