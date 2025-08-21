'use client';

import React from 'react';
import { FloatingElements, FloatingOrbPresets } from '../floating-elements';
import { useI18nWithFallback, useEmailValidation, useEmailSubmission, useFloatingElements } from '../../hooks';
import { Button } from '../button';
import { Input } from '../input';
import { Alert, AlertDescription } from '../ui/alert';
import { GDPRCheckbox } from './GDPRCheckbox';
import { glassContainerStyles, mockupContainerStyles, emailCaptureContainerVariants } from './styles';
import { PROMO_VARIANT_CONFIG, type EmailCaptureVariant } from './constants';
import { cn } from '../../utils/cn';
import type { SubscribeApiError } from '@coquinate/shared';
import type { TranslationNamespace } from '@coquinate/i18n';

export interface EmailCaptureProps {
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Component variant for styling
   */
  variant?: EmailCaptureVariant;
  /**
   * Enable Modern Hearth floating elements
   */
  withFloatingElements?: boolean;
  /**
   * Optional placeholder override
   */
  placeholder?: string;
  /**
   * Optional button text override
   */
  buttonText?: string;
  /**
   * Callback when successfully subscribed
   */
  onSuccess?: (email: string) => void;
  /**
   * Callback when error occurs
   */
  onError?: (error: SubscribeApiError) => void;
}

/**
 * Modern Hearth Email Capture Component - Refactorizat cu Single Responsibility Principle
 * 
 * Features:
 * - Folosește hook-uri specializate pentru logică separată
 * - shadcn/ui primitives pentru UI components
 * - 4 variante de styling: glass, simple, inline, promo
 * - Internationalization cu fallback pentru Storybook
 * - Floating elements pentru glass variant
 * - GDPR consent pentru promo variant
 */
