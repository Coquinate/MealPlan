import { getAICacheService } from './ai-cache-service';
import { getAIAnalyticsService } from './ai-analytics';
import { getAIService } from './ai-service';
import { getAIRateLimiter, RateLimitError } from './ai-rate-limiter';
import { PRELOADER_CONSTANTS, AI_SERVICE_CONSTANTS } from './constants';

/**
 * Preloading configuration
 */
export interface PreloadConfig {
  maxQuestions: number; // Default: 3
  staggerDelay: number; // Default: 1000ms
  priority: 'high' | 'low'; // High for immediate view, low for hover
  timeout?: number; // Max time to wait for completion
}

/**
 * Preload status tracking
 */
export interface PreloadStatus {
  status: 'idle' | 'loading' | 'completed' | 'cancelled' | 'error';
  progress: number; // 0-100 percentage
  questionsPreloaded: number;
  totalQuestions: number;
  error?: string;
  startTime?: number;
  endTime?: number;
}

/**
 * Default Romanian top questions for recipes
 */
export const DEFAULT_TOP_QUESTIONS: readonly string[] = [
  'Cât timp durează rețeta?', // How long does the recipe take?
  'Pentru câte persoane este?', // How many servings?
  'Ce pot înlocui?', // What can I substitute?
  'Câte calorii are?', // How many calories?
  'Care este gradul de dificultate?', // What's the difficulty level?
] as const;

/**
 * Preload service interface
 */
export interface PreloadService {
  preloadRecipeQuestions(recipeId: string, config?: PreloadConfig): Promise<void>;
  getPreloadStatus(recipeId: string): PreloadStatus;
  cancelPreload(recipeId: string): void;
  getTopQuestionsForRecipe(recipeId: string): string[];
  cleanup(): void;
}

/**
 * Active preload operation tracking
 */
interface ActivePreload {
  status: PreloadStatus;
  abortController: AbortController;
  questions: string[];
  currentIndex: number;
  timeouts: NodeJS.Timeout[];
}

/**
 * Implementation of AI Preloader Service
 */
class AIPreloaderServiceImpl implements PreloadService {
  private static readonly DEFAULT_CONFIG: Required<PreloadConfig> = {
    maxQuestions: PRELOADER_CONSTANTS.DEFAULT_MAX_QUESTIONS,
    staggerDelay: PRELOADER_CONSTANTS.STAGGER_DELAY,
    priority: 'high',
    timeout: PRELOADER_CONSTANTS.DEFAULT_TIMEOUT,
  };

  private activePreloads = new Map<string, ActivePreload>();
  private isServiceAvailable: boolean;

  constructor() {
    this.isServiceAvailable = this.checkServiceAvailability();
  }

  /**
   * Check if required services are available
   */
  private checkServiceAvailability(): boolean {
    try {
      // Check if we can access the required services
      getAICacheService();
      getAIAnalyticsService();
      getAIRateLimiter();
      return true;
    } catch (error) {
      console.warn('AI services not fully available for preloading:', error);
      return false;
    }
  }

  /**
   * Get top questions for a specific recipe from analytics
   */
  getTopQuestionsForRecipe(recipeId: string): string[] {
    if (!this.isServiceAvailable || !recipeId) {
      return [...DEFAULT_TOP_QUESTIONS.slice(0, 3)];
    }

    try {
      const analytics = getAIAnalyticsService();
      const recipeQuestions = analytics.getTopQuestionsForRecipe(recipeId, 5);

      if (recipeQuestions.length === 0) {
        // No recipe-specific data, use global top questions
        const globalQuestions = analytics.getTopQuestions(5);
        const questions = globalQuestions.map((q) => q.question);

        if (questions.length === 0) {
          // No analytics data at all, use defaults
          return [...DEFAULT_TOP_QUESTIONS.slice(0, 3)];
        }

        return questions.slice(0, 3);
      }

      return recipeQuestions.map((q) => q.question).slice(0, 3);
    } catch (error) {
      console.warn('Failed to get analytics questions, using defaults:', error);
      return [...DEFAULT_TOP_QUESTIONS.slice(0, 3)];
    }
  }

  /**
   * Generate cache key for a question
   */
  private generateCacheKey(recipeId: string, question: string): string {
    const cacheService = getAICacheService();
    return cacheService.generateCacheKey(recipeId, question);
  }

  /**
   * Check if a question is already cached
   */
  private async isQuestionCached(recipeId: string, question: string): Promise<boolean> {
    try {
      const cacheService = getAICacheService();
      const cacheKey = this.generateCacheKey(recipeId, question);
      const cached = await cacheService.get(cacheKey);
      return cached !== null;
    } catch (error) {
      console.warn('Failed to check cache status:', error);
      return false;
    }
  }

