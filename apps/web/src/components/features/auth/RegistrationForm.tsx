'use client';

import React, { useState } from 'react';
import { Button, Input, Select, Card, cn } from '@coquinate/ui';
import { useTranslation } from '@coquinate/i18n';
import { authLogger } from '@/lib/logger';

export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  household_size: number;
  menu_type: 'vegetarian' | 'omnivore';
  default_view_preference?: 'RO' | 'EN';
}

export interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => Promise<void>;
  onBackToLogin: () => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

/**
 * Registration form with household size and menu type selection
 * Implements Romanian translations and comprehensive validation
 */
export const RegistrationForm = React.forwardRef<HTMLFormElement, RegistrationFormProps>(
  ({ onSubmit, onBackToLogin, loading = false, error, className }, ref) => {
    const { t } = useTranslation('auth');
    const [formData, setFormData] = useState<RegistrationData>({
      email: '',
      password: '',
      confirmPassword: '',
      household_size: 2,
      menu_type: 'omnivore',
      default_view_preference: 'RO',
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Household size options (1-6 members)
    const householdOptions = Array.from({ length: 6 }, (_, i) => ({
      value: (i + 1).toString(),
      label: i === 0 ? '1 persoană' : `${i + 1} persoane`,
    }));

    // Menu type options
    const menuTypeOptions = [
      { value: 'omnivore', label: 'Omnivore (incluzând carne)' },
      { value: 'vegetarian', label: 'Vegetarian (fără carne)' },
    ];

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

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirmarea parolei este obligatorie';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = t('errors.passwordMismatch');
      }

      if (!formData.household_size || formData.household_size < 1 || formData.household_size > 6) {
        errors.household_size = 'Mărimea gospodăriei trebuie să fie între 1 și 6';
      }

      if (!formData.menu_type || !['vegetarian', 'omnivore'].includes(formData.menu_type)) {
        errors.menu_type = 'Tipul meniului este obligatoriu';
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
        authLogger.error('Registration error', error instanceof Error ? error : new Error(String(error)));
      }
    };

    const handleInputChange =
      (field: keyof RegistrationData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
          setFieldErrors((prev) => ({ ...prev, [field]: '' }));
        }
      };

    const handleSelectChange = (field: keyof RegistrationData) => (value: string) => {
      const parsedValue = field === 'household_size' ? parseInt(value, 10) : value;
      setFormData((prev) => ({ ...prev, [field]: parsedValue }));
      // Clear field error when user selects
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: '' }));
      }
    };

    return (
      <Card className={cn('w-full max-w-md mx-auto p-space-lg', className)}>
        <form ref={ref} onSubmit={handleSubmit} className="space-y-space-md">
          {/* Header */}
          <div className="text-center space-y-space-xs">
            <h1 className="text-2xl font-bold text-text">{t('register.title')}</h1>
          </div>

          {/* Global error message */}
          {error && (
            <div
              className="bg-error-50 border border-error-200 rounded-md p-space-sm"
              data-testid="registration-error-message"
            >
              <p className="text-sm text-error-600">
                {error === 'email_exists'
                  ? t('errors.emailExists')
                  : error === 'registration_failed'
                    ? t('errors.registrationFailed')
                    : error === 'validation_error'
                      ? t('errors.registrationFailed')
                      : error}
              </p>
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-space-sm">
            {/* Email */}
            <Input
              id="register-email"
              type="email"
              label={t('register.email')}
              value={formData.email}
              onChange={handleInputChange('email')}
              error={fieldErrors.email}
              required
              autoComplete="email"
              disabled={loading}
              className="w-full"
            />

            {/* Password */}
            <Input
              id="register-password"
              type="password"
              label={t('register.password')}
              value={formData.password}
              onChange={handleInputChange('password')}
              error={fieldErrors.password}
              required
              autoComplete="new-password"
              disabled={loading}
              className="w-full"
              helperText="Minimum 8 caractere"
            />

            {/* Confirm Password */}
            <Input
              id="confirm-password"
              type="password"
              label={t('register.confirmPassword')}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={fieldErrors.confirmPassword}
              required
              autoComplete="new-password"
              disabled={loading}
              className="w-full"
            />

            {/* Household Size */}
            <div className="space-y-space-xs">
              <label htmlFor="household-size" className="text-sm font-medium text-text">
                Mărimea gospodăriei <span className="text-error ml-1">*</span>
              </label>
              <Select
                options={householdOptions}
                value={formData.household_size.toString()}
                onChange={handleSelectChange('household_size')}
                disabled={loading}
                placeholder="Selectează mărimea gospodăriei"
                data-testid="household-size-select"
              />
              {fieldErrors.household_size && (
                <p className="text-sm text-error">{fieldErrors.household_size}</p>
              )}
              <p className="text-sm text-text-secondary">
                Pentru câte persoane vrei să planifici mesele?
              </p>
            </div>

            {/* Menu Type */}
            <div className="space-y-space-xs">
              <label htmlFor="menu-type" className="text-sm font-medium text-text">
                Tipul de meniu <span className="text-error ml-1">*</span>
              </label>
              <Select
                options={menuTypeOptions}
                value={formData.menu_type}
                onChange={handleSelectChange('menu_type')}
                disabled={loading}
                placeholder="Selectează tipul de meniu"
                data-testid="menu-type-select"
              />
              {fieldErrors.menu_type && (
                <p className="text-sm text-error">{fieldErrors.menu_type}</p>
              )}
              <p className="text-sm text-text-secondary">
                Ajută-ne să îți recomandăm rețetele potrivite
              </p>
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="w-full"
            size="lg"
            data-testid="registration-submit-button"
          >
            {t('register.submit')}
          </Button>

          {/* Back to login link */}
          <div className="text-center pt-space-sm border-t border-border">
            <p className="text-sm text-text-secondary">
              {t('register.hasAccount')}{' '}
              <button
                type="button"
                onClick={onBackToLogin}
                disabled={loading}
                className="text-primary hover:text-primary-600 hover:underline font-medium focus:outline-none focus:underline disabled:opacity-50"
                data-testid="back-to-login-link"
              >
                {t('register.backToLogin')}
              </button>
            </p>
          </div>
        </form>
      </Card>
    );
  }
);

RegistrationForm.displayName = 'RegistrationForm';
