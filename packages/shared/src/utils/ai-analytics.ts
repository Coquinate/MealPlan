import { StorageQuotaManager } from './storage-quota';

/**
 * AI Analytics Service - Track question frequencies, cache performance, and usage patterns
 *
 * ANALYTICS STRATEGY:
 * 1. Question Frequency Tracking - Identify most common questions for static response optimization
 * 2. Cache Performance Monitoring - Track hit rates, cost savings, response times
 * 3. Usage Pattern Analysis - Understand user behavior for cache warmup strategies
 * 4. Cost Optimization Metrics - Calculate actual API cost savings from caching
 *
 * CACHE ANALYTICS APPROACH:
 * - Track cache hits/misses per recipe and question type
 * - Monitor static response effectiveness vs. cached responses
 * - Calculate cost savings: (cache_hits * avg_api_cost) = total_saved
 * - Identify cache optimization opportunities (low hit rate patterns)
 *
 * PRIVACY & PERFORMANCE:
 * - Store only normalized questions (no personal data)
 * - Aggregate metrics by time periods (daily/monthly)
 * - Minimal localStorage usage with size limits
 * - Optional verbose logging for development debugging
 */

/**
 * Individual question analytics data
 */
export interface QuestionMetric {
  count: number;
  lastAsked: number;
  recipeIds: string[];
  normalizedForm: string;
}

/**
 * Cache performance data for a specific time period
 */
export interface CacheMetrics {
  hits: number;
  misses: number;
  costSaved: number;
  requestCount: number;
}

/**
 * Daily cache metrics with date tracking
 */
export interface DailyCacheMetrics extends CacheMetrics {
  date: string; // YYYY-MM-DD format
}

/**
 * Monthly cache metrics with month tracking
 */
export interface MonthlyCacheMetrics extends CacheMetrics {
  month: string; // YYYY-MM format
}

/**
 * Complete analytics data structure
 */
export interface AnalyticsData {
  version: string;
  questionFrequencies: {
    [recipeId: string]: {
      [normalizedQuestion: string]: number;
    };
  };
  globalQuestions: {
    [normalizedQuestion: string]: QuestionMetric;
  };
  cacheMetrics: {
    current: CacheMetrics;
    daily: {
      [date: string]: DailyCacheMetrics;
    };
    monthly: {
      [month: string]: MonthlyCacheMetrics;
    };
  };
  lastRollup: {
    daily: number;
    monthly: number;
  };
  totalSizeBytes: number;
}

/**
 * Analytics export structure for manual analysis
 */
export interface AnalyticsExport {
  exportDate: string;
  summary: {
    totalQuestions: number;
    totalRecipes: number;
    cacheEffectiveness: number;
    costSavings: number;
    topQuestions: Array<{
      question: string;
      count: number;
      recipes: number;
    }>;
  };
  data: AnalyticsData;
}

/**
 * Cache effectiveness calculation result
 */
export interface CacheEffectiveness {
  hitRate: number; // 0-100 percentage
  totalRequests: number;
  hits: number;
  misses: number;
  costSaved: number;
  dailyHitRate?: number;
  monthlyHitRate?: number;
}

/**
 * AI Analytics Service Interface
 */
export interface AIAnalyticsService {
  trackQuestion(question: string, recipeId: string, normalizedQuestion?: string): void;
  trackCacheHit(recipeId: string, question: string): void;
  trackCacheMiss(recipeId: string, question: string): void;
  trackStaticResponseHit(recipeId: string, question: string): void;
  getCacheEffectiveness(): CacheEffectiveness;
  getTopQuestions(limit?: number): Array<{
    question: string;
    count: number;
    recipes: number;
    lastAsked: Date;
  }>;
  getTopQuestionsForRecipe(
    recipeId: string,
    limit?: number
  ): Array<{
    question: string;
    count: number;
  }>;
  calculateCostSavings(): number;
  exportAnalytics(): AnalyticsExport;
  performDailyRollup(): void;
  performMonthlyRollup(): void;
  cleanup(): void;
  getStats(): {
    totalQuestions: number;
    totalRecipes: number;
    storageSize: number;
    oldestEntry?: Date;
    newestEntry?: Date;
  };
}

/**
 * Implementation of AI Analytics Service using localStorage
 */
