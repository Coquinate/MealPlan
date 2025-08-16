'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { subscribe, SubscribeApiError } from '@coquinate/shared';
import { FloatingElements, FloatingOrbPresets } from '../floating-elements';

// Import for production use
import * as i18nModule from '@coquinate/i18n';

// Mock useTranslation for Storybook compatibility
const useTranslation = (namespace?: string) => {
  const isStorybook = typeof window !== 'undefined' && (window as any).mockTranslations;

  if (isStorybook) {
    return {
      t: (key: string) => (window as any).mockTranslations[key] || key,
    };
  }

  // In production, use the real i18n
  try {
    return i18nModule.useTranslation(namespace);
  } catch {
    // Fallback if i18n not available
    return {
      t: (key: string) => key,
    };
  }
};

/**
 * State type for EmailCapture form
 */
type EmailCaptureStatus =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success' }
  | {
      kind: 'error';
      code: 'invalid_email' | 'already_subscribed' | 'rate_limited' | 'server_error';
    };

export interface EmailCaptureProps {
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Component variant for styling
   */
  variant?: 'glass' | 'simple' | 'inline';
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
 * Modern Hearth Email Capture Component
 * FAZA 3: Functional with MSW API integration
 *
 * Features:
 * - Form state management with discriminated union
 * - AbortController for request cancellation
 * - Glass morphism styling with floating orbs
 * - Internationalized error messages
 * - OKLCH design tokens
 * - Accessibility features (ARIA labels, roles)
 * - MSW-compatible API integration
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
  const { t } = useTranslation('landing');

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<EmailCaptureStatus>({ kind: 'idle' });
  const abortRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Cleanup abort controller and track mounted state on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard against multiple submissions
    if (status.kind === 'loading') return;

    setStatus({ kind: 'loading' });

    // Cancel any existing request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      await subscribe({ email }, abortRef.current.signal);

      if (isMountedRef.current) {
        setStatus({ kind: 'success' });
        onSuccess?.(email);
      }
    } catch (error) {
      // Handle AbortError (user cancelled)
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        // Handle API errors
        if (error instanceof SubscribeApiError) {
          setStatus({ kind: 'error', code: error.code });
          onError?.(error);
        } else {
          // Handle unexpected errors
          setStatus({ kind: 'error', code: 'server_error' });
          onError?.(new SubscribeApiError('Unknown error', 'server_error', 0));
        }
      }
    }
  };

  const isLoading = status.kind === 'loading';
  const isSuccess = status.kind === 'success';
  const hasError = status.kind === 'error';

  // Glass variant - preserves original design
  if (variant === 'glass') {
    return (
      <div className={`max-w-md mx-auto relative ${className}`}>
        {/* Floating Orbs - Using reusable component with standard preset */}
        {withFloatingElements && <FloatingElements orbs={FloatingOrbPresets.standard} />}

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

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email Input with Glass Style */}
              <div>
                <label htmlFor="email" className="sr-only">
                  {t('email.label')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder ?? t('email.placeholder')}
                  className="glass-input w-full focus-glass text-text placeholder-text-muted transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  required
                  aria-label={t('email.label')}
                  aria-describedby={
                    `${hasError ? 'email-error ' : ''}${isSuccess ? 'email-success' : ''}`.trim() ||
                    'email-status'
                  }
                  aria-invalid={hasError}
                />
              </div>

              {/* Submit Button with Modern Hearth Colors */}
              <button
                type="submit"
                className={clsx(
                  'w-full h-11 px-6 font-semibold rounded-lg flex items-center justify-center',
                  'transition-all duration-300 font-display focus-premium-warm',
                  'disabled:hover:shadow-none',
                  {
                    'bg-primary-warm/70 cursor-wait': isLoading,
                    'bg-success-600 text-white': isSuccess,
                    'bg-gradient-to-r from-primary-warm to-primary-warm-light text-white hover:shadow-glow':
                      !isLoading && !isSuccess,
                    'opacity-50 cursor-not-allowed': email.length === 0 || isLoading,
                  }
                )}
                disabled={email.length === 0 || isLoading}
                aria-label={buttonText ?? t('email.button')}
                aria-busy={isLoading}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading && (
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  {isLoading && t('email.loading')}
                  {isSuccess && `✓ ${t('email.success')}`}
                  {!isLoading && !isSuccess && (buttonText ?? t('email.button'))}
                </span>
              </button>

              {/* Status Messages */}
              <div id="email-status" className="text-sm text-center text-romanian">
                {hasError && (
                  <p id="email-error" role="alert" className="text-danger-600 font-medium">
                    {t(`email.errors.${status.code}`)}
                  </p>
                )}
                {isSuccess && (
                  <p id="email-success" role="status" className="text-success-600 font-medium">
                    {t('email.success')}
                  </p>
                )}
                {status.kind === 'idle' && (
                  <span className="text-text-muted">
                    <span className="text-accent-coral font-medium">{t('email.phase_info')}</span>
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Simple variant - clean form without glass effects
  if (variant === 'simple') {
    return (
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
        <div>
          <label htmlFor="email-simple" className="block text-sm font-medium text-text mb-2">
            {t('email.label')}
          </label>
          <input
            id="email-simple"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder ?? t('email.placeholder')}
            className="w-full px-4 py-3 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-warm focus:border-primary-warm transition-all duration-200 disabled:opacity-60"
            disabled={isLoading}
            required
            aria-invalid={hasError}
            aria-describedby={
              `${hasError ? 'error-simple ' : ''}${isSuccess ? 'success-simple' : ''}`.trim() ||
              undefined
            }
          />
        </div>

        <button
          type="submit"
          disabled={email.length === 0 || isLoading}
          className="w-full px-6 py-3 bg-primary-warm text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-busy={isLoading}
        >
          {isLoading ? t('email.loading') : (buttonText ?? t('email.button'))}
        </button>

        {hasError && (
          <p id="error-simple" role="alert" className="text-danger-600 text-sm">
            {t(`email.errors.${status.code}`)}
          </p>
        )}
        {isSuccess && (
          <p id="success-simple" role="status" className="text-success-600 text-sm font-medium">
            {t('email.success')}
          </p>
        )}
      </form>
    );
  }

  // Inline variant - horizontal layout
  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 items-end ${className}`}>
      <div className="flex-1">
        <label htmlFor="email-inline" className="sr-only">
          {t('email.label')}
        </label>
        <input
          id="email-inline"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder ?? t('email.placeholder')}
          className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-warm focus:border-primary-warm transition-all duration-200 disabled:opacity-60"
          disabled={isLoading}
          required
          aria-invalid={hasError}
          aria-describedby={
            `${hasError ? 'inline-error ' : ''}${isSuccess ? 'inline-success' : ''}`.trim() ||
            undefined
          }
        />
      </div>

      <button
        type="submit"
        disabled={email.length === 0 || isLoading}
        className="px-4 py-2 bg-primary-warm text-white font-medium rounded-lg hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        aria-busy={isLoading}
      >
        {isLoading ? '...' : (buttonText ?? t('email.button'))}
      </button>

      {(hasError || isSuccess) && (
        <div className="absolute top-full left-0 mt-1 text-sm">
          {hasError && (
            <p id="inline-error" role="alert" className="text-danger-600">
              {t(`email.errors.${status.code}`)}
            </p>
          )}
          {isSuccess && (
            <p id="inline-success" role="status" className="text-success-600">
              {t('email.success')}
            </p>
          )}
        </div>
      )}
    </form>
  );
}
