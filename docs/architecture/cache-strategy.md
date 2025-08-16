# AI Response Cache Strategy

## Overview

This document outlines the comprehensive caching strategy for AI responses in the Coquinate meal planning platform. The caching system is designed to minimize API costs, improve response times, and provide a better user experience while maintaining response quality.

## Architecture

### Cache Layers (Performance Hierarchy)

The system implements a **4-tier caching architecture** with the following hierarchy:

```
User Question → [1] Static Responses → [2] localStorage Cache → [3] Gemini Implicit Cache → [4] Fresh API Call
    ↓               ↓ (Instant)          ↓ (<100ms)            ↓ (75% discount)      ↓ (Full cost)
Response Time:     0ms                  50-100ms              200-500ms             800-2000ms
Cost:              $0                   $0                    25% of normal         100% of normal
```

#### Layer 1: Static Responses

- **Purpose**: Instant responses for common, factual questions
- **Response Time**: 0ms (immediate)
- **Cost**: $0 (no API call)
- **Examples**: "Ce este paprika?", "Cum se păstrează cartofii?"
- **Implementation**: Pre-written responses in `ai-static-responses.ts`

#### Layer 2: localStorage Cache

- **Purpose**: Store personalized AI responses for specific recipes
- **Response Time**: 50-100ms
- **Cost**: $0 (no API call)
- **TTL**: 7 days (configurable)
- **Capacity**: 50 items, 4MB max (configurable)
- **Eviction**: LRU (Least Recently Used)

#### Layer 3: Gemini Implicit Cache

- **Purpose**: Google's API-level caching for repeated prefixes
- **Response Time**: 200-500ms
- **Cost**: 75% discount on repeated content
- **TTL**: 1 hour (managed by Google)
- **Implementation**: Automatic via AI SDK 4.2

#### Layer 4: Fresh API Call

- **Purpose**: New, uncached requests
- **Response Time**: 800-2000ms
- **Cost**: Full API pricing
- **Fallback**: When all cache layers miss

## Cache Configuration

### Environment Variables

```bash
# Core Cache Settings
NEXT_PUBLIC_CACHE_ENABLED=true              # Master cache toggle
NEXT_PUBLIC_CACHE_MAX_ITEMS=50              # Maximum cached responses
NEXT_PUBLIC_CACHE_TTL_DAYS=7                # Cache time-to-live in days
NEXT_PUBLIC_CACHE_MAX_SIZE_MB=4             # Maximum cache size in MB

# Performance Features
NEXT_PUBLIC_CACHE_PRELOAD_ENABLED=true      # Recipe view preloading
NEXT_PUBLIC_CACHE_WARMUP_ENABLED=true       # Content-based warmup
NEXT_PUBLIC_CACHE_STATIC_RESPONSES=true     # Static response lookup

# Analytics & Monitoring
NEXT_PUBLIC_CACHE_ANALYTICS_ENABLED=true    # Performance tracking
NEXT_PUBLIC_CACHE_ANALYTICS_VERBOSE=false   # Development logging

# AI SDK Features
AI_CACHE_ENABLED=true                       # Gemini implicit cache
AI_CACHE_TTL_SECONDS=3600                   # API-level cache TTL
```

### Configuration Tuning Guidelines

#### For Development

```bash
NEXT_PUBLIC_CACHE_MAX_ITEMS=20              # Smaller for testing
NEXT_PUBLIC_CACHE_TTL_DAYS=1                # Shorter for rapid iteration
NEXT_PUBLIC_CACHE_ANALYTICS_VERBOSE=true    # Enable debug logging
```

#### For Production

```bash
NEXT_PUBLIC_CACHE_MAX_ITEMS=100             # Higher for better hit rates
NEXT_PUBLIC_CACHE_TTL_DAYS=14               # Longer for stability
NEXT_PUBLIC_CACHE_MAX_SIZE_MB=8             # Higher limits for more users
```

#### For Testing/Staging

```bash
NEXT_PUBLIC_CACHE_ENABLED=false             # Disable for fresh responses
NEXT_PUBLIC_CACHE_ANALYTICS_ENABLED=true    # Track performance
```

## Intelligent Question Normalization

### Romanian Language Processing

The cache uses sophisticated normalization to group semantically similar Romanian questions:

```typescript
// Examples of normalized groupings:
"Cu ce pot înlocui untul?" → "substitution_unt"
"Cum pot schimba untul în rețetă?" → "substitution_unt"
"Ce pun în loc de unt?" → "substitution_unt"

"Câte calorii are această rețetă?" → "calories"
"Care e valoarea calorică?" → "calories"

"Cât timp se gătește?" → "duration"
"În cât timp e gata?" → "duration"
```

### Normalization Categories

1. **substitution** - Ingredient replacement questions (highest priority)
2. **storage** - Food preservation questions
3. **duration** - Cooking time inquiries
4. **calories** - Nutritional information
5. **servings** - Portion size questions
6. **difficulty** - Recipe complexity
7. **temperature** - Cooking temperature
8. **techniques** - Cooking methods
9. **timeOfDay** - Meal timing questions
10. **ingredients** - General ingredient questions

## Cache Invalidation Strategy

### Automatic Invalidation

1. **Recipe Updates**: Clear all cache entries for modified recipes
2. **Version Changes**: Clear entire cache on app version updates
3. **TTL Expiration**: Remove entries older than configured TTL
4. **Size Limits**: LRU eviction when cache reaches limits

### Manual Invalidation

