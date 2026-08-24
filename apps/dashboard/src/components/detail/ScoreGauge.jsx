import { useEffect, useRef, useState } from 'react'

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const BAND_LABEL = { low: 'Low risk', medium: 'Medium risk', high: 'High risk' }
const BAND_COLOR_VAR = {
  low: '--color-risk-low',
  medium: '--color-risk-medium',
  high: '--color-risk-high',
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

function ScoreGauge({ score }) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const frameRef = useRef(null)
  const fromRef = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 500
    const from = fromRef.current
    const target = score.value
    let current = from

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      current = from + (target - from) * eased
      setAnimatedValue(current)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frameRef.current)
      fromRef.current = current
    }
  }, [score.value])

  const offset = CIRCUMFERENCE * (1 - animatedValue / 100)
  const colorVar = BAND_COLOR_VAR[score.band]

  return (
    <div className="score-gauge">
      <div className="score-gauge-visual">
        <svg viewBox="0 0 120 120" width="160" height="160">
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--color-border)" strokeWidth="12" />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke={`var(${colorVar})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="score-gauge-label">
          <span className="score-gauge-value tabular-nums">{Math.round(animatedValue)}</span>
          <span className="score-gauge-max">/100</span>
        </div>
      </div>
      <span className={`risk-pill risk-pill-${score.band}`}>{BAND_LABEL[score.band]}</span>
    </div>
  )
}

export default ScoreGauge
