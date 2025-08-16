/**
 * Structured Error Logging Utility
 * Provides comprehensive error tracking with context for monitoring
 */

export interface ErrorContext {
  timestamp: string;
  userId?: string;
  sessionId?: string;
  route?: string;
  userAgent?: string;
  errorMessage: string;
  errorStack?: string;
  additionalContext?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'frontend' | 'backend' | 'payment' | 'auth' | 'database';
}

export interface LoggingConfig {
  enableLogging: boolean;
  environment: 'development' | 'staging' | 'production';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  sanitizeData: boolean;
}

/**
 * Sanitizes sensitive data from error context
 */
function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = [
    'password',
    'token',
    'apikey',
    'secret',
    'auth',
    'authorization',
    'email',
    'phone',
    'cardnumber',
    'cvv',
    'ssn',
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context)) {
    const keyLower = key.toLowerCase();
    const isSensitive = sensitiveKeys.some((sensitive) => keyLower.includes(sensitive));

    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeContext(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Creates structured error context
 */
export function createErrorContext(
  error: Error | string,
  category: ErrorContext['category'],
  severity: ErrorContext['severity'] = 'medium',
  additionalContext?: Record<string, unknown>
): ErrorContext {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Get browser/server context if available
  const isClient = typeof window !== 'undefined';
  const route = isClient ? window.location.pathname : undefined;
  const userAgent = isClient ? navigator.userAgent : undefined;

  return {
    timestamp: new Date().toISOString(),
    route,
    userAgent,
    errorMessage,
    errorStack,
    additionalContext: additionalContext ? sanitizeContext(additionalContext) : undefined,
    severity,
    category,
  };
}

/**
 * Logs structured error to console (development) or external service (production)
 */
export async function logError(
  error: Error | string,
  category: ErrorContext['category'],
  severity: ErrorContext['severity'] = 'medium',
  additionalContext?: Record<string, unknown>,
  config?: Partial<LoggingConfig>
): Promise<void> {
  const defaultConfig: LoggingConfig = {
    enableLogging: true,
    environment: (process.env.NODE_ENV as LoggingConfig['environment']) || 'development',
    logLevel: 'error',
    sanitizeData: true,
  };

  const finalConfig = { ...defaultConfig, ...config };

  if (!finalConfig.enableLogging) {
    return;
  }

  const errorContext = createErrorContext(error, category, severity, additionalContext);

  // Development logging
  if (finalConfig.environment === 'development') {
    console.error('🔴 Log Eroare Structurată:', {
      ...errorContext,
      rawError: error,
    });
    return;
  }

  // Production logging with admin dashboard integration
  console.error('Eroare Structurată:', errorContext);

  // În browser, trimite către API-ul admin pentru dashboard (fire-and-forget pentru performanță)
  if (typeof window !== 'undefined') {
    // Fire-and-forget API call to avoid blocking main execution
    fetch('/api/admin/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'dev-key'}`,
      },
      body: JSON.stringify({
        id: `error_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        timestamp: errorContext.timestamp,
        severity: errorContext.severity,
        category: errorContext.category,
        errorMessage: errorContext.errorMessage,
        userId: errorContext.userId,
        route: errorContext.route,
        resolved: false,
        context: errorContext.additionalContext,
      }),
    }).catch((apiError) => {
      // Fallback: doar log în consolă dacă API-ul eșuează
      console.error('Eșec la trimiterea erorii către API-ul admin:', apiError);
    });
  }
}

/**
 * Logs Romanian/English context errors
 */
export async function logBilingualError(
  error: Error | string,
  romanianContext: string,
  englishContext: string,
  category: ErrorContext['category'],
  severity: ErrorContext['severity'] = 'medium'
): Promise<void> {
  await logError(error, category, severity, {
    romanianContext,
    englishContext,
    locale: 'ro_RO',
  });
}

/**
 * Creates request ID for error correlation
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Error boundary helper for React components
 */
export function logComponentError(
  error: Error,
  errorInfo: { componentStack?: string },
  componentName?: string
): Promise<void> {
  return logError(error, 'frontend', 'high', {
    componentName,
    componentStack: errorInfo.componentStack,
    errorBoundary: true,
  });
}
