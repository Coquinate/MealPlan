import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { fetchWithCSRF, clearCSRFToken } from '@/utils/csrf';
import { authRateLimiter, twoFactorRateLimiter, checkRateLimit } from '@/utils/rate-limit';
import { validateAndRefreshSession, setupSessionRefresh } from '@/utils/jwt-validation';
import { auditLog } from '@/utils/audit-log';

interface AdminUser {
  id: string;
  user_id: string;
  role: 'super_admin' | 'admin' | 'operator';
  permissions: Record<string, any>;
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  created_at: string;
  last_login: string;
}

interface AuthState {
  user: User | null;
  adminUser: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  needs2FA: boolean;
  error: string | null;
}

export function useAdminAuth() {
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    adminUser: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    needs2FA: false,
    error: null,
  });

  useEffect(() => {
    checkAdminAccess();

    // Set up automatic session refresh
    const cleanupSessionRefresh = setupSessionRefresh(() => {
      // Session expired callback
      setAuthState((prev) => ({
        ...prev,
        error: t('auth.errors.sessionExpired'),
        isAuthenticated: false,
        isAdmin: false,
      }));
      navigate('/admin/login');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await checkAdminAccess();
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          adminUser: null,
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
          needs2FA: false,
          error: null,
        });
        navigate('/admin/login');
      }
    });

    return () => {
      subscription.unsubscribe();
      cleanupSessionRefresh();
    };
  }, [navigate]);

  const checkAdminAccess = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Check rate limit for auth attempts
      const userIp = 'auth-check'; // In production, use actual IP or user identifier
      checkRateLimit(authRateLimiter, userIp);

      // Validate and refresh session if needed
      const sessionResult = await validateAndRefreshSession();
      if (!sessionResult.valid) {
        setAuthState({
          user: null,
          adminUser: null,
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
          needs2FA: false,
          error: sessionResult.error || t('auth.errors.invalidSession'),
        });
        navigate('/admin/login');
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setAuthState({
          user: null,
          adminUser: null,
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
          needs2FA: false,
          error: t('auth.errors.notAuthenticated'),
        });
        navigate('/admin/login');
        return;
      }

      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (adminError || !adminUser) {
        setAuthState({
          user,
          adminUser: null,
          isLoading: false,
          isAuthenticated: true,
          isAdmin: false,
          needs2FA: false,
          error: t('auth.errors.accessDenied'),
        });
        navigate('/unauthorized');
        return;
      }

      const session = await supabase.auth.getSession();
      const has2FAVerified =
        session.data.session?.user?.user_metadata?.two_factor_verified || false;

      if (adminUser.two_factor_enabled && !has2FAVerified) {
        setAuthState({
          user,
          adminUser,
          isLoading: false,
          isAuthenticated: true,
          isAdmin: true,
          needs2FA: true,
          error: null,
        });
        navigate('/admin/2fa');
        return;
      }

      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminUser.id);

      // Reset rate limiters on successful auth
      authRateLimiter.reset('auth-check');
      if (user.id) {
        twoFactorRateLimiter.reset(`2fa-${user.id}`);
      }

      // Log successful authentication
      await auditLog.login(user.id, true, {
        role: adminUser.role,
        twoFactorEnabled: adminUser.two_factor_enabled,
      });

      setAuthState({
        user,
        adminUser,
        isLoading: false,
        isAuthenticated: true,
        isAdmin: true,
        needs2FA: false,
        error: null,
      });
    } catch (error) {
      console.error('Error checking admin access:', error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: t('auth.errors.accessError'),
      }));
    }
  };

  const signOut = async () => {
    try {
      // Get user ID before signing out for audit log
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;

      await supabase.auth.signOut();
      clearCSRFToken(); // Clear CSRF token on logout

      // Log the logout action
      if (userId) {
        await auditLog.logout(userId);
      }

      // Clear all admin-related localStorage items
      const keysToRemove = [
        'admin_preferences',
        'admin_session',
        'admin_theme',
        'admin_language',
        'admin_cache',
        'csrf_token',
        'session_encryption_key',
        'rate_limit_state',
      ];

      // Clear specific admin keys
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      // Clear all items with admin prefix
      const allKeys = Object.keys(localStorage);
      allKeys.forEach((key) => {
        if (key.startsWith('admin_') || key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key);
        }
      });

      // Clear session storage as well
      sessionStorage.clear();

      // Clear any IndexedDB databases if they exist
      if ('indexedDB' in window) {
        indexedDB
          .databases()
          .then((databases) => {
            databases.forEach((db) => {
              if (db.name?.includes('admin')) {
                indexedDB.deleteDatabase(db.name);
              }
            });
          })
          .catch(() => {
            // IndexedDB not supported or error, ignore
          });
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const verify2FA = async (token: string): Promise<boolean> => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return false;

      // Check rate limit for 2FA attempts
      const userId = session.user?.id || 'unknown';
      checkRateLimit(twoFactorRateLimiter, `2fa-${userId}`);

      const response = await fetchWithCSRF(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-verify-2fa`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ token }),
        }
      );

      if (response.ok) {
        await supabase.auth.updateUser({
          data: { two_factor_verified: true },
        });

        // Reset rate limiter on successful 2FA
        twoFactorRateLimiter.reset(`2fa-${userId}`);

        // Log successful 2FA verification
        await auditLog.twoFactorVerify(userId, true);

        await checkAdminAccess();
        return true;
      }

      // Log failed 2FA verification
      await auditLog.twoFactorVerify(userId, false);
      return false;
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      return false;
    }
  };

  return {
    ...authState,
    checkAdminAccess,
    signOut,
    verify2FA,
  };
}
