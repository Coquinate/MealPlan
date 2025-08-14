'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PasswordResetForm } from '@/components/features/auth/PasswordResetForm';
import { useAuth } from '@coquinate/shared';
import { useTranslation } from '@coquinate/i18n';
import { Button, Card } from '@coquinate/ui';

interface PasswordResetData {
  newPassword: string;
  confirmPassword: string;
}

/**
 * Password reset confirmation page
 * Handles password update after user clicks reset link in email
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const { updatePassword, isAuthenticated, isInitialized, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  // Check for reset token in URL
  useEffect(() => {
    // Supabase includes the token in the URL hash
    const hash = window.location.hash;

    if (!hash || !hash.includes('type=recovery')) {
      // No valid reset token found
      setTokenError(true);
    }
  }, []);

  // Redirect if already authenticated (unless they're resetting password while logged in)
  useEffect(() => {
    if (isInitialized && isAuthenticated && !window.location.hash.includes('type=recovery')) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Handle password reset submission
  const handlePasswordReset = async (data: PasswordResetData) => {
    try {
      setLoading(true);
      clearError();
      await updatePassword(data.newPassword);

      // Password reset successful
      setResetSuccess(true);
      setLoading(false); // Make sure to clear loading on success

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset failed:', error);
      // Error is already set in the store by updatePassword
      setLoading(false); // Also clear loading on error
    }
  };

  // Handle navigation back to login
  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  // Show error if no valid token
  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Brand */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">Coquinate</h1>
            <p className="text-sm text-text-secondary">Planificarea meselor făcută simplu</p>
          </div>

          {/* Error Message */}
          <Card className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error-100">
                <svg
                  className="h-6 w-6 text-error-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-text">Link invalid sau expirat</h2>

              <p className="text-sm text-text-secondary">
                Linkul de resetare a parolei este invalid sau a expirat. Vă rugăm să solicitați un
                nou link de resetare.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => router.push('/auth/forgot-password')}
                className="w-full"
                size="lg"
              >
                Solicită un nou link
              </Button>

              <Button onClick={handleBackToLogin} variant="ghost" className="w-full" size="lg">
                Înapoi la autentificare
              </Button>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center text-xs text-text-secondary">
            <p>© 2025 Coquinate. Toate drepturile rezervate.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Coquinate</h1>
          <p className="text-sm text-text-secondary">Planificarea meselor făcută simplu</p>
        </div>

        {/* Password Reset Form */}
        <PasswordResetForm
          onSubmit={handlePasswordReset}
          onBackToLogin={handleBackToLogin}
          loading={loading}
          error={error || undefined}
          success={resetSuccess}
        />

        {/* Footer */}
        <div className="text-center text-xs text-text-secondary">
          <p>© 2025 Coquinate. Toate drepturile rezervate.</p>
        </div>
      </div>
    </div>
  );
}
