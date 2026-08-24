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
    features: { avgBillAmount: 2200, rentRegularity: 0.85, utilityRegularity: 0.75, monthsHistory: 16 },
    score: { value: 90, band: 'low', computedAt: '2026-08-25T09:14:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 1),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.72),
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
    features: { avgBillAmount: 3200, rentRegularity: 0.68, utilityRegularity: 0.58, monthsHistory: 9 },
    score: { value: 61, band: 'medium', computedAt: '2026-08-24T15:40:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 1),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.7),
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
    features: { avgBillAmount: 1900, rentRegularity: 0.93, utilityRegularity: 0.87, monthsHistory: 28 },
    score: { value: 98, band: 'low', computedAt: '2026-08-25T11:02:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 1),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.77),
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
    features: { avgBillAmount: 2800, rentRegularity: 0.4, utilityRegularity: 0.42, monthsHistory: 4 },
    score: { value: 18, band: 'high', computedAt: '2026-08-23T18:05:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 1),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.86),
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
    features: { avgBillAmount: 3800, rentRegularity: 0.52, utilityRegularity: 0.6, monthsHistory: 7 },
    score: { value: 43, band: 'medium', computedAt: '2026-08-24T10:22:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 1),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.94),
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
    features: { avgBillAmount: 2100, rentRegularity: 0.8, utilityRegularity: 0.68, monthsHistory: 13 },
    score: { value: 83, band: 'low', computedAt: '2026-08-25T07:48:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 1),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.7),
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
    features: { avgBillAmount: 11000, rentRegularity: 0.15, utilityRegularity: 0.18, monthsHistory: 2 },
    score: { value: 2, band: 'high', computedAt: '2026-08-22T13:10:00Z' },
    explanationFactors: [
      factor('avgBillAmount', 'Average bill amount', 'negative', 1),
      factor('rentRegularity', 'Regular rent payments', 'positive', 0.86),
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
    features: { avgBillAmount: 4800, rentRegularity: 0.7, utilityRegularity: 0.5, monthsHistory: 11 },
    score: { value: 58, band: 'medium', computedAt: '2026-08-24T19:33:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 1),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.58),
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
    features: { avgBillAmount: 2500, rentRegularity: 0.9, utilityRegularity: 0.82, monthsHistory: 24 },
    score: { value: 96, band: 'low', computedAt: '2026-08-25T06:20:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 1),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.75),
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
    features: { avgBillAmount: 3000, rentRegularity: 0.48, utilityRegularity: 0.55, monthsHistory: 6 },
    score: { value: 35, band: 'high', computedAt: '2026-08-23T21:15:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 1),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.94),
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
    features: { avgBillAmount: 10500, rentRegularity: 0.18, utilityRegularity: 0.2, monthsHistory: 3 },
    score: { value: 3, band: 'high', computedAt: '2026-08-22T08:50:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 1),
      factor('avgBillAmount', 'Average bill amount', 'negative', 0.92),
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
    features: { avgBillAmount: 2300, rentRegularity: 0.76, utilityRegularity: 0.72, monthsHistory: 15 },
    score: { value: 84, band: 'low', computedAt: '2026-08-25T08:05:00Z' },
    explanationFactors: [
      factor('rentRegularity', 'Regular rent payments', 'positive', 1),
      factor('utilityRegularity', 'Consistent utility bill payments', 'positive', 0.77),
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
