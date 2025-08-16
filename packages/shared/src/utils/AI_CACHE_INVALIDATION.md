# AI Cache Invalidation System

This document describes the cache invalidation mechanism for AI responses when recipes are updated in the Romanian meal planning platform.

## Overview

The cache invalidation system automatically clears cached AI responses when recipes are updated, ensuring that users always receive accurate information based on the latest recipe data.

## Features

- **Automatic Invalidation**: Cache is automatically cleared when recipes are updated
- **Event-Driven Architecture**: Uses event emitters for decoupled invalidation
- **Pattern-Based Invalidation**: Supports regex patterns for flexible cache clearing
- **Version Management**: Automatically clears cache on version updates
- **Performance Optimized**: Sub-100ms invalidation for single recipes
- **Thread-Safe**: Concurrent invalidations don't conflict
- **Error Handling**: Graceful handling of cache errors
- **Development Logging**: Detailed logging in development mode

## API Reference

### Core Functions

#### `triggerRecipeUpdate(recipeId: string, type?: 'create' | 'update' | 'delete')`

Triggers a recipe update event that automatically invalidates cache.

```typescript
import { triggerRecipeUpdate } from '@coquinate/shared';

// Trigger cache invalidation for recipe update
triggerRecipeUpdate('recipe-123', 'update');

// Trigger for recipe deletion
triggerRecipeUpdate('recipe-123', 'delete');
```

#### `invalidateRecipeCache(recipeId: string): Promise<void>`

Manually invalidate cache for a specific recipe.

```typescript
import { invalidateRecipeCache } from '@coquinate/shared';

// Manually invalidate cache for a recipe
await invalidateRecipeCache('recipe-123');
```

#### `invalidateAllAICache(): Promise<void>`

Clear all AI cache entries.

```typescript
import { invalidateAllAICache } from '@coquinate/shared';

// Clear all AI cache (useful for debugging)
await invalidateAllAICache();
```

### Event System

#### `recipeCacheEvents`

Global event emitter for recipe cache invalidation events.

```typescript
import { recipeCacheEvents } from '@coquinate/shared';

// Subscribe to cache invalidation events
const unsubscribe = recipeCacheEvents.subscribe((event) => {
  console.log(`Recipe ${event.recipeId} was ${event.type}d`);
});

// Clean up listener
unsubscribe();
```

## Integration Examples

### Edge Functions (Supabase)

```typescript
// supabase/functions/recipes/update.ts
import { triggerRecipeUpdate } from '@coquinate/shared';

export async function handler(req: Request) {
  const { recipeId, ...updateData } = await req.json();

  // Update recipe in database
  const { error } = await supabase.from('recipes').update(updateData).eq('id', recipeId);

  if (error) throw error;

  // Trigger cache invalidation
  triggerRecipeUpdate(recipeId, 'update');

  return new Response(JSON.stringify({ success: true }));
}
```

### React Components

```typescript
import { triggerRecipeUpdate, recipeCacheEvents } from '@coquinate/shared';
import { useEffect } from 'react';

function RecipeEditor() {
  // Listen for cache invalidation events
  useEffect(() => {
    const unsubscribe = recipeCacheEvents.subscribe((event) => {
      // Refresh UI when cache is invalidated
      if (event.recipeId === currentRecipeId) {
        refreshRecipeData();
      }
    });

    return unsubscribe;
  }, []);

  const handleSaveRecipe = async (recipeId: string, data: any) => {
    await saveRecipe(recipeId, data);

    // Trigger cache invalidation
    triggerRecipeUpdate(recipeId, 'update');
  };

  return <div>Recipe Editor</div>;
}
```

### Batch Operations

```typescript
import { triggerRecipeUpdate } from '@coquinate/shared';

async function bulkUpdateRecipes(recipeIds: string[], updateData: any) {
  // Update all recipes in database
  await Promise.all(recipeIds.map((id) => updateRecipe(id, updateData)));

  // Trigger cache invalidation for all recipes
  recipeIds.forEach((id) => {
    triggerRecipeUpdate(id, 'update');
  });
}
```

## Cache Version Management

The system automatically manages cache versions to ensure compatibility:

- **Current Version**: 1.1.0 (includes invalidation support)
- **Version Mismatch**: Automatically clears all cache on version change
- **Backward Compatibility**: Gracefully handles old cache formats

## Performance Characteristics

- **Recipe-specific invalidation**: < 100ms target
- **Full cache invalidation**: < 200ms target
- **Memory efficient**: O(n) pattern matching where n = cache entries
- **Thread-safe**: Supports concurrent operations
- **Non-blocking**: Invalidation errors don't affect application flow

