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
-- Projects (7 rows)
-- ────────────────────────────────────────────────────────────
INSERT INTO projects (title, tagline, description, industry, tags, impact, difficulty, build_time, featured, is_new, order_index)
VALUES
(
  'Payment Gateway (UnionBank UPay)',
  'Secure online payment integration for real-estate transactions',
  'Designed and implemented a full payment gateway integration with UnionBank''s UPay API, enabling tenants and buyers to make secure online payments. Built with robust error handling, transaction logging, rate limiting, and reCAPTCHA to prevent abuse. Processed thousands of monthly transactions with zero security incidents.',
  'FinTech',
  ARRAY['ASP.NET', 'UnionBank API', 'Security', 'Rate Limiting', 'reCAPTCHA'],
  'Very High',
  'Advanced',
  '6 months',
  true,
  false,
  0
),
(
  'SAP RPA Automation Suite',
  'Robotic process automation for SAP ECC6 financial transactions',
  'Architected an end-to-end RPA solution using Power Automate Desktop to automate repetitive SAP ECC6 transactions including FB60 (vendor invoices), FBRA (reset cleared items), and RECN (bank reconciliation). Reduced manual processing time by 80% and virtually eliminated data-entry errors across the finance department.',
  'Enterprise',
  ARRAY['SAP ECC6', 'Power Automate', 'RPA', 'FB60', 'FBRA', 'RECN'],
  'Very High',
  'Advanced',
  '4 months',
  true,
  false,
  1
),
(
  'AI-Powered HR Automation',
  'Intelligent document extraction and workflow automation for HR',
  'Designed an AI-driven system that automatically extracts data from HR documents (contracts, government forms, certificates) using machine learning models, then routes them through intelligent approval workflows via Power Automate. Reduced manual document processing by 70% and improved accuracy for the HR department.',
  'AI/ML',
  ARRAY['AI', 'Power Automate', 'Document Extraction', 'ML', 'HR Automation'],
  'Very High',
  'Advanced',
  '5 months',
  true,
  true,
  2
),
(
  'E-Commerce Shopping Module',
  'SAP-integrated e-commerce platform for property merchandise',
  'Built a full-featured e-commerce shopping module integrated with SAP for real-time inventory management and order processing. Customers could browse products, add to cart, and checkout — with orders flowing directly into SAP for fulfillment. Supported high-traffic sale events without degradation.',
  'E-Commerce',
  ARRAY['ASP.NET Core', 'SAP Integration', 'MS SQL', 'E-Commerce', 'Inventory'],
  'High',
  'Advanced',
  '5 months',
  true,
  false,
  3
),
(
  'Database Backup Service (S3)',
  'Automated SQL Server backup to Amazon S3 for disaster recovery',
  'Developed a Windows service that automatically backs up MS SQL Server databases on a configurable schedule and uploads them to Amazon S3 for off-site disaster recovery. Includes email notifications on success/failure, retention policies, and compression to minimize storage costs.',
  'DevOps',
  ARRAY['Windows Service', 'Amazon S3', 'MS SQL Server', 'Automation', 'Disaster Recovery'],
  'High',
  'Intermediate',
  '2 months',
  false,
  false,
  4
),
(
  'IT Ticketing System',
  'Internal help-desk and ticket management platform',
  'Created an IT ticketing system built on Office 365 and SharePoint, enabling employees to submit, track, and resolve IT support requests. Featured automated ticket assignment, SLA tracking, escalation rules, and a management dashboard for IT leadership.',
  'Enterprise',
  ARRAY['Office 365', 'SharePoint', 'ASP.NET', 'IT Service Management'],
  'Medium',
  'Intermediate',
  '3 months',
  false,
  false,
  5
),
(
  'Tenant Portal Mobile App',
  'Cross-platform mobile app for real-estate tenants',
  'Developed a cross-platform mobile application using Xamarin Forms, allowing tenants to view lease details, submit maintenance requests, receive announcements, and access building amenities information. Backed by a custom database design for multi-property tenant management.',
  'Real Estate',
  ARRAY['Xamarin Forms', 'Mobile', 'Database Design', 'Cross-Platform', 'Tenant Management'],
  'High',
  'Advanced',
  '6 months',
  false,
  false,
  6
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
