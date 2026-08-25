/**
 * Minimal regex-based feature extraction from OCR text — same
 * minimal-heuristic discipline as the original demo, not production-grade
 * document parsing.
 *
 * A single document's OCR text can only reveal a bill amount. Payment
 * regularity and months of history are properties of a payment pattern
 * over time, not of one bill — they were never derivable from OCR alone
 * even in the original demo. Those three features are accepted as
 * caller-supplied values (see routes/documents.js) instead of invented
 * from a single image.
 */
const AMOUNT_PATTERN = /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i

export function parseAvgBillAmount(ocrText) {
  const match = ocrText.match(AMOUNT_PATTERN)
  if (!match) return null
  return parseFloat(match[1].replace(/,/g, ''))
}
