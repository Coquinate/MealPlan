import { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'crypto';
import { serialize } from 'cookie';
import { createAdminSession, getClientIP } from '../../../utils/admin-auth';

/**
 * Admin Login API Endpoint
 * Handles admin authentication and session creation
 *
 * POST /api/admin/login
 * Body: { password: string }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { password } = req.body;

    // Validate password is provided
    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Password is required',
      });
    }

    // Check if admin password is configured
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD not configured in environment');
      return res.status(500).json({
        success: false,
        error: 'Admin authentication not configured',
      });
    }

    // Verify password (constant-time comparison)
    const providedHash = createHash('sha256').update(password).digest('hex');
    const expectedHash = createHash('sha256').update(adminPassword).digest('hex');

    if (providedHash !== expectedHash) {
      // Log failed attempt
      console.warn(
        `Failed admin login attempt from IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`
      );

      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generate session token
    const sessionToken = createHash('sha256')
      .update(`${Date.now()}-${Math.random()}-${req.headers['user-agent']}`)
      .digest('hex');

    // Create session in store
    const clientIp = getClientIP(req);
    createAdminSession(sessionToken, clientIp);

    // Set session cookie (HttpOnly, Secure, SameSite)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    };

    res.setHeader('Set-Cookie', serialize('admin_session', sessionToken, cookieOptions));

    // Log successful login
    console.log(
      `Admin login successful from IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      expiresIn: '24 hours',
    });
  } catch (error) {
    console.error('Error in admin login:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
