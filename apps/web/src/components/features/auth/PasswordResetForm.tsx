'use client';

import React, { useState } from 'react';
import { Button, Input, Card, cn } from '@coquinate/ui';
import { useTranslation } from '@coquinate/i18n';

export interface PasswordResetData {
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetFormProps {
  onSubmit: (data: PasswordResetData) => Promise<void>;
  onBackToLogin: () => void;
  loading?: boolean;
  error?: string;
  success?: boolean;
  className?: string;
}

/**
 * Password reset confirmation form component
 * Used when user clicks the reset link from email
 */
export const PasswordResetForm = React.forwardRef<HTMLFormElement, PasswordResetFormProps>(
  ({ onSubmit, onBackToLogin, loading = false, error, success = false, className }, ref) => {
    const { t } = useTranslation('auth');
    const [formData, setFormData] = useState<PasswordResetData>({
      newPassword: '',
      confirmPassword: '',
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
      const errors: Record<string, string> = {};

      if (!formData.newPassword) {
        errors.newPassword = 'Parola nouă este obligatorie';
      } else if (formData.newPassword.length < 8) {
        errors.newPassword = t('errors.passwordTooShort');
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirmarea parolei este obligatorie';
      } else if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = t('errors.passwordMismatch');
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
        console.error('Password reset error:', error);
      }
    };

    const handleInputChange =
      (field: keyof PasswordResetData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
          setFieldErrors((prev) => ({ ...prev, [field]: '' }));
        }
      };

    const getPasswordStrength = (password: string) => {
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      return strength;
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);
    const strengthLabels = ['Foarte slabă', 'Slabă', 'Acceptabilă', 'Bună', 'Foarte bună'];
    const strengthColors = [
      'text-error-500',
      'text-orange-500',
      'text-yellow-500',
      'text-success-500',
      'text-success-600',
    ];

    return (
      <Card className={cn('w-full max-w-md mx-auto p-space-lg', className)}>
        <form ref={ref} onSubmit={handleSubmit} className="space-y-space-md">
          {/* Header */}
          <div className="text-center space-y-space-xs">
            <h1 className="text-2xl font-bold text-text">Parolă nouă</h1>
            <p className="text-sm text-text-secondary">
              Creați o parolă nouă și securizată pentru contul dumneavoastră
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div className="bg-success-50 border border-success-200 rounded-md p-space-sm">
              <p className="text-sm text-success-600">
                Parola a fost schimbată cu succes! Vă puteți autentifica cu noua parolă.
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
              {/* New Password */}
              <div className="space-y-space-xs">
                <Input
                  id="new-password"
                  type="password"
                  label="Parola nouă"
                  value={formData.newPassword}
                  onChange={handleInputChange('newPassword')}
                  error={fieldErrors.newPassword}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full"
                />

                {/* Password strength indicator */}
                {formData.newPassword && (
                  <div className="space-y-space-xs">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            'h-1 flex-1 rounded-full',
                            passwordStrength >= level
                              ? strengthColors[passwordStrength - 1]
                                ? strengthColors[passwordStrength - 1].replace('text-', 'bg-')
                                : 'bg-gray-200'
                              : 'bg-gray-200'
                          )}
                        />
                      ))}
                    </div>
                    <p
                      className={cn(
                        'text-xs',
                        strengthColors[passwordStrength - 1] || 'text-gray-400'
                      )}
                    >
                      Puterea parolei: {strengthLabels[passwordStrength - 1] || 'Foarte slabă'}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <Input
                id="confirm-new-password"
                type="password"
                label="Confirmă parola nouă"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={fieldErrors.confirmPassword}
                required
                autoComplete="new-password"
                disabled={loading}
                className="w-full"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-space-sm">
            {!success ? (
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                Schimbă parola
              </Button>
            ) : (
              <Button type="button" onClick={onBackToLogin} className="w-full" size="lg">
                Mergi la autentificare
              </Button>
            )}

            {!success && (
              <Button
                type="button"
                onClick={onBackToLogin}
                disabled={loading}
                className="w-full"
                variant="ghost"
                size="lg"
              >
                Anulează
              </Button>
            )}
          </div>

          {/* Password requirements */}
          {!success && (
            <div className="text-xs text-text-secondary bg-surface-subtle p-space-sm rounded-md">
              <p className="font-medium mb-1">Parola trebuie să conțină:</p>
              <ul className="space-y-0.5 ml-space-sm">
                <li
                  className={cn(
                    formData.newPassword.length >= 8 ? 'text-success-600' : 'text-text-secondary'
                  )}
                >
                  • Cel puțin 8 caractere
                </li>
                <li
                  className={cn(
                    /[A-Z]/.test(formData.newPassword) ? 'text-success-600' : 'text-text-secondary'
                  )}
                >
                  • O literă mare
                </li>
                <li
                  className={cn(
                    /[a-z]/.test(formData.newPassword) ? 'text-success-600' : 'text-text-secondary'
                  )}
                >
                  • O literă mică
                </li>
                <li
                  className={cn(
                    /[0-9]/.test(formData.newPassword) ? 'text-success-600' : 'text-text-secondary'
                  )}
                >
                  • O cifră
                </li>
                <li
                  className={cn(
                    /[^A-Za-z0-9]/.test(formData.newPassword)
                      ? 'text-success-600'
                      : 'text-text-secondary'
                  )}
                >
                  • Un caracter special
                </li>
              </ul>
            </div>
          )}
        </form>
      </Card>
    );
  }
);

PasswordResetForm.displayName = 'PasswordResetForm';
