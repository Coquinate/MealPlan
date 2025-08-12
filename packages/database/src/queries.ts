import { supabase } from './client'
import type { Tables, Enums } from './client'

/**
 * Common database query utilities
 */

// Recipe queries
export const recipeQueries = {
  /**
   * Get all published recipes
   */
  async getPublishedRecipes(menuType?: Enums<'menu_type_enum'>) {
    const query = supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          *,
          ingredient:ingredients (*)
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    
    if (menuType) {
      // Add menu type filter if needed
      // This would require a menu_type field on recipes or filtering through tags
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  },

  /**
   * Get a single recipe by ID with ingredients
   */
  async getRecipeById(id: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          *,
          ingredient:ingredients (*)
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Search recipes by title
   */
  async searchRecipes(searchTerm: string, language: 'ro' | 'en' = 'ro') {
    const titleColumn = language === 'ro' ? 'title_ro' : 'title_en'
    
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('status', 'published')
      .ilike(titleColumn, `%${searchTerm}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Meal plan queries
export const mealPlanQueries = {
  /**
   * Get active meal plan for current user
   */
  async getActiveMealPlan(userId: string) {
    const { data, error } = await supabase
      .from('meal_plans')
      .select(`
        *,
        planned_meals (
          *,
          recipe:recipes (*)
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return data
  },

  /**
   * Create a new meal plan
   */
  async createMealPlan(userId: string, weekStartDate: string) {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert({
        user_id: userId,
        week_start_date: weekStartDate,
        is_active: true
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Add a planned meal to a meal plan
   */
  async addPlannedMeal(plannedMeal: {
    meal_plan_id: string
    recipe_id: string
    day_of_week: Enums<'day_of_week_enum'>
    meal_type: Enums<'meal_type_enum'>
    servings_planned?: number
  }) {
    const { data, error } = await supabase
      .from('planned_meals')
      .insert(plannedMeal)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Shopping list queries
export const shoppingListQueries = {
  /**
   * Get active shopping list for user
   */
  async getActiveShoppingList(userId: string) {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select(`
        *,
        shopping_list_items (
          *,
          ingredient:ingredients (*)
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  /**
   * Create shopping list from meal plan
   */
  async createFromMealPlan(mealPlanId: string, userId: string) {
    // First get all ingredients needed from the meal plan
    const { data: plannedMeals, error: mealsError } = await supabase
      .from('planned_meals')
      .select(`
        *,
        recipe:recipes (
          recipe_ingredients (
            *,
            ingredient:ingredients (*)
          )
        )
      `)
      .eq('meal_plan_id', mealPlanId)
    
    if (mealsError) throw mealsError
    
    // Create the shopping list
    const { data: shoppingList, error: listError } = await supabase
      .from('shopping_lists')
      .insert({
        user_id: userId,
        meal_plan_id: mealPlanId,
        name: `Shopping List - Week of ${new Date().toLocaleDateString()}`,
        is_active: true
      })
      .select()
      .single()
    
    if (listError) throw listError
    
    // Aggregate ingredients from all planned meals
    const ingredientMap = new Map<string, {
      ingredient: Tables<'ingredients'>
      quantity: number
      unit: string
      recipes: string[]
    }>()
    
    plannedMeals?.forEach(meal => {
      meal.recipe?.recipe_ingredients?.forEach((ri: Tables<'recipe_ingredients'> & { ingredient?: Tables<'ingredients'> }) => {
        const key = ri.ingredient_id
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!
          existing.quantity += ri.quantity * (meal.servings_planned || 1)
          existing.recipes.push(meal.recipe_id)
        } else {
          ingredientMap.set(key, {
            ingredient: ri.ingredient,
            quantity: ri.quantity * (meal.servings_planned || 1),
            unit: ri.unit,
            recipes: [meal.recipe_id]
          })
        }
      })
    })
    
    // Create shopping list items
    const items = Array.from(ingredientMap.values()).map((item, index) => ({
      shopping_list_id: shoppingList.id,
      ingredient_id: item.ingredient.id,
      name: item.ingredient.name_ro,
      quantity: item.quantity,
      unit: item.unit,
      category: item.ingredient.shopping_category,
      display_order: index
    }))
    
    if (items.length > 0) {
      const { error: itemsError } = await supabase
        .from('shopping_list_items')
        .insert(items)
      
      if (itemsError) throw itemsError
    }
    
    return shoppingList
  },

  /**
   * Toggle item checked status
   */
  async toggleItemChecked(itemId: string, isChecked: boolean) {
    const { data, error } = await supabase
      .from('shopping_list_items')
      .update({
        is_checked: isChecked,
        checked_at: isChecked ? new Date().toISOString() : null
      })
      .eq('id', itemId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Trial menu queries
export const trialMenuQueries = {
  /**
   * Get active trial menu for a menu type
   */
  async getActiveTrialMenu(menuType: Enums<'menu_type_enum'>) {
    const { data, error } = await supabase
      .from('trial_menus')
      .select(`
        *,
        trial_menu_recipes (
          *,
          recipe:recipes (*)
        )
      `)
      .eq('menu_type', menuType)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Create meal plan from trial menu
   */
  async createMealPlanFromTrial(userId: string, trialMenuId: string) {
    // Get trial menu recipes
    const { data: trialRecipes, error: trialError } = await supabase
      .from('trial_menu_recipes')
      .select('*')
      .eq('trial_menu_id', trialMenuId)
      .order('day_number', { ascending: true })
    
    if (trialError) throw trialError
    
    // Calculate week start date (next Thursday)
    const today = new Date()
    const daysUntilThursday = (4 - today.getDay() + 7) % 7 || 7
    const weekStartDate = new Date(today)
    weekStartDate.setDate(today.getDate() + daysUntilThursday)
    
    // Create meal plan
    const { data: mealPlan, error: planError } = await supabase
      .from('meal_plans')
      .insert({
        user_id: userId,
        week_start_date: weekStartDate.toISOString().split('T')[0],
        is_active: true,
        is_trial_menu: true
      })
      .select()
      .single()
    
    if (planError) throw planError
    
    // Map day numbers to day_of_week enum
    const dayMap: Record<number, Enums<'day_of_week_enum'>> = {
      1: 'thursday',
      2: 'friday',
      3: 'saturday'
    }
    
    // Create planned meals
    const plannedMeals = trialRecipes?.map(recipe => ({
      meal_plan_id: mealPlan.id,
      recipe_id: recipe.recipe_id,
      day_of_week: dayMap[recipe.day_number],
      meal_type: recipe.meal_type
    })) || []
    
    if (plannedMeals.length > 0) {
      const { error: mealsError } = await supabase
        .from('planned_meals')
        .insert(plannedMeals)
      
      if (mealsError) throw mealsError
    }
    
    return mealPlan
  }
}

// Ingredient queries
export const ingredientQueries = {
  /**
   * Get all ingredients
   */
  async getAllIngredients() {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name_ro', { ascending: true })
    
    if (error) throw error
    return data
  },

  /**
   * Search ingredients
   */
  async searchIngredients(searchTerm: string, language: 'ro' | 'en' = 'ro') {
    const nameColumn = language === 'ro' ? 'name_ro' : 'name_en'
    
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .ilike(nameColumn, `%${searchTerm}%`)
      .order(nameColumn, { ascending: true })
      .limit(20)
    
    if (error) throw error
    return data
  }
}

// Feedback queries
export const feedbackQueries = {
  /**
   * Save recipe feedback
   */
  async saveRecipeFeedback(feedback: {
    user_id: string
    recipe_id: string
    rating: 'liked' | 'disliked' | 'neutral'
    comment?: string
    would_cook_again?: boolean
    difficulty_rating?: number
    time_accuracy?: 'too_short' | 'accurate' | 'too_long'
  }) {
    const { data, error } = await supabase
      .from('recipe_feedback')
      .upsert(feedback, {
        onConflict: 'user_id,recipe_id'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Get user's feedback for a recipe
   */
  async getUserRecipeFeedback(userId: string, recipeId: string) {
    const { data, error } = await supabase
      .from('recipe_feedback')
      .select('*')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }
}