// Using Web Crypto API for browser compatibility
import type { AIServiceResponse } from './ai-service';
import { getAIAnalyticsService } from './ai-analytics';
import { CACHE_CONSTANTS, STORAGE_CONSTANTS } from './constants';
import {
  compressForCache,
  decompressFromCache,
  shouldCompress,
  calculateStringSize,
} from './cache-compression';

/**
 * AI response data stored in cache
 */
export interface AIResponse {
  content: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  finishReason?:
    | 'stop'
    | 'length'
    | 'content-filter'
    | 'error'
    | 'other'
    | 'unknown'
    | 'tool-calls';
  model?: string;
  sdkVersion?: string;
}

/**
 * Cache statistics for monitoring
 */
export interface CacheStats {
  totalItems: number;
  totalSizeBytes: number;
  hitRate?: number;
  missRate?: number;
  evictionsCount: number;
  lastEviction?: number;
  oldestEntry?: number;
  newestEntry?: number;
}

/**
 * Individual cache item with metadata
 */
interface CacheItem {
  response: AIResponse;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  sizeBytes: number;
  compressed?: boolean;
  compressionRatio?: number;
}

/**
 * localStorage cache structure
 */
interface LocalStorageCache {
  version: string;
  totalSizeBytes: number;
  evictionsCount: number;
  lastEviction?: number;
  stats: {
    hits: number;
    misses: number;
  };
  items: Record<string, CacheItem>;
}

/**
 * Cache service interface for AI responses
 */
export interface AICacheService {
  get(key: string): Promise<AIResponse | null>;
  set(key: string, value: AIResponse, ttl?: number): Promise<void>;
  invalidate(pattern: string): Promise<void>;
  getStats(): CacheStats;
  generateCacheKey(recipeId: string, question: string): string;
  normalizeQuestionForCaching(question: string): string;
  trackQuestionAsked(recipeId: string, question: string): void;
}

/**
 * Configuration for the cache service
 */
interface AICacheConfig {
  storageKey?: string;
  maxItems?: number;
  maxSizeBytes?: number;
  defaultTtlMs?: number;
  enabled?: boolean;
}

/**
 * localStorage-based cache service for AI responses with size tracking and LRU eviction
 *
 * CACHE FLOW ARCHITECTURE:
 * 1. Question Input → Normalization (Romanian semantic grouping)
 * 2. Static Response Check → Instant answers for common questions (0ms, $0)
 * 3. localStorage Cache → Recent personalized responses (50-100ms, $0)
 * 4. Gemini Implicit Cache → API-level repeated prefixes (200-500ms, 75% discount)
 * 5. Fresh API Call → New requests (800-2000ms, full cost)
 *
 * CACHE INVALIDATION STRATEGY:
 * - Recipe updates → Clear all cache for that recipe
 * - Version changes → Clear entire cache
 * - TTL expiration → Remove entries older than configured TTL (default: 7 days)
 * - Size limits → LRU eviction when exceeding maxItems or maxSizeBytes
 *
 * PERFORMANCE TARGETS:
 * - Cache hit rate: >60%
 * - Cached response time: <100ms
 * - Cost reduction: >50%
 * - Cache storage: <4MB
 */
class AICacheServiceImpl implements AICacheService {
  private static readonly DEFAULT_STORAGE_KEY = 'ai_response_cache';
  private static readonly CACHE_VERSION = '1.0.0';
  private static readonly MAX_CACHE_ITEMS = CACHE_CONSTANTS.MAX_CACHE_ITEMS;
  private static readonly MAX_CACHE_SIZE_BYTES = CACHE_CONSTANTS.MAX_CACHE_SIZE_BYTES;
  private static readonly DEFAULT_TTL_MS = CACHE_CONSTANTS.DEFAULT_TTL_MS;

  private readonly config: Required<AICacheConfig>;
  private isStorageAvailable: boolean;

  // Normalization cache to avoid repeated string processing
  private normalizationCache: Map<string, string> = new Map();
  private static readonly MAX_NORMALIZATION_CACHE_SIZE = 100;

