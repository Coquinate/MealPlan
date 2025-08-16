import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as speakeasy from 'https://esm.sh/speakeasy@2.0.0';
import QRCode from 'https://esm.sh/qrcode@1.5.4';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user already has 2FA enabled
    const { data: existingAdmin } = await supabaseAdmin
      .from('admin_users')
      .select('two_factor_enabled')
      .eq('user_id', user.id)
      .single();

    if (existingAdmin?.two_factor_enabled) {
      return new Response(JSON.stringify({ error: '2FA is already enabled for this user' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate 2FA secret
    const secretObj = speakeasy.generateSecret({
      name: `Coquinate Admin (${user.id})`,
      issuer: 'Coquinate',
      length: 32,
    });

    if (!secretObj.base32 || !secretObj.otpauth_url) {
      throw new Error('Failed to generate 2FA secret');
    }

    // Generate QR code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(secretObj.otpauth_url, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 256,
    });

    // Return the setup data
    return new Response(
      JSON.stringify({
        success: true,
        secret: secretObj.base32,
        qrCodeDataUrl,
        manualEntryKey: secretObj.base32,
        issuer: 'Coquinate',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Generate 2FA setup error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
