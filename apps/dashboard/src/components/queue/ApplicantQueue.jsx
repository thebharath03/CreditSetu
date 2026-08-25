import { useEffect, useRef, useState } from 'react'
import { getApplicant, listApplicants } from '../../lib/dataSource'
import { useArrivalTrigger } from '../../lib/arrivalTrigger'

const BAND_LABEL = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
}

function formatRelativeTime(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const diffMinutes = Math.round(diffMs / 60000)
  if (diffMinutes < 60) return `${Math.max(diffMinutes, 0)}m ago`
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.round(diffHours / 24)
  return `${diffDays}d ago`
}

function RiskBandPill({ band }) {
  return <span className={`risk-pill risk-pill-${band}`}>{BAND_LABEL[band]}</span>
}

function QueueLoadingState() {
  return (
    <div className="queue-state">
      <p>Loading applicant queue…</p>
    </div>
  )
}

function QueueEmptyState() {
  return (
    <div className="queue-state">
      <p>No applicants yet. Scored applicants will appear here.</p>
    </div>
  )
}

function ApplicantQueue({ onSelectApplicant }) {
  const [applicants, setApplicants] = useState(null)
  const [highlightedId, setHighlightedId] = useState(null)
  const applicantsRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    listApplicants().then((result) => {
      if (!cancelled) setApplicants(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    applicantsRef.current = applicants
  }, [applicants])

  function showArrival(updated, current) {
    setApplicants([updated, ...current.filter((a) => a.id !== updated.id)])
    setHighlightedId(updated.id)
    setTimeout(() => setHighlightedId(null), 2000)
  }

  useArrivalTrigger((applicantId) => {
    const current = applicantsRef.current
    if (!current) return

    if (applicantId) {
      // Live mode: a new score row landed for this applicant — fetch the fresh row.
      getApplicant(applicantId).then((updated) => {
        if (updated) showArrival(updated, applicantsRef.current ?? current)
      })
      return
    }

    // Mock mode: synthesize an update on a random existing applicant.
    if (current.length === 0) return
    const idx = Math.floor(Math.random() * current.length)
    showArrival({ ...current[idx], lastUpdatedAt: new Date().toISOString() }, current)
  }, 15000)

  if (applicants === null) return <QueueLoadingState />
  if (applicants.length === 0) return <QueueEmptyState />

  return (
    <table className="applicant-queue">
      <thead>
        <tr>
          <th>Applicant</th>
          <th>Score</th>
          <th>Risk band</th>
          <th>Last updated</th>
        </tr>
      </thead>
      <tbody>
        {applicants.map((applicant) => (
          <tr
            key={applicant.id}
            className={`applicant-queue-row${applicant.id === highlightedId ? ' arrival-highlight' : ''}`}
            tabIndex={0}
            onClick={() => onSelectApplicant(applicant.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSelectApplicant(applicant.id)
            }}
          >
            <td>{applicant.name}</td>
            <td className="tabular-nums">{applicant.score.value}</td>
            <td>
              <RiskBandPill band={applicant.score.band} />
            </td>
            <td className="queue-updated">{formatRelativeTime(applicant.lastUpdatedAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ApplicantQueue
