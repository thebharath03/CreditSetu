# CreditSetu — Handoff Notes

Written 2026-08-25, after a full clean rehearsal in both mock and live mode. Every claim below was verified in this session, not assumed — see the phase-by-phase detail for what was actually tested.

## What's mock vs. live, right now

**Everything works in both modes.** `apps/dashboard/.env`'s `VITE_USE_MOCK` is the switch:

- **`VITE_USE_MOCK=true`** — zero configuration needed, no Supabase project, no `apps/api`. Fixed 12-applicant fixture set (`mockDataSource.js`), all screens work, credentials use a demo-grade in-memory token. Rehearsed clean: Queue → Detail → Explainability → What-If Simulator → Credentials (issue + verify), zero console errors.
- **`VITE_USE_MOCK=false`** — needs `apps/dashboard/.env`'s `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`/`VITE_API_BASE_URL`, `apps/api` running with its own `.env` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`), and a signed-in Supabase Auth session. Rehearsed clean: sign in → Queue (real Postgres data) → realtime arrival (uploaded a document via `POST /documents` from a separate terminal while the tab was already open — it appeared with zero refresh) → Credentials (real JWT issue + signature verification via `apps/api`) → sign out. Zero console errors.

**If mock mode is ever demoed and the dashboard shows a login screen or fails to load, something regressed** — mock mode must never require any of the above. This was the whole point of the mock-swap architecture from Phase 0 onward, and it's held through every phase added since.

## Phase status (all verified this session, not aspirational)

| Phase | Status |
|---|---|
| 0–4 | Done (dashboard shell, queue, score detail, what-if simulator, polish) |
| 5 | Done (Supabase schema/seed + `apps/api` scaffold) |
| 6 | Done (live Supabase data source) |
| 7 | Done (real SHAP via `shap.LinearExplainer`, not coefficient-ranking) |
| 8 | Done (`POST /documents` — full OCR→score→explain→write pipeline) |
| 9 | Done (realtime queue updates, full loop verified: upload → live appearance) |
| 10 | Done (real signed JWT credentials via `apps/api`, not client-side tokens) |
| 11 | **Not built — deferred by explicit choice**, not a gap. Nothing in `apps/api` or the dashboard depends on it. Add it later with no risk to anything above. |
| 12 | Done (Supabase Auth, login screen, reads gated to `authenticated` role only) |
| 13 | This document + `docs/api-contracts.md` |

## Things worth knowing before continuing

- **`apps/api` endpoints have no auth check of their own.** Phase 12 gates the dashboard's direct Supabase reads; it does not protect `POST /documents`, `POST /credentials`, or `/credentials/verify`. Fine on localhost; needs fixing before any real deployment. See the note at the bottom of `docs/api-contracts.md`.
- **A test lender account exists**: `test-lender@creditsetu.local`, created via the Supabase Auth admin API, pre-confirmed. Password is not recorded here — look it up in the Supabase dashboard (Authentication → Users) or reset it there. Change the password or delete this account before this goes anywhere beyond local development.
- **The anon Supabase key is now fully read-only, and only for `authenticated` sessions** — not even reads work without signing in. `service_role` (used by `apps/api`) bypasses this entirely by design.
- **Credential tokens are real JWTs signed server-side** (`apps/api`, `JWT_SECRET`) in live mode, but mock mode still uses the original demo-grade base64+checksum token (`apps/dashboard/src/lib/credential.js`) since mock mode has no backend to call. This is intentional, not a leftover.
- **`explainService.js` reimplements SHAP in JS** rather than calling `model/explain_shap.py` as a subprocess — verified numerically identical (max abs difference `0.0`), but this only holds because the model is linear. If the model ever changes to something non-linear, this shortcut breaks and needs revisiting.
- **`web-demo` was removed entirely** earlier in this project's history (recoverable from git history if ever needed) — the dashboard is the one thing to demo now.
