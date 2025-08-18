/**
 * Simple in-memory rate limiter - perfect for single-server deployment
 * Appropriate for projects with hundreds to thousands of users
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly maxEntries = 1000; // Prevent unbounded growth

  constructor(maxRequests = 5, windowMs = 3600000) {
    // 5 requests per hour by default
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // No setInterval - cleanup is done opportunistically in isRateLimited
    // This is more reliable for serverless environments
  }

  /**
   * Check if an IP address has exceeded the rate limit
   */
  isRateLimited(ip: string): boolean {
    const now = Date.now();

    // Opportunistic cleanup of expired entries
    if (this.store.size > this.maxEntries / 2) {
      this.cleanup();
    }

    const entry = this.store.get(ip);

    if (!entry) {
      // Prevent store from growing indefinitely
      // If at max capacity, don't add new entries (fail open for new IPs)
      if (this.store.size >= this.maxEntries) {
        // Log this event in production for monitoring
        console.warn(
          `Rate limiter at capacity (${this.maxEntries} entries), not tracking new IP: ${ip}`
        );
        return false; // Fail open - don't block new users when at capacity
      }

      this.store.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return false;
    }

    // Reset if window has passed
    if (now > entry.resetTime) {
      this.store.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return false;
    }

    // Increment count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > this.maxRequests) {
      return true;
    }

    this.store.set(ip, entry);
    return false;
  }

  /**
   * Get remaining time until rate limit resets (in seconds)
   */
  getResetTime(ip: string): number {
    const entry = this.store.get(ip);
    if (!entry) return 0;

    const now = Date.now();
    if (now > entry.resetTime) return 0;

    return Math.ceil((entry.resetTime - now) / 1000);
  }

  /**
   * Clean up expired entries only
   * No force cleanup - we prevent new entries when at capacity instead
   */
  private cleanup(): void {
    const now = Date.now();

    // Only remove expired entries
    // This is safe and won't drop active rate limits
    for (const [ip, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(ip);
      }
    }
  }
}

// Export singleton instance
export const emailSignupLimiter = new RateLimiter(5, 3600000); // 5 per hour
