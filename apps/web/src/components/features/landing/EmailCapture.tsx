'use client';

import React, { useState } from 'react';
import { useTranslation } from '@coquinate/i18n';
import { FloatingElements, FloatingOrbPresets } from './FloatingElements';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

/**
 * Zod schema for email signup form validation
 */
const emailSignupSchema = z.object({
  email: z.string().min(1, 'email.required').email('email.invalid').max(255, 'email.too_long'),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'gdpr.required',
  }),
});

type EmailSignupFormData = z.infer<typeof emailSignupSchema>;

/**
 * Modern Hearth Email Capture Component
 * Collects email addresses for launch notification with GDPR compliance
 * Phase 3: Full functionality with database integration and rate limiting
 */
export function EmailCapture() {
  const { t } = useTranslation('landing');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isEarlyBird, setIsEarlyBird] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailSignupFormData>({
    resolver: zodResolver(emailSignupSchema),
    defaultValues: {
      email: '',
      gdprConsent: false,
    },
  });

  const onSubmit = async (data: EmailSignupFormData) => {
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/email-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setErrorMessage(t('email.rate_limit'));
        } else if (response.status === 409) {
          setErrorMessage(t('email.already_exists'));
        } else {
          setErrorMessage(result.error || t('email.error'));
        }
        setSubmitStatus('error');
        return;
      }

      setIsEarlyBird(result.isEarlyBird);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Error submitting email:', error);
      setErrorMessage(t('email.error'));
      setSubmitStatus('error');
    }
  };

  if (submitStatus === 'success') {
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
                  onClick={() => {
                    const w = window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                    if (w) w.opener = null;
                  }}
                  className="p-2 glass rounded-lg hover:bg-surface-raised transition-colors duration-200"
                  aria-label={t('email.aria_labels.share_facebook')}
                >
                  <svg className="w-5 h-5 text-text" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const w = window.open(
                      `https://wa.me/?text=${encodeURIComponent(`${t('email.share_text')} ${window.location.href}`)}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                    if (w) w.opener = null;
                  }}
                  className="p-2 glass rounded-lg hover:bg-surface-raised transition-colors duration-200"
                  aria-label={t('email.aria_labels.share_whatsapp')}
                >
                  <svg className="w-5 h-5 text-text" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="email-capture" className="max-w-md mx-auto relative">
      {/* Floating Orbs - Using reusable component with standard preset */}
      <FloatingElements orbs={FloatingOrbPresets.standard} />

      {/* Main Glass Container */}
      <div className="glass glass-elevated rounded-lg p-6 sm:p-8 relative z-10 hover-lift">
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-warm/5 to-accent-coral/5 rounded-lg pointer-events-none" />

        {/* Content Wrapper */}
        <div className="relative z-10">
          {/* CTA Text with Modern Hearth Typography */}
          <p className="text-lg text-text-secondary mb-6 text-center font-display text-romanian">
            {t('hero.cta')}
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input with Glass Style */}
            <div>
              <label htmlFor="email" className="sr-only">
                {t('email.placeholder')}
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder={t('email.placeholder')}
                className={`glass-input w-full focus-glass text-text placeholder-text-muted transition-all duration-300 ${
                  errors.email ? 'border-error focus:border-error' : ''
                } ${submitStatus === 'loading' ? 'opacity-60' : ''}`}
                disabled={submitStatus === 'loading'}
                aria-label={t('email.aria_labels.email_input')}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                data-testid="email-input"
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-error" role="alert">
                  {t(errors.email.message || 'email.invalid')}
                </p>
              )}
            </div>

            {/* GDPR Consent Checkbox */}
            <div className="flex items-start gap-3">
              <input
                id="gdpr-consent"
                type="checkbox"
                {...register('gdprConsent')}
                className={`mt-1 w-5 h-5 rounded border-2 ${
                  errors.gdprConsent
                    ? 'border-error focus:ring-error'
                    : 'border-border focus:ring-primary-warm'
                } text-primary-warm focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface transition-colors`}
                disabled={submitStatus === 'loading'}
                aria-invalid={errors.gdprConsent ? 'true' : 'false'}
                aria-describedby={errors.gdprConsent ? 'gdpr-error' : 'gdpr-label'}
                data-testid="gdpr-checkbox"
              />
              <label
                id="gdpr-label"
                htmlFor="gdpr-consent"
                className="text-sm text-text-secondary leading-relaxed cursor-pointer"
              >
                {t('gdpr.consent_text')}{' '}
                <Link
                  href="/politica-de-confidentialitate"
                  className="text-primary-warm hover:text-primary-warm-light underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('gdpr.privacy_policy_link')}
                </Link>
              </label>
            </div>
            {errors.gdprConsent && (
              <p id="gdpr-error" className="text-sm text-error" role="alert">
                {t(errors.gdprConsent.message || 'gdpr.required')}
              </p>
            )}

            {/* Submit Button with Modern Hearth Colors */}
            <button
              type="submit"
              className={`w-full h-11 px-6 bg-gradient-to-r from-primary-warm to-primary-warm-light text-white font-semibold rounded-lg flex items-center justify-center transition-all duration-300 font-display focus-premium-warm ${
                submitStatus === 'loading'
                  ? 'opacity-60 cursor-wait'
                  : 'hover:shadow-glow cursor-pointer'
              }`}
              disabled={submitStatus === 'loading'}
              aria-label={t('email.aria_labels.submit_button')}
              data-testid="submit-button"
            >
              {submitStatus === 'loading' ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{t('email.submitting')}</span>
                </>
              ) : (
                <span className="relative z-10">{t('email.button')}</span>
              )}
            </button>

            {/* Error Message */}
            {submitStatus === 'error' && errorMessage && (
              <p className="text-sm text-error text-center" role="alert">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
