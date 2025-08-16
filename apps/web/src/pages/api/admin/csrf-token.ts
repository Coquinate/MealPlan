import { NextApiRequest, NextApiResponse } from 'next';
import { handleCSRFTokenRequest } from '../../../utils/csrf';
import { verifyAdminAuth, checkAdminRateLimit, getClientIP } from '../../../utils/admin-auth';
import { RATE_LIMIT_CONSTANTS, TIME_CONSTANTS } from '@coquinate/shared/src/utils/constants';

/**
 * Admin CSRF Token API Endpoint
 *
 * Returns a new CSRF token for admin operations.
 * Requires admin authentication and rate limiting.
 *
 * Rate Limits:
 * - 5 tokens per minute per IP
 * - 20 tokens per hour per IP
 *
 * Usage:
 * GET /api/admin/csrf-token
 *
 * Response:
 * {
 *   success: true,
 *   csrfToken: "token_string"
 * }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  // Get client IP for rate limiting
  const clientIp = getClientIP(req);

  // Apply strict rate limiting for CSRF token generation
  // More restrictive than general admin endpoints
  const rateLimitResult = checkAdminRateLimit(clientIp, {
    maxRequests: RATE_LIMIT_CONSTANTS.CSRF_TOKENS_PER_MINUTE,
    windowMs: TIME_CONSTANTS.ONE_MINUTE,
  });

  if (!rateLimitResult.allowed) {
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', '5');
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', rateLimitResult.resetTime || Date.now() + 60000);
    res.setHeader('Retry-After', '60');

    return res.status(429).json({
      success: false,
      error: 'Too many CSRF token requests. Please wait before requesting a new token.',
      resetTime: rateLimitResult.resetTime,
      retryAfter: 60,
    });
  }

  // Set rate limit headers for successful requests
  res.setHeader('X-RateLimit-Limit', '5');
  res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining || 0);
  res.setHeader('X-RateLimit-Reset', rateLimitResult.resetTime || Date.now() + 60000);

  // Check authentication (CSRF not required for GET)
  const authResult = verifyAdminAuth(req);
  if (!authResult.isAuthenticated) {
    return res.status(401).json({
      success: false,
      error: authResult.error || 'Unauthorized',
    });
  }

  // Generate and return CSRF token
  return handleCSRFTokenRequest(req, res);
}
