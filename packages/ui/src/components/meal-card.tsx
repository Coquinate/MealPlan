import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import type { MealCardProps as BaseMealCardProps } from '@coquinate/shared'
import { useCommonTranslations, useRomanianFormatters } from '@coquinate/i18n'
import { Card } from './card'

const mealCardVariants = cva(
  'relative overflow-hidden transition-all cursor-pointer',
  {
    variants: {
      variant: {
        default: 'hover:shadow-md',
        compact: 'p-space-sm',
        leftover: 'border-2 border-dashed border-leftover',
        locked: 'opacity-60 cursor-not-allowed'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface MealCardProps 
  extends Omit<BaseMealCardProps, 'variant'>,
    VariantProps<typeof mealCardVariants> {}

/**
 * MealCard component for displaying meal information
 * Shows cooking time, servings, and meal status with Romanian translations
 */
const MealCard = React.forwardRef<HTMLDivElement, MealCardProps>(
  ({ 
    className, 
    variant, 
    id,
    title,
    image,
    cookTime,
    servings,
    isLeftover,
    isCooked,
    isLocked,
    mealType,
    onClick,
    ...props 
  }, ref) => {
    const { t } = useCommonTranslations()
    const formatters = useRomanianFormatters()
    const finalVariant = isLocked ? 'locked' : isLeftover ? 'leftover' : variant

    return (
      <Card
        ref={ref}
        variant="interactive"
        className={cn(mealCardVariants({ variant: finalVariant }), className)}
        onClick={isLocked ? undefined : onClick}
        {...props}
      >
        {/* Image section with lazy loading */}
        {image && (
          <div className="relative h-32 w-full overflow-hidden rounded-t-card bg-gray-100">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {/* Leftover indicator */}
            {isLeftover && (
              <div className="absolute right-2 top-2 rounded-full bg-leftover p-1 text-white">
                🔄
              </div>
            )}
            {/* Cooked checkmark */}
            {isCooked && (
              <div className="absolute left-2 top-2 rounded-full bg-success p-1 text-white">
                ✓
              </div>
            )}
          </div>
        )}

        <div className="p-space-md">
          {/* Title and meal type */}
          <div className="mb-space-xs">
            <h3 className="text-meal-title font-semibold line-clamp-2">
              {title}
            </h3>
            <span className="text-xs text-text-secondary capitalize">
              {mealType}
            </span>
          </div>

          {/* Meta information */}
          <div className="flex items-center gap-space-sm text-sm text-text-secondary">
            {/* Cooking time */}
            <div className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{formatters.formatCookTime(cookTime)}</span>
            </div>
            
            {/* Servings */}
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>{formatters.formatServings(servings)}</span>
            </div>
          </div>
        </div>

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="text-2xl">🔒</span>
          </div>
        )}
      </Card>
    )
  }
)

MealCard.displayName = 'MealCard'

export { MealCard, mealCardVariants }