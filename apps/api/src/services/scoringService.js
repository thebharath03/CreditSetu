import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const WEIGHTS_PATH = resolve(__dirname, '../../../../model/export/weights.json')

let weights = null

/**
 * Loads model/export/weights.json once and caches it. Same artifact
 * apps/dashboard/src/lib/scoring.js consumes client-side — this is the
 * server-side half of "one model, two consumers" (see architecture doc).
 */
function getWeights() {
  if (!weights) {
    weights = JSON.parse(readFileSync(WEIGHTS_PATH, 'utf-8'))
  }
  return weights
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x))
}

/**
 * Mirrors apps/dashboard/src/lib/scoring.js's scoreApplicant exactly —
 * same dot-product + sigmoid, same weights.json. Returns a 0-100 display
 * score and a risk band, matching contracts.js's Score shape.
 */
export function scoreFeatures(features) {
  const { featureOrder, coefficients, intercept } = getWeights()
  const vector = featureOrder.map((f) => features[f] ?? 0)
  const dot = vector.reduce((sum, v, i) => sum + v * coefficients[i], 0)
  const probability = sigmoid(dot + intercept)
  const value = Math.round(probability * 100)

  // Same 70/40 display-band thresholds as apps/dashboard's WhatIfSimulator.jsx
  // bandFor() — no shared package between the two apps for one constant,
  // but keep these in sync if either changes.
  let band = 'high'
  if (value >= 70) band = 'low'
  else if (value >= 40) band = 'medium'

  return { value, band, computedAt: new Date().toISOString() }
}
