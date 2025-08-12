// Shared authentication utilities for Supabase Edge Functions
// Provides JWT verification, CORS handling, and common auth patterns

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'

/**
 * CORS headers for Edge Functions
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

/**
 * Standard error response format
 */
export interface AuthError {
  error: string
  message: string
  code?: string
}

/**
 * Create authenticated Supabase client from JWT token
 */
export function createAuthenticatedClient(authToken: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  })
  
  return supabase
}

/**
 * Create service role Supabase client for admin operations
 */
export function createServiceClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Extract and verify JWT token from request
 */
export async function verifyAuthToken(request: Request): Promise<{ 
  user: any, 
  token: string 
} | { error: AuthError }> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: {
        error: 'unauthorized',
        message: 'Missing or invalid authorization header'
      }
    }
  }
  
  const token = authHeader.substring(7)
  
  try {
    const supabase = createAuthenticatedClient(token)
    const { data: user, error } = await supabase.auth.getUser(token)
    
    if (error || !user?.user) {
      return {
        error: {
          error: 'invalid_token',
          message: 'Invalid or expired token'
        }
      }
    }
    
    return { user: user.user, token }
  } catch (error) {
    return {
      error: {
        error: 'auth_error',
        message: 'Failed to verify authentication token'
      }
    }
  }
}

/**
 * Verify admin user authentication
 */
export async function verifyAdminAuth(request: Request): Promise<{
  user: any,
  adminUser: any,
  token: string
} | { error: AuthError }> {
  const authResult = await verifyAuthToken(request)
  
  if ('error' in authResult) {
    return authResult
  }
  
  const { user, token } = authResult
  
  // Check if user exists in admin_users table
  const serviceClient = createServiceClient()
  const { data: adminUser, error } = await serviceClient
    .from('admin_users')
    .select('*')
    .eq('email', user.email)
    .single()
  
  if (error || !adminUser) {
    return {
      error: {
        error: 'admin_required',
        message: 'Admin access required'
      }
    }
  }
  
  return { user, adminUser, token }
}

/**
 * Standard error response helper
 */
export function errorResponse(
  error: AuthError, 
  status = 400
): Response {
  return new Response(
    JSON.stringify(error),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

/**
 * Standard success response helper
 */
export function successResponse(data: any, status = 200): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

/**
 * Handle CORS preflight requests
 */
export function handleCors(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }
  return null
}

/**
 * Rate limiting helper (basic implementation)
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 60000
): boolean {
  // In production, this would use Redis or similar
  // For now, this is a placeholder for rate limiting logic
  return true
}

/**
 * Validate request method
 */
export function validateMethod(
  request: Request, 
  allowedMethods: string[]
): AuthError | null {
  if (!allowedMethods.includes(request.method)) {
    return {
      error: 'method_not_allowed',
      message: `Method ${request.method} not allowed`
    }
  }
  return null
}

/**
 * Parse and validate JSON request body
 */
export async function parseJsonBody<T>(request: Request): Promise<T | { error: AuthError }> {
  try {
    const body = await request.json()
    return body as T
  } catch (error) {
    return {
      error: {
        error: 'invalid_json',
        message: 'Invalid JSON in request body'
      }
    }
  }
}