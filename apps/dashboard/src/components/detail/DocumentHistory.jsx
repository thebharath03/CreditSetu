function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function DocumentHistory({ documents }) {
  if (documents.length === 0) {
    return <p className="document-history-empty">No documents on file for this applicant.</p>
  }

  return (
    <ul className="document-history">
      {documents.map((doc) => (
        <li key={doc.id} className="document-history-item">
          <span className="document-history-label">{doc.label}</span>
          <span className="document-history-date">{formatDate(doc.uploadedAt)}</span>
        </li>
      ))}
    </ul>
  )
}

export default DocumentHistory
