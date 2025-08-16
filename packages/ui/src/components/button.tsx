'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../utils/cn';
import { createRipple } from '../motion/ripple';
import { useReducedMotion } from '../motion/useReducedMotion';
import type { ButtonProps as BaseButtonProps } from '@coquinate/shared';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button font-medium transition-all overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-inverse hover:bg-primary-600 active:bg-primary-700 hover-lift active-scale focus-premium-warm',
        primary:
          'bg-primary text-inverse hover:bg-primary-600 active:bg-primary-700 hover-lift active-scale focus-premium-warm',
        secondary:
          'bg-gray-100 text-text hover:bg-gray-200 active:bg-gray-300 hover-scale active-scale',
        ghost:
          'bg-transparent text-text border border-primary-warm hover:bg-gray-100 active:bg-gray-200 hover-scale active-scale',
        coral:
          'bg-accent-coral text-inverse hover:bg-accent-coral-deep active:bg-accent-coral-deep hover-lift active-scale focus-premium-coral',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-space-sm text-sm',
        md: 'h-11 px-space-md text-base', // 44px height for touch targets
        lg: 'h-12 px-space-lg text-lg',
      },
      motion: {
        subtle: '',
        standard: 'button-feedback',
        expressive: 'button-feedback button-bounce',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      motion: 'standard',
    },
  }
);

export interface ButtonProps
  extends Omit<BaseButtonProps, 'variant' | 'size'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  disableRipple?: boolean;
}

/**
 * Button component with multiple variants and sizes
 * Follows design system tokens and accessibility standards
 * Includes Modern Hearth motion and interaction states
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      motion,
      loading,
      isLoading,
      disabled,
      disableRipple = false,
      asChild = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading || isLoading;
    const prefersReducedMotion = useReducedMotion();
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

    // Handle click with ripple effect
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isDisabled && !disableRipple && !prefersReducedMotion && variant !== 'link') {
          const button = buttonRef.current;
          if (button) {
            createRipple(e, button);
          }
        }
        onClick?.(e);
      },
      [onClick, isDisabled, disableRipple, prefersReducedMotion, variant]
    );

    // Determine motion level based on reduced motion preference
    const motionLevel = prefersReducedMotion ? 'subtle' : motion || 'standard';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, motion: motionLevel, className }))}
        ref={buttonRef}
        disabled={isDisabled}
        aria-busy={loading || isLoading}
        onClick={handleClick}
        {...props}
      >
        {(loading || isLoading) && (
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
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
