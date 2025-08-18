import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { emailSignupLimiter } from '@/lib/rate-limit';

/**
 * Extended NextRequest type with ip property
 * Next.js 15 provides this when behind a proxy
 */
interface NextRequestWithIp extends NextRequest {
  ip?: string;
}

/**
 * Validation schema for email signup
 */
const emailSignupSchema = z.object({
  email: z.string().email().max(255),
  gdprConsent: z.boolean().refine((val) => val === true),
});

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequestWithIp): string {
  // Next.js 15 provides request.ip when behind a proxy
  const directIp = request.ip;
  if (directIp) return directIp;

  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Fallback to a default for local development
  return '127.0.0.1';
}

/**
 * Anonymize IP address for GDPR compliance
 */
function anonymizeIp(ip: string): string {
  // Remove zone ID if present (e.g., %eth0 in fe80::1%eth0)
  const cleanIp = ip.split('%')[0];

  // Handle IPv4-mapped IPv6 addresses (e.g., ::ffff:192.168.1.1)
  if (cleanIp.startsWith('::ffff:')) {
    const ipv4Part = cleanIp.substring(7);
    const parts = ipv4Part.split('.');
    if (parts.length === 4) {
      // Convert back to IPv4-mapped IPv6 with anonymized last octet
      return `::ffff:${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }

  // Regular IPv6: Keep first 4 segments
  if (cleanIp.includes(':')) {
    const segments = cleanIp.split(':');
    // Take first 4 segments and pad with :: for anonymization
    if (segments.length >= 4) {
      return `${segments.slice(0, 4).join(':')}::`;
    }
    // If less than 4 segments, just add ::
    return `${cleanIp}::`.replace(/::+/, '::'); // Avoid multiple ::
  }

  // Regular IPv4: Zero out last octet
  const parts = cleanIp.split('.');
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0` : cleanIp;
}

/**
 * POST /api/email-signup
 * Handle email signup with rate limiting and early bird tracking
 */
export async function POST(request: NextRequestWithIp) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Check rate limit
    if (emailSignupLimiter.isRateLimited(clientIp)) {
      const resetTime = emailSignupLimiter.getResetTime(clientIp);
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: resetTime,
        },
        {
          status: 429,
          headers: {
            'Retry-After': resetTime.toString(),
          },
        }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    const validation = emailSignupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, gdprConsent } = validation.data;

    // Normalize email to lowercase for consistency
    const normalizedEmail = email.trim().toLowerCase();

    // Create Supabase client with service role for bypassing RLS
    const supabase = createServerClient();

    // Skip the duplicate check - let the database handle it with unique constraint
    // This reduces one round-trip and the database will enforce uniqueness anyway

    // Insert new signup with anonymized IP
    const anonymizedIp = anonymizeIp(clientIp);

    // Debug logging for development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Email signup attempt:', {
        originalIp: clientIp,
        anonymizedIp,
        email: normalizedEmail.replace(/(.{2}).*(@.*)/, '$1***$2'), // Partially mask email
      });
    }

    const { data: newSignup, error: insertError } = await supabase
      .from('email_signups')
      .insert({
        email: normalizedEmail,
        gdpr_consent: gdprConsent,
        ip_address: anonymizedIp,
      })
      .select('id, signup_order, is_early_bird')
      .single();

    if (insertError) {
      // Log error without PII
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error inserting email signup:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
        });
      }

      // Check if it's a unique constraint violation
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
      }

      return NextResponse.json(
        { error: 'Failed to save email. Please try again.' },
        { status: 500 }
      );
    }

    // Log success without PII
    if (process.env.NODE_ENV !== 'production') {
      console.log('Email signup successful', {
        signupOrder: newSignup.signup_order,
        isEarlyBird: newSignup.is_early_bird,
      });
    }

    // Trigger Edge Function to send welcome email
    try {
      const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-welcome-email`;
      const functionSecret = process.env.WELCOME_EMAIL_FN_SECRET;

      if (functionSecret) {
        await fetch(edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-function-secret': functionSecret,
          },
          body: JSON.stringify({
            email: normalizedEmail,
            isEarlyBird: newSignup.is_early_bird,
          }),
        });
      } else if (process.env.NODE_ENV !== 'production') {
        console.warn('WELCOME_EMAIL_FN_SECRET not configured - email not sent');
      }
    } catch (emailError) {
      // Don't fail the signup if email fails
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to send welcome email (non-blocking):', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      isEarlyBird: newSignup.is_early_bird,
      signupOrder: newSignup.signup_order,
    });
  } catch (error) {
    console.error('Unexpected error in email signup:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/email-signup
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Email signup endpoint is running',
  });
}
