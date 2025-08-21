/**
 * Launch configuration for controlling site access during different launch phases
 * Controls which routes are accessible based on launch mode
 */

export type LaunchMode = 'coming-soon' | 'full-launch';

export const LAUNCH_MODE = (process.env.NEXT_PUBLIC_LAUNCH_MODE || 'coming-soon') as LaunchMode;

type LaunchConfig = {
  [key in LaunchMode]: {
    allowedPaths: string[];
    blockedPaths?: string[];
    redirectTo: string;
    robotsTxt: string;
    showMainNav: boolean;
  };
};

export const launchConfig: LaunchConfig = {
  'coming-soon': {
    // Coming soon page with email capture
    // Shows pre-launch content while app is being developed
    allowedPaths: [
      '/',              // Coming soon page
      '/privacy',       // Legal requirement
      '/terms',         // Legal requirement
      '/politica-de-confidentialitate', // Privacy policy in Romanian
      '/api/newsletter', // Email capture
      '/api/email-signup', // Email signup endpoint
      '/api/subscribe',  // Subscribe endpoint
      '/api/health',    // Health check
    ],
    redirectTo: '/',
    robotsTxt: 'noindex, nofollow',
    showMainNav: false,
  },
  'full-launch': {
    allowedPaths: ['*'], // Everything allowed
    blockedPaths: [],
    redirectTo: '/dashboard',
    robotsTxt: 'index, follow',
    showMainNav: true,
  },
};

export function isRouteAllowed(pathname: string): boolean {
  const config = launchConfig[LAUNCH_MODE];
  
  // Check if it's a system path (always allowed)
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/static') || 
      pathname.includes('.')) {
    return true;
  }
  
  // Full launch - everything allowed
  if (LAUNCH_MODE === 'full-launch') {
    return true;
  }
  
  // Check allowed paths
  const isAllowed = config.allowedPaths.some(path => 
    pathname === path || 
    pathname.startsWith(path + '/') ||
    path.endsWith('*')
  );
  
  
  return isAllowed;
}

export function getLaunchRedirect(): string {
  return launchConfig[LAUNCH_MODE].redirectTo;
}

export function shouldShowNavigation(): boolean {
  return launchConfig[LAUNCH_MODE].showMainNav;
}

export function getRobotsTxt(): string {
  return launchConfig[LAUNCH_MODE].robotsTxt;
}

