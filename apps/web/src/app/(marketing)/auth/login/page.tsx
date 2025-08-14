'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { useAuth } from '@coquinate/shared';
import { useTranslation } from '@coquinate/i18n';

/**
 * Login page component
 * Handles user authentication with email/password
 */
export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const { signIn, isAuthenticated, isInitialized, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    console.log('Login page - Auth state:', { isInitialized, isAuthenticated });
    if (isInitialized && isAuthenticated) {
      console.log('User authenticated, redirecting to dashboard...');
      // Check for redirect URL in search params
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');
      router.push(redirect || '/dashboard');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Handle login submission
  const handleLogin = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    clearError();
    await signIn(credentials);
    setLoading(false);
    // Error handling is done in the signIn function
    // Redirect will happen via useEffect when isAuthenticated changes
  };

  // Handle navigation
  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleCreateAccount = () => {
    router.push('/auth/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-surface px-space-sm py-space-xl sm:px-space-md lg:px-space-lg">
      <div className="w-full max-w-md space-y-space-2xl">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-heading-3xl font-bold text-primary mb-space-xs">Coquinate</h1>
          <p className="text-sm text-text-secondary">Planificarea meselor făcută simplu</p>
        </div>

        {/* Login Form */}
        <LoginForm
          onSubmit={handleLogin}
          onForgotPassword={handleForgotPassword}
          onCreateAccount={handleCreateAccount}
          loading={loading}
          error={error || undefined}
        />

        {/* Footer */}
        <div className="text-center text-xs text-text-secondary pt-space-lg">
          <p>© 2025 Coquinate. Toate drepturile rezervate.</p>
        </div>
      </div>
    </div>
  );
}
