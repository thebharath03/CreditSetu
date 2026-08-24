import { useEffect, useState } from 'react'
import UploadCapture from './components/UploadCapture'
import ProcessingState from './components/ProcessingState'
import ResultScreen from './components/ResultScreen'
import { extractText } from './lib/ocr'
import { parseFeatures } from './lib/parseFeatures'
import { scoreApplicant, toDisplayScore } from './lib/scoring'
import { explain } from './lib/explain'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
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
    setScore(null)
    setExplanation([])
    if (!selected) return

    setProcessing(true)
    try {
      const text = await extractText(selected)
      const parsed = parseFeatures(text)
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

      <ResultScreen score={score} explanation={explanation} />

      {/* Phase 8: WhatsNextSection renders here */}
    </div>
  )
}

export default App
