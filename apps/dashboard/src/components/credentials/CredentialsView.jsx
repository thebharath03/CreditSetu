import { useEffect, useState } from 'react'
import { listApplicants } from '../../lib/dataSource'
import CredentialPanel from './CredentialPanel'

function credentialStatus(applicant) {
  if (!applicant.credential) return 'Not issued'
  return applicant.credential.verified ? 'Verified' : 'Issued'
}

function CredentialsView() {
  const [applicants, setApplicants] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    let cancelled = false
    listApplicants().then((result) => {
      if (cancelled) return
      setApplicants(result)
      setSelectedId((current) => current ?? result[0]?.id ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [])

  function handleChange(updated) {
    setApplicants((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }

  if (applicants === null) return <p className="queue-state">Loading applicants…</p>
  if (applicants.length === 0) return <p className="queue-state">No applicants yet.</p>

  const selected = applicants.find((a) => a.id === selectedId) ?? null

  return (
    <div className="credentials-grid">
      <table className="applicant-queue credential-list">
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Risk band</th>
            <th>Credential</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => (
            <tr
              key={applicant.id}
              className={`applicant-queue-row${applicant.id === selectedId ? ' selected' : ''}`}
              tabIndex={0}
              onClick={() => setSelectedId(applicant.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSelectedId(applicant.id)
              }}
            >
              <td>{applicant.name}</td>
              <td>
                <span className={`risk-pill risk-pill-${applicant.score.band}`}>{applicant.score.band}</span>
              </td>
              <td>{credentialStatus(applicant)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && <CredentialPanel applicant={selected} onChange={handleChange} />}
    </div>
  )
}

export default CredentialsView
