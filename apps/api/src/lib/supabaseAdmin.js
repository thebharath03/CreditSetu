import { createClient } from '@supabase/supabase-js'

let client = null

/**
 * Server-side Supabase client using the service-role key — bypasses RLS,
 * so this must never be imported by anything shipped to a browser.
 * Lazily created on first use (same reasoning as apps/dashboard's
 * supabaseClient.js): importing this module must not throw just because
 * a route file references it — only an actual call without credentials
 * configured should fail, and loudly.
 */
export function getSupabaseAdmin() {
  if (client) return client

  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in apps/api/.env.')
  }

  client = createClient(url, serviceRoleKey)
  return client
}
