-- ============================================================
-- Certifications & Awards Seed Data
-- Run this in the Supabase SQL Editor AFTER migration_certifications_awards.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Certifications (1 row)
-- ────────────────────────────────────────────────────────────
INSERT INTO certifications (name, issuer, credential_id, certification_number, earned_date, expiry_date, status, verification_url, badge_level, order_index)
VALUES
(
  'Microsoft Certified: Azure Developer Associate',
  'Microsoft',
  '4BB36B8CAC786989',
  '63878F-36899S',
  'February 14, 2026',
  'February 15, 2027',
  'Active',
  'https://learn.microsoft.com/en-us/users/raymundooyong/credentials/4bb36b8cac786989',
  'Associate',
  0
);


-- ────────────────────────────────────────────────────────────
-- Awards (2 rows)
-- ────────────────────────────────────────────────────────────
INSERT INTO awards (title, issuer, description, highlights, order_index)
VALUES
(
  'App and Running (1st Runner Up)',
  'STI College Meycauayan',
  'Competition of multiple computer science students developing android applications using Android Studio.',
  ARRAY[
    'Competed against multiple teams of computer science students at STI College Meycauayan',
    'Developed an android application using Android Studio under timed conditions',
    'The team that developed the required functions correctly and faster wins — landed 1st Runner Up'
  ],
  0
),
(
  'Best Thesis Presenter',
  'STI College Meycauayan',
  'Awarded for being the best thesis presenter during the Thesis defense.',
  ARRAY[
    'Recognized by Alma Mater as the best thesis presenter in the Thesis defense',
    'Thesis defense is a major requirement for the final year before graduation'
  ],
  1
);
