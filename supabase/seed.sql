-- ============================================================
-- Portfolio Seed Data
-- Run this in the Supabase SQL Editor after running migration.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Experience (5 rows, newest-first by order_index)
-- ────────────────────────────────────────────────────────────
INSERT INTO experience (company, role, period, location, description, highlights, tech_stack, order_index)
VALUES
(
  'Qualiticks Pty Ltd',
  'Senior AI Software Engineer',
  'Jan 2026 – Present',
  'Sydney, Australia',
  'Lead the design and delivery of enterprise-grade AI solutions on Azure, architecting end-to-end intelligent systems that integrate LLMs, ML models, and cloud-native services for clients across multiple industries.',
  ARRAY[
    'Architect and deploy production AI solutions on Azure OpenAI, Azure ML, and Microsoft Fabric',
    'Design end-to-end AI pipelines including data ingestion, model training, evaluation, and deployment',
    'Implement MLOps practices for continuous model monitoring, retraining, and versioning',
    'Collaborate with cross-functional teams to translate business requirements into scalable AI systems',
    'Establish enterprise AI governance frameworks ensuring security, reliability, and compliance'
  ],
  ARRAY['Azure OpenAI', 'Azure ML', 'Microsoft Fabric', 'Python', 'LLMs', 'MLOps', 'Enterprise AI'],
  0
),
(
  'Ortigas Land Corp',
  'Software Developer Officer',
  'Jan 2024 – Dec 2025',
  'Pasig City, Philippines',
  'Led the software development team and drove enterprise-wide digital transformation through AI-powered automation, RPA solutions, and modern application development.',
  ARRAY[
    'Led a team of developers, overseeing SDLC, code reviews, and project delivery timelines',
    'Designed and deployed AI-powered HR automation reducing manual document processing by 70%',
    'Architected SAP RPA automation suite handling FB60, FBRA, and RECN transactions, cutting processing time by 80%',
    'Implemented intelligent workflow automation using Power Automate Cloud and Desktop',
    'Developed data analytics dashboards with Tableau and SAP reporting for executive decision-making',
    'Drove adoption of CI/CD pipelines and cloud architecture best practices across the team'
  ],
  ARRAY['AI', 'Power Automate', 'SAP ECC6', 'RPA', 'Tableau', 'ASP.NET Core', 'MS SQL Server', 'CI/CD'],
  1
),
(
  'Ortigas Land Corp',
  'Senior Software Developer Associate',
  'Jan 2022 – Dec 2023',
  'Pasig City, Philippines',
  'Spearheaded the design and development of critical enterprise applications, including payment gateway integrations, e-commerce modules, and internal tooling to support business operations.',
  ARRAY[
    'Developed and integrated UnionBank UPay payment gateway with secure transaction handling and rate limiting',
    'Built an e-commerce shopping module with SAP integration for real-time inventory and order management',
    'Designed and implemented an IT ticketing system on Office 365 and SharePoint',
    'Introduced secure coding practices including reCAPTCHA, input validation, and rate limiting',
    'Mentored junior developers and conducted knowledge-sharing sessions on best practices'
  ],
  ARRAY['ASP.NET Core', 'UnionBank API', 'SAP Integration', 'MS SQL Server', 'Office 365', 'SharePoint', 'Security'],
  2
),
(
  'Ortigas Land Corp',
  'Software Developer Associate',
  'May 2019 – Dec 2021',
  'Pasig City, Philippines',
  'Developed and maintained business-critical web applications and internal tools, focusing on database-driven solutions and process automation.',
  ARRAY[
    'Developed a tenant portal mobile app using Xamarin Forms with database-driven features',
    'Built automated database backup service with Amazon S3 integration for disaster recovery',
    'Created internal web applications using ASP.NET for HR, finance, and operations teams',
    'Designed and optimized MS SQL Server databases for high-volume transaction processing',
    'Implemented WordPress-based corporate websites with custom themes and plugins'
  ],
  ARRAY['ASP.NET', 'Xamarin Forms', 'MS SQL Server', 'Amazon S3', 'WordPress', 'HTML/CSS', 'JavaScript'],
  3
),
(
  'OCLP Holdings Inc',
  'Programmer',
  'Jul 2018 – May 2019',
  'Pasig City, Philippines',
  'Contributed to the development and maintenance of enterprise software systems, gaining foundational experience in full-stack development and database management.',
  ARRAY[
    'Developed and maintained internal web applications using ASP.NET and MS SQL Server',
    'Assisted in database design, query optimization, and report generation',
    'Supported SAP reporting and data extraction for finance and operations',
    'Participated in requirements gathering, testing, and deployment of new software features'
  ],
  ARRAY['ASP.NET', 'MS SQL Server', 'SAP Reporting', 'HTML/CSS', 'JavaScript'],
  4
);


