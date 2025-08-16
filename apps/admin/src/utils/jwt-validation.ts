/**
 * JWT Session Validation utilities
 */

import { supabase } from '@/lib/supabase';

interface JWTPayload {
  sub: string; // User ID
  email?: string;
  role?: string;
  iat: number; // Issued at
  exp: number; // Expiration
  aud?: string; // Audience
  iss?: string; // Issuer
}

/**
 * Decode JWT without verification (for client-side inspection)
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Check if JWT is expired
 */
export function isJWTExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Get remaining session time in milliseconds
 */
export function getSessionTimeRemaining(token: string): number {
  const payload = decodeJWT(token);
  if (!payload) {
    return 0;
  }

  const now = Math.floor(Date.now() / 1000);
  const remaining = payload.exp - now;

  return remaining > 0 ? remaining * 1000 : 0;
}

/**
 * Validate session and refresh if needed
 */
export async function validateAndRefreshSession(): Promise<{
  valid: boolean;
  session: any | null;
  error?: string;
}> {
  try {
    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return {
        valid: false,
        session: null,
        error: 'No active session',
      };
    }

    // Check if token is expired or about to expire (within 5 minutes)
    const timeRemaining = getSessionTimeRemaining(session.access_token);
    const fiveMinutes = 5 * 60 * 1000;

    if (timeRemaining < fiveMinutes) {
      // Attempt to refresh the session
      const {
        data: { session: newSession },
        error: refreshError,
      } = await supabase.auth.refreshSession();

      if (refreshError || !newSession) {
        return {
          valid: false,
          session: null,
          error: 'Session expired and refresh failed',
        };
      }

      return {
        valid: true,
        session: newSession,
      };
    }

    return {
      valid: true,
      session,
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return {
      valid: false,
      session: null,
      error: 'Session validation failed',
    };
  }
}

/**
 * Set up automatic session refresh
 */
export function setupSessionRefresh(onSessionExpired?: () => void): () => void {
  let intervalId: NodeJS.Timeout | null = null;

  const checkSession = async () => {
    const result = await validateAndRefreshSession();

    if (!result.valid && onSessionExpired) {
      onSessionExpired();
    }
  };

  // Check every minute
  intervalId = setInterval(checkSession, 60000);

  // Initial check
  checkSession();

  // Return cleanup function
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}

/**
 * Validate admin role from JWT
 */
export async function validateAdminRole(token: string): Promise<boolean> {
  const payload = decodeJWT(token);

  if (!payload) {
    return false;
  }

  // Check if token is expired
  if (isJWTExpired(token)) {
    return false;
  }

  // Additional check against database for admin status
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, role')
    .eq('user_id', payload.sub)
    .single();

  return !!adminUser;
}
