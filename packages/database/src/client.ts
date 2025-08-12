import { createClient } from '@supabase/supabase-js'
import type { Database } from '@coquinate/shared/types/database.types'

/**
 * Supabase client configuration
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables
 */

// Ensure required environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

/**
 * Create a typed Supabase client
 * This client is configured with the Database types for full type safety
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'coquinate-web'
    }
  }
})

/**
 * Service Client Note:
 * The createServiceClient function has been moved to a separate server-only file
 * to prevent accidental exposure of the service role key in client-side bundles.
 * 
 * For server-side operations requiring admin access:
 * import { createServiceClient } from '@coquinate/database/server-client'
 */

// Export types for convenience
export type { Database } from '@coquinate/shared/types/database.types'
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Common query helpers
export const TABLES = {
  users: 'users',
  adminUsers: 'admin_users',
  ingredients: 'ingredients',
  recipes: 'recipes',
  recipeIngredients: 'recipe_ingredients',
  mealPlans: 'meal_plans',
  plannedMeals: 'planned_meals',
  leftoverConnections: 'leftover_connections',
  shoppingLists: 'shopping_lists',
  shoppingListItems: 'shopping_list_items',
  recipeFeedback: 'recipe_feedback',
  trialMenus: 'trial_menus',
  trialMenuRecipes: 'trial_menu_recipes',
  draftMealPlans: 'draft_meal_plans',
  draftPlannedMeals: 'draft_planned_meals',
  validationResults: 'validation_results',
  recipeImports: 'recipe_imports',
  publishedWeeks: 'published_weeks',
  subscriptions: 'subscriptions'
} as const