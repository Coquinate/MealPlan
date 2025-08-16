import { z, ZodSchema, ZodError } from 'zod';
import { useState, useCallback, useEffect } from 'react';

/**
 * API Response Validation Utility
 * Provides runtime validation for external API responses
 */

// Common validation schemas
export const Schemas = {
  // AI Response Schema
  AIResponse: z.object({
    response: z.string(),
    cached: z.boolean().optional(),
    source: z.enum(['api', 'cache', 'static']).optional(),
    timestamp: z.number().optional(),
    metadata: z
      .object({
        model: z.string().optional(),
        tokensUsed: z.number().optional(),
        responseTime: z.number().optional(),
        language: z.string().optional(),
      })
      .optional(),
  }),

  // Recipe Schema
  Recipe: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    ingredients: z
      .array(
        z.object({
          name: z.string(),
          quantity: z.string().optional(),
          unit: z.string().optional(),
        })
      )
      .optional(),
    instructions: z.array(z.string()).optional(),
    prepTime: z.number().optional(),
    cookTime: z.number().optional(),
    servings: z.number().optional(),
    calories: z.number().optional(),
    category: z.string().optional(),
    cuisine: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    imageUrl: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
  }),

  // Cache Entry Schema
  CacheEntry: z.object({
    key: z.string(),
    value: z.unknown(),
    timestamp: z.number(),
    expiresAt: z.number().optional(),
    metadata: z.record(z.unknown()).optional(),
  }),

  // Analytics Data Schema
  AnalyticsData: z.object({
    event: z.string(),
    timestamp: z.number(),
    data: z.record(z.unknown()),
    userId: z.string().optional(),
    sessionId: z.string().optional(),
  }),

  // Error Response Schema
  ErrorResponse: z.object({
    error: z.string(),
    message: z.string().optional(),
    code: z.string().optional(),
    statusCode: z.number().optional(),
    details: z.unknown().optional(),
  }),

  // Admin Response Schemas
  AdminAuthResponse: z.object({
    success: z.boolean(),
    sessionToken: z.string().optional(),
    csrfToken: z.string().optional(),
    expiresAt: z.number().optional(),
    error: z.string().optional(),
  }),

  CacheStatsResponse: z.object({
    success: z.boolean(),
    data: z
      .object({
        summary: z.object({
          totalQuestions: z.number(),
          uniqueQuestions: z.number(),
          cacheHitRate: z.number(),
          costSavings: z.number(),
          totalCacheSize: z.number(),
          totalCacheItems: z.number(),
        }),
        performance: z.object({
          daily: z.array(
            z.object({
              date: z.string(),
              hits: z.number(),
              misses: z.number(),
              hitRate: z.number(),
              costSaved: z.number(),
            })
          ),
          monthly: z.array(
            z.object({
              month: z.string(),
              hits: z.number(),
              misses: z.number(),
              hitRate: z.number(),
              costSaved: z.number(),
            })
          ),
        }),
        topQuestions: z.array(
          z.object({
            question: z.string(),
            count: z.number(),
            category: z.string(),
            lastAsked: z.string(),
          })
        ),
        cacheDistribution: z.array(
          z.object({
            category: z.string(),
            count: z.number(),
            percentage: z.number(),
          })
        ),
        systemHealth: z.object({
          cacheUtilization: z.number(),
          evictionRate: z.number(),
          averageResponseTime: z.number(),
          errorRate: z.number(),
        }),
      })
      .optional(),
    timestamp: z.string().optional(),
    error: z.string().optional(),
  }),
};

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    errors: Array<{
      path: string;
      message: string;
    }>;
  };
}

/**
 * Validate data against a schema
 */
export function validate<T>(data: unknown, schema: ZodSchema<T>): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: {
          message: 'Validation failed',
          errors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
      };
    }

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown validation error',
        errors: [],
      },
    };
  }
}

/**
 * Safe parse with default value
 */
export function safeParseWithDefault<T>(data: unknown, schema: ZodSchema<T>, defaultValue: T): T {
  const result = validate(data, schema);
  return result.success && result.data ? result.data : defaultValue;
}

/**
 * Validate API response with logging
 */
export function validateAPIResponse<T>(data: unknown, schema: ZodSchema<T>, context?: string): T {
  const result = validate(data, schema);

  if (!result.success) {
    const errorMessage = `API validation failed${context ? ` for ${context}` : ''}`;

    if (process.env.NODE_ENV === 'development') {
      console.error(errorMessage, {
        errors: result.error?.errors,
        receivedData: data,
      });
    }

    throw new ValidationError(errorMessage, result.error?.errors || []);
  }

  return result.data!;
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  public readonly errors: Array<{ path: string; message: string }>;

  constructor(message: string, errors: Array<{ path: string; message: string }>) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Sanitize data by removing unknown fields
 */
export function sanitize<T>(data: unknown, schema: ZodSchema<T>): T | null {
  try {
    // Use passthrough to allow unknown fields, then strip them
    const lenientSchema = schema as any;
    if (lenientSchema._def && typeof lenientSchema.passthrough === 'function') {
      return lenientSchema.passthrough().parse(data);
    }
    return schema.parse(data);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to sanitize data:', error);
    }
    return null;
  }
}

/**
 * Create a validated API client wrapper
 */
export function createValidatedAPIClient<T extends Record<string, ZodSchema<any>>>(schemas: T) {
  return {
    /**
     * Fetch and validate API response
     */
    async fetch<K extends keyof T>(
      url: string,
      schemaKey: K,
      options?: RequestInit
    ): Promise<z.infer<T[K]>> {
      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return validateAPIResponse(data, schemas[schemaKey], `${String(schemaKey)} from ${url}`);
      } catch (error) {
        if (error instanceof ValidationError) {
          throw error;
        }

        throw new Error(
          `Failed to fetch and validate ${String(schemaKey)}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    },

    /**
     * Validate existing data
     */
    validate<K extends keyof T>(data: unknown, schemaKey: K): z.infer<T[K]> {
      return validateAPIResponse(data, schemas[schemaKey], String(schemaKey));
    },

    /**
     * Safe parse with optional default
     */
    safeParse<K extends keyof T>(
      data: unknown,
      schemaKey: K,
      defaultValue?: z.infer<T[K]>
    ): z.infer<T[K]> | undefined {
      const result = validate(data, schemas[schemaKey]);
      return result.success ? result.data : defaultValue;
    },
  };
}

/**
 * Middleware for Express/Next.js API routes
 */
export function validationMiddleware<T>(schema: ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    try {
      const validated = validateAPIResponse(req.body, schema, 'request body');
      req.validatedBody = validated;
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };
}

/**
 * React hook for validated API calls
 */
export function useValidatedAPI<T>(schema: ZodSchema<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ValidationError | Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (url: string, options?: RequestInit) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const rawData = await response.json();
        const validatedData = validateAPIResponse(rawData, schema, url);
        setData(validatedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    },
    [schema]
  );

  return { data, error, loading, fetchData };
}
