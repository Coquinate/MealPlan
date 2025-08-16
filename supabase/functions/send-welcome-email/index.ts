import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

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
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-function-secret',
      }
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify function secret for security
    const fnSecret = Deno.env.get('WELCOME_EMAIL_FN_SECRET');
    const provided = req.headers.get('x-function-secret');
    
    if (!fnSecret || provided !== fnSecret) {
      console.error('Unauthorized edge function access attempt');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate API key is configured
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const isEarlyBird = body?.isEarlyBird === true;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Prepare email content based on user type
    const subject = isEarlyBird 
      ? '🌟 Bine ai venit în familia Coquinate - Early Bird!'
      : 'Bine ai venit la Coquinate!';

    const htmlContent = isEarlyBird
      ? getEarlyBirdEmailHtml(email)
      : getRegularEmailHtml(email);

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
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
            value: isEarlyBird ? 'early-bird' : 'regular'
          },
          {
            name: 'source',
            value: 'landing-page'
          }
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: data }),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: data.id,
        isEarlyBird 
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    console.error('Error in send-welcome-email function:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: errorMessage 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
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
  <title>Bine ai venit - Early Bird</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; line-height: 1.6; color: #1a1a1a; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #00b4a6 0%, #00d9ca 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: white; padding: 30px; border: 1px solid #e5e5e5; border-radius: 0 0 10px 10px; }
    .badge { display: inline-block; background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%); color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #00b4a6 0%, #00d9ca 100%); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    h1 { margin: 0; font-size: 28px; }
    .benefit { padding: 15px; margin: 10px 0; background: #f8f9fa; border-left: 4px solid #00b4a6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌟 Felicitări! Ești Early Bird!</h1>
      <div class="badge">Primii 500 Utilizatori</div>
    </div>
    
    <div class="content">
      <p>Salut și bine ai venit în familia Coquinate!</p>
      
      <p>Ești printre <strong>primii 500 de utilizatori</strong> care au crezut în viziunea noastră de a transforma modul în care familiile din România planifică și gătesc mâncarea.</p>
      
      <div class="benefit">
        <strong>🎁 Beneficiile tale Early Bird:</strong>
        <ul>
          <li>Acces gratuit pentru primele 3 luni după lansare</li>
          <li>Reducere permanentă de 30% la abonament</li>
          <li>Acces prioritar la funcții noi</li>
          <li>Influență directă asupra dezvoltării platformei</li>
        </ul>
      </div>
      
      <p>În curând vei primi un email cu detalii despre lansarea oficială și cum să îți activezi beneficiile exclusive.</p>
      
      <p>Între timp, ne-ar ajuta enorm dacă ai împărtăși Coquinate cu prietenii și familia ta. Cu cât suntem mai mulți, cu atât putem crea o experiență mai bună pentru toți!</p>
      
      <center>
        <a href="https://coquinate.ro" class="button">Vizitează Site-ul</a>
      </center>
      
      <p>Mulțumim că faci parte din această călătorie!</p>
      
      <p>Cu drag,<br>
      <strong>Echipa Coquinate</strong></p>
    </div>
    
    <div class="footer">
      <p>Ai primit acest email pentru că te-ai înscris pe coquinate.ro</p>
      <p>© 2025 Coquinate. Toate drepturile rezervate.</p>
    </div>
  </div>
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
  <title>Bine ai venit la Coquinate</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; line-height: 1.6; color: #1a1a1a; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #00b4a6 0%, #00d9ca 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: white; padding: 30px; border: 1px solid #e5e5e5; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: linear-gradient(135deg, #00b4a6 0%, #00d9ca 100%); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    h1 { margin: 0; font-size: 28px; }
    .feature { padding: 15px; margin: 10px 0; background: #f8f9fa; border-left: 4px solid #00b4a6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bine ai venit la Coquinate!</h1>
    </div>
    
    <div class="content">
      <p>Salut și mulțumim că te-ai alăturat comunității Coquinate!</p>
      
      <p>Suntem încântați să te avem alături în misiunea noastră de a face planificarea meselor mai simplă și mai plăcută pentru familiile din România.</p>
      
      <div class="feature">
        <strong>Ce urmează:</strong>
        <ul>
          <li>Te vom anunța imediat ce lansăm platforma</li>
          <li>Vei primi sfaturi exclusive despre planificarea meselor</li>
          <li>Acces la rețete și idei de meniuri săptămânale</li>
          <li>Oferte speciale pentru abonații din lista de așteptare</li>
        </ul>
      </div>
      
      <p>Lansarea oficială este foarte aproape! Pregătește-te să spui adio întrebării zilnice "Ce gătim azi?" și să economisești ore prețioase în fiecare săptămână.</p>
      
      <center>
        <a href="https://coquinate.ro" class="button">Vizitează Site-ul</a>
      </center>
      
      <p>Dacă ai întrebări sau sugestii, nu ezita să ne scrii. Feedback-ul tău ne ajută să creăm cea mai bună experiență posibilă!</p>
      
      <p>Cu drag,<br>
      <strong>Echipa Coquinate</strong></p>
    </div>
    
    <div class="footer">
      <p>Ai primit acest email pentru că te-ai înscris pe coquinate.ro</p>
      <p>© 2025 Coquinate. Toate drepturile rezervate.</p>
    </div>
  </div>
</body>
</html>
  `;
}