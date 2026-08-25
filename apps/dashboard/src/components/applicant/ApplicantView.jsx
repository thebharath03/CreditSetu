import { useEffect, useState } from 'react'
import { listApplicants } from '../../lib/dataSource'
import ScoreGauge from '../detail/ScoreGauge'
import DocumentHistory from '../detail/DocumentHistory'
import QrCode from '../credentials/QrCode'

const IMPACT_COPY = {
  positive: 'is helping your score',
  negative: 'is hurting your score',
}

/**
 * Mock applicant-facing screen — what the person behind a queue row would
 * see of their own record. Reuses the same dataSource (mock or live) and
 * the same ScoreGauge/DocumentHistory/QrCode components the lender side
 * already uses; this is a different audience for the same data, not a
 * different data source. Shows the top of the queue since there's no
 * applicant-side auth in this demo.
 */
function ApplicantView() {
  const [applicant, setApplicant] = useState(null)

  useEffect(() => {
    let cancelled = false
    listApplicants().then((result) => {
      if (!cancelled) setApplicant(result[0] ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (applicant === null) return <p className="queue-state">Loading your score…</p>

  return (
    <div className="applicant-view">
      <section className="applicant-hero">
        <span className="kicker">Your CreditSetu score</span>
        <ScoreGauge score={applicant.score} />
        <p className="applicant-hero-name">{applicant.name}</p>
      </section>

      <section className="detail-card applicant-explain">
        <h2 className="detail-card-title">Why you got this score</h2>
        <ul className="applicant-explain-list">
          {applicant.explanationFactors.map((f) => (
            <li key={f.feature} className="applicant-explain-item">
              <span className={`applicant-explain-dot applicant-explain-dot-${f.impactDirection}`} />
              <span>
                <strong>{f.label}</strong> {IMPACT_COPY[f.impactDirection]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {applicant.credential && (
        <section className="detail-card applicant-credential">
          <h2 className="detail-card-title">Your portable credential</h2>
          <div className="applicant-credential-body">
            <QrCode value={applicant.credential.qrPayload} size={140} />
            <p className="credential-empty">
              {applicant.credential.verified
                ? 'Verified by a lender — carry this to your next application.'
                : 'Issued. Show this QR to a participating lender to verify it.'}
            </p>
          </div>
        </section>
      )}

      <section className="detail-card">
        <h2 className="detail-card-title">Documents you've shared</h2>
        <DocumentHistory documents={applicant.documents} />
      </section>
    </div>
  )
}

export default ApplicantView
