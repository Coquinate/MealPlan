'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ForgotPasswordForm } from '@/components/features/auth/ForgotPasswordForm';
import { useAuth } from '@coquinate/shared';
import { useTranslation } from '@coquinate/i18n';

/**
 * Forgot password page component
 * Handles password reset request flow
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const { resetPassword, isAuthenticated, isInitialized, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Handle password reset request
  const handleResetRequest = async (email: string) => {
    try {
      setLoading(true);
      clearError();
      await resetPassword(email);

      // Show success message
      setResetSuccess(true);
    } catch (error) {
      console.error('Password reset request failed:', error);
      // Error is already set in the store by resetPassword
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation back to login
  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Coquinate</h1>
          <p className="text-sm text-text-secondary">Planificarea meselor făcută simplu</p>
        </div>

        {/* Forgot Password Form */}
        <ForgotPasswordForm
          onSubmit={handleResetRequest}
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
