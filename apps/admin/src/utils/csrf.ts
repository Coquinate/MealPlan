/**
 * CSRF Protection utilities for admin API calls
 */

const CSRF_TOKEN_KEY = 'admin_csrf_token';
const CSRF_HEADER = 'X-CSRF-Token';

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create CSRF token for the session
 */
export function getCSRFToken(): string {
  let token = sessionStorage.getItem(CSRF_TOKEN_KEY);

  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }

  return token;
}

/**
 * Clear CSRF token (on logout)
 */
export function clearCSRFToken(): void {
  sessionStorage.removeItem(CSRF_TOKEN_KEY);
}

/**
 * Add CSRF token to headers
 */
export function addCSRFHeader(headers: HeadersInit = {}): HeadersInit {
  const token = getCSRFToken();

  if (headers instanceof Headers) {
    headers.set(CSRF_HEADER, token);
    return headers;
  }

  return {
    ...headers,
    [CSRF_HEADER]: token,
  };
}

/**
 * Verify CSRF token in Edge Function
 * This is for server-side verification
 */
export function verifyCSRFToken(requestToken: string | null, sessionToken: string): boolean {
  if (!requestToken || !sessionToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  if (requestToken.length !== sessionToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < requestToken.length; i++) {
    result |= requestToken.charCodeAt(i) ^ sessionToken.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Enhanced fetch with CSRF protection
 */
export async function fetchWithCSRF(url: string, options: RequestInit = {}): Promise<Response> {
  const enhancedOptions: RequestInit = {
    ...options,
    headers: addCSRFHeader(options.headers),
    credentials: 'include', // Ensure cookies are sent
  };

  return fetch(url, enhancedOptions);
}