  /**
   * Fetch and cache a single question response
   */
  private async fetchAndCacheQuestion(
    recipeId: string,
    question: string,
    signal: AbortSignal
  ): Promise<void> {
    if (signal.aborted) {
      throw new Error('Aborted');
    }

    try {
      // Check rate limiter before proceeding
      const rateLimiter = getAIRateLimiter();
      await rateLimiter.checkLimit();

      // Check if already cached (double-check to avoid race conditions)
      if (await this.isQuestionCached(recipeId, question)) {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `Preload: Question already cached for recipe ${recipeId}: ${question.slice(0, 30)}...`
          );
        }
        return;
      }

      const aiService = getAIService();
      const cacheService = getAICacheService();

      // Prepare AI request
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
        maxTokens: AI_SERVICE_CONSTANTS.DEFAULT_MAX_TOKENS,
        temperature: AI_SERVICE_CONSTANTS.PRECISE_TEMPERATURE,
        signal,
      });

      if (signal.aborted) {
        throw new Error('Aborted');
      }

      // Cache the response
      const cacheKey = this.generateCacheKey(recipeId, question);
      await cacheService.set(cacheKey, response);

      // Track the preload in analytics
      const analytics = getAIAnalyticsService();
      analytics.trackCacheHit(recipeId, question); // Count as hit since it's now cached

      if (process.env.NODE_ENV === 'development') {
        console.log(`Preload: Cached response for recipe ${recipeId}: ${question.slice(0, 30)}...`);
      }
    } catch (error) {
      if (signal.aborted || (error as Error).message === 'Aborted') {
        throw new Error('Aborted');
      }

      if (error instanceof RateLimitError) {
        console.warn(
          `Preload: Rate limited for recipe ${recipeId}, question: ${question.slice(0, 30)}...`
        );
        throw error;
      }

      console.error(`Preload: Failed to fetch question for recipe ${recipeId}:`, error);
      throw error;
    }
  }

  /**
   * Update preload status
   */
  private updatePreloadStatus(recipeId: string, updates: Partial<PreloadStatus>): void {
    const preload = this.activePreloads.get(recipeId);
    if (preload) {
      Object.assign(preload.status, updates);
    }
  }

  /**
   * Start preloading questions for a recipe
   */
  async preloadRecipeQuestions(recipeId: string, config?: PreloadConfig): Promise<void> {
    if (!this.isServiceAvailable || !recipeId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Preload: Service not available or invalid recipe ID');
      }
      return;
    }

    // Cancel any existing preload for this recipe
    this.cancelPreload(recipeId);

    const effectiveConfig = { ...AIPreloaderServiceImpl.DEFAULT_CONFIG, ...config };
    const questions = this.getTopQuestionsForRecipe(recipeId).slice(
      0,
      effectiveConfig.maxQuestions
    );

    if (questions.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Preload: No questions to preload for recipe ${recipeId}`);
      }
      return;
    }

    // Filter out already cached questions
    const uncachedQuestions: string[] = [];
    for (const question of questions) {
      if (!(await this.isQuestionCached(recipeId, question))) {
        uncachedQuestions.push(question);
      }
    }

    if (uncachedQuestions.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Preload: All questions already cached for recipe ${recipeId}`);
      }
      return;
    }

    // Create abort controller for this preload operation
    const abortController = new AbortController();
    const activePreload: ActivePreload = {
      status: {
        status: 'loading',
        progress: 0,
        questionsPreloaded: 0,
        totalQuestions: uncachedQuestions.length,
        startTime: Date.now(),
      },
      abortController,
      questions: uncachedQuestions,
      currentIndex: 0,
      timeouts: [],
    };

    this.activePreloads.set(recipeId, activePreload);

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Preload: Starting preload for recipe ${recipeId} with ${uncachedQuestions.length} questions`
      );
    }

    // Set up timeout for overall operation
    const timeoutId = setTimeout(() => {
      this.cancelPreload(recipeId);
      this.updatePreloadStatus(recipeId, {
        status: 'error',
        error: 'Preload timeout',
        endTime: Date.now(),
      });
    }, effectiveConfig.timeout);

    try {
      // Process questions with staggered timing
      for (let i = 0; i < uncachedQuestions.length; i++) {
        const question = uncachedQuestions[i];

        // Create staggered timeout for this question
        const questionTimeout = setTimeout(async () => {
          if (abortController.signal.aborted) return;

          try {
            await this.fetchAndCacheQuestion(recipeId, question, abortController.signal);

            // Update progress
            const preload = this.activePreloads.get(recipeId);
            if (preload) {
              preload.status.questionsPreloaded++;
              preload.status.progress = Math.round(
                (preload.status.questionsPreloaded / preload.status.totalQuestions) * 100
              );

              // Remove this timeout from the array after execution to prevent memory leak
              const timeoutIndex = preload.timeouts.indexOf(questionTimeout);
              if (timeoutIndex > -1) {
                preload.timeouts.splice(timeoutIndex, 1);
              }

              // Check if completed
              if (preload.status.questionsPreloaded >= preload.status.totalQuestions) {
                clearTimeout(timeoutId);
                this.updatePreloadStatus(recipeId, {
                  status: 'completed',
                  progress: 100,
                  endTime: Date.now(),
                });
                this.cleanupPreload(recipeId);

                if (process.env.NODE_ENV === 'development') {
                  console.log(`Preload: Completed for recipe ${recipeId}`);
                }
              }
            }
          } catch (error) {
            if (abortController.signal.aborted) return;

            console.error(
              `Preload: Failed to cache question "${question}" for recipe ${recipeId}:`,
              error
            );

            // Don't fail the entire preload for individual question failures
            // But track the error
            const preload = this.activePreloads.get(recipeId);
            if (preload) {
              preload.status.questionsPreloaded++; // Count as processed even if failed
              preload.status.progress = Math.round(
                (preload.status.questionsPreloaded / preload.status.totalQuestions) * 100
              );

              // Remove this timeout from the array after execution to prevent memory leak
              const timeoutIndex = preload.timeouts.indexOf(questionTimeout);
              if (timeoutIndex > -1) {
                preload.timeouts.splice(timeoutIndex, 1);
              }
            }
          }
        }, i * effectiveConfig.staggerDelay);

        activePreload.timeouts.push(questionTimeout);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      this.updatePreloadStatus(recipeId, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        endTime: Date.now(),
      });
      this.cleanupPreload(recipeId);
    }
  }

  /**
   * Get current preload status for a recipe
   */
  getPreloadStatus(recipeId: string): PreloadStatus {
    const preload = this.activePreloads.get(recipeId);

    if (!preload) {
      return {
        status: 'idle',
        progress: 0,
        questionsPreloaded: 0,
        totalQuestions: 0,
      };
    }

    return { ...preload.status };
  }

  /**
   * Cancel preload operation for a recipe
   */
  cancelPreload(recipeId: string): void {
    const preload = this.activePreloads.get(recipeId);

    if (preload) {
      // Cancel the abort controller
      preload.abortController.abort();

      // Clear all timeouts
      preload.timeouts.forEach((timeout) => clearTimeout(timeout));

      // Update status
      this.updatePreloadStatus(recipeId, {
        status: 'cancelled',
        endTime: Date.now(),
      });

      this.cleanupPreload(recipeId);

      if (process.env.NODE_ENV === 'development') {
        console.log(`Preload: Cancelled for recipe ${recipeId}`);
      }
    }
  }

  /**
   * Clean up preload tracking data
   */
  private cleanupPreload(recipeId: string): void {
    const preload = this.activePreloads.get(recipeId);

    if (preload) {
      // Clear any remaining timeouts to prevent memory leaks
      preload.timeouts.forEach((timeout) => clearTimeout(timeout));
      preload.timeouts = []; // Clear the array
    }

    // Remove from active preloads after a delay to allow status to be read
    setTimeout(() => {
      this.activePreloads.delete(recipeId);
    }, PRELOADER_CONSTANTS.CLEANUP_DELAY);
  }

  /**
   * Clean up all preload operations
   */
  cleanup(): void {
    const recipeIds = Array.from(this.activePreloads.keys());
    recipeIds.forEach((recipeId) => this.cancelPreload(recipeId));
    this.activePreloads.clear();

    if (process.env.NODE_ENV === 'development') {
      console.log('Preload: Service cleanup completed');
    }
  }
}

/**
 * Singleton instance for AI preloader service
 */
let aiPreloaderServiceInstance: AIPreloaderServiceImpl | null = null;

/**
 * Get the AI preloader service instance
 */
export function getAIPreloaderService(): PreloadService {
  if (!aiPreloaderServiceInstance) {
    aiPreloaderServiceInstance = new AIPreloaderServiceImpl();
  }
  return aiPreloaderServiceInstance;
}

/**
 * Reset the AI preloader service instance (useful for testing)
 */
export function resetAIPreloaderService(): void {
  if (aiPreloaderServiceInstance) {
    aiPreloaderServiceInstance.cleanup();
  }
  aiPreloaderServiceInstance = null;
}

/**
 * Convenience function to start preloading for a recipe
 */
export async function preloadRecipeQuestions(
  recipeId: string,
  config?: PreloadConfig
): Promise<void> {
  const service = getAIPreloaderService();
  return service.preloadRecipeQuestions(recipeId, config);
}

/**
 * Convenience function to get preload status
 */
export function getRecipePreloadStatus(recipeId: string): PreloadStatus {
  const service = getAIPreloaderService();
  return service.getPreloadStatus(recipeId);
}

/**
 * Convenience function to cancel preload
 */
export function cancelRecipePreload(recipeId: string): void {
  const service = getAIPreloaderService();
  service.cancelPreload(recipeId);
}

export default AIPreloaderServiceImpl;
