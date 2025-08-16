import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const mealCardVariants = cva('rounded-lg transition-all duration-300 overflow-hidden', {
  variants: {
    variant: {
      default: 'bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5 p-4',
      compact: 'bg-surface-white border border-surface-border p-3',
      detailed: 'bg-white shadow-lg p-6 space-y-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string[];
  imageUrl?: string;
}

export interface MealCardProps extends VariantProps<typeof mealCardVariants> {
  meal?: Meal;
  isLoading?: boolean;
  error?: string;
  onSelect?: (id: string) => void;
  onFavorite?: (id: string) => void;
  className?: string;
}

export const MealCard = ({
  meal,
  isLoading,
  error,
  variant,
  onSelect,
  onFavorite,
  className,
}: MealCardProps) => {
  // Loading state
  if (isLoading) {
    return (
      <div className={cn(mealCardVariants({ variant }), 'animate-pulse', className)}>
        <div className="h-32 bg-gray-200 rounded-lg mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn(mealCardVariants({ variant }), 'border-red-200 bg-red-50', className)}>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  // No meal data
  if (!meal) {
    return null;
  }

  const mealTypeLabels = {
    breakfast: 'Mic dejun',
    lunch: 'Prânz',
    dinner: 'Cină',
    snack: 'Gustare',
  };

  return (
    <article
      className={cn(mealCardVariants({ variant }), 'cursor-pointer', className)}
      onClick={() => onSelect?.(meal.id)}
      role="article"
      aria-label={`${meal.name} - ${meal.calories} calorii`}
    >
      {/* Image */}
      {meal.imageUrl && variant !== 'compact' && (
        <div className="relative h-40 -mx-4 -mt-4 mb-4 overflow-hidden">
          <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite?.(meal.id);
              }}
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              aria-label="Add to favorites"
            >
              <svg
                className="w-5 h-5 text-accent-coral"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{meal.name}</h3>
            <span className="text-xs text-gray-500">{mealTypeLabels[meal.type]}</span>
          </div>
          {variant === 'compact' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite?.(meal.id);
              }}
              className="p-1"
              aria-label="Add to favorites"
            >
              <svg
                className="w-4 h-4 text-gray-400 hover:text-accent-coral transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Nutrition info */}
        <div className="flex gap-3 text-sm">
          <span className="text-gray-700 font-medium">{meal.calories} cal</span>
          {variant !== 'compact' && (
            <>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{meal.protein}g proteine</span>
              {variant === 'detailed' && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{meal.carbs}g carbs</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{meal.fat}g grăsimi</span>
                </>
              )}
            </>
          )}
        </div>

        {/* Time info */}
        {variant !== 'compact' && (
          <div className="flex gap-4 text-xs text-gray-500">
            <span>⏱ {meal.prepTime + meal.cookTime} min total</span>
            <span>👥 {meal.servings} porții</span>
          </div>
        )}

        {/* Ingredients preview */}
        {variant === 'detailed' && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Ingrediente principale:</p>
            <p className="text-sm text-gray-700">
              {meal.ingredients.slice(0, 3).join(', ')}
              {meal.ingredients.length > 3 && ` +${meal.ingredients.length - 3} altele`}
            </p>
          </div>
        )}
      </div>
    </article>
  );
};
