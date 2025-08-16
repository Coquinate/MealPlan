'use client';

import React from 'react';
import { useTranslation } from '@coquinate/i18n';

/**
 * Launch Badge Component
 * Displays "Launching Soon" status with warning colors and proper contrast
 * Minimum contrast ratio of 4.5:1 for WCAG compliance
 */
export function LaunchBadge() {
  const { t } = useTranslation('landing');

  return (
    <div
      className="inline-flex items-center px-4 py-2 bg-warning-50 border border-warning-500 rounded-full"
      role="status"
      aria-live="polite"
    >
      {/* Animated pulse indicator */}
      <div className="w-2 h-2 bg-warning rounded-full animate-pulse mr-2" aria-hidden="true" />

      {/* Status text with proper contrast (warning-700 on warning-50 = >4.5:1) */}
      <span className="text-sm font-medium text-warning-700">{t('status.launching_soon')}</span>
    </div>
  );
}
