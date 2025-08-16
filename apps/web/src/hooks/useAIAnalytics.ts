/**
 * React hook for accessing AI analytics data
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getAIAnalyticsService,
  type CacheEffectiveness,
  type AnalyticsExport,
} from '@repo/shared/utils/ai-analytics';

/**
 * Analytics data for display in components
 */
export interface AnalyticsDisplayData {
  cacheEffectiveness: CacheEffectiveness;
  topQuestions: Array<{
    question: string;
    count: number;
    recipes: number;
    lastAsked: Date;
  }>;
  stats: {
    totalQuestions: number;
    totalRecipes: number;
    storageSize: number;
    oldestEntry?: Date;
    newestEntry?: Date;
  };
  costSavings: number;
}

/**
 * Hook options for customizing analytics behavior
 */
export interface UseAnalyticsOptions {
  /** Automatically refresh data at this interval (milliseconds) */
  refreshInterval?: number;
  /** Number of top questions to fetch */
  topQuestionsLimit?: number;
  /** Enable real-time updates */
  realTimeUpdates?: boolean;
}

/**
 * React hook for AI analytics data with real-time updates
 */
export function useAIAnalytics(options: UseAnalyticsOptions = {}) {
  const {
    refreshInterval = 30000, // 30 seconds default
    topQuestionsLimit = 10,
    realTimeUpdates = false,
  } = options;

  const [analyticsData, setAnalyticsData] = useState<AnalyticsDisplayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch current analytics data
   */
  const fetchAnalyticsData = useCallback(async (): Promise<AnalyticsDisplayData> => {
    try {
      const analytics = getAIAnalyticsService();

      const [cacheEffectiveness, topQuestions, stats, costSavings] = await Promise.all([
        Promise.resolve(analytics.getCacheEffectiveness()),
        Promise.resolve(analytics.getTopQuestions(topQuestionsLimit)),
        Promise.resolve(analytics.getStats()),
        Promise.resolve(analytics.calculateCostSavings()),
      ]);

      return {
        cacheEffectiveness,
        topQuestions,
        stats,
        costSavings,
      };
    } catch (err) {
      throw new Error(
        `Failed to fetch analytics data: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  }, [topQuestionsLimit]);

  /**
   * Refresh analytics data
   */
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAnalyticsData();
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [fetchAnalyticsData]);

  /**
   * Export analytics data for download
   */
  const exportAnalytics = useCallback((): AnalyticsExport => {
    const analytics = getAIAnalyticsService();
    return analytics.exportAnalytics();
  }, []);

  /**
   * Get top questions for a specific recipe
   */
  const getRecipeQuestions = useCallback((recipeId: string, limit = 5) => {
    const analytics = getAIAnalyticsService();
    return analytics.getTopQuestionsForRecipe(recipeId, limit);
  }, []);

  /**
   * Trigger manual cleanup/rollup
   */
  const performMaintenance = useCallback(() => {
    const analytics = getAIAnalyticsService();
    analytics.performDailyRollup();
    analytics.performMonthlyRollup();

    // Refresh data after maintenance
    refreshData();
  }, [refreshData]);

  /**
   * Initial data fetch
   */
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  /**
   * Set up refresh interval
   */
  useEffect(() => {
    if (!realTimeUpdates || !refreshInterval) return;

    const interval = setInterval(refreshData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshData, refreshInterval, realTimeUpdates]);

  /**
   * Listen for storage events for real-time updates
   */
  useEffect(() => {
    if (!realTimeUpdates) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'ai_analytics_data') {
        // Analytics data changed, refresh
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [realTimeUpdates, refreshData]);

  return {
    /** Current analytics data */
    data: analyticsData,
    /** Loading state */
    loading,
    /** Error message if any */
    error,
    /** Manually refresh data */
    refresh: refreshData,
    /** Export analytics data for download */
    exportData: exportAnalytics,
    /** Get top questions for specific recipe */
    getRecipeQuestions,
    /** Perform maintenance tasks */
    performMaintenance,
    /** Current cache effectiveness percentage */
    hitRate: analyticsData?.cacheEffectiveness.hitRate ?? 0,
    /** Total cost savings */
    totalSavings: analyticsData?.costSavings ?? 0,
    /** Total questions tracked */
    totalQuestions: analyticsData?.stats.totalQuestions ?? 0,
    /** Total recipes with questions */
    totalRecipes: analyticsData?.stats.totalRecipes ?? 0,
  };
}

/**
 * Simplified hook for basic cache effectiveness monitoring
 */
export function useCacheEffectiveness() {
  const [effectiveness, setEffectiveness] = useState<CacheEffectiveness | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const updateEffectiveness = useCallback(() => {
    try {
      const analytics = getAIAnalyticsService();
      const current = analytics.getCacheEffectiveness();
      setEffectiveness(current);
      setLastUpdate(new Date());
    } catch (error) {
      console.warn('Failed to update cache effectiveness:', error);
    }
  }, []);

  useEffect(() => {
    updateEffectiveness();

    // Update every 60 seconds
    const interval = setInterval(updateEffectiveness, 60000);
    return () => clearInterval(interval);
  }, [updateEffectiveness]);

  return {
    /** Current cache effectiveness */
    effectiveness,
    /** Last update timestamp */
    lastUpdate,
    /** Manually trigger update */
    update: updateEffectiveness,
    /** Hit rate as percentage (0-100) */
    hitRate: effectiveness?.hitRate ?? 0,
    /** Total requests processed */
    totalRequests: effectiveness?.totalRequests ?? 0,
    /** Total cost saved */
    costSaved: effectiveness?.costSaved ?? 0,
  };
}

/**
 * Hook for monitoring question patterns for a specific recipe
 */
export function useRecipeQuestionAnalytics(recipeId: string, limit = 5) {
  const [questions, setQuestions] = useState<
    Array<{
      question: string;
      count: number;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  const refreshQuestions = useCallback(() => {
    if (!recipeId) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const analytics = getAIAnalyticsService();
      const recipeQuestions = analytics.getTopQuestionsForRecipe(recipeId, limit);
      setQuestions(recipeQuestions);
    } catch (error) {
      console.warn('Failed to fetch recipe questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [recipeId, limit]);

  useEffect(() => {
    refreshQuestions();
  }, [refreshQuestions]);

  return {
    /** Top questions for this recipe */
    questions,
    /** Loading state */
    loading,
    /** Refresh questions data */
    refresh: refreshQuestions,
    /** Most popular question */
    topQuestion: questions[0] || null,
  };
}

export default useAIAnalytics;
