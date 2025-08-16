import { useEffect, useState, useCallback, useRef } from 'react';
import {
  getAIPreloaderService,
  type PreloadConfig,
  type PreloadStatus,
} from '@meal-plan/shared/utils/ai-preloader';

/**
 * Hook options for recipe preloader
 */
export interface UseRecipePreloaderOptions {
  /**
   * Whether to automatically start preloading on mount
   * @default true
   */
  autoStart?: boolean;

  /**
   * Preload configuration
   */
  config?: PreloadConfig;

  /**
   * Whether to enable the preloader (useful for feature flags)
   * @default true
   */
  enabled?: boolean;

  /**
   * Callback when preloading completes successfully
   */
  onCompleted?: (recipeId: string, questionsPreloaded: number) => void;

  /**
   * Callback when preloading fails
   */
  onError?: (recipeId: string, error: string) => void;

  /**
   * Debounce delay for recipe ID changes (in ms)
   * @default 500
   */
  debounceDelay?: number;
}

/**
 * Hook return value
 */
export interface UseRecipePreloaderReturn {
  /**
   * Current preload status
   */
  preloadStatus: PreloadStatus['status'];

  /**
   * Preload progress (0-100)
   */
  progress: number;

  /**
   * Number of questions successfully preloaded
   */
  preloadedCount: number;

  /**
   * Total number of questions to preload
   */
  totalQuestions: number;

  /**
   * Error message if preloading failed
   */
  error?: string;

  /**
   * Whether preloading is currently active
   */
  isLoading: boolean;

  /**
   * Whether preloading completed successfully
   */
  isCompleted: boolean;

  /**
   * Whether preloading failed
   */
  hasError: boolean;

  /**
   * Manually start preloading
   */
  startPreload: () => Promise<void>;

  /**
   * Cancel current preloading operation
   */
  cancelPreload: () => void;

  /**
   * Restart preloading (cancel + start)
   */
  restartPreload: () => Promise<void>;
}

/**
 * React hook for recipe AI question preloading
 *
 * Automatically preloads top questions for a recipe when mounted,
 * with proper cleanup and cancellation on unmount or recipe change.
 */