class AIAnalyticsServiceImpl implements AIAnalyticsService {
  private static readonly STORAGE_KEY = 'ai_analytics_data';
  private static readonly ANALYTICS_VERSION = '1.0.0';
  private static readonly MAX_STORAGE_SIZE = 1024 * 1024; // 1MB limit
  private static readonly COST_PER_REQUEST = 0.001; // $0.001 per saved request
  private static readonly MAX_DAILY_ENTRIES = 30; // Keep 30 days
  private static readonly MAX_MONTHLY_ENTRIES = 12; // Keep 12 months
  private static readonly REQUEST_COUNTER_KEY = 'ai_analytics_request_counter';

  private isStorageAvailable: boolean;
  private requestCounter = 0;

  constructor() {
    this.isStorageAvailable = this.checkStorageAvailability();
    this.requestCounter = this.loadRequestCounter();

    if (this.isStorageAvailable) {
      this.performMaintenanceTasks();
    }
  }

  /**
   * Check if localStorage is available and functional with quota validation
   */
  private checkStorageAvailability(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      const testKey = `${AIAnalyticsServiceImpl.STORAGE_KEY}_test`;
      const testValue = 'test';

      // Check if we have enough space for the test
      const testSize =
        StorageQuotaManager.calculateStringSize(testKey) +
        StorageQuotaManager.calculateStringSize(testValue);

      if (!StorageQuotaManager.hasStorageSpace(testSize)) {
        console.warn('localStorage quota exceeded for AI analytics service');
        // Try to free up some space
        StorageQuotaManager.freeUpSpace(testSize, {
          pattern: /^ai_analytics_/,
          removalStrategy: 'oldest',
        });
      }

      window.localStorage.setItem(testKey, testValue);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('localStorage not available for AI analytics service:', error);
      return false;
    }
  }

  /**
   * Load request counter for development logging
   */
  private loadRequestCounter(): number {
    if (!this.isStorageAvailable) return 0;

    try {
      const stored = window.localStorage.getItem(AIAnalyticsServiceImpl.REQUEST_COUNTER_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Save request counter with quota checking
   */
  private async saveRequestCounter(): Promise<void> {
    if (!this.isStorageAvailable) return;

    const success = await StorageQuotaManager.safeSetItem(
      AIAnalyticsServiceImpl.REQUEST_COUNTER_KEY,
      this.requestCounter.toString(),
      {
        onQuotaExceeded: () => {
          console.warn('Storage quota exceeded for request counter');
        },
      }
    );

    if (!success) {
      console.warn('Failed to save request counter due to storage constraints');
    }
  }

  /**
   * Load analytics data from localStorage
   */
  private loadData(): AnalyticsData {
    if (!this.isStorageAvailable) {
      return this.createEmptyData();
    }

    try {
      const stored = window.localStorage.getItem(AIAnalyticsServiceImpl.STORAGE_KEY);
      if (!stored) {
        return this.createEmptyData();
      }

      const parsed = JSON.parse(stored) as AnalyticsData;

      // Validate version and structure
      if (!parsed.version || parsed.version !== AIAnalyticsServiceImpl.ANALYTICS_VERSION) {
        console.warn('Analytics data version mismatch, creating new data');
        return this.createEmptyData();
      }

      return parsed;
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      return this.createEmptyData();
    }
  }

  /**
   * Save analytics data to localStorage with quota checking
   */
  private async saveData(data: AnalyticsData): Promise<void> {
    if (!this.isStorageAvailable) return;

    try {
      // Update size tracking
      data.totalSizeBytes = this.calculateDataSize(data);

      // Check size limit
      if (data.totalSizeBytes > AIAnalyticsServiceImpl.MAX_STORAGE_SIZE) {
        this.enforceStorageLimit(data);
      }

      const jsonData = JSON.stringify(data);
      const success = await StorageQuotaManager.safeSetItem(
        AIAnalyticsServiceImpl.STORAGE_KEY,
        jsonData,
        {
          maxRetries: 3,
          onQuotaExceeded: () => {
            console.warn('Analytics storage quota exceeded, performing cleanup');
            this.handleQuotaExceeded(data);
          },
        }
      );

      if (!success) {
        console.error('Failed to save analytics after quota management');
        // Try one more time after aggressive cleanup
        await StorageQuotaManager.freeUpSpace(
          StorageQuotaManager.calculateStringSize(AIAnalyticsServiceImpl.STORAGE_KEY) +
            StorageQuotaManager.calculateStringSize(jsonData),
          {
            pattern: /^ai_/,
            removalStrategy: 'oldest',
          }
        );
      }
    } catch (error) {
      console.error('Failed to save analytics data:', error);
    }
  }

  /**
   * Create empty analytics data structure
   */
  private createEmptyData(): AnalyticsData {
    return {
      version: AIAnalyticsServiceImpl.ANALYTICS_VERSION,
      questionFrequencies: {},
      globalQuestions: {},
      cacheMetrics: {
        current: {
          hits: 0,
          misses: 0,
          costSaved: 0,
          requestCount: 0,
        },
        daily: {},
        monthly: {},
      },
      lastRollup: {
        daily: Date.now(),
        monthly: Date.now(),
      },
      totalSizeBytes: 0,
    };
  }

  /**
   * Calculate data size in bytes
   */
  private calculateDataSize(data: AnalyticsData): number {
    try {
      const serialized = JSON.stringify(data);
      return new TextEncoder().encode(serialized).length;
    } catch {
      return 0;
    }
  }

  /**
   * Enforce storage size limit by removing old data
   */
  private enforceStorageLimit(data: AnalyticsData): void {
    // Remove old daily entries first
    const dailyDates = Object.keys(data.cacheMetrics.daily).sort();
    while (dailyDates.length > AIAnalyticsServiceImpl.MAX_DAILY_ENTRIES) {
      const oldestDate = dailyDates.shift()!;
      delete data.cacheMetrics.daily[oldestDate];
    }

    // Remove old monthly entries
    const monthlyKeys = Object.keys(data.cacheMetrics.monthly).sort();
    while (monthlyKeys.length > AIAnalyticsServiceImpl.MAX_MONTHLY_ENTRIES) {
      const oldestMonth = monthlyKeys.shift()!;
      delete data.cacheMetrics.monthly[oldestMonth];
    }

    // If still too large, remove oldest global questions
    if (this.calculateDataSize(data) > AIAnalyticsServiceImpl.MAX_STORAGE_SIZE) {
      const questions = Object.entries(data.globalQuestions).sort(
        (a, b) => a[1].lastAsked - b[1].lastAsked
      );

      // Remove 25% of oldest questions
      const toRemove = Math.ceil(questions.length * 0.25);
      for (let i = 0; i < toRemove; i++) {
        delete data.globalQuestions[questions[i][0]];
      }
    }
  }

  /**
   * Handle quota exceeded error
   */
  private handleQuotaExceeded(data: AnalyticsData): void {
    try {
      // Aggressive cleanup - keep only current month and recent data
      const currentMonth = new Date().toISOString().slice(0, 7);
      const currentDate = new Date().toISOString().slice(0, 10);

      // Keep only current month for monthly data
      const monthlyData = data.cacheMetrics.monthly[currentMonth];
      data.cacheMetrics.monthly = monthlyData ? { [currentMonth]: monthlyData } : {};

      // Keep only last 7 days for daily data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().slice(0, 10);
      });

      const newDaily: typeof data.cacheMetrics.daily = {};
      for (const date of last7Days) {
        if (data.cacheMetrics.daily[date]) {
          newDaily[date] = data.cacheMetrics.daily[date];
        }
      }
      data.cacheMetrics.daily = newDaily;

      // Keep only top 50% most frequent global questions
      const questions = Object.entries(data.globalQuestions)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, Math.ceil(Object.keys(data.globalQuestions).length * 0.5));

      data.globalQuestions = Object.fromEntries(questions);

      // Try to save again with quota management
      const jsonData = JSON.stringify(data);
      StorageQuotaManager.safeSetItem(AIAnalyticsServiceImpl.STORAGE_KEY, jsonData, {
        maxRetries: 1,
      }).catch(() => {
        console.error('Failed to save after quota cleanup, clearing all data');
        this.clearAllData();
      });
    } catch (retryError) {
      console.error('Failed to handle analytics quota exceeded:', retryError);
      // Clear all analytics as last resort
      this.clearAllData();
    }
  }

  /**
   * Clear all analytics data
   */
  private clearAllData(): void {
    if (!this.isStorageAvailable) return;

    try {
      window.localStorage.removeItem(AIAnalyticsServiceImpl.STORAGE_KEY);
      window.localStorage.removeItem(AIAnalyticsServiceImpl.REQUEST_COUNTER_KEY);
    } catch (error) {
      console.error('Failed to clear analytics data:', error);
    }
  }

  /**
   * Perform maintenance tasks on startup
   */
  private performMaintenanceTasks(): void {
    const data = this.loadData();
    const now = Date.now();

    // Check if daily rollup is needed (once per day)
    if (now - data.lastRollup.daily > 24 * 60 * 60 * 1000) {
      this.performDailyRollup();
    }

    // Check if monthly rollup is needed (once per month)
    if (now - data.lastRollup.monthly > 30 * 24 * 60 * 60 * 1000) {
      this.performMonthlyRollup();
    }
  }

  /**
   * Get today's date string in YYYY-MM-DD format
   */
  private getTodayString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  /**
   * Get current month string in YYYY-MM format
   */
  private getCurrentMonthString(): string {
    return new Date().toISOString().slice(0, 7);
  }

  /**
   * Track a question being asked
   */
  trackQuestion(question: string, recipeId: string, normalizedQuestion?: string): void {
    if (!question?.trim() || !recipeId?.trim()) {
      return;
    }

    // Skip tracking if localStorage is not available (but don't error)
    if (!this.isStorageAvailable) {
      return;
    }

    try {
      const data = this.loadData();
      const normalized = normalizedQuestion || question.toLowerCase().trim();
      const now = Date.now();

      // Track per-recipe frequency
      if (!data.questionFrequencies[recipeId]) {
        data.questionFrequencies[recipeId] = {};
      }
      data.questionFrequencies[recipeId][normalized] =
        (data.questionFrequencies[recipeId][normalized] || 0) + 1;

      // Track global question patterns
      if (!data.globalQuestions[normalized]) {
        data.globalQuestions[normalized] = {
          count: 0,
          lastAsked: now,
          recipeIds: [],
          normalizedForm: normalized,
        };
      }

      const globalQuestion = data.globalQuestions[normalized];
      globalQuestion.count += 1;
      globalQuestion.lastAsked = now;

      // Add recipe ID if not already tracked
      if (!globalQuestion.recipeIds.includes(recipeId)) {
        globalQuestion.recipeIds.push(recipeId);
      }

      this.saveData(data);
    } catch (error) {
      console.error('Failed to track question:', error);
    }
  }

  /**
   * Track a cache hit
   */
  trackCacheHit(recipeId: string, question: string): void {
    this.trackCacheEvent('hit', recipeId, question);
  }

  /**
   * Track a cache miss
   */
  trackCacheMiss(recipeId: string, question: string): void {
    this.trackCacheEvent('miss', recipeId, question);
  }

  /**
   * Track a static response hit (counts as cache hit for cost savings)
   */
  trackStaticResponseHit(recipeId: string, question: string): void {
    this.trackCacheEvent('hit', recipeId, question);
  }

  /**
   * Track cache events (hits/misses)
   */
  private trackCacheEvent(type: 'hit' | 'miss', recipeId: string, question: string): void {
    // Skip tracking if localStorage is not available (but don't error)
    if (!this.isStorageAvailable) return;

    try {
      const data = this.loadData();
      const today = this.getTodayString();
      const currentMonth = this.getCurrentMonthString();

      // Update current metrics
      if (type === 'hit') {
        data.cacheMetrics.current.hits += 1;
        data.cacheMetrics.current.costSaved += AIAnalyticsServiceImpl.COST_PER_REQUEST;
      } else {
        data.cacheMetrics.current.misses += 1;
      }
      data.cacheMetrics.current.requestCount += 1;

      // Update daily metrics
      if (!data.cacheMetrics.daily[today]) {
        data.cacheMetrics.daily[today] = {
          date: today,
          hits: 0,
          misses: 0,
          costSaved: 0,
          requestCount: 0,
        };
      }

      const dailyMetrics = data.cacheMetrics.daily[today];
      if (type === 'hit') {
        dailyMetrics.hits += 1;
        dailyMetrics.costSaved += AIAnalyticsServiceImpl.COST_PER_REQUEST;
      } else {
        dailyMetrics.misses += 1;
      }
      dailyMetrics.requestCount += 1;

      // Update monthly metrics
      if (!data.cacheMetrics.monthly[currentMonth]) {
        data.cacheMetrics.monthly[currentMonth] = {
          month: currentMonth,
          hits: 0,
          misses: 0,
          costSaved: 0,
          requestCount: 0,
        };
      }

      const monthlyMetrics = data.cacheMetrics.monthly[currentMonth];
      if (type === 'hit') {
        monthlyMetrics.hits += 1;
        monthlyMetrics.costSaved += AIAnalyticsServiceImpl.COST_PER_REQUEST;
      } else {
        monthlyMetrics.misses += 1;
      }
      monthlyMetrics.requestCount += 1;

      this.saveData(data);

      // Development mode logging every 10th request
      this.requestCounter += 1;
      this.saveRequestCounter();

      if (process.env.NODE_ENV === 'development' && this.requestCounter % 10 === 0) {
        const effectiveness = this.getCacheEffectiveness();
        console.log(`🔍 AI Cache Analytics (Request #${this.requestCounter}):`, {
          hitRate: `${effectiveness.hitRate.toFixed(1)}%`,
          totalRequests: effectiveness.totalRequests,
          costSaved: `$${effectiveness.costSaved.toFixed(4)}`,
          event: type,
          recipe: recipeId,
          question: question.slice(0, 50) + (question.length > 50 ? '...' : ''),
        });
      }
    } catch (error) {
      console.error('Failed to track cache event:', error);
    }
  }

  /**
   * Calculate cache effectiveness
   */
  getCacheEffectiveness(): CacheEffectiveness {
    if (!this.isStorageAvailable) {
      return {
        hitRate: 0,
        totalRequests: 0,
        hits: 0,
        misses: 0,
        costSaved: 0,
      };
    }

    const data = this.loadData();
    const current = data.cacheMetrics.current;
    const totalRequests = current.hits + current.misses;

    const effectiveness: CacheEffectiveness = {
      hitRate: totalRequests > 0 ? (current.hits / totalRequests) * 100 : 0,
      totalRequests,
      hits: current.hits,
      misses: current.misses,
      costSaved: current.costSaved,
    };

    // Add daily effectiveness if available
    const today = this.getTodayString();
    const todayMetrics = data.cacheMetrics.daily[today];
    if (todayMetrics) {
      const dailyTotal = todayMetrics.hits + todayMetrics.misses;
      effectiveness.dailyHitRate = dailyTotal > 0 ? (todayMetrics.hits / dailyTotal) * 100 : 0;
    }

    // Add monthly effectiveness if available
    const currentMonth = this.getCurrentMonthString();
    const monthlyMetrics = data.cacheMetrics.monthly[currentMonth];
    if (monthlyMetrics) {
      const monthlyTotal = monthlyMetrics.hits + monthlyMetrics.misses;
      effectiveness.monthlyHitRate =
        monthlyTotal > 0 ? (monthlyMetrics.hits / monthlyTotal) * 100 : 0;
    }

    return effectiveness;
  }

  /**
   * Get top questions across all recipes
   */
  getTopQuestions(limit: number = 10): Array<{
    question: string;
    count: number;
    recipes: number;
    lastAsked: Date;
  }> {
    if (!this.isStorageAvailable) return [];

    try {
      const data = this.loadData();
      return Object.entries(data.globalQuestions)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, limit)
        .map(([question, metric]) => ({
          question,
          count: metric.count,
          recipes: metric.recipeIds.length,
          lastAsked: new Date(metric.lastAsked),
        }));
    } catch (error) {
      console.error('Failed to get top questions:', error);
      return [];
    }
  }

  /**
   * Get top questions for a specific recipe
   */
  getTopQuestionsForRecipe(
    recipeId: string,
    limit: number = 10
  ): Array<{
    question: string;
    count: number;
  }> {
    if (!this.isStorageAvailable || !recipeId) return [];

    try {
      const data = this.loadData();
      const recipeQuestions = data.questionFrequencies[recipeId];

      if (!recipeQuestions) return [];

      return Object.entries(recipeQuestions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([question, count]) => ({
          question,
          count,
        }));
    } catch (error) {
      console.error('Failed to get recipe questions:', error);
      return [];
    }
  }

  /**
   * Calculate total cost savings
   */
  calculateCostSavings(): number {
    if (!this.isStorageAvailable) return 0;

    try {
      const data = this.loadData();
      return data.cacheMetrics.current.costSaved;
    } catch (error) {
      console.error('Failed to calculate cost savings:', error);
      return 0;
    }
  }

  /**
   * Export analytics data for manual analysis
   */
  exportAnalytics(): AnalyticsExport {
    const data = this.loadData();
    const effectiveness = this.getCacheEffectiveness();
    const topQuestions = this.getTopQuestions(20);

    return {
      exportDate: new Date().toISOString(),
      summary: {
        totalQuestions: Object.keys(data.globalQuestions).length,
        totalRecipes: Object.keys(data.questionFrequencies).length,
        cacheEffectiveness: effectiveness.hitRate,
        costSavings: effectiveness.costSaved,
        topQuestions: topQuestions.map((q) => ({
          question: q.question,
          count: q.count,
          recipes: q.recipes,
        })),
      },
      data,
    };
  }

  /**
   * Perform daily rollup
   */
  performDailyRollup(): void {
    if (!this.isStorageAvailable) return;

    try {
      const data = this.loadData();
      const dailyDates = Object.keys(data.cacheMetrics.daily).sort();

      // Keep only last MAX_DAILY_ENTRIES days
      while (dailyDates.length > AIAnalyticsServiceImpl.MAX_DAILY_ENTRIES) {
        const oldestDate = dailyDates.shift()!;
        delete data.cacheMetrics.daily[oldestDate];
      }

      data.lastRollup.daily = Date.now();
      this.saveData(data);

      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics daily rollup completed');
      }
    } catch (error) {
      console.error('Failed to perform daily rollup:', error);
    }
  }

  /**
   * Perform monthly rollup
   */
  performMonthlyRollup(): void {
    if (!this.isStorageAvailable) return;

    try {
      const data = this.loadData();
      const monthlyKeys = Object.keys(data.cacheMetrics.monthly).sort();

      // Keep only last MAX_MONTHLY_ENTRIES months
      while (monthlyKeys.length > AIAnalyticsServiceImpl.MAX_MONTHLY_ENTRIES) {
        const oldestMonth = monthlyKeys.shift()!;
        delete data.cacheMetrics.monthly[oldestMonth];
      }

      data.lastRollup.monthly = Date.now();
      this.saveData(data);

      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics monthly rollup completed');
      }
    } catch (error) {
      console.error('Failed to perform monthly rollup:', error);
    }
  }

  /**
   * Clean up analytics service
   */
  cleanup(): void {
    // Perform final rollups
    this.performDailyRollup();
    this.performMonthlyRollup();
  }

  /**
   * Get analytics statistics
   */
  getStats(): {
    totalQuestions: number;
    totalRecipes: number;
    storageSize: number;
    oldestEntry?: Date;
    newestEntry?: Date;
  } {
    if (!this.isStorageAvailable) {
      return {
        totalQuestions: 0,
        totalRecipes: 0,
        storageSize: 0,
      };
    }

    try {
      const data = this.loadData();
      const questions = Object.values(data.globalQuestions);

      return {
        totalQuestions: questions.length,
        totalRecipes: Object.keys(data.questionFrequencies).length,
        storageSize: data.totalSizeBytes,
        oldestEntry:
          questions.length > 0
            ? new Date(Math.min(...questions.map((q) => q.lastAsked)))
            : undefined,
        newestEntry:
          questions.length > 0
            ? new Date(Math.max(...questions.map((q) => q.lastAsked)))
            : undefined,
      };
    } catch (error) {
      console.error('Failed to get analytics stats:', error);
      return {
        totalQuestions: 0,
        totalRecipes: 0,
        storageSize: 0,
      };
    }
  }
}