```typescript
// Clear cache for specific recipe
cacheService.invalidate(`ai_${recipeId}_.*`);

// Clear all substitution questions
cacheService.invalidate(`.*substitution.*`);

// Clear expired items (automatic on init)
cacheService.cleanupExpiredItems();
```

## Performance Targets & Metrics

### Target Performance

| Metric               | Target | Measurement                |
| -------------------- | ------ | -------------------------- |
| Cache Hit Rate       | >60%   | (hits / total requests)    |
| Cached Response Time | <100ms | localStorage access time   |
| Static Response Time | <5ms   | Immediate lookup           |
| Cost Reduction       | >50%   | vs. all fresh API calls    |
| Cache Storage Usage  | <4MB   | localStorage size tracking |

### Monitoring & Analytics

The system tracks:

- **Hit/Miss Rates**: Cache effectiveness
- **Response Times**: Performance per cache layer
- **Storage Usage**: Memory consumption
- **Popular Questions**: Most frequently asked
- **Cost Savings**: Estimated API cost reduction

### Analytics Implementation

```typescript
// Automatic tracking in AI Analytics Service
analytics.trackCacheHit(recipeId, question);
analytics.trackCacheMiss(recipeId, question);
analytics.trackStaticResponseHit(recipeId, question);
analytics.calculateCostSavings();
```

## Implementation Details

### Cache Key Generation

```typescript
// Format: ai_{recipeId}_{questionHash}
const cacheKey = cacheService.generateCacheKey(recipeId, question);
// Example: "ai_123_a5b2c3d4"
```

### Storage Structure

```typescript
interface LocalStorageCache {
  version: string; // Cache version for compatibility
  totalSizeBytes: number; // Current cache size
  evictionsCount: number; // Total evictions performed
  lastEviction?: number; // Timestamp of last eviction
  stats: {
    hits: number; // Cache hits
    misses: number; // Cache misses
  };
  items: Record<string, CacheItem>; // Cached responses
}

interface CacheItem {
  response: AIResponse; // The cached AI response
  timestamp: number; // When cached
  accessCount: number; // Access frequency
  lastAccessed: number; // Last access time
  sizeBytes: number; // Item size for LRU
}
```

### LRU Eviction Algorithm

1. **Size Check**: Calculate required space for new item
2. **Space Available**: Check if current cache can accommodate
3. **Eviction Trigger**: Remove oldest items when limits exceeded
4. **Update Stats**: Track evictions for analytics

## Best Practices

### For Developers

1. **Cache-Aware Development**

   ```typescript
   // Always check cache first
   const cached = await cacheService.get(cacheKey);
   if (cached) return cached;

   // Make API call and cache result
   const response = await aiService.generateResponse(prompt);
   await cacheService.set(cacheKey, response);
   ```

2. **Invalidation Discipline**

   ```typescript
   // Invalidate when recipe changes
   await updateRecipe(recipeId, changes);
   await cacheService.invalidate(`ai_${recipeId}_.*`);
   ```

3. **Testing Cache Behavior**
   ```typescript
   // Disable cache in tests for predictable behavior
   process.env.NEXT_PUBLIC_CACHE_ENABLED = 'false';
   ```

### For Content Creators

1. **Static Response Coverage**: Add common questions to static responses
2. **Consistent Terminology**: Use standard Romanian culinary terms
3. **Question Templates**: Guide users toward cacheable question patterns

### For System Administrators

1. **Monitor Hit Rates**: Aim for >60% cache hit rate
2. **Adjust Limits**: Increase cache size if hit rate is low
3. **TTL Tuning**: Balance freshness vs. performance
4. **Cost Tracking**: Monitor API usage and savings

## Troubleshooting

### Common Issues

1. **Low Hit Rate (<40%)**
   - Increase cache size (`NEXT_PUBLIC_CACHE_MAX_ITEMS`)
   - Extend TTL (`NEXT_PUBLIC_CACHE_TTL_DAYS`)
   - Check question normalization effectiveness

2. **Storage Quota Exceeded**
   - Reduce cache size (`NEXT_PUBLIC_CACHE_MAX_SIZE_MB`)
   - Decrease TTL for faster turnover
   - Monitor cache analytics for large items

3. **Slow Cache Performance**
   - Check browser localStorage performance
   - Verify cache size is reasonable
   - Consider reducing normalization complexity

### Debug Tools

```typescript
// Get cache statistics
const stats = cacheService.getStats();
console.log('Cache hit rate:', stats.hitRate);
console.log('Cache size:', stats.totalSizeBytes / 1024 / 1024, 'MB');

// Enable verbose logging
localStorage.setItem('ai_cache_debug', 'true');
```

## Future Enhancements

### Planned Improvements

1. **Semantic Similarity**: ML-based question matching
2. **Predictive Preloading**: Load common questions before asked
3. **Cross-Recipe Patterns**: Cache responses across similar recipes
4. **Dynamic TTL**: Adjust TTL based on question popularity
5. **Cloud Cache**: Share cache across devices for logged-in users

### Migration Strategy

The cache system includes versioning to handle future upgrades:

```typescript
// Automatic migration on version mismatch
if (cache.version !== CURRENT_VERSION) {
  migrateCache(cache);
}
```

## Security Considerations

### Data Privacy

- **Local Storage Only**: No sensitive data sent to external cache
- **Question Anonymization**: Hash questions for analytics
- **User Control**: Respect user privacy settings

### Cache Security

- **Size Limits**: Prevent DoS via cache overflow
- **Input Validation**: Sanitize cache keys and values
- **Error Handling**: Graceful degradation on cache failures

---

This cache strategy provides a robust foundation for cost-effective AI response management while maintaining excellent user experience and system performance.
