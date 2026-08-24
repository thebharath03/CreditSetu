export function parseFeatures(rawText) {
  const amountMatch = rawText.match(/(?:Rs\.?|₹)\s?([\d,]+)/i)
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0
  return {
    avgBillAmount: amount,
    rentRegularity: 0.8,
    utilityRegularity: 0.75,
    monthsHistory: 3,
  }
}
