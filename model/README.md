# CreditSetu Demo Model

This is a **synthetic, illustrative dataset and model** — not real applicant
data, and not a validated or production-grade credit model. It exists to
prove that an OCR-to-score pipeline can run end-to-end, with real
explainability behind the score.

**Labeling rule:** each synthetic applicant is labeled *creditworthy*
(low default risk) when they show regular rent payments, regular utility
payments, and a longer observed payment history, combined into a weighted
"reliability score" (rent regularity weighted highest, then utility
regularity, then months of history, with a small penalty for an average
bill amount far outside a typical range). Applicants above a threshold on
that reliability score are labeled creditworthy; everyone else is labeled
higher-risk. About 8% of labels are randomly flipped afterward to avoid a
perfectly separable, unrealistically clean dataset. See
`generate_dataset.py` for the exact formula.

**Model choice: logistic regression**, not a gradient-boosted ensemble.
Two concrete reasons, not a default:
1. **TFLite conversion path** — a single dense layer (weights + sigmoid)
   converts trivially on-device, with none of a tree ensemble's op-support
   and size concerns.
2. **Already the shape the dashboard assumes** — `apps/dashboard/src/lib/scoring.js`
   and the what-if simulator recompute scores client-side as
   `sigmoid(dot(features, coefficients) + intercept)`. Switching model
   families would mean redesigning that contract for no accuracy benefit
   at this dataset's size and feature count.

**Explainability: real SHAP, not coefficient-ranking.** `explain_shap.py`
uses `shap.LinearExplainer` against the trained model to compute per-applicant
SHAP values — this is what "top contributing factors" should mean: what
actually drove *this* applicant's score, not a static global ranking by
|coefficient|. SHAP values are computed in log-odds space (standard for
linear models — sigmoid-transforming would break SHAP's additivity
property), but sign and relative magnitude still map directly onto
"helped/hurt the score, by how much."

## Files

- `features.py` — shared feature order + plain-language labels, imported
  by every script below so they can't drift out of sync with each other
  or with `apps/dashboard/src/types/contracts.js`.
- `generate_dataset.py` → `dataset.csv` (3000 synthetic rows)
- `train_model.py` → `export/model.joblib` (fitted logistic regression)
- `export_weights.py` → `export/weights.json`, copied to
  `apps/dashboard/public/weights.json`
- `explain_shap.py` — real SHAP feature attribution; run standalone to see
  sample per-applicant explanations, or import `top_factors()` for a
  single applicant's ranked factors

## Regenerate everything

```
python model/generate_dataset.py
python model/train_model.py
python model/export_weights.py
python model/explain_shap.py   # optional — prints sample SHAP explanations
```

Run from the repo root. Dependencies: `pip install -r model/requirements.txt`.
