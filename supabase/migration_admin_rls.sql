-- ═══════════════════════════════════════════════════════
-- ADMIN RLS POLICIES + STORAGE BUCKET
-- Run this migration to enable authenticated write access
-- for the admin panel while keeping public read-only access.
-- ═══════════════════════════════════════════════════════

-- ── Projects ────────────────────────────────────────
CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE TO authenticated
  USING (true);

-- ── Experience ──────────────────────────────────────
CREATE POLICY "Authenticated users can insert experience"
  ON experience FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update experience"
  ON experience FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete experience"
  ON experience FOR DELETE TO authenticated
  USING (true);

-- ── Skills ──────────────────────────────────────────
CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills"
  ON skills FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete skills"
  ON skills FOR DELETE TO authenticated
  USING (true);

-- ── Blog Posts ──────────────────────────────────────
-- Allow authenticated users to see ALL posts (including drafts)
CREATE POLICY "Authenticated users can select all blog posts"
  ON blog_posts FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE TO authenticated
  USING (true);

-- ── Certifications ──────────────────────────────────
CREATE POLICY "Authenticated users can insert certifications"
  ON certifications FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update certifications"
  ON certifications FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete certifications"
  ON certifications FOR DELETE TO authenticated
  USING (true);

-- ── Awards ──────────────────────────────────────────
CREATE POLICY "Authenticated users can insert awards"
  ON awards FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update awards"
  ON awards FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete awards"
  ON awards FOR DELETE TO authenticated
  USING (true);

-- ── Contact Submissions ─────────────────────────────
-- Authenticated users can read all contact messages
CREATE POLICY "Authenticated users can select contact submissions"
  ON contact_submissions FOR SELECT TO authenticated
  USING (true);

-- Authenticated users can delete contact messages
CREATE POLICY "Authenticated users can delete contact submissions"
  ON contact_submissions FOR DELETE TO authenticated
  USING (true);

-- ═══════════════════════════════════════════════════════
-- STORAGE BUCKET: portfolio-assets
-- ═══════════════════════════════════════════════════════

-- Create the bucket (public read so images are accessible)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view (public portfolio images)
CREATE POLICY "Public can view portfolio assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

-- Only authenticated users can upload
CREATE POLICY "Authenticated users can upload portfolio assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update portfolio assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-assets')
  WITH CHECK (bucket_id = 'portfolio-assets');

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete portfolio assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-assets');
