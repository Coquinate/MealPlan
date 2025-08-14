'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  RegistrationForm,
  type RegistrationData,
} from '@/components/features/auth/RegistrationForm';
import { useAuth, type RegisterData } from '@coquinate/shared';
import { useTranslation } from '@coquinate/i18n';
import { Button } from '@coquinate/ui';

/**
 * Registration page component
 * Handles new user account creation with household preferences
 */
export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const { signUp, isAuthenticated, isInitialized, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Handle registration submission
  const handleRegister = async (data: RegistrationData) => {
    try {
      setLoading(true);
      clearError();
      // Remove confirmPassword before sending to signUp
      const { confirmPassword, ...registerData } = data;
      await signUp(registerData as RegisterData);

      // Registration successful - show success message
      setRegistrationSuccess(true);
      setRegisteredEmail(data.email);
    } catch (error) {
      console.error('Registration failed:', error);
      // Error is already set in the store by signUp
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation back to login
  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  // If registration was successful, show success message
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Brand */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">Coquinate</h1>
            <p className="text-sm text-text-secondary">Planificarea meselor făcută simplu</p>
          </div>

          {/* Success Message */}
          <div className="bg-surface-elevated rounded-lg border border-border p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-100">
                <svg
                  className="h-6 w-6 text-success-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-text">Cont creat cu succes!</h2>

              <p className="text-sm text-text-secondary">
                Am trimis un email de verificare la adresa:
              </p>

              <p className="text-sm font-medium text-text">{registeredEmail}</p>

              <p className="text-xs text-text-secondary pt-2">
                Verificați inbox-ul și folderul de spam pentru emailul de confirmare. După
                verificare, vă puteți autentifica cu contul nou.
              </p>
            </div>

            <div className="space-y-2">
              <Button onClick={handleBackToLogin} className="w-full" size="lg">
                Mergi la autentificare
              </Button>

              <button
                onClick={() => setRegistrationSuccess(false)}
                className="w-full text-sm text-primary hover:text-primary-600 hover:underline"
              >
                Creează alt cont
              </button>
            </div>
          </div>

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

        {/* Registration Form */}
        <RegistrationForm
          onSubmit={handleRegister}
          onBackToLogin={handleBackToLogin}
          loading={loading}
          error={error || undefined}
        />

        {/* Footer */}
        <div className="text-center text-xs text-text-secondary">
          <p>© 2025 Coquinate. Toate drepturile rezervate.</p>
        </div>
      </div>
    </div>
  );
}
