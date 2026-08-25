-- CreditSetu — Corrected schema (supersedes both the original uuid-based
-- migration AND Claude Code's flattened jsonb version). Safe to run: no
-- real applicant data exists yet, only the two conflicting attempts.

begin;

drop table if exists audit_trail cascade;
drop table if exists credentials cascade;
drop table if exists explanation_factors cascade;
drop table if exists scores cascade;
drop table if exists documents cascade;
drop table if exists applicants cascade;

create table applicants (
  id text primary key,                 -- matches mock fixture ids, e.g. 'app-01'
  name text not null,
  features jsonb not null,             -- {avgBillAmount, rentRegularity, utilityRegularity, monthsHistory}
                                        -- always read/written whole, never queried by sub-field — jsonb is the
                                        -- right call here, Claude Code's instinct on this one field was correct
  last_updated_at timestamptz not null default now()
);

create table documents (
  id text primary key,                 -- e.g. 'doc-01a'
  applicant_id text not null references applicants(id) on delete cascade,
  type text not null,
  label text not null,
  uploaded_at timestamptz not null default now()
);

create table scores (
  id uuid primary key default gen_random_uuid(),
  applicant_id text not null references applicants(id) on delete cascade,
  value numeric not null check (value >= 0 and value <= 100),  -- 0–100 display scale
  band text not null check (band in ('low', 'medium', 'high')),
  computed_at timestamptz not null default now()
);

create table explanation_factors (
  id uuid primary key default gen_random_uuid(),
  score_id uuid not null references scores(id) on delete cascade,
  feature text not null,
  label text not null,
  impact_direction text not null check (impact_direction in ('positive', 'negative')),
  magnitude numeric not null,
  rank int not null
);

create table credentials (
  id uuid primary key default gen_random_uuid(),
  applicant_id text not null references applicants(id) on delete cascade,
  score_id uuid not null references scores(id) on delete cascade,
  token text not null,
  qr_payload text not null,
  issued_at timestamptz not null default now(),
  verified boolean not null default false
);

create table audit_trail (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  action text not null,
  actor text,
  created_at timestamptz not null default now()
);

create index idx_documents_applicant on documents(applicant_id);
create index idx_scores_applicant on scores(applicant_id);
create index idx_explanation_factors_score on explanation_factors(score_id);
create index idx_credentials_applicant on credentials(applicant_id);

alter table applicants enable row level security;
alter table documents enable row level security;
alter table scores enable row level security;
alter table explanation_factors enable row level security;
alter table credentials enable row level security;
alter table audit_trail enable row level security;

create policy "public read applicants" on applicants for select to anon, authenticated using (true);
create policy "public read documents" on documents for select to anon, authenticated using (true);
create policy "public read scores" on scores for select to anon, authenticated using (true);
create policy "public read explanation_factors" on explanation_factors for select to anon, authenticated using (true);
create policy "public read credentials" on credentials for select to anon, authenticated using (true);
create policy "public read audit_trail" on audit_trail for select to anon, authenticated using (true);

-- RLS policies only apply after this base privilege check passes. Dropping
-- and recreating the tables above does not carry over Supabase's default
-- grants, so without this the anon key gets "permission denied" before RLS
-- is ever evaluated.
grant select on applicants, documents, scores, explanation_factors, credentials, audit_trail
  to anon, authenticated;

-- Credential issuance is the one write path this dashboard performs
-- directly from the browser (lender issues/verifies from the Credentials
-- tab; there's no separate backend). Scope is intentionally narrow:
-- insert to create a credential row, update restricted to the `verified`
-- column only — nothing else on any table is writable by anon/authenticated.
create policy "issue credentials" on credentials for insert to anon, authenticated with check (true);
create policy "verify credentials" on credentials for update to anon, authenticated using (true) with check (true);

grant insert on credentials to anon, authenticated;
grant update (verified) on credentials to anon, authenticated;

alter publication supabase_realtime add table applicants;
alter publication supabase_realtime add table scores;

commit;