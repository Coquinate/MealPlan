/**
 * Main authentication coordination hook
 * Integrates Supabase authentication with Zustand store
 */

import { useEffect, useCallback, useRef } from 'react';
import { createClient, type AuthError, type User, type Session } from '@supabase/supabase-js';
import { useAuthStore, useAuthActions } from '../stores/authStore';
import type { UserProfile, LoginCredentials, RegisterData, UpdateProfileData } from '../types/auth';

export interface AuthHookResult {
  // State
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
}

// Global deduplication for profile fetches
const profileFetchPromises = new Map<string, Promise<UserProfile | null>>();

// Global singleton Supabase client
let globalSupabaseClient: ReturnType<typeof createClient> | null = null;

// Track if auth state listener is already set up - USE DIFFERENT APPROACH
let authStateListenerSetup = false;
let globalAuthSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null;

// Create a Promise-based singleton to ensure only one setup happens
let authSetupPromise: Promise<any> | null = null;

// Debounce duplicate auth events (Supabase sends multiple SIGNED_IN events)
let lastAuthEvent: { event: string; userId: string; timestamp: number } | null = null;

// Custom hook for authentication
export function useAuth(): AuthHookResult {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  // Zustand store state and actions
  const { user, profile, session, isLoading, isInitialized, error } = useAuthStore();

  const actions = useAuthActions();

  // Initialize Supabase client (use global singleton)
  const getSupabase = useCallback(() => {
    if (!globalSupabaseClient) {
      // These should come from environment variables in a real app
      const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        'http://localhost:54321';
      const supabaseAnonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        'your-anon-key';

      globalSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      });
    }
    return globalSupabaseClient;
  }, []);

  // Fetch user profile directly from database using Supabase client (with deduplication)
  const fetchUserProfile = useCallback(
    async (userId: string): Promise<UserProfile | null> => {
      // Check if we already have a fetch in progress for this user
      const existingPromise = profileFetchPromises.get(userId);
      if (existingPromise) {
        console.log('Profile fetch already in progress for user:', userId);
        return existingPromise;
      }

      // Create new fetch promise
      const fetchPromise = (async () => {
        try {
          console.log('Starting new profile fetch for user:', userId);
          const supabase = getSupabase();

          // Add timeout to prevent hanging (increased from 5s to 10s)
          const timeoutPromise = new Promise<null>((resolve) => {
            setTimeout(() => {
              console.error('Profile fetch timeout after 10 seconds');
              resolve(null);
            }, 10000);
          });

          // Get user profile directly from database
          const queryPromise = supabase.from('users').select('*').eq('id', userId).single();

          const result = await Promise.race([queryPromise, timeoutPromise]);

          if (!result) {
            console.error('Profile fetch timed out');
            return null;
          }

          const { data: profile, error } = result;

          if (error) {
            console.error('Failed to fetch user profile:', error);
            console.error('Error details:', {
              code: error.code,
              message: error.message,
              details: error.details,
            });
            return null;
          }

          console.log('Profile fetched successfully:', profile);

          // Remove sensitive fields and return
          if (profile) {
            const { hashed_password, ...safeProfile } = profile;
            return safeProfile as unknown as UserProfile;
          }
          return null;
        } catch (error) {
          console.error('Failed to fetch user profile - exception:', error);
          return null;
        } finally {
          // Clean up the promise from the map after completion
          profileFetchPromises.delete(userId);
        }
      })();

      // Store the promise in the map
      profileFetchPromises.set(userId, fetchPromise);

      return fetchPromise;
    },
    [getSupabase]
  );

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const supabase = getSupabase();

        // Get initial session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          actions.setError(sessionError.message, 'session');
          actions.setInitialized(true);
          return;
        }

        if (session?.user) {
          // First set user as signed in and mark as initialized immediately
          actions.signIn(session.user, session, undefined);
          actions.setInitialized(true);

          // Then fetch profile (completely non-blocking - don't wait for it)
          fetchUserProfile(session.user.id)
            .then((profile) => {
              if (profile) {
                actions.setProfile(profile);
              }
            })
            .catch((error) => {
              console.warn(
                'Profile fetch failed during initialization, continuing without profile:',
                error
              );
              // Don't fail initialization if profile fetch fails
            });
        } else {
          actions.signOut();
          actions.setInitialized(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        actions.setError('Failed to initialize authentication', 'general');
        actions.setInitialized(true);
      }
    };

    initAuth();
  }, [getSupabase, fetchUserProfile, actions]);

  // Listen for auth state changes (Promise-based singleton approach)
  useEffect(() => {
    if (authSetupPromise) {
      // Setup already in progress or completed, wait for it
      return;
    }

    authSetupPromise = new Promise((resolve) => {
      if (authStateListenerSetup) {
        resolve(true);
        return;
      }

      // ATOMIC: Set flag BEFORE creating listener
      authStateListenerSetup = true;
      console.log('Setting up auth listener - ONCE');

      const supabase = getSupabase();

      const subscription = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);

        // Debounce duplicate events from Supabase (1 second window)
        const now = Date.now();
        const currentEvent = {
          event,
          userId: session?.user?.id || '',
          timestamp: now,
        };

        if (
          lastAuthEvent &&
          lastAuthEvent.event === event &&
          lastAuthEvent.userId === currentEvent.userId &&
          now - lastAuthEvent.timestamp < 1000
        ) {
          console.log('Ignoring duplicate auth event:', event, session?.user?.email);
          return;
        }

        lastAuthEvent = currentEvent;

        // Get the latest actions from the store
        const store = useAuthStore.getState();

        switch (event) {
          case 'SIGNED_IN':
          case 'INITIAL_SESSION':
            if (session?.user) {
              // First set the user as signed in
              store.signIn(session.user, session, undefined);

              // Then fetch the user profile (completely non-blocking)
              fetchUserProfile(session.user.id)
                .then((profile) => {
                  if (profile) {
                    // Use getState() to ensure we have the latest actions
                    useAuthStore.getState().setProfile(profile);
                  }
                })
                .catch((error) => {
                  console.warn(
                    'Profile fetch failed in auth state change, continuing without profile:',
                    error
                  );
                  // Don't fail authentication if profile fetch fails
                });
            }
            break;

          case 'SIGNED_OUT':
            store.signOut();
            break;

          case 'TOKEN_REFRESHED':
            if (session?.user) {
              store.setSession(session);
              store.resetRefreshAttempts();
            }
            break;

          case 'USER_UPDATED':
            if (session?.user) {
              store.setUser(session.user);
            }
            break;

          default:
            break;
        }
      });

      // Store global subscription reference
      globalAuthSubscription = subscription;
      resolve(true);
    });

    // Don't unsubscribe on component unmount since this is global
    return () => {
      // Keep the subscription active globally
    };
  }, [getSupabase, fetchUserProfile]);

  // Authentication methods
  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        throw error;
      }

      if (data.session) {
        actions.setSession(data.session);
        actions.resetRefreshAttempts();
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      const authError = error as AuthError;
      actions.setError(authError.message || 'Session refresh failed', 'session');
      throw error;
    }
  }, [getSupabase, actions]);

  // Listen for session refresh events from the store
  useEffect(() => {
    const handleSessionRefresh = async () => {
      await refreshSession();
    };

    window.addEventListener('auth:session-refresh-needed', handleSessionRefresh);

    return () => {
      window.removeEventListener('auth:session-refresh-needed', handleSessionRefresh);
    };
  }, [refreshSession]);

  // Authentication methods
  const signIn = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      try {
        actions.setLoading(true);
        actions.clearError();

        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) {
          // Don't throw the error, just set it in the store
          actions.setError(error.message || 'Sign in failed', 'login');
          return;
        }

        if (!data.user || !data.session) {
          actions.setError('Sign in failed - no user or session returned', 'login');
          return;
        }

        // Profile will be fetched by the auth state change listener
      } catch (error) {
        const authError = error as AuthError;
        actions.setError(authError.message || 'Sign in failed', 'login');
        // Don't throw the error to prevent console errors
      } finally {
        actions.setLoading(false);
      }
    },
    [getSupabase, actions]
  );

  const signUp = useCallback(
    async (data: RegisterData): Promise<void> => {
      try {
        actions.setLoading(true);
        actions.clearError();

        // Call our custom registration endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'}/functions/v1/auth-register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          // Pass the error key for translation in the UI
          throw new Error(errorData.error || 'registration_failed');
        }

        // Registration successful - user will need to verify email
        // The auth state change listener will handle the sign in
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        actions.setError(message, 'register');
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },
    [actions]
  );

  const signOut = useCallback(async (): Promise<void> => {
    try {
      actions.setLoading(true);
      const supabase = getSupabase();

      await supabase.auth.signOut();
      // The auth state change listener will handle clearing the store
    } catch (error) {
      console.error('Sign out error:', error);
      // Force sign out even if API call fails
      actions.signOut();
    } finally {
      actions.setLoading(false);
    }
  }, [getSupabase, actions]);

  const resetPassword = useCallback(
    async (email: string): Promise<void> => {
      try {
        actions.setLoading(true);
        actions.clearError();

        // Use Supabase Auth's built-in password reset
        const supabase = getSupabase();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
          throw error;
        }
      } catch (error) {
        const authError = error as AuthError;
        const message = authError.message || 'reset_failed';
        actions.setError(message, 'general');
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },
    [getSupabase, actions]
  );

  const updatePassword = useCallback(
    async (newPassword: string): Promise<void> => {
      try {
        actions.setLoading(true);
        actions.clearError();

        const supabase = getSupabase();
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
          throw error;
        }
      } catch (error) {
        const authError = error as AuthError;
        actions.setError(authError.message || 'Password update failed', 'general');
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },
    [getSupabase, actions]
  );

  const updateProfile = useCallback(
    async (data: UpdateProfileData): Promise<void> => {
      try {
        actions.setLoading(true);
        actions.clearError();

        const supabase = getSupabase();
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          throw new Error('No session found');
        }

        // Update profile directly in database
        const { data: profile, error } = await supabase
          .from('users')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', sessionData.session.user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (profile) {
          // Remove sensitive fields
          const { hashed_password, ...safeProfile } = profile;
          actions.setProfile(safeProfile as unknown as UserProfile);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Profile update failed';
        actions.setError(message, 'profile');
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },
    [getSupabase, actions]
  );

  const deleteAccount = useCallback(async (): Promise<void> => {
    try {
      actions.setLoading(true);
      actions.clearError();

      const supabase = getSupabase();
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        throw new Error('No session found');
      }

      // Delete user profile directly from database
      // Note: This requires proper RLS policies or a trigger to cascade delete auth user
      const { error } = await supabase.from('users').delete().eq('id', sessionData.session.user.id);

      if (error) {
        throw error;
      }

      // Force sign out after account deletion
      await signOut();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Account deletion failed';
      actions.setError(message, 'general');
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }, [getSupabase, actions, signOut]);

  return {
    // State
    user,
    profile,
    session,
    isLoading,
    isInitialized,
    isAuthenticated: !!user && !!session,
    error,

    // Actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    updateProfile,
    deleteAccount,
    clearError: actions.clearError,
  };
}
