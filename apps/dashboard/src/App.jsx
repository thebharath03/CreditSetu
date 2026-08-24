import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import ApplicantQueue from './components/queue/ApplicantQueue'
import './App.css'

function App() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <Header title="Applicant Queue" subtitle="Scored applicants, most recent first" />
        <main className="dashboard-content">
          <ApplicantQueue />
        </main>
      </div>
    </div>
  )
}

export default App
