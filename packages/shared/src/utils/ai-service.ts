import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {
  generateText,
  streamText,
  type CoreMessage,
  type GenerateTextResult,
  type StreamTextResult,
  type LanguageModelUsage,
} from 'ai';
import { getAICacheService } from './ai-cache-service';
import { validateAPIResponse, Schemas, ValidationError } from './api-validation';

export interface AIServiceConfig {
  apiKey: string;
  model?: string;
  timeout?: number;
  maxRetries?: number;
  rateLimit?: {
    requestsPerMinute: number;
    tierScaling?: boolean;
  };
  streaming?: {
    enabled?: boolean;
    cleanup?: boolean;
  };
  messagePartsEnabled?: boolean;
  cache?: {
    enabled?: boolean;
    ttlSeconds?: number;
  };
  sdkVersion?: string;
}

export interface AIServiceRequest {
  messages: CoreMessage[];
  context?: Record<string, unknown>;
  stream?: boolean;
  maxTokens?: number;
  temperature?: number;
  messageParts?: boolean;
  signal?: AbortSignal;
}

export interface AIServiceResponse {
  content: string;
  usage?: LanguageModelUsage;
  finishReason?:
    | 'stop'
    | 'length'
    | 'content-filter'
    | 'error'
    | 'other'
    | 'unknown'
    | 'tool-calls';
  model?: string;
  sdkVersion?: string;
}

export interface AIServiceStreamResponse {
  textStream: ReadableStream<string>;
  usage: Promise<LanguageModelUsage | undefined>;
  cleanup?: () => void;
}

export interface AIServiceError extends Error {
  code: string;
  type: 'rate_limit' | 'timeout' | 'auth' | 'network' | 'server' | 'model_error' | 'token_limit';
  retryAfter?: number;
  aiSdkError?: boolean;
  modelUsed?: string;
  requestId?: string;
}

/**
 * Event types for recipe cache invalidation
 */
export interface RecipeUpdateEvent {
  recipeId: string;
  timestamp: number;
  type: 'update' | 'delete' | 'create';
}

/**
 * Cache invalidation event emitter
 */
class RecipeCacheEventEmitter {
  private listeners: Array<(event: RecipeUpdateEvent) => void> = [];

  subscribe(listener: (event: RecipeUpdateEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  emit(event: RecipeUpdateEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in cache invalidation listener:', error);
      }
    });
  }
}

/**
 * Global recipe cache event emitter
 */
export const recipeCacheEvents = new RecipeCacheEventEmitter();

/**
 * AI Service with integrated multi-layer caching
 *
 * CACHE INTEGRATION FLOW:
 * 1. generateResponse() → Check cache first (static → localStorage → API)
 * 2. Cache miss → Make API call with Gemini implicit cache benefits
 * 3. Cache fresh responses with configurable TTL
 * 4. Auto-invalidate on recipe updates via event system
 *
 * COST OPTIMIZATION STRATEGY:
 * - Static responses: $0 (instant answers for common questions)
 * - localStorage cache: $0 (personalized recent responses)
 * - Gemini implicit cache: 75% discount (repeated API prefixes)
 * - Fresh API calls: Full cost (only when needed)
 *
 * Target: >50% cost reduction through intelligent caching
 */
class AIService {
  private static readonly CACHE_VERSION = '1.1.0'; // Bumped for invalidation support
  private static readonly CACHE_VERSION_KEY = 'ai_cache_version';

  private config: Required<AIServiceConfig>;
  private google: ReturnType<typeof createGoogleGenerativeAI>;
  private model: any;
  private requestCount = 0;
  private requestWindowStart = Date.now();
  private cacheEventUnsubscribe?: () => void;

