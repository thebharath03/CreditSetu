function ResultScreen({ score, explanation }) {
  if (score === null) return null

  return (
    <section className="result-screen">
      <p className="result-score">{score}/100</p>
      {explanation.length > 0 && (
        <ul className="result-explanation">
          {explanation.map((phrase) => (
            <li key={phrase}>{phrase}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ResultScreen
