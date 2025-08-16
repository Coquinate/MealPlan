/**
 * Example usage of the AI cache invalidation system
 *
 * This file demonstrates how to use the cache invalidation features
 * for recipe updates in the Romanian meal planning platform.
 */

import {
  triggerRecipeUpdate,
  invalidateRecipeCache,
  invalidateAllAICache,
  recipeCacheEvents,
  getAIService,
  initializeAIService,
} from '../ai-service';

// Example 1: Initialize AI service with cache invalidation
export function initializeAIServiceWithCaching() {
  initializeAIService({
    apiKey: process.env.GOOGLE_AI_API_KEY || '',
    model: 'gemini-2.0-flash',
    cache: {
      enabled: true,
      ttlSeconds: 3600, // 1 hour
    },
  });
}

// Example 2: Trigger recipe updates for automatic cache invalidation
export function handleRecipeUpdate(recipeId: string, updateType: 'create' | 'update' | 'delete') {
  // This will automatically invalidate cache for the specified recipe
  triggerRecipeUpdate(recipeId, updateType);

  console.log(`Recipe ${recipeId} ${updateType} event triggered - cache invalidated`);
}

// Example 3: Manual cache invalidation for specific recipe
export async function manuallyInvalidateRecipe(recipeId: string) {
  try {
    await invalidateRecipeCache(recipeId);
    console.log(`Cache for recipe ${recipeId} manually invalidated`);
  } catch (error) {
    console.error('Failed to invalidate recipe cache:', error);
  }
}

// Example 4: Clear all AI cache (useful for debugging)
export async function clearAllAICache() {
  try {
    await invalidateAllAICache();
    console.log('All AI cache cleared');
  } catch (error) {
    console.error('Failed to clear all AI cache:', error);
  }
}

// Example 5: Set up custom cache invalidation listener
export function setupCustomCacheListener() {
  const unsubscribe = recipeCacheEvents.subscribe((event) => {
    console.log(`Recipe ${event.type} detected:`, {
      recipeId: event.recipeId,
      timestamp: new Date(event.timestamp).toISOString(),
      type: event.type,
    });

    // You can add custom logic here, such as:
    // - Sending analytics events
    // - Updating UI components
    // - Notifying other services
  });

  // Return unsubscribe function for cleanup
  return unsubscribe;
}

// Example 6: Edge Function integration (for Supabase)
export async function handleRecipeUpdateInEdgeFunction(
  recipeId: string,
  updateType: 'create' | 'update' | 'delete'
) {
  try {
    // Update the recipe in database first
    // ... database update code ...

    // Then trigger cache invalidation
    triggerRecipeUpdate(recipeId, updateType);

    // Optionally wait for invalidation to complete
    await invalidateRecipeCache(recipeId);

    return { success: true, message: `Recipe ${recipeId} updated and cache invalidated` };
  } catch (error) {
    console.error('Error in recipe update:', error);
    return { success: false, error: error.message };
  }
}

// Example 7: Batch recipe updates with optimized cache invalidation
export async function handleBatchRecipeUpdates(recipeIds: string[]) {
  try {
    // Update all recipes in database first
    // ... batch database update code ...

    // Trigger cache invalidation for each recipe
    recipeIds.forEach((recipeId) => {
      triggerRecipeUpdate(recipeId, 'update');
    });

    console.log(`Cache invalidated for ${recipeIds.length} recipes`);

    return { success: true, invalidatedCount: recipeIds.length };
  } catch (error) {
    console.error('Error in batch recipe update:', error);
    return { success: false, error: error.message };
  }
}

// Example 8: Cache invalidation with performance monitoring
export async function invalidateRecipeWithMonitoring(recipeId: string) {
  const startTime = performance.now();

  try {
    await invalidateRecipeCache(recipeId);

    const duration = performance.now() - startTime;

    // Log performance metrics
    console.log(`Cache invalidation for recipe ${recipeId} completed in ${duration.toFixed(2)}ms`);

    // Send metrics to monitoring service if needed
    if (duration > 100) {
      console.warn(`Slow cache invalidation detected: ${duration.toFixed(2)}ms`);
    }

    return { success: true, duration };
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`Cache invalidation failed after ${duration.toFixed(2)}ms:`, error);
    return { success: false, error: error.message, duration };
  }
}

// Example 9: Integration with React hooks (for frontend)
export function useCacheInvalidationListener(callback: (recipeId: string) => void) {
  // In a real React hook, you'd use useEffect
  const unsubscribe = recipeCacheEvents.subscribe((event) => {
    callback(event.recipeId);
  });

  // Return cleanup function
  return unsubscribe;
}

// Example 10: Cache version management
export function checkCacheVersion() {
  // The cache version is automatically managed by the AI service
  // When the version changes, all cache is automatically cleared
  console.log('Cache version management is handled automatically');
  console.log('Current version: 1.1.0 (includes invalidation support)');
}

/*
Usage in Edge Functions (Supabase):

// In supabase/functions/recipes/update.ts
import { handleRecipeUpdateInEdgeFunction } from '@coquinate/shared';

export async function handler(req: Request) {
  const { recipeId, ...updateData } = await req.json();
  
  // Update recipe in database
  const { error } = await supabase
    .from('recipes')
    .update(updateData)
    .eq('id', recipeId);
    
  if (error) throw error;
  
  // Invalidate cache
  const result = await handleRecipeUpdateInEdgeFunction(recipeId, 'update');
  
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
}

Usage in React components:

// In a React component
import { triggerRecipeUpdate, useCacheInvalidationListener } from '@coquinate/shared';

function RecipeEditor() {
  // Set up cache invalidation listener
  useCacheInvalidationListener((recipeId) => {
    // Refresh recipe data in UI
    refreshRecipeData(recipeId);
  });
  
  const handleSaveRecipe = async (recipeId: string, data: any) => {
    // Save recipe
    await saveRecipe(recipeId, data);
    
    // Trigger cache invalidation
    triggerRecipeUpdate(recipeId, 'update');
  };
  
  return <div>Recipe Editor</div>;
}

Performance Considerations:
- Recipe-specific invalidation: < 100ms target
- Full cache invalidation: < 200ms target  
- Thread-safe operations
- Graceful error handling
- Development mode logging

Error Handling:
- All invalidation methods are non-throwing
- Errors are logged but don't break application flow
- Invalid inputs are validated and rejected gracefully
- Cache service unavailability is handled

Thread Safety:
- Multiple invalidations can run concurrently
- Event system prevents race conditions
- Cache operations are atomic
*/
