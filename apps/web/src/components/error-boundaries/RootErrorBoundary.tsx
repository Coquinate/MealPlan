'use client';

import React from 'react';
import { Button, Card } from '@coquinate/ui';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Root Error Boundary
 *
 * App-wide error catching and recovery for unhandled React errors
 * Displays user-friendly error message in Romanian with recovery options
 */
export class RootErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to render the error UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('RootErrorBoundary caught an error:', error, errorInfo);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (e.g., Sentry)
      console.error('Production error logged:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleReset = () => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: undefined });
  };

  handleReload = () => {
    // Reload the entire page
    window.location.reload();
  };

  handleGoHome = () => {
    // Navigate to home page
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-surface flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="p-8 text-center space-y-6">
              <div className="space-y-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-error-100">
                  <svg
                    className="h-8 w-8 text-error-600"
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

                <div>
                  <h1 className="text-xl font-bold text-text mb-2">Ceva nu a mers bine</h1>
                  <p className="text-text-secondary">
                    Ne pare rău pentru inconvenient. A apărut o problemă neașteptată.
                  </p>
                </div>

                {/* Error details for development */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="text-left bg-surface-elevated p-4 rounded-md">
                    <p className="text-xs font-mono text-error-600 break-all">
                      {this.state.error.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button onClick={this.handleReset} className="w-full" size="lg">
                  Încearcă din nou
                </Button>

                <div className="flex space-x-3">
                  <Button onClick={this.handleReload} variant="secondary" className="flex-1">
                    Reîncarcă pagina
                  </Button>

                  <Button onClick={this.handleGoHome} variant="secondary" className="flex-1">
                    Înapoi acasă
                  </Button>
                </div>
              </div>

              <div className="text-xs text-text-secondary">
                <p>
                  Dacă problema persistă, contactează suportul la{' '}
                  <a href="mailto:support@coquinate.com" className="text-primary hover:underline">
                    support@coquinate.com
                  </a>
                </p>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
