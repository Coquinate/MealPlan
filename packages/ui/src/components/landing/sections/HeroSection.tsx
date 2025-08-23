'use client';

import React, { useState } from 'react';
import * as i18nModule from '@coquinate/i18n';
import type { TranslationNamespace } from '@coquinate/i18n';
import { IconChefHat, IconFileText, IconStack2 } from '@tabler/icons-react';
import { useSubscriberCount } from '../../../hooks';
import { EmailCapture } from '../../email-capture/EmailCapture';
import { WorkflowVisualization } from '../components/workflow/WorkflowVisualization';
import { WorkflowTimeline } from '../components/workflow/WorkflowTimeline';
import { ConfettiEffect } from '../effects/ConfettiEffect';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { ShareWidget } from '../components/ShareWidget';
import { ShimmerHeadline } from '../../backgrounds/grain-shimmer';

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
  withShimmer?: boolean;
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
  showWorkflowNodes = true,
  withShimmer = false
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
      
      <section className={`py-6 sm:py-12 md:py-16 ${className || ''}`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-hero-split gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Column: Text & Form */}
            <div>
              <h1 className="font-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-3 sm:mb-4 md:mb-6 text-center sm:text-left">
                {t('landing:hero.title_line1')}{' '}
                {withShimmer ? (
                  <ShimmerHeadline>
                    {t('landing:hero.title_line2')}
                  </ShimmerHeadline>
                ) : (
                  <span className="bg-gradient-to-r from-primary-600 to-accent-coral bg-clip-text text-transparent">
                    {t('landing:hero.title_line2')}
                  </span>
                )}
              </h1>

              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-text-secondary mb-4 sm:mb-6 md:mb-8 lg:mb-10 leading-relaxed text-center sm:text-left">
                {t('landing:hero.description')}{' '}
                <strong className="block xs:inline">{t('landing:hero.description_highlight')}</strong>
              </p>

              {/* Trust Statistics - Single row on mobile */}
              <dl className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6 py-3 xs:py-4 sm:py-5 md:py-6 border-y border-border-strong mb-4 sm:mb-6 md:mb-8 lg:mb-10">
                {TRUST_STATISTICS.map((stat) => (
                  <div key={stat.id}>
                    <dt className="font-display text-base xs:text-lg sm:text-2xl md:text-3xl font-semibold text-primary-warm leading-none xs:leading-tight block text-center sm:text-left">
                      {t(stat.valueKey)}
                    </dt>
                    <dd className="text-xs sm:text-sm text-text-muted mt-0.5 sm:mt-1 block leading-tight text-center sm:text-left">
                      {t(stat.descriptionKey)}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Email Capture - Promo Design */}
              <div id="email-capture" role="region" aria-label="Email signup" className="mb-3 sm:mb-4 md:mb-6">
                <EmailCapture 
                  variant={emailCaptureVariant} 
                  onSuccess={handleEmailSuccess}
                />
              </div>

              {/* Progress Indicator - Using real Supabase data */}
              <div>
                <ProgressIndicator 
                  current={subscriberData?.current}
                  total={subscriberData?.total}
                  showAnimation={true} 
                />
              </div>

              {/* Share Widget - Shows after successful signup */}
              {showShare && (
                <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-border-light animate-fade-in">
                  <ShareWidget />
                </div>
              )}

              {/* Mobile Timeline - Shows only on mobile instead of workflow */}
              {showWorkflowNodes && (
                <div className="lg:hidden mt-6 sm:mt-8">
                  <WorkflowTimeline 
                    steps={[
                      {
                        id: 'sunday',
                        icon: <IconChefHat size={14} className="text-accent-coral" />,
                        title: t('landing:workflow.cook_sunday.title'),
                        description: t('landing:workflow.cook_sunday.description'),
                        alignment: 'left'
                      },
                      {
                        id: 'monday',
                        icon: <IconFileText size={14} className="text-accent-coral" />,
                        title: t('landing:workflow.reuse_monday.title'),
                        description: t('landing:workflow.reuse_monday.description'),
                        alignment: 'right'
                      },
                      {
                        id: 'tuesday',
                        icon: <IconStack2 size={14} className="text-accent-coral" />,
                        title: t('landing:workflow.reinvent_tuesday.title'),
                        description: t('landing:workflow.reinvent_tuesday.description'),
                        alignment: 'left'
                      }
                    ]}
                    showArrows={true}
                    className="scale-90 xs:scale-100"
                  />
                </div>
              )}
            </div>

            {/* Right Column: Workflow Visualization - Hidden on mobile/tablet */}
            {showWorkflowNodes && (
              <div 
                className="hidden lg:block relative min-h-workflow-min"
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