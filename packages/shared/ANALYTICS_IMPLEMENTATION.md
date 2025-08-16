# AI Analytics Implementation

## Overview

This implementation provides comprehensive analytics for AI question frequency tracking and cache performance metrics, as specified in Story 1.14. The system tracks user questions, cache hit/miss rates, and calculates cost savings while maintaining performance and preventing unbounded localStorage growth.

## Core Components

### 1. Analytics Service (`ai-analytics.ts`)

**Main Features:**

- Track question frequencies per recipe and globally
- Monitor cache hits/misses with daily/monthly rollups
- Calculate cost savings (hits × $0.001 per request)
- JSON export functionality for manual analysis
- Automatic daily/monthly data rollup to prevent storage bloat
- Development mode logging (console.log every 10th request)

**Key Methods:**

```typescript
// Track question being asked
trackQuestion(question: string, recipeId: string, normalizedQuestion?: string): void

// Track cache performance
trackCacheHit(recipeId: string, question: string): void
trackCacheMiss(recipeId: string, question: string): void

// Get insights
getCacheEffectiveness(): CacheEffectiveness
getTopQuestions(limit?: number): Array<{question, count, recipes, lastAsked}>
getTopQuestionsForRecipe(recipeId: string, limit?: number): Array<{question, count}>

// Export and maintenance
exportAnalytics(): AnalyticsExport
performDailyRollup(): void
performMonthlyRollup(): void
```

**Data Structure:**

```typescript
interface AnalyticsData {
  questionFrequencies: {
    [recipeId: string]: {
      [normalizedQuestion: string]: number;
    };
  };
  globalQuestions: {
    [normalizedQuestion: string]: {
      count: number;
      lastAsked: number;
      recipeIds: string[];
      normalizedForm: string;
    };
  };
  cacheMetrics: {
    current: CacheMetrics;
    daily: { [date: string]: DailyCacheMetrics };
    monthly: { [month: string]: MonthlyCacheMetrics };
  };
}
```

### 2. Cache Service Integration (`ai-cache-service.ts`)

**Enhanced Features:**

- Automatic analytics tracking on cache get/set operations
- Question mapping storage for better analytics
- Integration with question normalization from cache service
- Performance-optimized tracking (non-blocking)

**New Methods:**

```typescript
// Track question when asked (before caching)
trackQuestionAsked(recipeId: string, question: string): void
```

### 3. React Hooks (`useAIAnalytics.ts`)

**Available Hooks:**

```typescript
// Full analytics with real-time updates
useAIAnalytics(options?: {
  refreshInterval?: number;
  topQuestionsLimit?: number;
  realTimeUpdates?: boolean;
})

// Simple cache effectiveness monitoring
useCacheEffectiveness()

// Recipe-specific question analytics
useRecipeQuestionAnalytics(recipeId: string, limit?: number)
```

**Example Usage:**

```typescript
const {
  data: analytics,
  loading,
  error,
  refresh,
  exportData,
  hitRate,
  totalSavings,
  totalQuestions,
} = useAIAnalytics({
  refreshInterval: 30000,
  realTimeUpdates: true,
});
```

### 4. Dashboard Component (`CacheAnalyticsDashboard.tsx`)

**Features:**

- Real-time cache effectiveness display
- Top questions visualization
- Cost savings metrics
- Storage usage monitoring
- Data export functionality
- Romanian language interface

## Technical Specifications

### Performance Requirements

