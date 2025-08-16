'use client';

import React, { Component, ReactNode } from 'react';
import { Card, Button } from '@coquinate/ui';
import { AuthError } from '@supabase/supabase-js';
import { logComponentError, logError, generateRequestId } from '@coquinate/shared';

export interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
}

/**
 * Error boundary component for authentication-related errors
 * Catches and displays user-friendly error messages
 */
export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: generateRequestId(),
    };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth Error Boundary caught:', error, errorInfo);

    // Report to error tracking service if configured
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log structured error with auth-specific context
    try {
      await logComponentError(
        error,
        {
          componentStack: errorInfo.componentStack || undefined,
        },
        'AuthErrorBoundary'
      );

      // Log additional auth-specific context
      await logError(error, 'auth', 'high', {
        errorBoundary: 'AuthErrorBoundary',
        authContext: true,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        timestamp: new Date().toISOString(),
        errorId: this.state.errorId,
        // Add auth-specific context
        isAuthError: error.name === 'AuthError' || error.message?.includes('auth'),
        authErrorStatus: error.name === 'AuthError' ? (error as AuthError).status : undefined,
      });
    } catch (loggingError) {
      console.error('Failed to log auth error boundary failure:', loggingError);
    }

    this.setState({
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  getErrorMessage(error: Error): string {
    // Check if it's a Supabase AuthError
    if (error.name === 'AuthError' || error.message?.includes('auth')) {
      const authError = error as AuthError;

      // Map common auth errors to user-friendly messages in Romanian
      const errorMap: Record<string, string> = {
        'Invalid login credentials': 'Email sau parolă incorectă',
        'Email not confirmed': 'Vă rugăm să confirmați adresa de email',
        'User not found': 'Nu există un cont cu această adresă de email',
        'Invalid email': 'Adresă de email invalidă',
        'Signup disabled': 'Înregistrarea este dezactivată momentan',
        'User already registered': 'Există deja un cont cu această adresă de email',
        'Password should be at least': 'Parola trebuie să aibă cel puțin 8 caractere',
        'Network request failed': 'Eroare de conexiune. Verificați conexiunea la internet',
        'Too many requests': 'Prea multe încercări. Vă rugăm să așteptați',
        'Session expired': 'Sesiunea a expirat. Vă rugăm să vă autentificați din nou',
        'Invalid token': 'Token invalid. Vă rugăm să solicitați un nou link',
        'Token expired': 'Link-ul a expirat. Vă rugăm să solicitați unul nou',
      };

      // Check for known error messages
      for (const [key, value] of Object.entries(errorMap)) {
        if (authError.message?.toLowerCase().includes(key.toLowerCase())) {
          return value;
        }
      }

      // Check status codes
      if (authError.status === 400) {
        return 'Cerere invalidă. Vă rugăm să verificați datele introduse';
      } else if (authError.status === 401) {
        return 'Nu sunteți autorizat. Vă rugăm să vă autentificați';
      } else if (authError.status === 403) {
        return 'Acces interzis';
      } else if (authError.status === 404) {
        return 'Resursa solicitată nu a fost găsită';
      } else if (authError.status === 429) {
        return 'Prea multe încercări. Vă rugăm să așteptați câteva minute';
      } else if (authError.status && authError.status >= 500) {
        return 'Eroare de server. Vă rugăm să încercați mai târziu';
      }

      // Return original message if no mapping found
      return authError.message || 'A apărut o eroare neașteptată';
    }

    // Generic error
    return error.message || 'A apărut o eroare neașteptată';
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default error UI
      const errorMessage = this.getErrorMessage(this.state.error);
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="text-center space-y-2">
              {/* Error Icon */}
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

              {/* Error Title */}
              <h2 className="text-xl font-semibold text-text">Oops! Ceva nu a mers bine</h2>

              {/* Error Message */}
              <p className="text-sm text-text-secondary">{errorMessage}</p>

              {/* Error ID for support */}
              {this.state.errorId && (
                <p className="text-xs text-text-tertiary mt-2 font-mono">
                  ID eroare: {this.state.errorId}
                </p>
              )}

              {/* Development Error Details */}
              {isDevelopment && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-xs text-text-secondary hover:text-text">
                    Detalii tehnice (doar în development)
                  </summary>
                  <pre className="mt-2 p-2 bg-surface-subtle rounded text-xs overflow-auto max-h-48">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button onClick={this.resetError} className="w-full" size="lg">
                Încearcă din nou
              </Button>

              <Button
                onClick={() => (window.location.href = '/')}
                variant="ghost"
                className="w-full"
                size="lg"
              >
                Mergi la pagina principală
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook to use error boundary functionality
 */
export function useAuthErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    console.error('Auth error captured:', error);
    setError(error);
  }, []);

  // Reset error on mount
  React.useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  return {
    error,
    resetError,
    captureError,
    hasError: !!error,
  };
}
