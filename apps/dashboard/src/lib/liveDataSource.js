/**
 * Live Supabase implementation. Method signatures match mockDataSource.js
 * exactly so dataSource.js can delegate to either one with zero
 * caller-side changes. Table shape follows supabase/schema.sql: scores are
 * a history table (one applicant can have many, oldest to newest), so the
 * "current" score/explanationFactors are the latest row by computed_at.
 */
import { getSupabase } from './supabaseClient'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'

const APPLICANT_SELECT = `
  id,
  name,
  features,
  last_updated_at,
  documents ( id, type, label, uploaded_at ),
  scores ( id, value, band, computed_at, explanation_factors ( feature, label, impact_direction, magnitude, rank ) ),
  credentials ( token, qr_payload, issued_at, verified )
`

function latestBy(rows, dateField) {
  return rows.reduce(
    (latest, row) => (!latest || new Date(row[dateField]) > new Date(latest[dateField]) ? row : latest),
    null
  )
}

function toApplicant(row) {
  const latestScore = latestBy(row.scores, 'computed_at')
  const latestCredential = latestBy(row.credentials, 'issued_at')

  return {
    id: row.id,
    name: row.name,
    features: row.features,
    score: latestScore
      ? { value: Number(latestScore.value), band: latestScore.band, computedAt: latestScore.computed_at }
      : null,
    explanationFactors: latestScore
      ? [...latestScore.explanation_factors]
          .sort((a, b) => a.rank - b.rank)
          .map((f) => ({
            feature: f.feature,
            label: f.label,
            impactDirection: f.impact_direction,
            magnitude: Number(f.magnitude),
          }))
      : [],
    documents: [...row.documents]
      .sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at))
      .map((d) => ({ id: d.id, type: d.type, label: d.label, uploadedAt: d.uploaded_at })),
    credential: latestCredential
      ? {
          token: latestCredential.token,
          qrPayload: latestCredential.qr_payload,
          issuedAt: latestCredential.issued_at,
          verified: latestCredential.verified,
        }
      : null,
    lastUpdatedAt: row.last_updated_at,
  }
}

export async function listApplicants() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('applicants')
    .select(APPLICANT_SELECT)
    .order('last_updated_at', { ascending: false })

  if (error) throw error
  return data.map(toApplicant)
}

export async function getApplicant(id) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('applicants').select(APPLICANT_SELECT).eq('id', id).maybeSingle()

  if (error) throw error
  return data ? toApplicant(data) : null
}

/**
 * Both credential actions go through apps/api now — real JWT signing
 * (issue) and signature validation (verify) only make sense server-side,
 * where the signing secret actually lives. The anon key's scoped
 * insert/update(verified) grant on credentials is no longer used by this
 * app; see supabase/schema.sql.
 */
export async function issueCredential(applicantId) {
  const applicant = await getApplicant(applicantId)
  if (!applicant) return null

  const response = await fetch(`${API_BASE_URL}/credentials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicantId }),
  })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error ?? 'Failed to issue credential.')

  return { ...applicant, credential: body }
}

export async function verifyCredential(applicantId, token) {
  const response = await fetch(`${API_BASE_URL}/credentials/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  const body = await response.json()
  if (!response.ok || !body.valid) throw new Error(body.error ?? 'Failed to verify credential.')

  const applicant = await getApplicant(applicantId)
  return { ...applicant, credential: { ...applicant.credential, verified: true } }
}
