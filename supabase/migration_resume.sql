-- ═══════════════════════════════════════════════════════
-- RESUME / CV TABLES  –  Profile & Education
-- Run in Supabase SQL Editor after base migration.
-- ═══════════════════════════════════════════════════════

-- ── Profile (single-row) ────────────────────────────
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text not null,
  email text,
  phone text,
  address text,
  summary text,
  updated_at timestamptz default now()
);

-- ── Education ───────────────────────────────────────
create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  location text,
  period text,
  highlights text[] default '{}',
  order_index int default 0
);

-- ── RLS ─────────────────────────────────────────────
alter table profile enable row level security;
alter table education enable row level security;

-- Public read
create policy "Public read profile"
  on profile for select using (true);

create policy "Public read education"
  on education for select using (true);

-- Authenticated write
create policy "Authenticated users can insert profile"
  on profile for insert to authenticated
  with check (true);

create policy "Authenticated users can update profile"
  on profile for update to authenticated
  using (true) with check (true);

create policy "Authenticated users can delete profile"
  on profile for delete to authenticated
  using (true);

create policy "Authenticated users can insert education"
  on education for insert to authenticated
  with check (true);

create policy "Authenticated users can update education"
  on education for update to authenticated
  using (true) with check (true);

create policy "Authenticated users can delete education"
  on education for delete to authenticated
  using (true);
