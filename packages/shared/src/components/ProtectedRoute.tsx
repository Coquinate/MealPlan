/**
 * Protected Route Higher-Order Component
 * Restricts access to authenticated users only
 */

import React, { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  requireProfile?: boolean
  requireSubscription?: boolean
  onUnauthorized?: () => void
  loadingComponent?: React.ReactNode
}

/**
 * Protected Route component that restricts access to authenticated users
 * 
 * @param children - Components to render when user is authenticated
 * @param fallback - Component to render when user is not authenticated
 * @param redirectTo - URL to redirect to when not authenticated (browser only)
 * @param requireProfile - Whether to require a complete user profile
 * @param requireSubscription - Whether to require an active subscription
 * @param onUnauthorized - Callback when user is not authorized
 * @param loadingComponent - Component to show while checking authentication
 */
export function ProtectedRoute({
  children,
  fallback = null,
  redirectTo,
  requireProfile = false,
  requireSubscription = false,
  onUnauthorized,
  loadingComponent = <div>Loading...</div>
}: ProtectedRouteProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    isInitialized, 
    user, 
    profile 
  } = useAuth()
  
  // Handle unauthorized access
  useEffect(() => {
    if (!isLoading && isInitialized && !isAuthenticated) {
      if (onUnauthorized) {
        onUnauthorized()
      } else if (redirectTo && typeof window !== 'undefined') {
        window.location.href = redirectTo
      }
    }
  }, [isAuthenticated, isLoading, isInitialized, redirectTo, onUnauthorized])
  
  // Show loading state while authentication is being checked
  if (!isInitialized || isLoading) {
    return <>{loadingComponent}</>
  }
  
  // User is not authenticated
  if (!isAuthenticated) {
    return <>{fallback}</>
  }
  
  // Check profile requirement
  if (requireProfile && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center space-y-4 p-6 bg-surface-elevated rounded-lg border border-border max-w-md">
          <h2 className="text-lg font-semibold text-text">
            Profilul incomplet
          </h2>
          <p className="text-sm text-text-secondary">
            Pentru a accesa această pagină, trebuie să completați profilul.
          </p>
        </div>
      </div>
    )
  }
  
  // Check subscription requirement
  if (requireSubscription && profile) {
    const hasActiveSubscription = 
      profile.subscription_status === 'active' ||
      profile.has_active_trial ||
      profile.has_trial_gift_access
    
    if (!hasActiveSubscription) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center space-y-4 p-6 bg-surface-elevated rounded-lg border border-border max-w-md">
            <h2 className="text-lg font-semibold text-text">
              Abonament necesar
            </h2>
            <p className="text-sm text-text-secondary">
              Pentru a accesa această funcționalitate, aveți nevoie de un abonament activ.
            </p>
            {profile.subscription_status === 'expired' && (
              <p className="text-sm text-orange-600">
                Abonamentul dvs. a expirat.
              </p>
            )}
          </div>
        </div>
      )
    }
  }
  
  // User is authenticated and meets all requirements
  return <>{children}</>
}

/**
 * Higher-Order Component version of ProtectedRoute
 * Wraps a component to make it protected
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  const WrappedComponent = (props: P) => {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
  
  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Hook to check if current user has specific permissions
 */
export function usePermissions() {
  const { user, profile, isAuthenticated } = useAuth()
  
  return {
    isAuthenticated,
    hasProfile: !!profile,
    hasActiveSubscription: profile ? (
      profile.subscription_status === 'active' ||
      profile.has_active_trial ||
      profile.has_trial_gift_access
    ) : false,
    isTrialUser: !!profile?.has_active_trial,
    isGiftUser: !!profile?.has_trial_gift_access,
    isPaidUser: profile?.subscription_status === 'active',
    canAccessPremiumFeatures: profile ? (
      profile.subscription_status === 'active' ||
      profile.has_active_trial ||
      profile.has_trial_gift_access
    ) : false,
    userEmail: user?.email,
    userId: user?.id,
    menuType: profile?.menu_type,
    householdSize: profile?.household_size
  }
}

// Common loading component
export const AuthLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <span className="text-sm text-text-secondary">Se încarcă...</span>
    </div>
  </div>
)

// Common unauthorized fallback component
export const UnauthorizedFallback = ({ 
  message = "Pentru a accesa această pagină, trebuie să vă autentificați.",
  actionText = "Autentificare",
  onAction
}: {
  message?: string
  actionText?: string
  onAction?: () => void
}) => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="text-center space-y-4 p-6 bg-surface-elevated rounded-lg border border-border max-w-md">
      <h2 className="text-lg font-semibold text-text">
        Acces restricționat
      </h2>
      <p className="text-sm text-text-secondary">
        {message}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {actionText}
        </button>
      )}
    </div>
  </div>
)