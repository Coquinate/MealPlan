import { NextApiRequest, NextApiResponse } from 'next';
import { sendServerEmailAlert } from '@coquinate/shared';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // Max 10 requests per hour per IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

function getClientIP(req: NextApiRequest): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    (req.headers['x-real-ip'] as string) ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

interface EmailRequest {
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, unknown>;
}

/**
 * API endpoint for sending admin error email alerts
 * Used by client-side admin applications to send email notifications
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  if (isRateLimited(clientIP)) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many error email requests. Please try again later.',
    });
  }

  try {
    const { message, priority, context }: EmailRequest = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Missing required field: message',
      });
    }

    const emailSent = await sendServerEmailAlert(message, priority || 'medium', {
      ...context,
      source: 'admin-api',
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    if (emailSent) {
      res.status(200).json({
        success: true,
        message: 'Admin error email sent successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send admin error email',
      });
    }
  } catch (error) {
    console.error('Error in send-error-email API:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
