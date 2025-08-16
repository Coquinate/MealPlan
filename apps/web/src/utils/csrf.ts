import { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes, createHash } from 'crypto';
import { parse, serialize } from 'cookie';

/**
 * CSRF Protection Utility
 * Implements Double Submit Cookie pattern with additional security measures
 */

// Token configuration
const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_TTL = 24 * 60 * 60 * 1000; // 24 hours

// In-memory token store (use Redis or database in production)
const csrfTokenStore = new Map<
  string,
  {
    token: string;
    createdAt: number;
    expiresAt: number;
    sessionId?: string;
  }
>();

// Clean up expired tokens periodically
setInterval(
  () => {
    const now = Date.now();
    for (const [hash, tokenData] of csrfTokenStore.entries()) {
      if (tokenData.expiresAt < now) {
        csrfTokenStore.delete(hash);
      }
    }
  },
  60 * 60 * 1000
); // Every hour

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Create and store CSRF token
 */
export function createCSRFToken(sessionId?: string): string {
  const token = generateCSRFToken();
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const now = Date.now();

  csrfTokenStore.set(tokenHash, {
    token,
    createdAt: now,
    expiresAt: now + CSRF_TOKEN_TTL,
    sessionId,
  });

  return token;
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, sessionId?: string): boolean {
  if (!token) {
    return false;
  }

  const tokenHash = createHash('sha256').update(token).digest('hex');
  const storedToken = csrfTokenStore.get(tokenHash);

  if (!storedToken) {
    return false;
  }

  // Check if token is expired
  if (storedToken.expiresAt < Date.now()) {
    csrfTokenStore.delete(tokenHash);
    return false;
  }

  // Check if session matches (if provided)
  if (sessionId && storedToken.sessionId && storedToken.sessionId !== sessionId) {
    return false;
  }

  return true;
}

/**
 * Set CSRF token cookie
 */
export function setCSRFCookie(res: NextApiResponse, token: string): void {
  const cookie = serialize(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by JavaScript for double-submit
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_TOKEN_TTL / 1000, // Convert to seconds
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

/**
 * Get CSRF token from request
 */
export function getCSRFTokenFromRequest(req: NextApiRequest): {
  cookieToken?: string;
  headerToken?: string;
} {
  // Get token from cookie
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const cookieToken = cookies[CSRF_COOKIE_NAME];

  // Get token from header
  const headerToken = req.headers[CSRF_HEADER_NAME] as string;

  // Also check for token in body (for form submissions)
  const bodyToken = req.body?._csrf || req.body?.csrfToken;

  return {
    cookieToken,
    headerToken: headerToken || bodyToken,
  };
}

/**
 * Verify CSRF protection on a request
 */
export function verifyCSRFProtection(req: NextApiRequest): {
  isValid: boolean;
  error?: string;
} {
  // Skip CSRF for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method || '')) {
    return { isValid: true };
  }

  const { cookieToken, headerToken } = getCSRFTokenFromRequest(req);

  // Both tokens must be present
  if (!cookieToken || !headerToken) {
    return {
      isValid: false,
      error: 'CSRF token missing',
    };
  }

  // Tokens must match (double-submit cookie pattern)
  if (cookieToken !== headerToken) {
    return {
      isValid: false,
      error: 'CSRF token mismatch',
    };
  }

  // Validate token is in our store and not expired
  if (!validateCSRFToken(cookieToken)) {
    return {
      isValid: false,
      error: 'Invalid or expired CSRF token',
    };
  }

  // Additional security: Verify Origin/Referer headers
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  if (process.env.NODE_ENV === 'production') {
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    ].filter(Boolean);

    const isValidOrigin =
      origin && allowedOrigins.some((allowed) => origin === allowed || origin.startsWith(allowed!));

    const isValidReferer =
      referer && allowedOrigins.some((allowed) => referer.startsWith(allowed!));

    if (!isValidOrigin && !isValidReferer) {
      return {
        isValid: false,
        error: 'Invalid request origin',
      };
    }
  }

  return { isValid: true };
}

/**
 * CSRF middleware for Next.js API routes
 */
export async function withCSRFProtection<T>(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: () => Promise<T> | T
): Promise<T | void> {
  const csrfResult = verifyCSRFProtection(req);

  if (!csrfResult.isValid) {
    return res.status(403).json({
      success: false,
      error: csrfResult.error || 'CSRF validation failed',
    });
  }

  return handler();
}

/**
 * Generate new CSRF token endpoint helper
 */
export function handleCSRFTokenRequest(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  // Generate new token
  const token = createCSRFToken();

  // Set cookie
  setCSRFCookie(res, token);

  // Return token in response (for AJAX requests)
  return res.status(200).json({
    success: true,
    csrfToken: token,
  });
}

/**
 * Invalidate CSRF token
 */
export function invalidateCSRFToken(token: string): void {
  if (!token) return;

  const tokenHash = createHash('sha256').update(token).digest('hex');
  csrfTokenStore.delete(tokenHash);
}

/**
 * Clear all CSRF tokens for a session
 */
export function clearSessionCSRFTokens(sessionId: string): void {
  for (const [hash, tokenData] of csrfTokenStore.entries()) {
    if (tokenData.sessionId === sessionId) {
      csrfTokenStore.delete(hash);
    }
  }
}

/**
 * Get CSRF token statistics (for monitoring)
 */
export function getCSRFStats() {
  const now = Date.now();
  let active = 0;
  let expired = 0;

  for (const [, tokenData] of csrfTokenStore.entries()) {
    if (tokenData.expiresAt > now) {
      active++;
    } else {
      expired++;
    }
  }

  return {
    total: csrfTokenStore.size,
    active,
    expired,
  };
}
