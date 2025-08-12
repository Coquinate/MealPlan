import * as React from 'react'
import { cn } from '../utils/cn'
import type { WeekGridProps, MealType } from '@coquinate/shared'
import { useCommonTranslations } from '@coquinate/i18n'
import { MealCard } from './meal-card'

/**
 * WeekGrid component for weekly meal planning view
 * Displays a 7x4 grid (7 days x 4 meal types) on desktop
 * Carousel view on mobile
 */
const WeekGrid = React.forwardRef<HTMLDivElement, WeekGridProps>(
  ({ 
    className,
    weekStartDate,
    meals,
    onMealClick,
    isLoading,
    showLeftoverConnections = true,
    ...props 
  }, ref) => {
    const { t } = useCommonTranslations()
    const daysOfWeek = [
      t('dayOfWeek.monday'),
      t('dayOfWeek.tuesday'),
      t('dayOfWeek.wednesday'),
      t('dayOfWeek.thursday'),
      t('dayOfWeek.friday'),
      t('dayOfWeek.saturday'),
      t('dayOfWeek.sunday')
    ]
    const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']
    const mealTypeLabels = {
      breakfast: t('mealType.breakfast'),
      lunch: t('mealType.lunch'),
      dinner: t('mealType.dinner'),
      snack: t('mealType.snack')
    }

    // Get today's day index (0 = Monday in Romanian calendar)
    const today = new Date()
    const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1

    if (isLoading) {
      return (
        <div ref={ref} className={cn('animate-pulse', className)} {...props}>
          <div className="grid grid-cols-1 gap-space-md md:grid-cols-7">
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <div key={dayIndex} className="space-y-space-sm">
                <div className="h-6 bg-gray-200 rounded"></div>
                {mealTypes.map((mealType) => (
                  <div key={mealType} className="h-32 bg-gray-100 rounded-card"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {/* Desktop view - 7 column grid */}
        <div className="hidden md:grid md:grid-cols-7 gap-space-md">
          {daysOfWeek.map((day, dayIndex) => {
            const isToday = dayIndex === todayIndex
            
            return (
              <div 
                key={dayIndex}
                className={cn(
                  'space-y-space-sm',
                  isToday && 'ring-2 ring-primary rounded-card p-space-sm'
                )}
              >
                {/* Day header */}
                <div className="text-center">
                  <h3 className={cn(
                    'font-semibold text-sm',
                    isToday && 'text-primary'
                  )}>
                    {day}
                  </h3>
                  {isToday && (
                    <span className="text-xs text-primary">{t('time.today')}</span>
                  )}
                </div>

                {/* Meal cards for this day */}
                {mealTypes.map((mealType) => {
                  const meal = meals[dayIndex]?.[mealType]
                  
                  if (!meal) {
                    return (
                      <div 
                        key={mealType}
                        className="h-32 border-2 border-dashed border-gray-200 rounded-card flex items-center justify-center text-gray-400 cursor-pointer hover:border-gray-300 hover:bg-gray-50"
                        onClick={() => onMealClick?.(dayIndex, mealType, '')}
                      >
                        <div className="text-center">
                          <span className="text-2xl">+</span>
                          <p className="text-xs mt-1">{mealTypeLabels[mealType]}</p>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={mealType} className="relative">
                      <MealCard
                        {...meal}
                        variant="compact"
                        onClick={() => onMealClick?.(dayIndex, mealType, meal.id)}
                      />
                      
                      {/* Leftover arrow connection */}
                      {showLeftoverConnections && meal.isLeftover && dayIndex > 0 && (
                        <div className="absolute -left-space-md top-1/2 transform -translate-y-1/2">
                          <span className="text-leftover text-xl">←</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Mobile view - Carousel */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-space-md pb-space-md">
            {daysOfWeek.map((day, dayIndex) => {
              const isToday = dayIndex === todayIndex
              
              return (
                <div 
                  key={dayIndex}
                  className={cn(
                    'flex-none w-meal-card-mobile snap-center space-y-space-sm',
                    isToday && 'ring-2 ring-primary rounded-card p-space-sm'
                  )}
                >
                  {/* Day header */}
                  <div className="text-center">
                    <h3 className={cn(
                      'font-semibold',
                      isToday && 'text-primary'
                    )}>
                      {day}
                    </h3>
                    {isToday && (
                      <span className="text-sm text-primary">{t('time.today')}</span>
                    )}
                  </div>

                  {/* Meal cards */}
                  {mealTypes.map((mealType) => {
                    const meal = meals[dayIndex]?.[mealType]
                    
                    if (!meal) {
                      return (
                        <div 
                          key={mealType}
                          className="h-32 border-2 border-dashed border-gray-200 rounded-card flex items-center justify-center text-gray-400"
                          onClick={() => onMealClick?.(dayIndex, mealType, '')}
                        >
                          <div className="text-center">
                            <span className="text-2xl">+</span>
                            <p className="text-sm mt-1">{mealTypeLabels[mealType]}</p>
                          </div>
                        </div>
                      )
                    }

                    return (
                      <MealCard
                        key={mealType}
                        {...meal}
                        variant="compact"
                        onClick={() => onMealClick?.(dayIndex, mealType, meal.id)}
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
)

WeekGrid.displayName = 'WeekGrid'

export { WeekGrid }