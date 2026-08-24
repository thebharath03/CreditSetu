function ExplanationFactors({ factors }) {
  if (factors.length === 0) {
    return <p className="explanation-empty">No contributing factors recorded for this applicant.</p>
  }

  return (
    <ul className="explanation-factors">
      {factors.map((f) => (
        <li key={f.feature} className="explanation-factor">
          <div className="explanation-factor-row">
            <span className="explanation-factor-label">{f.label}</span>
            <span className={`explanation-factor-direction explanation-factor-${f.impactDirection}`}>
              {f.impactDirection === 'positive' ? 'Helps score' : 'Hurts score'}
            </span>
          </div>
          <div className="explanation-factor-track">
            <div
              className={`explanation-factor-bar explanation-factor-bar-${f.impactDirection}`}
              style={{ width: `${Math.round(f.magnitude * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ExplanationFactors
