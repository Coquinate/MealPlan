import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { apiLogger, emailLogger } from '@/lib/logger';

/**
 * Extended NextRequest type with ip property
 * Next.js 15 provides this when behind a proxy
 */
interface NextRequestWithIp extends NextRequest {
  ip?: string;
}

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
function anonymizeIpAddress(ip: string): string {
  // Remove zone ID if present (e.g., %eth0 in fe80::1%eth0)
  const cleanIp = ip.split('%')[0];

  // Handle IPv4-mapped IPv6 addresses (e.g., ::ffff:192.168.1.1)
  if (cleanIp.startsWith('::ffff:')) {
    const ipv4Part = cleanIp.substring(7);
    const parts = ipv4Part.split('.');
    if (parts.length === 4) {
      return `::ffff:${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }

  // Regular IPv6: Keep first 4 segments
  if (cleanIp.includes(':')) {
    const segments = cleanIp.split(':').filter(segment => segment !== '');
    if (segments.length >= 4) {
      return `${segments.slice(0, 4).join(':')}::`;
    }
    return cleanIp.includes('::') ? cleanIp : `${cleanIp}::`;
  }

  // Regular IPv4: Zero out last octet
  const parts = cleanIp.split('.');
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0` : cleanIp;
}

/**
 * GET /api/confirm-email/[token]
 * Handle email confirmation via token validation
 * Redirects to success page after confirmation
 */
export async function GET(
  request: NextRequestWithIp,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const clientIp = getClientIp(request);
    const anonymizedIp = anonymizeIpAddress(clientIp);

    // Basic token validation
    if (!token || typeof token !== 'string' || token.length < 32) {
      apiLogger.warn('Invalid confirmation token format', {
        tokenLength: token?.length || 0,
        ip: anonymizedIp,
        timestamp: new Date().toISOString(),
      });
      
      // Redirect to error page or home with error parameter
      return NextResponse.redirect(new URL('/?error=invalid-token', request.url));
    }

    // Create Supabase client
    const supabase = createServerClient();

    // Find confirmation record with associated email signup
    const { data: confirmation, error: confirmationError } = await supabase
      .from('email_confirmations')
      .select(`
        id,
        email_signup_id,
        token,
        created_at,
        expires_at,
        confirmed_at,
        email_signups:email_signup_id (
          id,
          email,
          confirmed,
          is_early_bird,
          signup_order
        )
      `)
      .eq('token', token)
      .single();

    if (confirmationError || !confirmation) {
      apiLogger.warn('Confirmation token not found', {
        error: confirmationError?.message || 'Token not found',
        ip: anonymizedIp,
        timestamp: new Date().toISOString(),
      });
      
      return NextResponse.redirect(new URL('/?error=token-not-found', request.url));
    }

    // Check if token has expired (24 hours)
    const now = new Date();
    const expiryTime = new Date(confirmation.expires_at);
    
    if (now > expiryTime) {
      apiLogger.warn('Confirmation token expired', {
        expiryTime: confirmation.expires_at,
        ip: anonymizedIp,
        timestamp: now.toISOString(),
      });
      
      return NextResponse.redirect(new URL('/?error=token-expired', request.url));
    }

    // Check if already confirmed
    if (confirmation.confirmed_at) {
      emailLogger.info('Email already confirmed, redirecting to success', {
        ip: anonymizedIp,
        timestamp: now.toISOString(),
      });
      
      // Already confirmed, redirect to success page
      return NextResponse.redirect(new URL('/confirm-email/success?already-confirmed=true', request.url));
    }

    // Extract email signup data
    const emailSignup = confirmation.email_signups;
    if (!emailSignup) {
      apiLogger.error('Associated email signup not found', {
        confirmationId: confirmation.id,
        ip: anonymizedIp,
        timestamp: now.toISOString(),
      });
      
      return NextResponse.redirect(new URL('/?error=signup-not-found', request.url));
    }

    // Update email_signups to confirmed=true
    const { error: updateSignupError } = await supabase
      .from('email_signups')
      .update({ confirmed: true })
      .eq('id', emailSignup.id);

    if (updateSignupError) {
      apiLogger.error('Failed to update email signup confirmation status', {
        error: updateSignupError.message,
        signupId: emailSignup.id,
        ip: anonymizedIp,
        timestamp: now.toISOString(),
      });
      
      return NextResponse.redirect(new URL('/?error=confirmation-failed', request.url));
    }

    // Mark confirmation as completed
    const { error: updateConfirmationError } = await supabase
      .from('email_confirmations')
      .update({ confirmed_at: now.toISOString() })
      .eq('id', confirmation.id);

    if (updateConfirmationError) {
      apiLogger.error('Failed to update confirmation record', {
        error: updateConfirmationError.message,
        confirmationId: confirmation.id,
        ip: anonymizedIp,
        timestamp: now.toISOString(),
      });
      // Continue anyway - the main update succeeded
    }

    // Log successful confirmation
    emailLogger.info('Email confirmation successful', {
      signupOrder: emailSignup.signup_order,
      isEarlyBird: emailSignup.is_early_bird,
      ip: anonymizedIp,
      timestamp: now.toISOString(),
    });

    // Trigger welcome email (early bird or regular) via existing Edge Function
    try {
      const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-welcome-email`;
      const functionSecret = process.env.WELCOME_EMAIL_FN_SECRET;

      if (functionSecret) {
        // Create abort controller for timeout management
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          const response = await fetch(edgeFunctionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Required by Supabase Edge Functions gateway
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
              'x-function-secret': functionSecret,
            },
            body: JSON.stringify({
              email: emailSignup.email,
              isEarlyBird: emailSignup.is_early_bird,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            emailLogger.info('Welcome email sent successfully after confirmation', {
              isEarlyBird: emailSignup.is_early_bird,
              timestamp: now.toISOString(),
            });
          } else {
            emailLogger.warn(`Welcome email function returned status ${response.status} after confirmation`);
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            emailLogger.warn('Welcome email function timed out after confirmation');
          } else {
            throw fetchError;
          }
        }
      }
    } catch (emailError) {
      // Don't fail the confirmation if email fails - just log it
      emailLogger.warn('Failed to send welcome email after confirmation (non-blocking)', {
        error: emailError instanceof Error ? emailError.message : String(emailError),
        timestamp: now.toISOString(),
      });
    }

    // Redirect to success page with user status
    const successUrl = new URL('/confirm-email/success', request.url);
    successUrl.searchParams.set('early-bird', emailSignup.is_early_bird.toString());
    successUrl.searchParams.set('signup-order', emailSignup.signup_order.toString());
    
    return NextResponse.redirect(successUrl);

  } catch (error) {
    apiLogger.error('Unexpected error in email confirmation', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.redirect(new URL('/?error=server-error', request.url));
  }
}

/**
 * POST /api/confirm-email/[token]
 * Handle programmatic confirmation (for testing)
 */
export async function POST(
  request: NextRequestWithIp,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  // Redirect POST to GET for consistency
  return NextResponse.redirect(new URL(`/api/confirm-email/${token}`, request.url));
}