## Error Handling

The invalidation system is designed to be fault-tolerant:

```typescript
// All invalidation functions are non-throwing
await invalidateRecipeCache('invalid-id'); // Won't throw
await invalidateAllAICache(); // Won't throw even if cache unavailable

// Errors are logged but don't break application flow
// Development mode provides detailed error logging
```

## Configuration

The cache invalidation system uses the existing AI service configuration:

```typescript
import { initializeAIService } from '@coquinate/shared';

initializeAIService({
  apiKey: process.env.GOOGLE_AI_API_KEY,
  cache: {
    enabled: true, // Must be true for invalidation to work
    ttlSeconds: 3600, // Cache TTL
  },
});
```

## Cache Key Format

Cache keys follow this pattern:

```
ai_{recipeId}_{questionHash}
```

Invalidation uses regex patterns to match keys:

```typescript
// Invalidate all cache for recipe-123
const pattern = '^ai_recipe-123_';
```

## Development and Debugging

### Development Logging

In development mode, the system provides detailed logging:

```typescript
// Example logs
console.log('Invalidated cache for recipe recipe-123 in 15.32ms');
console.warn('Cache invalidation took 150.25ms, exceeding 100ms target');
console.error('Failed to invalidate cache for recipe recipe-123: Error message');
```

### Manual Cache Management

For debugging purposes:

```typescript
import { invalidateAllAICache, getAICacheService } from '@coquinate/shared';

// Clear all cache
await invalidateAllAICache();

// Get cache statistics
const cacheService = getAICacheService();
const stats = cacheService.getStats();
console.log('Cache stats:', stats);
```

### Performance Monitoring

```typescript
import { invalidateRecipeCache } from '@coquinate/shared';

async function monitoredInvalidation(recipeId: string) {
  const startTime = performance.now();

  await invalidateRecipeCache(recipeId);

  const duration = performance.now() - startTime;

  if (duration > 100) {
    console.warn(`Slow invalidation: ${duration.toFixed(2)}ms`);
  }
}
```

## Testing

The system includes comprehensive tests covering:

- Recipe-specific invalidation
- Event-driven invalidation
- Full cache clearing
- Performance requirements
- Error handling
- Version management

Run tests:

```bash
npm test ai-cache-invalidation
```

## Migration Guide

### From Manual Cache Management

**Before:**

```typescript
// Manual cache clearing
localStorage.removeItem('ai_recipe-123_question1');
localStorage.removeItem('ai_recipe-123_question2');
```

**After:**

```typescript
// Automatic cache invalidation
triggerRecipeUpdate('recipe-123', 'update');
```

### Integration Checklist

1. ✅ Update recipe save/update endpoints to call `triggerRecipeUpdate()`
2. ✅ Replace manual cache clearing with event-driven invalidation
3. ✅ Add cache invalidation listeners to UI components if needed
4. ✅ Test invalidation in development mode
5. ✅ Monitor performance in production

## Best Practices

1. **Always trigger invalidation after database updates**

   ```typescript
   await updateRecipe(id, data);
   triggerRecipeUpdate(id, 'update'); // After DB update
   ```

2. **Use event system for decoupled architecture**

   ```typescript
   // Good: Event-driven
   triggerRecipeUpdate(id, 'update');

   // Avoid: Direct coupling
   await invalidateRecipeCache(id);
   ```

3. **Handle batch operations efficiently**

   ```typescript
   // Efficient batch invalidation
   recipeIds.forEach((id) => triggerRecipeUpdate(id, 'update'));
   ```

4. **Monitor performance in production**
   ```typescript
   // Add performance monitoring for slow invalidations
   if (duration > 100) {
     sendMetrics('slow_cache_invalidation', { recipeId, duration });
   }
   ```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Edge Function │    │   Event Emitter  │    │  Cache Service  │
│                 │    │                  │    │                 │
│ triggerRecipe   │───▶│ recipeCacheEvents│───▶│ invalidate()    │
│ Update()        │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         │                        │                       │
         ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Database      │    │   UI Components  │    │  localStorage   │
│   Update        │    │   Refresh        │    │  Clear Entries  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Support

For issues or questions about the cache invalidation system:

1. Check the test suite for usage examples
2. Review the examples in `cache-invalidation-usage.ts`
3. Enable development logging for debugging
4. Monitor performance metrics in production

The cache invalidation system is designed to be robust, performant, and easy to integrate into the existing Romanian meal planning platform architecture.
