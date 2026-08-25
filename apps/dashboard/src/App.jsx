import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import ApplicantQueue from './components/queue/ApplicantQueue'
import ApplicantDetail from './components/detail/ApplicantDetail'
import CredentialsView from './components/credentials/CredentialsView'
import './App.css'

function App() {
  const [view, setView] = useState('queue')
  const [selectedApplicantId, setSelectedApplicantId] = useState(null)

  function selectView(nextView) {
    setSelectedApplicantId(null)
    setView(nextView)
  }

  let title = 'Applicant Queue'
  let subtitle = 'Scored applicants, most recent first'
  let content = <ApplicantQueue onSelectApplicant={setSelectedApplicantId} />

  if (selectedApplicantId) {
    title = 'Applicant Detail'
    subtitle = 'Score, explanation, and document history'
    content = (
      <ApplicantDetail
        key={selectedApplicantId}
        applicantId={selectedApplicantId}
        onBack={() => setSelectedApplicantId(null)}
      />
    )
  } else if (view === 'credentials') {
    title = 'Credentials'
    subtitle = 'Issue and verify portable score credentials'
    content = <CredentialsView />
  }

  return (
    <div className="dashboard-shell">
      <Sidebar activeView={view} onSelectView={selectView} />
      <div className="dashboard-main">
        <Header title={title} subtitle={subtitle} />
        <main className="dashboard-content">{content}</main>
      </div>
    </div>
  )
}

export default App