export function useRecipePreloader(
  recipeId: string | undefined,
  options: UseRecipePreloaderOptions = {}
): UseRecipePreloaderReturn {
  const {
    autoStart = true,
    config,
    enabled = true,
    onCompleted,
    onError,
    debounceDelay = 500,
  } = options;

  const [status, setStatus] = useState<PreloadStatus>({
    status: 'idle',
    progress: 0,
    questionsPreloaded: 0,
    totalQuestions: 0,
  });

  const preloaderService = useRef(getAIPreloaderService());
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const statusPollingRef = useRef<NodeJS.Timeout>();
  const isUnmountedRef = useRef(false);
  const lastRecipeIdRef = useRef<string>();

  /**
   * Poll preload status updates
   */
  const pollStatus = useCallback(
    (currentRecipeId: string) => {
      if (isUnmountedRef.current || !currentRecipeId) return;

      const currentStatus = preloaderService.current.getPreloadStatus(currentRecipeId);

      if (!isUnmountedRef.current) {
        setStatus(currentStatus);

        // Handle completion
        if (currentStatus.status === 'completed' && onCompleted) {
          onCompleted(currentRecipeId, currentStatus.questionsPreloaded);
        }

        // Handle error
        if (currentStatus.status === 'error' && onError && currentStatus.error) {
          onError(currentRecipeId, currentStatus.error);
        }

        // Continue polling if still loading
        if (currentStatus.status === 'loading') {
          statusPollingRef.current = setTimeout(() => pollStatus(currentRecipeId), 1000);
        }
      }
    },
    [onCompleted, onError]
  );

  /**
   * Start preloading for current recipe
   */
  const startPreload = useCallback(async () => {
    if (!enabled || !recipeId || isUnmountedRef.current) {
      return;
    }

    try {
      // Update status to loading immediately
      setStatus((prev) => ({
        ...prev,
        status: 'loading',
        error: undefined,
      }));

      // Start preloading
      await preloaderService.current.preloadRecipeQuestions(recipeId, config);

      // Start polling for status updates
      pollStatus(recipeId);
    } catch (error) {
      if (!isUnmountedRef.current) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setStatus((prev) => ({
          ...prev,
          status: 'error',
          error: errorMessage,
        }));

        if (onError) {
          onError(recipeId, errorMessage);
        }
      }
    }
  }, [enabled, recipeId, config, pollStatus, onError]);

  /**
   * Cancel current preloading
   */
  const cancelPreload = useCallback(() => {
    if (lastRecipeIdRef.current) {
      preloaderService.current.cancelPreload(lastRecipeIdRef.current);
    }

    // Clear polling timeout
    if (statusPollingRef.current) {
      clearTimeout(statusPollingRef.current);
      statusPollingRef.current = undefined;
    }

    if (!isUnmountedRef.current) {
      setStatus((prev) => ({
        ...prev,
        status: prev.status === 'loading' ? 'cancelled' : prev.status,
      }));
    }
  }, []);

  /**
   * Restart preloading (cancel + start)
   */
  const restartPreload = useCallback(async () => {
    cancelPreload();
    await startPreload();
  }, [cancelPreload, startPreload]);

  /**
   * Handle recipe ID changes with debouncing
   */
  useEffect(() => {
    // Clear any existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Cancel preload for previous recipe
    if (lastRecipeIdRef.current && lastRecipeIdRef.current !== recipeId) {
      preloaderService.current.cancelPreload(lastRecipeIdRef.current);
    }

    // Clear polling timeout
    if (statusPollingRef.current) {
      clearTimeout(statusPollingRef.current);
      statusPollingRef.current = undefined;
    }

    // Reset status for new recipe
    if (recipeId !== lastRecipeIdRef.current) {
      setStatus({
        status: 'idle',
        progress: 0,
        questionsPreloaded: 0,
        totalQuestions: 0,
      });
    }

    lastRecipeIdRef.current = recipeId;

    // Start preloading if enabled and auto-start is on
    if (enabled && autoStart && recipeId) {
      debounceTimeoutRef.current = setTimeout(() => {
        if (!isUnmountedRef.current && recipeId === lastRecipeIdRef.current) {
          startPreload();
        }
      }, debounceDelay);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [recipeId, enabled, autoStart, debounceDelay, startPreload]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;

      // Cancel current preload
      if (lastRecipeIdRef.current) {
        preloaderService.current.cancelPreload(lastRecipeIdRef.current);
      }

      // Clear timeouts
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (statusPollingRef.current) {
        clearTimeout(statusPollingRef.current);
      }
    };
  }, []);

  // Derived state
  const isLoading = status.status === 'loading';
  const isCompleted = status.status === 'completed';
  const hasError = status.status === 'error';

  return {
    preloadStatus: status.status,
    progress: status.progress,
    preloadedCount: status.questionsPreloaded,
    totalQuestions: status.totalQuestions,
    error: status.error,
    isLoading,
    isCompleted,
    hasError,
    startPreload,
    cancelPreload,
    restartPreload,
  };
}

/**
 * Lightweight hook for hover-based preloading
 * Only starts preloading on hover, with lower priority
 */
export function useRecipeHoverPreloader(recipeId: string | undefined, enabled: boolean = true) {
  const { startPreload, cancelPreload, isLoading } = useRecipePreloader(recipeId, {
    autoStart: false,
    enabled,
    config: {
      maxQuestions: 2, // Fewer questions for hover
      staggerDelay: 2000, // Longer delay for hover
      priority: 'low',
      timeout: 20000, // Shorter timeout for hover
    },
  });

  const onMouseEnter = useCallback(() => {
    if (enabled && recipeId && !isLoading) {
      startPreload();
    }
  }, [enabled, recipeId, isLoading, startPreload]);

  const onMouseLeave = useCallback(() => {
    // Don't cancel on mouse leave - let it continue in background
  }, []);

  return {
    onMouseEnter,
    onMouseLeave,
    isPreloading: isLoading,
  };
}

export default useRecipePreloader;
