import { useEffect, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import ApplicantQueue from './components/queue/ApplicantQueue'
import ApplicantDetail from './components/detail/ApplicantDetail'
import CredentialsView from './components/credentials/CredentialsView'
import LoginScreen from './components/auth/LoginScreen'
import { useMock } from './lib/dataSource'
import { getSupabase } from './lib/supabaseClient'
import './App.css'

function App() {
  const [view, setView] = useState('queue')
  const [selectedApplicantId, setSelectedApplicantId] = useState(null)
  // Auth only applies in live mode — mock mode has no backend to protect,
  // and must keep working with zero Supabase project configured at all.
  const [session, setSession] = useState(useMock ? 'mock' : undefined)

  useEffect(() => {
    if (useMock) return
    const supabase = getSupabase()
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  function selectView(nextView) {
    setSelectedApplicantId(null)
    setView(nextView)
  }

  if (session === undefined) return null
  if (!session) return <LoginScreen />

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
