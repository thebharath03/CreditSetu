/**
 * Live Supabase implementation. Method signatures match mockDataSource.js
 * exactly so dataSource.js can delegate to either one with zero
 * caller-side changes. Table shape follows supabase/schema.sql: scores are
 * a history table (one applicant can have many, oldest to newest), so the
 * "current" score/explanationFactors are the latest row by computed_at.
 */
import { supabase } from './supabaseClient'
import { createCredential } from './credential'

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
  const { data, error } = await supabase
    .from('applicants')
    .select(APPLICANT_SELECT)
    .order('last_updated_at', { ascending: false })

  if (error) throw error
  return data.map(toApplicant)
}

export async function getApplicant(id) {
  const { data, error } = await supabase.from('applicants').select(APPLICANT_SELECT).eq('id', id).maybeSingle()

  if (error) throw error
  return data ? toApplicant(data) : null
}

export async function issueCredential(applicantId) {
  const applicant = await getApplicant(applicantId)
  if (!applicant) return null

  const { data: scoreRow, error: scoreError } = await supabase
    .from('scores')
    .select('id')
    .eq('applicant_id', applicantId)
    .order('computed_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (scoreError) throw scoreError
  if (!scoreRow) return null

  const credential = createCredential({
    applicantId: applicant.id,
    name: applicant.name,
    score: applicant.score.value,
    band: applicant.score.band,
  })

  const { error } = await supabase.from('credentials').insert({
    applicant_id: applicantId,
    score_id: scoreRow.id,
    token: credential.token,
    qr_payload: credential.qrPayload,
    issued_at: credential.issuedAt,
    verified: credential.verified,
  })
  if (error) throw error

  return { ...applicant, credential }
}

export async function verifyCredential(applicantId, token) {
  const { data, error } = await supabase
    .from('credentials')
    .update({ verified: true })
    .eq('token', token)
    .select('token, qr_payload, issued_at, verified')
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  const applicant = await getApplicant(applicantId)
  return {
    ...applicant,
    credential: {
      token: data.token,
      qrPayload: data.qr_payload,
      issuedAt: data.issued_at,
      verified: data.verified,
    },
  }
}
