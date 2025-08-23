'use client';

import React, { memo } from 'react';
import * as i18nModule from '@coquinate/i18n';
import type { TranslationNamespace } from '@coquinate/i18n';
import { 
  IconMapPin, 
  IconClipboardList, 
  IconCircleCheck, 
  IconHeart 
} from '@tabler/icons-react';

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
interface IconProps {
  size?: number;
  className?: string;
  stroke?: number;
}

interface Feature {
  id: string;
  icon: React.FC<IconProps>;
  titleKey: string;
  descriptionKey: string;
  descriptionHighlightKey?: string;
  descriptionEndKey?: string;
}

interface FeaturesSectionProps {
  className?: string;
}

// Static features data - hoisted outside component for performance
const FEATURES_DATA: Feature[] = [
  {
    id: 'local-ingredients',
    icon: IconMapPin,
    titleKey: 'features.local.title',
    descriptionKey: 'features.local.description',
  },
  {
    id: 'smart-shopping',
    icon: IconClipboardList,
    titleKey: 'features.shopping.title',
    descriptionKey: 'features.shopping.description',
  },
  {
    id: 'zero-waste',
    icon: IconCircleCheck,
    titleKey: 'features.zero_waste.title',
    descriptionKey: 'features.zero_waste.description',
  },
  {
    id: 'chef-ai',
    icon: IconHeart,
    titleKey: 'features.chef_ai.title',
    descriptionKey: 'features.chef_ai.description',
    descriptionHighlightKey: 'features.chef_ai.description_highlight',
    descriptionEndKey: 'features.chef_ai.description_end',
  },
];

// Extracted component for feature description rendering
function FeatureDescription({ 
  feature, 
  t 
}: { 
  feature: Feature; 
  t: (key: string) => string;
}) {
  if (feature.descriptionHighlightKey) {
    return (
      <>
        {t(feature.descriptionKey)}{' '}
        <strong>{t(feature.descriptionHighlightKey)}</strong>
        {feature.descriptionEndKey && t(feature.descriptionEndKey)}
      </>
    );
  }
  return <>{t(feature.descriptionKey)}</>;
}

FeatureDescription.displayName = 'FeatureDescription';

export function FeaturesSection({ 
  className 
}: FeaturesSectionProps = {}) {
  const { t } = useTranslation('landing' as TranslationNamespace);

  return (
    <section className={`bg-dark-surface py-16 sm:py-20 md:py-24 ${className || ''}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white text-balance">
            {t('features.title')}
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
          {FEATURES_DATA.map((feature) => (
            <div
              key={feature.id}
              className="bg-dark-surface-raised p-5 sm:p-6 md:p-8 rounded-xl border border-gray-700 md:hover:-translate-y-1 md:hover:bg-gray-700 md:hover:border-accent-coral motion-safe:transition-all motion-reduce:transition-none duration-300 text-center md:text-left"
            >
              <div className="w-14 h-14 sm:w-12 sm:h-12 md:w-11 md:h-11 bg-accent-coral-100 rounded-lg flex items-center justify-center mb-4 md:mb-5 mx-auto md:mx-0">
                <feature.icon className="w-7 h-7 sm:w-6 sm:h-6 md:w-5 md:h-5 text-accent-coral" stroke={2} />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-white mb-3">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm sm:text-base text-white opacity-80 leading-relaxed text-pretty break-words hyphens-auto">
                <FeatureDescription feature={feature} t={t} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}