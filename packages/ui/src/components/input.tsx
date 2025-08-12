import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import type { InputProps as BaseInputProps } from '@coquinate/shared'

const inputVariants = cva(
  'flex w-full rounded-input border bg-surface px-space-sm py-space-xs text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        default: 'border-border focus-visible:ring-primary focus-visible:border-primary',
        error: 'border-error focus-visible:ring-error focus-visible:border-error',
        success: 'border-success focus-visible:ring-success focus-visible:border-success'
      },
      size: {
        sm: 'h-9 text-sm',
        md: 'h-11', // 44px for touch targets
        lg: 'h-12 text-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export interface InputProps
  extends Omit<BaseInputProps, 'variant' | 'size'>,
    VariantProps<typeof inputVariants> {}

/**
 * Input component for form fields
 * Supports validation states and different sizes
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', variant, size, label, helperText, error, ...props }, ref) => {
    // Use error variant if error prop is provided
    const finalVariant = error ? 'error' : variant
    
    const input = (
      <input
        type={type}
        className={cn(inputVariants({ variant: finalVariant, size }), className)}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
        {...props}
      />
    )

    // If no label or helper text, return just the input
    if (!label && !helperText && !error) {
      return input
    }

    // Otherwise, wrap with label and helper text
    return (
      <div className="space-y-space-xs">
        {label && (
          <label 
            htmlFor={props.id}
            className="text-sm font-medium text-text"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        {input}
        {error && (
          <p id={`${props.id}-error`} className="text-sm text-error">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="text-sm text-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }