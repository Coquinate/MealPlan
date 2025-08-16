import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'welcome@coquinate.ro';

interface EmailRequest {
  email: string;
  isEarlyBird: boolean;
}

/**
 * Edge Function to send welcome email to new signups
 * Differentiates between early bird and regular users
 */
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
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

    // Verify function secret for security
    const fnSecret = Deno.env.get('WELCOME_EMAIL_FN_SECRET');
    const provided = req.headers.get('x-function-secret');

    if (!fnSecret || provided !== fnSecret) {
      console.error('Unauthorized edge function access attempt');
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
    const email = String(body?.email ?? '')
      .trim()
      .toLowerCase();
    const isEarlyBird = body?.isEarlyBird === true;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
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
          'Access-Control-Allow-Origin': '*',
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
      background-color: #2D9596;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      display: inline-block;
    }
    .logo {
      font-family: 'Lexend', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #2D9596;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <center class="wrapper">
    <table class="main" width="100%">
      <!-- Antet cu Logo -->
      <tr>
        <td style="padding: 32px; text-align: center;">
          <a href="https://coquinate.ro" class="logo" style="font-family: 'Lexend', sans-serif; font-size: 24px; font-weight: 700; color: #2D9596; text-decoration: none;">Coquinate</a>
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
          <table width="100%" style="border-spacing: 0; background-color: #F0FAFA; border: 1px solid #B2DFDB; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <tr>
              <td>
                <h2 style="font-family: 'Lexend', sans-serif; font-size: 20px; color: #2D9596; margin: 0 0 12px;">Felicitări! Ai prins oferta!</h2>
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
      background-color: #2D9596;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      display: inline-block;
    }
    .logo {
      font-family: 'Lexend', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #2D9596;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <center class="wrapper">
    <table class="main" width="100%">
      <!-- Antet cu Logo -->
      <tr>
        <td style="padding: 32px; text-align: center;">
          <a href="https://coquinate.ro" class="logo" style="font-family: 'Lexend', sans-serif; font-size: 24px; font-weight: 700; color: #2D9596; text-decoration: none;">Coquinate</a>
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
                <h2 style="font-family: 'Lexend', sans-serif; font-size: 20px; color: #2D9596; margin: 0 0 12px;">Beneficiul tău este garantat!</h2>
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
