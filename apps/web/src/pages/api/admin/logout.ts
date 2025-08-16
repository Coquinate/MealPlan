import { NextApiRequest, NextApiResponse } from 'next';
import { serialize, parse } from 'cookie';
import { invalidateAdminSession } from '../../../utils/admin-auth';

/**
 * Admin Logout API Endpoint
 * Clears admin session
 *
 * POST /api/admin/logout
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
    // Get current session token from cookie
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const sessionToken = cookies.admin_session;

    // Invalidate session if it exists
    if (sessionToken) {
      invalidateAdminSession(sessionToken);
    }

    // Clear the session cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 0, // Expire immediately
      path: '/',
    };

    res.setHeader('Set-Cookie', serialize('admin_session', '', cookieOptions));

    // Log logout
    console.log(
      `Admin logout from IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`
    );

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Error in admin logout:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
