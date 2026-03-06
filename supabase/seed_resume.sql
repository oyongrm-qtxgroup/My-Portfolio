-- ═══════════════════════════════════════════════════════
-- SEED DATA  –  Profile & Education
-- Run after migration_resume.sql
-- ═══════════════════════════════════════════════════════

INSERT INTO profile (full_name, title, email, phone, address, summary)
VALUES (
  'Raymundo M. Oyong',
  'Senior AI Software Engineer',
  'oyongrm@gmail.com',
  NULL,
  'Bulacan, Philippines',
  'Results-driven Senior AI Software Engineer with expertise in .NET, SAP ECC6, Azure, AI, and RPA. Experienced in leading teams and delivering secure, scalable enterprise systems. Specializes in AI-powered automation, Power Automate (Desktop & Cloud), and intelligent document processing, helping organizations streamline operations, integrate payments, and significantly improve efficiency and user experience.'
);

INSERT INTO education (degree, institution, location, period, highlights, order_index)
VALUES (
  'Bachelor of Science in Computer Science',
  'STI College Meycauayan',
  'Meycauayan, Philippines',
  '2014 – 2018',
  ARRAY[
    'Learned basic java programming and the fundamentals.',
    'Transitioned to C# Windows Form development for object oriented programming and logic development.',
    'Finished the course with the development of an Android Game using Unity Engine with a C# backend source code and an Augmented Reality feature.'
  ],
  0
);
