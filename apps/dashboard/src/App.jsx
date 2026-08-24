import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import ApplicantQueue from './components/queue/ApplicantQueue'
import ApplicantDetail from './components/detail/ApplicantDetail'
import './App.css'

function App() {
  const [selectedApplicantId, setSelectedApplicantId] = useState(null)

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        {selectedApplicantId ? (
          <>
            <Header title="Applicant Detail" subtitle="Score, explanation, and document history" />
            <main className="dashboard-content">
              <ApplicantDetail
                key={selectedApplicantId}
                applicantId={selectedApplicantId}
                onBack={() => setSelectedApplicantId(null)}
              />
            </main>
          </>
        ) : (
          <>
            <Header title="Applicant Queue" subtitle="Scored applicants, most recent first" />
            <main className="dashboard-content">
              <ApplicantQueue onSelectApplicant={setSelectedApplicantId} />
            </main>
          </>
        )}
      </div>
    </div>
  )
}

export default App
