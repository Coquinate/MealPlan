import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const VALIDATE_DOMAIN_SECRET = Deno.env.get('VALIDATE_DOMAIN_SECRET');
const ALLOWED_ORIGINS = Deno.env.get('ALLOWED_ORIGINS')?.split(',') || ['https://coquinate.ro', 'https://coquinate.com'];

/**
 * Constant-time string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

interface DomainValidationRequest {
  domain: string;
}

interface DomainValidationResponse {
  isValid: boolean;
  hasMXRecord: boolean;
  hasARecord: boolean;
  cacheExpiresAt: number;
  error?: string;
}

/**
 * Edge Function to validate email domains via DNS/MX records
 * 
 * Implements industry best practice for email domain validation:
 * - Checks for MX records (preferred)
 * - Falls back to A records if no MX records exist
 * - Used by major platforms like Stripe, Gmail, Mailchimp
 * - Prevents false positives on legitimate custom domains
 */
serve(async (req) => {
  // Handle CORS with origin validation
  const origin = req.headers.get('origin');
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin || '') ? origin : ALLOWED_ORIGINS[0];
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers':
          'authorization, x-client-info, apikey, content-type, x-function-secret',
      },
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify function secret for security using constant-time comparison
    const provided = req.headers.get('x-function-secret');

    if (!VALIDATE_DOMAIN_SECRET || !provided || !timingSafeEqual(provided, VALIDATE_DOMAIN_SECRET)) {
      console.error('Unauthorized domain validation access attempt', {
        hasEnvSecret: !!VALIDATE_DOMAIN_SECRET,
        providedHeader: !!provided,
        timestamp: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse and validate request body
    const body = await req.json();
    
    // Secure type checking
    if (typeof body?.domain !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid domain format - must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const domain = body.domain.trim().toLowerCase();

    // Basic domain validation
    if (!domain || domain.length === 0) {
      return new Response(JSON.stringify({ 
        isValid: false, 
        hasMXRecord: false, 
        hasARecord: false,
        cacheExpiresAt: 0,
        error: 'Domain is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Domain format validation
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(domain) || domain.length > 253) {
      return new Response(JSON.stringify({ 
        isValid: false, 
        hasMXRecord: false, 
        hasARecord: false,
        cacheExpiresAt: 0,
        error: 'Invalid domain format' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Perform DNS validation
    const validation = await validateDomainDNS(domain);

    return new Response(
      JSON.stringify(validation),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
          // Cache DNS results for 24 hours to improve performance
          'Cache-Control': 'public, max-age=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error in validate-email-domain function:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        isValid: false,
        hasMXRecord: false,
        hasARecord: false,
        cacheExpiresAt: 0,
        error: 'Internal server error',
        message: errorMessage,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Validate domain using DNS lookups (MX and A records)
 * 
 * Industry standard approach:
 * 1. First check for MX records (mail exchange)
 * 2. If no MX records, check for A records (domain exists)
 * 3. Cache results for 24-48 hours to improve performance
 */
async function validateDomainDNS(domain: string): Promise<DomainValidationResponse> {
  const cacheExpiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
  
  try {
    // Use Google's DNS over HTTPS API for reliable DNS lookups
    // This is production-ready and used by many major platforms
    const dnsApiUrl = 'https://dns.google/resolve';
    
    // Check MX records first (preferred for email validation)
    const mxResponse = await fetch(`${dnsApiUrl}?name=${domain}&type=MX`);
    const mxData = await mxResponse.json();
    
    const hasMXRecord = mxData.Status === 0 && mxData.Answer && mxData.Answer.length > 0;
    
    // If MX records exist, domain is valid for email
    if (hasMXRecord) {
      return {
        isValid: true,
        hasMXRecord: true,
        hasARecord: false, // We don't need to check A records if MX exists
        cacheExpiresAt,
      };
    }
    
    // If no MX records, check A records as fallback
    const aResponse = await fetch(`${dnsApiUrl}?name=${domain}&type=A`);
    const aData = await aResponse.json();
    
    const hasARecord = aData.Status === 0 && aData.Answer && aData.Answer.length > 0;
    
    // Domain is valid if it has either MX or A records
    const isValid = hasMXRecord || hasARecord;
    
    return {
      isValid,
      hasMXRecord,
      hasARecord,
      cacheExpiresAt,
    };
    
  } catch (error) {
    console.error('DNS validation error:', error);
    
    // In case of DNS lookup failure, we default to accepting the domain
    // This prevents legitimate domains from being rejected due to temporary DNS issues
    // Most email services follow this pattern for resilience
    return {
      isValid: true, // Default to valid on DNS lookup errors
      hasMXRecord: false,
      hasARecord: false,
      cacheExpiresAt,
      error: `DNS lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}