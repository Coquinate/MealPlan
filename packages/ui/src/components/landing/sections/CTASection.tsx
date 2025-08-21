'use client';

import React, { useCallback } from 'react';
import * as i18nModule from '@coquinate/i18n';
import type { TranslationNamespace } from '@coquinate/i18n';
import { useScrollTo } from '../../../hooks/useScrollTo';

// Robust useTranslation hook with fallback
const useTranslation = (namespace?: TranslationNamespace | TranslationNamespace[]) => {
  try {
    return i18nModule.useTranslation(namespace);
  } catch (error) {
    console.warn('i18n not available, using fallback:', error);
    return {
      t: (key: string) => key,
      i18n: null,
      ready: false,
    };
  }
};

// TypeScript interface for future extensibility
interface CTASectionProps {
  className?: string;
}

export function CTASection({ className }: CTASectionProps = {}) {
  const { t } = useTranslation('landing' as TranslationNamespace);
  const { scrollToElement } = useScrollTo();
  
  // Memoized click handler for performance
  const handleScrollToEmailCapture = useCallback(() => {
    scrollToElement('email-capture');
  }, [scrollToElement]);
  
  return (
    <section className={`bg-gradient-to-r from-primary-600 to-accent-coral py-24 px-8 ${className || ''}`}>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-4xl font-bold text-white mb-4 tracking-tight">
          {t('cta.title')}
        </h2>
        <p className="text-xl text-white opacity-95 mb-10 max-w-2xl mx-auto">
          {t('cta.subtitle')}
        </p>
        <button
          type="button"
          onClick={handleScrollToEmailCapture}
          className="bg-white text-primary-600 px-12 py-4 rounded-lg font-bold text-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 shadow-md inline-block cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary-300"
          aria-label={t('cta.button')}
        >
          {t('cta.button')}
        </button>
      </div>
    </section>
  );
}