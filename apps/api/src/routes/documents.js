import { Router } from 'express'
import multer from 'multer'
import { getSupabaseAdmin } from '../lib/supabaseAdmin.js'
import { explainFeatures } from '../services/explainService.js'
import { extractText } from '../services/ocrService.js'
import { parseAvgBillAmount } from '../services/parseFeatures.js'
import { scoreFeatures } from '../services/scoringService.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })
const router = Router()

/**
 * POST /documents — the full capture-to-score pipeline from a single
 * uploaded image: OCR -> feature extraction -> score -> explanation ->
 * writes a new applicant/document/score/explanation_factors record.
 * rentRegularity/utilityRegularity/monthsHistory can't come from OCR of
 * one document (see parseFeatures.js), so they're accepted as optional
 * form fields with defaults, not invented.
 */
router.post('/', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Missing file field "document".' })
    }

    const ocrText = await extractText(req.file.buffer)
    const avgBillAmount = parseAvgBillAmount(ocrText)
    if (avgBillAmount === null) {
      return res.status(422).json({ error: 'Could not find a bill amount in the document.', ocrText })
    }

    const features = {
      avgBillAmount,
      rentRegularity: Number(req.body.rentRegularity ?? 0.5),
      utilityRegularity: Number(req.body.utilityRegularity ?? 0.5),
      monthsHistory: Number(req.body.monthsHistory ?? 6),
    }

    const score = scoreFeatures(features)
    const explanationFactors = explainFeatures(features)

    const applicantId = req.body.applicantId || `app-${Date.now()}`
    const applicantName = req.body.name || 'New applicant'
    const supabase = getSupabaseAdmin()

    const { error: applicantError } = await supabase
      .from('applicants')
      .upsert({ id: applicantId, name: applicantName, features, last_updated_at: score.computedAt })
    if (applicantError) throw applicantError

    const { error: documentError } = await supabase.from('documents').insert({
      id: `doc-${Date.now()}`,
      applicant_id: applicantId,
      type: req.body.documentType || 'unknown',
      label: req.body.documentLabel || req.file.originalname,
      uploaded_at: score.computedAt,
    })
    if (documentError) throw documentError

    const { data: scoreRow, error: scoreError } = await supabase
      .from('scores')
      .insert({ applicant_id: applicantId, value: score.value, band: score.band, computed_at: score.computedAt })
      .select('id')
      .single()
    if (scoreError) throw scoreError

    const { error: factorsError } = await supabase.from('explanation_factors').insert(
      explanationFactors.map((factor, index) => ({
        score_id: scoreRow.id,
        feature: factor.feature,
        label: factor.label,
        impact_direction: factor.impactDirection,
        magnitude: factor.magnitude,
        rank: index + 1,
      }))
    )
    if (factorsError) throw factorsError

    res.status(201).json({ applicantId, features, score, explanationFactors, ocrText })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

export default router
