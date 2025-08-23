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

import React, { useState, useEffect } from 'react';
import * as i18nModule from '@coquinate/i18n';
import type { TranslationNamespace } from '@coquinate/i18n';
import {
  SiteNavigation,
  SiteFooter,
  HeroSection,
  FeaturesSection,
  CTASection,
  ScrollProgress,
  SoundToggle,
  ComingSoonPageSkeleton
} from '@coquinate/ui';

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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Forțează light theme imediat la încărcare
  useEffect(() => {
    // Înlătură orice clasă dark existentă și forțează light theme
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    
    // Citește preferința salvată, dar defaultează la light
    const savedTheme = localStorage.getItem('coming-soon-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    
    // Aplică tema doar dacă e dark (light e deja aplicat)
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Salvează preferința
    localStorage.setItem('coming-soon-theme', newTheme);
    
    // Aplică tema și color-scheme
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  };

  if (!ready) {
    return <ComingSoonPageSkeleton />;
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

      {/* Theme Toggle Button - vizibil în ambele moduri */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-[150] p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group"
        aria-label={theme === 'light' ? 'Activează modul întunecat' : 'Activează modul luminos'}
      >
        {theme === 'light' ? (
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-gray-700 group-hover:text-gray-900 transition-colors"
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-yellow-400 group-hover:text-yellow-300 transition-colors"
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </button>

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