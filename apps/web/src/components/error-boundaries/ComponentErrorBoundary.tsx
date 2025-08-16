'use client';

import React, { Component, ReactNode } from 'react';
import { Card, Button } from '@coquinate/ui';
import { logComponentError, logError, generateRequestId } from '@coquinate/shared';

export interface Props {
  children: ReactNode;
  componentName: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  fallback?: (error: Error, errorId: string, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo, errorId: string) => void;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

/**
 * Error boundary pentru componente individuale cu raportare avansată
 * Oferă tracking granular al erorilor pentru componente specifice
 */
export class ComponentErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: generateRequestId(),
    };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`${this.props.componentName} Error Boundary caught:`, error, errorInfo);

    const errorId = this.state.errorId || generateRequestId();

    // Determină severitatea bazată pe tipul de eroare și context
    const severity = this.determineSeverity(error) || this.props.severity || 'medium';

    // Log structured error cu context specific componentei
    try {
      await logComponentError(
        error,
        {
          componentStack: errorInfo.componentStack || undefined,
        },
        this.props.componentName
      );

      // Log additional context separately for this enhanced error boundary
      await logError(error, 'frontend', severity, {
        errorBoundary: 'ComponentErrorBoundary',
        componentName: this.props.componentName,
        retryCount: this.state.retryCount,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        pathname: typeof window !== 'undefined' ? window.location.pathname : undefined,
        timestamp: new Date().toISOString(),
        errorId,
        // Context suplimentar pentru debugging
        props: this.sanitizeProps(this.props),
        state: this.sanitizeState(this.state),
      });
    } catch (loggingError) {
      console.error('Failed to log component error:', loggingError);
    }

    // Notifică handler-ul custom dacă este definit
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorId);
    }

    this.setState({
      errorInfo,
      errorId,
    });
  }

  /**
   * Determină severitatea erorilor bazat pe tipul și mesajul erorii
   */
  private determineSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' | undefined {
    const errorMessage = error.message?.toLowerCase() || '';
    const errorStack = error.stack?.toLowerCase() || '';

    // Erori critice care afectează funcționalitatea de bază
    if (
      errorMessage.includes('chunk') ||
      errorMessage.includes('script') ||
      errorMessage.includes('network') ||
      errorMessage.includes('fetch') ||
      errorStack.includes('payment') ||
      errorStack.includes('auth')
    ) {
      return 'critical';
    }

    // Erori de severitate mare
    if (
      errorMessage.includes('render') ||
      errorMessage.includes('hook') ||
      errorMessage.includes('ref') ||
      errorStack.includes('router')
    ) {
      return 'high';
    }

    // Erori de severitate medie
    if (
      errorMessage.includes('prop') ||
      errorMessage.includes('state') ||
      errorMessage.includes('context')
    ) {
      return 'medium';
    }

    return undefined; // Folosește severitatea din props
  }

  /**
   * Sanitizează props-urile pentru logging (elimină date sensibile)
   */
  private sanitizeProps(props: Props): Record<string, unknown> {
    const { children, onError, ...safeProps } = props;
    return {
      ...safeProps,
      hasChildren: !!children,
      hasOnError: !!onError,
    };
  }

  /**
   * Sanitizează state-ul pentru logging
   */
  private sanitizeState(state: State): Record<string, unknown> {
    return {
      hasError: state.hasError,
      errorId: state.errorId,
      retryCount: state.retryCount,
      hasErrorObject: !!state.error,
      hasErrorInfo: !!state.errorInfo,
    };
  }

  resetError = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError && this.state.error && this.state.errorId) {
      // Folosește fallback-ul custom dacă este definit
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorId, this.resetError);
      }

      // UI compact pentru erori de componente
      const canRetry = this.state.retryCount < this.maxRetries;
      const showDetails = this.props.showErrorDetails && process.env.NODE_ENV === 'development';

      return (
        <Card className="p-4 border-error-200 bg-error-50">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-error-600"
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
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-error-900">
                  Eroare în componenta {this.props.componentName}
                </h3>
                <p className="text-xs text-error-700">
                  {this.state.error.message || 'A apărut o eroare neașteptată'}
                </p>
              </div>
            </div>

            {/* Error details for development */}
            {showDetails && (
              <details className="text-xs">
                <summary className="cursor-pointer text-error-600 hover:text-error-800">
                  Detalii tehnice
                </summary>
                <pre className="mt-2 p-2 bg-error-100 rounded text-xs overflow-auto max-h-32">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-error-600 font-mono">ID: {this.state.errorId}</span>

              <div className="flex space-x-2">
                {canRetry && (
                  <Button
                    onClick={this.resetError}
                    size="sm"
                    variant="secondary"
                    className="text-xs"
                  >
                    Încearcă din nou{' '}
                    {this.state.retryCount > 0 &&
                      `(${this.state.retryCount + 1}/${this.maxRetries})`}
                  </Button>
                )}
                <Button
                  onClick={() => window.location.reload()}
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                >
                  Reîncarcă
                </Button>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook pentru utilizarea ComponentErrorBoundary în mod programatic
 */
export function useComponentErrorBoundary(componentName: string) {
  const [error, setError] = React.useState<Error | null>(null);
  const [errorId, setErrorId] = React.useState<string | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
    setErrorId(null);
  }, []);

  const captureError = React.useCallback(
    async (error: Error, additionalContext?: Record<string, unknown>) => {
      const newErrorId = generateRequestId();
      setError(error);
      setErrorId(newErrorId);

      try {
        await logComponentError(error, {}, componentName);

        // Log additional context separately
        await logError(error, 'frontend', 'medium', {
          errorBoundary: 'useComponentErrorBoundary',
          componentName,
          errorId: newErrorId,
          timestamp: new Date().toISOString(),
          ...additionalContext,
        });
      } catch (loggingError) {
        console.error('Failed to log error via hook:', loggingError);
      }
    },
    [componentName]
  );

  return {
    error,
    errorId,
    resetError,
    captureError,
    hasError: !!error,
  };
}
