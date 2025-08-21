'use client';

import React from 'react';
import { useTranslation } from '@coquinate/i18n';
import { FloatingElements, FloatingOrbPresets } from './FloatingElements';

export interface EmailSignupSuccessProps {
  isEarlyBird: boolean;
  onReset?: () => void;
}

/**
 * Success state component for email signup
 * Displays success message, early bird badge, and social sharing options
 * Separated from EmailCapture to follow Single Responsibility Principle
 */
export function EmailSignupSuccess({ isEarlyBird, onReset }: EmailSignupSuccessProps) {
  const { t } = useTranslation('landing');

  const handleSocialShare = (platform: 'facebook' | 'whatsapp') => {
    const shareUrl = window.location.href;
    let url = '';

    if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(`${t('email.share_text')} ${shareUrl}`)}`;
    }

    if (url) {
      const w = window.open(url, '_blank', 'noopener,noreferrer');
      if (w) w.opener = null;
    }
  };

  return (
    <div className="max-w-md mx-auto relative">
      <FloatingElements orbs={FloatingOrbPresets.standard} />

      <div className="glass glass-elevated rounded-lg p-6 sm:p-8 relative z-10 hover-lift">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-warm/5 to-accent-coral/5 rounded-lg pointer-events-none" />

        <div className="relative z-10 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-warm to-primary-warm-light flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h3 className="text-xl font-display font-semibold text-text mb-2">
            {t('email.success')}
          </h3>

          {/* Early Bird Badge */}
          {isEarlyBird && (
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-accent-coral to-accent-coral-light text-white text-sm font-medium rounded-full mb-4">
              {t('email.early_bird_badge')}
            </div>
          )}

          <p className="text-text-secondary">
            {isEarlyBird ? t('email.early_bird_message') : t('email.regular_message')}
          </p>

          {/* Social Sharing */}
          <div className="mt-6 space-y-2">
            <p className="text-sm text-text-muted">{t('email.share_prompt')}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleSocialShare('facebook')}
                className="p-2 glass rounded-lg hover:bg-surface-raised transition-colors duration-200"
                aria-label={t('email.aria_labels.share_facebook')}
              >
                <svg className="w-5 h-5 text-text" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="p-2 glass rounded-lg hover:bg-surface-raised transition-colors duration-200"
                aria-label={t('email.aria_labels.share_whatsapp')}
              >
                <svg className="w-5 h-5 text-text" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Optional Reset Button */}
          {onReset && (
            <div className="mt-4">
              <button
                onClick={onReset}
                className="text-sm text-text-muted hover:text-text underline transition-colors"
              >
                {t('email.submit_another')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}