-- ────────────────────────────────────────────────────────────
-- Skills (~30 rows across 8 categories)
-- ────────────────────────────────────────────────────────────
INSERT INTO skills (name, category, proficiency, is_featured)
VALUES
-- Cloud & AI Platforms
('Azure', 'Cloud & AI Platforms', 95, true),
('Azure OpenAI', 'Cloud & AI Platforms', 93, true),
('Azure ML', 'Cloud & AI Platforms', 90, true),
('Microsoft Fabric', 'Cloud & AI Platforms', 90, false),
('Enterprise AI Architecture', 'Cloud & AI Platforms', 92, true),

-- AI & Intelligent Automation
('End-to-End AI Design', 'AI & Intelligent Automation', 95, true),
('ML Model Training', 'AI & Intelligent Automation', 88, false),
('MLOps', 'AI & Intelligent Automation', 85, false),
('Intelligent Workflow Automation', 'AI & Intelligent Automation', 92, true),

-- Data & Analytics
('MS SQL Server', 'Data & Analytics', 90, true),
('Database Design', 'Data & Analytics', 88, false),
('SAP Reporting', 'Data & Analytics', 82, false),
('Tableau', 'Data & Analytics', 80, false),

-- Automation & Integration
('Power Automate Desktop', 'Automation & Integration', 90, true),
('Power Automate Cloud', 'Automation & Integration', 88, false),
('Office 365 / SharePoint', 'Automation & Integration', 85, false),

-- DevOps & Scalability
('Cloud Architecture', 'DevOps & Scalability', 85, false),
('Performance Tuning', 'DevOps & Scalability', 83, false),
('CI/CD Automation', 'DevOps & Scalability', 82, false),
('Monitoring & Observability', 'DevOps & Scalability', 80, false),

-- Web & Frontend
('Python', 'Web & Frontend', 85, true),
('JavaScript', 'Web & Frontend', 83, false),
('HTML / CSS', 'Web & Frontend', 80, false),
('React', 'Web & Frontend', 78, false),
('WordPress', 'Web & Frontend', 75, false),

-- Security & Governance
('Secure Coding', 'Security & Governance', 85, false),
('Rate Limiting & reCAPTCHA', 'Security & Governance', 83, false),
('Enterprise Reliability', 'Security & Governance', 80, false),

-- Leadership & Delivery
('SDLC', 'Leadership & Delivery', 90, false),
('Cross-Functional Collaboration', 'Leadership & Delivery', 88, false),
('Project Management', 'Leadership & Delivery', 85, false),
('Mentorship', 'Leadership & Delivery', 87, false);


