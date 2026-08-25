# CreditSetu API Contracts

`apps/api`, base URL `http://localhost:4000` in development. Every shape below is taken directly from the working code and was exercised live against a real Supabase project on 2026-08-25 — this is not a design document, it's what the endpoints actually do.

Not documented here because not built: `/stt`, `/tts` (voice, Phase 11 — deferred by explicit choice, not started). `apps/api/src/routes/voice.js` does not exist.

---

## `GET /health`

No auth, no body.

**Response `200`**
```json
{ "status": "ok" }
```

Works with zero environment configuration — does not touch Supabase.

---

## `POST /documents`

The full capture-to-score pipeline: OCR → feature extraction → score → explain → write to Supabase. `multipart/form-data` body.

| Field | Required | Notes |
|---|---|---|
| `document` | yes | Image file (bill/receipt). Sent through Tesseract.js OCR server-side — see `ocrService.js`'s labeling comment: this is an explicit stand-in for the mobile app's on-device ML Kit, not the shipped OCR path. |
| `applicantId` | no | Defaults to `app-<timestamp>`. Upserted, so re-posting the same id updates that applicant instead of erroring. |
| `name` | no | Defaults to `"New applicant"`. |
| `documentType` | no | Defaults to `"unknown"`. Free text, e.g. `electricity_bill`. |
| `documentLabel` | no | Defaults to the uploaded file's original name. |
| `rentRegularity` | no | Defaults to `0.5`. **Cannot be derived from OCR of a single document** — regularity is a property of a payment pattern over time, not one bill. Accepted as a caller-supplied value rather than invented. |
| `utilityRegularity` | no | Same as above, defaults to `0.5`. |
| `monthsHistory` | no | Same as above, defaults to `6`. |

Only `avgBillAmount` is actually extracted from the document (regex on OCR text for a currency amount — see `parseFeatures.js`).

**Response `201`**
```json
{
  "applicantId": "app-01",
  "features": { "avgBillAmount": 2450, "rentRegularity": 0.7, "utilityRegularity": 0.65, "monthsHistory": 10 },
  "score": { "value": 83, "band": "low", "computedAt": "2026-08-25T15:20:10.944Z" },
  "explanationFactors": [
    { "feature": "rentRegularity", "label": "Regular rent payments", "impactDirection": "positive", "magnitude": 1 },
    { "feature": "monthsHistory", "label": "Months of payment history", "impactDirection": "negative", "magnitude": 0.673 }
  ],
  "ocrText": "ELECTRICITY BOARD\nConsumer Name: A. Kumar\n\n..."
}
```

`score` and each entry in `explanationFactors` match `apps/dashboard/src/types/contracts.js`'s `Score`/`ExplanationFactor` shapes exactly.

`explanationFactors` come from `explainService.js` — a JS reimplementation of the exact closed-form SHAP value for a linear model (`coefficient_i * (x_i - mean_i)`), not an approximation. Verified numerically against `model/explain_shap.py`'s `shap.LinearExplainer` output (max abs difference `0.0`).

**Error responses**
- `400 { "error": "Missing file field \"document\"." }` — no file uploaded
- `422 { "error": "Could not find a bill amount in the document.", "ocrText": "..." }` — OCR ran, but the regex found no currency amount. `ocrText` is included so the caller can see what OCR actually extracted.
- `500 { "error": "<message>" }` — anything else (Supabase write failure, missing env vars, etc.)

---

## `POST /credentials`

Issues a signed JWT encoding an applicant's current score and top factors. Real signing (`jsonwebtoken`, `JWT_SECRET` env var), not the demo-grade base64+checksum token `apps/dashboard`'s mock mode still uses (mock mode has no backend to call).

**Request**
```json
{ "applicantId": "app-01" }
```

**Response `201`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "qrPayload": "eyJhbGciOiJIUzI1NiIs...",
  "issuedAt": "2026-08-25T15:20:10.944Z",
  "verified": false
}
```

`token` and `qrPayload` are always identical — the QR just encodes the raw JWT string. Decoded, the JWT payload is:
```json
{
  "applicantId": "app-01",
  "name": "R. Sharma",
  "score": 90,
  "band": "low",
  "factors": [
    { "feature": "rentRegularity", "label": "Regular rent payments", "impactDirection": "positive" },
    { "feature": "utilityRegularity", "label": "Consistent utility bill payments", "impactDirection": "positive" }
  ],
  "iat": 1787671210,
  "exp": 1790263210
}
```
Expires 30 days from issue (`expiresIn: '30d'`).

A row is inserted into Supabase's `credentials` table on success (service-role, bypasses RLS).

**Error responses**
- `400 { "error": "Missing applicantId." }`
- `404 { "error": "Applicant not found." }`
- `422 { "error": "Applicant has no score yet." }` — applicant exists but has no row in `scores`
- `500 { "error": "<message>" }`

---

## `POST /credentials/verify`

Validates a token's signature. On success, also marks the matching `credentials` row `verified: true` in Supabase.

**Request**
```json
{ "token": "eyJhbGciOiJIUzI1NiIs..." }
```

**Response `200` (valid)**
```json
{ "valid": true, "payload": { "applicantId": "app-01", "name": "R. Sharma", "score": 90, "band": "low", "factors": [...], "iat": ..., "exp": ... } }
```

**Response `400` (invalid, tampered, or expired)**
```json
{ "valid": false, "error": "Invalid or tampered token." }
```
Verified live: flipping a single character in a real token's signature produces exactly this response — the JWT signature check genuinely rejects tampering, not just missing/malformed tokens.

**Error responses**
- `400 { "error": "Missing token." }` — no token in body
- `400 { "valid": false, "error": "Invalid or tampered token." }` — signature check failed
- `500 { "error": "<message>" }` — signature was valid but the Supabase update failed

---

## Auth note for whoever integrates next

None of these endpoints check who's calling — there's no bearer-token/session check on the `apps/api` side. `apps/dashboard`'s Supabase Auth gate (Phase 12) only protects direct Supabase reads from the browser; it does not currently protect these HTTP endpoints. If `apps/api` is ever exposed beyond localhost, add an auth check here first.
