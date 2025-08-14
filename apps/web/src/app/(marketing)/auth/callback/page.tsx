'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@coquinate/ui';

/**
 * OAuth callback handler page
 * Processes OAuth responses from providers like Google
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // The Supabase client handles the OAuth callback automatically
    // Check for errors in the URL
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));

    const error = params.get('error');
    const errorDescription = params.get('error_description');

    if (error) {
      setError(errorDescription || 'Authentication failed');
      // Redirect to login after showing error
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } else {
      // Success - redirect to dashboard
      // The auth state change will be picked up by the auth store
      router.push('/dashboard');
    }
  }, [router]);

  if (error) {
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-text">Autentificare eșuată</h2>

              <p className="text-sm text-text-secondary">{error}</p>

              <p className="text-xs text-text-secondary">
                Veți fi redirecționat la pagina de autentificare...
              </p>
            </div>
          </Card>
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

        {/* Loading Message */}
        <Card className="p-6 space-y-4">
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>

            <h2 className="text-xl font-semibold text-text">Procesare autentificare...</h2>

            <p className="text-sm text-text-secondary">Vă rugăm așteptați câteva momente.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
