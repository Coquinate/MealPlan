import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

/**
 * Error Boundary specifically for cache-related operations
 * Catches errors from AI cache services and provides graceful fallback
 */
export class CacheErrorBoundary extends Component<Props, State> {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('CacheErrorBoundary caught error:', error);
      console.error('Error info:', errorInfo);
      console.error('Component stack:', errorInfo.componentStack);
    }

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Store error info for display
    this.setState({
      errorInfo,
    });

    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }

    // Check if this is a cache-specific error
    if (this.isCacheError(error)) {
      this.handleCacheError(error);
    }
  }

  /**
   * Check if the error is cache-related
   */
  private isCacheError(error: Error): boolean {
    const cacheErrorPatterns = [
      'localStorage',
      'QuotaExceededError',
      'cache',
      'storage',
      'AI cache',
      'ai-cache',
      'ai-service',
    ];

    const errorMessage = error.message.toLowerCase();
    const errorName = error.name.toLowerCase();

    return cacheErrorPatterns.some(
      (pattern) =>
        errorMessage.includes(pattern.toLowerCase()) || errorName.includes(pattern.toLowerCase())
    );
  }

  /**
   * Handle cache-specific errors
   */
  private handleCacheError(error: Error) {
    // Clear problematic cache data if quota exceeded
    if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
      this.clearCacheData();
    }

    // Attempt recovery with retry
    if (this.state.retryCount < CacheErrorBoundary.MAX_RETRIES) {
      setTimeout(
        () => {
          this.retry();
        },
        CacheErrorBoundary.RETRY_DELAY * (this.state.retryCount + 1)
      );
    }
  }

  /**
   * Clear cache data to recover from quota errors
   */
  private clearCacheData() {
    try {
      // Clear AI cache data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('ai_') || key.startsWith('cache_'))) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error(`Failed to remove cache key ${key}:`, e);
        }
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`Cleared ${keysToRemove.length} cache entries to recover from error`);
      }
    } catch (error) {
      console.error('Failed to clear cache data:', error);
    }
  }

  /**
   * Log error to monitoring service
   */
  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // TODO: Integrate with actual monitoring service (Sentry, LogRocket, etc.)
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      type: 'cache-error-boundary',
    };

    // Send to monitoring endpoint
    fetch('/api/errors/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    }).catch(() => {
      // Silently fail - don't want error logging to cause more errors
    });
  }

  /**
   * Retry rendering after error
   */
  private retry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  /**
   * Reset error boundary
   */
  public reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      // Default fallback UI
      return (
        <div className="cache-error-boundary">
          <div className="error-container p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Eroare temporară</h2>
            <p className="text-red-600 mb-4">
              {this.isCacheError(this.state.error!)
                ? 'Am întâmpinat o problemă cu cache-ul. Încercăm să remediem automat...'
                : 'Ceva nu a mers bine. Încercăm să remediem...'}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                  Detalii tehnice (doar în development)
                </summary>
                <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={this.retry}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                disabled={this.state.retryCount >= CacheErrorBoundary.MAX_RETRIES}
              >
                {this.state.retryCount >= CacheErrorBoundary.MAX_RETRIES
                  ? 'Încercări epuizate'
                  : `Încearcă din nou (${this.state.retryCount}/${CacheErrorBoundary.MAX_RETRIES})`}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Reîncarcă pagina
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for using error boundary functionality
 */
export function useCacheErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const resetError = () => setError(null);

  const handleCacheError = (error: Error) => {
    setError(error);
  };

  return { handleCacheError, resetError };
}

/**
 * Higher-order component to wrap components with cache error boundary
 */
export function withCacheErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return (props: P) => (
    <CacheErrorBoundary fallback={fallback}>
      <Component {...props} />
    </CacheErrorBoundary>
  );
}
