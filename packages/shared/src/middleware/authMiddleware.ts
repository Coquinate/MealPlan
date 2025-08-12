/**
 * Authentication middleware for handling auth errors and retry logic
 * Provides centralized error handling and recovery mechanisms
 */

import { AuthError } from '@supabase/supabase-js'

// Types for middleware
export interface AuthMiddlewareOptions {
  maxRetries?: number
  retryDelay?: number
  onError?: (error: AuthError, context: string) => void
  onRetry?: (attempt: number, error: AuthError) => void
  onMaxRetriesExceeded?: (error: AuthError) => void
}

export interface AuthOperation<T = any> {
  operation: () => Promise<T>
  context: string
  retryable?: boolean
}

// Default options
const DEFAULT_OPTIONS: Required<AuthMiddlewareOptions> = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  onError: (error, context) => console.error(`Auth error in ${context}:`, error),
  onRetry: (attempt, error) => console.warn(`Retrying auth operation (attempt ${attempt}):`, error.message),
  onMaxRetriesExceeded: (error) => console.error('Max auth retries exceeded:', error.message)
}

// Retry-able error codes
const RETRYABLE_ERROR_CODES = [
  'network_error',
  'server_error',
  'timeout',
  'service_unavailable',
  'rate_limit_exceeded'
]

// Error codes that should trigger logout
const LOGOUT_ERROR_CODES = [
  'invalid_token',
  'expired_token', 
  'user_not_found',
  'session_not_found'
]

/**
 * Check if an error is retryable
 */
function isRetryableError(error: AuthError): boolean {
  if (!error.status) return false
  
  // Network/server errors are generally retryable
  if (error.status >= 500 && error.status < 600) return true
  
  // Rate limiting is retryable
  if (error.status === 429) return true
  
  // Check specific error codes
  return RETRYABLE_ERROR_CODES.includes(error.message?.toLowerCase() || '')
}

/**
 * Check if an error should trigger logout
 */
function shouldLogout(error: AuthError): boolean {
  if (error.status === 401) return true
  
  return LOGOUT_ERROR_CODES.some(code => 
    error.message?.toLowerCase().includes(code)
  )
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Calculate exponential backoff delay
 */
function calculateBackoffDelay(attempt: number, baseDelay: number): number {
  return Math.min(baseDelay * Math.pow(2, attempt - 1), 30000) // Max 30 seconds
}

/**
 * Execute authentication operation with retry logic
 */
export async function executeWithRetry<T>(
  operation: AuthOperation<T>,
  options: AuthMiddlewareOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options }
  let lastError: AuthError
  
  for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
    try {
      return await operation.operation()
    } catch (error) {
      const authError = error as AuthError
      lastError = authError
      
      // Log error
      config.onError(authError, operation.context)
      
      // Check if we should logout immediately
      if (shouldLogout(authError)) {
        // Emit logout event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:force-logout', {
            detail: { error: authError, context: operation.context }
          }))
        }
        throw authError
      }
      
      // Check if this is the last attempt or if error is not retryable
      if (attempt > config.maxRetries || (operation.retryable !== undefined && !operation.retryable) || !isRetryableError(authError)) {
        config.onMaxRetriesExceeded(authError)
        throw authError
      }
      
      // Log retry attempt
      config.onRetry(attempt, authError)
      
      // Calculate delay with exponential backoff
      const delay = calculateBackoffDelay(attempt, config.retryDelay)
      await sleep(delay)
    }
  }
  
  throw lastError!
}

/**
 * Middleware for handling authentication errors globally
 */
export class AuthErrorMiddleware {
  private options: Required<AuthMiddlewareOptions>
  private errorHistory: Array<{ error: AuthError; timestamp: number; context: string }> = []
  private maxHistorySize = 50
  
  constructor(options: AuthMiddlewareOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.setupGlobalErrorHandling()
  }
  
  /**
   * Setup global error event listeners
   */
  private setupGlobalErrorHandling() {
    if (typeof window === 'undefined') return
    
    // Listen for authentication errors
    window.addEventListener('auth:error', (event: any) => {
      const { error, context } = event.detail
      this.handleError(error, context)
    })
    
    // Listen for force logout events
    window.addEventListener('auth:force-logout', (event: any) => {
      const { error, context } = event.detail
      this.handleForceLogout(error, context)
    })
  }
  
  /**
   * Handle authentication error
   */
  private handleError(error: AuthError, context: string) {
    // Add to error history
    this.errorHistory.push({
      error,
      context,
      timestamp: Date.now()
    })
    
    // Trim history if too large
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift()
    }
    
    // Check for error patterns that might indicate a systematic issue
    this.analyzeErrorPatterns()
    
    // Call custom error handler
    this.options.onError(error, context)
  }
  
  /**
   * Handle force logout scenario
   */
  private handleForceLogout(error: AuthError, context: string) {
    console.warn(`Force logout triggered from ${context}:`, error.message)
    
    // Clear any stored authentication data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('coquinate-auth-storage')
      
      // Emit logout event for the auth store to handle
      window.dispatchEvent(new CustomEvent('auth:force-signout'))
    }
  }
  
  /**
   * Analyze error patterns to detect systematic issues
   */
  private analyzeErrorPatterns() {
    const recentErrors = this.errorHistory.filter(
      entry => Date.now() - entry.timestamp < 60000 // Last minute
    )
    
    // If we have too many errors in a short time, it might indicate a service issue
    if (recentErrors.length >= 5) {
      console.warn('High authentication error rate detected - possible service issue')
      
      // Emit service issue event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:service-issue', {
          detail: { errorCount: recentErrors.length }
        }))
      }
    }
  }
  
  /**
   * Get recent error history
   */
  public getErrorHistory(): Array<{ error: AuthError; timestamp: number; context: string }> {
    return [...this.errorHistory]
  }
  
  /**
   * Clear error history
   */
  public clearErrorHistory() {
    this.errorHistory = []
  }
  
  /**
   * Execute operation with middleware
   */
  public async execute<T>(operation: AuthOperation<T>): Promise<T> {
    return executeWithRetry(operation, this.options)
  }
}

/**
 * Default authentication middleware instance
 */
export const authMiddleware = new AuthErrorMiddleware()

/**
 * Utility function for wrapping authentication operations
 */
export function withAuthMiddleware<T>(
  operation: () => Promise<T>,
  context: string,
  retryable = true
): Promise<T> {
  return authMiddleware.execute({
    operation,
    context,
    retryable
  })
}

/**
 * Authentication operation decorator
 */
export function authOperation(context: string, retryable = true) {
  return function<T>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>
  ) {
    const method = descriptor.value!
    
    descriptor.value = async function(...args: any[]): Promise<T> {
      return withAuthMiddleware(
        () => method.apply(this, args),
        `${target.constructor.name}.${propertyName}`,
        retryable
      )
    }
  }
}

/**
 * Create a custom error for authentication failures
 */
export function createAuthError(
  message: string,
  status?: number,
  code?: string
): AuthError {
  const error = new Error(message) as AuthError
  error.status = status
  error.name = code || 'AuthError'
  return error
}

// Export types
export type { AuthError }