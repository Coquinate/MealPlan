import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ALLOWED_ORIGINS = Deno.env.get('ALLOWED_ORIGINS')?.split(',') || ['https://coquinate.com'];

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

interface ConfirmationEmailRequest {
  email: string;
  confirmationToken: string;
}

/**
 * Edge Function to send email confirmation email for double opt-in
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
    // Read the current secret at request time to avoid stale values after secret rotations
    const provided = req.headers.get('x-function-secret');
    const CONFIRMATION_EMAIL_FN_SECRET = Deno.env.get('CONFIRMATION_EMAIL_FN_SECRET');

    if (!CONFIRMATION_EMAIL_FN_SECRET || !provided || !timingSafeEqual(provided, CONFIRMATION_EMAIL_FN_SECRET)) {
      console.error('Unauthorized confirmation email function access attempt', {
        hasEnvSecret: !!CONFIRMATION_EMAIL_FN_SECRET,
        providedHeader: !!provided,
        timestamp: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate API key is configured
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // (removed noisy debug logging)

    // Parse and validate request body
    const body = await req.json();
    
    // Secure type checking for email to prevent object injection
    if (typeof body?.email !== 'string' || typeof body?.confirmationToken !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid request format - email and confirmationToken must be strings' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const email = body.email.trim().toLowerCase();
    const confirmationToken = body.confirmationToken.trim();

    // Basic email validation (detailed validation happens in main API)
    if (!email || email.length < 3 || email.length > 254 || !email.includes('@') || !email.includes('.')) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate confirmation token format (should be crypto-secure)
    if (!confirmationToken || confirmationToken.length < 32) {
      return new Response(JSON.stringify({ error: 'Invalid confirmation token' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create confirmation URL - support both domains
    const baseUrl = origin && ALLOWED_ORIGINS.includes(origin) ? origin : 'https://coquinate.com';
    const confirmationUrl = `${baseUrl}/api/confirm-email/${confirmationToken}`;

    // Prepare email content
    const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'notify@coquinate.com';
    const subject = 'Confirmați adresa pentru notificări Coquinate';
    const htmlContent = getConfirmationEmailHtml(email, confirmationUrl);

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Coquinate <${RESEND_FROM_EMAIL}>`,
        to: [email],
        reply_to: 'contact@coquinate.com',
        subject,
        html: htmlContent,
        tags: [
          {
            name: 'type',
            value: 'email-confirmation',
          },
          {
            name: 'source',
            value: 'double-opt-in',
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return new Response(JSON.stringify({ error: 'Failed to send confirmation email', details: data }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageId: data.id,
        email: email,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
        },
      }
    );
  } catch (error) {
    console.error('Error in send-confirmation-email function:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
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
 * Generate HTML email content for email confirmation
 */
function getConfirmationEmailHtml(email: string, confirmationUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmați adresa pentru notificări Coquinate</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@700&family=Inter:wght@400;600&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #FBF9F7;
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #737373;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #FBF9F7;
      padding-bottom: 60px;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-family: 'Inter', sans-serif;
      color: #333333;
    }
    .button {
      background-color: #2AA6A0;
      color: #ffffff;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 600;
      display: inline-block;
      font-size: 16px;
      text-align: center;
    }
    .logo-container {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }
    .logo-text {
      font-family: 'Lexend', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #2AA6A0;
    }
    .logo-text .q {
      color: #FF6B6B;
    }
  </style>
</head>
<body>
  <center class="wrapper">
    <table class="main" width="100%">
      <!-- Antet cu Logo -->
      <tr>
        <td style="padding: 32px; text-align: center;">
          <a href="https://coquinate.ro" class="logo-container" style="display: inline-flex; align-items: center; gap: 12px; text-decoration: none;">
            <!-- Logo SVG C-shape -->
            <svg width="32" height="32" viewBox="0 0 64 64" style="flex-shrink: 0;">
              <g>
                <!-- C-shape din puncte colorate -->
                <circle cx="32" cy="10" r="4" fill="#FF5555"/>
                <circle cx="48" cy="16" r="4" fill="#1A9690"/>
                <circle cx="48" cy="48" r="4" fill="#FF9999"/>
                <circle cx="32" cy="54" r="4" fill="#3DA69C"/>
                <circle cx="16" cy="48" r="4" fill="#FFB5B5"/>
                <circle cx="16" cy="16" r="4" fill="#6DBBB4"/>
                <!-- Bula în gaura din stânga -->
                <circle cx="10" cy="32" r="3" fill="#FF6666"/>
                <!-- Punct central dublu -->
                <circle cx="32" cy="32" r="3" fill="#FF7777"/>
                <circle cx="32" cy="32" r="2" fill="white"/>
              </g>
            </svg>
            <span class="logo-text">Co<span class="q">q</span>uinate</span>
          </a>
        </td>
      </tr>

      <!-- Continut Principal -->
      <tr>
        <td style="padding: 0 32px 32px;">
          <h1 style="font-family: 'Lexend', sans-serif; font-size: 28px; font-weight: 700; line-height: 1.2; color: #333333; margin-bottom: 24px;">Confirmați adresa de email</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #737373; margin-bottom: 24px;">Salut,</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #737373; margin-bottom: 32px;">
            Pentru a vă proteja adresa de email și a respecta reglementările GDPR, vă rugăm să confirmați că doriți să primiți notificări de la Coquinate.
          </p>

          <!-- CTA Button -->
          <table width="100%" style="border-spacing: 0; text-align: center; margin-bottom: 32px;">
            <tr>
              <td>
                <a href="${confirmationUrl}" class="button" style="background-color: #2AA6A0; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Confirm adresa de email
                </a>
              </td>
            </tr>
          </table>

          <p style="font-size: 16px; line-height: 1.6; color: #737373; margin-bottom: 24px;">
            Dacă butonul de mai sus nu funcționează, copiați și lipiți următorul link în browser:
          </p>

          <p style="font-size: 14px; line-height: 1.4; color: #2AA6A0; word-break: break-all; background-color: #F0FAFA; padding: 12px; border-radius: 6px; margin-bottom: 32px;">
            ${confirmationUrl}
          </p>

          <p style="font-size: 14px; line-height: 1.5; color: #A0AEC0; margin-bottom: 0;">
            <strong>Importante:</strong> Acest link va expira în 24 de ore din motive de securitate. Dacă nu ați solicitat acest email, îl puteți ignora cu încredere.
          </p>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 32px; text-align: center; background-color: #FBF9F7;">
          <p style="font-size: 12px; color: #A0AEC0; margin: 0;">
            © 2025 Coquinate. Dezvoltat cu pasiune pentru familiile din România.
          </p>
          <p style="font-size: 12px; color: #A0AEC0; margin-top: 8px;">
            Ați primit acest email pentru confirmarea adresei de email înregistrate pe site-ul nostru.
          </p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `;
}