  constructor(config: AIServiceConfig) {
    this.config = {
      apiKey: config.apiKey,
      model: config.model || 'gemini-2.0-flash',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      rateLimit: {
        requestsPerMinute: config.rateLimit?.requestsPerMinute || 60,
        tierScaling: config.rateLimit?.tierScaling ?? true,
      },
      streaming: {
        enabled: config.streaming?.enabled ?? true,
        cleanup: config.streaming?.cleanup ?? true,
      },
      messagePartsEnabled: config.messagePartsEnabled ?? true,
      cache: {
        enabled: config.cache?.enabled ?? true,
        ttlSeconds: config.cache?.ttlSeconds || 3600,
      },
      sdkVersion: config.sdkVersion || '4.2',
    };

    if (!this.config.apiKey) {
      throw this.createError('Missing API key', 'auth');
    }

    // Create Google AI provider with API key
    this.google = createGoogleGenerativeAI({
      apiKey: this.config.apiKey,
    });
    this.model = this.google(this.config.model);

    // Initialize cache version management
    this.initializeCacheVersion();

    // Set up automatic cache invalidation on recipe updates
    this.setupCacheInvalidationListeners();
  }

  private createError(
    message: string,
    type: AIServiceError['type'],
    code?: string
  ): AIServiceError {
    const error = new Error(message) as AIServiceError;
    error.code = code || type.toUpperCase();
    error.type = type;
    error.aiSdkError = true;
    error.modelUsed = this.config.model;
    return error;
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const windowElapsed = now - this.requestWindowStart;

    if (windowElapsed >= 60000) {
      this.requestCount = 0;
      this.requestWindowStart = now;
    }

    if (this.requestCount >= this.config.rateLimit.requestsPerMinute) {
      const waitTime = 60000 - windowElapsed;
      const error = this.createError(
        `Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`,
        'rate_limit'
      );
      error.retryAfter = waitTime;
      throw error;
    }

    this.requestCount++;
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = this.config.maxRetries
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on non-retryable errors
        const errorCode = (error as any)?.code;
        const errorName = (error as any)?.name;

        if (
          errorCode === 'RATE_LIMIT_EXCEEDED' ||
          errorCode === 'AUTHENTICATION_FAILED' ||
          errorName === 'AbortError'
        ) {
          throw error; // Throw immediately without retrying
        }

        if (i < retries) {
          const delay = Math.min(1000 * Math.pow(2, i), 10000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Initialize cache version management - check version and clear if mismatch
   */
  private initializeCacheVersion(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return; // Server-side or no localStorage
    }

    try {
      const storedVersion = window.localStorage.getItem(AIService.CACHE_VERSION_KEY);

      if (storedVersion !== AIService.CACHE_VERSION) {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `Cache version mismatch (stored: ${storedVersion}, current: ${AIService.CACHE_VERSION}). Clearing all AI cache.`
          );
        }

        // Clear all AI cache entries on version mismatch
        this.invalidateAllCache();

        // Store new version
        window.localStorage.setItem(AIService.CACHE_VERSION_KEY, AIService.CACHE_VERSION);
      }
    } catch (error) {
      console.warn('Failed to initialize cache version:', error);
    }
  }

  /**
   * Set up event listeners for automatic cache invalidation
   */
  private setupCacheInvalidationListeners(): void {
    this.cacheEventUnsubscribe = recipeCacheEvents.subscribe((event) => {
      this.handleRecipeUpdateEvent(event);
    });
  }

