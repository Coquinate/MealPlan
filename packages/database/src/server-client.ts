import { createClient } from '@supabase/supabase-js'
import type { Database } from '@coquinate/shared/types/database.types'

/**
 * SERVER-ONLY FILE
 * 
 * This file should ONLY be imported in server-side code.
 * Never import this file in client-side components or pages.
 * 
 * The service role key has full access to bypass RLS policies,
 * so it must be kept strictly on the server side.
 */

// Ensure required environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

/**
 * Create a server-side Supabase client with service role key
 * 
 * WARNING: This client bypasses all Row Level Security policies.
 * Only use this for server-side operations that require admin access.
 * 
 * @example
 * // In a Next.js API route or server component
 * import { createServiceClient } from '@coquinate/database/server'
 * 
 * const supabase = createServiceClient()
 * const { data } = await supabase.from('admin_users').select()
 */
export const createServiceClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseServiceKey) {
    throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY')
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'coquinate-service'
      }
    }
  })
}

// Re-export types for convenience
export type { Database } from '@coquinate/shared/types/database.types'
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]