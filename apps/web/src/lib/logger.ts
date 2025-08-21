/**
 * Professional logging system for Coquinate web app
 * Replaces console.log/warn/error with structured, production-safe logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
  requestId?: string;
  userId?: string;
  component?: string;
  action?: string;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
  environment: string;
}

class Logger {
  private readonly environment: string;
  private readonly isProduction: boolean;
  private readonly isDevelopment: boolean;

  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.isProduction = this.environment === 'production';
    this.isDevelopment = this.environment === 'development';
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  /**
   * Log warnings
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  /**
   * Log errors
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorObject = error instanceof Error ? error : undefined;
    this.log('error', message, context, errorObject);
  }

  /**
   * Core logging method with structured output
   */
  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      } as any : undefined,
    };

    if (this.isProduction) {
      // In production, use structured JSON logging
      // This can be easily parsed by log aggregation services
      if (level === 'error') {
        console.error(JSON.stringify(entry));
      } else if (level === 'warn') {
        console.warn(JSON.stringify(entry));
      } else {
        console.log(JSON.stringify(entry));
      }
    } else {
      // In development, use readable console output
      const prefix = `[${level.toUpperCase()}] ${entry.timestamp}`;
      const contextStr = context ? ` ${JSON.stringify(context, null, 2)}` : '';
      
      if (level === 'error') {
        console.error(`${prefix} ${message}${contextStr}`);
        if (error) console.error(error);
      } else if (level === 'warn') {
        console.warn(`${prefix} ${message}${contextStr}`);
      } else {
        console.log(`${prefix} ${message}${contextStr}`);
      }
    }
  }

  /**
   * Create a child logger with persistent context
   */
  child(context: LogContext): Logger {
    const childLogger = new Logger();
    const originalLog = childLogger.log.bind(childLogger);
    
    childLogger.log = (level: LogLevel, message: string, additionalContext?: LogContext, error?: Error) => {
      const mergedContext = { ...context, ...additionalContext };
      originalLog(level, message, mergedContext, error);
    };

    return childLogger;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience methods for common patterns
export const authLogger = logger.child({ component: 'auth' });
export const apiLogger = logger.child({ component: 'api' });
export const middlewareLogger = logger.child({ component: 'middleware' });
export const emailLogger = logger.child({ component: 'email' });

// Export types for TypeScript
export type { LogLevel, LogContext };