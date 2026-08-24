function UploadCapture({ file, onFileSelect }) {
  const previewUrl = file ? URL.createObjectURL(file) : null

  function handleChange(event) {
    const selected = event.target.files?.[0] ?? null
    onFileSelect(selected)
  }

  return (
    <section className="upload-capture">
      <h1>CreditSetu</h1>
      <p>Upload a bill or receipt to see your on-device credit score.</p>
      <input type="file" accept="image/*" capture="environment" onChange={handleChange} />
      {previewUrl && (
        <img className="upload-preview" src={previewUrl} alt="Selected document preview" />
      )}
    </section>
  )
}

export default UploadCapture
