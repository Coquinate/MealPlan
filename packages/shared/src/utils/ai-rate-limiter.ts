interface RateLimitData {
  requestCount: number;
  windowStart: number;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  dailyCount?: number;
  dailyWindowStart?: number;
}

interface TierLimits {
  requestsPerMinute: number;
  requestsPerDay?: number;
  burstAllowance?: number;
}

const TIER_LIMITS: Record<string, TierLimits> = {
  free: {
    requestsPerMinute: 15,
    requestsPerDay: 500,
    burstAllowance: 5,
  },
  basic: {
    requestsPerMinute: 30,
    requestsPerDay: 2000,
    burstAllowance: 10,
  },
  pro: {
    requestsPerMinute: 60,
    requestsPerDay: 10000,
    burstAllowance: 20,
  },
  enterprise: {
    requestsPerMinute: 120,
    burstAllowance: 50,
  },
};

export class AIRateLimiter {
  private static STORAGE_KEY = 'ai_rate_limit_data';
  private static MINUTE_WINDOW = 60000;
  private static DAY_WINDOW = 86400000;

  private data: RateLimitData;
  private limits: TierLimits;
  private intervalId: NodeJS.Timeout | null = null;
  private retryQueue: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
    timestamp: number;
  }> = [];

  constructor(tier: RateLimitData['tier'] = 'free') {
    this.data = this.loadFromStorage() || {
      requestCount: 0,
      windowStart: Date.now(),
      tier,
      dailyCount: 0,
      dailyWindowStart: Date.now(),
    };

    this.limits = TIER_LIMITS[this.data.tier] || TIER_LIMITS.free;
    this.startCleanupInterval();
  }

  private loadFromStorage(): RateLimitData | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;

    try {
      const stored = localStorage.getItem(AIRateLimiter.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as RateLimitData;
        // Validate the data
        if (data.windowStart && data.requestCount !== undefined) {
          return data;
        }
      }
    } catch (error) {
      console.error('Failed to load rate limit data from storage:', error);
    }

    return null;
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      localStorage.setItem(AIRateLimiter.STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save rate limit data to storage:', error);
    }
  }

  private resetMinuteWindow(): void {
    this.data.requestCount = 0;
    this.data.windowStart = Date.now();
    this.saveToStorage();
  }

  private resetDailyWindow(): void {
    this.data.dailyCount = 0;
    this.data.dailyWindowStart = Date.now();
    this.saveToStorage();
  }

  private startCleanupInterval(): void {
    if (typeof window === 'undefined') return;

    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Check every second for window resets
    this.intervalId = setInterval(() => {
      const now = Date.now();

      // Reset minute window
      if (now - this.data.windowStart >= AIRateLimiter.MINUTE_WINDOW) {
        this.resetMinuteWindow();
      }

      // Reset daily window
      if (
        this.data.dailyWindowStart &&
        now - this.data.dailyWindowStart >= AIRateLimiter.DAY_WINDOW
      ) {
        this.resetDailyWindow();
      }
    }, 1000);
  }

  async checkLimit(): Promise<void> {
    const now = Date.now();

    // Check minute window
    const minuteElapsed = now - this.data.windowStart;
    if (minuteElapsed >= AIRateLimiter.MINUTE_WINDOW) {
      this.resetMinuteWindow();
    }

    // Check daily window
    if (this.data.dailyWindowStart) {
      const dayElapsed = now - this.data.dailyWindowStart;
      if (dayElapsed >= AIRateLimiter.DAY_WINDOW) {
        this.resetDailyWindow();
      }
    }

    // Check daily limit
    if (this.limits.requestsPerDay && this.data.dailyCount !== undefined) {
      if (this.data.dailyCount >= this.limits.requestsPerDay) {
        const waitTime = AIRateLimiter.DAY_WINDOW - (now - (this.data.dailyWindowStart || now));
        throw new RateLimitError(
          `Daily limit exceeded. Please wait ${Math.ceil(waitTime / 3600000)} hours.`,
          waitTime,
          'daily'
        );
      }
    }

    // Check minute limit with burst allowance
    const effectiveLimit = this.limits.requestsPerMinute + (this.limits.burstAllowance || 0);
    if (this.data.requestCount >= effectiveLimit) {
      const waitTime = AIRateLimiter.MINUTE_WINDOW - minuteElapsed;
      throw new RateLimitError(
        `Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`,
        waitTime,
        'minute'
      );
    }
  }

  increment(): void {
    this.data.requestCount++;
    if (this.data.dailyCount !== undefined) {
      this.data.dailyCount++;
    }
    this.saveToStorage();
  }

  async acquire(): Promise<void> {
    await this.checkLimit();
    this.increment();
  }

  getInfo(): {
    remaining: number;
    resetIn: number;
    limit: number;
    dailyRemaining?: number;
    dailyResetIn?: number;
    dailyLimit?: number;
    tier: string;
  } {
    const now = Date.now();
    const minuteElapsed = now - this.data.windowStart;
    const remaining = Math.max(0, this.limits.requestsPerMinute - this.data.requestCount);
    const resetIn =
      minuteElapsed >= AIRateLimiter.MINUTE_WINDOW
        ? 0
        : AIRateLimiter.MINUTE_WINDOW - minuteElapsed;

    const result: {
      remaining: number;
      resetIn: number;
      limit: number;
      tier: string;
      dailyRemaining?: number;
      dailyResetIn?: number;
      dailyLimit?: number;
    } = {
      remaining,
      resetIn,
      limit: this.limits.requestsPerMinute,
      tier: this.data.tier,
    };

    if (this.limits.requestsPerDay && this.data.dailyCount !== undefined) {
      const dayElapsed = now - (this.data.dailyWindowStart || now);
      result.dailyRemaining = Math.max(0, this.limits.requestsPerDay - this.data.dailyCount);
      result.dailyResetIn =
        dayElapsed >= AIRateLimiter.DAY_WINDOW ? 0 : AIRateLimiter.DAY_WINDOW - dayElapsed;
      result.dailyLimit = this.limits.requestsPerDay;
    }

    return result;
  }

  reset(): void {
    this.data.requestCount = 0;
    this.data.windowStart = Date.now();
    this.data.dailyCount = 0;
    this.data.dailyWindowStart = Date.now();
    this.saveToStorage();
  }

  setTier(tier: RateLimitData['tier']): void {
    this.data.tier = tier;
    this.limits = TIER_LIMITS[tier] || TIER_LIMITS.free;
    this.saveToStorage();
  }

  async waitForAvailability(maxWaitMs = 60000): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
      try {
        await this.checkLimit();
        return;
      } catch (error) {
        if (error instanceof RateLimitError) {
          const remainingTime = maxWaitMs - (Date.now() - startTime);
          if (remainingTime <= 0) {
            break; // Exit loop to throw timeout error
          }
          const waitTime = Math.min(error.retryAfter, remainingTime);
          if (waitTime > 0) {
            await new Promise((resolve) => setTimeout(resolve, Math.min(waitTime, 1000)));
          }
        } else {
          throw error;
        }
      }
    }

    throw new Error('Timeout waiting for rate limit availability');
  }

  cleanup(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    // Clear any pending retry queue items
    this.retryQueue.forEach((item) => {
      item.reject(new Error('Rate limiter cleanup'));
    });
    this.retryQueue = [];
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfter: number,
    public limitType: 'minute' | 'daily'
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Singleton instance
let rateLimiterInstance: AIRateLimiter | null = null;

export function getAIRateLimiter(tier?: RateLimitData['tier']): AIRateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new AIRateLimiter(tier);
  }
  return rateLimiterInstance;
}

export function resetAIRateLimiter(): void {
  if (rateLimiterInstance) {
    rateLimiterInstance.reset();
  }
}
