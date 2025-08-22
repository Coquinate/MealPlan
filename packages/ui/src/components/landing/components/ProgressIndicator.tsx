'use client';

import React, { useEffect, useState } from 'react';
import * as i18nModule from '@coquinate/i18n';
import type { TranslationNamespace } from '@coquinate/i18n';
import { useMotionValue, useSpring, useTransform, useMotionValueEvent } from 'motion/react';
import { m } from '../../../motion/config';
import { IconUsers, IconTrendingUp } from '@tabler/icons-react';

export interface ProgressIndicatorProps {
  current?: number;
  total?: number;
  showAnimation?: boolean;
}

/**
 * Progress indicator component showing spots taken with animated progress bar.
 * Uses spring physics for smooth animations and supports accessibility features.
 */
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

export function ProgressIndicator({ 
  current = 0, 
  total = 500,
  showAnimation = true 
}: ProgressIndicatorProps) {

  const { t } = useTranslation(['landing', 'common'] as TranslationNamespace[]);
  const [currentValue, setCurrentValue] = useState(current);
  const [remainingValue, setRemainingValue] = useState(total - current);
  
  // Motion values for smooth animation
  const count = useMotionValue(showAnimation ? 0 : current);
  const springCount = useSpring(count, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.01
  });
  
  // Transform spring value to percentage with % unit
  const percentageWidth = useTransform(springCount, 
    [0, total], 
    ["0%", "100%"]
  );
  
  // Transform spring value to display values
  const displayCurrent = useTransform(springCount, Math.round);
  const remaining = useTransform(springCount, value => Math.round(total - value));
  
  // Update state values when motion values change
  useMotionValueEvent(displayCurrent, "change", (latest) => {
    setCurrentValue(latest);
  });
  
  useMotionValueEvent(remaining, "change", (latest) => {
    setRemainingValue(latest);
  });
  
  useEffect(() => {
    if (!showAnimation) {
      count.set(current);
    } else {
      // Animate from 0 to current value on mount
      const timer = setTimeout(() => count.set(current), 100);
      return () => clearTimeout(timer);
    }
  }, [current, showAnimation, count]);
  
  // Calculate percentage with one decimal place
  const progressPercentage = ((currentValue / total) * 100).toFixed(1);
  
  return (
    <div 
      className="bg-gradient-to-r from-accent-coral-soft/5 to-primary-warm/5 border border-border-strong rounded-xl p-4 shadow-sm transition-all duration-300"
      style={{
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 30px oklch(70% 0.18 20 / 0.3), 0 20px 40px oklch(0% 0 0 / 0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.transform = '';
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconUsers size={20} className="text-accent-coral" />
          <span className="font-semibold text-sm text-text">
            {t('landing:progress.spots_taken', { 
              current: currentValue, 
              total 
            })}
          </span>
        </div>
        <div className="flex items-center gap-1 text-accent-coral text-xs font-medium">
          <IconTrendingUp size={12} />
          <span>{t('landing:progress.spots_remaining', { remaining: remainingValue })}</span>
        </div>
      </div>

      <div 
        className="w-full bg-border-light rounded-full h-2 mb-2"
        role="progressbar" 
        aria-valuenow={currentValue}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-labelledby="progress-label"
        aria-describedby="progress-description"
      >
        <m.div 
          className="bg-gradient-to-r from-accent-coral to-primary-warm h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: percentageWidth }}
          initial={false}
        />
      </div>

      <p className="text-xs text-text-muted text-center" id="progress-description">
        <strong className="text-accent-coral">{Math.round(Number(progressPercentage))}%</strong> {t('landing:progress.percentage_reserved')}
      </p>
    </div>
  );
}