const FEATURE_LABELS = {
  avgBillAmount: 'average bill amount',
  rentRegularity: 'regular rent payments',
  utilityRegularity: 'consistent utility bill payments',
  monthsHistory: 'length of payment history',
}

export function labelFor(feature) {
  return FEATURE_LABELS[feature] ?? feature
}

export function explain(features, weights) {
  const contributions = weights.featureOrder.map((f, i) => ({
    feature: f,
    impact: (features[f] ?? 0) * weights.coefficients[i],
  }))
  contributions.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
  return contributions.slice(0, 2).map((c) => labelFor(c.feature))
}
