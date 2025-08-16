# AI Cache Preloading Implementation

## Overview

This document summarizes the implementation of Task 8 from Story 1.14: **Cache Preloading on Recipe View**. The system automatically preloads and caches the top 3 most common questions when a recipe is viewed, improving user experience by providing instant AI responses.

## Architecture

### Core Components

1. **AI Preloader Service** (`packages/shared/src/utils/ai-preloader.ts`)
   - Central service for managing question preloading
   - Rate limit aware with staggered requests
   - Background operation with cancellation support
   - Analytics integration for smart question selection

2. **React Hook** (`apps/web/src/hooks/useRecipePreloader.ts`)
   - `useRecipePreloader` - Main hook for recipe detail pages
   - `useRecipeHoverPreloader` - Lightweight hook for hover preloading
   - Automatic cleanup and cancellation management

3. **Example Components** (`apps/web/src/components/RecipeDetailExample.tsx`)
   - Demonstrates integration patterns
   - Shows UI feedback during preloading
   - Recipe card hover preloading example

## Implementation Details

### Smart Question Selection

The system uses a multi-tier approach for selecting questions to preload:

1. **Recipe-specific analytics** - Uses most frequently asked questions for this specific recipe
2. **Global analytics fallback** - Uses globally popular questions if no recipe-specific data
3. **Default Romanian questions** - Hardcoded fallbacks ensuring functionality

```typescript
const DEFAULT_TOP_QUESTIONS = [
  'Cât timp durează rețeta?', // How long does the recipe take?
  'Pentru câte persoane este?', // How many servings?
  'Ce pot înlocui?', // What can I substitute?
  'Câte calorii are?', // How many calories?
  'Care este gradul de dificultate?', // What's the difficulty level?
];
```

### Rate Limit Management

- **Staggered requests**: 1-second intervals between questions by default
- **Rate limit checking**: Respects AI service rate limits before each request
- **Exponential backoff**: Intelligent retry on rate limit errors
- **Cancellation**: Can cancel ongoing preloads on navigation

### Configuration Options

```typescript
interface PreloadConfig {
  maxQuestions: number; // Default: 3
  staggerDelay: number; // Default: 1000ms
  priority: 'high' | 'low'; // High for immediate view, low for hover
  timeout?: number; // Max time to wait for completion
}
```

### Cache Integration

- **Duplicate checking**: Only preloads questions not already cached
- **Cache key generation**: Uses existing cache service key generation
- **Analytics tracking**: Records cache hits from preloading
- **Storage efficient**: Respects cache size limits

## Usage Examples

### Recipe Detail Page

```tsx
function RecipeDetail({ recipe }) {
  const { preloadStatus, progress, isLoading, isCompleted, hasError } = useRecipePreloader(
    recipe.id,
    {
      autoStart: true,
      config: {
        maxQuestions: 3,
        staggerDelay: 1000,
        priority: 'high',
      },
    }
  );

  return (
    <div>
      {isLoading && <div>Pregătesc asistentul AI... ({progress}%)</div>}

      {isCompleted && <div>✓ Asistentul AI este pregătit</div>}

      {/* Recipe content */}
    </div>
  );
}
```

### Recipe Card with Hover Preloading

```tsx
function RecipeCard({ recipe, onClick }) {
  const { onMouseEnter, onMouseLeave, isPreloading } = useRecipeHoverPreloader(recipe.id);

  return (
    <div onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* Recipe card content */}
      {isPreloading && <LoadingIcon />}
    </div>
  );
}
```

## Performance Characteristics

### Preloading Efficiency

- **Background operation**: Never blocks UI or navigation
- **Smart caching**: Only preloads uncached questions
- **Minimal overhead**: Low memory footprint with cleanup
- **Cancelable**: Stops immediately on navigation away

### Rate Limit Compliance

- **Default stagger**: 1 second between requests
- **Configurable delays**: Adjustable based on use case
- **Rate limit aware**: Checks limits before each request
- **Graceful degradation**: Continues with partial success

### Analytics Integration

- **Question tracking**: Records which questions are asked most
- **Cache effectiveness**: Measures hit rate improvement
- **Cost savings**: Tracks reduced AI API calls
- **Preload success**: Monitors preloading completion rates

## Integration Points

### With Existing Systems

1. **AI Cache Service**: Uses existing cache keys and storage
2. **AI Analytics**: Leverages question frequency data
3. **AI Service**: Makes requests through existing AI service
4. **Rate Limiter**: Respects existing rate limiting rules

### Error Handling

- **Service unavailable**: Graceful degradation when services offline
- **Rate limiting**: Proper handling of rate limit errors
- **Network issues**: Retry logic with exponential backoff
- **Cancellation**: Clean cancellation without errors

## Testing

### Unit Tests

- **Service functionality**: Core preloading logic
- **Rate limiting**: Proper rate limit handling
- **Cache integration**: Correct cache interactions
- **Analytics integration**: Proper tracking calls
- **Error scenarios**: Graceful error handling

### React Hook Tests

- **Lifecycle management**: Mount, unmount, recipe changes
- **Configuration**: Different config options
- **Status updates**: Proper status tracking
- **Callbacks**: onCompleted and onError callbacks

## Configuration Files Updated

### Package Exports

```typescript
// packages/shared/src/utils/index.ts
export * from './ai-preloader';
export { default as AIPreloaderService } from './ai-preloader';
```

## Files Created

1. **Core Service**: `packages/shared/src/utils/ai-preloader.ts` (544 lines)
2. **React Hook**: `apps/web/src/hooks/useRecipePreloader.ts` (318 lines)
3. **Service Tests**: `packages/shared/src/utils/ai-preloader.test.ts` (437 lines)
4. **Hook Tests**: `apps/web/src/hooks/useRecipePreloader.test.tsx` (373 lines)
5. **Example Components**: `apps/web/src/components/RecipeDetailExample.tsx` (193 lines)

## Monitoring and Analytics

### Key Metrics

- **Preload success rate**: Percentage of successful preloads
- **Cache hit improvement**: Before/after cache hit rates
- **User experience impact**: Faster AI response times
- **Question accuracy**: How often preloaded questions are asked

### Development Logging

```typescript
// Development mode provides detailed logging
console.log(`Preload: Starting for recipe ${recipeId} with ${questionsCount} questions`);
console.log(`Preload: Completed for recipe ${recipeId}`);
console.log(`AI Cache Analytics: Hit rate ${hitRate}%, Cost saved $${costSaved}`);
```

## Future Enhancements

1. **Machine Learning**: Predictive question selection based on recipe content
2. **User Patterns**: Personalized question preloading based on user history
3. **Progressive Loading**: Start with most likely question, continue with others
4. **Batch Preloading**: Preload questions for multiple related recipes

## Conclusion

The AI Cache Preloading system provides significant user experience improvements by:

- **Instant responses** for common questions through preloading
- **Smart question selection** using analytics data
- **Rate limit compliance** with staggered, respectful requests
- **Seamless integration** with existing AI infrastructure
- **Performance optimization** through background operation and caching

The implementation follows React best practices with proper lifecycle management, error handling, and testing coverage. The system gracefully degrades when services are unavailable and provides comprehensive monitoring for optimization.
