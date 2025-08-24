import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { emailSignupLimiter } from '@/lib/rate-limit';
import { apiLogger, emailLogger } from '@/lib/logger';
import { 
  EmailValidationSchema, 
  validateEmail,
  MAX_EMAIL_LENGTH,
  generateHoneypotField
} from '@coquinate/shared/security';

/**
 * Extended NextRequest type with ip property
 * Next.js 15 provides this when behind a proxy
 */
interface NextRequestWithIp extends NextRequest {
  ip?: string;
}

/**
 * Enhanced validation schema with comprehensive security checks
 * Uses the shared EmailValidationSchema and adds anti-bot measures
 */
const emailSignupSchema = EmailValidationSchema.extend({
  gdprConsent: z.boolean().refine(val => val === true, {
    message: 'Consimțământul GDPR este necesar'
  }),
  // Anti-bot honeypot fields - multiple field names for security
  company_website: z.string().optional(),
  website: z.string().optional(),
  url: z.string().optional(),
  phone: z.string().optional(),
}).passthrough(); // Allow unknown fields for additional honeypot fields

/**
 * Comprehensive bot detection validation with multiple security layers
 */
function validateBotDetection(body: Record<string, any>): {
  isBot: boolean;
  reasons: string[];
  confidence: number;
} {
  const reasons: string[] = [];
  let isBot = false;
  let confidence = 0;

  // Configurable honeypot fields for better security
  const primaryHoneypotField = process.env.HONEYPOT_FIELD_NAME || 'company_website';
  const honeypotFields = [primaryHoneypotField, 'website', 'url', 'phone'];
  const knownFields = ['email', 'gdprConsent', ...honeypotFields];
  
  // Check all honeypot fields
  for (const field of honeypotFields) {
    const value = body[field];
    if (value && value.trim() !== '') {
      reasons.push(`Honeypot field '${field}' filled`);
      isBot = true;
      confidence += 0.9; // High confidence for honeypot
    }
  }

  // Check for suspicious patterns in request body using literal string matching
  // Note: These are literal patterns, not regex - using includes() for safety
  const suspiciousPatterns = [
    'bot', 'crawl', 'spider', 'scrape', 'automated', 'script',
    'selenium', 'playwright', 'puppeteer', 'test', 'headless'
  ];
  const bodyStr = JSON.stringify(body).toLowerCase();
  
  // Use literal string matching to avoid regex injection vulnerabilities
  for (const pattern of suspiciousPatterns) {
    // Validate pattern contains only safe characters (defensive programming)
    if (!/^[a-zA-Z0-9_-]+$/.test(pattern)) {
      console.warn(`Potentially unsafe pattern detected: ${pattern}`);
      continue;
    }
    
    if (bodyStr.includes(pattern)) {
      reasons.push(`Suspicious pattern: ${pattern}`);
      isBot = true;
      confidence += 0.3;
    }
  }

  // Check for excessive unknown fields
  const extraFields = Object.keys(body).filter(key => !knownFields.includes(key));
  if (extraFields.length > 5) {
    reasons.push(`Too many extra fields: ${extraFields.length}`);
    isBot = true;
    confidence += 0.4;
  }

  // Check for missing required fields (unusual for legitimate users)
  if (!body.email || !body.gdprConsent) {
    reasons.push('Missing required fields');
    confidence += 0.2;
  }

  // Check for suspicious email patterns using literal string matching
  if (body.email && typeof body.email === 'string') {
    const email = body.email.toLowerCase();
    // Note: These are literal patterns, not regex - using includes() for safety
    const suspiciousEmailPatterns = ['test', 'spam', 'bot', 'fake', 'dummy'];
    
    // Use literal string matching to avoid regex injection vulnerabilities
    for (const pattern of suspiciousEmailPatterns) {
      // Validate pattern contains only safe characters (defensive programming)
      if (!/^[a-zA-Z0-9_-]+$/.test(pattern)) {
        console.warn(`Potentially unsafe email pattern detected: ${pattern}`);
        continue;
      }
      
      if (email.includes(pattern)) {
        reasons.push(`Suspicious email pattern: ${pattern}`);
        confidence += 0.3;
      }
    }
  }

  // Configurable confidence threshold for bot detection
  const confidenceThreshold = parseFloat(process.env.ANTI_BOT_MAX_CONFIDENCE_THRESHOLD || '0.7');
  if (confidence >= confidenceThreshold) {
    isBot = true;
  }

  return { isBot, reasons, confidence };
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

  // Handle special IPv6 addresses
  if (cleanIp === '::1') {
    // IPv6 loopback - return as is (already anonymized)
    return '::1';
  }

  // Regular IPv6: Keep first 4 segments
  if (cleanIp.includes(':')) {
    const segments = cleanIp.split(':').filter(segment => segment !== '');
    
    // If we have enough segments, take first 4 and anonymize rest
    if (segments.length >= 4) {
      return `${segments.slice(0, 4).join(':')}::`;
    }
    
    // If we already have compressed notation (::), keep as is
    if (cleanIp.includes('::')) {
      return cleanIp;
    }
    
    // Otherwise, add :: for anonymization
    return `${cleanIp}::`;
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

    // Comprehensive bot detection before validation
    const botCheck = validateBotDetection(body);
    if (botCheck.isBot) {
      // Enhanced logging with confidence score
      apiLogger.warn('Bot submission attempt blocked', {
        reasons: botCheck.reasons,
        confidence: botCheck.confidence,
        ip: anonymizeIp(clientIp),
        userAgent: request.headers.get('user-agent')?.substring(0, 100) || 'unknown',
        timestamp: new Date().toISOString(),
      });
      
      // Rate limit aggressive bot attempts by forcing immediate rate limit check
      // Since our rate limiter doesn't support multipliers, we'll manually trigger the limit
      const botRateLimitMultiplier = parseInt(process.env.ANTI_BOT_RATE_LIMIT_MULTIPLIER || '3');
      for (let i = 0; i < botRateLimitMultiplier; i++) {
        emailSignupLimiter.isRateLimited(clientIp); // This increments the counter
      }
      
      // Return generic error to not reveal detection methods
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Comprehensive validation with security checks
    const validation = emailSignupSchema.safeParse(body);

    if (!validation.success) {
      // Log validation failure
      apiLogger.warn('Validation failed for email signup', {
        errors: validation.error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
        ip: anonymizeIp(clientIp),
      });
      
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, gdprConsent } = validation.data;

    // Additional server-side email validation (complementary to Zod schema)
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      // Enhanced logging for security analysis
      apiLogger.warn('Email failed comprehensive server validation', {
        errors: emailValidation.errors,
        isDisposable: emailValidation.isDisposable,
        isMalicious: emailValidation.isMalicious,
        emailLength: email.length,
        emailDomain: email.split('@')[1]?.toLowerCase() || 'unknown',
        ip: anonymizeIp(clientIp),
        timestamp: new Date().toISOString(),
      });
      
      // Return user-friendly error in Romanian
      const userFriendlyError = emailValidation.errors[0] || 'Adresa de email nu este validă';
      return NextResponse.json(
        { error: userFriendlyError },
        { status: 400 }
      );
    }

    // Normalize email to lowercase for consistency
    const normalizedEmail = email.trim().toLowerCase();

    // Create Supabase client with service role for bypassing RLS
    const supabase = createServerClient();

    // Skip the duplicate check - let the database handle it with unique constraint
    // This reduces one round-trip and the database will enforce uniqueness anyway

    // Insert new signup with anonymized IP
    const anonymizedIp = anonymizeIp(clientIp);

    // Comprehensive security logging
    emailLogger.info('Legitimate email signup attempt', {
      anonymizedIp,
      emailDomain: normalizedEmail.split('@')[1],
      emailLength: normalizedEmail.length,
      isDisposable: emailValidation.isDisposable,
      isMalicious: emailValidation.isMalicious,
      botConfidence: botCheck.confidence,
      hasAnyHoneypot: ['company_website', 'website', 'url', 'phone'].some(field => !!body[field]),
      userAgent: request.headers.get('user-agent')?.substring(0, 50) || 'unknown',
      timestamp: new Date().toISOString(),
    });

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
      // Log error without PII - sanitize error message and details
      const sanitizedMessage = insertError.message?.replace(normalizedEmail, '[EMAIL_REDACTED]') || 'Unknown error';
      const sanitizedDetails = insertError.details?.replace(normalizedEmail, '[EMAIL_REDACTED]') || 'No details';
      
      emailLogger.error('Failed to insert email signup', {
        code: insertError.code,
        message: sanitizedMessage,
        details: sanitizedDetails,
        hint: insertError.hint,
        timestamp: new Date().toISOString(),
      });

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
    emailLogger.info('Email signup successful', {
      signupOrder: newSignup.signup_order,
      isEarlyBird: newSignup.is_early_bird,
    });

    // Trigger Edge Function to send welcome email with timeout
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
              'x-function-secret': functionSecret,
            },
            body: JSON.stringify({
              email: normalizedEmail,
              isEarlyBird: newSignup.is_early_bird,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            emailLogger.warn(`Welcome email function returned status ${response.status}`);
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            emailLogger.warn('Welcome email function timed out after 10 seconds');
          } else {
            throw fetchError; // Re-throw other errors to be caught by outer catch
          }
        }
      } else if (process.env.NODE_ENV !== 'production') {
        emailLogger.warn('WELCOME_EMAIL_FN_SECRET not configured - email not sent');
      }
    } catch (emailError) {
      // Don't fail the signup if email fails - sanitize error before logging
      if (process.env.NODE_ENV !== 'production') {
        const errorMessage = emailError instanceof Error ? emailError.message : String(emailError);
        const sanitizedErrorMessage = errorMessage.replace(normalizedEmail, '[EMAIL_REDACTED]');
        
        emailLogger.warn('Failed to send welcome email (non-blocking)', {
          error: sanitizedErrorMessage,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      isEarlyBird: newSignup.is_early_bird,
      signupOrder: newSignup.signup_order,
    });
  } catch (error) {
    apiLogger.error('Unexpected error in email signup', error instanceof Error ? error : new Error(String(error)));
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
