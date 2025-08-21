'use client';

import React, { useState } from 'react';
import { Button, Input, Card, cn } from '@coquinate/ui';
import { useTranslation } from '@coquinate/i18n';
import { authLogger } from '@/lib/logger';

export interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

/**
 * Login form component using shadcn/ui form components
 * Implements Romanian translations and proper error handling
 */
export const LoginForm = React.forwardRef<HTMLFormElement, LoginFormProps>(
  ({ onSubmit, onForgotPassword, onCreateAccount, loading = false, error, className }, ref) => {
    const { t } = useTranslation('auth');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
      const errors: Record<string, string> = {};

      if (!formData.email) {
        errors.email = t('errors.emailRequired');
      } else if (!formData.email.includes('@')) {
        errors.email = 'Email invalid';
      }

      if (!formData.password) {
        errors.password = t('errors.passwordRequired');
      } else if (formData.password.length < 8) {
        errors.password = t('errors.passwordTooShort');
      }

      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        await onSubmit(formData);
      } catch (error) {
        // Error handling is managed by parent component
        authLogger.error('Login error', error instanceof Error ? error : new Error(String(error)));
      }
    };

    const handleInputChange =
      (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
          setFieldErrors((prev) => ({ ...prev, [field]: '' }));
        }
      };

    return (
      <Card className={cn('w-full max-w-md mx-auto p-space-lg', className)}>
        <form ref={ref} onSubmit={handleSubmit} className="space-y-space-md">
          {/* Header */}
          <div className="text-center space-y-space-xs">
            <h1 className="text-heading-2xl font-bold text-text">{t('login.title')}</h1>
          </div>

          {/* Global error message */}
          {error && (
            <div
              className="bg-error-50 border border-error-200 rounded-md p-space-sm"
              data-testid="login-error-message"
            >
              <p className="text-sm text-error-600">
                {error === 'Invalid login credentials'
                  ? t('errors.invalidCredentials')
                  : error === 'login_failed'
                    ? t('errors.loginFailed')
                    : error}
              </p>
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-space-sm">
            <Input
              id="email"
              type="email"
              label={t('login.email')}
              value={formData.email}
              onChange={handleInputChange('email')}
              error={fieldErrors.email}
              required
              autoComplete="email"
              disabled={loading}
              className="w-full"
            />

            <Input
              id="password"
              type="password"
              label={t('login.password')}
              value={formData.password}
              onChange={handleInputChange('password')}
              error={fieldErrors.password}
              required
              autoComplete="current-password"
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="w-full"
            size="lg"
            data-testid="login-submit-button"
          >
            {t('login.submit')}
          </Button>

          {/* Forgot password link */}
          <div className="text-center">
            <button
              type="button"
              onClick={onForgotPassword}
              disabled={loading}
              className="text-sm text-primary hover:text-primary-600 hover:underline focus:outline-none focus:underline disabled:opacity-50"
              data-testid="forgot-password-link"
            >
              {t('login.forgotPassword')}
            </button>
          </div>

          {/* Create account link */}
          <div className="text-center pt-space-sm border-t border-border">
            <p className="text-sm text-text-secondary">
              {t('login.noAccount')}{' '}
              <button
                type="button"
                onClick={onCreateAccount}
                disabled={loading}
                className="text-primary hover:text-primary-600 hover:underline font-medium focus:outline-none focus:underline disabled:opacity-50"
                data-testid="create-account-link"
              >
                {t('login.createAccount')}
              </button>
            </p>
          </div>
        </form>
      </Card>
    );
  }
);

LoginForm.displayName = 'LoginForm';
