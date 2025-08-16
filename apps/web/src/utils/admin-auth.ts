import { NextApiRequest, NextApiResponse } from 'next';
import { parse, serialize } from 'cookie';
import { createHash, randomBytes } from 'crypto';
import { verifyCSRFProtection, createCSRFToken, clearSessionCSRFTokens } from './csrf';
import {
  SESSION_CONSTANTS,
  TIME_CONSTANTS,
  RATE_LIMIT_CONSTANTS,
} from '@coquinate/shared/src/utils/constants';

/**
 * Admin authentication utility for API endpoints
 * Enhanced with CSRF protection and improved session management
 */

export interface AdminAuthResult {
  isAuthenticated: boolean;
  error?: string;
  authMethod?: 'session' | 'api_key' | 'bearer_token';
  sessionId?: string;
}

export interface AdminSession {
  id: string;
  createdAt: number;
  expiresAt: number;
  lastAccess: number;
  ip?: string;
  userAgent?: string;
  csrfToken?: string;
}

// Session configuration
const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_TTL = SESSION_CONSTANTS.DEFAULT_SESSION_TTL;
const SESSION_IDLE_TIMEOUT = SESSION_CONSTANTS.SESSION_IDLE_TIMEOUT;

// In-memory session store (use Redis or database in production)
// TODO: Implement Redis session store for production
const sessionStore = new Map<string, AdminSession>();

/**
 * Clean up expired sessions periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [hash, session] of sessionStore.entries()) {
    // Check both expiration and idle timeout
    const isExpired = session.expiresAt < now;
    const isIdle = now - session.lastAccess > SESSION_IDLE_TIMEOUT;

    if (isExpired || isIdle) {
      // Clear associated CSRF tokens
      if (session.id) {
        clearSessionCSRFTokens(session.id);
      }
      sessionStore.delete(hash);
    }
  }
}, SESSION_CONSTANTS.SESSION_CLEANUP_INTERVAL);

/**
 * Check if the request is authenticated as admin
 * Supports session cookies, API key, and Bearer token authentication
 */
export function verifyAdminAuth(req: NextApiRequest): AdminAuthResult {
  const now = Date.now();

  // Option 1: Session cookie authentication (preferred)
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const sessionToken = cookies[SESSION_COOKIE_NAME];

  if (sessionToken) {
    const sessionHash = createHash('sha256').update(sessionToken).digest('hex');
    const session = sessionStore.get(sessionHash);

    if (session && session.expiresAt > now) {
      // Check idle timeout
      if (now - session.lastAccess > SESSION_IDLE_TIMEOUT) {
        // Session expired due to inactivity
        sessionStore.delete(sessionHash);
        return {
          isAuthenticated: false,
          error: 'Session expired due to inactivity',
        };
      }

      // Update last access time
      session.lastAccess = now;

      return {
        isAuthenticated: true,
        authMethod: 'session',
        sessionId: session.id,
      };
    }
  }

  // Option 2: API Key via X-Admin-API-Key header (legacy, for backward compatibility)
  if (process.env.ADMIN_API_KEY) {
    const apiKey = req.headers['x-admin-api-key'] as string;
    if (apiKey && apiKey === process.env.ADMIN_API_KEY) {
      return {
        isAuthenticated: true,
        authMethod: 'api_key',
      };
    }

    // Option 3: Bearer token via Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/);
      if (bearerMatch && bearerMatch[1] === process.env.ADMIN_API_KEY) {
        return {
          isAuthenticated: true,
          authMethod: 'bearer_token',
        };
      }
    }
  }

  return {
    isAuthenticated: false,
    error: 'Invalid or missing admin credentials',
  };
}

/**
 * Generate session token
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create admin session with improved security
 */
export function createAdminSession(
  req: NextApiRequest,
  res: NextApiResponse,
  options?: {
    ip?: string;
    userAgent?: string;
  }
): { sessionToken: string; csrfToken: string } {
  const sessionToken = generateSessionToken();
  const sessionId = randomBytes(16).toString('hex');
  const sessionHash = createHash('sha256').update(sessionToken).digest('hex');
  const now = Date.now();

  // Create CSRF token for this session
  const csrfToken = createCSRFToken(sessionId);

  // Create session
  const session: AdminSession = {
    id: sessionId,
    createdAt: now,
    expiresAt: now + SESSION_TTL,
    lastAccess: now,
    ip: options?.ip || getClientIP(req),
    userAgent: options?.userAgent || req.headers['user-agent'],
    csrfToken,
  };

  sessionStore.set(sessionHash, session);

  // Set session cookie
  const sessionCookie = serialize(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_TTL / 1000,
    path: '/',
  });

  res.setHeader('Set-Cookie', sessionCookie);

  return { sessionToken, csrfToken };
}

/**
 * Invalidate admin session
 */
