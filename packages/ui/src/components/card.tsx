import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import type { CardProps as BaseCardProps } from '@coquinate/shared'

const cardVariants = cva(
  'rounded-card bg-surface border border-border',
  {
    variants: {
      variant: {
        default: 'shadow-sm',
        elevated: 'shadow-lg hover:shadow-xl transition-shadow',
        interactive: 'cursor-pointer hover:bg-surface-hover active:bg-surface-active transition-colors'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface CardProps 
  extends Omit<BaseCardProps, 'variant'>,
    VariantProps<typeof cardVariants> {}

/**
 * Card component for content containers
 * Provides surface elevation and grouping
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

/**
 * Card header section
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-space-lg', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

/**
 * Card title element
 */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-heading-sm font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

/**
 * Card description element
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-text-secondary', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

/**
 * Card main content area
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-space-lg pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

/**
 * Card footer section
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-space-lg pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants
}