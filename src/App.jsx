import { useState } from 'react'
import UploadCapture from './components/UploadCapture'
import './App.css'

function App() {
  const [file, setFile] = useState(null)

  return (
    <div className="app">
      <UploadCapture file={file} onFileSelect={setFile} />

      {/* Phase 3: ProcessingState renders here while OCR runs */}

      {/* Phase 7: ResultScreen renders here with score + explanation */}

      {/* Phase 8: WhatsNextSection renders here */}
    </div>
  )
}

export default App
