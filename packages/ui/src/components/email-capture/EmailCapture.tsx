'use client';

import React from 'react';
import { IconGift } from '@tabler/icons-react';
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
                  className="glass-input focus-glass text-text placeholder:text-text-muted placeholder:opacity-60"
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

  // Promo variant - COMPACT horizontal layout matching column width
  if (variant === 'promo') {
    return (
      <div className={cn('w-full relative', className)}>
        {/* COMPACT CONTAINER with subtle gray background and enhanced shadow */}
        <div 
          className="bg-surface-secondary backdrop-blur-sm border border-border-strong rounded-xl p-5 shadow-sm transition-all duration-300 relative overflow-hidden"
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
          
          {/* Content */}
          <div className="relative z-10">
            {/* TITLE - REVERTING TO GRADIENT TEXT */}
            <h3 className="font-display text-base font-bold mb-3 bg-gradient-to-r from-primary-warm to-accent-coral bg-clip-text text-transparent leading-tight text-center">
              {PROMO_VARIANT_CONFIG.title}
            </h3>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* COMPACT EMAIL FORM - Horizontal layout */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={validation.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => validation.setEmail(e.target.value)}
                    placeholder="adresa@email.com"
                    className={cn(
                      'w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-0 transition-all duration-300 disabled:opacity-60 text-sm font-medium',
                      // SIMPLE CLEAN BACKGROUND
                      'bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 backdrop-blur-sm',
                      // COLORFUL BORDERS and focus states
                      'border-primary-warm border-opacity-30 hover:border-primary-warm hover:border-opacity-40 focus:border-primary-warm focus:border-opacity-100 focus:shadow-lg',
                      // CLEAN TEXT COLORS
                      'text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:font-normal',
                      // VALIDATION COLORS
                      submission.hasError && '!border-red-500 !bg-red-50 !bg-opacity-90 dark:!bg-red-900 dark:!bg-opacity-20 !shadow-lg !text-red-700 dark:!text-red-400',
                      validation.isValid && validation.email.length > 0 && '!border-green-500 !bg-green-50 !bg-opacity-90 dark:!bg-green-900 dark:!bg-opacity-20 !shadow-lg !text-green-700 dark:!text-green-400'
                    )}
                    disabled={submission.isLoading}
                    required
                    aria-invalid={submission.hasError}
                  />
                  {/* COMPACT validation icons */}
                  {(submission.hasError || (validation.isValid && validation.email.length > 0)) && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <svg className={cn('w-4 h-4', 
                        submission.hasError ? 'text-red-500' : 'text-green-500'
                      )} fill="currentColor" viewBox="0 0 20 20">
                        {submission.hasError ? (
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        )}
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* BUTTON - REVERTING TO GRADIENT BACKGROUND */}
                <button
                  type="submit"
                  disabled={!validation.isValid || submission.isLoading || !validation.gdprConsent}
                  className={cn(
                    'px-5 py-2 font-bold rounded-lg transition-all duration-300 disabled:cursor-not-allowed text-sm shadow-sm whitespace-nowrap',
                    // REVERTING TO VIBRANT GRADIENT BACKGROUND
                    'bg-gradient-to-r from-primary-warm to-accent-coral text-white',
                    'hover:shadow-lg hover:scale-[1.02]',
                    'active:scale-[0.98]',
                    // DISABLED STATE
                    'disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 disabled:shadow-none disabled:scale-100'
                  )}
                  aria-busy={submission.isLoading}
                >
                  {submission.isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                      <span className="hidden sm:inline">{PROMO_VARIANT_CONFIG.loadingText}</span>
                    </div>
                  ) : (
                    PROMO_VARIANT_CONFIG.buttonText
                  )}
                </button>
              </div>

              {/* COMPACT GDPR Consent */}
              <div className="bg-surface-secondary rounded-lg p-3">
                <GDPRCheckbox
                  checked={validation.gdprConsent}
                  onChange={validation.setGdprConsent}
                />
              </div>

              {/* COMPACT VIBRANT Status Messages */}
              {submission.hasError && submission.status.kind === 'error' && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 shadow-md">
                  <AlertDescription className="text-red-700 font-medium text-sm">
                    {t(`email.errors.${submission.status.code}`)}
                  </AlertDescription>
                </Alert>
              )}
              {submission.isSuccess && (
                <Alert className="border-green-200 bg-green-50 text-green-700 shadow-md">
                  <AlertDescription className="font-medium text-sm">
                    {t('email.success')}
                  </AlertDescription>
                </Alert>
              )}
            </form>

            {/* Benefits List with Tabler Icon */}
            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm">
                <IconGift 
                  size={20} 
                  className="text-primary-warm flex-shrink-0" 
                />
                <span className="text-gray-700">
                  <strong>Toți înscrișii</strong> primesc un trial extins la 7 zile!
                </span>
              </div>
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
