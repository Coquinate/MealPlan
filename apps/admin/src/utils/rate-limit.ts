/**
 * Rate limiting utilities for admin authentication
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMinutes: number = 15) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMinutes * 60 * 1000;
  }

  /**
   * Check if an action is allowed for a given key
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    // No entry or expired window
    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    // Within window
    if (entry.count >= this.maxAttempts) {
      return false;
    }

    // Increment count
    entry.count++;
    return true;
  }

  /**
   * Get remaining attempts for a key
   */
  getRemainingAttempts(key: string): number {
    const entry = this.limits.get(key);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - entry.count);
  }

  /**
   * Get time until reset in milliseconds
   */
  getResetTime(key: string): number {
    const entry = this.limits.get(key);
    if (!entry || Date.now() > entry.resetTime) {
      return 0;
    }
    return entry.resetTime - Date.now();
  }

  /**
   * Reset attempts for a key (e.g., on successful auth)
   */
  reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Singleton instances for different rate limit contexts
export const authRateLimiter = new RateLimiter(5, 15); // 5 attempts per 15 minutes
export const twoFactorRateLimiter = new RateLimiter(5, 5); // 5 attempts per 5 minutes
export const apiRateLimiter = new RateLimiter(100, 1); // 100 requests per minute

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return '0 secunde';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);

  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minut' : 'minute'}`;
  }

  return `${seconds} ${seconds === 1 ? 'secundă' : 'secunde'}`;
}

/**
 * Check rate limit and throw error if exceeded
 */
export function checkRateLimit(limiter: RateLimiter, key: string, errorMessage?: string): void {
  if (!limiter.isAllowed(key)) {
    const resetTime = limiter.getResetTime(key);
    const timeRemaining = formatTimeRemaining(resetTime);
    throw new Error(errorMessage || `Prea multe încercări. Încercați din nou în ${timeRemaining}.`);
  }
}

// Run cleanup every minute
if (typeof window !== 'undefined') {
  setInterval(() => {
    authRateLimiter.cleanup();
    twoFactorRateLimiter.cleanup();
    apiRateLimiter.cleanup();
  }, 60000);
}