/**
 * Singleton instance for AI analytics service
 */
let aiAnalyticsServiceInstance: AIAnalyticsServiceImpl | null = null;

/**
 * Get the AI analytics service instance
 */
export function getAIAnalyticsService(): AIAnalyticsService {
  if (!aiAnalyticsServiceInstance) {
    aiAnalyticsServiceInstance = new AIAnalyticsServiceImpl();
  }
  return aiAnalyticsServiceInstance;
}

/**
 * Reset the AI analytics service instance (useful for testing)
 */
export function resetAIAnalyticsService(): void {
  if (aiAnalyticsServiceInstance) {
    aiAnalyticsServiceInstance.cleanup();
  }
  aiAnalyticsServiceInstance = null;
}

/**
 * Utility function to format analytics data for display
 */
export function formatAnalyticsForDisplay(analytics: AnalyticsExport) {
  return {
    summary: `Total Questions: ${analytics.summary.totalQuestions}, Cache Hit Rate: ${analytics.summary.cacheEffectiveness.toFixed(1)}%, Cost Saved: $${analytics.summary.costSavings.toFixed(4)}`,
    topQuestions: analytics.summary.topQuestions
      .slice(0, 5)
      .map((q) => `"${q.question}" (${q.count}x across ${q.recipes} recipes)`)
      .join('\n'),
    exportDate: analytics.exportDate,
  };
}

export default AIAnalyticsServiceImpl;
