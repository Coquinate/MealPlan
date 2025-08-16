'use client';

import React from 'react';
import { useTranslation } from '@coquinate/i18n';
import { IconClock, IconPigMoney, IconSalad, IconRecycle } from '@tabler/icons-react';

/**
 * Benefit Cards Component
 * Displays 4 key benefits with icons and descriptions
 * Uses design tokens and ensures 44px minimum touch targets
 */
export function BenefitCards() {
  const { t } = useTranslation('landing');

  // React 19 optimizes this automatically - no useMemo needed
  const benefits = [
    {
      key: 'save_time',
      icon: IconClock,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      key: 'save_money',
      icon: IconPigMoney,
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600',
    },
    {
      key: 'eat_healthy',
      icon: IconSalad,
      bgColor: 'bg-warning-50',
      iconColor: 'text-warning-700',
    },
    {
      key: 'reduce_waste',
      icon: IconRecycle,
      bgColor: 'bg-error-50',
      iconColor: 'text-error-600',
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-text mb-12 font-display">
          {t('benefits.title')}
        </h2>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.key}
                className="bg-surface-raised rounded-lg p-6 lg:p-8 border border-border hover:border-border-strong transition-colors duration-200"
              >
                {/* Icon Container - 44px minimum touch target */}
                <div
                  className={`w-12 h-12 ${benefit.bgColor} rounded-full flex items-center justify-center mb-4`}
                  aria-hidden="true"
                >
                  <Icon size={24} className={benefit.iconColor} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-text mb-2">
                  {t(`benefits.${benefit.key}.title`)}
                </h3>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed">
                  {t(`benefits.${benefit.key}.description`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
