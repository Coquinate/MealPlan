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

// Custom hook for authentication
export function useAuth(): AuthHookResult {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  // Zustand store state and actions
  const { user, profile, session, isLoading, isInitialized, error } = useAuthStore();

  const actions = useAuthActions();

  // Initialize Supabase client
  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      // These should come from environment variables in a real app
      const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        'http://localhost:54321';
      const supabaseAnonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        'your-anon-key';

      supabaseRef.current = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      });
    }
    return supabaseRef.current;
  }, []);

  // Fetch user profile from custom endpoint
  const fetchUserProfile = useCallback(
    async (_userId: string): Promise<UserProfile | null> => {
      try {
        const supabase = getSupabase();
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          throw new Error('No session found');
        }

        // Call our custom profile endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'}/functions/v1/auth-profile`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${sessionData.session.access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Profile fetch failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.profile || null;
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return null;
      }
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
          // Fetch user profile
          const profile = await fetchUserProfile(session.user.id);
          actions.signIn(session.user, session, profile || undefined);
        } else {
          actions.signOut();
        }

        actions.setInitialized(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        actions.setError('Failed to initialize authentication', 'general');
        actions.setInitialized(true);
      }
    };

    initAuth();
  }, [getSupabase, fetchUserProfile, actions]);

  // Listen for auth state changes
  useEffect(() => {
    const supabase = getSupabase();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);

      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            actions.signIn(session.user, session, profile || undefined);
          }
          break;

        case 'SIGNED_OUT':
          actions.signOut();
          break;

        case 'TOKEN_REFRESHED':
          if (session?.user) {
            actions.setSession(session);
            actions.resetRefreshAttempts();
          }
          break;

        case 'USER_UPDATED':
          if (session?.user) {
            actions.setUser(session.user);
          }
          break;

        default:
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [getSupabase, fetchUserProfile, actions]);

  // Listen for session refresh events from the store
  useEffect(() => {
    const handleSessionRefresh = async () => {
      await refreshSession();
    };

    window.addEventListener('auth:session-refresh-needed', handleSessionRefresh);

    return () => {
      window.removeEventListener('auth:session-refresh-needed', handleSessionRefresh);
    };
  }, []);

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
          throw error;
        }

        if (!data.user || !data.session) {
          throw new Error('Sign in failed - no user or session returned');
        }

        // Profile will be fetched by the auth state change listener
      } catch (error) {
        const authError = error as AuthError;
        actions.setError(authError.message || 'Sign in failed', 'login');
        throw error;
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
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Registration failed');
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

        // Call our custom reset password endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'}/functions/v1/auth-reset-password`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Password reset failed');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Password reset failed';
        actions.setError(message, 'general');
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },
    [actions]
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

        // Call our custom profile update endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'}/functions/v1/auth-profile`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${sessionData.session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Profile update failed');
        }

        const result = await response.json();
        if (result.profile) {
          actions.setProfile(result.profile);
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

      // Call our custom profile delete endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'}/functions/v1/auth-profile`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Account deletion failed');
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
