'use client';

import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { PROMO_VARIANT_CONFIG } from './constants';

interface GDPRCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  id?: string;
}

/**
 * GDPR consent checkbox component pentru varianta promo
 * Folosește shadcn/ui Checkbox primitive cu styling custom
 */
export function GDPRCheckbox({
  checked,
  onChange,
  className,
  id = 'gdpr-consent',
}: GDPRCheckboxProps) {
  return (
    <div className={`flex items-start gap-3 ${className || ''}`}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        required
        className="mt-0.5"
      />
      <label htmlFor={id} className="text-xs text-text-muted-secondary leading-relaxed">
        {PROMO_VARIANT_CONFIG.gdprText}{' '}
        <a
          href={PROMO_VARIANT_CONFIG.gdprLinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted-secondary underline hover:text-text-medium-contrast"
        >
          {PROMO_VARIANT_CONFIG.gdprLinkText}
        </a>{' '}
        {PROMO_VARIANT_CONFIG.gdprSuffix}
      </label>
    </div>
  );
}