-- ============================================================
-- Drop Bayani Quest Tables Migration
-- Run this in the Supabase SQL Editor to remove all tables
-- that were added by the Bayani Quest RPG version.
-- ============================================================

-- Drop RLS policies first (if they exist)
do $$
begin
  -- guestbook policies
  drop policy if exists "Public read guestbook" on guestbook;
  drop policy if exists "Public insert guestbook" on guestbook;
  drop policy if exists "Authenticated insert guestbook" on guestbook;

  -- contact_messages policies
  drop policy if exists "Public insert contact_messages" on contact_messages;
  drop policy if exists "Public read contact_messages" on contact_messages;
  drop policy if exists "Authenticated insert contact_messages" on contact_messages;

  -- visit_count policies
  drop policy if exists "Public read visit_count" on visit_count;
  drop policy if exists "Public update visit_count" on visit_count;
  drop policy if exists "Public insert visit_count" on visit_count;
exception
  when undefined_table then
    -- Tables may not exist; ignore
    null;
end $$;

-- Drop the tables
drop table if exists guestbook cascade;
drop table if exists contact_messages cascade;
drop table if exists visit_count cascade;

-- ============================================================
-- Verify cleanup (optional — run SELECT to confirm)
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- ============================================================
