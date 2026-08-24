import { useEffect, useState } from 'react'
import { scoreApplicant } from '../../lib/scoring'
import ScoreGauge from '../detail/ScoreGauge'

const CONTROLS = [
  { feature: 'avgBillAmount', label: 'Average bill amount', min: 300, max: 12000, step: 50 },
  { feature: 'rentRegularity', label: 'Rent regularity', min: 0, max: 1, step: 0.01 },
  { feature: 'utilityRegularity', label: 'Utility regularity', min: 0, max: 1, step: 0.01 },
  { feature: 'monthsHistory', label: 'Months of history', min: 0, max: 36, step: 1 },
]

function bandFor(value) {
  if (value >= 70) return 'low'
  if (value >= 40) return 'medium'
  return 'high'
}

function formatValue(feature, value) {
  if (feature === 'avgBillAmount') return `₹${Math.round(value).toLocaleString('en-IN')}`
  if (feature === 'monthsHistory') return `${Math.round(value)} mo`
  return value.toFixed(2)
}

function WhatIfSimulator({ baselineFeatures }) {
  const [weights, setWeights] = useState(null)
  const [features, setFeatures] = useState(baselineFeatures)

  useEffect(() => {
    fetch('/weights.json')
      .then((res) => res.json())
      .then(setWeights)
  }, [])

  function handleChange(feature, rawValue) {
    setFeatures((prev) => ({ ...prev, [feature]: Number(rawValue) }))
  }

  const liveScore = weights
    ? Math.round(scoreApplicant(features, weights) * 100)
    : null

  return (
    <section className="detail-card what-if-simulator">
      <h2 className="detail-card-title">What-if simulator</h2>
      <div className="what-if-body">
        <div className="what-if-controls">
          {CONTROLS.map((c) => (
            <label key={c.feature} className="what-if-control">
              <div className="what-if-control-row">
                <span>{c.label}</span>
                <span className="tabular-nums">{formatValue(c.feature, features[c.feature])}</span>
              </div>
              <input
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={features[c.feature]}
                onChange={(e) => handleChange(c.feature, e.target.value)}
              />
            </label>
          ))}
        </div>
        <div className="what-if-gauge">
          {liveScore !== null && <ScoreGauge score={{ value: liveScore, band: bandFor(liveScore) }} />}
        </div>
      </div>
    </section>
  )
}

export default WhatIfSimulator