export function invalidateAdminSession(req: NextApiRequest, res: NextApiResponse): void {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const sessionToken = cookies[SESSION_COOKIE_NAME];

  if (sessionToken) {
    const sessionHash = createHash('sha256').update(sessionToken).digest('hex');
    const session = sessionStore.get(sessionHash);

    // Clear CSRF tokens associated with this session
    if (session?.id) {
      clearSessionCSRFTokens(session.id);
    }

    sessionStore.delete(sessionHash);
  }

  // Clear session cookie
  const clearCookie = serialize(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  res.setHeader('Set-Cookie', clearCookie);
}

/**
 * Renew session (extend expiration)
 */
export function renewSession(sessionToken: string): boolean {
  const sessionHash = createHash('sha256').update(sessionToken).digest('hex');
  const session = sessionStore.get(sessionHash);

  if (session) {
    const now = Date.now();
    session.expiresAt = now + SESSION_TTL;
    session.lastAccess = now;
    return true;
  }

  return false;
}

/**
 * Rate limiting for admin endpoints
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const adminRateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  maxRequests?: number;
  windowMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining?: number;
  resetTime?: number;
}

/**
 * Check rate limiting for admin endpoints
 */
export function checkAdminRateLimit(ip: string, config: RateLimitConfig = {}): RateLimitResult {
  const maxRequests = config.maxRequests ?? RATE_LIMIT_CONSTANTS.ADMIN_REQUESTS_PER_MINUTE;
  const windowMs = config.windowMs ?? TIME_CONSTANTS.ONE_MINUTE;

  const now = Date.now();
  const currentLimit = adminRateLimitStore.get(ip);

  if (!currentLimit || now > currentLimit.resetTime) {
    // Create new limit window
    const newLimit: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    adminRateLimitStore.set(ip, newLimit);

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newLimit.resetTime,
    };
  }

  if (currentLimit.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentLimit.resetTime,
    };
  }

  currentLimit.count++;

  return {
    allowed: true,
    remaining: maxRequests - currentLimit.count,
    resetTime: currentLimit.resetTime,
  };
}

/**
 * Extract client IP address from request
 */
export function getClientIP(req: NextApiRequest): string {
  return (
    (req.headers['x-forwarded-for'] as string) ||
    (req.headers['x-real-ip'] as string) ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

/**
 * Log admin access for security monitoring
 */
export function logAdminAccess(
  req: NextApiRequest,
  endpoint: string,
  success: boolean = true
): void {
  const ip = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'unknown';
  const method = req.method || 'unknown';
  const timestamp = new Date().toISOString();

  const logData = {
    timestamp,
    endpoint,
    method,
    ip,
    userAgent,
    success,
    auth_method: req.headers['x-admin-api-key']
      ? 'api_key'
      : req.headers.authorization
        ? 'bearer_token'
        : 'none',
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`[ADMIN_ACCESS] ${JSON.stringify(logData)}`);
  } else {
    // In production, you might want to send this to a logging service
    console.log(`[ADMIN] ${endpoint} accessed by ${ip} - ${success ? 'SUCCESS' : 'FAILED'}`);
  }

  // TODO: In production, send to monitoring service
  // Example: await sendToMonitoringService(logData);
}

/**
 * Admin middleware for Next.js API routes with optional CSRF protection
 * Usage: await withAdminAuth(req, res, async () => { ... your handler logic ... });
 */
export async function withAdminAuth<T>(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: () => Promise<T> | T,
  options: {
    rateLimit?: RateLimitConfig;
    logAccess?: boolean;
    requireCSRF?: boolean;
  } = {}
): Promise<T | void> {
  const { rateLimit, logAccess = true, requireCSRF = true } = options;

  try {
    // Check authentication
    const authResult = verifyAdminAuth(req);
    if (!authResult.isAuthenticated) {
      if (logAccess) {
        logAdminAccess(req, req.url || 'unknown', false);
      }
      return res.status(401).json({
        success: false,
        error: authResult.error || 'Unauthorized',
      });
    }

    // Check CSRF protection for session-based auth on state-changing operations
    if (
      requireCSRF &&
      authResult.authMethod === 'session' &&
      !['GET', 'HEAD', 'OPTIONS'].includes(req.method || '')
    ) {
      const csrfResult = verifyCSRFProtection(req);
      if (!csrfResult.isValid) {
        if (logAccess) {
          logAdminAccess(req, req.url || 'unknown', false);
        }
        return res.status(403).json({
          success: false,
          error: csrfResult.error || 'CSRF validation failed',
        });
      }
    }

    // Check rate limiting if enabled
    if (rateLimit) {
      const ip = getClientIP(req);
      const rateLimitResult = checkAdminRateLimit(ip, rateLimit);

      if (!rateLimitResult.allowed) {
        if (logAccess) {
          logAdminAccess(req, req.url || 'unknown', false);
        }
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          resetTime: rateLimitResult.resetTime,
        });
      }

      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', rateLimit.maxRequests || 10);
      res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining || 0);
      res.setHeader('X-RateLimit-Reset', rateLimitResult.resetTime || 0);
    }

    // Log successful access
    if (logAccess) {
      logAdminAccess(req, req.url || 'unknown', true);
    }

    // Execute handler
    return await handler();
  } catch (error) {
    if (logAccess) {
      logAdminAccess(req, req.url || 'unknown', false);
    }
    throw error;
  }
}

/**
 * Get session information
 */
export function getSessionInfo(sessionToken: string): AdminSession | null {
  const sessionHash = createHash('sha256').update(sessionToken).digest('hex');
  return sessionStore.get(sessionHash) || null;
}

/**
 * Get all active sessions (for monitoring)
 */
export function getActiveSessions(): { count: number; sessions: AdminSession[] } {
  const now = Date.now();
  const activeSessions: AdminSession[] = [];

  for (const session of sessionStore.values()) {
    if (session.expiresAt > now) {
      // Don't expose sensitive data
      activeSessions.push({
        ...session,
        csrfToken: undefined, // Don't expose CSRF token
      });
    }
  }

  return {
    count: activeSessions.length,
    sessions: activeSessions,
  };
}
