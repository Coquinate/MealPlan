import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CLEANUP_SECRET = Deno.env.get('CLEANUP_SECRET') || 'development-secret';
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

/**
 * Edge Function to cleanup unconfirmed email signups after 7 days
 * This function should be called by a cron job or scheduled task
 */
serve(async (req) => {
  // Handle CORS
  const origin = req.headers.get('origin');
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin || '') ? origin : ALLOWED_ORIGINS[0];
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cleanup-secret',
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

    // Verify cleanup secret for security
    const provided = req.headers.get('x-cleanup-secret');
    
    if (!provided || !timingSafeEqual(provided, CLEANUP_SECRET)) {
      console.error('Unauthorized cleanup function access attempt', {
        hasEnvSecret: !!CLEANUP_SECRET,
        providedHeader: !!provided,
        timestamp: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with service role for full access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Calculate cutoff date (7 days ago)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoffDate = sevenDaysAgo.toISOString();

    console.log('Starting cleanup for unconfirmed emails', {
      cutoffDate,
      timestamp: new Date().toISOString(),
    });

    // Find unconfirmed email signups older than 7 days
    const { data: unconfirmedSignups, error: selectError } = await supabase
      .from('email_signups')
      .select('id, email, created_at')
      .eq('confirmed', false)
      .lt('created_at', cutoffDate);

    if (selectError) {
      console.error('Error selecting unconfirmed signups:', selectError);
      return new Response(JSON.stringify({ 
        error: 'Failed to query unconfirmed signups',
        details: selectError.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!unconfirmedSignups || unconfirmedSignups.length === 0) {
      console.log('No unconfirmed signups found to cleanup', {
        cutoffDate,
        timestamp: new Date().toISOString(),
      });
      
      return new Response(JSON.stringify({
        success: true,
        message: 'No unconfirmed signups to cleanup',
        deletedCount: 0,
        cutoffDate,
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
        },
      });
    }

    // Log what will be cleaned up (without PII)
    console.log('Found unconfirmed signups for cleanup', {
      count: unconfirmedSignups.length,
      cutoffDate,
      oldestSignup: unconfirmedSignups[0]?.created_at,
      timestamp: new Date().toISOString(),
    });

    // Delete associated email confirmations first (due to foreign key constraint)
    const signupIds = unconfirmedSignups.map(signup => signup.id);
    
    const { error: deleteConfirmationsError } = await supabase
      .from('email_confirmations')
      .delete()
      .in('email_signup_id', signupIds);

    if (deleteConfirmationsError) {
      console.error('Error deleting email confirmations:', deleteConfirmationsError);
      return new Response(JSON.stringify({
        error: 'Failed to delete email confirmations',
        details: deleteConfirmationsError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete the unconfirmed email signups
    const { error: deleteSignupsError } = await supabase
      .from('email_signups')
      .delete()
      .eq('confirmed', false)
      .lt('created_at', cutoffDate);

    if (deleteSignupsError) {
      console.error('Error deleting unconfirmed signups:', deleteSignupsError);
      return new Response(JSON.stringify({
        error: 'Failed to delete unconfirmed signups',
        details: deleteSignupsError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Log successful cleanup
    console.log('Successfully cleaned up unconfirmed email signups', {
      deletedCount: unconfirmedSignups.length,
      cutoffDate,
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Cleanup completed successfully',
      deletedCount: unconfirmedSignups.length,
      cutoffDate,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
      },
    });

  } catch (error) {
    console.error('Unexpected error in cleanup function:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error during cleanup',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});