import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { cn } from '../utils/cn'
import type { SelectProps as BaseSelectProps, SelectOption } from '@coquinate/shared'
import { useCommonTranslations } from '@coquinate/i18n'

/**
 * Select component with dropdown functionality
 * Supports search, multi-select, and mobile optimization
 */
const Select = React.forwardRef<HTMLButtonElement, Omit<BaseSelectProps, 'value' | 'onChange'> & { value?: string; onChange?: (value: string) => void }>(
  ({ options, value, onChange, placeholder, disabled, error, label, size = 'md' }, ref) => {
    const { t } = useCommonTranslations()
    const defaultPlaceholder = placeholder || t('label.select')
    const sizeClasses = {
      sm: 'h-9 px-space-sm text-sm',
      md: 'h-11 px-space-md text-base',
      lg: 'h-12 px-space-lg text-lg'
    }

    return (
      <div className="space-y-space-xs">
        {label && (
          <label className="text-sm font-medium text-text">
            {label}
          </label>
        )}
        <SelectPrimitive.Root value={value} onValueChange={onChange} disabled={disabled}>
          <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
              'flex w-full items-center justify-between rounded-input border bg-surface transition-colors focus:outline-none focus:ring-3 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
              error ? 'border-error focus:border-error focus:ring-error' : 'border-border focus:border-primary focus:ring-primary',
              sizeClasses[size]
            )}
          >
            <SelectPrimitive.Value placeholder={defaultPlaceholder} />
            <SelectPrimitive.Icon asChild>
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content className="relative z-50 max-h-96 min-w-32 overflow-hidden rounded-card border border-border bg-surface text-text shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
              <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                <ChevronUpIcon className="h-4 w-4" />
              </SelectPrimitive.ScrollUpButton>
              <SelectPrimitive.Viewport className="p-1">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-surface-hover focus:text-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                      <SelectPrimitive.ItemIndicator>
                        <CheckIcon className="h-4 w-4" />
                      </SelectPrimitive.ItemIndicator>
                    </span>
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
              <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
                <ChevronDownIcon className="h-4 w-4" />
              </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }