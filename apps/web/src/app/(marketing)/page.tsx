'use client';

import React from 'react';
import { useTranslation } from '@coquinate/i18n';
import {
  SiteNavigation,
  SiteFooter,
  EmailCapture,
  StaggerList,
  InteractiveCard,
} from '@coquinate/ui';
import { WorkflowNodes } from '@/components/features/landing';
import { IconMapPin, IconCircleCheck, IconClipboardList, IconHeart } from '@tabler/icons-react';

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

  return (
    <>
      {/* Navigation */}
      <SiteNavigation showLaunchBadge={true} comingSoonLabel={t('nav.coming_soon')} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="bg-surface-eggshell py-16">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-hero-split gap-12 items-start">
              {/* Left Column: Text & Form */}
              <div>
                <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  {t('hero.title_line1')}
                  <br />
                  <span className="bg-gradient-to-r from-primary-warm to-accent-coral bg-clip-text text-transparent italic">
                    {t('hero.title_line2')}
                  </span>
                </h1>

                <p className="text-xl text-text-secondary mb-10 max-w-content leading-relaxed">
                  {t('hero.description')}
                  <span className="font-semibold italic">{t('hero.description_highlight')}</span>
                </p>

                {/* Trust Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 py-6 border-y border-border-subtle mb-10">
                  <div>
                    <div className="font-display text-2xl font-semibold text-primary-warm">
                      {t('trust.hours_saved')}
                    </div>
                    <div className="text-sm text-text-muted mt-1 leading-relaxed">
                      {t('trust.hours_saved_desc')}
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-semibold text-primary-warm">
                      {t('trust.waste_reduced')}
                    </div>
                    <div className="text-sm text-text-muted mt-1 leading-relaxed">
                      {t('trust.waste_reduced_desc')}
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-semibold text-primary-warm">
                      {t('trust.money_saved')}
                    </div>
                    <div className="text-sm text-text-muted mt-1 leading-relaxed">
                      {t('trust.money_saved_desc')}
                    </div>
                  </div>
                </div>

                {/* Email Capture - Mockup Design */}
                <EmailCapture variant="mockup" className="max-w-md justify-self-start" />
              </div>

              {/* Right Column: Workflow Visualization */}
              <div className="relative min-h-[450px] hidden lg:block overflow-hidden">
                <WorkflowNodes />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-dark-surface py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <h2 className="text-center font-display text-4xl font-bold text-text-light mb-16">
              {t('features.title')}
            </h2>

            <StaggerList className="grid md:grid-cols-2 gap-8" animation="fade" startDelay={200}>
              {/* Feature 1 */}
              <InteractiveCard variant="glass" className="bg-dark-surface-raised p-6">
                <div className="w-12 h-12 bg-accent-coral/15 rounded-2xl flex items-center justify-center mb-4">
                  <IconMapPin className="w-6 h-6 text-accent-coral stroke-1" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text-light mb-2">
                  {t('features.local.title')}
                </h3>
                <p className="text-sm text-text-light/50 leading-relaxed">
                  {t('features.local.description')}
                </p>
              </InteractiveCard>

              {/* Feature 2 */}
              <InteractiveCard variant="glass" className="bg-dark-surface-raised p-6">
                <div className="w-12 h-12 bg-accent-coral/15 rounded-2xl flex items-center justify-center mb-4">
                  <IconClipboardList className="w-6 h-6 text-accent-coral stroke-1" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text-light mb-2">
                  {t('features.shopping.title')}
                </h3>
                <p className="text-sm text-text-light/50 leading-relaxed">
                  {t('features.shopping.description')}
                </p>
              </InteractiveCard>

              {/* Feature 3 */}
              <InteractiveCard variant="glass" className="bg-dark-surface-raised p-6">
                <div className="w-12 h-12 bg-accent-coral/15 rounded-2xl flex items-center justify-center mb-4">
                  <IconCircleCheck className="w-6 h-6 text-accent-coral stroke-1" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text-light mb-2">
                  {t('features.zero_waste.title')}
                </h3>
                <p className="text-sm text-text-light/50 leading-relaxed">
                  {t('features.zero_waste.description')}
                </p>
              </InteractiveCard>

              {/* Feature 4 */}
              <InteractiveCard variant="glass" className="bg-dark-surface-raised p-6">
                <div className="w-12 h-12 bg-accent-coral/15 rounded-2xl flex items-center justify-center mb-4">
                  <IconHeart className="w-6 h-6 text-accent-coral stroke-1" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text-light mb-2">
                  {t('features.chef_ai.title')}
                </h3>
                <p className="text-sm text-text-light/50 leading-relaxed">
                  {t('features.chef_ai.description')}
                  <strong>{t('features.chef_ai.description_highlight')}</strong>
                  {t('features.chef_ai.description_end')}
                </p>
              </InteractiveCard>
            </StaggerList>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary-warm to-accent-coral py-24">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-6">{t('cta.title')}</h2>
            <p className="text-xl text-white/95 mb-10 leading-relaxed">{t('cta.subtitle')}</p>
            <button
              type="button"
              aria-controls="email-capture"
              onClick={() =>
                document.getElementById('email-capture')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-white text-primary-warm px-12 py-4 rounded-lg font-semibold text-lg hover:-translate-y-0.5 transition-transform shadow-button hover:shadow-button"
            >
              {t('cta.button')}
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter copyrightText={t('footer.copyright')} privacyPolicyLabel={t('footer.privacy')} />
    </>
  );
}