export function EmailCapture({
  className = '',
  variant = 'glass',
  withFloatingElements = true,
  placeholder,
  buttonText,
  onSuccess,
  onError,
}: EmailCaptureProps) {
  const { t } = useI18nWithFallback('common' as TranslationNamespace);
  
  // Folosire hook-uri specializate
  const validation = useEmailValidation();
  const submission = useEmailSubmission();
  const floating = useFloatingElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard contra multiple submissions
    if (submission.isLoading) return;

    // Guard pentru promo variant - GDPR consent necesar
    if (variant === 'promo' && !validation.gdprConsent) {
      return;
    }

    // Guard pentru validare email
    if (!validation.isValid) return;

    await submission.submit(validation.email, validation.gdprConsent, {
      onSuccess: (email) => {
        floating.trigger();
        onSuccess?.(email);
      },
      onError: (error) => {
        onError?.(error);
      },
    });
  };

  // Glass variant - cu floating elements și styling special
  if (variant === 'glass') {
    return (
      <div className={cn(emailCaptureContainerVariants({ variant }), className)}>
        {/* Floating Orbs */}
        {withFloatingElements && (
          <>
            <FloatingElements orbs={FloatingOrbPresets.standard} />
            {floating.showParticles && <FloatingElements orbs={FloatingOrbPresets.expressive} />}
          </>
        )}

        {/* Main Glass Container */}
        <div className={glassContainerStyles.container}>
          {/* Subtle Inner Glow */}
          <div className={glassContainerStyles.innerGlow} />

          {/* Content Wrapper */}
          <div className={glassContainerStyles.contentWrapper}>
            {/* CTA Text */}
            <p className={glassContainerStyles.ctaText}>
              {t('hero.cta')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email-glass" className="sr-only">
                  {t('email.label')}
                </label>
                <Input
                  id="email-glass"
                  type="email"
                  value={validation.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => validation.setEmail(e.target.value)}
                  placeholder={placeholder ?? t('email.placeholder')}
                  disabled={submission.isLoading}
                  required
                  className="glass-input focus-glass text-text placeholder:text-text-muted/60"
                  aria-describedby="email-glass-status"
                  aria-invalid={submission.hasError}
                />
              </div>

              <Button
                type="submit"
                disabled={!validation.isValid || submission.isLoading}
                className="w-full bg-gradient-to-r from-primary-warm to-primary-warm-light hover:shadow-sm"
                aria-busy={submission.isLoading}
              >
                {submission.isLoading && <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                {submission.isSuccess && '✓ '}
                {submission.isLoading ? t('email.loading') : (buttonText ?? t('email.button'))}
              </Button>

              {submission.hasError && submission.status.kind === 'error' && (
                <Alert variant="destructive" id="email-glass-status">
                  <AlertDescription>
                    {t(`email.errors.${submission.status.code}`)}
                  </AlertDescription>
                </Alert>
              )}
              {submission.isSuccess && (
                <Alert className="border-success-600 text-success-600" id="email-glass-status">
                  <AlertDescription>
                    {t('email.success')}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Simple variant - clean form without glass effects
  if (variant === 'simple') {
    return (
      <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
        <div>
          <label htmlFor="email-simple" className="block text-sm font-medium text-text mb-2">
            {t('email.label')}
          </label>
          <Input
            id="email-simple"
            type="email"
            value={validation.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => validation.setEmail(e.target.value)}
            placeholder={placeholder ?? t('email.placeholder')}
            className="focus:ring-primary-warm focus:border-primary-warm"
            disabled={submission.isLoading}
            required
            aria-invalid={submission.hasError}
            aria-describedby={
              `${submission.hasError ? 'error-simple ' : ''}${submission.isSuccess ? 'success-simple' : ''}`.trim() ||
              undefined
            }
          />
        </div>

        <Button
          type="submit"
          disabled={!validation.isValid || submission.isLoading}
          className="w-full"
          aria-busy={submission.isLoading}
        >
          {submission.isLoading && <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
          {submission.isLoading ? t('email.loading') : (buttonText ?? t('email.button'))}
        </Button>

        {submission.hasError && submission.status.kind === 'error' && (
          <Alert variant="destructive" id="error-simple">
            <AlertDescription>
              {t(`email.errors.${submission.status.code}`)}
            </AlertDescription>
          </Alert>
        )}
        {submission.isSuccess && (
          <Alert className="border-success-600 text-success-600" id="success-simple">
            <AlertDescription>
              {t('email.success')}
            </AlertDescription>
          </Alert>
        )}
      </form>
    );
  }

  // Promo variant - promotional design with special offer
  if (variant === 'promo') {
    return (
      <div className={cn('max-w-lg mx-auto', className)}>
        <div className="bg-white border-2 border-border-light rounded-xl p-8 shadow-email-card">
          {/* Offer Title */}
          <h3 className="font-display text-form-title font-semibold mb-4 text-text-high-contrast leading-relaxed">
            {PROMO_VARIANT_CONFIG.title}
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Form */}
            <div className="flex gap-3 mb-2">
              <input
                type="email"
                value={validation.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => validation.setEmail(e.target.value)}
                placeholder="adresa@email.com"
                className="flex-1 px-5 py-[0.875rem] border-2 border-border-subtle rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-primary focus:shadow-[0_0_0_3px_oklch(58%_0.08_200_/_0.2)] transition-all duration-200 disabled:opacity-60 placeholder:text-text-muted-secondary placeholder:opacity-60 placeholder:font-normal text-base text-text-high-contrast"
                disabled={submission.isLoading}
                required
                aria-invalid={submission.hasError}
              />
              <button
                type="submit"
                disabled={!validation.isValid || submission.isLoading || !validation.gdprConsent}
                className="px-8 py-[0.875rem] bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-200 disabled:bg-[#cccccc] disabled:cursor-not-allowed hover:-translate-y-0.5 text-base"
                aria-busy={submission.isLoading}
              >
                {submission.isLoading ? PROMO_VARIANT_CONFIG.loadingText : PROMO_VARIANT_CONFIG.buttonText}
              </button>
            </div>

            {/* GDPR Consent */}
            <GDPRCheckbox
              checked={validation.gdprConsent}
              onChange={validation.setGdprConsent}
            />

            {/* Status Messages */}
            {submission.hasError && submission.status.kind === 'error' && (
              <Alert variant="destructive">
                <AlertDescription>
                  {t(`email.errors.${submission.status.code}`)}
                </AlertDescription>
              </Alert>
            )}
            {submission.isSuccess && (
              <Alert className="border-success-600 text-success-600">
                <AlertDescription>
                  {t('email.success')}
                </AlertDescription>
              </Alert>
            )}
          </form>

          {/* Benefits List */}
          <div className="mt-4 flex flex-col gap-2 text-sm text-text-muted-secondary">
            <div className="flex items-center gap-2">
              <span className="text-accent-coral font-bold">✓</span>
              <span>
                <strong>Toți înscrișii</strong> primesc un trial extins la 7 zile!
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant - horizontal layout
  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1">
          <label htmlFor="email-inline" className="sr-only">
            {t('email.label')}
          </label>
          <Input
            id="email-inline"
            type="email"
            value={validation.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => validation.setEmail(e.target.value)}
            placeholder={placeholder ?? t('email.placeholder')}
            className="focus:ring-primary-warm focus:border-primary-warm"
            disabled={submission.isLoading}
            required
            aria-invalid={submission.hasError}
            aria-describedby={
              `${submission.hasError ? 'inline-error ' : ''}${submission.isSuccess ? 'inline-success' : ''}`.trim() ||
              undefined
            }
          />
        </div>

        <Button
          type="submit"
          disabled={!validation.isValid || submission.isLoading}
          size="sm"
          className="whitespace-nowrap"
          aria-busy={submission.isLoading}
        >
          {submission.isLoading ? '...' : (buttonText ?? t('email.button'))}
        </Button>
      </form>

      {(submission.hasError || submission.isSuccess) && (
        <div className="absolute top-full left-0 mt-1 text-sm">
          {submission.hasError && submission.status.kind === 'error' && (
            <p id="inline-error" role="alert" className="text-danger-600">
              {t(`email.errors.${submission.status.code}`)}
            </p>
          )}
          {submission.isSuccess && (
            <p id="inline-success" role="status" className="text-success-600">
              {t('email.success')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
