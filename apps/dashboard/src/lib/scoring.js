export function sigmoid(x) {
  return 1 / (1 + Math.exp(-x))
}

export function scoreApplicant(features, weights) {
  const vector = weights.featureOrder.map((f) => features[f] ?? 0)
  const dot = vector.reduce((sum, v, i) => sum + v * weights.coefficients[i], 0)
  return sigmoid(dot + weights.intercept)
}
