/**
 * Demo-grade credential token — base64-encoded JSON payload plus a simple
 * checksum, not real cryptographic signing. Matches the project's own
 * framing (synthetic/illustrative, not production-grade); a real
 * deployment would sign this server-side with a kept-secret key instead
 * of generating it in the browser.
 */
function checksum(str) {
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(36)
}

export function createCredential({ applicantId, name, score, band }) {
  const issuedAt = new Date().toISOString()
  const encoded = btoa(JSON.stringify({ applicantId, name, score, band, issuedAt }))
  const token = `${encoded}.${checksum(encoded)}`

  return { token, qrPayload: token, issuedAt, verified: false }
}
