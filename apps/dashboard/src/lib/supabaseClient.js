import { createClient } from '@supabase/supabase-js'

let client = null

/**
 * Lazily creates the Supabase client on first use. liveDataSource.js and
 * arrivalTrigger.js are imported unconditionally from dataSource.js even
 * in mock mode (that's what lets VITE_USE_MOCK switch at runtime instead
 * of build time) — so this must not throw at import time, only if a live
 * call actually happens with no credentials configured. The whole point
 * of the mock-swap architecture is that the app runs with zero Supabase
 * project existing at all.
 */
export function getSupabase() {
  if (client) return client

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in apps/dashboard/.env, or run with VITE_USE_MOCK=true.'
    )
  }

  client = createClient(url, anonKey)
  return client
}
