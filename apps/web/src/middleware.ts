/**
 * Next.js Middleware for route protection and authentication
 * Handles authentication checks and redirects for protected routes
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define route protection rules
const routeConfig = {
  // Public routes that don't require authentication
  publicRoutes: [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/about',
    '/contact',
    '/pricing',
    '/terms',
    '/privacy',
  ],

  // Routes that require authentication
  protectedRoutes: ['/dashboard', '/meals', '/recipes', '/shopping', '/profile', '/settings'],

  // Routes that require admin access
  adminRoutes: ['/admin', '/admin/users', '/admin/recipes', '/admin/analytics', '/admin/settings'],

  // Routes that require active subscription
  premiumRoutes: ['/premium', '/export', '/advanced-planning'],
};

// Helper function to check if path matches pattern
function matchesPath(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern.endsWith('/*')) {
      // Wildcard pattern
      const base = pattern.slice(0, -2);
      return path.startsWith(base);
    }
    return path === pattern || path.startsWith(`${pattern}/`);
  });
}

// Helper function to extract Supabase session from request cookies
function extractSupabaseSession(
  request: NextRequest
): { access_token?: string; refresh_token?: string } | null {
  try {
    const supabaseProjectId = process.env.NEXT_PUBLIC_SUPABASE_URL!.match(/https:\/\/([^.]+)/)?.[1];
    if (!supabaseProjectId) return null;

    const authTokenName = `sb-${supabaseProjectId}-auth-token`;
    const authCookie = request.cookies.get(authTokenName);

    if (!authCookie) return null;

    const cookieData = JSON.parse(authCookie.value);
    if (cookieData.access_token && cookieData.refresh_token) {
      return {
        access_token: cookieData.access_token,
        refresh_token: cookieData.refresh_token,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if we have valid Supabase configuration
  const hasSupabaseConfig =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // In development mode, allow placeholder values but skip auth checks
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasPlaceholders =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('placeholder');

  // Development-only auth debugging (no sensitive data)
  if (isDevelopment) {
    console.log('Middleware auth check:', {
      pathname,
      hasSupabaseConfig,
      hasPlaceholders,
      cookieCount: request.cookies.getAll().length,
    });
  }

  if (!hasSupabaseConfig) {
    console.error('Supabase configuration missing');
    return NextResponse.next();
  }

  // In development with placeholders, skip auth middleware
  if (isDevelopment && hasPlaceholders) {
    console.log(
      'Development mode with placeholder config - skipping auth middleware for',
      pathname
    );
    return NextResponse.next();
  }

  // Check if route is public
  const isPublicRoute = matchesPath(pathname, routeConfig.publicRoutes);
  const isProtectedRoute = matchesPath(pathname, routeConfig.protectedRoutes);
  const isAdminRoute = matchesPath(pathname, routeConfig.adminRoutes);
  const isPremiumRoute = matchesPath(pathname, routeConfig.premiumRoutes);

  // If public route, allow access
  if (isPublicRoute && !isProtectedRoute && !isAdminRoute && !isPremiumRoute) {
    return NextResponse.next();
  }

  // Get Supabase session from request cookies
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    }
  );

  // Extract session from request cookies using helper function
  const sessionTokens = extractSupabaseSession(request);

  // Development-only cookie debugging
  if (isDevelopment) {
    console.log('Auth cookie lookup:', { foundTokens: !!sessionTokens });
  }

  let session = null;
  let error = null;

  if (sessionTokens) {
    try {
      if (isDevelopment) {
        console.log('Auth tokens found:', {
          hasAccessToken: !!sessionTokens.access_token,
          hasRefreshToken: !!sessionTokens.refresh_token,
        });
      }

      // Set session from parsed cookie data
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: sessionTokens.access_token!,
        refresh_token: sessionTokens.refresh_token!,
      });
      session = sessionData.session;
      error = sessionError;
    } catch (e) {
      if (isDevelopment) {
        console.log(
          'Failed to set session from tokens:',
          e instanceof Error ? e.message : 'Unknown error'
        );
      }
      error = e;
    }
  }

  // Fallback to getSession() if no cookie found or parsing failed
  if (!session && !error) {
    const sessionResult = await supabase.auth.getSession();
    session = sessionResult.data.session;
    error = sessionResult.error;
    if (isDevelopment) {
      console.log('Fallback session:', { hasSession: !!session, hasError: !!error });
    }
  }

  // No session found in middleware - let client-side handle auth redirect
  if (!session || error) {
    if (isDevelopment) {
      console.log('No server-side session, client handling auth for:', pathname);
    }

    // For protected routes, let the client handle the redirect rather than doing it server-side
    // This is because Supabase stores the session in localStorage, not in HTTP cookies
    if (isProtectedRoute || isAdminRoute || isPremiumRoute) {
      // Return response with a header indicating auth check is needed
      const response = NextResponse.next();
      response.headers.set('x-auth-check-required', 'true');
      return response;
    }
    return NextResponse.next();
  }

  // User is authenticated
  const userId = session.user.id;

  // Check admin access if needed
  if (isAdminRoute) {
    try {
      // Query admin status from database
      // Note: admin_users contains separate admin accounts, not regular users
      // We check if the current session user ID exists in admin_users table
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('is_active')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (adminError || !adminUser) {
        // Not an admin - redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Admin check error:', error);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Check premium access if needed
  if (isPremiumRoute) {
    try {
      // Query subscription status from database
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('subscription_status, has_active_trial, has_trial_gift_access, trial_ends_at')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Check if user has active subscription
      const hasActiveSubscription =
        user.subscription_status === 'active' ||
        user.has_active_trial ||
        user.has_trial_gift_access ||
        (user.trial_ends_at && new Date(user.trial_ends_at) > new Date());

      if (!hasActiveSubscription) {
        // No active subscription - redirect to pricing
        return NextResponse.redirect(new URL('/pricing', request.url));
      }
    } catch (error) {
      console.error('Premium check error:', error);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If authenticated user is accessing auth pages, redirect to dashboard
  if (pathname.startsWith('/auth/') && !pathname.includes('reset-password')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow access
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
