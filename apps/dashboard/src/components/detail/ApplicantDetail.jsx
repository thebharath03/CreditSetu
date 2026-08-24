import { useEffect, useState } from 'react'
import { getApplicant } from '../../lib/dataSource'
import ScoreGauge from './ScoreGauge'
import ExplanationFactors from './ExplanationFactors'
import DocumentHistory from './DocumentHistory'
import WhatIfSimulator from '../simulator/WhatIfSimulator'

function ApplicantDetail({ applicantId, onBack }) {
  const [applicant, setApplicant] = useState(null)

  useEffect(() => {
    let cancelled = false
    getApplicant(applicantId).then((result) => {
      if (!cancelled) setApplicant(result)
    })
    return () => {
      cancelled = true
    }
  }, [applicantId])

  if (applicant === null) {
    return <p className="queue-state">Loading applicant…</p>
  }

  return (
    <div className="applicant-detail">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back to queue
      </button>

      <div className="applicant-detail-grid">
        <section className="detail-card detail-card-score">
          <h2 className="detail-card-title">{applicant.name}</h2>
          <ScoreGauge score={applicant.score} />
        </section>

        <section className="detail-card">
          <h2 className="detail-card-title">Top contributing factors</h2>
          <ExplanationFactors factors={applicant.explanationFactors} />
        </section>

        <section className="detail-card">
          <h2 className="detail-card-title">Document history</h2>
          <DocumentHistory documents={applicant.documents} />
        </section>

        <WhatIfSimulator baselineFeatures={applicant.features} />
      </div>
    </div>
  )
}

export default ApplicantDetail
