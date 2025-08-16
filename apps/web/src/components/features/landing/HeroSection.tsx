'use client';

import React from 'react';
import { useTranslation } from '@coquinate/i18n';
import { FloatingElements, FloatingOrbPresets } from './FloatingElements';

/**
 * Modern Hearth Hero Section Component for Landing Page
 * Features gradient text, floating meal icons, and enhanced typography
 * Motion respects user preference via data-motion attribute
 */
export function HeroSection() {
  const { t } = useTranslation('landing');

  return (
    <header id="main-content" className="relative pt-20 pb-16 px-4 overflow-hidden">
      {/* Floating Meal Icons - Using reusable component with subtle preset */}
      <FloatingElements orbs={FloatingOrbPresets.subtle} />

      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-warm/5 via-transparent to-accent-coral/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main Headline with Modern Hearth Gradient Text */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display leading-tight text-romanian">
          <span className="gradient-text">{t('hero.title')}</span>
        </h1>

        {/* Subtitle with Enhanced Typography */}
        <p className="text-lg sm:text-xl lg:text-2xl text-text-secondary max-w-2xl mx-auto font-primary text-romanian leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* Subtle accent line */}
        <div className="w-24 h-1 bg-gradient-to-r from-primary-warm to-accent-coral mx-auto mt-8 rounded-full opacity-60" />
      </div>
    </header>
  );
}
