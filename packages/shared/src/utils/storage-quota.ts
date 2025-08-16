/**
 * Storage Quota Management Utility
 * Handles localStorage quota checking and management
 */

export interface StorageQuotaInfo {
  used: number;
  available: number;
  total: number;
  percentUsed: number;
  hasSpace: boolean;
}

export class StorageQuotaManager {
  // Typical localStorage limit is 5-10MB, we'll use 5MB as conservative default
  private static readonly DEFAULT_QUOTA = 5 * 1024 * 1024; // 5MB in bytes
  private static readonly SAFETY_THRESHOLD = 0.9; // Use only 90% of available space
  private static readonly MIN_FREE_SPACE = 50 * 1024; // Keep at least 50KB free

  /**
   * Estimate current localStorage usage in bytes
   */
  static estimateStorageUsage(): number {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 0;
    }

    let totalSize = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          // Each character in JavaScript strings is UTF-16 (2 bytes)
          // Account for both key and value
          const itemSize = (key.length + localStorage[key].length) * 2;
          totalSize += itemSize;
        }
      }
    } catch (error) {
      console.error('Error estimating storage usage:', error);
      return 0;
    }

    return totalSize;
  }

  /**
   * Calculate accurate string size in bytes (handles emojis and surrogate pairs)
   */
  static calculateStringSize(str: string): number {
    if (!str) return 0;

    let size = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      // Check for surrogate pair (emoji, special characters)
      if (code >= 0xd800 && code <= 0xdbff) {
        size += 4; // Surrogate pair takes 4 bytes
        i++; // Skip the next character (low surrogate)
      } else {
        size += 2; // Normal UTF-16 character
      }
    }
    return size;
  }

  /**
   * Get the actual localStorage quota (browser-specific)
   */
  static async getActualQuota(): Promise<number> {
    // Try to use the Storage API if available
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        // LocalStorage typically gets a small fraction of the quota
        // We'll assume 10MB or 1% of total quota, whichever is smaller
        const localStorageQuota = Math.min(
          10 * 1024 * 1024,
          (estimate.quota || this.DEFAULT_QUOTA) * 0.01
        );
        return localStorageQuota;
      } catch (error) {
        console.warn('Could not estimate storage quota:', error);
      }
    }

    // Fallback: Try to detect quota by testing
    return this.detectQuotaByTesting();
  }

  /**
   * Detect quota by testing (fallback method)
   */
  private static detectQuotaByTesting(): number {
    if (typeof window === 'undefined' || !window.localStorage) {
      return this.DEFAULT_QUOTA;
    }

    // Common quotas by browser
    const commonQuotas = [
      10 * 1024 * 1024, // 10MB (Chrome, Firefox)
      5 * 1024 * 1024, // 5MB (Safari, older browsers)
      2 * 1024 * 1024, // 2MB (Some mobile browsers)
    ];

    // Check which quota we're closest to based on current usage
    const currentUsage = this.estimateStorageUsage();

    // If we can still write a significant amount, assume we haven't hit the limit
    try {
      const testKey = '__quota_test__';
      const testSize = 1024 * 100; // 100KB test
      const testData = 'x'.repeat(testSize / 2); // Divide by 2 because UTF-16

      localStorage.setItem(testKey, testData);
      localStorage.removeItem(testKey);

      // If we can write 100KB, we likely have standard quota
      for (const quota of commonQuotas) {
        if (currentUsage < quota * 0.8) {
          return quota;
        }
      }
    } catch (error) {
      // If we can't write, we're near the limit
      // Estimate based on current usage
      return Math.max(currentUsage * 1.1, this.DEFAULT_QUOTA);
    }

    return this.DEFAULT_QUOTA;
  }

  /**
   * Check if there's enough space for new data
   */
  static hasStorageSpace(bytesNeeded: number, quota?: number): boolean {
    const maxQuota = quota || this.DEFAULT_QUOTA;
    const currentUsage = this.estimateStorageUsage();
    const projectedUsage = currentUsage + bytesNeeded;

    // Check against safety threshold
    const thresholdLimit = maxQuota * this.SAFETY_THRESHOLD;

    // Ensure we don't exceed threshold and keep minimum free space
    return projectedUsage <= thresholdLimit && maxQuota - projectedUsage >= this.MIN_FREE_SPACE;
  }

  /**
   * Get detailed storage quota information
   */
  static async getQuotaInfo(): Promise<StorageQuotaInfo> {
    const quota = await this.getActualQuota();
    const used = this.estimateStorageUsage();
    const available = Math.max(0, quota - used);
    const percentUsed = quota > 0 ? (used / quota) * 100 : 100;

    return {
      used,
      available,
      total: quota,
      percentUsed,
      hasSpace: this.hasStorageSpace(0, quota),
    };
  }

  /**
   * Safely set item in localStorage with quota checking
   */
  static async safeSetItem(
    key: string,
    value: string,
    options?: {
      maxRetries?: number;
      onQuotaExceeded?: () => void;
    }
  ): Promise<boolean> {
    const { maxRetries = 3, onQuotaExceeded } = options || {};

    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    // Calculate size of new item
    const itemSize = this.calculateStringSize(key) + this.calculateStringSize(value);

    // Check if we have space
    const quota = await this.getActualQuota();
    if (!this.hasStorageSpace(itemSize, quota)) {
      if (onQuotaExceeded) {
        onQuotaExceeded();
      }
      return false;
    }

    // Try to set the item
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        attempts++;

        if (
          error instanceof Error &&
          (error.name === 'QuotaExceededError' || error.message.includes('quota'))
        ) {
          if (onQuotaExceeded) {
            onQuotaExceeded();
          }

          // Try to free up space
          if (attempts < maxRetries) {
            const freed = await this.freeUpSpace(itemSize);
            if (!freed) {
              return false;
            }
          }
        } else {
          // Non-quota error
          console.error('Error setting localStorage item:', error);
          return false;
        }
      }
    }

    return false;
  }

  /**
   * Try to free up space by removing old or less important items
   */
  static async freeUpSpace(
    bytesNeeded: number,
    options?: {
      protectedKeys?: string[];
      removalStrategy?: 'oldest' | 'largest' | 'pattern';
      pattern?: RegExp;
    }
  ): Promise<boolean> {
    const { protectedKeys = [], removalStrategy = 'oldest', pattern } = options || {};

    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    const quota = await this.getActualQuota();
    const targetUsage = quota * this.SAFETY_THRESHOLD - bytesNeeded;
    let currentUsage = this.estimateStorageUsage();

    if (currentUsage <= targetUsage) {
      return true; // Already have enough space
    }

    // Collect removable items
    const items: Array<{
      key: string;
      size: number;
      timestamp?: number;
    }> = [];

    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key) && !protectedKeys.includes(key)) {
        // Apply pattern filter if specified
        if (pattern && !pattern.test(key)) {
          continue;
        }

        const value = localStorage[key];
        const size = this.calculateStringSize(key) + this.calculateStringSize(value);

        // Try to extract timestamp if the value is JSON
        let timestamp: number | undefined;
        try {
          const parsed = JSON.parse(value);
          timestamp = parsed.timestamp || parsed.createdAt || parsed.lastModified;
        } catch {
          // Not JSON or no timestamp
        }

        items.push({ key, size, timestamp });
      }
    }

    // Sort based on removal strategy
    switch (removalStrategy) {
      case 'oldest':
        items.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        break;
      case 'largest':
        items.sort((a, b) => b.size - a.size);
        break;
      case 'pattern':
        // Already filtered by pattern
        break;
    }

    // Remove items until we have enough space
    for (const item of items) {
      try {
        localStorage.removeItem(item.key);
        currentUsage -= item.size;

        if (currentUsage <= targetUsage) {
          return true;
        }
      } catch (error) {
        console.error(`Error removing item ${item.key}:`, error);
      }
    }

    return currentUsage <= targetUsage;
  }

  /**
   * Monitor storage usage and warn when approaching limits
   */
  static startQuotaMonitoring(options?: {
    checkInterval?: number;
    warningThreshold?: number;
    onWarning?: (info: StorageQuotaInfo) => void;
    onCritical?: (info: StorageQuotaInfo) => void;
  }): () => void {
    const {
      checkInterval = 60000, // Check every minute
      warningThreshold = 0.75, // Warn at 75% usage
      onWarning,
      onCritical,
    } = options || {};

    const intervalId = setInterval(async () => {
      const info = await this.getQuotaInfo();

      if (info.percentUsed >= 90) {
        if (onCritical) {
          onCritical(info);
        }
      } else if (info.percentUsed >= warningThreshold * 100) {
        if (onWarning) {
          onWarning(info);
        }
      }
    }, checkInterval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }
}
