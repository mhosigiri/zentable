import { createClient } from '@supabase/supabase-js'
import { Database } from '../supabase'

/**
 * Service role client for server-side operations
 * This bypasses RLS policies and should only be used in API routes
 * NEVER expose this client to the frontend
 */
export function createServiceClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}