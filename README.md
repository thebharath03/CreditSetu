# CreditSetu

**🔗 Live demo: [credit-setu-alpha.vercel.app](https://credit-setu-alpha.vercel.app)**

Alternative-data credit scoring for applicants without a formal credit history — utility bills, rent receipts, and similar documents are turned into a transparent, explainable score. This repo is the pre-hackathon build: everything except the mobile app.

## What's here

- **`apps/dashboard`** — the lender dashboard (React + Vite). Supabase Auth login, applicant queue with live realtime updates, score detail with explainability, a what-if simulator, a credentials tab for issuing/verifying portable QR score credentials, and a mock applicant-facing view. Reads through a single `dataSource.js` interface that switches between hardcoded mock fixtures and a live Supabase backend via `VITE_USE_MOCK` — mock mode needs zero configuration.
- **`apps/api`** — backend (Node/Express). `POST /documents` runs the full OCR → score → explain → write pipeline; `POST /credentials` and `POST /credentials/verify` issue and verify real signed JWT score credentials (`jsonwebtoken`), not client-side tokens. Voice endpoints described in the architecture doc are deferred, not built.
- **`model`** — the scoring model (Python). Synthetic dataset generation, a logistic regression trained on it, real per-applicant SHAP explainability (`shap.LinearExplainer`), and `weights.json` exported for the dashboard's client-side scoring (used directly by the what-if simulator).

## Running the dashboard

```
cd apps/dashboard
npm install
npm run dev
```

Set `apps/dashboard/.env` (see `VITE_USE_MOCK`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) — with `VITE_USE_MOCK=true` it runs entirely on mock data, no Supabase project needed.

To run live against Supabase, apply `apps/dashboard/supabase/schema.sql` then `seed.sql` in the Supabase SQL editor, and set `VITE_USE_MOCK=false`.

## Regenerating the model

```
pip install -r model/requirements.txt
python model/generate_dataset.py
python model/train_model.py
python model/export_weights.py
python model/explain_shap.py   # optional — prints sample SHAP explanations
```

See `model/README.md` for the labeling rule, model choice rationale, and what the dataset actually represents.

## Running the API

```
cd apps/api
npm install
cp .env.example .env   # fill in SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / JWT_SECRET
npm run dev
```

`GET /health` works with no `.env` at all. `POST /documents`, `POST /credentials`, and `POST /credentials/verify` only fail at the point of actual use if the relevant env vars are missing, not on startup. These endpoints have no auth check of their own yet — fine for local development, not for a public deployment.
