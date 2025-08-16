import type { Database } from './database.types';

/**
 * Base recipe type from database
 */
export type DatabaseRecipe = Database['public']['Tables']['recipes']['Row'];

/**
 * Recipe ingredient information
 */
export interface RecipeIngredient {
  id?: string;
  name: string;
  quantity?: number;
  unit?: string;
  category?: string;
  notes?: string;
}

/**
 * Simplified recipe interface for content analysis
 * Optimized for AI content analyzer and cache warmup
 */
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  servings?: number;
  difficulty?: string;
  category?: string;
  cuisine?: string;
  tags?: string[];
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  difficultyLevel?: number; // 1-5 scale

  // Optional metadata
  imageUrl?: string;
  videoUrl?: string;
  sourceUrl?: string;
  isActive?: boolean;
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

/**
 * Extended recipe with full database fields
 */
export interface DetailedRecipe extends Recipe {
  // Romanian/English versions
  titleRo: string;
  titleEn?: string;
  descriptionRo?: string;
  descriptionEn?: string;
  instructionsRo: string;
  instructionsEn?: string;

  // Full database fields
  activeCookingTime: number;
  averageRating?: number;
  totalRatings?: number;
  timesCooked?: number;
  dietaryTags?: string[];
  seasonMonths?: number[];
  isSeasonal?: boolean;

  // Status and metadata
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;

  // Attribution
  sourceAttribution?: string;
}

/**
 * Recipe with ingredients details
 */
export interface RecipeWithIngredients extends Recipe {
  ingredientDetails: RecipeIngredient[];
}

/**
 * Type guard to check if object is a valid Recipe
 */
export function isValidRecipe(obj: any): obj is Recipe {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    Array.isArray(obj.ingredients) &&
    typeof obj.instructions === 'string'
  );
}

/**
 * Convert database recipe to simplified Recipe interface
 */
export function convertDatabaseRecipe(
  dbRecipe: DatabaseRecipe,
  ingredients: string[] = []
): Recipe {
  // Map difficulty level to string
  const getDifficultyString = (level?: number): string | undefined => {
    if (!level) return undefined;
    if (level <= 1) return 'foarte ușor';
    if (level <= 2) return 'ușor';
    if (level <= 3) return 'mediu';
    if (level <= 4) return 'dificil';
    return 'foarte dificil';
  };

  // Map meal type
  const getMealTypeString = (mealType: string): Recipe['mealType'] => {
    switch (mealType) {
      case 'breakfast':
        return 'breakfast';
      case 'lunch':
        return 'lunch';
      case 'dinner':
        return 'dinner';
      case 'snack':
        return 'snack';
      default:
        return 'lunch';
    }
  };

  return {
    id: dbRecipe.id,
    title: dbRecipe.title_ro || dbRecipe.title_en || 'Rețetă fără nume',
    description: dbRecipe.description_ro ?? dbRecipe.description_en ?? undefined,
    ingredients,
    instructions: dbRecipe.instructions_ro || dbRecipe.instructions_en || '',
    prepTime: dbRecipe.prep_time,
    cookTime: dbRecipe.active_cooking_time,
    totalTime: dbRecipe.total_time,
    servings: dbRecipe.servings,
    difficulty: getDifficultyString(dbRecipe.difficulty_level ?? undefined),
    difficultyLevel: dbRecipe.difficulty_level ?? undefined,
    category: dbRecipe.cuisine_type ?? undefined,
    cuisine: dbRecipe.cuisine_type ?? undefined,
    tags: dbRecipe.tags ?? undefined,
    mealType: getMealTypeString(dbRecipe.meal_type),
    imageUrl: dbRecipe.image_url ?? undefined,
    videoUrl: dbRecipe.video_url ?? undefined,
    sourceUrl: dbRecipe.source_url ?? undefined,
    isActive: dbRecipe.status === 'published',
    nutritionInfo: {
      calories: dbRecipe.calories_per_serving ?? undefined,
      protein: dbRecipe.protein_per_serving ?? undefined,
      carbs: dbRecipe.carbs_per_serving ?? undefined,
      fat: dbRecipe.fat_per_serving ?? undefined,
    },
  };
}

/**
 * Convert simplified Recipe to DetailedRecipe
 */
export function convertToDetailedRecipe(
  recipe: Recipe,
  dbRecipe?: Partial<DatabaseRecipe>
): DetailedRecipe {
  return {
    ...recipe,
    titleRo: recipe.title,
    titleEn: dbRecipe?.title_en || undefined,
    descriptionRo: recipe.description || undefined,
    descriptionEn: dbRecipe?.description_en || undefined,
    instructionsRo: recipe.instructions,
    instructionsEn: dbRecipe?.instructions_en || undefined,

    activeCookingTime: recipe.cookTime || recipe.totalTime || 0,
    averageRating: dbRecipe?.average_rating || undefined,
    totalRatings: dbRecipe?.total_ratings || undefined,
    timesCooked: dbRecipe?.times_cooked || undefined,
    dietaryTags: dbRecipe?.dietary_tags || undefined,
    seasonMonths: dbRecipe?.season_months || undefined,
    isSeasonal: dbRecipe?.is_seasonal || undefined,

    status: (dbRecipe?.status as DetailedRecipe['status']) || 'draft',
    createdAt: dbRecipe?.created_at || new Date().toISOString(),
    updatedAt: dbRecipe?.updated_at || new Date().toISOString(),
    createdBy: dbRecipe?.created_by || undefined,
    approvedBy: dbRecipe?.approved_by || undefined,
    approvedAt: dbRecipe?.approved_at || undefined,
    publishedAt: dbRecipe?.published_at || undefined,

    sourceAttribution: dbRecipe?.source_attribution || undefined,
  };
}

/**
 * Create a sample recipe for testing
 */
export function createSampleRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return {
    id: 'sample-recipe-1',
    title: 'Ciorbă de burtă tradițională',
    description: 'O ciorbă tradițională românească, perfect pentru zilele reci de iarnă.',
    ingredients: [
      '500g burtă de vită',
      '2 morcovi',
      '1 ceapă mare',
      '2 linguriți unt',
      '3 ouă',
      '200ml smântână',
      '2 căței de usturoi',
      'Sare, piper, foi de dafin',
      'Oțet pentru servire',
    ],
    instructions: `Spălați burta și fierbeți-o la 180°C timp de 2 ore până devine moale. 
Tăiați legumele julienne și gătiți-le în unt până se caramelizează. 
Adăugați burta tăiată în fâșii și lăsați să fiarbă încă 30 de minute. 
Preparați amestecul de ouă cu smântână și adăugați la final pentru a îngroșa ciorba.`,
    prepTime: 30,
    cookTime: 150,
    totalTime: 180,
    servings: 6,
    difficulty: 'mediu',
    difficultyLevel: 3,
    category: 'Ciorbă',
    cuisine: 'Românească',
    tags: ['tradițional', 'iarnă', 'ciorbă'],
    mealType: 'lunch',
    nutritionInfo: {
      calories: 280,
      protein: 25,
      carbs: 8,
      fat: 16,
    },
    ...overrides,
  };
}

export default Recipe;
