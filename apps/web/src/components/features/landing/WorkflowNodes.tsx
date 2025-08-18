'use client';

import { useTranslation } from '@coquinate/i18n';
import { IconChefHat, IconFileText, IconSparkles } from '@tabler/icons-react';

export function WorkflowNodes() {
  const { t } = useTranslation('landing');

  return (
    <div className="relative w-full h-full max-w-none overflow-hidden">
      {/* SVG Connector Lines - Improved curved path connecting the cards */}
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none hidden lg:block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 75 15 Q 65 35 75 50 Q 85 65 75 85"
          stroke="var(--color-primary-warm, #4A9B8E)"
          strokeOpacity="0.3"
          fill="transparent"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Desktop Layout: 3 Nodes positioned using grid for better control */}
      <div className="hidden lg:grid lg:grid-rows-3 lg:h-full lg:items-center lg:justify-end lg:pr-16 lg:py-16 lg:gap-8">
        {/* Node 1: Gătești Duminică */}
        <div className="w-56 bg-white border border-border-light rounded-card p-4 shadow-workflow-card hover:shadow-workflow-card hover:-translate-y-1 transition-all duration-300 z-20 justify-self-end">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-coral/15 rounded-2xl flex items-center justify-center flex-shrink-0">
              <IconChefHat className="w-5 h-5 text-accent-coral stroke-1 stroke-1" />
            </div>
            <span className="font-display font-semibold text-base text-text">
              {t('workflow.cook_sunday.title')}
            </span>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            {t('workflow.cook_sunday.description')}
          </p>
        </div>

        {/* Node 2: Refolosești Luni */}
        <div className="w-56 bg-white border border-border-light rounded-card p-4 shadow-workflow-card hover:shadow-workflow-card hover:-translate-y-1 transition-all duration-300 z-20 justify-self-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-coral/15 rounded-2xl flex items-center justify-center flex-shrink-0">
              <IconFileText className="w-5 h-5 text-accent-coral stroke-1" />
            </div>
            <span className="font-display font-semibold text-base text-text">
              {t('workflow.reuse_monday.title')}
            </span>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            {t('workflow.reuse_monday.description')}
          </p>
        </div>

        {/* Node 3: Reinventezi Marți */}
        <div className="w-56 bg-white border border-border-light rounded-card p-4 shadow-workflow-card hover:shadow-workflow-card hover:-translate-y-1 transition-all duration-300 z-20 justify-self-end">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-coral/15 rounded-2xl flex items-center justify-center flex-shrink-0">
              <IconSparkles className="w-5 h-5 text-accent-coral stroke-1" />
            </div>
            <span className="font-display font-semibold text-base text-text">
              {t('workflow.reinvent_tuesday.title')}
            </span>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            {t('workflow.reinvent_tuesday.description')}
          </p>
        </div>
      </div>

      {/* Tablet Layout: Simple grid with consistent content */}
      <div className="hidden sm:block lg:hidden">
        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white border border-border-light rounded-card p-4 shadow-workflow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent-coral/15 rounded-2xl flex items-center justify-center">
                <IconChefHat className="w-5 h-5 text-accent-coral stroke-1" />
              </div>
              <span className="font-display font-semibold text-base">
                {t('workflow.cook_sunday.title')}
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              {t('workflow.cook_sunday.description')}
            </p>
          </div>

          <div className="bg-white border border-border-light rounded-card p-4 shadow-workflow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent-coral/15 rounded-2xl flex items-center justify-center">
                <IconFileText className="w-5 h-5 text-accent-coral stroke-1" />
              </div>
              <span className="font-display font-semibold text-base">
                {t('workflow.reuse_monday.title')}
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              {t('workflow.reuse_monday.description')}
            </p>
          </div>

          <div className="col-span-2 flex justify-center">
            <div className="bg-white border border-border-light rounded-card p-4 shadow-workflow-card w-56">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent-coral/15 rounded-2xl flex items-center justify-center">
                  <IconSparkles className="w-5 h-5 text-accent-coral stroke-1" />
                </div>
                <span className="font-display font-semibold text-base">
                  {t('workflow.reinvent_tuesday.title')}
                </span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                {t('workflow.reinvent_tuesday.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout: Vertical stack with consistent content */}
      <div className="block sm:hidden">
        <div className="space-y-4 max-w-sm mx-auto px-4">
          <div className="bg-white border border-border-light rounded-card p-4 shadow-workflow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent-coral/15 rounded-2xl flex items-center justify-center">
                <IconChefHat className="w-5 h-5 text-accent-coral stroke-1" />
              </div>
              <span className="font-display font-semibold text-base">
                {t('workflow.cook_sunday.title')}
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              {t('workflow.cook_sunday.description')}
            </p>
          </div>

          <div className="flex justify-center py-2">
            <div className="w-0.5 h-8 bg-border-light" />
          </div>

          <div className="bg-white border border-border-light rounded-card p-4 shadow-workflow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent-coral/15 rounded-2xl flex items-center justify-center">
                <IconFileText className="w-5 h-5 text-accent-coral stroke-1" />
              </div>
              <span className="font-display font-semibold text-base">
                {t('workflow.reuse_monday.title')}
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              {t('workflow.reuse_monday.description')}
            </p>
          </div>

          <div className="flex justify-center py-2">
            <div className="w-0.5 h-8 bg-border-light" />
          </div>

          <div className="bg-white border border-border-light rounded-card p-4 shadow-workflow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent-coral/15 rounded-2xl flex items-center justify-center">
                <IconSparkles className="w-5 h-5 text-accent-coral stroke-1" />
              </div>
              <span className="font-display font-semibold text-base">
                {t('workflow.reinvent_tuesday.title')}
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              {t('workflow.reinvent_tuesday.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
