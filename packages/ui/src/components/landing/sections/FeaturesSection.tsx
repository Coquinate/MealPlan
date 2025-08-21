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
    <section className={`bg-dark-surface py-24 ${className || ''}`}>
      <div className="mx-auto max-w-7xl px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-white">
            {t('features.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {FEATURES_DATA.map((feature) => (
            <div
              key={feature.id}
              className="bg-dark-surface-raised p-8 rounded-xl border border-gray-700 hover:-translate-y-1 hover:bg-gray-700 hover:border-accent-coral transition-all duration-300 focus-within:ring-2 focus-within:ring-accent-coral"
            >
              <div className="w-10 h-10 bg-accent-coral/20 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-5 h-5 text-accent-coral" stroke={2} />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">
                {t(feature.titleKey)}
              </h3>
              <p className="text-base text-white opacity-80">
                <FeatureDescription feature={feature} t={t} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}