import React from 'react';
import { useRecipePreloader, useRecipeHoverPreloader } from '../hooks/useRecipePreloader';

/**
 * Recipe data interface (example)
 */
interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number;
  servings: number;
  // ... other recipe fields
}

/**
 * Props for RecipeDetail component
 */
interface RecipeDetailProps {
  recipe: Recipe;
  className?: string;
}

/**
 * Example Recipe Detail component with AI preloading
 *
 * This component demonstrates how to integrate the preloader hook
 * for automatic question caching when a recipe is viewed.
 */
export function RecipeDetailExample({ recipe, className = '' }: RecipeDetailProps) {
  // Automatic preloading when recipe is viewed
  const {
    preloadStatus,
    progress,
    preloadedCount,
    totalQuestions,
    isLoading,
    isCompleted,
    hasError,
    error,
  } = useRecipePreloader(recipe.id, {
    autoStart: true,
    config: {
      maxQuestions: 3,
      staggerDelay: 1000,
      priority: 'high',
    },
    onCompleted: (recipeId, questionsPreloaded) => {
      console.log(`AI questions preloaded for recipe ${recipeId}: ${questionsPreloaded} questions`);
    },
    onError: (recipeId, errorMessage) => {
      console.warn(`Failed to preload questions for recipe ${recipeId}:`, errorMessage);
    },
  });

  return (
    <div className={`recipe-detail ${className}`}>
      {/* Recipe Header */}
      <header className="recipe-header">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>

        {/* AI Assistant Status - Subtle indicator */}
        {isLoading && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <span>
              Pregătesc asistentul AI... ({preloadedCount}/{totalQuestions})
            </span>
          </div>
        )}

        {isCompleted && process.env.NODE_ENV === 'development' && (
          <div className="text-sm text-green-600 mb-4">
            ✓ Asistentul AI este pregătit ({preloadedCount} întrebări cache-uite)
          </div>
        )}

        {hasError && process.env.NODE_ENV === 'development' && (
          <div className="text-sm text-red-600 mb-4">
            ⚠ Nu s-a putut pregăti asistentul AI: {error}
          </div>
        )}
      </header>

      {/* Recipe Content */}
      <div className="recipe-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Recipe Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Informații</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Timp: {recipe.prepTime} minute</li>
              <li>Porții: {recipe.servings} persoane</li>
            </ul>
          </div>

          {/* Add other recipe info cards */}
        </div>

        {/* Recipe Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Descriere</h2>
          <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
        </div>

        {/* AI Chat Interface would go here */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">🤖 Asistent AI pentru Rețete</h3>
          <p className="text-blue-700 text-sm mb-3">
            Întreabă-mă orice despre această rețetă!
            {isCompleted && ' (Întrebările frecvente sunt deja pregătite pentru răspuns rapid)'}
          </p>

          {/* Placeholder for chat interface */}
          <div className="bg-white rounded border p-3 text-gray-500 text-sm">
            Interfața de chat va fi aici...
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Example Recipe Card component with hover preloading
 *
 * This component demonstrates hover-based preloading for recipe cards
 * in lists or grids.
 */
interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  className?: string;
}

export function RecipeCardExample({ recipe, onClick, className = '' }: RecipeCardProps) {
  // Hover-based preloading (lower priority, fewer questions)
  const { onMouseEnter, onMouseLeave, isPreloading } = useRecipeHoverPreloader(
    recipe.id,
    true // enabled
  );

  return (
    <div
      className={`recipe-card cursor-pointer transition-shadow hover:shadow-lg ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Recipe card content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Recipe image placeholder */}
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Imagine rețetă</span>
        </div>

        {/* Recipe info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{recipe.title}</h3>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{recipe.prepTime} min</span>
            <span>{recipe.servings} porții</span>
            {isPreloading && process.env.NODE_ENV === 'development' && (
              <span className="text-blue-500">🔄</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Example usage in a recipe list page
 */
interface RecipeListPageProps {
  recipes: Recipe[];
}

export function RecipeListPageExample({ recipes }: RecipeListPageProps) {
  const handleRecipeClick = (recipe: Recipe) => {
    // Navigate to recipe detail page
    console.log('Navigate to recipe:', recipe.id);
  };

  return (
    <div className="recipe-list-page">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Rețete Disponibile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCardExample
            key={recipe.id}
            recipe={recipe}
            onClick={() => handleRecipeClick(recipe)}
            className="transition-transform hover:scale-105"
          />
        ))}
      </div>
    </div>
  );
}

export default RecipeDetailExample;
