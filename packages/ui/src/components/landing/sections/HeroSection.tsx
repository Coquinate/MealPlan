'use client';

import React, { useState } from 'react';
import * as i18nModule from '@coquinate/i18n';
import type { TranslationNamespace } from '@coquinate/i18n';
import { useSubscriberCount } from '../../../hooks';
import { EmailCapture } from '../../email-capture/EmailCapture';
import { WorkflowVisualization } from '../components/workflow/WorkflowVisualization';
import { ConfettiEffect } from '../effects/ConfettiEffect';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { ShareWidget } from '../components/ShareWidget';

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

// TypeScript interfaces
interface HeroSectionProps {
  className?: string;
  emailCaptureVariant?: 'glass' | 'simple' | 'inline' | 'promo';
  showWorkflowNodes?: boolean;
}

interface TrustStatistic {
  id: string;
  valueKey: string;
  descriptionKey: string;
}

// Static data for trust statistics
const TRUST_STATISTICS: TrustStatistic[] = [
  {
    id: 'hours-saved',
    valueKey: 'landing:trust.hours_saved',
    descriptionKey: 'landing:trust.hours_saved_desc',
  },
  {
    id: 'waste-reduced',
    valueKey: 'landing:trust.waste_reduced',
    descriptionKey: 'landing:trust.waste_reduced_desc',
  },
  {
    id: 'money-saved',
    valueKey: 'landing:trust.money_saved',
    descriptionKey: 'landing:trust.money_saved_desc',
  },
];

function HeroSection({ 
  className,
  emailCaptureVariant = 'promo',
  showWorkflowNodes = true
}: HeroSectionProps = {}) {
  const { t } = useTranslation(['landing', 'common'] as TranslationNamespace[]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  // Real-time subscriber count from Supabase
  const { data: subscriberData, refetch } = useSubscriberCount();

  const handleEmailSuccess = async (email: string) => {
    console.log('Email success triggered for:', email);
    setShowConfetti(true);
    setShowShare(true);
    
    // Refresh progress bar instantly with new count
    await refetch();
    
    // Reset confetti after animation completes
    setTimeout(() => {
      console.log('Resetting confetti');
      setShowConfetti(false);
    }, 3500);
  };
  
  return (
    <>
      {/* Confetti Effect - Triggered on Email Success */}
      <ConfettiEffect trigger={showConfetti} />
      
      <section className={`py-16 ${className || ''}`}>
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid lg:grid-cols-hero-split gap-16 items-center">
            {/* Left Column: Text & Form */}
            <div>
              <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                {t('landing:hero.title_line1')}
                <br />
                <span className="bg-gradient-to-r from-primary-600 to-accent-coral bg-clip-text text-transparent">
                  {t('landing:hero.title_line2')}
                </span>
              </h1>

              <p className="text-xl text-text-secondary mb-10 leading-relaxed">
                {t('landing:hero.description')}{' '}
                <strong>{t('landing:hero.description_highlight')}</strong>
              </p>

              {/* Trust Statistics - Matching v0 design exactly */}
              <dl className="grid grid-cols-3 gap-6 py-6 border-y border-border-strong mb-10">
                {TRUST_STATISTICS.map((stat) => (
                  <div key={stat.id}>
                    <dt className="font-display text-3xl font-semibold text-primary-warm leading-tight block">
                      {t(stat.valueKey)}
                    </dt>
                    <dd className="text-sm text-text-muted mt-1 block">
                      {t(stat.descriptionKey)}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Progress Indicator - Using real Supabase data - Compact like v0 design */}
              <div className="mb-6">
                <ProgressIndicator 
                  current={subscriberData?.current}
                  total={subscriberData?.total}
                  showAnimation={true} 
                />
              </div>

              {/* Email Capture - Promo Design */}
              <div id="email-capture" role="region" aria-label="Email signup">
                <EmailCapture 
                  variant={emailCaptureVariant} 
                  onSuccess={handleEmailSuccess}
                />
              </div>

              {/* Share Widget - Shows after successful signup */}
              {showShare && (
                <div className="mt-6 pt-6 border-t border-border-light animate-fade-in">
                  <ShareWidget />
                </div>
              )}
            </div>

            {/* Right Column: Workflow Visualization */}
            {showWorkflowNodes && (
              <div 
                className="relative min-h-workflow-min lg:block"
                role="img"
                aria-label="Workflow visualization"
              >
                <WorkflowVisualization />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export { HeroSection };