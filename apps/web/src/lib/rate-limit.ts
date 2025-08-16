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
  
  constructor(maxRequests = 5, windowMs = 3600000) { // 5 requests per hour by default
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    
    // Clean up old entries every 10 minutes
    setInterval(() => this.cleanup(), 600000);
  }
  
  /**
   * Check if an IP address has exceeded the rate limit
   */
  isRateLimited(ip: string): boolean {
    const now = Date.now();
    
    // Opportunistic cleanup if store is getting large
    if (this.store.size > this.maxEntries) {
      this.cleanup();
    }
    
    const entry = this.store.get(ip);
    
    if (!entry) {
      this.store.set(ip, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return false;
    }
    
    // Reset if window has passed
    if (now > entry.resetTime) {
      this.store.set(ip, {
        count: 1,
        resetTime: now + this.windowMs
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
   * Clean up expired entries or force cleanup if too many entries
   */
  private cleanup(): void {
    const now = Date.now();
    
    // Force cleanup if too many entries
    if (this.store.size > this.maxEntries) {
      // Keep only the most recent half of entries that haven't expired
      const entries = Array.from(this.store.entries())
        .sort((a, b) => a[1].resetTime - b[1].resetTime);
      
      // Clear and rebuild with only recent, non-expired entries
      this.store.clear();
      entries
        .slice(-Math.floor(this.maxEntries / 2))
        .forEach(([ip, entry]) => {
          if (now <= entry.resetTime) {
            this.store.set(ip, entry);
          }
        });
      return;
    }
    
    // Normal cleanup of expired entries
    for (const [ip, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(ip);
      }
    }
  }
}

// Export singleton instance
export const emailSignupLimiter = new RateLimiter(5, 3600000); // 5 per hour