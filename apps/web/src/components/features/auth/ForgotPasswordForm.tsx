'use client';

import React, { useState } from 'react';
import { Button, Input, Card, cn } from '@coquinate/ui';
import { useTranslation } from '@coquinate/i18n';

export interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onBackToLogin: () => void;
  loading?: boolean;
  error?: string;
  success?: boolean;
  className?: string;
}

/**
 * Forgot password form component for requesting password reset emails
 * Implements Romanian translations and proper validation
 */
export const ForgotPasswordForm = React.forwardRef<HTMLFormElement, ForgotPasswordFormProps>(
  ({ onSubmit, onBackToLogin, loading = false, error, success = false, className }, ref) => {
    const { t } = useTranslation('auth');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = () => {
      let isValid = true;

      if (!email) {
        setEmailError(t('errors.emailRequired'));
        isValid = false;
      } else if (!email.includes('@')) {
        setEmailError(t('errors.emailInvalid'));
        isValid = false;
      } else {
        setEmailError('');
      }

      return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateEmail()) {
        return;
      }

      try {
        await onSubmit(email);
      } catch (error) {
        console.error('Forgot password error:', error);
      }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      // Clear error when user starts typing
      if (emailError) {
        setEmailError('');
      }
    };

    return (
      <Card className={cn('w-full max-w-md mx-auto p-space-lg', className)}>
        <form ref={ref} onSubmit={handleSubmit} className="space-y-space-md">
          {/* Header */}
          <div className="text-center space-y-space-xs">
            <h1 className="text-2xl font-bold text-text">Resetare parolă</h1>
            <p className="text-sm text-text-secondary">
              Introduceți adresa de email pentru a primi instrucțiunile de resetare a parolei
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div className="bg-success-50 border border-success-200 rounded-md p-space-sm">
              <p className="text-sm text-success-600">
                Am trimis instrucțiunile de resetare la adresa de email specificată. Verificați
                folderul de inbox și spam.
              </p>
            </div>
          )}

          {/* Error message */}
          {error && !success && (
            <div className="bg-error-50 border border-error-200 rounded-md p-space-sm">
              <p className="text-sm text-error-600">{error}</p>
            </div>
          )}

          {/* Form fields - only show if not successful */}
          {!success && (
            <div className="space-y-space-sm">
              <Input
                id="forgot-email"
                type="email"
                label="Adresa de email"
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                required
                autoComplete="email"
                disabled={loading}
                className="w-full"
                placeholder="exemplu@email.com"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-space-sm">
            {!success ? (
              <Button
                type="submit"
                loading={loading}
                disabled={loading || !email}
                className="w-full"
                size="lg"
              >
                Trimite instrucțiuni
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full"
                size="lg"
                variant="secondary"
              >
                Trimite din nou
              </Button>
            )}

            <Button
              type="button"
              onClick={onBackToLogin}
              disabled={loading}
              className="w-full"
              variant="ghost"
              size="lg"
            >
              {t('forgotPassword.backToLogin')}
            </Button>
          </div>

          {/* Additional help */}
          {!success && (
            <div className="text-center pt-space-sm border-t border-border">
              <p className="text-xs text-text-secondary">
                {t('forgotPassword.noEmailNote')}
              </p>
            </div>
          )}
        </form>
      </Card>
    );
  }
);

ForgotPasswordForm.displayName = 'ForgotPasswordForm';