  constructor(config: AICacheConfig = {}) {
    this.config = {
      storageKey: config.storageKey ?? AICacheServiceImpl.DEFAULT_STORAGE_KEY,
      maxItems: config.maxItems ?? AICacheServiceImpl.MAX_CACHE_ITEMS,
      maxSizeBytes: config.maxSizeBytes ?? AICacheServiceImpl.MAX_CACHE_SIZE_BYTES,
      defaultTtlMs: config.defaultTtlMs ?? AICacheServiceImpl.DEFAULT_TTL_MS,
      enabled: config.enabled ?? true,
    };

    this.isStorageAvailable = this.checkStorageAvailability();

    if (this.isStorageAvailable) {
      this.cleanupExpiredItems();
    }
  }

  /**
   * Check if localStorage is available and functional
   */
  private checkStorageAvailability(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      const testKey = `${this.config.storageKey}_test`;
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('localStorage not available for AI cache service:', error);
      return false;
    }
  }

  /**
   * Calculate the size of a string in bytes (UTF-16 encoding)
   */
  private calculateStringSize(text: string): number {
    return text.length * 2; // UTF-16 encoding uses 2 bytes per character
  }

  /**
   * Calculate the size of a cache item in bytes
   */
  private calculateItemSize(key: string, item: CacheItem): number {
    const serializedItem = JSON.stringify(item);
    return this.calculateStringSize(key) + this.calculateStringSize(serializedItem);
  }

  /**
   * Load cache from localStorage with validation
   */
  private loadCache(): LocalStorageCache {
    if (!this.isStorageAvailable) {
      return this.createEmptyCache();
    }

    try {
      const cached = window.localStorage.getItem(this.config.storageKey);
      if (!cached) {
        return this.createEmptyCache();
      }

      const parsed = JSON.parse(cached) as LocalStorageCache;

      // Validate cache structure and version
      if (!parsed.version || parsed.version !== AICacheServiceImpl.CACHE_VERSION) {
        console.warn('Cache version mismatch, creating new cache');
        return this.createEmptyCache();
      }

      return parsed;
    } catch (error) {
      console.error('Failed to load cache from localStorage:', error);
      return this.createEmptyCache();
    }
  }

  /**
   * Save cache to localStorage with error handling
   */
  private saveCache(cache: LocalStorageCache): void {
    if (!this.isStorageAvailable) {
      return;
    }

    try {
      window.localStorage.setItem(this.config.storageKey, JSON.stringify(cache));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, attempting to free space');
        this.handleQuotaExceeded(cache);
      } else {
        console.error('Failed to save cache to localStorage:', error);
      }
    }
  }

  /**
   * Create an empty cache structure
   */
  private createEmptyCache(): LocalStorageCache {
    return {
      version: AICacheServiceImpl.CACHE_VERSION,
      totalSizeBytes: 0,
      evictionsCount: 0,
      stats: {
        hits: 0,
        misses: 0,
      },
      items: {},
    };
  }

  /**
   * Handle QuotaExceededError by aggressive cleanup
   */
  private handleQuotaExceeded(cache: LocalStorageCache): void {
    try {
      // Remove 25% of items to free up space
      const itemsToRemove = Math.ceil(Object.keys(cache.items).length * 0.25);
      const sortedItems = Object.entries(cache.items).sort(
        (a, b) => a[1].lastAccessed - b[1].lastAccessed
      );

      let removedSize = 0;
      for (let i = 0; i < itemsToRemove && i < sortedItems.length; i++) {
        const [key, item] = sortedItems[i];
        removedSize += item.sizeBytes;
        delete cache.items[key];
      }

      cache.totalSizeBytes -= removedSize;
      cache.evictionsCount += itemsToRemove;
      cache.lastEviction = Date.now();

      // Try to save again
      window.localStorage.setItem(this.config.storageKey, JSON.stringify(cache));
    } catch (retryError) {
      console.error('Failed to handle quota exceeded error:', retryError);
      // Clear entire cache as last resort
      this.clearCache();
    }
  }

  /**
   * Clean up expired items from cache
   */
  private cleanupExpiredItems(): void {
    if (!this.isStorageAvailable) {
      return;
    }

    const cache = this.loadCache();
    const now = Date.now();
    let removedSize = 0;
    let removedCount = 0;

    for (const [key, item] of Object.entries(cache.items)) {
      if (now - item.timestamp > this.config.defaultTtlMs) {
        removedSize += item.sizeBytes;
        removedCount++;
        delete cache.items[key];
      }
    }

    if (removedCount > 0) {
      cache.totalSizeBytes -= removedSize;
      this.saveCache(cache);
    }
  }

  /**
   * Evict LRU items to make space for new item
   */
  private evictLRUItems(cache: LocalStorageCache, requiredSpace: number): void {
    const sortedItems = Object.entries(cache.items).sort(
      (a, b) => a[1].lastAccessed - b[1].lastAccessed
    );

    let freedSpace = 0;
    let evictedCount = 0;

    for (const [key, item] of sortedItems) {
      freedSpace += item.sizeBytes;
      evictedCount++;
      delete cache.items[key];

      if (freedSpace >= requiredSpace) {
        break;
      }
    }

    cache.totalSizeBytes -= freedSpace;
    cache.evictionsCount += evictedCount;
    cache.lastEviction = Date.now();
  }

  /**
   * Check if we can add an item to cache without exceeding limits
   */
  private canAddToCache(cache: LocalStorageCache, newItemSize: number): boolean {
    const itemCount = Object.keys(cache.items).length;

    return (
      cache.totalSizeBytes + newItemSize <= this.config.maxSizeBytes &&
      itemCount < this.config.maxItems
    );
  }

  /**
   * Make space in cache for new item
   */
  private makeSpace(cache: LocalStorageCache, requiredSpace: number): void {
    const itemCount = Object.keys(cache.items).length;

    // If we're at max items, evict one item to make space
    if (itemCount >= this.config.maxItems) {
      this.evictOldestItem(cache);
      return;
    }

    // If we need space, evict until we have enough
    if (cache.totalSizeBytes + requiredSpace > this.config.maxSizeBytes) {
      const spaceNeeded = cache.totalSizeBytes + requiredSpace - this.config.maxSizeBytes;
      this.evictLRUItems(cache, spaceNeeded);
    }
  }

  /**
   * Evict the oldest (LRU) item from cache
   */
  private evictOldestItem(cache: LocalStorageCache): void {
    const items = Object.entries(cache.items);
    if (items.length === 0) return;

    // Find the item with the oldest lastAccessed time
    const [oldestKey, oldestItem] = items.reduce((oldest, current) => {
      return current[1].lastAccessed < oldest[1].lastAccessed ? current : oldest;
    });

    // Remove the oldest item
    cache.totalSizeBytes -= oldestItem.sizeBytes;
    cache.evictionsCount += 1;
    cache.lastEviction = Date.now();
    delete cache.items[oldestKey];
  }

  /**
   * Clear the entire cache
   */
  private clearCache(): void {
    if (!this.isStorageAvailable) {
      return;
    }

    try {
      window.localStorage.removeItem(this.config.storageKey);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Generate cache key from recipe ID and question
   */
  public generateCacheKey(recipeId: string, question: string): string {
    const normalizedQuestion = this.normalizeQuestion(question);
    // Use a simple hash function for browser compatibility
    const questionHash = this.simpleHash(normalizedQuestion);
    const key = `ai_${recipeId}_${questionHash}`;

    // Store mapping for analytics
    this.storeQuestionMapping(key, question);

    return key;
  }

  /**
   * Simple hash function for browser compatibility
   * Replaces MD5 with a deterministic string hash
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Public method to normalize questions for external use
   */
  public normalizeQuestionForCaching(question: string): string {
    return this.normalizeQuestion(question);
  }

  /**
   * Romanian question patterns for semantic grouping
   * Note: All patterns are normalized (no diacritics, lowercase) to match our processing
   * Order matters: more specific patterns should come first
   */
  private static readonly QUESTION_PATTERNS = {
    // High specificity patterns first
    substitution: [
      'inlocui',
      'schimba',
      'schimb',
      'in loc de',
      'altceva',
      'substitute',
      'inlocuiesc',
    ],
    storage: ['cat timp tine', 'pastrez', 'conserv', 'depozitez', 'pastreaza'], // "cat timp tine" more specific than just "cat timp"
    duration: ['cat timp', 'cat dureaza', 'in cat timp', 'cat ia', 'durata', 'minute', 'ore'],
    calories: ['calorii', 'kcal', 'grasimi', 'nutritie', 'cate calorii'],
    servings: ['persoane', 'portii', 'serviri', 'pentru cati', 'cate persoane'],
    difficulty: ['greu', 'usor', 'dificil', 'simplu', 'cat de greu'],
    temperature: ['grade', 'temperatura', 'celsius', 'fahrenheit', 'cat de cald'],
    techniques: ['cum sa', 'cum fac', 'cum prepar', 'cum gatesc', 'metoda', 'procesul'],
    timeOfDay: ['pranz', 'cina', 'mic dejun', 'gustare', 'micul dejun'],
    // Lower specificity patterns last (most generic)
    ingredients: ['cu ce fac', 'ce ingredient', 'ingrediente', 'ce pun'], // More specific ingredient patterns
  } as const;

  /**
   * Romanian diacritics normalization map
   */
  private static readonly DIACRITICS_MAP: Record<string, string> = {
    ă: 'a',
    â: 'a',
    î: 'i',
    ș: 's',
    ț: 't',
    Ă: 'a',
    Â: 'a',
    Î: 'i',
    Ș: 's',
    Ț: 't',
  };

  /**
   * Add to normalization cache with LRU eviction
   */
  private addToNormalizationCache(key: string, value: string): void {
    if (this.normalizationCache.size >= AICacheServiceImpl.MAX_NORMALIZATION_CACHE_SIZE) {
      // Clear oldest entry (FIFO)
      const firstKey = this.normalizationCache.keys().next().value;
      if (firstKey) {
        this.normalizationCache.delete(firstKey);
      }
    }
    this.normalizationCache.set(key, value);
  }

  /**
   * Normalize Romanian diacritics
   */
  private removeDiacritics(text: string): string {
    return text.replace(/[ăâîșțĂÂÎȘȚ]/g, (char) => AICacheServiceImpl.DIACRITICS_MAP[char] || char);
  }

  /**
   * Normalize question for better cache hit rates by grouping semantically similar Romanian questions
   * Performance target: <5ms per normalization
   */
  private normalizeQuestion(question: string): string {
    if (!question || typeof question !== 'string') {
      return '';
    }

    // Check normalization cache first
    const cached = this.normalizationCache.get(question);
    if (cached) {
      return cached;
    }

    const startTime = performance.now();

    try {
      // Basic cleanup - remove extra whitespace, convert to lowercase
      let normalized = question.trim().toLowerCase();

      // Remove diacritics for pattern matching
      const withoutDiacritics = this.removeDiacritics(normalized);

      // Remove punctuation for pattern matching, but preserve word boundaries
      const cleanForMatching = withoutDiacritics
        .replace(/[?!.,;:]/g, ' ') // Replace punctuation with spaces to preserve word boundaries
        .replace(/\s+/g, ' ')
        .trim();

      // Create all patterns with their categories and sort by length and specificity
      const allPatterns: Array<{ pattern: string; category: string; priority: number }> = [];
      for (const [category, patterns] of Object.entries(AICacheServiceImpl.QUESTION_PATTERNS)) {
        patterns.forEach((pattern) => {
          // Give specific patterns higher priority
          let priority = 0;
          if (category === 'substitution') priority = 1000;
          else if (category === 'storage')
            priority = 600; // Higher than duration to catch "cat timp tine"
          else if (category === 'duration') priority = 500;
          else if (category === 'calories') priority = 400;
          else if (category === 'servings') priority = 400;
          else if (category === 'difficulty') priority = 400;
          else if (category === 'temperature') priority = 400;
          else if (category === 'techniques') priority = 300;
          else if (category === 'timeOfDay') priority = 300;
          else if (category === 'ingredients') priority = 100; // Lowest priority since it's most generic

          allPatterns.push({ pattern, category, priority: priority + pattern.length });
        });
      }

      // Sort by priority (substitution first) then by pattern length descending (longer = more specific)
      allPatterns.sort((a, b) => b.priority - a.priority);

      // Find ALL matching patterns and their positions
      const matches: Array<{ pattern: string; category: string; priority: number; index: number }> =
        [];

      for (const { pattern, category, priority } of allPatterns) {
        const index = cleanForMatching.indexOf(pattern);
        if (index !== -1) {
          matches.push({ pattern, category, priority, index });
        }
      }

      // If we found matches, select the best one (highest priority, then earliest in string)
      if (matches.length > 0) {
        matches.sort((a, b) => {
          // First by priority (substitution patterns have highest priority)
          if (a.priority !== b.priority) {
            return b.priority - a.priority;
          }
          // Then by specificity (longer patterns)
          if (a.pattern.length !== b.pattern.length) {
            return b.pattern.length - a.pattern.length;
          }
          // Finally by position in string (earlier is better)
          return a.index - b.index;
        });

        const bestMatch = matches[0];

        // Only add context for substitution questions where it's valuable
        if (bestMatch.category === 'substitution') {
          // Extract the main subject if possible (e.g., "unt" from "cu ce pot înlocui untul?")
          const words = cleanForMatching.split(' ');
          const patternWords = bestMatch.pattern.split(' ');

          // Find context words that come after the pattern
          const patternIndex = this.findPatternIndex(words, patternWords);
          if (patternIndex !== -1) {
            const contextWords = words
              .slice(patternIndex + patternWords.length)
              .filter((word) => word.length > 2 && !this.isCommonWord(word))
              .slice(0, 1); // Take only 1 context word for cleaner results

            const context = contextWords.length > 0 ? `_${contextWords.join('_')}` : '';
            const result = `${bestMatch.category}${context}`;
            this.addToNormalizationCache(question, result);
            return result;
          }
        }

        // Cache and return the result
        this.addToNormalizationCache(question, bestMatch.category);
        return bestMatch.category;
      }

      // Fallback to stemmed version for partial matches
      const stemmed = this.stemRomanianWords(cleanForMatching);

      // Check stemmed patterns, also prioritizing longer patterns
      for (const { pattern, category } of allPatterns) {
        const stemmedPattern = this.stemRomanianWords(pattern);
        if (stemmed.includes(stemmedPattern)) {
          this.addToNormalizationCache(question, category);
          return category;
        }
      }

      // Final fallback: return normalized version without diacritics
      const result = withoutDiacritics.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_');
      this.addToNormalizationCache(question, result);
      return result;
    } finally {
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Log performance warning if normalization takes too long
      if (duration > 5) {
        console.warn(`Question normalization took ${duration.toFixed(2)}ms, exceeding 5ms target`);
      }
    }
  }

  /**
   * Find the starting index of a pattern in a word array
   */
  private findPatternIndex(words: string[], patternWords: string[]): number {
    for (let i = 0; i <= words.length - patternWords.length; i++) {
      let matches = true;
      for (let j = 0; j < patternWords.length; j++) {
        if (words[i + j] !== patternWords[j]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Check if a word is a common Romanian word that shouldn't be used as context
   */
  private isCommonWord(word: string): boolean {
    const commonWords = new Set([
      'cu',
      'de',
      'la',
      'pe',
      'in',
      'si',
      'sau',
      'ca',
      'ce',
      'cum',
      'cand',
      'unde',
      'pentru',
      'din',
      'pana',
      'dupa',
      'inainte',
      'acest',
      'aceasta',
      'aceste',
      'pot',
      'poti',
      'poate',
      'putem',
      'puteti',
      'fac',
      'faci',
      'face',
      'facem',
      'faceti',
      'are',
      'este',
      'sunt',
      'era',
      'vor',
      'avea',
      'fost',
      'este',
      'fiind',
      'cat',
      'care',
      'toate',
      'mult',
      'multe',
      'foarte',
      'mai',
      'cel',
      'cea',
      'cei',
      'cele',
      'sa',
      'se',
      'facut',
      'gatisc',
      'gatesc',
      'asta',
      'reteta',
      'mancarea',
      'merge',
      'contine',
      'dureaza',
      'aceasta',
      'acesta',
      'aceste',
      'acelea',
      'acela',
      'acei',
      'acele',
      'pasi',
      'folosi',
      'folosesc',
      'folosim',
      'folositi',
      'folosis',
      'tine',
    ]);
    return commonWords.has(word);
  }

  /**
   * Basic Romanian word stemming for pattern matching
   */
  private stemRomanianWords(text: string): string {
    const words = text.split(' ');
    const stemmed = words.map((word) => {
      // Remove common Romanian suffixes
      return word
        .replace(/ului$/, '') // genitive articles
        .replace(/uri$/, '') // plural
        .replace(/elor$/, '') // plural genitive
        .replace(/ilor$/, '') // plural genitive
        .replace(/ile$/, '') // plural feminine
        .replace(/esc$/, '') // verb ending
        .replace(/eze$/, '') // verb ending
        .replace(/esti$/, '') // verb ending
        .replace(/eaza$/, '') // verb ending
        .replace(/torul$/, '') // agent suffix
        .replace(/toare$/, '') // agent suffix
        .replace(/mente$/, '') // adverb suffix
        .slice(0, Math.max(3, word.length - 2)); // Keep at least 3 chars
    });

    return stemmed.join(' ');
  }

  /**
   * Convert AIServiceResponse to AIResponse
   */
  private convertToAIResponse(serviceResponse: AIServiceResponse): AIResponse {
    return {
      content: serviceResponse.content,
      usage: serviceResponse.usage
        ? {
            promptTokens: serviceResponse.usage.promptTokens,
            completionTokens: serviceResponse.usage.completionTokens,
            totalTokens: serviceResponse.usage.totalTokens,
          }
        : undefined,
      finishReason: serviceResponse.finishReason,
      model: serviceResponse.model,
      sdkVersion: serviceResponse.sdkVersion,
    };
  }

  /**
   * Extract recipe ID from cache key
   * Cache keys are in format: ai_{recipeId}_{questionHash}
   */
  private extractRecipeIdFromKey(key: string): string | null {
    const match = key.match(/^ai_([^_]+)_/);
    return match ? match[1] : null;
  }

  /**
   * Store mapping of cache keys to original questions
   */
  private static readonly QUESTION_MAPPING_KEY = 'ai_cache_question_mapping';

  /**
   * Store original question for cache key
   */
  private storeQuestionMapping(key: string, question: string): void {
    if (!this.isStorageAvailable) return;

    try {
      const stored = window.localStorage.getItem(AICacheServiceImpl.QUESTION_MAPPING_KEY);
      const mapping = stored ? JSON.parse(stored) : {};
      mapping[key] = question;

      // Keep only recent mappings (last 100)
      const entries = Object.entries(mapping);
      if (entries.length > 100) {
        const recent = entries.slice(-100);
        window.localStorage.setItem(
          AICacheServiceImpl.QUESTION_MAPPING_KEY,
          JSON.stringify(Object.fromEntries(recent))
        );
      } else {
        window.localStorage.setItem(
          AICacheServiceImpl.QUESTION_MAPPING_KEY,
          JSON.stringify(mapping)
        );
      }
    } catch (error) {
      console.warn('Failed to store question mapping:', error);
    }
  }

  /**
   * Extract original question from cache key mapping
   */
  private extractQuestionFromKey(key: string): string {
    if (!this.isStorageAvailable) return 'cached_question';

    try {
      const stored = window.localStorage.getItem(AICacheServiceImpl.QUESTION_MAPPING_KEY);
      if (!stored) return 'cached_question';

      const mapping = JSON.parse(stored);
      return mapping[key] || 'cached_question';
    } catch (error) {
      console.warn('Failed to extract question from mapping:', error);
      return 'cached_question';
    }
  }

  /**
   * Get cached AI response by key with static response checking
   *
   * CACHE LOOKUP FLOW:
   * 1. Check cache enabled and storage available
   * 2. Extract recipe ID and question from cache key
   * 3. PRIORITY: Check static responses first (instant, no API cost)
   * 4. Check localStorage cache with TTL validation
   * 5. Update access statistics for LRU eviction
   * 6. Track analytics (hit/miss/static response rates)
   *
   * Performance: <100ms for cached responses, 0ms for static responses
   */
  async get(key: string): Promise<AIResponse | null> {
    if (!this.config.enabled || !this.isStorageAvailable) {
      return null;
    }

    // Extract recipe ID and question from key for analytics and static checking
    const recipeId = this.extractRecipeIdFromKey(key);
    const question = this.extractQuestionFromKey(key);

    // CHECK STATIC RESPONSES FIRST - before cache lookup
    if (question && question !== 'cached_question') {
      try {
        const { getStaticAnswer } = await import('./ai-static-responses');
        const staticResponse = getStaticAnswer(question);

        if (staticResponse) {
          // Track static response hit in analytics
          if (recipeId) {
            try {
              const analytics = getAIAnalyticsService();
              analytics.trackStaticResponseHit(recipeId, question);
            } catch (error) {
              console.warn('Failed to track static response hit in analytics:', error);
            }
          }

          // Return static response formatted as AIResponse
          return {
            content: staticResponse,
            finishReason: 'stop',
            model: 'static-response',
            sdkVersion: 'static-1.0',
          };
        }
      } catch (error) {
        console.warn('Failed to check static responses:', error);
        // Continue to cache lookup on static response error
      }
    }

    const cache = this.loadCache();
    const item = cache.items[key];

    if (!item) {
      cache.stats.misses++;
      this.saveCache(cache);

      // Track cache miss in analytics
      if (recipeId && question) {
        try {
          const analytics = getAIAnalyticsService();
          analytics.trackCacheMiss(recipeId, question);
        } catch (error) {
          console.warn('Failed to track cache miss in analytics:', error);
        }
      }

      return null;
    }

    // Check if item has expired
    const now = Date.now();
    if (now - item.timestamp > this.config.defaultTtlMs) {
      delete cache.items[key];
      cache.totalSizeBytes -= item.sizeBytes;
      cache.stats.misses++;
      this.saveCache(cache);

      // Track cache miss for expired item
      if (recipeId && question) {
        try {
          const analytics = getAIAnalyticsService();
          analytics.trackCacheMiss(recipeId, question);
        } catch (error) {
          console.warn('Failed to track cache miss in analytics:', error);
        }
      }

      return null;
    }

    // Update access statistics
    item.lastAccessed = now;
    item.accessCount++;
    cache.stats.hits++;

    this.saveCache(cache);

    // Track cache hit in analytics
    if (recipeId && question) {
      try {
        const analytics = getAIAnalyticsService();
        analytics.trackCacheHit(recipeId, question);
      } catch (error) {
        console.warn('Failed to track cache hit in analytics:', error);
      }
    }

    // Decompress if needed
    if (item.compressed) {
      const decompressed = decompressFromCache<AIResponse>(item.response as unknown as string);
      if (decompressed) {
        return decompressed;
      } else {
        // Decompression failed, remove corrupted item
        console.error(`Failed to decompress cache item for key: ${key}`);
        delete cache.items[key];
        cache.totalSizeBytes -= item.sizeBytes;
        this.saveCache(cache);
        return null;
      }
    }

    return item.response as AIResponse;
  }

  /**
   * Store AI response in cache with TTL
   *
   * CACHE STORAGE FLOW:
   * 1. Check cache enabled and storage available
   * 2. Calculate item size including metadata
   * 3. Check space limits (maxItems, maxSizeBytes)
   * 4. Perform LRU eviction if needed to make space
   * 5. Store item with access tracking for future LRU
   * 6. Update cache statistics and total size
   *
   * LRU EVICTION STRATEGY:
   * - Sort items by lastAccessed timestamp (oldest first)
   * - Remove oldest items until sufficient space available
   * - Track eviction count and timestamp for analytics
   */
  async set(key: string, value: AIResponse, ttl?: number): Promise<void> {
    if (!this.config.enabled || !this.isStorageAvailable) {
      return;
    }

    const cache = this.loadCache();
    const now = Date.now();

    // Prepare the response data
    let responseToStore: AIResponse | string = value;
    let isCompressed = false;
    let compressionRatio = 0;
    let itemSize: number;

    // Calculate original size
    const originalData = JSON.stringify(value);
    const originalSize = calculateStringSize(originalData);

    // Try compression if data is large enough
    if (shouldCompress(originalSize)) {
      const compressionResult = compressForCache(value);
      responseToStore = compressionResult.compressed;
      isCompressed = true;
      compressionRatio = compressionResult.stats.compressionRatio;
      itemSize = compressionResult.stats.compressedSize + calculateStringSize(key) + 100; // metadata overhead

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `Cache compression: ${(compressionRatio * 100).toFixed(1)}% reduction for key ${key}`
        );
      }
    } else {
      itemSize = originalSize + calculateStringSize(key) + 100; // metadata overhead
    }

    // Create the cache item
    const newItem: CacheItem = {
      response: responseToStore as AIResponse, // Store either compressed or original
      timestamp: now,
      accessCount: 1,
      lastAccessed: now,
      sizeBytes: itemSize,
      compressed: isCompressed,
      compressionRatio: isCompressed ? compressionRatio : undefined,
    };

    // Check if we need to make space
    if (!this.canAddToCache(cache, newItem.sizeBytes)) {
      this.makeSpace(cache, newItem.sizeBytes);
    }

    // Remove existing item if it exists (for size calculation)
    if (cache.items[key]) {
      cache.totalSizeBytes -= cache.items[key].sizeBytes;
    }

    // Add new item
    cache.items[key] = newItem;
    cache.totalSizeBytes += newItem.sizeBytes;

    this.saveCache(cache);
  }

  /**
   * Invalidate cache entries matching a pattern
   *
   * INVALIDATION PATTERNS:
   * - Recipe-specific: `ai_${recipeId}_.*` - Clear all questions for a recipe
   * - Question type: `.*substitution.*` - Clear all substitution questions
   * - Global: `.*` - Clear entire cache (version changes)
   *
   * COMMON USE CASES:
   * - Recipe updates → invalidate(ai_123_.*)
   * - Ingredient changes → invalidate(.*substitution.*)
   * - App version update → invalidate(.*)
   *
   * Performance: O(n) where n = total cached items
   */
  async invalidate(pattern: string): Promise<void> {
    if (!this.config.enabled || !this.isStorageAvailable) {
      return;
    }

    const cache = this.loadCache();
    const regex = new RegExp(pattern);
    let removedSize = 0;

    for (const [key, item] of Object.entries(cache.items)) {
      if (regex.test(key)) {
        removedSize += item.sizeBytes;
        delete cache.items[key];
      }
    }

    cache.totalSizeBytes -= removedSize;
    this.saveCache(cache);
  }

  /**
   * Track question being asked (for analytics)
   */
  trackQuestionAsked(recipeId: string, question: string): void {
    if (!recipeId || !question?.trim()) {
      return;
    }

    try {
      const analytics = getAIAnalyticsService();
      const normalizedQuestion = this.normalizeQuestion(question);
      analytics.trackQuestion(question, recipeId, normalizedQuestion);
    } catch (error) {
      console.warn('Failed to track question in analytics:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    if (!this.config.enabled || !this.isStorageAvailable) {
      return {
        totalItems: 0,
        totalSizeBytes: 0,
        evictionsCount: 0,
      };
    }

    const cache = this.loadCache();
    const items = Object.values(cache.items);
    const totalRequests = cache.stats.hits + cache.stats.misses;

    return {
      totalItems: items.length,
      totalSizeBytes: cache.totalSizeBytes,
      hitRate: totalRequests > 0 ? cache.stats.hits / totalRequests : undefined,
      missRate: totalRequests > 0 ? cache.stats.misses / totalRequests : undefined,
      evictionsCount: cache.evictionsCount,
      lastEviction: cache.lastEviction,
      oldestEntry: items.length > 0 ? Math.min(...items.map((item) => item.timestamp)) : undefined,
      newestEntry: items.length > 0 ? Math.max(...items.map((item) => item.timestamp)) : undefined,
    };
  }
}

/**
 * Singleton instance for AI cache service
 */
let aiCacheServiceInstance: AICacheServiceImpl | null = null;

/**
 * Initialize the AI cache service with configuration
 */
export function initializeAICacheService(config: AICacheConfig = {}): AICacheService {
  aiCacheServiceInstance = new AICacheServiceImpl(config);
  return aiCacheServiceInstance;
}

/**
 * Get the initialized AI cache service instance
 */
export function getAICacheService(): AICacheService {
  if (!aiCacheServiceInstance) {
    aiCacheServiceInstance = new AICacheServiceImpl();
  }
  return aiCacheServiceInstance;
}

/**
 * Reset the AI cache service instance (useful for testing)
 */
export function resetAICacheService(): void {
  aiCacheServiceInstance = null;
}

/**
 * Standalone function to normalize Romanian questions for external use
 */
export function normalizeRomanianQuestion(question: string): string {
  const service = getAICacheService();
  return service.normalizeQuestionForCaching(question);
}

export default AICacheServiceImpl;
