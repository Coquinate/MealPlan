'use client';

import React, { Suspense } from 'react';
import { useTranslation } from '@coquinate/i18n';
import dynamic from 'next/dynamic';

// Dynamic imports for performance optimization
const HeroSection = dynamic(
  () => import('@/components/features/landing').then((mod) => ({ default: mod.HeroSection })),
  {
    loading: () => <div className="h-32 animate-pulse bg-surface-raised rounded-lg" />,
  }
);

const LaunchBadge = dynamic(
  () => import('@/components/features/landing').then((mod) => ({ default: mod.LaunchBadge })),
  {
    loading: () => <div className="h-8 w-32 animate-pulse bg-warning-50 rounded-full mx-auto" />,
  }
);

const BenefitCards = dynamic(
  () => import('@/components/features/landing').then((mod) => ({ default: mod.BenefitCards })),
  {
    loading: () => <div className="h-64 animate-pulse bg-surface-raised rounded-lg" />,
  }
);

const EmailCapture = dynamic(
  () => import('@/components/features/landing').then((mod) => ({ default: mod.EmailCapture })),
  {
    loading: () => <div className="h-20 animate-pulse bg-surface-raised rounded-lg" />,
  }
);

/**
 * Coming Soon Landing Page Component
 *
 * Phase 2 implementation for Story 2.1
 * Modular component structure with proper separation of concerns
 */
export default function ComingSoonPage() {
  const { ready } = useTranslation('landing');

  // Loading state while i18n initializes
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-border-focus border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-surface via-primary-50 to-surface">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-surface-raised focus:text-primary focus:px-4 focus:py-3 focus:min-w-11 focus:min-h-11 focus:rounded-lg focus:shadow-lg focus:flex focus:items-center focus:justify-center"
      >
        Skip to main content
      </a>

      {/* Launch Status Badge - Positioned at top */}
      <div className="pt-8 text-center">
        <Suspense
          fallback={<div className="h-8 w-32 animate-pulse bg-warning-50 rounded-full mx-auto" />}
        >
          <LaunchBadge />
        </Suspense>
      </div>

      {/* Hero Section with Headline and Subtitle */}
      <Suspense
        fallback={<div className="h-32 animate-pulse bg-surface-raised rounded-lg mx-4 mb-8" />}
      >
        <HeroSection />
      </Suspense>

      {/* Email Capture Form */}
      <div className="pb-8">
        <Suspense
          fallback={<div className="h-20 animate-pulse bg-surface-raised rounded-lg mx-4" />}
        >
          <EmailCapture />
        </Suspense>
      </div>

      {/* Benefits Section with 4 Cards */}
      <Suspense fallback={<div className="h-64 animate-pulse bg-surface-raised rounded-lg mx-4" />}>
        <BenefitCards />
      </Suspense>
    </main>
  );
}
