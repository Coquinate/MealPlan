import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAnonClient } from '@/lib/supabase/server';
import { emailSignupLimiter } from '@/lib/rate-limit';

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
function getClientIp(request: NextRequest): string {
  // Next.js 15 provides request.ip when behind a proxy
  const directIp = (request as any).ip as string | undefined;
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
  // IPv6: Keep first 4 segments
  if (ip.includes(':')) {
    return `${ip.split(':').slice(0, 4).join(':')}::`;
  }
  // IPv4: Zero out last octet
  const parts = ip.split('.');
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0` : ip;
}

/**
 * POST /api/email-signup
 * Handle email signup with rate limiting and early bird tracking
 */
export async function POST(request: NextRequest) {
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
    const body = await request.json();
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

    // Create Supabase client
    const supabase = createAnonClient();

    // Skip the duplicate check - let the database handle it with unique constraint
    // This reduces one round-trip and the database will enforce uniqueness anyway

    // Insert new signup with anonymized IP
    const { data: newSignup, error: insertError } = await supabase
      .from('email_signups')
      .insert({
        email: normalizedEmail,
        gdpr_consent: gdprConsent,
        ip_address: anonymizeIp(clientIp),
      })
      .select('id, signup_order, is_early_bird')
      .single();

    if (insertError) {
      // Log error without PII
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error inserting email signup:', insertError.code);
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
