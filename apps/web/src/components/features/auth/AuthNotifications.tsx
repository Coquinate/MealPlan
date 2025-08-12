'use client'

import React from 'react'
import { cn } from '@coquinate/ui'

export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  onClose?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
  className?: string
}

/**
 * Authentication notification component
 * Displays success, error, warning, or info messages
 */
export function AuthNotification({
  type,
  message,
  description,
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
  className
}: NotificationProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  
  React.useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, autoCloseDelay)
      
      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDelay, isVisible, onClose])
  
  if (!isVisible) return null
  
  const typeStyles = {
    success: {
      container: 'bg-success-50 border-success-200',
      icon: 'text-success-600',
      text: 'text-success-900',
      description: 'text-success-700'
    },
    error: {
      container: 'bg-error-50 border-error-200',
      icon: 'text-error-600',
      text: 'text-error-900',
      description: 'text-error-700'
    },
    warning: {
      container: 'bg-orange-50 border-orange-200',
      icon: 'text-orange-600',
      text: 'text-orange-900',
      description: 'text-orange-700'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-900',
      description: 'text-blue-700'
    }
  }
  
  const icons = {
    success: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
  
  const styles = typeStyles[type]
  
  return (
    <div
      className={cn(
        'rounded-md border p-4',
        styles.container,
        className
      )}
      role="alert"
    >
      <div className="flex">
        <div className={cn('flex-shrink-0', styles.icon)}>
          {icons[type]}
        </div>
        <div className="ml-3 flex-1">
          <p className={cn('text-sm font-medium', styles.text)}>
            {message}
          </p>
          {description && (
            <p className={cn('mt-1 text-sm', styles.description)}>
              {description}
            </p>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={() => {
                setIsVisible(false)
                onClose()
              }}
              className={cn(
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                styles.icon,
                'hover:bg-white/20'
              )}
            >
              <span className="sr-only">Închide</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Loading spinner component for authentication operations
 */
export function AuthLoadingSpinner({
  message = 'Se încarcă...',
  className
}: {
  message?: string
  className?: string
}) {
  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
      <span className="text-sm text-text-secondary">{message}</span>
    </div>
  )
}

/**
 * Full page loading overlay
 */
export function AuthLoadingOverlay({
  isVisible = false,
  message = 'Procesare...'
}: {
  isVisible?: boolean
  message?: string
}) {
  if (!isVisible) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-elevated rounded-lg p-6 shadow-xl">
        <AuthLoadingSpinner message={message} />
      </div>
    </div>
  )
}

/**
 * Success message component with icon
 */
export function AuthSuccessMessage({
  title,
  message,
  onAction,
  actionLabel = 'Continuă',
  className
}: {
  title: string
  message: string
  onAction?: () => void
  actionLabel?: string
  className?: string
}) {
  return (
    <div className={cn('text-center space-y-4', className)}>
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-100">
        <svg
          className="h-6 w-6 text-success-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-medium text-text">{title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{message}</p>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

/**
 * Network error indicator
 */
export function NetworkErrorIndicator({
  onRetry,
  className
}: {
  onRetry?: () => void
  className?: string
}) {
  return (
    <div className={cn('bg-error-50 border border-error-200 rounded-md p-4', className)}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-error-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-error-800">
            Conexiune la internet pierdută
          </p>
          <p className="text-xs text-error-600 mt-1">
            Verificați conexiunea și încercați din nou
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto flex-shrink-0 text-sm text-error-600 hover:text-error-500 font-medium"
          >
            Reîncearcă
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Session expiry warning
 */
export function SessionExpiryWarning({
  minutesRemaining,
  onExtend,
  onLogout,
  className
}: {
  minutesRemaining: number
  onExtend: () => void
  onLogout: () => void
  className?: string
}) {
  return (
    <div className={cn('bg-orange-50 border border-orange-200 rounded-md p-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-orange-800">
              Sesiunea va expira în {minutesRemaining} {minutesRemaining === 1 ? 'minut' : 'minute'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onExtend}
            className="text-sm text-orange-600 hover:text-orange-500 font-medium"
          >
            Extinde sesiunea
          </button>
          <button
            onClick={onLogout}
            className="text-sm text-orange-600 hover:text-orange-500"
          >
            Deconectare
          </button>
        </div>
      </div>
    </div>
  )
}