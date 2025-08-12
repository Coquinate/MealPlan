import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../utils/cn'
import type { ButtonProps as BaseButtonProps } from '@coquinate/shared'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-text-inverse hover:bg-primary-600 active:bg-primary-700',
        primary: 'bg-primary text-text-inverse hover:bg-primary-600 active:bg-primary-700',
        secondary: 'bg-gray-100 text-text hover:bg-gray-200 active:bg-gray-300',
        ghost: 'hover:bg-surface-hover hover:text-text active:bg-surface-active',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        sm: 'h-9 px-space-sm text-sm',
        md: 'h-11 px-space-md text-base', // 44px height for touch targets
        lg: 'h-12 px-space-lg text-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export interface ButtonProps 
  extends Omit<BaseButtonProps, 'variant' | 'size'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Button component with multiple variants and sizes
 * Follows design system tokens and accessibility standards
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }