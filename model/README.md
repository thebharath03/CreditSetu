# CreditSetu Demo Model

This is a **synthetic, illustrative dataset and model** — not real applicant
data, and not a validated or production-grade credit model. It exists to
prove that an OCR-to-score pipeline can run end-to-end in the browser.

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

A logistic regression is trained on this synthetic set in `train_model.py`,
and its coefficients/intercept are exported to `public/weights.json` for
the web app to load and score against at runtime, entirely client-side.

Regenerate with:

```
python model/generate_dataset.py
python model/train_model.py
```
