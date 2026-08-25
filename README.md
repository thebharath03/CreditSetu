# CreditSetu

Alternative-data credit scoring for applicants without a formal credit history — utility bills, rent receipts, and similar documents are turned into a transparent, explainable score. This repo is the pre-hackathon build: everything except the mobile app.

## What's here

- **`apps/dashboard`** — the lender dashboard (React + Vite). Applicant queue, score detail with explainability, a what-if simulator, and a credentials tab for issuing/verifying portable QR score credentials. Reads through a single `dataSource.js` interface that switches between hardcoded mock fixtures and a live Supabase backend via `VITE_USE_MOCK`.
- **`apps/api`** — backend scaffold (Node/Express). Currently just a health-check route and a lazily-initialized service-role Supabase client (`supabaseAdmin.js`) — the document processing, credential issuance, and voice endpoints described in the architecture doc aren't built yet.
- **`model`** — the scoring model (Python). Synthetic dataset generation, a logistic regression trained on it, real per-applicant SHAP explainability, and `weights.json` exported for the dashboard's client-side scoring (used directly by the what-if simulator).

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

## Running the API scaffold

```
cd apps/api
npm install
cp .env.example .env   # fill in SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY if you need Supabase access
npm run dev
```

`GET /health` works with no `.env` at all. Anything touching Supabase (`supabaseAdmin.js`) only fails at the point of actual use, not on startup.
