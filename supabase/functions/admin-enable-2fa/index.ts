import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import * as crypto from 'https://deno.land/std@0.168.0/crypto/mod.ts';

interface Enable2FARequest {
  secret: string;
}

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

    // Parse request body
    const { secret }: Enable2FARequest = await req.json();

    if (!secret) {
      return new Response(JSON.stringify({ error: 'Missing 2FA secret' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate secret format (base32)
    const base32Regex = /^[A-Z2-7]+=*$/;
    if (!base32Regex.test(secret) || secret.length < 16) {
      return new Response(JSON.stringify({ error: 'Invalid secret format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get or create admin user
    const { data: existingAdmin } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let adminUserId: string;

    if (existingAdmin) {
      adminUserId = existingAdmin.id;

      // Update existing admin user
      const { error: updateError } = await supabaseAdmin
        .from('admin_users')
        .update({
          two_factor_enabled: true,
          two_factor_secret: secret,
          last_login: new Date().toISOString(),
        })
        .eq('id', adminUserId);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Create new admin user with 2FA
      const { data: newAdmin, error: createError } = await supabaseAdmin
        .from('admin_users')
        .insert({
          user_id: user.id,
          role: 'operator', // Default role
          two_factor_enabled: true,
          two_factor_secret: secret,
          permissions: {},
          last_login: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (createError || !newAdmin) {
        throw createError || new Error('Failed to create admin user');
      }

      adminUserId = newAdmin.id;
    }

    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        message: '2FA enabled successfully',
        adminUserId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Enable 2FA error:', error);
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
