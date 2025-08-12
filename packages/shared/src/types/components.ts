/**
 * Shared component type definitions for the MealPlan application
 * All component interfaces should be defined here for type sharing
 */

import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

// Base component variant types
export type ComponentSize = 'sm' | 'md' | 'lg'
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'ghost' | 'link'

/**
 * Button component properties
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ComponentVariant
  size?: ComponentSize
  loading?: boolean
  children: ReactNode
}

/**
 * Card component properties
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive'
  children: ReactNode
}

/**
 * Input component properties
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error' | 'success'
  size?: ComponentSize
  label?: string
  helperText?: string
  error?: string
}

/**
 * Select component properties
 */
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  placeholder?: string
  multiple?: boolean
  searchable?: boolean
  disabled?: boolean
  error?: string
  label?: string
  size?: ComponentSize
}

/**
 * Modal component properties
 */
export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'fullscreen'
  children: ReactNode
}

/**
 * Toast component properties
 */
export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * MealCard component properties - meal planning specific
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface MealCardProps extends HTMLAttributes<HTMLDivElement> {
  id: string
  title: string
  image?: string
  cookTime: number // in minutes
  servings: number
  isLeftover?: boolean
  isCooked?: boolean
  isLocked?: boolean
  mealType: MealType
  onClick?: () => void
  variant?: 'default' | 'compact' | 'leftover' | 'locked'
}

/**
 * WeekGrid component properties - weekly meal planning view
 */
export interface WeekGridProps extends HTMLAttributes<HTMLDivElement> {
  weekStartDate: Date
  meals: MealPlanWeek
  onMealClick?: (dayIndex: number, mealType: MealType, mealId: string) => void
  isLoading?: boolean
  showLeftoverConnections?: boolean
}

export interface MealPlanWeek {
  [dayIndex: number]: {
    breakfast?: MealCardProps
    lunch?: MealCardProps
    dinner?: MealCardProps
    snack?: MealCardProps
  }
}

/**
 * ShoppingListItem component properties
 */
export interface ShoppingListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  id: string
  name: string
  quantity: string
  unit?: string
  category: string
  isChecked: boolean
  onToggle: (id: string) => void
  expiryDays?: number
  notes?: string
}

/**
 * Common props for form components
 */
export interface FormFieldProps {
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helperText?: string
}

/**
 * Loading state component properties
 */
export interface LoadingProps {
  size?: ComponentSize
  text?: string
  fullScreen?: boolean
}

/**
 * Empty state component properties
 */
export interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}