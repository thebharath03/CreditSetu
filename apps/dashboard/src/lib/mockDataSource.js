/**
 * Hardcoded fixture data shaped exactly like contracts.js's typedefs. This is
 * the demo caseload every mock-mode walkthrough will actually show, so it's
 * deliberately varied across all three risk bands rather than uniform rows.
 */

function doc(id, type, label, uploadedAt) {
  return { id, type, label, uploadedAt }
}

function factor(feature, label, impactDirection, magnitude) {
  return { feature, label, impactDirection, magnitude }
}

const APPLICANTS = [
  {
    id: 'app-01',
    name: 'R. Sharma',
    score: { value: 82, band: 'low', computedAt: '2026-08-25T09:14:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 0.9),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.75),
    ],
    documents: [
      doc('doc-01a', 'electricity_bill', 'Electricity bill — July 2026', '2026-08-01T10:00:00Z'),
      doc('doc-01b', 'rent_receipt', 'Rent receipt — July 2026', '2026-08-01T10:02:00Z'),
      doc('doc-01c', 'water_bill', 'Water bill — July 2026', '2026-08-01T10:03:00Z'),
    ],
    credential: null,
    lastUpdatedAt: '2026-08-25T09:14:00Z',
  },
  {
    id: 'app-02',
    name: 'A. Iyer',
    score: { value: 64, band: 'medium', computedAt: '2026-08-24T15:40:00Z' },
    explanationFactors: [
      factor('monthsHistory', 'Length of payment history', 'positive', 0.5),
      factor('avgBillAmount', 'Average bill amount', 'negative', 0.3),
    ],
    documents: [
      doc('doc-02a', 'electricity_bill', 'Electricity bill — June 2026', '2026-08-20T08:12:00Z'),
      doc('doc-02b', 'rent_receipt', 'Rent receipt — June 2026', '2026-08-20T08:15:00Z'),
    ],
    credential: null,
    lastUpdatedAt: '2026-08-24T15:40:00Z',
  },
  {
    id: 'app-03',
    name: 'N. Verma',
    score: { value: 91, band: 'low', computedAt: '2026-08-25T11:02:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 0.95),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.8),
      factor('monthsHistory', 'Length of payment history', 'positive', 0.6),
    ],
    documents: [
      doc('doc-03a', 'rent_receipt', 'Rent receipt — July 2026', '2026-08-22T09:30:00Z'),
      doc('doc-03b', 'electricity_bill', 'Electricity bill — July 2026', '2026-08-22T09:32:00Z'),
      doc('doc-03c', 'water_bill', 'Water bill — July 2026', '2026-08-22T09:33:00Z'),
      doc('doc-03d', 'ration_card', 'Ration card', '2026-08-22T09:35:00Z'),
    ],
    credential: null,
    lastUpdatedAt: '2026-08-25T11:02:00Z',
  },
  {
    id: 'app-04',
    name: 'K. Reddy',
    score: { value: 38, band: 'high', computedAt: '2026-08-23T18:05:00Z' },
    explanationFactors: [
      factor('monthsHistory', 'Length of payment history', 'negative', 0.7),
      factor('rentRegularity', 'Regular rent payments', 'negative', 0.6),
    ],
    documents: [
      doc('doc-04a', 'electricity_bill', 'Electricity bill — May 2026', '2026-08-18T14:20:00Z'),
    ],
    credential: null,
    lastUpdatedAt: '2026-08-23T18:05:00Z',
  },
  {
    id: 'app-05',
    name: 'S. Bano',
    score: { value: 55, band: 'medium', computedAt: '2026-08-24T10:22:00Z' },
    explanationFactors: [
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.4),
      factor('avgBillAmount', 'Average bill amount', 'negative', 0.35),
    ],
    documents: [
      doc('doc-05a', 'rent_receipt', 'Rent receipt — June 2026', '2026-08-19T11:00:00Z'),
      doc('doc-05b', 'informal_ledger', 'Shop ledger extract', '2026-08-19T11:05:00Z'),
    ],
    credential: null,
    lastUpdatedAt: '2026-08-24T10:22:00Z',
  },
  {
    id: 'app-06',
    name: 'P. Nair',
    score: { value: 77, band: 'low', computedAt: '2026-08-25T07:48:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 0.85),
      factor('monthsHistory', 'Length of payment history', 'positive', 0.5),
    ],
    documents: [
      doc('doc-06a', 'electricity_bill', 'Electricity bill — July 2026', '2026-08-21T16:40:00Z'),
      doc('doc-06b', 'rent_receipt', 'Rent receipt — July 2026', '2026-08-21T16:42:00Z'),
      doc('doc-06c', 'water_bill', 'Water bill — July 2026', '2026-08-21T16:44:00Z'),
    ],
    credential: null,
    lastUpdatedAt: '2026-08-25T07:48:00Z',
  },
  {
    id: 'app-07',
    name: 'M. Khan',
    score: { value: 22, band: 'high', computedAt: '2026-08-22T13:10:00Z' },
    explanationFactors: [
      factor('monthsHistory', 'Length of payment history', 'negative', 0.8),
      factor('utilityRegularity', 'Consistent utility bill payments', 'negative', 0.55),
    ],
    documents: [
      doc('doc-07a', 'informal_ledger', 'Shop ledger extract', '2026-08-15T09:00:00Z'),
    ],
    credential: null,
    lastUpdatedAt: '2026-08-22T13:10:00Z',
  },
  {
    id: 'app-08',
    name: 'D. Joshi',
    score: { value: 69, band: 'medium', computedAt: '2026-08-24T19:33:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 0.6),
      factor('avgBillAmount', 'Average bill amount', 'negative', 0.25),
    ],
    documents: [
      doc('doc-08a', 'electricity_bill', 'Electricity bill — June 2026', '2026-08-17T12:00:00Z'),
      doc('doc-08b', 'rent_receipt', 'Rent receipt — June 2026', '2026-08-17T12:02:00Z'),
      doc('doc-08c', 'ration_card', 'Ration card', '2026-08-17T12:05:00Z'),
    ],
    credential: null,
    lastUpdatedAt: '2026-08-24T19:33:00Z',
  },
  {
    id: 'app-09',
    name: 'T. Pillai',
    score: { value: 88, band: 'low', computedAt: '2026-08-25T06:20:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 0.9),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.7),
      factor('monthsHistory', 'Length of payment history', 'positive', 0.65),
    ],
    documents: [
      doc('doc-09a', 'rent_receipt', 'Rent receipt — July 2026', '2026-08-23T08:00:00Z'),
      doc('doc-09b', 'electricity_bill', 'Electricity bill — July 2026', '2026-08-23T08:02:00Z'),
      doc('doc-09c', 'water_bill', 'Water bill — July 2026', '2026-08-23T08:04:00Z'),
      doc('doc-09d', 'informal_ledger', 'Shop ledger extract', '2026-08-23T08:06:00Z'),
    ],
    credential: null,
    lastUpdatedAt: '2026-08-25T06:20:00Z',
  },
  {
    id: 'app-10',
    name: 'V. Das',
    score: { value: 45, band: 'medium', computedAt: '2026-08-23T21:15:00Z' },
    explanationFactors: [
      factor('monthsHistory', 'Length of payment history', 'negative', 0.4),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.3),
    ],
    documents: [
      doc('doc-10a', 'electricity_bill', 'Electricity bill — May 2026', '2026-08-16T10:30:00Z'),
      doc('doc-10b', 'ration_card', 'Ration card', '2026-08-16T10:33:00Z'),
    ],
    credential: null,
    lastUpdatedAt: '2026-08-23T21:15:00Z',
  },
  {
    id: 'app-11',
    name: 'L. Menon',
    score: { value: 30, band: 'high', computedAt: '2026-08-22T08:50:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'negative', 0.65),
      factor('avgBillAmount', 'Average bill amount', 'negative', 0.4),
    ],
    documents: [
      doc('doc-11a', 'informal_ledger', 'Shop ledger extract', '2026-08-14T13:45:00Z'),
      doc('doc-11b', 'ration_card', 'Ration card', '2026-08-14T13:48:00Z'),
    ],
    credential: null,
    lastUpdatedAt: '2026-08-22T08:50:00Z',
  },
  {
    id: 'app-12',
    name: 'G. Chatterjee',
    score: { value: 73, band: 'low', computedAt: '2026-08-25T08:05:00Z' },
    explanationFactors: [
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.7),
      factor('monthsHistory', 'Length of payment history', 'positive', 0.45),
    ],
    documents: [
      doc('doc-12a', 'electricity_bill', 'Electricity bill — July 2026', '2026-08-24T17:10:00Z'),
      doc('doc-12b', 'rent_receipt', 'Rent receipt — July 2026', '2026-08-24T17:12:00Z'),
      doc('doc-12c', 'water_bill', 'Water bill — July 2026', '2026-08-24T17:14:00Z'),
    ],
    credential: null,
    lastUpdatedAt: '2026-08-25T08:05:00Z',
  },
]

export async function listApplicants() {
  return APPLICANTS
}

export async function getApplicant(id) {
  return APPLICANTS.find((a) => a.id === id) ?? null
}
