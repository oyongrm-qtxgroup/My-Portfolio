# Fix plan after the October 2026 review

Status: **draft for the owner's approval, 24 Oct 2026. Nothing below is implemented.**

- Review report (findings and screenshots): https://claude.ai/artifact/A92Qzdc86nJoFSNPQcqhwQ
- Baseline: `main` at `add74fe`, live at https://raymundo-oyong.vercel.app (auto-deploys from `main`).
- Work branch: `ccr-e6bc818b-pfij6d`. One step = one pull request with a Vercel preview. Nothing merges to `main` without the owner's explicit OK.

Contents: 1 Decisions · 2 Themes and de-duplicated issues · 3 Steps · 4 Facts sheet · 5 Open questions · 6 How each step is checked · 7 Reviewer disagreements

---

## 1. Decisions (owner's answers, 24 Oct 2026)

These change the locked decisions in `docs/REDESIGN_PLAN.md` §1–4 and `docs/content/WRITING.md`. Each step records the decisions it applies in those docs, so the docs never contradict the site.

| # | Topic | Decision | Replaces | Findings |
| --- | --- | --- | --- | --- |
| D1 | Names | **SEED and Workable stay named**, each explained in one clause on first use. REDESIGN_PLAN §1 is the rule; the HANDOFF line "other QTX work stays generic" is corrected to match. | HANDOFF "Facts confirmed" line | F-02, R-09, H-17 |
| D2 | Title | **"Senior AI & Automation Engineer"** everywhere: site intro, CV header, tab titles, JSON-LD `jobTitle`, share cards. | §1 Positioning (title only) | R-02, H-16, D-03 |
| D3 | Headline | **Kept** ("I build AI and software that does the work people shouldn't have to."). The specifics go in a stronger identity line. | none | H-22 (declined), R-06 |
| D4 | Home order | **Work first:** Intro → Selected work → Experience → Capabilities (What I do and How I build merged) → Principles (three) → Contact. Each number stated once. | §5 Phase 2 home order; WRITING.md "Projects are evidence for a skill" | H-12, D-05, D-15 |
| D5 | Case studies | **Jayne Bandy AI, SAP & HR automation, NDIS workforce & care platform** (new; client generic). Care-plan drafting becomes a one-line "currently building" mention; its URL redirects. | §5 Phase 2 "Three project pages" | H-05, H-13, D-07, R-12 |
| D6 | Intent | **Employers and clients, employers first.** | none | R-04, D-01 |
| D7 | Engagement | **Direct contract, or relocation to Australia with visa sponsorship.** | none | R-01, H-09 |
| D8 | Hours | **UTC+8, overlapping most of the Sydney working day.** | none | R-01, H-09 |
| D9 | Phone | **Email only stays.** A line says email is the fastest way to reach you. | none | R-05, H-19 |
| D10 | Labels | Wordmark **"Raymundo Oyong"**; drop "VOL. 2026"; **drop the § numbers**; section names match the nav; plain 404. | §1 Direction (words only; the look stays) | R-13, H-22, D-10, D-26 |
| D11 | Motion | **No count-up; headline visible from first paint.** Margin-line draw and stamp press stay. The phone-header jump is fixed as a bug. | §4 Motion | D-13 |
| D12 | Visual | Hero actions; one-column layout up to about 900 px; employer, date and stat labels in sentence case at 14–15 px; **blue only for links**; no red edge line on phones. | §4 Layout, System sheet mono role and accent token | D-04, D-17, D-19, D-14, D-30, D-11 |
| D13 | CV layout | **ATS fixes plus light type changes**, single column kept, no "Selected outcomes" strip. | CVPage1/2 artboards (small changes) | R-07, D-20, D-21 |
| D14 | AI numbers | **None can be published.** The case studies say so plainly and rest on system facts. | none | R-03, H-01, D-23 |
| D15 | AI system facts | **Cleared to publish:** model and vendor names, evaluation method, data handling. **Not cleared:** screenshots, demo number, recordings. | §2 #6 (screenshots) stays allowed but unused | H-02, H-07, H-10, D-06 |
| D16 | Caller identity | Jayne Bandy AI matches the **caller's number and name**. Wording follows that; details come from the facts sheet. | none | H-08 |
| D17 | Ortigas team | **"Led a four-person development team"** on the site, CV and case study. | none | R-11, H-20 |
| D18 | Team facts | Supplied through the facts sheet (§4). | none | H-04 |
| D19 | More names (25 Oct 2026) | **Ziaris** (the NDIS workforce & care platform, built for one client; cleared) and **SmartCP** (the care-plan drafting tool, the client's; cleared) may be named. Use only the name Ziaris for that platform. The clients themselves stay generic. | §1 Names | F-02, H-13 |

### Calls I made for you (object when reviewing if you disagree)

- **Contact copy:** employers first ("Hiring for a role? Tell me about it."), project enquiries second, with **no clinic or booking-line examples**. A public pitch for clinic booking lines while you lead a dental AI receptionist reads as a conflict of interest (H-09).
- **Figures strip** (no AI numbers allowed): three figures, each stated only there: "3 practice systems behind one AI receptionist", "70–80% less manual SAP processing", "100+ h of HR work a month moved to a bot". "6.5 → 1 s" leaves the strip (R-12, D-23); "8 yrs" leaves because the identity line already says it.
- **Principles cut to three:** "Money gets a person's approval", "The client's spreadsheet is the specification", "Check the plumbing before blaming the AI". "Show the source" goes with care-plan drafting; "A silent failure is a bug" repeats the health check already in the case study.
- **"Skills shown"** at the end of each case study becomes a tag row, followed by a closing block with email and CV (D-08). This changes the WRITING.md project shape, consistent with D4.
- **Jayne Bandy AI result** states that usage figures belong to QTX and aren't published (H-01: "if they can't be shared, the page should say so"). At most one product-feature line stays (H-21).
- **Care-plan URL** `/work/care-plan-drafting/` redirects (301) to `/`, so links in old CVs and messages still land somewhere useful.
- **CV fonts (D-21, Type 3):** try static font instances for print. Keep them only if the PDF stays two pages and every check passes; otherwise leave as is and record why.

---

## 2. Themes and de-duplicated issues

The 72 findings reduce to 34 distinct issues in 11 themes. The original T9 (names) is settled by D1 and is now implemented inside T3 and T7. T10 (health-data trust) merges into T2 because it lives on the same pages and needs the same facts. A new T0 collects verified defects. "Evidence kept" is the strongest single proof of each issue.

| Theme | Issue | Findings | Evidence kept |
| --- | --- | --- | --- |
| **T0 Broken or disclosing** | CV links go to localhost | D-02 | Link annotations in the committed PDF are `http://localhost:4335/` twice; cause `src/pages/cv.astro:38,155` `href="/"` |
| | Share images blocked for crawlers | F-01 | `Disallow: /og/` in `src/pages/robots.txt.ts`; every `og:image` is `/og/*.png`. The template pages already carry `noindex`, so the rule can go |
| | Privacy typo | D-27 | "Addendum</a>and" in the built HTML (`src/pages/privacy.astro:57–58`) |
| | Client system's encryption state published | H-06 | "with encryption switched back on" (`work/care-plan-drafting.mdx`); three different wordings of one fix |
| | Team size differs between site and CV | R-11 | Site "myself included", CV drops it (`roles.yaml`) |
| | Stale handoff | F-03 | HANDOFF says production is the legacy site |
| **T1 Hireability** | No intent, engagement model, hours or availability | R-01, R-04, H-09, D-01, H-19 (part), R-05 | Three reviewers independently; recruiter: "can we hire this person, and how?" |
| **T2 AI depth and trust** | No AI outcome numbers | R-03, H-01, D-23 | All four figures are RPA, a database fix and years |
| | No architecture, evaluation or trade-offs | H-02, H-21 | Fig. 1 shows five boxes and no STT, LLM, tools or failure paths |
| | Nothing to see or check | H-10, D-06 | No demo, recording or screenshot; D15 rules them out, so architecture and evaluation detail must carry it |
| | Data handling unstated | H-07 | Nothing on storage, region, retention, consent or own access |
| | Caller identity reads as caller-ID only | H-08 | "Callers are recognised by the number they ring from" |
| | Guardrails justified by cost only | H-18 | "off-topic questions refused to keep running costs down" |
| **T3 Seniority and identity** | "Senior" missing at headline level | R-02, H-16, D-03 | Title is "AI and automation engineer" in profile, CV, tab and JSON-LD |
| | Name not in display type; no byline on case studies | R-06, D-03 | "R. OYONG — LOG"; "I'm Raymundo" mid-paragraph |
| | AI timeline invites arithmetic | H-03 | LLM work since Jan 2026; summary implies eight years of AI |
| | Personal scope and team size unstated | H-04, H-20 | Seven QTX workstreams, no team mentioned |
| | Philippine grade titles unclear | R-10, H-16 | "Senior Software Developer Associate" |
| | Product name reads as a person | R-15 | CV sub-heading "Jayne Bandy AI —" |
| **T4 Structure** | Skills before work; facts repeated | H-12, D-05 | Work starts ~45% down (desktop) and ~60% down (phone); "70–80%" ~10×, "6.5" 6× |
| | Labels don't match nav | D-15 | Nav "SKILLS" vs "What I do"; "How I build" vs "How I work" |
| | Grid gaps, long lines | D-18 | Seventh card at ~120 characters per line |
| | Rail labels read twice | D-31 | `MarginRow.astro` label plus hidden `<h2>` |
| **T5 Case-study line-up** | Weeks-old project featured; strongest Australian work unfeatured | H-05, H-13, D-07, R-12, D-30 | "Oct 2026 – now · IN PROGRESS" supplies a headline figure |
| | SAP claims lack baseline and controls | H-11, H-15 | "Eliminated 100+ hours" vs "Money gets a person's approval" |
| **T6 Log vocabulary** | Labels of retired content | R-13, H-22, D-10, D-26, D-29 | 404 "Back to the log" names a page that doesn't exist |
| **T7 CV PDF** | ATS reading order and hyphenation | R-07, D-21, H-19 | pdftotext: "retrievalaugmented"; OCLP dates after its bullets |
| | Keywords and defensible skills | R-08, H-14 | "RPA", "RAG" never as acronyms; Python, Azure OpenAI and SAP Basis unbacked |
| | Scanability | D-20 | Italic titles lighter than company; stranded bullet on page 2 |
| | Vanity LinkedIn URL | R-14 | Owner action outside the repo |
| **T8 Contact** | Client pitch; placeholders look like answers | D-09, D-24, H-09 (part) | Sent state shows "alex@clinic.com.au" next to "I'll reply to alex@example.com.au" |
| **T11 Phone and layout** | No action above the fold; header lost on scroll; stack hidden; tablet cramped; small all-caps facts; edge line | D-04, D-12, H-23, D-16, D-17, D-19, D-11 | `WorkRow.astro` hides `.stack` at ≤760 px |
| | Load-time jump and false mid-count figures | D-13 | "31–36%", "4 yrs" at ~1100 ms |
| **T12 Visual polish** | Blue on non-links; share cards; quotes; rule width | D-14, D-22, D-25, D-28, D-30 | Asides and LIVE stamp in link blue; name unreadable on cards at feed size |

Not acted on: **D-28** colour (not confirmed; only the 1 px vs 2 px width is fixed), **D-24 honeypot** (already hidden from assistive tech), **R-14 domain** (budget decision stands).

---

## 3. Steps

Order: interview impact first, then effort. Steps 1–4 need no facts beyond what you've given and can start once you approve. Steps 5a–5c wait on the facts sheet. Each step leaves the live site strictly better on its own, so the order can change after any merge without breaking anything.

Because all work goes through the single branch `ccr-e6bc818b-pfij6d`, **one pull request is open at a time**. After each merge the branch restarts from the new `main`.

### Step 1: Fix what's broken, inconsistent or disclosing (S, low risk, not blocked) — merged 25 Oct 2026 (#2)

- **Findings:** D-02, F-01, D-27, H-06 (deletion only), R-11, R-07 / D-21 (hyphenation only), F-03, plus the D1 doc correction.
- **Changes:**
  - CV links absolute: `new URL('/', Astro.site)` for both portfolio links.
  - New `cv-pdf.mjs` check: every link annotation in the PDF is `mailto:` or `https://` and none points to `localhost` or a relative path.
  - Remove `Disallow: /og/` from robots.
  - Add the missing space on the privacy page.
  - Delete "with encryption switched back on" and align the three wordings of the speed fix to one neutral sentence (exact root cause in Step 5 or 3, once you supply fact A8).
  - "Led a four-person development team" in the skills, roles and SAP case study.
  - Keep "retrieval-augmented" from breaking at a line end in the CV.
  - Update HANDOFF to the launched state and fix its naming line. Add this plan's decision log to REDESIGN_PLAN.
- **Files:** `src/pages/cv.astro`, `scripts/cv-pdf.mjs`, `src/pages/robots.txt.ts`, `src/pages/privacy.astro`, `src/content/skills.yaml`, `src/content/roles.yaml`, `src/content/work/care-plan-drafting.mdx`, `src/content/work/sap-automation.mdx`, `docs/HANDOFF.md`, `docs/REDESIGN_PLAN.md`, `public/raymundo-oyong-cv.pdf` (+ `.sha256`).
- **Verified by:**
  - Before/after list of PDF link URIs: two `https://raymundo-oyong.vercel.app/`, zero localhost. The new check fails when `href="/"` is temporarily restored.
  - `pdftotext` shows "retrieval-augmented" intact.
  - Built `robots.txt` and the privacy HTML.
  - Standard checks (§6).
  - **After merge:** LinkedIn Post Inspector on the production URL shows the image (previews are login-protected, so this check can only run on production).

### Step 2: Identity, hireability, labels and contact (M, low–medium risk, not blocked) — merged 25 Oct 2026 (#3)

- **Findings:** R-01, R-04, D-01, H-09, R-02, H-16, D-03 (title, wordmark), R-06, R-05 (email line), R-13, H-22 (labels), D-10, D-26, D-29, D-09, D-24, D-04, D-13, D-22 (wordmark wrap only).
- **Changes:**
  - **Title:** "Senior AI & Automation Engineer" from one source (`profile.title`, `cv.title`), so the site, CV, tab titles, JSON-LD and share cards change together.
  - **Availability line:** a new `availability` field in `profile.yaml`, shown at body size under the headline and in the CV header. The locked location line is unchanged. Draft: "Open to senior AI and automation roles with Australian teams: remote on contract, or relocating with visa sponsorship. UTC+8, overlapping most of the Sydney working day."
  - **Identity line:** full name, title, eight years.
  - **Hero actions:** "Download CV" and "Selected work".
  - **Header and footer:** wordmark "Raymundo Oyong", no "VOL. 2026", page titles end "— Raymundo Oyong". The footer leads with name, email, LinkedIn and CV, and the colophon shrinks to one line with an unambiguous date ("24 Oct 2026").
  - **404:** "Page not found" with links to Work, CV and Contact; the footer sits at the bottom on short pages.
  - **Contact section:** employer-first heading; label "What's it about?"; no example placeholders (format hints under the labels instead); Name marked "(optional)"; 2 px focus underline; after a send, the form is replaced by the confirmation; "Email is the fastest way to reach me." In verify, the form-state assertions change to match.
  - **Motion:** drop the count-up and its script; headline visible from first paint; the phone header renders in its final state from first paint. Confirm the jump first with a CLS trace on a phone profile, then fix it.
- **Files:** `src/content/profile.yaml`, `src/content.config.ts`, `src/pages/index.astro`, `src/pages/cv.astro`, `src/layouts/Base.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/ContactForm.astro`, `src/pages/404.astro`, every page's `title` prop, `src/lib/pages.ts`, `src/pages/og/[slug].astro`, `src/styles/motion.css`, `scripts/verify.mjs`, `docs/REDESIGN_PLAN.md`, regenerated PDF and `public/og/*.png`.
- **Risk:** touches every page header. Mitigation: the title comes from one source, and a grep of the built output must find no remaining "AI and automation engineer", "— Log" or "VOL.".
- **Verified by:**
  - Standard checks.
  - Screenshots at 390/768/1440 in both themes, compared side by side with `main`.
  - CLS before and after on a phone profile (budget < 0.02).
  - Home JS weight (must drop).
  - CV still two pages with the new header line.
  - Share cards viewed at 500 px wide.
- **Blocked:** no. Optional facts A3 (start month or notice) and A4 (rate) can be added to the availability line later.

### Step 3: CV PDF, ATS order, keywords and light type (S–M, low risk, mostly not blocked) — merged 25 Oct 2026 (#4)

- **Findings:** R-07, D-21, D-20, R-08, H-14, H-19 (education), R-10, H-16 (title glosses), H-03, R-15, H-11 (verb), F-02 / R-09 / H-17 (CV explanations).
- **Layout:**
  - Every job reads title, company, place and dates before its bullets (fixes OCLP and the single-role entries).
  - The QTX projects become bold lead-ins inside one job, so they no longer look like five employers.
  - No page break inside a project block; space before each Ortigas sub-role; semi-bold job titles, company secondary.
  - Page-1 footer clear of body text.
  - Try static fonts for print (see "Calls I made").
- **Content:**
  - Acronyms in both forms: "robotic process automation (RPA)", "retrieval-augmented generation (RAG)", "AI agents".
  - Title glosses: "Software Developer Officer (team lead)" and "Senior Software Developer Associate (senior developer)", worded per fact A9.
  - Summary states the timeline: "Eight years building business systems; since 2026, production LLM and voice AI for Australian health, disability-care and aged-care clients."
  - Description-first product line: "AI phone receptionist for dental practices (Jayne Bandy AI)".
  - "Moved 100+ hours a month of HR work to a bot…" instead of "Eliminated".
  - Workable explained as "QTX's in-house operations platform".
  - Education keeps degree and thesis title; the award lines go.
  - Skills list trimmed to what is defensible (fact A5).
- **New checks in `cv-pdf.mjs`** (`pdftotext`; CI installs `poppler-utils`):
  - For every role, its dates appear in the extracted text before its first bullet.
  - Required keywords present: RPA, RAG, LLM, Senior.
  - No known keyword split at a line end.
- **Files:** `src/pages/cv.astro` (and its print styles), `src/content/roles.yaml`, `src/content/profile.yaml`, `scripts/cv-pdf.mjs` (verb allow-list gains "Moved"), `.github/workflows/ci.yml`, regenerated PDF.
- **Verified by:**
  - Before/after `pdftotext` output attached to the PR.
  - Two pages.
  - All Harvard checks and the new ones pass; each new check is shown failing on a deliberately broken case.
- **Blocked:** the SEED clause (A1), Python, Azure OpenAI and SAP wording (A5), and the speed-fix wording (A8). The step can ship without them, keeping the current wording for those lines, and pick them up in Step 5.

### Step 4: Home page, work first, plus phone and layout fixes (M, medium risk, not blocked) — merged 25 Oct 2026 (#5)

- **Findings:** H-12, D-05, D-15, D-18, D-31, D-14, D-30 (colour), H-23, D-16, D-17, D-19, D-11, D-12, R-12, D-23 (figures), D-25 (quotes and list markers).
- **Content:**
  - New order per D4. Capabilities merges `skills.yaml` lead areas and foundations into one line per area, linking to the project that proves it; no proof lists.
  - Three principles.
  - New figures strip (see "Calls I made").
  - Each figure and claim appears once on the page; the PR includes a table of where each fact now lives.
  - Care-plan drafting stays a project row until Step 5b replaces it.
- **Layout:**
  - One-column layout up to ~900 px; no red edge line on phones.
  - Stack line visible at every width.
  - Slim header that reappears on scroll-up, with name, CV and Menu: small vanilla script, off under reduced motion, within the 15 KB budget.
  - Rail labels hidden from assistive tech where a heading carries the same words.
  - Employer, date and stat labels in sentence case at 14–15 px.
  - Standalone links at least 44 px tall on phones.
  - Blue only for links: asides, diagram highlights and the LIVE stamp move to ink, and links get an underline or arrow.
  - Seventh card capped at the normal measure; the empty half of the contact row holds email, CV, LinkedIn and availability.
  - Curly quotes throughout.
- **Files:** `src/pages/index.astro`, `src/content/skills.yaml` (new shape) and `src/content.config.ts`, `src/content/principles.yaml`, `src/components/SkillBlock.astro`, `WorkRow.astro`, `MarginRow.astro`, `SiteHeader.astro`, `Stamp.astro`, `Flow.astro`, `src/styles/base.css`, `src/design/tokens.ts`, `src/pages/system.astro`, `scripts/verify.mjs` (header-on-scroll and inline-target checks), `docs/content/WRITING.md` (Capability shape, work-first rule), `docs/REDESIGN_PLAN.md`.
- **Risk:** the largest diff in the plan, and it changes the page everyone sees first. Mitigation: one atomic PR and a preview review against today's page.
- **Targets:**
  - Phone page length about halved (10,494 px today).
  - Selected work starts within the first two phone screens after the intro.
  - Lighthouse mobile ≥ 98, CLS < 0.02, home JS ≤ 15 KB gzip.
- **Verified by:** standard checks, measured page heights before and after, a script counting repeated figures in the built home HTML, and keyboard and screen-reader passes over the new header.

### Step 5a: Jayne Bandy AI case study, depth without numbers (M, medium risk, blocked on facts B) — merged 25 Oct 2026 (#6)

- **Findings:** H-02, H-07, H-08, H-10 (partial), H-21, D-06 (diagram), D-08, D-03 (byline), H-04 (role line), D-25 (Role field date).
- **Changes:**
  - **Fig. 1 becomes an architecture figure:** telephony → speech-to-text → LLM agent and the tools it may call → three booking adapters → callback path. It marks deterministic vs model-driven parts and the failure paths (booking system down, slot taken mid-call, unclear speech).
  - **New headed paragraphs in § 2:** "How it's evaluated" (scenario count, how replays are de-identified and scored, approval threshold, one regression caught), "Choices and trade-offs" (vendors, models, something tried and dropped), "Data handling" (storage region, retention, vendor settings, consent, your own access).
  - Identity wording per D16.
  - Guardrail reasons: leakage, manipulation, then cost.
  - At most one sales line.
  - The result says usage figures aren't published.
  - Byline, tag row and closing contact block.
- **Files:** `src/content/work/jayne-bandy-ai.mdx`, `src/components/Flow.astro` (branching and failure paths may need a new figure component), `src/pages/work/[slug].astro`, `src/content/skills.yaml`, `src/content/roles.yaml`, `docs/content/WRITING.md` (project shape gains the three sub-headings), regenerated PDF and card.
- **Risk:** publishing system detail. Mitigation: every sentence traced to your facts-sheet answer, nothing beyond what D15 clears, denylist run, and you read the page before merge.
- **Verified by:** standard checks, the denylist, the figure readable at 390 px and announced sensibly by a screen reader, and your read-through.

### Step 5b: NDIS platform case study replaces care-plan drafting (M, medium risk, blocked on facts C) — merged 25 Oct 2026 (#7)

- **Findings:** H-13, D-07, H-05, R-12, D-30 (the red IN PROGRESS stamp goes), H-04.
- **Changes:**
  - New `work/ndis-platform.mdx` (client generic). § 1 challenge; Fig. 1 shift → award rules → pay, invoice and MYOB; § 2 covers award modelling, access that follows team, site and program, approval-based reconciliation, how pay correctness is tested, and failure modes; § 3 result.
  - Care-plan drafting is removed from the work collection; a "currently building" line goes in Experience; a 301 redirect is added in `astro.config.mjs`.
  - The care-plan share card is deleted and verify routes are updated.
  - Lands as one PR, so no state ever exists with a dead link or a missing third project.
- **Files:** `src/content/work/ndis-platform.mdx` (new), `src/content/work/care-plan-drafting.mdx` (removed), `astro.config.mjs`, `scripts/verify.mjs`, `public/og/`, `src/content/roles.yaml`, `src/content/skills.yaml`, `src/pages/index.astro`.
- **Verified by:** the redirect checked on the preview, sitemap and share card for the new page, the denylist (the client must stay unnamed), standard checks, and your read-through.

### Step 5c: SAP & HR automation depth (S–M, low risk, blocked on facts D) — in review

- **Findings:** H-11, H-15.
- **Changes:**
  - Each bot gets: rough monthly volume, how the 70–80% was measured, exceptions and who handles them, the person who checks extracted figures before a government payment, and how SAP screen changes are handled.
  - Plain-English clauses for "contract locks" and "government remittances".
  - UnionBank UPay wording corrected.
  - Byline, tag row and closing block, as in 5a.
- **Files:** `src/content/work/sap-automation.mdx`, `src/content/roles.yaml`, `src/content/skills.yaml`, regenerated PDF.
- **Verified by:** standard checks and your read-through.

### Step 6: Share images, favicon and remaining polish (S, low risk, not blocked)

- **Findings:** D-22, D-28 (rule width), R-14 (if you've claimed a LinkedIn vanity URL by then).
- **Changes:**
  - Share cards: name at feed-readable size, no wordmark wrap, title and key stack in the empty lower area, a project cue on work cards.
  - "RO" monogram favicon.
  - Margin rule 2 px under reduced motion.
- **Files:** `src/pages/og/[slug].astro`, `public/favicon.svg`, `src/styles/motion.css`, `public/og/*.png`, `src/content/profile.yaml`.
- **Verified by:** cards viewed at 500 px wide; after merge, LinkedIn Post Inspector and an X card check on production.

**Sizes:** Steps 1, 3, 5c and 6 are S to S–M; 2, 4, 5a and 5b are M. Highest-impact order if time runs short: 1 → 2 → 3 → 5a → 4 → 5b → 5c → 6. I recommend 4 before 5a, because 5a's byline and closing block reuse the components that Step 4 settles.

---

## 4. Facts sheet (answer in chat; nothing goes into the repo until you've checked it)

**A: short facts (Steps 2 and 3): answered 25 Oct 2026**

- A1 SEED: "QTX's SaaS that brings specialised AI into the work a team already does" (from its tagline).
- A2 Workable: "QTX's in-house operations platform".
- A3 start date, A4 rate, A6 reply time: none stated.
- A5 Python and Azure OpenAI both stay. Azure OpenAI is used on Ziaris; Python for ops and reporting scripts at QTX and Ortigas Land, written as "Automated reporting and operational checks with Python scripts."
- A7 UnionBank UPay: an integration: "Integrated UnionBank UPay as the company's first online payment channel, with rate limiting and reCAPTCHA".
- A8 speed fix: each action opened a fresh direct database connection; switching to Supabase's pooled HTTPS data API removed the setup cost.
- A9 title notes: yes, "Software Developer Officer (team lead)" and "Senior Software Developer Associate (senior developer)".

Original questions:

1. SEED in one clause. seed.qtx.group is blocked from this environment, so paste its tagline here, or add `seed.qtx.group` to the environment's allowed domains.
2. Workable: is "QTX's in-house operations platform" accurate?
3. Optional: earliest start or notice period for the availability line.
4. Optional: add "Rate on request"?
5. Python and Azure OpenAI: real work to name, or drop them? SAP: which areas were actually automated (finance and materials transactions?), so "Basis" can go.
6. Optional: a reply time for "email is fastest" (e.g. "within one working day")?
7. UnionBank UPay: what exactly was built (hosted checkout, callbacks, reconciliation)? Any volume?
8. Care-plan speed fix: root cause and fix in one sentence, and which action took 6.5 s.
9. Plain-English glosses for the Ortigas grades (was "Officer" the team-lead grade, and "Senior … Associate" a senior developer?).

**B: Jayne Bandy AI (Step 5a): answered 25 Oct 2026**

- B1 Lead of one or two developers; took over a working prototype in April 2026 and built the integrations, review workflow, alerts and billing since.
- B2 ElevenLabs Conversational AI (speech to text, turn-taking, voice) with its hosted LLM, GPT-5.5; Twilio for calls; Supabase for data. The hosting region is not published.
- B3 Tools: find patient, find free slots, book / move / cancel, request callback. The scripts are described as a licensed library of dental-practice scripts (not attributed to a person). On any booking failure the agent apologises and says the team will call back.
- B4 Four or five scripted scenarios plus comparison with past calls, scored by an LLM judge, then admin review. Written as "compared with past calls"; no de-identification claim (raise de-identifying test transcripts with the team).
- B5 Transcripts and logs in Supabase; recordings with ElevenLabs and Twilio under their retention. Callers are told it is an AI assistant and the call may be recorded. No claim about engineers' access to live records.
- B6 The number finds the record; the agent confirms the caller's name before reading out, moving or cancelling anything.
- B7 No trade-offs section.

Original questions:

1. When you became lead in April 2026: what existed, what you designed and built since, team size and roles.
2. Models and vendors: LLM, speech-to-text, voice, telephony; hosting region.
3. The tools the agent can call. Which parts are deterministic code and which are model-driven. What happens when a booking system is down, a slot is taken mid-call, or speech is unclear.
4. Evaluation: number of scenarios; what a "replay" is and how it's de-identified; how a run passes (rules, an LLM judge, a person); the approval threshold; one regression it caught.
5. Data handling: what's stored (audio, transcripts), where, for how long; vendor retention settings; how callers are told about AI handling and recording; your own access to live records.
6. Identity: when the name is confirmed, what happens with shared family or landline numbers, and what the agent may read out, move or cancel.
7. One trade-off: why ElevenLabs (or another choice), and something tried and dropped.

**C: NDIS platform, Ziaris (Step 5b): answered 25 Oct 2026**

- C1 Lead; built most of it with one or two other developers. Live: staff use it day to day.
- C2 SCHADS rates and penalty rules are configured by admins in the app; little hard-coded logic.
- C3 Pay and invoice correctness: Finance signs off sample pay runs before each release (no automated pay tests are claimed).
- C4 Reach comes from role (worker, coordinator, manager, Finance) plus assigned teams, sites and programs, checked by row-level security. Finance uploads a bank file; each line gets a suggested invoice match; Finance approves line by line.
- C5 Designed for: unmatched payments stay open for Finance; workers with expired credentials can't be rostered and managers are warned first.
- C6 Outcomes: spreadsheets replaced; pay from configured award rules; payroll and invoices reach MYOB without re-keying; Finance approves suggested matches.

Original questions:

1. Your role, team size, built vs inherited; is it live?
2. How SCHADS award rules and rates are modelled and updated.
3. How pay and invoice correctness is tested.
4. The access model (own, team, site, program), and the reconciliation flow.
5. Failure modes you designed for.
6. Any non-numeric outcome you can state (e.g. "replaced spreadsheet rostering"), and QTX's OK to describe it generically.

**D: SAP & HR (Step 5c): answered 25 Oct 2026**

- D1 The SAP bot handled hundreds of entries a month (no exact numbers).
- D2 Before/after timing: staff timed the manual process before; bot run logs and the remaining manual time after.
- D3 HR reviewed the AI-extracted remittance figures and approved before payment; the bot did the keying.
- D4 On an unexpected SAP screen the bot stopped, logged the item and left it for a person.
- A contract lock is a hold on a property-sale contract while something is pending.

Original questions:

1. Approximate monthly volumes per bot.
2. How the 70–80% and 100+ h were measured (time study, logs, estimate).
3. Exception rate and handling; who checks extracted figures before a remittance is paid.
4. How the SAP bot copes with screen changes.

**E: QTX scope for the CV (Steps 3 and 5)**

1. Team size and your role on the internal platform, SEED, RL Finance and the NDIS platform.
2. Stronger leadership examples, if any (H-20): a design others built on, someone you brought up to speed, an incident you led. If none, the leadership block is retitled "Code review and specifications".

---

## 5. Open questions (answer when approving)

1. ~~**Commit this plan?**~~ Answered 24 Oct 2026: commit it with Step 1 as `docs/FIX_PLAN.md`, and tick steps off as they merge.
2. **Public sample repo (H-10):** with screenshots and a demo ruled out, a small public repo (e.g. a toy booking agent with an evaluation harness) is the one remaining way to show AI engineering directly. Add it as a later step, or leave it? Also check that github.com/oyong1926 shows something relevant; this environment can't check.
3. **One PR at a time** on `ccr-e6bc818b-pfij6d`, as above, or may I use one branch per step so two can be in review at once?
4. **"Calls I made for you"** (§1): any you want changed?

---

## 6. How each step is checked (standard)

1. Node 24 from the scratchpad (`npm install --prefix <scratchpad>/node24 node@24.22.1`, its `bin` first on PATH); `npm ci`.
2. `npm run check` and `npm run lint:design`.
3. After any content change: `npm run build && npm run cv:pdf && npm run og && npm run build`.
4. `npm run lint:denylist`, with `DENYLIST` supplied by you for that command only: never printed, never written to a file, never committed.
5. `npm run verify -- <scratchpad>/shots` (served by `scripts/serve-static.mjs`, not `astro preview`); `npm run cv:pdf -- --check`; `npm run og -- --check`.
6. Re-read the diff; push to the branch; deploy a Vercel **preview** and send you the link with screenshots and the PDF text diff.
7. You review. Merging to `main` (production) happens only on your explicit OK. If production misbehaves, Vercel's instant rollback restores the previous deployment.

---

## 7. Where the reviewers disagreed, and how this plan resolves it

| Disagreement | Resolution |
| --- | --- |
| Shortlist strength (content depth, not visuals) | Steps 5a–5c carry the depth; the visual system is kept. |
| CV layout: keep vs too flat | Single column kept; ATS order fixed; light type changes only (D13). |
| Share image: best summary vs name unreadable | Keep the composition and enlarge the name (Step 6). |
| Phone number | Email only stays (D9); the gap is presented as a choice. |
| Headline | Kept (D3); the identity line carries the specifics. |
