import type { Recipe } from '../types/recipe';
import { getContentAnalyzerService } from './ai-content-analyzer';
import { getAICacheService } from './ai-cache-service';
import { getAIPreloaderService } from './ai-preloader';
import { getAIRateLimiter, RateLimitError } from './ai-rate-limiter';
import { getAIService } from './ai-service';
import { getAIAnalyticsService } from './ai-analytics';

/**
 * Warmup configuration for content-based cache preloading
 */
export interface WarmupConfig {
  maxContextualQuestions: number; // Default: 5
  staggerDelay: number; // Default: 2000ms
  enableContentAnalysis: boolean; // Default: true
  priority: 'high' | 'normal' | 'low'; // Default: 'normal'
  timeout: number; // Default: 60000ms (1 minute)
  minConfidence: number; // Default: 0.7
  retryAttempts: number; // Default: 2
}

/**
 * Warmup operation status
 */
export interface WarmupStatus {
  status: 'idle' | 'analyzing' | 'warming' | 'completed' | 'cancelled' | 'error';
  progress: number; // 0-100 percentage
  questionsAnalyzed: number;
  questionsWarmed: number;
  totalQuestions: number;
  error?: string;
  startTime?: number;
  endTime?: number;
  contentAnalysisTime?: number;
  averageWarmupTime?: number;
}

/**
 * Warmup result summary
 */
export interface WarmupResult {
  success: boolean;
  questionsWarmed: number;
  totalQuestions: number;
  analysisTime: number;
  warmupTime: number;
  errors: string[];
  contextualQuestions: string[];
}

/**
 * Active warmup operation tracking
 */
interface ActiveWarmup {
  status: WarmupStatus;
  abortController: AbortController;
  config: Required<WarmupConfig>;
  recipe: Recipe;
  contextualQuestions: string[];
  timeouts: NodeJS.Timeout[];
  retryQueue: Array<{ question: string; attempts: number }>;
}

/**
 * Advanced cache warmup service for content-based preloading
 */
class CacheWarmupService {
  private static readonly DEFAULT_CONFIG: Required<WarmupConfig> = {
    maxContextualQuestions: 5,
    staggerDelay: 2000,
    enableContentAnalysis: true,
    priority: 'normal',
    timeout: 60000,
    minConfidence: 0.7,
    retryAttempts: 2,
  };

  private activeWarmups = new Map<string, ActiveWarmup>();
  private serviceAvailability: {
    contentAnalyzer: boolean;
    cacheService: boolean;
    aiService: boolean;
    rateLimiter: boolean;
  };

  constructor() {
    this.serviceAvailability = this.checkServiceAvailability();
  }

  /**
   * Check if all required services are available
   */
  private checkServiceAvailability() {
    const availability = {
      contentAnalyzer: false,
      cacheService: false,
      aiService: false,
      rateLimiter: false,
    };

    try {
      getContentAnalyzerService();
      availability.contentAnalyzer = true;
    } catch (error) {
      console.warn('Content analyzer service not available:', error);
    }

    try {
      getAICacheService();
      availability.cacheService = true;
    } catch (error) {
      console.warn('Cache service not available:', error);
    }

    try {
      getAIService();
      availability.aiService = true;
    } catch (error) {
      console.warn('AI service not available:', error);
    }

    try {
      getAIRateLimiter();
      availability.rateLimiter = true;
    } catch (error) {
      console.warn('Rate limiter service not available:', error);
    }

    return availability;
  }

  /**
   * Check if warmup can proceed
   */
  private canProceedWithWarmup(): boolean {
    return (
      this.serviceAvailability.contentAnalyzer &&
      this.serviceAvailability.cacheService &&
      this.serviceAvailability.aiService &&
      this.serviceAvailability.rateLimiter
    );
  }