-- ────────────────────────────────────────────────────────────
-- Projects (9 rows)
-- ────────────────────────────────────────────────────────────
INSERT INTO projects (title, tagline, description, industry, tags, impact, difficulty, build_time, demo_url, featured, is_new, order_index)
VALUES
(
  'Payment Gateway (UnionBank UPay)',
  'Production payment platform processing thousands of real-estate transactions monthly',
  'Designed and shipped a production-grade payment gateway integrated with UnionBank''s UPay API for Ortigas Land Corp, enabling tenants and property buyers to make secure online payments for rent, dues, and reservations. The system handles the full transaction lifecycle — amount validation, tokenized card processing, idempotent retries, and real-time status webhooks — all behind a responsive ASP.NET front-end. Implemented multi-layered security including HTTPS-only endpoints, server-side rate limiting (sliding-window algorithm), Google reCAPTCHA v3 bot detection, and detailed transaction audit logging. The gateway processes thousands of transactions per month with zero security incidents since launch and has become the default payment channel for the company''s residential and commercial properties.',
  'FinTech',
  ARRAY['ASP.NET', 'UnionBank UPay API', 'Security', 'Rate Limiting', 'reCAPTCHA v3', 'Webhooks', 'Transaction Logging'],
  'Very High',
  'Advanced',
  '6 months',
  'https://payment.ortigasland.com.ph/',
  true,
  false,
  0
),
(
  'SAP RPA Automation Suite',
  'Eliminated 40+ hours/week of manual SAP data entry across finance',
  'Architected and deployed an enterprise-grade RPA solution using Power Automate Desktop that fully automates three high-volume SAP ECC6 financial transactions: FB60 (vendor invoice posting), FBRA (resetting cleared items), and RECN (bank reconciliation). The bot reads validated Excel batches from SharePoint, logs into SAP GUI, navigates each transaction screen, enters line-item data, and handles SAP popup exceptions with screenshot capture and structured error logging. Built a companion Power Automate Cloud flow for end-to-end orchestration — file detection, bot triggering, and automated email reporting with success/failure breakdowns. Delivered an 80% reduction in processing time and near-zero data-entry errors, freeing 40+ hours per week for the finance department to focus on analysis and strategic work.',
  'Enterprise',
  ARRAY['SAP ECC6', 'Power Automate Desktop', 'Power Automate Cloud', 'RPA', 'FB60', 'FBRA', 'RECN', 'SharePoint'],
  'Very High',
  'Advanced',
  '4 months',
  NULL,
  true,
  false,
  1
),
(
  'AI-Powered HR Automation',
  'ML-driven document extraction cutting HR processing time by 70%',
  'Designed and implemented an AI-driven document processing pipeline for the HR department at Ortigas Land Corp. The system ingests scanned and digital HR documents — employment contracts, government-mandated forms (SSS, PhilHealth, Pag-IBIG), training certificates, and leave/benefit requests — and uses Azure AI Document Intelligence to extract key fields (names, dates, ID numbers, amounts) with high accuracy. Extracted data is validated against existing HRIS employee records, then routed through intelligent approval workflows orchestrated by Power Automate Cloud. The solution integrates with a custom ASP.NET API for HRIS updates and maintains a full audit trail for compliance. Reduced manual document processing time by 70%, cut transcription errors to near-zero, and slashed new-employee onboarding paperwork from days to hours.',
  'AI/ML',
  ARRAY['Azure AI Document Intelligence', 'Power Automate', 'ML', 'ASP.NET API', 'SharePoint', 'HR Automation', 'Document Extraction'],
  'Very High',
  'Advanced',
  '5 months',
  NULL,
  true,
  false,
  2
),
(
  'E-Commerce Shopping Module',
  'Full-stack e-commerce platform with real-time SAP inventory sync',
  'Built a full-featured e-commerce shopping module for Ortigas Land''s merchandise and property-related products, fully integrated with SAP for real-time inventory synchronization and order fulfillment. Customers browse a product catalog, manage their cart, and complete checkout through a responsive ASP.NET Core front-end backed by MS SQL Server. On order placement, inventory counts are decremented in SAP in real-time, and the order record flows into SAP''s fulfillment pipeline automatically. The platform incorporates product search, category filtering, image galleries, and promotional pricing. Stress-tested and optimized to handle high-traffic flash-sale events (e.g., holiday promos) without performance degradation, maintaining sub-second page loads under peak concurrency.',
  'E-Commerce',
  ARRAY['ASP.NET Core', 'SAP Integration', 'MS SQL Server', 'REST API', 'E-Commerce', 'Inventory Management'],
  'High',
  'Advanced',
  '5 months',
  NULL,
  true,
  false,
  3
),
(
  'Database Backup Service (S3)',
  'Zero-touch SQL Server disaster recovery with cloud offsite storage',
  'Developed a resilient Windows service that automates MS SQL Server database backups on a fully configurable schedule (daily, weekly, or custom cron) and uploads compressed backup files to Amazon S3 for offsite disaster recovery. The service supports full and differential backups, applies GZip compression to reduce storage costs by up to 70%, and enforces retention policies that automatically purge backups older than a configurable threshold. Built-in email notifications alert the DBA team on every backup run with detailed success/failure status, file sizes, and durations. The service runs unattended as a Windows service with automatic restart on failure, and has been operating reliably in production for multiple years across several database servers — providing peace of mind for business continuity.',
  'DevOps',
  ARRAY['Windows Service', 'Amazon S3', 'MS SQL Server', 'GZip Compression', 'Cron Scheduling', 'Disaster Recovery', 'Email Alerts'],
  'High',
  'Intermediate',
  '2 months',
  NULL,
  false,
  false,
  4
),
(
  'IT Ticketing System',
  'Enterprise help-desk platform with SLA tracking and automated escalation',
  'Created a company-wide IT ticketing system for Ortigas Land Corp built on Office 365 and SharePoint, enabling 500+ employees to submit, track, and resolve IT support requests through a centralized portal. The system features role-based dashboards, automated ticket assignment based on category and agent availability, configurable SLA timers with escalation rules that notify managers when thresholds are breached, and a management analytics dashboard showing resolution rates, average response times, and agent workload distribution. Integrated with the company''s Active Directory for single sign-on and employee lookup. The platform replaced a fragmented email-based support process, improving average resolution time and giving IT leadership real-time visibility into team performance.',
  'Enterprise',
  ARRAY['Office 365', 'SharePoint', 'ASP.NET', 'Active Directory', 'SLA Tracking', 'IT Service Management'],
  'Medium',
  'Intermediate',
  '3 months',
  'https://portal.ortigas.com.ph/otp',
  false,
  false,
  5
),
(
  'Tenant Portal Mobile App',
  'Cross-platform mobile app serving tenants across multiple properties',
  'Developed a cross-platform mobile application using Xamarin Forms for Ortigas Land''s residential and commercial tenants, providing a unified digital experience across iOS and Android. Tenants can view lease details and payment history, submit and track maintenance requests with photo attachments, receive real-time push notifications for announcements and billing reminders, and browse building amenities and community guidelines. The back-end features a custom-designed relational database supporting multi-property, multi-tenant hierarchies — enabling a single app instance to serve tenants across all of the company''s properties. Integrated with the existing ERP for billing data synchronization and with the IT ticketing system for maintenance request routing.',
  'Real Estate',
  ARRAY['Xamarin Forms', 'Mobile', 'iOS', 'Android', 'Push Notifications', 'Database Design', 'Multi-Tenant Architecture'],
  'High',
  'Advanced',
  '6 months',
  NULL,
  false,
  false,
  6
),
(
  'Board Room App',
  'AI-powered document intelligence platform with role-based access and RAG chat',
  'Built the Board Room module within QTX Group''s SEED platform — an enterprise AI application designed for board directors, executives, and administrators. The app provides role-based access control where board directors can upload confidential documents, executives can review and annotate, and admins manage user permissions and document lifecycles. Core features include dual-mode document search (semantic vector search for natural-language queries and keyword search for precision lookups) and an AI-powered chat interface using Retrieval-Augmented Generation (RAG) that lets users ask questions grounded in the uploaded document corpus. Built with React and TypeScript on the front-end and Supabase for authentication, storage, and the vector database. The platform ensures data isolation per organization and delivers fast, context-aware answers that reduce the time executives spend searching through lengthy board materials.',
  'Enterprise AI',
  ARRAY['React', 'TypeScript', 'Supabase', 'RAG', 'Semantic Search', 'Vector Database', 'AI Chat', 'RBAC'],
  'High',
  'Advanced',
  '3 months',
  'https://seed-dev.qtx.group/',
  true,
  true,
  7
),
(
  '.NET MVC Codebase Audit & Review',
  'Comprehensive security and architecture audit of a large-scale enterprise codebase',
  'Conducted an in-depth security and architecture audit of a large-scale .NET MVC application backed by SQL Server for a confidential enterprise client. The review covered OWASP Top 10 vulnerability assessment, authentication and authorization patterns, SQL injection and XSS attack surfaces, dependency vulnerability scanning, database schema design, query performance analysis, and overall architectural coherence. Identified critical security vulnerabilities, significant architectural debt, and performance bottlenecks across the codebase. Delivered a comprehensive audit report with prioritized findings, a phased remediation roadmap with timelines, and actionable coding guidelines and best practices for the client''s development team to follow going forward. The engagement gave the client a clear, structured path to modernize and secure their application.',
  'Enterprise',
  ARRAY['ASP.NET MVC', 'SQL Server', 'Security Audit', 'OWASP', 'Code Review', 'Architecture', 'Performance Analysis'],
  'High',
  'Advanced',
  '1 month',
  NULL,
  false,
  true,
  8
);


