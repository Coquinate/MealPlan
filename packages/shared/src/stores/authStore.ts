/**
 * Authentication store using Zustand with session persistence
 * Manages user authentication state across the application
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { User, Session } from '@supabase/supabase-js'
import type { 
  UserProfile, 
  AuthState as BaseAuthState,
  AuthStoreActions,
  AuthErrorInfo
} from '../types/auth'

// Extend the base AuthState from types to add store-specific properties
interface AuthState extends BaseAuthState {
  // Session management - store-specific
  sessionRefreshTimeout: NodeJS.Timeout | null
  refreshAttempts: number
  maxRefreshAttempts: number
  lastError: AuthErrorInfo | null
}

interface AuthActions extends AuthStoreActions {
  // Authentication actions
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  
  // Error management
  setError: (error: string | null, type?: AuthErrorInfo['type']) => void
  clearError: () => void
  
  // Session management
  scheduleSessionRefresh: (session: Session) => void
  clearSessionRefresh: () => void
  incrementRefreshAttempts: () => void
  resetRefreshAttempts: () => void
  
  // Profile updates
  updateProfile: (updates: Partial<UserProfile>) => void
  
  // Authentication flows
  signIn: (user: User, session: Session, profile?: UserProfile) => void
  signOut: () => void
  
  // Reset store
  reset: () => void
}

type StoreType = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isInitialized: false,
  error: null,
  lastError: null,
  sessionRefreshTimeout: null,
  refreshAttempts: 0,
  maxRefreshAttempts: 3
}

// Calculate session refresh time (refresh 5 minutes before expiry)
const calculateRefreshTime = (session: Session): number => {
  const expiresAt = session.expires_at || (Date.now() / 1000) + 3600 // fallback to 1 hour
  const refreshAt = expiresAt - 300 // 5 minutes before expiry
  const now = Date.now() / 1000
  
  return Math.max(0, (refreshAt - now) * 1000) // Convert to milliseconds
}

export const useAuthStore = create<StoreType>()(
  persist(
    immer((set, get) => ({
      ...initialState,
      
      // Authentication actions
      setUser: (user) =>
        set((state) => {
          state.user = user
        }),
      
      setProfile: (profile) =>
        set((state) => {
          state.profile = profile
        }),
      
      setSession: (session) =>
        set((state) => {
          state.session = session
          if (session) {
            // Schedule automatic refresh
            const store = get()
            store.scheduleSessionRefresh(session)
          } else {
            // Clear refresh timeout if no session
            const store = get()
            store.clearSessionRefresh()
          }
        }),
      
      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading
        }),
      
      setInitialized: (initialized) =>
        set((state) => {
          state.isInitialized = initialized
          if (initialized) {
            state.isLoading = false
          }
        }),
      
      // Error management
      setError: (error, type = 'general') =>
        set((state) => {
          state.error = error
          if (error) {
            state.lastError = {
              type,
              message: error,
              timestamp: Date.now()
            }
          }
        }),
      
      clearError: () =>
        set((state) => {
          state.error = null
        }),
      
      // Session management
      scheduleSessionRefresh: (session) => {
        const store = get()
        
        // Clear existing timeout
        if (store.sessionRefreshTimeout) {
          clearTimeout(store.sessionRefreshTimeout)
        }
        
        const refreshTime = calculateRefreshTime(session)
        
        const timeout = setTimeout(async () => {
          const currentStore = get()
          if (currentStore.refreshAttempts < currentStore.maxRefreshAttempts) {
            try {
              // This will be handled by the useAuth hook which has access to supabase
              currentStore.incrementRefreshAttempts()
              
              // Emit custom event for session refresh
              window.dispatchEvent(new CustomEvent('auth:session-refresh-needed'))
            } catch (error) {
              console.error('Session refresh failed:', error)
              currentStore.setError('Session refresh failed', 'session')
            }
          } else {
            // Max attempts reached, sign out
            currentStore.signOut()
            currentStore.setError('Session expired. Please sign in again.', 'session')
          }
        }, refreshTime)
        
        set((state) => {
          state.sessionRefreshTimeout = timeout
        })
      },
      
      clearSessionRefresh: () =>
        set((state) => {
          if (state.sessionRefreshTimeout) {
            clearTimeout(state.sessionRefreshTimeout)
            state.sessionRefreshTimeout = null
          }
        }),
      
      incrementRefreshAttempts: () =>
        set((state) => {
          state.refreshAttempts += 1
        }),
      
      resetRefreshAttempts: () =>
        set((state) => {
          state.refreshAttempts = 0
        }),
      
      // Profile updates
      updateProfile: (updates) =>
        set((state) => {
          if (state.profile) {
            state.profile = { ...state.profile, ...updates, updated_at: new Date().toISOString() }
          }
        }),
      
      // Authentication flows
      signIn: (user, session, profile) =>
        set((state) => {
          state.user = user
          state.session = session
          state.profile = profile || null
          state.error = null
          state.lastError = null
          state.refreshAttempts = 0
          state.isLoading = false
          
          // Schedule session refresh
          const store = get()
          store.scheduleSessionRefresh(session)
        }),
      
      signOut: () =>
        set((state) => {
          // Clear session refresh timeout
          if (state.sessionRefreshTimeout) {
            clearTimeout(state.sessionRefreshTimeout)
            state.sessionRefreshTimeout = null
          }
          
          state.user = null
          state.profile = null
          state.session = null
          state.error = null
          state.lastError = null
          state.refreshAttempts = 0
          state.isLoading = false
        }),
      
      // Reset store
      reset: () =>
        set((state) => {
          // Clear timeouts
          if (state.sessionRefreshTimeout) {
            clearTimeout(state.sessionRefreshTimeout)
          }
          
          Object.assign(state, initialState)
        })
    })),
    {
      name: 'coquinate-auth-storage',
      storage: createJSONStorage(() => {
        // Use localStorage for persistence
        return {
          getItem: (name) => {
            const item = localStorage.getItem(name)
            return item ? JSON.parse(item) : null
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value))
          },
          removeItem: (name) => {
            localStorage.removeItem(name)
          }
        }
      }),
      // Only persist essential data, not loading states or timeouts
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        session: state.session,
        lastError: state.lastError
      }),
      // Custom merge function to handle rehydration properly
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<AuthState>),
        // Reset loading states and timeouts on rehydration
        isLoading: true,
        isInitialized: false,
        sessionRefreshTimeout: null,
        refreshAttempts: 0
      })
    }
  )
)

// Selector hooks for common use cases
export const useUser = () => useAuthStore((state) => state.user)
export const useProfile = () => useAuthStore((state) => state.profile)
export const useSession = () => useAuthStore((state) => state.session)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthInitialized = () => useAuthStore((state) => state.isInitialized)
export const useAuthError = () => useAuthStore((state) => state.error)
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user && !!state.session)

// Action selectors
export const useAuthActions = () => useAuthStore((state) => ({
  setUser: state.setUser,
  setProfile: state.setProfile,
  setSession: state.setSession,
  setLoading: state.setLoading,
  setInitialized: state.setInitialized,
  setError: state.setError,
  clearError: state.clearError,
  updateProfile: state.updateProfile,
  signIn: state.signIn,
  signOut: state.signOut,
  reset: state.reset,
  resetRefreshAttempts: state.resetRefreshAttempts,
  incrementRefreshAttempts: state.incrementRefreshAttempts,
  scheduleSessionRefresh: state.scheduleSessionRefresh,
  clearSessionRefresh: state.clearSessionRefresh
}))