'use client';

/**
 * Marketing Homepage (Story 2.2: Homepage with Value Proposition)
 * 
 * This page is shown during "coming-soon" launch mode.
 * Despite the launch mode name, this is the full marketing homepage with:
 * - Hero section with value proposition
 * - Features section
 * - CTA section with email capture
 * 
 * The "coming-soon" mode name refers to the app features being unavailable,
 * not this marketing page being incomplete.
 */

import React from 'react';
import dynamic from 'next/dynamic';
import * as i18nModule from '@coquinate/i18n';
import type { TranslationNamespace } from '@coquinate/i18n';
import {
  SiteNavigation,
  SiteFooter,
  FeaturesSection,
  CTASection,
  ScrollProgress,
  SoundToggle
} from '@coquinate/ui';

// Dynamic import pentru HeroSection cu ssr: false pentru debug
const HeroSection = dynamic(
  () => import('@coquinate/ui').then(mod => ({ default: mod.HeroSection })),
  { ssr: false }
);

// Robust translation hook with fallback mechanism
const useTranslation = (namespace?: TranslationNamespace | TranslationNamespace[]) => {
  if (i18nModule && typeof i18nModule.useTranslation === 'function') {
    return i18nModule.useTranslation(namespace);
  }
  
  // Fallback implementation
  return {
    t: (key: string) => key,
    i18n: null,
    ready: false
  };
};

export default function ComingSoonPage() {
  const { t, ready } = useTranslation('landing');

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-border-focus border-t-transparent rounded-full motion-safe:animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://coquinate.ro/#organization',
        name: 'Coquinate',
        url: 'https://coquinate.ro',
        sameAs: [
          'https://coquinate.com',
          'https://facebook.com/coquinate',
          'https://instagram.com/coquinate',
          'https://twitter.com/coquinate'
        ],
        logo: {
          '@type': 'ImageObject',
          url: 'https://coquinate.com/logo.png',
          width: 512,
          height: 512
        },
        foundingDate: '2024',
        foundingLocation: {
          '@type': 'Place',
          addressCountry: 'RO'
        },
        description: 'Platformă românească de planificare meniuri și urmărire nutrițională cu funcții AI pentru personalizarea meselor.'
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://coquinate.ro/#webapp',
        name: 'Coquinate',
        url: 'https://coquinate.ro',
        alternateName: 'Coquinate International',
        alternateUrl: 'https://coquinate.com',
        description: 'Planifică mesele tale cu ușurință și optimizează lista de cumpărături cu AI personalizat.',
        applicationCategory: 'Food & Cooking',
        operatingSystem: 'Web Browser, iOS, Android',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'RON',
          description: 'Acces gratuit pe viață pentru primii 500 utilizatori',
          availabilityStarts: '2024-01-01',
          priceValidUntil: '2024-12-31'
        },
        creator: {
          '@id': 'https://coquinate.ro/#organization'
        },
        inLanguage: 'ro'
      },
      {
        '@type': 'WebSite',
        '@id': 'https://coquinate.ro/#website',
        url: 'https://coquinate.ro',
        name: 'Coquinate',
        alternateUrl: 'https://coquinate.com',
        publisher: {
          '@id': 'https://coquinate.ro/#organization'
        },
        inLanguage: 'ro',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://coquinate.ro/search?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Navigation */}
      <SiteNavigation showLaunchBadge={true} comingSoonLabel={t('nav.coming_soon')} />

      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Main Content */}
      <main>
        <HeroSection
          emailCaptureVariant="promo"
          showWorkflowNodes={true}
          withShimmer={true}
        />
        <FeaturesSection />
        <CTASection />
      </main>

      {/* Footer */}
      <SiteFooter copyrightText={t('footer.copyright')} privacyPolicyLabel={t('footer.privacy')} />

      {/* Sound Toggle */}
      <SoundToggle />
    </>
  );
}