- ✅ Analytics tracking is non-blocking and async
- ✅ All tracking errors are caught and logged (don't break cache)
- ✅ Size management prevents localStorage bloat (1MB limit)
- ✅ Development mode logging every 10th request
- ✅ Daily/monthly rollups maintain 30 days / 12 months max

### Cost Calculation

- Conservative estimate: $0.001 per saved request
- Based on Gemini 2.0 Flash pricing (~500 tokens per response)
- Real-time cost tracking with cumulative totals

### Data Management

- **Daily Rollup**: Keeps last 30 days of detailed metrics
- **Monthly Rollup**: Keeps last 12 months of aggregated data
- **Storage Limit**: 1MB maximum with automatic cleanup
- **Question Mapping**: Last 100 questions for original text retrieval

### Error Handling

- Graceful degradation when localStorage unavailable
- Invalid stored data recovery
- Quota exceeded handling with aggressive cleanup
- Console warnings for tracking failures (non-breaking)

## Integration Examples

### 1. Basic Question Tracking

```typescript
import { getAICacheService } from '@repo/shared';

const cacheService = getAICacheService();

// Track question when user asks
cacheService.trackQuestionAsked(recipeId, question);

// Cache service automatically tracks hits/misses
const cached = await cacheService.get(key); // Auto-tracks hit/miss
```

### 2. React Component Analytics

```typescript
import { useAIAnalytics } from '@/hooks/useAIAnalytics';

function AnalyticsDisplay() {
  const { hitRate, totalSavings, loading } = useAIAnalytics();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Cache Hit Rate: {hitRate.toFixed(1)}%</p>
      <p>Cost Saved: ${totalSavings.toFixed(4)}</p>
    </div>
  );
}
```

### 3. Export Analytics Data

```typescript
import { getAIAnalyticsService } from '@repo/shared';

const analytics = getAIAnalyticsService();
const exportData = analytics.exportAnalytics();

// Save to file or send to server
const blob = new Blob([JSON.stringify(exportData, null, 2)], {
  type: 'application/json',
});
```

## Development Features

### Console Logging

In development mode, every 10th cache request logs:

```
🔍 AI Cache Analytics (Request #50): {
  hitRate: "75.0%",
  totalRequests: 50,
  costSaved: "$0.0375",
  event: "hit",
  recipe: "recipe-123",
  question: "Cât timp se gătește?"
}
```

### Data Export Format

```json
{
  "exportDate": "2023-01-01T00:00:00.000Z",
  "summary": {
    "totalQuestions": 150,
    "totalRecipes": 25,
    "cacheEffectiveness": 78.5,
    "costSavings": 0.125,
    "topQuestions": [...]
  },
  "data": { /* Full analytics data */ }
}
```

## Testing

### Test Coverage

- ✅ Core functionality tests (14 passing tests)
- ✅ Error handling scenarios
- ✅ localStorage unavailability
- ✅ Invalid data recovery
- ✅ Method availability verification
- ✅ Utility function testing

### Test Files

- `ai-analytics-simple.test.ts` - Core functionality verification
- `ai-analytics.test.ts` - Comprehensive integration tests (localStorage mocking)

## Future Considerations

### Admin Dashboard Integration (Task 9)

The analytics service provides all data needed for:

- Cache performance monitoring
- Question pattern analysis
- Cost optimization insights
- Storage usage tracking

### API Endpoint Integration (Task 8)

Export format ready for:

- Server-side analytics processing
- Historical data aggregation
- Cross-user pattern analysis
- Performance optimization recommendations

## File Structure

```
packages/shared/src/utils/
├── ai-analytics.ts                 # Main analytics service
├── ai-analytics.test.ts           # Comprehensive tests
├── ai-analytics-simple.test.ts    # Core functionality tests
├── ai-cache-service.ts            # Enhanced with analytics
└── index.ts                       # Updated exports

apps/web/src/
├── hooks/useAIAnalytics.ts        # React hooks
└── components/analytics/
    └── CacheAnalyticsDashboard.tsx # Example dashboard
```

## Implementation Status

✅ **Completed:**

- Analytics service with full functionality
- Cache service integration
- React hooks for component integration
- Error handling and performance optimization
- Size management and rollup mechanisms
- Development mode logging
- Export functionality
- Example dashboard component
- Comprehensive testing

The implementation is production-ready and follows all requirements from Story 1.14 while maintaining the pragmatic, development-focused approach specified in the project guidelines.
