import { useState } from 'react'
import UploadCapture from './components/UploadCapture'
import ProcessingState from './components/ProcessingState'
import { extractText } from './lib/ocr'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [ocrText, setOcrText] = useState('')

  async function handleFileSelect(selected) {
    setFile(selected)
    setOcrText('')
    if (!selected) return

    setProcessing(true)
    try {
      const text = await extractText(selected)
      setOcrText(text)
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

      {/* Phase 7: ResultScreen renders here with score + explanation */}

      {/* Phase 8: WhatsNextSection renders here */}
    </div>
  )
}

export default App
