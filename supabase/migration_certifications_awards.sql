-- ============================================================
-- Certifications & Awards Migration
-- Run this in the Supabase SQL Editor AFTER migration.sql
-- ============================================================

-- Certifications table
create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text not null,
  credential_id text,
  certification_number text,
  earned_date text,
  expiry_date text,
  status text default 'Active',
  verification_url text,
  badge_level text,
  order_index int default 0
);

-- Awards table
create table if not exists awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  description text,
  highlights text[],
  order_index int default 0
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table certifications enable row level security;
alter table awards enable row level security;

-- Public read policies
create policy "Public read certifications"
  on certifications for select using (true);

create policy "Public read awards"
  on awards for select using (true);
