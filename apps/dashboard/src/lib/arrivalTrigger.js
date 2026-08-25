import { useEffect } from 'react'
import { useMock } from './dataSource'
import { getSupabase } from './supabaseClient'

/**
 * Fires `onArrival` to simulate a new/updated applicant streaming in.
 * Mock mode: fires on a fixed interval with no argument — the caller
 * synthesizes an update from whatever applicant list it already has.
 * Live mode: subscribes to Supabase realtime on `scores` INSERTs (a new
 * score row covers both a brand-new applicant and a re-scored existing
 * one, since scores is an append-only history table) and fires with the
 * affected applicant's id so the caller can fetch the fresh row.
 */
export function useArrivalTrigger(onArrival, intervalMs = 15000) {
  useEffect(() => {
    if (useMock) {
      const id = setInterval(() => onArrival(), intervalMs)
      return () => clearInterval(id)
    }

    const supabase = getSupabase()
    const channel = supabase
      .channel('scores-arrivals')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scores' }, (payload) => {
        onArrival(payload.new.applicant_id)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [onArrival, intervalMs])
}
