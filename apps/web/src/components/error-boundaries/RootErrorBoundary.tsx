'use client';

import React from 'react';
import { Button, Card } from '@coquinate/ui';
import { logComponentError, generateRequestId } from '@coquinate/shared';
import { withTranslation, WithTranslation } from 'react-i18next';

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

interface ErrorBoundaryProps extends WithTranslation {
  children: React.ReactNode;
}

/**
 * Root Error Boundary
 *
 * App-wide error catching and recovery for unhandled React errors
 * Displays user-friendly error message in Romanian with recovery options
 */
class RootErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Generate unique error ID for tracking
    const errorId = generateRequestId();

    // Update state to render the error UI
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('RootErrorBoundary caught an error:', error, errorInfo);

    // Log structured error with immediate alerts for critical boundary failures
    try {
      await logComponentError(
        error,
        {
          componentStack: errorInfo.componentStack || undefined,
        },
        'RootErrorBoundary'
      );
    } catch (loggingError) {
      console.error('Failed to log error boundary failure:', loggingError);
    }
  }

  handleReset = () => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: undefined, errorId: undefined });
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
    const { t } = this.props;
    
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
                  <h1 className="text-xl font-bold text-text mb-2">{t('error.boundary.title')}</h1>
                  <p className="text-text-secondary">
                    {t('error.boundary.description')}
                  </p>
                  {this.state.errorId && (
                    <p className="text-xs text-text-tertiary mt-2 font-mono">
                      {t('error.boundary.errorId')}: {this.state.errorId}
                    </p>
                  )}
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
                  {t('error.boundary.tryAgain')}
                </Button>

                <div className="flex space-x-3">
                  <Button onClick={this.handleReload} variant="secondary" className="flex-1">
                    {t('error.boundary.reloadPage')}
                  </Button>

                  <Button onClick={this.handleGoHome} variant="secondary" className="flex-1">
                    {t('error.boundary.goHome')}
                  </Button>
                </div>
              </div>

              <div className="text-xs text-text-secondary">
                <p>
                  {t('error.boundary.persistMessage')}{' '}
                  <a href="mailto:support@coquinate.com" className="text-primary hover:underline">
                    support@coquinate.com
                  </a>
                  {this.state.errorId && (
                    <span>
                      {' '}
                      {t('error.boundary.mentionId')}:{' '}
                      <code className="font-mono">{this.state.errorId}</code>
                    </span>
                  )}
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

export const RootErrorBoundary = withTranslation('common')(RootErrorBoundaryClass);
