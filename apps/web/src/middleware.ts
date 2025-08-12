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

  // Check if route is public
  const isPublicRoute = matchesPath(pathname, routeConfig.publicRoutes);
  const isProtectedRoute = matchesPath(pathname, routeConfig.protectedRoutes);
  const isAdminRoute = matchesPath(pathname, routeConfig.adminRoutes);
  const isPremiumRoute = matchesPath(pathname, routeConfig.premiumRoutes);

  // If public route, allow access
  if (isPublicRoute && !isProtectedRoute && !isAdminRoute && !isPremiumRoute) {
    return NextResponse.next();
  }

  // Get Supabase session from cookies
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  // Check authentication
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // No session found - redirect to login
  if (!session || error) {
    if (isProtectedRoute || isAdminRoute || isPremiumRoute) {
      const redirectUrl = new URL('/auth/login', request.url);
      // Add the original URL as a redirect parameter
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // User is authenticated
  const userId = session.user.id;

  // Check admin access if needed
  if (isAdminRoute) {
    try {
      // Query admin status from database
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('is_active')
        .eq('user_id', userId)
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
