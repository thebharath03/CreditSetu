import { useEffect, useState } from 'react'
import { listApplicants } from '../../lib/dataSource'

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

  useEffect(() => {
    let cancelled = false
    listApplicants().then((result) => {
      if (!cancelled) setApplicants(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

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
            className="applicant-queue-row"
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
