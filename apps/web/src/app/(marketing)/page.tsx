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
        <section className="bg-surface-50 py-24">
          <div className="mx-auto max-w-[1200px] px-8">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
              {/* Left Column: Text & Form */}
              <div>
                <h1 className="font-display text-[3.5rem] font-bold leading-[1.15] tracking-[-0.03em] mb-6">
                  {t('hero.title_line1')}
                  <br />
                  <span className="bg-gradient-to-r from-primary-600 to-accent-coral bg-clip-text text-transparent">
                    {t('hero.title_line2')}
                  </span>
                </h1>

                <p className="text-[1.2rem] text-text-secondary mb-10 max-w-[550px] leading-[1.6]">
                  {t('hero.description')} <strong>{t('hero.description_highlight')}</strong>
                </p>

                {/* Trust Statistics */}
                <div className="grid grid-cols-3 gap-6 py-6 border-y border-surface-200 mb-10">
                  <div>
                    <div className="font-display text-[1.75rem] font-semibold text-primary-600 leading-[1.2]">
                      {t('trust.hours_saved')}
                    </div>
                    <div className="text-[0.85rem] text-text-muted mt-1">
                      {t('trust.hours_saved_desc')}
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-[1.75rem] font-semibold text-primary-600 leading-[1.2]">
                      {t('trust.waste_reduced')}
                    </div>
                    <div className="text-[0.85rem] text-text-muted mt-1">
                      {t('trust.waste_reduced_desc')}
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-[1.75rem] font-semibold text-primary-600 leading-[1.2]">
                      {t('trust.money_saved')}
                    </div>
                    <div className="text-[0.85rem] text-text-muted mt-1">
                      {t('trust.money_saved_desc')}
                    </div>
                  </div>
                </div>

                {/* Email Capture - Mockup Design */}
                <div id="email-capture">
                  <EmailCapture variant="mockup" />
                </div>
              </div>

              {/* Right Column: Workflow Visualization */}
              <div className="relative min-h-[450px] hidden lg:block overflow-hidden">
                <WorkflowNodes />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Dark Theme */}
        <section className="bg-surface-900 py-24">
          <div className="mx-auto max-w-[1200px] px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-[2.5rem] font-bold text-white">
                {t('features.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <div className="bg-surface-800 p-8 rounded-xl border border-surface-700 hover:-translate-y-1 hover:bg-surface-700 hover:border-accent-coral transition-all duration-300">
                <div className="w-10 h-10 bg-accent-coral/20 rounded-lg flex items-center justify-center mb-6">
                  <IconMapPin className="w-5 h-5 text-accent-coral" stroke={2} />
                </div>
                <h3 className="font-display text-[1.25rem] font-semibold text-white mb-3">
                  {t('features.local.title')}
                </h3>
                <p className="text-base text-white opacity-80">{t('features.local.description')}</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-surface-800 p-8 rounded-xl border border-surface-700 hover:-translate-y-1 hover:bg-surface-700 hover:border-accent-coral transition-all duration-300">
                <div className="w-10 h-10 bg-accent-coral/20 rounded-lg flex items-center justify-center mb-6">
                  <IconClipboardList className="w-5 h-5 text-accent-coral" stroke={2} />
                </div>
                <h3 className="font-display text-[1.25rem] font-semibold text-white mb-3">
                  {t('features.shopping.title')}
                </h3>
                <p className="text-base text-white opacity-80">
                  {t('features.shopping.description')}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-surface-800 p-8 rounded-xl border border-surface-700 hover:-translate-y-1 hover:bg-surface-700 hover:border-accent-coral transition-all duration-300">
                <div className="w-10 h-10 bg-accent-coral/20 rounded-lg flex items-center justify-center mb-6">
                  <IconCircleCheck className="w-5 h-5 text-accent-coral" stroke={2} />
                </div>
                <h3 className="font-display text-[1.25rem] font-semibold text-white mb-3">
                  {t('features.zero_waste.title')}
                </h3>
                <p className="text-base text-white opacity-80">
                  {t('features.zero_waste.description')}
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-surface-800 p-8 rounded-xl border border-surface-700 hover:-translate-y-1 hover:bg-surface-700 hover:border-accent-coral transition-all duration-300">
                <div className="w-10 h-10 bg-accent-coral/20 rounded-lg flex items-center justify-center mb-6">
                  <IconHeart className="w-5 h-5 text-accent-coral" stroke={2} />
                </div>
                <h3 className="font-display text-[1.25rem] font-semibold text-white mb-3">
                  {t('features.chef_ai.title')}
                </h3>
                <p className="text-base text-white opacity-80">
                  {t('features.chef_ai.description')}
                  <strong>{t('features.chef_ai.description_highlight')}</strong>
                  {t('features.chef_ai.description_end')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary-600 to-accent-coral py-24 px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-[2.5rem] font-bold text-white mb-4 tracking-[-0.02em]">
              {t('cta.title')}
            </h2>
            <p className="text-[1.25rem] text-white opacity-95 mb-10 max-w-[600px] mx-auto">
              {t('cta.subtitle')}
            </p>
            <a
              href="#email-capture"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('email-capture')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-primary-600 px-12 py-4 rounded-lg font-bold text-[1.125rem] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 shadow-md inline-block cursor-pointer"
            >
              {t('cta.button')}
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter copyrightText={t('footer.copyright')} privacyPolicyLabel={t('footer.privacy')} />
    </>
  );
}
