## Plan: Populate Supabase & Personalize Portfolio (Step 15)

**TL;DR** — Create a comprehensive SQL seed file (`supabase/seed.sql`) with real resume data for all 4 content tables (experience, skills, projects, blog_posts), then update 4 component files to replace placeholder branding/links with Raymundo Oyong's real info. Social links: LinkedIn, GitHub, Facebook (replacing the X/Twitter placeholder). Navbar/Footer logo text changes from `Portfolio` to `Raymundo Oyong`. Hero tagline stays as-is.

**Steps**

1. **Create `supabase/seed.sql`** — New file with `INSERT` statements for all tables:
   - **`experience` (5 rows)** — one per resume role, ordered newest-first:
     1. Qualiticks Pty Ltd — Senior AI Software Engineer (01/2026–Present, Sydney)
     2. Ortigas Land Corp — Software Developer Officer (01/2024–12/2025, Pasig)
     3. Ortigas Land Corp — Senior Software Developer Associate (01/2022–12/2023, Pasig)
     4. Ortigas Land Corp — Software Developer Associate (05/2019–12/2021, Pasig)
     5. OCLP Holdings Inc — Programmer (07/2018–05/2019, Pasig)
     - Each row includes `highlights[]` (bullet points from resume), `tech_stack[]` (relevant technologies), `description` (role summary), `order_index` (0–4)

   - **`skills` (~30 rows)** across 8 categories mapping to the resume:
     - Cloud & AI Platforms (Azure, Azure OpenAI, Azure ML, Microsoft Fabric, Enterprise AI Architecture) — proficiency 90-95
     - AI & Intelligent Automation (End-to-End AI Design, ML Model Training, MLOps, Intelligent Workflow Automation) — proficiency 85-95
     - Data & Analytics (MS SQL Server, Database Design, SAP Reporting, Tableau) — proficiency 80-90
     - Automation & Integration (Power Automate Desktop, Power Automate Cloud, Office 365/SharePoint) — proficiency 85-90
     - DevOps & Scalability (Cloud Architecture, Performance Tuning, CI/CD Automation, Monitoring) — proficiency 80-85
     - Web & Frontend (Python, JavaScript, HTML/CSS, React, WordPress) — proficiency 75-85
     - Security & Governance (Secure Coding, Rate Limiting, reCAPTCHA, Enterprise Reliability) — proficiency 80-85
     - Leadership & Delivery (SDLC, Cross-Functional Collaboration, Project Management, Mentorship) — proficiency 85-90
     - Top skills marked `is_featured = true` for homepage highlight

   - **`projects` (6-7 rows)** — derived from key resume achievements:
     1. Payment Gateway (UnionBank UPay) — industry: "FinTech", tags: [ASP.NET, UnionBank API, Security, Rate Limiting]
     2. SAP RPA Automation Suite — industry: "Enterprise", tags: [SAP ECC6, Power Automate, RPA, FB60, FBRA, RECN]
     3. AI-Powered HR Automation — industry: "AI/ML", tags: [AI, Power Automate, Document Extraction, ML]
     4. E-Commerce Shopping Module — industry: "E-Commerce", tags: [ASP.NET Core, SAP Integration, MS SQL]
     5. Database Backup Service (S3) — industry: "DevOps", tags: [Windows Service, Amazon S3, Automation]
     6. IT Ticketing System — industry: "Enterprise", tags: [Office 365, SharePoint, ASP.NET]
     7. Tenant Portal Mobile App — industry: "Real Estate", tags: [Xamarin Forms, Mobile, Database Design]
     - Each includes `tagline`, `description`, `impact` level, `difficulty`, `featured` flag

   - **`blog_posts` (4 rows)** — sample posts with real-sounding titles and placeholder markdown:
     1. "Building Enterprise AI Solutions with Azure OpenAI" — tags: [Azure, OpenAI, LLM]
     2. "How I Cut SAP Processing Time by 80% with RPA" — tags: [SAP, RPA, Automation]
     3. "From Manual to Intelligent: AI-Powered HR Automation" — tags: [AI, Power Automate, ML]
     4. "Lessons Learned Leading a Developer Team" — tags: [Leadership, SDLC, Mentorship]
     - Each has `is_published = true`, realistic `read_time_minutes`, `published_at` dates, and 300-500 word markdown `content`

2. **Update `src/components/layout/Navbar.tsx`** — Change the logo from `<Portfolio/>` to `<Raymundo Oyong/>` (lines ~33-36 — the `<a href="#">` block)

3. **Update `src/components/layout/Footer.tsx`** — Two changes:
   - Update `socialLinks` array (lines 5-9): GitHub → `https://github.com/oyong1926`, LinkedIn → `https://www.linkedin.com/in/raymundo-oyong-4ab94321a/`, replace Twitter with Facebook (`https://www.facebook.com/`), Email → `mailto:oyongrm@gmail.com`
   - Update logo text (line ~33) from `Portfolio` to `Raymundo Oyong`

4. **Update `src/components/sections/Contact.tsx`** — Update `socialLinks` array (lines 20-47): Same link changes as Footer — GitHub, LinkedIn, Facebook (replacing Twitter icon with a generic `Globe` or keeping as an icon), Email → `mailto:oyongrm@gmail.com`. Update Twitter/X icon import to use `Facebook` or a generic globe icon from lucide-react.

5. **Update `src/components/sections/Hero.tsx`** — Update `roleTitles` array (line ~45) to better reflect actual resume profile: keep "Senior AI Software Engineer", consider swapping "ML Systems Architect" → "Azure AI Solutions Architect", "LLM & RAG Specialist" → "Enterprise AI Specialist", "Full-Stack AI Builder" → "RPA & Automation Engineer" — to align with the resume's actual expertise.

**Verification**

- Run `tsc --noEmit` to confirm zero TypeScript errors after component changes
- Run `npm run dev` and visually verify: Navbar shows "Raymundo Oyong", Footer has correct links, Contact sidebar links work, Hero cycles through updated role titles
- Copy `seed.sql` contents into Supabase SQL Editor and execute — then verify data appears in Experience timeline, Skills grid, Projects cards, and Blog section

**Decisions**

- Facebook replaces X/Twitter in social links (user doesn't have X/Twitter)
- Logo branding: "Raymundo Oyong" (user's preference over initials or first name only)
- Hero tagline text kept as-is (user confirmed)
- Blog seeds included with placeholder markdown content (user confirmed)
- Projects derived from resume key achievements (no external project links — `github_url` and `demo_url` left `NULL` unless you provide them)
- Role titles in Hero typing effect adjusted to reflect Azure/Enterprise/RPA expertise over pure LLM/RAG framing
