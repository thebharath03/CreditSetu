import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const WEIGHTS_PATH = resolve(__dirname, '../../../../model/export/weights.json')

const FEATURE_LABELS = {
  avgBillAmount: 'Average bill amount',
  rentRegularity: 'Regular rent payments',
  utilityRegularity: 'Consistent utility bill payments',
  monthsHistory: 'Months of payment history',
}

let weights = null

function getWeights() {
  if (!weights) {
    weights = JSON.parse(readFileSync(WEIGHTS_PATH, 'utf-8'))
  }
  return weights
}

/**
 * Real SHAP values, not an approximation: for a linear model with an
 * independent-feature baseline, shap_i = coefficient_i * (x_i - mean_i)
 * is the exact closed form — verified numerically in model/explain_shap.py
 * against shap.LinearExplainer's actual output (max abs difference 0.0).
 * featureMeans comes from export_weights.py, computed over the same
 * training set explain_shap.py uses as its background, so this and the
 * Python explainer agree exactly, not just approximately.
 *
 * Returns the top_n factors shaped to match
 * apps/dashboard/src/types/contracts.js's ExplanationFactor.
 */
export function explainFeatures(features, topN = 2) {
  const { featureOrder, coefficients, featureMeans } = getWeights()

  const shapValues = featureOrder.map((feature, i) => {
    const x = features[feature] ?? 0
    return { feature, value: coefficients[i] * (x - featureMeans[i]) }
  })

  const ranked = [...shapValues].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, topN)
  const maxAbs = Math.max(...ranked.map((f) => Math.abs(f.value))) || 1

  return ranked.map(({ feature, value }) => ({
    feature,
    label: FEATURE_LABELS[feature],
    impactDirection: value >= 0 ? 'positive' : 'negative',
    magnitude: Math.round((Math.abs(value) / maxAbs) * 1000) / 1000,
  }))
}
