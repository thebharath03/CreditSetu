import { useState } from 'react'
import { issueCredential, verifyCredential } from '../../lib/dataSource'
import QrCode from './QrCode'

function CredentialPanel({ applicant, onChange }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function handleIssue() {
    setBusy(true)
    setError(null)
    try {
      const updated = await issueCredential(applicant.id)
      if (updated) onChange(updated)
    } catch (err) {
      setError(err.message ?? 'Failed to issue credential.')
    } finally {
      setBusy(false)
    }
  }

  async function handleVerify() {
    setBusy(true)
    setError(null)
    try {
      const updated = await verifyCredential(applicant.id, applicant.credential.token)
      if (updated) onChange(updated)
    } catch (err) {
      setError(err.message ?? 'Failed to verify credential.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="detail-card credential-panel">
      <h2 className="detail-card-title">{applicant.name}</h2>

      {error && <p className="credential-error">{error}</p>}

      {!applicant.credential ? (
        <>
          <p className="credential-empty">No credential issued yet.</p>
          <button type="button" className="primary-button" onClick={handleIssue} disabled={busy}>
            {busy ? 'Issuing…' : 'Issue credential'}
          </button>
        </>
      ) : (
        <div className="credential-issued">
          <QrCode value={applicant.credential.qrPayload} />
          <dl className="credential-meta">
            <div>
              <dt>Status</dt>
              <dd>{applicant.credential.verified ? 'Verified' : 'Issued, unverified'}</dd>
            </div>
            <div>
              <dt>Issued</dt>
              <dd>{new Date(applicant.credential.issuedAt).toLocaleString()}</dd>
            </div>
          </dl>
          {!applicant.credential.verified && (
            <button type="button" className="primary-button" onClick={handleVerify} disabled={busy}>
              {busy ? 'Verifying…' : 'Mark verified'}
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export default CredentialPanel
