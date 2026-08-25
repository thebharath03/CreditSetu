import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { getSupabaseAdmin } from '../lib/supabaseAdmin.js'

const router = Router()

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('Missing JWT_SECRET. Set it in apps/api/.env.')
  }
  return secret
}

/**
 * POST /credentials — looks up an applicant's current score and top
 * factors, issues a signed JWT encoding them, and stores the credential
 * record. Real signing (jsonwebtoken), not the demo-grade
 * base64+checksum token apps/dashboard's mock mode still uses (mock mode
 * has no backend to call, so it keeps its own offline stand-in).
 */
router.post('/', async (req, res) => {
  try {
    const { applicantId } = req.body
    if (!applicantId) {
      return res.status(400).json({ error: 'Missing applicantId.' })
    }

    const supabase = getSupabaseAdmin()

    const { data: applicant, error: applicantError } = await supabase
      .from('applicants')
      .select('id, name')
      .eq('id', applicantId)
      .maybeSingle()
    if (applicantError) throw applicantError
    if (!applicant) return res.status(404).json({ error: 'Applicant not found.' })

    const { data: scoreRow, error: scoreError } = await supabase
      .from('scores')
      .select('id, value, band, computed_at')
      .eq('applicant_id', applicantId)
      .order('computed_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (scoreError) throw scoreError
    if (!scoreRow) return res.status(422).json({ error: 'Applicant has no score yet.' })

    const { data: factorRows, error: factorsError } = await supabase
      .from('explanation_factors')
      .select('feature, label, impact_direction, magnitude')
      .eq('score_id', scoreRow.id)
      .order('rank')
    if (factorsError) throw factorsError

    const payload = {
      applicantId: applicant.id,
      name: applicant.name,
      score: scoreRow.value,
      band: scoreRow.band,
      factors: factorRows.map((f) => ({
        feature: f.feature,
        label: f.label,
        impactDirection: f.impact_direction,
      })),
    }

    const token = jwt.sign(payload, getJwtSecret(), { expiresIn: '30d' })
    const issuedAt = new Date().toISOString()

    const { error: insertError } = await supabase.from('credentials').insert({
      applicant_id: applicant.id,
      score_id: scoreRow.id,
      token,
      qr_payload: token,
      issued_at: issuedAt,
      verified: false,
    })
    if (insertError) throw insertError

    res.status(201).json({ token, qrPayload: token, issuedAt, verified: false })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /credentials/verify — validates a token's signature. Returns the
 * decoded payload if valid; a tampered or expired token is rejected with
 * a clear error, not silently accepted. On success, also marks the
 * matching credential row verified in Supabase (service-role, bypasses
 * RLS — this is the one write apps/dashboard used to do directly from
 * the browser with a scoped anon grant; that grant is no longer needed
 * now that this endpoint exists).
 */
router.post('/verify', async (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ error: 'Missing token.' })

  let payload
  try {
    payload = jwt.verify(token, getJwtSecret())
  } catch {
    return res.status(400).json({ valid: false, error: 'Invalid or tampered token.' })
  }

  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('credentials').update({ verified: true }).eq('token', token)
    if (error) throw error
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }

  res.json({ valid: true, payload })
})

export default router
