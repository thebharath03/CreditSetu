/**
 * Frozen data contract shared by mockDataSource.js and liveDataSource.js.
 * Every field here must exist in both the mock fixtures and the live
 * Supabase schema (Phase 5+), field for field. If a later phase needs a
 * new field, add it here and to mockDataSource.js in the same commit.
 */

/**
 * @typedef {'low' | 'medium' | 'high'} RiskBand
 */

/**
 * @typedef {Object} Document
 * @property {string} id
 * @property {string} type - e.g. "electricity_bill", "rent_receipt"
 * @property {string} label - plain-language label shown in the UI
 * @property {string} uploadedAt - ISO 8601 timestamp
 */

/**
 * @typedef {Object} ExplanationFactor
 * @property {string} feature - internal feature name, e.g. "rentRegularity"
 * @property {string} label - plain-language label, e.g. "Regular rent payments"
 * @property {'positive' | 'negative'} impactDirection
 * @property {number} magnitude - relative impact size, 0-1, for bar-chart sizing
 */

/**
 * @typedef {Object} Score
 * @property {number} value - 0-100 display score
 * @property {RiskBand} band
 * @property {string} computedAt - ISO 8601 timestamp
 */

/**
 * @typedef {Object} Credential
 * @property {string} token - signed JWT (or similar) encoding score + factors
 * @property {string} qrPayload - the raw string encoded into the QR code
 * @property {string} issuedAt - ISO 8601 timestamp
 * @property {boolean} verified
 */

/**
 * @typedef {Object} ApplicantFeatures
 * @property {number} avgBillAmount
 * @property {number} rentRegularity - 0-1
 * @property {number} utilityRegularity - 0-1
 * @property {number} monthsHistory
 */

/**
 * @typedef {Object} Applicant
 * @property {string} id
 * @property {string} name
 * @property {ApplicantFeatures} features - raw model inputs; score/explanationFactors are
 *   derived from these via the same sigmoid/scoreApplicant function the what-if simulator uses
 * @property {Score} score
 * @property {ExplanationFactor[]} explanationFactors
 * @property {Document[]} documents
 * @property {Credential | null} credential
 * @property {string} lastUpdatedAt - ISO 8601 timestamp
 */

export {}
