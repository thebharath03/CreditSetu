import { useEffect, useState } from 'react'
import UploadCapture from './components/UploadCapture'
import ProcessingState from './components/ProcessingState'
import { extractText } from './lib/ocr'
import { parseFeatures } from './lib/parseFeatures'
import { scoreApplicant, toDisplayScore } from './lib/scoring'
import { explain } from './lib/explain'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [ocrText, setOcrText] = useState('')
  const [features, setFeatures] = useState(null)
  const [weights, setWeights] = useState(null)
  const [score, setScore] = useState(null)
  const [explanation, setExplanation] = useState([])

  useEffect(() => {
    fetch('/weights.json')
      .then((res) => res.json())
      .then(setWeights)
  }, [])

  async function handleFileSelect(selected) {
    setFile(selected)
    setOcrText('')
    setFeatures(null)
    setScore(null)
    setExplanation([])
    if (!selected) return

    setProcessing(true)
    try {
      const text = await extractText(selected)
      setOcrText(text)
      const parsed = parseFeatures(text)
      setFeatures(parsed)
      if (weights) {
        const probability = scoreApplicant(parsed, weights)
        setScore(toDisplayScore(probability))
        setExplanation(explain(parsed, weights))
      }
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="app">
      <UploadCapture file={file} onFileSelect={handleFileSelect} />

      {processing && <ProcessingState />}

      {/* DEBUG: remove before Phase 7 polish */}
      {ocrText && (
        <pre className="debug-ocr-text">{ocrText}</pre>
      )}
      {score !== null && <p className="debug-score">Score: {score}/100</p>}
      {explanation.length > 0 && (
        <ul className="debug-explanation">
          {explanation.map((phrase) => (
            <li key={phrase}>{phrase}</li>
          ))}
        </ul>
      )}

      {/* Phase 7: ResultScreen renders here with score + explanation */}

      {/* Phase 8: WhatsNextSection renders here */}
    </div>
  )
}

export default App
