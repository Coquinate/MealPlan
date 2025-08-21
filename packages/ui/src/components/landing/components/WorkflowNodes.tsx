'use client';

import * as i18nModule from '@coquinate/i18n';
import type { TranslationNamespace } from '@coquinate/i18n';
import { IconChefHat, IconFileText, IconSparkles } from '@tabler/icons-react';
import { m } from '../../../motion/config';

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

export function WorkflowNodes() {
  const { t } = useTranslation('landing' as TranslationNamespace);

  return (
    <div className="relative w-full h-full min-h-workflow-min flex justify-center items-center">
      {/* SVG Connector Lines with Animation */}
      <svg
        className="absolute top-0 left-0 w-full h-full z-0"
        viewBox="0 0 300 300"
        preserveAspectRatio="xMidYMid meet"
      >
        <m.path
          d="M 110 40 C 40 100, 40 150, 85 175 C 130 200, 180 240, 210 280"
          stroke="var(--color-border-light)"
          fill="transparent"
          strokeWidth="2"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      {/* Node 1: Gătești Duminică */}
      <m.div 
        className="absolute top-8 left-4 w-56 bg-white border border-border-light rounded-xl p-4 shadow-sm z-10"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ 
          y: -8,
          scale: 1.05,
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <m.div 
            className="w-10 h-10 bg-accent-coral/20 rounded-lg flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <IconChefHat className="w-5 h-5 text-accent-coral" />
          </m.div>
          <span className="font-display font-semibold text-base">
            {t('workflow.cook_sunday.title')}
          </span>
        </div>
        <p className="text-sm text-text-muted">
          {t('workflow.cook_sunday.description')}
        </p>
      </m.div>

      {/* Node 2: Refolosești Luni */}
      <m.div 
        className="absolute top-1/2 left-8 -translate-y-1/2 w-56 bg-white border border-border-light rounded-xl p-4 shadow-sm z-10"
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileHover={{ 
          y: -8,
          scale: 1.05,
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <m.div 
            className="w-10 h-10 bg-accent-coral/20 rounded-lg flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <IconFileText className="w-5 h-5 text-accent-coral" />
          </m.div>
          <span className="font-display font-semibold text-base">
            {t('workflow.reuse_monday.title')}
          </span>
        </div>
        <p className="text-sm text-text-muted">
          {t('workflow.reuse_monday.description')}
        </p>
      </m.div>

      {/* Node 3: Reinventezi Marți */}
      <m.div 
        className="absolute bottom-8 right-4 w-56 bg-white border border-border-light rounded-xl p-4 shadow-sm z-10"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        whileHover={{ 
          y: -8,
          scale: 1.05,
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <m.div 
            className="w-10 h-10 bg-accent-coral/20 rounded-lg flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <IconSparkles className="w-5 h-5 text-accent-coral" />
          </m.div>
          <span className="font-display font-semibold text-base">
            {t('workflow.reinvent_tuesday.title')}
          </span>
        </div>
        <p className="text-sm text-text-muted">
          {t('workflow.reinvent_tuesday.description')}
        </p>
      </m.div>
    </div>
  );
}