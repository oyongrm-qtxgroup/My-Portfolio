-- ============================================================
-- Portfolio Supabase Migration
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tagline text,
  description text,
  industry text,
  tags text[],
  impact text,
  difficulty text,
  build_time text,
  demo_url text,
  github_url text,
  thumbnail_url text,
  featured boolean default false,
  is_new boolean default false,
  order_index int default 0,
  created_at timestamptz default now()
);

-- Experience table
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  period text not null,
  location text,
  description text,
  highlights text[],
  tech_stack text[],
  company_logo_url text,
  order_index int default 0
);

-- Blog posts table
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  tags text[],
  cover_image_url text,
  is_published boolean default false,
  views int default 0,
  read_time_minutes int,
  published_at timestamptz
);

-- Skills table
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  proficiency int,
  icon_url text,
  is_featured boolean default false
);

-- Contact submissions table
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table projects enable row level security;
alter table experience enable row level security;
alter table blog_posts enable row level security;
alter table skills enable row level security;
alter table contact_submissions enable row level security;

-- Public read policies
create policy "Public read projects"
  on projects for select using (true);

create policy "Public read experience"
  on experience for select using (true);

create policy "Public read published blogs"
  on blog_posts for select using (is_published = true);

create policy "Public read skills"
  on skills for select using (true);

-- Public insert for contact form
create policy "Public insert contact"
  on contact_submissions for insert with check (true);

-- ============================================================
-- Helper function: increment blog post view count
-- Called via supabase.rpc('increment_blog_views', { post_id })
-- ============================================================

create or replace function increment_blog_views(post_id uuid)
returns void as $$
begin
  update blog_posts
  set views = views + 1
  where id = post_id;
end;
$$ language plpgsql security definer;
