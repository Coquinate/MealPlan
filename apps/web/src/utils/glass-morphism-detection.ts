/**
 * Modern Hearth Glass Morphism Feature Detection
 * Detects browser support for backdrop-filter and applies appropriate fallback class
 * Phase 1 Foundation Requirement
 */

/**
 * Check if browser supports glass morphism effects
 * Tests for backdrop-filter CSS property support
 */
export function detectGlassMorphismSupport(): boolean {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  // Method 1: Check CSS.supports API (most reliable)
  if (typeof CSS !== 'undefined' && CSS.supports) {
    const supportsBackdropFilter =
      CSS.supports('backdrop-filter', 'blur(10px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(10px)');

    if (supportsBackdropFilter) {
      return true;
    }
  }

  // Method 2: Feature detection via element style
  const testElement = document.createElement('div');
  const properties = ['backdropFilter', 'webkitBackdropFilter'];

  for (const prop of properties) {
    if (prop in testElement.style) {
      return true;
    }
  }

  // Method 3: Check for Safari/WebKit specific support
  // Safari supports backdrop-filter but may not report it correctly
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari && 'WebKitCSSMatrix' in window) {
    return true;
  }

  return false;
}

/**
 * Apply glass morphism support class to body element
 * This enables CSS to conditionally apply glass effects or fallbacks
 */
export function applyGlassMorphismClass(): void {
  if (typeof document === 'undefined') return;

  // Remove any existing glass classes first
  document.body.classList.remove('glass-supported', 'glass-fallback');

  // Apply appropriate class based on support
  const hasSupport = detectGlassMorphismSupport();
  document.body.classList.add(hasSupport ? 'glass-supported' : 'glass-fallback');

  // Log for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[Modern Hearth] Glass morphism ${hasSupport ? 'supported' : 'not supported'} - applying ${hasSupport ? '.glass-supported' : '.glass-fallback'} class`
    );
  }
}

/**
 * Initialize glass morphism detection
 * Should be called as early as possible in the app lifecycle
 */
export function initGlassMorphism(): void {
  // If document is already loaded, apply immediately
  if (document.readyState !== 'loading') {
    applyGlassMorphismClass();
  } else {
    // Otherwise wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', applyGlassMorphismClass);
  }

  // Also check on visibility change (for mobile browsers that may suspend)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      applyGlassMorphismClass();
    }
  });
}

// Export a simple check function for SSR safety
export function isGlassMorphismSupported(): boolean {
  if (typeof window === 'undefined') {
    // Conservative default for SSR
    return false;
  }
  return detectGlassMorphismSupport();
}