  /**
   * Handle recipe update events for cache invalidation
   */
  private async handleRecipeUpdateEvent(event: RecipeUpdateEvent): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Handling recipe ${event.type} event for recipe ${event.recipeId}`);
      }

      if (event.type === 'delete') {
        // For deletes, invalidate all cache for this recipe
        await this.invalidateRecipeCache(event.recipeId);
      } else {
        // For updates and creates, invalidate specific cache entries
        await this.invalidateRecipeCache(event.recipeId);
      }
    } catch (error) {
      console.error('Failed to handle recipe update event:', error);
      // Don't throw - this is a background operation
    }
  }

  /**
   * Invalidate all cache entries for a specific recipe
   * Thread-safe and handles errors gracefully
   */
  async invalidateRecipeCache(recipeId: string): Promise<void> {
    if (!recipeId || typeof recipeId !== 'string') {
      console.warn('Invalid recipe ID provided for cache invalidation:', recipeId);
      return;
    }

    const startTime = performance.now();

    try {
      const cacheService = getAICacheService();

      // Use the cache service's invalidate method with a pattern
      const pattern = `^ai_${recipeId}_`;
      await cacheService.invalidate(pattern);

      const duration = performance.now() - startTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(`Invalidated cache for recipe ${recipeId} in ${duration.toFixed(2)}ms`);
      }

      // Log performance warning if invalidation takes too long
      if (duration > 100) {
        console.warn(
          `Cache invalidation for recipe ${recipeId} took ${duration.toFixed(2)}ms, exceeding 100ms target`
        );
      }
    } catch (error) {
      console.error(`Failed to invalidate cache for recipe ${recipeId}:`, error);
      // Don't throw - cache invalidation should not break the application
    }
  }

  /**
   * Invalidate all AI cache entries
   * Useful for version updates or manual cache clearing
   */
  async invalidateAllCache(): Promise<void> {
    const startTime = performance.now();

    try {
      const cacheService = getAICacheService();

      // Invalidate all AI cache entries (they all start with 'ai_')
      await cacheService.invalidate('^ai_');

      const duration = performance.now() - startTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(`Cleared all AI cache in ${duration.toFixed(2)}ms`);
      }

      // Log performance warning if invalidation takes too long
      if (duration > 200) {
        console.warn(
          `Full cache invalidation took ${duration.toFixed(2)}ms, exceeding 200ms target`
        );
      }
    } catch (error) {
      console.error('Failed to clear all AI cache:', error);
      // Don't throw - cache clearing should not break the application
    }
  }

  /**
   * Invalidate cache entries matching a custom pattern
   * For advanced invalidation scenarios
   */
  async invalidateCachePattern(pattern: string): Promise<void> {
    if (!pattern || typeof pattern !== 'string') {
      console.warn('Invalid pattern provided for cache invalidation:', pattern);
      return;
    }

    try {
      const cacheService = getAICacheService();
      await cacheService.invalidate(pattern);

      if (process.env.NODE_ENV === 'development') {
        console.log(`Invalidated cache entries matching pattern: ${pattern}`);
      }
    } catch (error) {
      console.error(`Failed to invalidate cache with pattern ${pattern}:`, error);
      // Don't throw - cache invalidation should not break the application
    }
  }

  /**
   * Clean up event listeners when service is destroyed
   */
  destroy(): void {
    if (this.cacheEventUnsubscribe) {
      this.cacheEventUnsubscribe();
      this.cacheEventUnsubscribe = undefined;
    }
  }

  /**
   * Generate AI response with integrated multi-layer caching
   *
   * CACHE-AWARE GENERATION FLOW:
   * 1. Rate limiting check
   * 2. Cache integration handled by caller (ai-cache-service.ts get() method)
   * 3. API call with Gemini implicit cache benefits (75% discount on repeated prefixes)
   * 4. Response caching handled by caller (ai-cache-service.ts set() method)
   *
   * NOTE: This method handles the AI API call only. Cache management is handled
   * by the calling code (typically through the AICacheService integration).
   *
   * For cache-aware responses, use the patterns documented in:
   * - docs/architecture/cache-strategy.md
   * - docs/guides/cache-development-guide.md
   */
  async generate(request: AIServiceRequest): Promise<AIServiceResponse> {
    await this.checkRateLimit();

    try {
      const result = await this.retryWithBackoff(async () => {
        const response = await generateText({
          model: this.model,
          messages: request.messages,
          maxTokens: request.maxTokens || 1000,
          temperature: request.temperature ?? 0.7,
          abortSignal: request.signal,
        });

        return response;
      });

      return {
        content: result.text,
        usage: result.usage,
        finishReason: result.finishReason as AIServiceResponse['finishReason'],
        model: this.config.model,
        sdkVersion: this.config.sdkVersion,
      };
    } catch (error) {
      if ((error as any)?.code === 'RATE_LIMIT_EXCEEDED') {
        throw this.createError('Rate limit exceeded', 'rate_limit');
      }
      if ((error as any)?.code === 'AUTHENTICATION_FAILED') {
        throw this.createError('Authentication failed', 'auth');
      }
      if ((error as any)?.name === 'AbortError') {
        throw this.createError('Request was cancelled', 'timeout');
      }

      throw this.createError(`AI generation failed: ${(error as Error).message}`, 'server');
    }
  }

  async stream(request: AIServiceRequest): Promise<AIServiceStreamResponse> {
    if (!this.config.streaming.enabled) {
      throw this.createError('Streaming is disabled', 'server');
    }

    await this.checkRateLimit();

    try {
      const result = await this.retryWithBackoff(async () => {
        const response = await streamText({
          model: this.model,
          messages: request.messages,
          maxTokens: request.maxTokens || 1000,
          temperature: request.temperature ?? 0.7,
          abortSignal: request.signal,
        });

        return response;
      });

      // Cleanup should not abort external signals
      // The caller is responsible for managing their own AbortController
      const cleanup = () => {
        // Cleanup any internal resources if needed
        // But don't touch the external AbortSignal
      };

      return {
        textStream: result.textStream,
        usage: result.usage,
        cleanup: this.config.streaming.cleanup ? cleanup : undefined,
      };
    } catch (error) {
      if ((error as any)?.code === 'RATE_LIMIT_EXCEEDED') {
        throw this.createError('Rate limit exceeded', 'rate_limit');
      }
      if ((error as any)?.name === 'AbortError') {
        throw this.createError('Stream was cancelled', 'timeout');
      }

      throw this.createError(`AI streaming failed: ${(error as Error).message}`, 'server');
    }
  }

  validateInput(messages: CoreMessage[]): void {
    if (!messages || messages.length === 0) {
      throw this.createError('Messages array cannot be empty', 'model_error');
    }

    for (const message of messages) {
      if (!message.role || !['system', 'user', 'assistant'].includes(message.role)) {
        throw this.createError('Invalid message role', 'model_error');
      }

      if (typeof message.content !== 'string' && !Array.isArray(message.content)) {
        throw this.createError('Invalid message content format', 'model_error');
      }
    }
  }

  sanitizeInput(text: string): string {
    // Remove potential prompt injection patterns
    const injectionPatterns = [
      /ignore previous instructions/gi,
      /disregard all prior/gi,
      /forget everything/gi,
      /new instructions:/gi,
      /\[system\]/gi,
      /\[assistant\]/gi,
    ];

    let sanitized = text;
    for (const pattern of injectionPatterns) {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }

    return sanitized;
  }

  getRateLimitInfo(): {
    remaining: number;
    resetIn: number;
    limit: number;
  } {
    const now = Date.now();
    const windowElapsed = now - this.requestWindowStart;
    const remaining = Math.max(0, this.config.rateLimit.requestsPerMinute - this.requestCount);
    const resetIn = windowElapsed >= 60000 ? 0 : 60000 - windowElapsed;

    return {
      remaining,
      resetIn,
      limit: this.config.rateLimit.requestsPerMinute,
    };
  }
}

let aiServiceInstance: AIService | null = null;

export function initializeAIService(config: AIServiceConfig): AIService {
  if (!config.apiKey) {
    throw new Error('API key is required to initialize AI service');
  }

  aiServiceInstance = new AIService(config);
  return aiServiceInstance;
}

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    throw new Error('AI service not initialized. Call initializeAIService first.');
  }
  return aiServiceInstance;
}

export function resetAIService(): void {
  if (aiServiceInstance) {
    aiServiceInstance.destroy();
  }
  aiServiceInstance = null;
}

/**
 * Trigger a recipe update event for cache invalidation
 * This should be called when recipes are created, updated, or deleted
 */
export function triggerRecipeUpdate(
  recipeId: string,
  type: 'create' | 'update' | 'delete' = 'update'
): void {
  recipeCacheEvents.emit({
    recipeId,
    type,
    timestamp: Date.now(),
  });
}

/**
 * Manually invalidate cache for a specific recipe
 * Useful when the event system is not available
 */
export async function invalidateRecipeCache(recipeId: string): Promise<void> {
  const service = getAIService();
  await service.invalidateRecipeCache(recipeId);
}

/**
 * Manually invalidate all AI cache
 * Useful for debugging or manual cache clearing
 */
export async function invalidateAllAICache(): Promise<void> {
  const service = getAIService();
  await service.invalidateAllCache();
}

export default AIService;
