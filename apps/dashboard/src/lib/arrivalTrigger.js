import { useEffect } from 'react'

/**
 * Fires `onArrival` on a fixed interval to simulate a new/updated applicant
 * streaming in. Phase 9 swaps this for a real Supabase realtime subscription
 * — callers only change which trigger hook they call, the visual response
 * (see ApplicantQueue's highlight handling) does not need to change.
 */
export function useMockArrivalTrigger(onArrival, intervalMs = 15000) {
  useEffect(() => {
    const id = setInterval(onArrival, intervalMs)
    return () => clearInterval(id)
  }, [onArrival, intervalMs])
}
