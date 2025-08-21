import * as React from 'react'
import { cn } from '../utils/cn'
import * as i18nModule from '@coquinate/i18n'
import type { ShoppingListItemProps } from '@coquinate/shared'
import type { TranslationNamespace } from '@coquinate/i18n'

// Robust translation hook with fallback mechanism
const useTranslation = (namespace?: TranslationNamespace | TranslationNamespace[]) => {
  if (i18nModule && typeof i18nModule.useTranslation === 'function') {
    return i18nModule.useTranslation(namespace);
  }
  
  // Fallback implementation
  return {
    t: (key: string) => key,
    i18n: null,
    ready: false
  };
};

/**
 * ShoppingListItem component for grocery shopping lists
 * Supports swipe-to-check gesture on mobile
 * Shows quantity, category, and expiry warnings with Romanian translations
 */
const ShoppingListItem = React.forwardRef<HTMLDivElement, ShoppingListItemProps>(
  ({ 
    className,
    id,
    name,
    quantity,
    unit,
    category,
    isChecked,
    onToggle,
    expiryDays,
    notes,
    ...props 
  }, ref) => {
    const { t } = useTranslation('shopping' as TranslationNamespace)
    const formatters = i18nModule?.useRomanianFormatters() || {
      formatCurrency: (value: number) => `${value} Lei`,
      formatDate: (date: Date) => date.toLocaleDateString('ro-RO'),
      formatNumber: (value: number) => value.toString()
    }
    const [isSwipeActive, setIsSwipeActive] = React.useState(false)
    const startXRef = React.useRef(0)
    
    // Touch handlers for swipe-to-check on mobile
    const handleTouchStart = (e: React.TouchEvent) => {
      startXRef.current = e.touches[0].clientX
      setIsSwipeActive(true)
    }
    
    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isSwipeActive) return
      const currentX = e.touches[0].clientX
      const diff = currentX - startXRef.current
      
      // Swipe right to check
      if (diff > 50 && !isChecked) {
        onToggle(id)
        setIsSwipeActive(false)
      }
      // Swipe left to uncheck
      else if (diff < -50 && isChecked) {
        onToggle(id)
        setIsSwipeActive(false)
      }
    }
    
    const handleTouchEnd = () => {
      setIsSwipeActive(false)
    }

    // Determine expiry warning color
    const getExpiryColor = () => {
      if (!expiryDays) return null
      if (expiryDays <= 2) return 'text-error'
      if (expiryDays <= 5) return 'text-warning'
      return 'text-success'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-space-sm p-space-md border-b border-border transition-all',
          isChecked && 'opacity-60 bg-gray-50',
          isSwipeActive && 'bg-primary-50',
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {/* Checkbox */}
        <div className="flex-shrink-0">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(id)}
              className="sr-only"
              aria-label={t('item.markAs', { 
                name, 
                status: isChecked ? t('item.markAsUnchecked') : t('item.markAsChecked')
              })}
            />
            <div 
              className={cn(
                'w-6 h-6 rounded-input border-2 flex items-center justify-center transition-colors',
                isChecked 
                  ? 'bg-primary border-primary text-white' 
                  : 'border-gray-300 hover:border-primary'
              )}
            >
              {isChecked && (
                <svg 
                  className="w-4 h-4" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
            </div>
          </label>
        </div>

        {/* Item details */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <p className={cn(
                'text-base font-medium',
                isChecked && 'line-through'
              )}>
                {name}
              </p>
              
              {/* Quantity and category */}
              <div className="flex items-center gap-space-md text-sm text-text-secondary mt-1">
                <span className="font-medium">
                  {quantity}{unit ? ` ${unit}` : ''}
                </span>
                <span className="text-xs">•</span>
                <span className="text-xs capitalize">{category}</span>
              </div>
              
              {/* Notes */}
              {notes && (
                <p className="text-xs text-text-muted mt-1 italic">
                  {notes}
                </p>
              )}
            </div>

            {/* Expiry indicator */}
            {expiryDays !== undefined && (
              <div className={cn(
                'flex-shrink-0 ml-space-sm text-sm font-medium',
                getExpiryColor()
              )}>
                {expiryDays === 0 ? (
                  <span>{t('expiry.today')}</span>
                ) : expiryDays === 1 ? (
                  <span>{t('expiry.tomorrow')}</span>
                ) : (
                  <span>{t('expiry.daysCount', { count: expiryDays })}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

ShoppingListItem.displayName = 'ShoppingListItem'

export { ShoppingListItem }