-- ────────────────────────────────────────────────────────────
-- Blog Posts (4 rows)
-- ────────────────────────────────────────────────────────────
INSERT INTO blog_posts (title, slug, excerpt, content, tags, is_published, read_time_minutes, published_at)
VALUES
(
  'Building Enterprise AI Solutions with Azure OpenAI',
  'building-enterprise-ai-solutions-azure-openai',
  'A deep dive into architecting production-ready AI solutions using Azure OpenAI Service, from prompt engineering to deployment at scale.',
  E'# Building Enterprise AI Solutions with Azure OpenAI\n\nThe rise of large language models has opened up incredible opportunities for enterprises to automate complex tasks, generate insights, and deliver more personalized experiences. In this post, I share lessons learned from building production AI solutions on Azure OpenAI.\n\n## Why Azure OpenAI?\n\nAzure OpenAI Service offers the power of GPT models with the enterprise-grade security, compliance, and reliability of the Azure cloud. For organizations that need data residency guarantees, private networking, and role-based access control, it''s the clear choice over consumer-grade APIs.\n\n## Architecture Patterns\n\nWhen designing enterprise AI solutions, I follow a layered architecture:\n\n- **Data Layer** — Structured and unstructured data stored in Azure Blob, Cosmos DB, or SQL.\n- **Orchestration Layer** — A Python-based service that manages prompt construction, context retrieval (RAG), and model invocation.\n- **API Layer** — RESTful endpoints exposed via Azure API Management with rate limiting and authentication.\n- **Frontend** — A React-based UI that streams responses in real-time.\n\n## Key Lessons\n\n1. **Prompt engineering is iterative.** Treat prompts like code — version them, test them, and review them in PRs.\n2. **Grounding with RAG is essential.** Without retrieval-augmented generation, models hallucinate on domain-specific questions.\n3. **Monitor everything.** Track token usage, latency percentiles, and user satisfaction scores from day one.\n4. **Start with GPT-4o-mini for prototyping**, then evaluate GPT-4o for tasks that require deeper reasoning.\n\n## Wrapping Up\n\nBuilding AI for the enterprise is as much about architecture, security, and governance as it is about the model itself. Azure OpenAI gives you the building blocks — the real challenge is designing systems that are reliable, maintainable, and aligned with business goals.\n\n*Thanks for reading! Feel free to reach out if you''re navigating a similar journey.*',
  ARRAY['Azure', 'OpenAI', 'LLM', 'Enterprise AI'],
  true,
  7,
  '2026-02-15T10:00:00Z'
),
(
  'How I Cut SAP Processing Time by 80% with RPA',
  'cut-sap-processing-time-80-percent-rpa',
  'A practical story of using Power Automate Desktop to automate repetitive SAP ECC6 transactions and dramatically improve operational efficiency.',
  E'# How I Cut SAP Processing Time by 80% with RPA\n\nManual data entry in SAP is one of those tasks that everyone knows is painful — yet it persists in countless organizations. In this post, I walk through how I used Robotic Process Automation (RPA) to slash processing time by 80% for our finance team.\n\n## The Problem\n\nOur finance department was spending 40+ hours per week manually processing three types of SAP ECC6 transactions:\n\n- **FB60** — Vendor invoice entry\n- **FBRA** — Resetting cleared items\n- **RECN** — Bank reconciliation\n\nEach transaction required navigating multiple screens, entering data from spreadsheets, and verifying totals. It was error-prone and soul-crushing work.\n\n## The Solution: Power Automate Desktop\n\nI chose Power Automate Desktop because it integrates well with SAP GUI and our existing Microsoft 365 stack. The approach:\n\n1. **Data staging** — Finance uploads validated Excel files to a SharePoint folder.\n2. **Bot trigger** — A Power Automate Cloud flow detects the new file and triggers the Desktop flow.\n3. **SAP automation** — The Desktop flow logs into SAP, navigates to the correct transaction code, and enters each row from the spreadsheet.\n4. **Error handling** — If a transaction fails, the bot captures a screenshot, logs the error, and continues with the next row.\n5. **Reporting** — A summary email is sent to the finance team with a success/failure breakdown.\n\n## Results\n\n- **80% reduction** in processing time\n- **Near-zero** data-entry errors\n- **40+ hours/week** freed up for higher-value finance work\n- Finance team morale improved significantly\n\n## Lessons Learned\n\n- Always build a robust error-handling layer — SAP popups are unpredictable.\n- Test with production-like data volumes before go-live.\n- Get finance team buy-in early by showing a demo on real transactions.\n\n*If your team is still doing manual SAP entry, there''s a better way.*',
  ARRAY['SAP', 'RPA', 'Automation', 'Power Automate'],
  true,
  6,
  '2025-11-20T10:00:00Z'
),
(
  'From Manual to Intelligent: AI-Powered HR Automation',
  'manual-to-intelligent-ai-powered-hr-automation',
  'How we used AI and Power Automate to transform HR document processing from a manual bottleneck into an intelligent, automated workflow.',
  E'# From Manual to Intelligent: AI-Powered HR Automation\n\nHR departments deal with mountains of documents — contracts, government forms, certificates, and employee records. In most organizations, processing these documents is still painfully manual. Here''s how I changed that with AI.\n\n## The Challenge\n\nOur HR team was manually reviewing and extracting data from hundreds of documents each month:\n\n- Employment contracts\n- Government-mandated forms (SSS, PhilHealth, Pag-IBIG)\n- Training certificates\n- Leave and benefit requests\n\nEach document had to be opened, read, and its key fields manually typed into the HRIS. It took an average of 15 minutes per document.\n\n## The AI-Powered Solution\n\nI designed a system combining AI document extraction with intelligent workflow automation:\n\n1. **Document ingestion** — HR uploads documents (PDF, images) to a designated folder.\n2. **AI extraction** — A trained ML model identifies document types and extracts key fields (names, dates, amounts, ID numbers) with high accuracy.\n3. **Validation** — Extracted data is cross-referenced against existing employee records for consistency.\n4. **Workflow routing** — Power Automate routes the validated data to the appropriate HRIS module and notifies the HR officer for final approval.\n5. **Audit trail** — Every step is logged for compliance and audit purposes.\n\n## Impact\n\n- **70% reduction** in manual document processing time\n- **Improved accuracy** — AI extraction eliminated common transcription errors\n- **Faster onboarding** — New employee paperwork processed in hours instead of days\n- **Compliance** — Full audit trail for every processed document\n\n## Technical Stack\n\n- Azure AI Document Intelligence for extraction\n- Power Automate Cloud for workflow orchestration\n- SharePoint for document storage\n- Custom ASP.NET API for HRIS integration\n\n*AI doesn''t have to be about chatbots and generators. Sometimes the biggest ROI comes from automating the boring stuff.*',
  ARRAY['AI', 'Power Automate', 'ML', 'HR Automation'],
  true,
  6,
  '2025-08-10T10:00:00Z'
),
(
  'Lessons Learned Leading a Developer Team',
  'lessons-learned-leading-developer-team',
  'Reflections on transitioning from individual contributor to team lead — what worked, what didn''t, and what I wish I knew sooner.',
  E'# Lessons Learned Leading a Developer Team\n\nIn early 2024, I stepped into a leadership role overseeing a team of developers at Ortigas Land Corp. It was a transition I had wanted for a while, but the reality of leading a team was different from what I expected. Here are the honest lessons I learned.\n\n## 1. Writing Code Is the Easy Part\n\nAs an IC, I measured productivity by lines of code, features shipped, and bugs fixed. As a lead, my job shifted to unblocking others, setting priorities, and making sure the team was aligned. Some of my most productive days involved zero coding.\n\n## 2. Code Reviews Are a Leadership Tool\n\nI started doing thorough code reviews not just for quality, but as a mentorship opportunity. Leaving thoughtful comments — explaining *why* something should change, not just *what* — helped junior developers grow faster than any training session.\n\n## 3. Protect Your Team''s Focus\n\nOne of my biggest challenges was shielding the team from scope creep and ad-hoc requests. I learned to push back on stakeholders (respectfully) and batch requests into sprint planning instead of interrupting ongoing work.\n\n## 4. Document Everything\n\nI made it a team standard to document:\n- Architecture decisions (ADRs)\n- API contracts\n- Deployment runbooks\n- Onboarding guides\n\nThis paid dividends when new team members joined and could ramp up independently.\n\n## 5. Celebrate Wins, Even Small Ones\n\nDeveloper morale matters more than I realized. A quick message in the team chat acknowledging someone''s PR, a shout-out in the weekly standup, or a team lunch after a big release — these small gestures compound over time.\n\n## 6. Your Growth Strategy Changes\n\nAs a lead, growing my skills now means learning about project management, stakeholder communication, and organizational dynamics — not just the latest JavaScript framework.\n\n## Looking Ahead\n\nLeading a team is challenging and rewarding in equal measure. If you''re considering the jump from IC to lead, my advice is: *be intentional about it.* Read, find a mentor, and be honest with yourself about the parts of IC work you''ll miss.\n\n*Thanks for reading. I''m always happy to chat about engineering leadership — reach out anytime.*',
  ARRAY['Leadership', 'SDLC', 'Mentorship', 'Team Management'],
  true,
  8,
  '2025-05-05T10:00:00Z'
);
