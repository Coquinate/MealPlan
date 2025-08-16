/**
 * Monitoring utility for Supabase Edge Functions
 * Provides structured logging and error tracking for server-side operations
 */

export interface EdgeFunctionErrorContext {
  timestamp: string;
  functionName: string;
  requestId: string;
  userId?: string;
  errorMessage: string;
  errorStack?: string;
  requestData?: Record<string, unknown>;
  responseStatus?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'auth' | 'payment' | 'database' | 'external_api' | 'validation';
}

/**
 * Sanitizes sensitive data from request context
 */
function sanitizeRequestData(data: Record<string, unknown>): Record<string, unknown> {
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
    'stripe',
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const keyLower = key.toLowerCase();
    const isSensitive = sensitiveKeys.some((sensitive) => keyLower.includes(sensitive));

    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeRequestData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Generates unique request ID for error correlation
 */
export function generateEdgeRequestId(): string {
  return `edge_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Logs structured error in Edge Function context
 */
export async function logEdgeFunctionError(
  error: Error | string,
  functionName: string,
  category: EdgeFunctionErrorContext['category'],
  severity: EdgeFunctionErrorContext['severity'] = 'medium',
  requestData?: Record<string, unknown>,
  userId?: string,
  requestId?: string
): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  const errorContext: EdgeFunctionErrorContext = {
    timestamp: new Date().toISOString(),
    functionName,
    requestId: requestId || generateEdgeRequestId(),
    userId,
    errorMessage,
    errorStack,
    requestData: requestData ? sanitizeRequestData(requestData) : undefined,
    severity,
    category,
  };

  // Log to Supabase console (visible in Supabase Dashboard > Logs)
  console.error('🔴 Edge Function Error:', errorContext);

  // For critical errors, also log as separate entry for alerting
  if (severity === 'critical') {
    console.error('🚨 CRITICAL ERROR ALERT:', {
      function: functionName,
      message: errorMessage,
      timestamp: errorContext.timestamp,
      userId,
      requestId: errorContext.requestId,
    });
  }
}

/**
 * Logs successful Edge Function operations (for analytics)
 */
export function logEdgeFunctionSuccess(
  functionName: string,
  userId?: string,
  requestId?: string,
  duration?: number,
  additionalMetrics?: Record<string, unknown>
): void {
  console.info('✅ Edge Function Success:', {
    timestamp: new Date().toISOString(),
    functionName,
    userId,
    requestId: requestId || generateEdgeRequestId(),
    duration,
    ...additionalMetrics,
  });
}

/**
 * Creates error response with logging
 */
export function createErrorResponse(
  error: Error | string,
  status: number = 500,
  functionName: string,
  category: EdgeFunctionErrorContext['category'],
  severity: EdgeFunctionErrorContext['severity'] = 'medium',
  requestId?: string
): Response {
  const errorMessage = error instanceof Error ? error.message : error;

  // Log the error
  logEdgeFunctionError(error, functionName, category, severity, undefined, undefined, requestId);

  // Return Romanian error message for users
  const userMessage =
    severity === 'critical'
      ? 'A apărut o problemă critică. Vă rugăm să contactați suportul.'
      : 'A apărut o eroare neașteptată. Vă rugăm să încercați din nou.';

  return new Response(
    JSON.stringify({
      error: true,
      message: userMessage,
      requestId: requestId || generateEdgeRequestId(),
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Middleware for Edge Functions to add logging and error handling
 */
export function withErrorLogging(
  handler: (req: Request) => Promise<Response>,
  functionName: string
) {
  return async (req: Request): Promise<Response> => {
    const requestId = generateEdgeRequestId();
    const startTime = Date.now();

    try {
      console.info(`🟡 Edge Function Start: ${functionName}`, {
        requestId,
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
      });

      const response = await handler(req);
      const duration = Date.now() - startTime;

      logEdgeFunctionSuccess(functionName, undefined, requestId, duration);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      await logEdgeFunctionError(
        error as Error,
        functionName,
        'external_api',
        'high',
        { duration },
        undefined,
        requestId
      );

      return createErrorResponse(
        error as Error,
        500,
        functionName,
        'external_api',
        'high',
        requestId
      );
    }
  };
}