  /**
   * Start content-based warmup for a recipe
   */
  async warmupRecipeCache(
    recipe: Recipe,
    config: Partial<WarmupConfig> = {}
  ): Promise<WarmupResult> {
    const startTime = performance.now();

    if (!this.canProceedWithWarmup()) {
      const error = 'Required services not available for warmup';
      console.warn(error);
      return {
        success: false,
        questionsWarmed: 0,
        totalQuestions: 0,
        analysisTime: 0,
        warmupTime: 0,
        errors: [error],
        contextualQuestions: [],
      };
    }

    if (!recipe?.id) {
      const error = 'Invalid recipe provided for warmup';
      return {
        success: false,
        questionsWarmed: 0,
        totalQuestions: 0,
        analysisTime: 0,
        warmupTime: 0,
        errors: [error],
        contextualQuestions: [],
      };
    }

    // Cancel any existing warmup for this recipe
    this.cancelWarmup(recipe.id);

    const effectiveConfig = { ...CacheWarmupService.DEFAULT_CONFIG, ...config };

    try {
      // Phase 1: Content Analysis
      const analysisStartTime = performance.now();

      const activeWarmup = this.initializeWarmup(recipe, effectiveConfig);

      if (!effectiveConfig.enableContentAnalysis) {
        // Skip content analysis, use preloader service with default questions
        return this.fallbackToPreloader(recipe, effectiveConfig);
      }

      // Analyze recipe content for contextual questions
      this.updateWarmupStatus(recipe.id, {
        status: 'analyzing',
        progress: 10,
      });

      const contentAnalyzer = getContentAnalyzerService();
      const contextualQuestions = contentAnalyzer
        .analyzeRecipe(recipe)
        .filter((q) => q.confidence >= effectiveConfig.minConfidence)
        .slice(0, effectiveConfig.maxContextualQuestions)
        .map((q) => q.question);

      const analysisTime = performance.now() - analysisStartTime;

      if (contextualQuestions.length === 0) {
        console.warn(`No contextual questions generated for recipe ${recipe.id}`);
        return this.fallbackToPreloader(recipe, effectiveConfig);
      }

      activeWarmup.contextualQuestions = contextualQuestions;
      this.updateWarmupStatus(recipe.id, {
        questionsAnalyzed: contextualQuestions.length,
        totalQuestions: contextualQuestions.length,
        contentAnalysisTime: analysisTime,
        progress: 25,
      });

      // Phase 2: Cache Warmup
      const warmupStartTime = performance.now();

      this.updateWarmupStatus(recipe.id, {
        status: 'warming',
        progress: 30,
      });

      await this.warmupContextualQuestions(recipe, contextualQuestions, effectiveConfig);

      const warmupTime = performance.now() - warmupStartTime;
      const totalTime = performance.now() - startTime;

      // Finalize warmup
      const finalStatus = this.getWarmupStatus(recipe.id);

      this.updateWarmupStatus(recipe.id, {
        status: 'completed',
        progress: 100,
        endTime: Date.now(),
        averageWarmupTime: warmupTime / contextualQuestions.length,
      });

      // Cleanup after delay
      setTimeout(() => this.cleanupWarmup(recipe.id), 5000);

      return {
        success: true,
        questionsWarmed: finalStatus.questionsWarmed,
        totalQuestions: contextualQuestions.length,
        analysisTime,
        warmupTime: totalTime,
        errors: [],
        contextualQuestions,
      };
    } catch (error) {
      console.error(`Warmup failed for recipe ${recipe.id}:`, error);

      this.updateWarmupStatus(recipe.id, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        endTime: Date.now(),
      });

      const totalTime = performance.now() - startTime;

      return {
        success: false,
        questionsWarmed: 0,
        totalQuestions: 0,
        analysisTime: 0,
        warmupTime: totalTime,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        contextualQuestions: [],
      };
    }
  }

  /**
   * Initialize warmup operation tracking
   */
  private initializeWarmup(recipe: Recipe, config: Required<WarmupConfig>): ActiveWarmup {
    const abortController = new AbortController();

    const activeWarmup: ActiveWarmup = {
      status: {
        status: 'analyzing',
        progress: 0,
        questionsAnalyzed: 0,
        questionsWarmed: 0,
        totalQuestions: 0,
        startTime: Date.now(),
      },
      abortController,
      config,
      recipe,
      contextualQuestions: [],
      timeouts: [],
      retryQueue: [],
    };

    this.activeWarmups.set(recipe.id, activeWarmup);

    // Set up timeout for entire operation
    const timeoutId = setTimeout(() => {
      this.cancelWarmup(recipe.id);
      this.updateWarmupStatus(recipe.id, {
        status: 'error',
        error: 'Warmup timeout',
        endTime: Date.now(),
      });
    }, config.timeout);

    activeWarmup.timeouts.push(timeoutId);

    return activeWarmup;
  }

  /**
   * Warmup contextual questions with staggered timing and retry logic
   */
  private async warmupContextualQuestions(
    recipe: Recipe,
    questions: string[],
    config: Required<WarmupConfig>
  ): Promise<void> {
    const activeWarmup = this.activeWarmups.get(recipe.id);
    if (!activeWarmup) {
      throw new Error('Active warmup not found');
    }

    // Filter out already cached questions
    const uncachedQuestions: string[] = [];
    const cacheService = getAICacheService();

    for (const question of questions) {
      const cacheKey = cacheService.generateCacheKey(recipe.id, question);
      const cached = await cacheService.get(cacheKey);
      if (!cached) {
        uncachedQuestions.push(question);
      }
    }

    if (uncachedQuestions.length === 0) {
      console.log(`All contextual questions already cached for recipe ${recipe.id}`);
      return;
    }

    // Process questions with staggered timing
    const progressStep = 70 / uncachedQuestions.length; // 70% of progress for warmup phase

    for (let i = 0; i < uncachedQuestions.length; i++) {
      const question = uncachedQuestions[i];

      const questionTimeout = setTimeout(async () => {
        if (activeWarmup.abortController.signal.aborted) return;

        try {
          await this.warmupSingleQuestion(recipe.id, question, activeWarmup);

          // Update progress
          this.updateWarmupStatus(recipe.id, {
            questionsWarmed: activeWarmup.status.questionsWarmed + 1,
            progress: Math.min(30 + (i + 1) * progressStep, 95),
          });
        } catch (error) {
          if (activeWarmup.abortController.signal.aborted) return;

          console.error(`Failed to warmup question "${question}" for recipe ${recipe.id}:`, error);

          // Add to retry queue if not at max attempts
          if (!(error instanceof RateLimitError)) {
            const existingRetry = activeWarmup.retryQueue.find((r) => r.question === question);
            if (!existingRetry && config.retryAttempts > 0) {
              activeWarmup.retryQueue.push({ question, attempts: 0 });
            }
          }
        }
      }, i * config.staggerDelay);

      activeWarmup.timeouts.push(questionTimeout);
    }

    // Wait for all questions to be processed (or timeout)
    return new Promise((resolve) => {
      const checkCompletion = (): void => {
        const currentWarmup = this.activeWarmups.get(recipe.id);
        if (!currentWarmup || currentWarmup.abortController.signal.aborted) {
          resolve();
          return;
        }

        const completed = currentWarmup.status.questionsWarmed + currentWarmup.retryQueue.length;
        if (completed >= uncachedQuestions.length) {
          // Process retry queue
          this.processRetryQueue(recipe.id).finally(() => resolve());
        } else {
          setTimeout(checkCompletion, 500);
        }
      };

      setTimeout(checkCompletion, 500);
    });
  }

  /**
   * Warmup a single question with error handling
   */
  private async warmupSingleQuestion(
    recipeId: string,
    question: string,
    activeWarmup: ActiveWarmup
  ): Promise<void> {
    if (activeWarmup.abortController.signal.aborted) {
      throw new Error('Aborted');
    }

    try {
      // Check rate limiter
      const rateLimiter = getAIRateLimiter();
      await rateLimiter.checkLimit();

      // Double-check cache to avoid race conditions
      const cacheService = getAICacheService();
      const cacheKey = cacheService.generateCacheKey(recipeId, question);
      const cached = await cacheService.get(cacheKey);

      if (cached) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Question already cached during warmup: ${question.slice(0, 40)}...`);
        }
        return;
      }

      // Generate AI response
      const aiService = getAIService();
      const prompt = `Răspunde la întrebarea despre rețeta cu ID ${recipeId}: ${question}

Oferă un răspuns scurt, practic și în română. Dacă informația nu este disponibilă, spune-o clar.`;

      const response = await aiService.generate({
        messages: [
          {
            role: 'system',
            content:
              'Ești un asistent culinar expert în bucătăria românească. Răspunzi concis și util la întrebări despre rețete.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        maxTokens: 200,
        temperature: 0.3,
        signal: activeWarmup.abortController.signal,
      });

      if (activeWarmup.abortController.signal.aborted) {
        throw new Error('Aborted');
      }

      // Cache the response
      await cacheService.set(cacheKey, response);

      // Track in analytics
      try {
        const analytics = getAIAnalyticsService();
        analytics.trackCacheHit(recipeId, question);
      } catch (analyticsError) {
        console.warn('Failed to track warmup in analytics:', analyticsError);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`Warmed up question for recipe ${recipeId}: ${question.slice(0, 40)}...`);
      }
    } catch (error) {
      if (activeWarmup.abortController.signal.aborted || (error as Error).message === 'Aborted') {
        throw new Error('Aborted');
      }

      if (error instanceof RateLimitError) {
        console.warn(
          `Rate limited during warmup for recipe ${recipeId}, question: ${question.slice(0, 40)}...`
        );
        throw error;
      }

      console.error(`Failed to warmup question for recipe ${recipeId}:`, error);
      throw error;
    }
  }

  /**
   * Process retry queue for failed questions
   */
  private async processRetryQueue(recipeId: string): Promise<void> {
    const activeWarmup = this.activeWarmups.get(recipeId);
    if (!activeWarmup || activeWarmup.retryQueue.length === 0) {
      return;
    }

    for (const retryItem of activeWarmup.retryQueue) {
      if (activeWarmup.abortController.signal.aborted) break;

      if (retryItem.attempts < activeWarmup.config.retryAttempts) {
        try {
          retryItem.attempts++;
          await this.warmupSingleQuestion(recipeId, retryItem.question, activeWarmup);

          this.updateWarmupStatus(recipeId, {
            questionsWarmed: activeWarmup.status.questionsWarmed + 1,
          });
        } catch (error) {
          console.warn(
            `Retry ${retryItem.attempts} failed for question:`,
            retryItem.question,
            error
          );
        }
      }
    }
  }

  /**
   * Fallback to preloader service if content analysis is disabled or fails
   */
  private async fallbackToPreloader(
    recipe: Recipe,
    config: Required<WarmupConfig>
  ): Promise<WarmupResult> {
    try {
      const preloader = getAIPreloaderService();

      await preloader.preloadRecipeQuestions(recipe.id, {
        maxQuestions: config.maxContextualQuestions,
        staggerDelay: config.staggerDelay,
        priority: config.priority === 'high' ? 'high' : 'low',
        timeout: config.timeout,
      });

      const questions = preloader.getTopQuestionsForRecipe(recipe.id);

      return {
        success: true,
        questionsWarmed: questions.length,
        totalQuestions: questions.length,
        analysisTime: 0,
        warmupTime: config.staggerDelay * questions.length,
        errors: [],
        contextualQuestions: questions,
      };
    } catch (error) {
      return {
        success: false,
        questionsWarmed: 0,
        totalQuestions: 0,
        analysisTime: 0,
        warmupTime: 0,
        errors: [error instanceof Error ? error.message : 'Fallback failed'],
        contextualQuestions: [],
      };
    }
  }

  /**
   * Update warmup status
   */
  private updateWarmupStatus(recipeId: string, updates: Partial<WarmupStatus>): void {
    const warmup = this.activeWarmups.get(recipeId);
    if (warmup) {
      Object.assign(warmup.status, updates);
    }
  }

  /**
   * Get warmup status for a recipe
   */
  getWarmupStatus(recipeId: string): WarmupStatus {
    const warmup = this.activeWarmups.get(recipeId);

    if (!warmup) {
      return {
        status: 'idle',
        progress: 0,
        questionsAnalyzed: 0,
        questionsWarmed: 0,
        totalQuestions: 0,
      };
    }

    return { ...warmup.status };
  }

  /**
   * Cancel warmup operation
   */
  cancelWarmup(recipeId: string): void {
    const warmup = this.activeWarmups.get(recipeId);

    if (warmup) {
      // Cancel abort controller
      warmup.abortController.abort();

      // Clear all timeouts
      warmup.timeouts.forEach((timeout) => clearTimeout(timeout));

      // Update status
      this.updateWarmupStatus(recipeId, {
        status: 'cancelled',
        endTime: Date.now(),
      });

      this.cleanupWarmup(recipeId);

      if (process.env.NODE_ENV === 'development') {
        console.log(`Warmup cancelled for recipe ${recipeId}`);
      }
    }
  }

  /**
   * Cleanup warmup tracking data
   */
  private cleanupWarmup(recipeId: string): void {
    setTimeout(() => {
      this.activeWarmups.delete(recipeId);
    }, 5000);
  }

  /**
   * Cleanup all warmup operations
   */
  cleanup(): void {
    const recipeIds = Array.from(this.activeWarmups.keys());
    recipeIds.forEach((recipeId) => this.cancelWarmup(recipeId));
    this.activeWarmups.clear();

    if (process.env.NODE_ENV === 'development') {
      console.log('Cache warmup service cleanup completed');
    }
  }

  /**
   * Get service health status
   */
  getServiceHealth(): {
    available: boolean;
    services: {
      contentAnalyzer: boolean;
      cacheService: boolean;
      aiService: boolean;
      rateLimiter: boolean;
    };
    activeWarmups: number;
  } {
    return {
      available: this.canProceedWithWarmup(),
      services: { ...this.serviceAvailability },
      activeWarmups: this.activeWarmups.size,
    };
  }
}

/**
 * Singleton instance
 */
let cacheWarmupServiceInstance: CacheWarmupService | null = null;

/**
 * Get the cache warmup service instance
 */
export function getCacheWarmupService(): CacheWarmupService {
  if (!cacheWarmupServiceInstance) {
    cacheWarmupServiceInstance = new CacheWarmupService();
  }
  return cacheWarmupServiceInstance;
}

/**
 * Reset the cache warmup service (useful for testing)
 */
export function resetCacheWarmupService(): void {
  if (cacheWarmupServiceInstance) {
    cacheWarmupServiceInstance.cleanup();
  }
  cacheWarmupServiceInstance = null;
}

/**
 * Convenience function to warmup recipe cache
 */
export async function warmupRecipeCache(
  recipe: Recipe,
  config?: Partial<WarmupConfig>
): Promise<WarmupResult> {
  const service = getCacheWarmupService();
  return service.warmupRecipeCache(recipe, config);
}

/**
 * Convenience function to get warmup status
 */
export function getRecipeWarmupStatus(recipeId: string): WarmupStatus {
  const service = getCacheWarmupService();
  return service.getWarmupStatus(recipeId);
}

/**
 * Convenience function to cancel warmup
 */
export function cancelRecipeWarmup(recipeId: string): void {
  const service = getCacheWarmupService();
  service.cancelWarmup(recipeId);
}

export default CacheWarmupService;
