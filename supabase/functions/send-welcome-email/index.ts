import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'notify@coquinate.com';
const WELCOME_EMAIL_FN_SECRET = Deno.env.get('WELCOME_EMAIL_FN_SECRET');
const ALLOWED_ORIGINS = Deno.env.get('ALLOWED_ORIGINS')?.split(',') || ['https://coquinate.ro', 'https://coquinate.com'];

/**
 * Constant-time string comparison to prevent timing attacks
 * Compares two strings character by character, always taking the same time
 * regardless of where differences occur
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

interface EmailRequest {
  email: string;
  isEarlyBird: boolean;
}

/**
 * Edge Function to send welcome email to new signups
 * Differentiates between early bird and regular users
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

    if (!WELCOME_EMAIL_FN_SECRET || !provided || !timingSafeEqual(provided, WELCOME_EMAIL_FN_SECRET)) {
      console.error('Unauthorized edge function access attempt', {
        hasEnvSecret: !!WELCOME_EMAIL_FN_SECRET,
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

    // Parse and validate request body
    const body = await req.json();
    
    // Secure type checking for email to prevent object injection
    if (typeof body?.email !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid email format - must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const email = body.email.trim().toLowerCase();
    const isEarlyBird = body?.isEarlyBird === true;

    // Basic email validation (detailed validation happens in main API)
    // Avoid ReDoS vulnerability by using simple checks instead of complex regex
    if (!email || email.length < 3 || email.length > 254 || !email.includes('@') || !email.includes('.')) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Prepare email content based on user type
    const subject = isEarlyBird
      ? '🌟 Bine ai venit în familia Coquinate - Early Bird!'
      : 'Bine ai venit la Coquinate!';

    const htmlContent = isEarlyBird ? getEarlyBirdEmailHtml(email) : getRegularEmailHtml(email);

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
        reply_to: 'contact@coquinate.com', // Unde pot răspunde utilizatorii
        subject,
        html: htmlContent,
        tags: [
          {
            name: 'type',
            value: isEarlyBird ? 'early-bird' : 'regular',
          },
          {
            name: 'source',
            value: 'landing-page',
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: data }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageId: data.id,
        isEarlyBird,
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
    console.error('Error in send-welcome-email function:', error);
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
 * Generate HTML email content for early bird users
 */
function getEarlyBirdEmailHtml(email: string): string {
  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmare Înscriere Coquinate</title>
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
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      display: inline-block;
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
          <h1 style="font-family: 'Lexend', sans-serif; font-size: 28px; font-weight: 700; line-height: 1.2; color: #333333; margin-bottom: 24px;">Confirmare înscriere!</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #737373; margin-bottom: 24px;">Salut,</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #737373; margin-bottom: 24px;">
            Mulțumim că te-ai alăturat listei de așteptare Coquinate! Ești cu un pas mai aproape de a spune adio întrebării „Ce mâncăm azi?".
          </p>

          <!-- Oferta Early Bird -->
          <table width="100%" style="border-spacing: 0; background-color: #F0FAFA; border: 1px solid #80CBC4; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <tr>
              <td>
                <h2 style="font-family: 'Lexend', sans-serif; font-size: 20px; color: #2AA6A0; margin: 0 0 12px;">Felicitări! Ai prins oferta!</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #737373; margin: 0;">
                  Ești unul dintre primii 500 de membri și vei primi <strong>o lună de acces complet gratuit</strong> la lansare.
                </p>
              </td>
            </tr>
          </table>

          <p style="font-size: 16px; line-height: 1.6; color: #737373; margin-bottom: 24px;">
            Vom reveni cu noutăți pe măsură ce ne apropiem de lansare. Stai pe aproape!
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
            Ai primit acest e-mail pentru că te-ai înscris pe lista de așteptare pe site-ul nostru.
          </p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `;
}

/**
 * Generate HTML email content for regular users
 */
function getRegularEmailHtml(email: string): string {
  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmare Înscriere Coquinate</title>
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
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      display: inline-block;
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
          <h1 style="font-family: 'Lexend', sans-serif; font-size: 28px; font-weight: 700; line-height: 1.2; color: #333333; margin-bottom: 24px;">Confirmare înscriere!</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #737373; margin-bottom: 24px;">Salut,</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #737373; margin-bottom: 24px;">
            Mulțumim că te-ai alăturat listei de așteptare Coquinate! Ești cu un pas mai aproape de a spune adio întrebării „Ce mâncăm azi?".
          </p>

          <!-- Oferta Regular -->
          <table width="100%" style="border-spacing: 0; background-color: #FBF9F7; border: 1px solid #E5E7EB; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <tr>
              <td>
                <h2 style="font-family: 'Lexend', sans-serif; font-size: 20px; color: #2AA6A0; margin: 0 0 12px;">Beneficiul tău este garantat!</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #737373; margin: 0;">
                  Pentru că te-ai înscris pe lista de așteptare, vei primi <strong>un trial extins, de la 3 la 7 zile</strong>, plus acces prioritar la lansare.
                </p>
              </td>
            </tr>
          </table>

          <p style="font-size: 16px; line-height: 1.6; color: #737373; margin-bottom: 24px;">
            Vom reveni cu noutăți pe măsură ce ne apropiem de lansare. Stai pe aproape!
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
            Ai primit acest e-mail pentru că te-ai înscris pe lista de așteptare pe site-ul nostru.
          </p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `;
}