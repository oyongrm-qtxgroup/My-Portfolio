# Portfolio revival — implementation plan

Status: **design approved (round 2) and open items answered, 24 Oct 2026.** Nothing below is built yet.

- Design canvas (source of truth, commentable): https://claude.ai/artifact/T6ctTPLx4F3tVGQ2pX2gue
- Snapshot of the approved artboards: [`docs/design/`](design/) — `Main` (home), `Work` (case study), `Log`, `Mobile`, `MobileMenu`, `Night*` (dark mode), `States` (motion and loading states), `System` (tokens + accessibility), `CVPage1/2` (A4 CV). Copy exact colours, sizes, spacing and copy from these files.

---

## 1. Decisions locked

| Topic | Decision |
| --- | --- |
| Direction | **Engineering logbook.** Plain paper, black ink, ballpoint-blue accent, red notebook-margin line, condensed form-style headings. No cards, shadows, gradients, glow, glass, 3D, particles, typing effects, custom cursor, skill bars. |
| Positioning | **AI product engineer** at QTX. Headline: "I build the software that answers the phone¹, bills the residents² and rosters the carers³." |
| Names | Named: **Jayne Bandy AI** (always the full name), **SEED**, **Workable**. Every other project is described generically: "workforce & care platform for an NDIS provider", "retirement-village finance", "care-plan drafting for an aged-care provider". No client people's names anywhere. |
| Workable | Credit **only the modules built** (campaigns, certifications + MS Learn sync, 30/60/90 onboarding, KPI/KRA, ad-audience sync, sales booking, AI-call scheduling fix, realtime/connection fix). |
| Hours | Shown **rounded** ("650 h", "1,900+"). |
| Modes | Paper (light), Night (dark), **Auto = default** (follows OS). Manual switch in footer and phone menu. |
| Accessibility | **WCAG 2.2 AA** minimum; measured contrast in `System.dc.html`. |
| Stack | **Astro** (latest stable), static output + Vercel adapter for the contact action. Zero client framework; small vanilla scripts only. |
| Content | **Markdown/MDX content collections in the repo.** The Supabase CMS, admin panel and auth are retired. |
| CV | Generated from the same content, A4, follows the Harvard Extension School OCS guide (see §7). |

## 2. Answers to the open items (24 Oct 2026)

| # | Topic | Answer | Applied in |
| --- | --- | --- | --- |
| 1 | Phone on the public CV | **Email only.** No phone anywhere on the site or the PDF. | Phase 5 |
| 2 | Product name | **"Jayne Bandy AI"** everywhere. No practice count is published; CV bullets use outcomes instead. | Phase 2 |
| 3 | Domain | **Stay on `*.vercel.app`** (no budget for a custom domain yet). Proposed free alias: `raymundo-oyong.vercel.app`, falling back to the current `portfolio-sigma-nine-ikzbpiwe3p.vercel.app` if taken. | Phase 6 |
| 4 | "In hindsight" paragraphs | **Drafted from the Workable timesheets and tasks:** [`docs/content/case-study-notes.md`](content/case-study-notes.md). Review the wording before publishing. | Phase 2 |
| 5 | Location line | Confirmed: "Based in the Philippines · working with QTX, Sydney". | Phase 2 |
| 6 | Visuals | **Screenshots with no client data, plus a diagram where one helps.** Capture from demo/test environments seeded with made-up data, never from production; see Phase 2. | Phase 2 |
| 7 | Contact backend | **Astro Action → Turnstile verify → Resend email, no database.** Supabase is removed entirely. | Phase 4 |

## 3. Architecture

```
src/
  content.config.ts        zod schemas for every collection (build fails on bad content)
  content/
    profile.yaml           name, positioning, location, links, "Now" lines, figures
    work/*.mdx             6 case studies (order, no., title, line, role, period, hours, stack[], status, cv bullets)
    log/*.md               one entry per file: date, project, text, status
    roles/*.md             employment history incl. Ortigas Land and OCLP (CV + "Before QTX")
    education.yaml, certifications.yaml, awards.yaml
  layouts/Base.astro       <head>, theme bootstrap, skip link, header, footer, <ClientRouter/>
  components/              MarginRow, Stamp, WorkRow, LogRow, FigureCount, Sidenote, Footnote,
                           Diagram, Figure (+ruled placeholder), ThemeSwitch, PhoneMenu,
                           ContactForm, InkProgress
  pages/
    index.astro            home
    work/[slug].astro      case studies
    log/index.astro        full log; log/[project].astro static filter pages; rss.xml.ts
    cv.astro               HTML CV (print stylesheet = the PDF)
    404.astro              "No entry."
  actions/index.ts         contact action (Phase 4)
  styles/tokens.css        paper + night tokens, color-scheme
  styles/base.css, motion.css, print.css
scripts/cv-pdf.mjs         renders /cv to public/raymundo-oyong-cv.pdf (Playwright)
```

Status values: `live | shipped | in-progress | handed-over` → stamp colours: accent / ink / margin red / ink 2.

## 4. Design-system implementation notes

- **Tokens** (from `System.dc.html`): paper `#F6F6F3`, ink `#141413`, ink-2 `#56564F`, rule `#D8D8D2`, ballpoint `#1D3FD8`, margin `#C8322A`; night: `#131412`, `#ECEBE6`, `#A9A8A1`, `#2E2F2B`, `#93A8FF`, `#E0604F`. Control borders use ink-2 (≥3:1).
- **Theme without flash:** inline `<script>` in `<head>` reads `localStorage.theme` (`paper|night|auto`) and sets `data-theme` before first paint; `auto` uses `prefers-color-scheme`. 300 ms background/colour cross-fade only after first paint.
- **Fonts:** self-hosted variable fonts — Archivo (wdth + wght axes, used at `font-stretch: 72–80%`), Source Serif 4 (opsz), IBM Plex Mono 400/500. Preload Archivo + Source Serif; `font-display: swap` with metric-matched fallbacks (`size-adjust`) so swapping causes no layout shift.
- **Layout:** desktop rows are `168px | 1fr` with the red margin line on the label column; at ≤760 px it collapses to one column and the margin line moves to the page's left edge (see `Mobile.dc.html`).
- **Motion** (`motion.css`, values from `Main.dc.html` / `States.dc.html`):
  - Load: margin line draws (0.7 s, 110 ms stagger), headline sets line by line (90 ms), intro fades, figures count up after 700 ms (1.1 s ease-out), stamps press in at ~0.9 s.
  - Scroll: rows rise and stamps press via `animation-timeline: view()` inside `@supports`; unsupported browsers show content static. **Content is never hidden waiting for JS.**
  - Hover/focus: ballpoint underline + arrow on work rows, 6% accent wash.
  - Page change: Astro `<ClientRouter/>` with `transition:name` on the project title → becomes the case-study headline. Ink progress bar under the header only if navigation exceeds 150 ms.
  - `prefers-reduced-motion: reduce` disables all of it; count-up renders final numbers.
- **Loading states:** figures reserve their aspect ratio and show pen-ruled placeholder lines (no grey shimmer); log "load older months" button with announced results (`aria-live`); contact form idle / invalid / sending / sent ("Received" stamp) / failed (message kept).
- **Banned list is enforced** by a lint script (see §8).

## 5. Phases

Each phase ends with a Vercel preview and a review against the canvas before the next starts.

### Phase 0 — Prep (S) — done 24 Oct 2026, except the content export

- [x] Rollback point recorded: legacy site is `main` at `06fde79` (2026-03-07); last legacy production deployment `dpl_ZXiT92GCh2EKgtwRFh4n4BTGZ1nN`. (A `v1-legacy` git tag could not be pushed from the build session; create it from GitHub if wanted.)
- [x] Deleted `PORTFOLIO_VIBE_PROMPT.md` and `.github/prompts/*` (old neon-look instructions).
- [x] README rewritten for the rebuild.
- [x] Removed the personal phone number and street address from `supabase/seed_resume.sql`. **They remain in public git history** (commit `344c8a0` on `main`); purging them needs a history rewrite and force-push, which is the owner's decision.
- [ ] **Export of the legacy Supabase content.** The legacy database is in a Supabase account this build session can't reach (none of the 18 accessible projects has the portfolio tables). Options: (a) the owner exports the tables as CSV from the Supabase dashboard; or (b) the seed SQL files in git history are accepted as the backup, since all new content is written from scratch. Contact-form messages (`contact_submissions`) contain visitors' personal data and must never be committed; export them privately before the project is retired in Phase 6.

### Phase 1 — Foundation (M)
- Replace the Vite SPA with Astro + TypeScript strict + Vercel adapter. Remove three/r3f/drei/postprocessing/maath, framer-motion, shadcn/radix, dnd-kit, jspdf, react-router, next-themes, Supabase client, admin pages/hooks/contexts.
- Build tokens, fonts, `Base` layout, header, footer, ThemeSwitch, skip link, focus ring, 404, and a `noindex` `/_system` page that reproduces the system sheet.
- **Done when:** preview matches `System.dc.html`; paper/night/auto switch with no flash; Lighthouse accessibility 100.

### Phase 2 — Content (M, needs open items 2, 4, 5, 6)
- Write `profile.yaml`, 6 case studies, ~40 log entries (Mar–Oct 2026) and the pre-QTX roles. Start from the drafts in `docs/content/case-study-notes.md`.
- Screenshots: a Playwright script (`scripts/capture.mjs`) signs in to each product's demo or test environment, loads made-up fixture data (fake practice, fake residents, fake staff), and captures fixed-size PNGs. Nothing is captured from production. Where no demo environment is reachable, the case study uses its diagram only. Every image is checked by eye for names, phone numbers and emails before commit.
- Source: read-only queries on the Workable project (`time_entries.description`, `tasks.title` for the user's two accounts), rewritten as one sentence for the person using the software. Never copy client or people names, prices, or client data.
- **Done when:** you have approved every case study, log entry and screenshot.

### Phase 3 — Pages and responsiveness (M)
- Home, `/work/[slug]`, `/log` (+ per-project filter pages + RSS), `/cv` (HTML), contact section.
- Phone: menu is a disclosure button (`aria-expanded`, Escape closes, focus returns to the button); 44 px minimum targets; reflow at 320 px and 200 % zoom with no sideways scroll.
- **Done when:** screens match the canvas at 390 / 768 / 1440 in both modes; full keyboard pass.

### Phase 4 — Motion and states (M, needs open item 7)
- Everything in §4 Motion and loading states.
- Contact via Astro Action (sends to oyongrm@gmail.com through Resend; nothing stored), progressively enhanced (works without JS via normal POST). Invisible Turnstile + honeypot + rate limit; errors written under the field and announced.
- **Done when:** every state on `States.dc.html` is reproducible on the preview; CLS < 0.02; reduced-motion verified.

### Phase 5 — CV (S, needs open items 1 and 3)
- `/cv` renders from the content collections (`roles`, work bullets flagged `cv: true`, education, certifications) with `print.css` matching `CVPage1/2.dc.html`.
- `npm run cv:pdf` renders it to `public/raymundo-oyong-cv.pdf` (A4, selectable text, fonts embedded). Run as part of every content release; CI fails if any `src/content` file is newer than the PDF.
- Automated Harvard checks (§7), plus a check that no phone number appears in the PDF. Footer "CV (PDF)" links to the file.
- **Done when:** the PDF is 2 pages, passes the checks, and you've signed off the wording.

### Phase 6 — SEO, performance, launch (M, needs open item 3)
- Per-page title/description, OG images generated at build in the logbook style, sitemap, robots, JSON-LD `Person`, RSS.
- Redirects: `/blog/*` → `/log`, `/admin*` → 404.
- Vercel: connect the GitHub repo for a preview per PR (deploys are currently manual), set framework to Astro, add `TURNSTILE_SECRET`, `RESEND_API_KEY`, `CONTACT_TO`; remove `VITE_SUPABASE_*` and `VITE_TURNSTILE_SITE_KEY` after cutover (the new site key is `PUBLIC_TURNSTILE_SITE_KEY`).
- Domain: add the free alias `raymundo-oyong.vercel.app` if available and make it the canonical URL (sitemap, OG tags, CV). **Verify from a logged-out browser that it is public.** Vercel Authentication is on ("all except custom domains"); if the production URL asks for a login, change Deployment Protection so it covers preview deployments only. Previews stay protected.
- Retire the old Supabase tables and `send-contact-email` function after the backup is confirmed.
- Promote to production; instant rollback to `v1-legacy` is available.
- **Done when:** budgets in §8 pass on production.

## 6. Deletions (Phase 1 and 6)

`src/components/3d/*`, `src/components/admin/*`, `src/pages/admin/*`, `src/hooks/**`, `src/contexts/*`, `src/lib/generateCV.ts`, shadcn `src/components/ui/*`, `components.json`, `supabase/` (after backup), `vercel.json` SPA rewrite, `PORTFOLIO_VIBE_PROMPT.md`, `.github/prompts/*`.

## 7. CV rules (Harvard Extension School OCS guide)

- Language: specific, active, fact-based (quantified), easy to skim; strong action verbs.
- Never: "I"/personal pronouns, narrative style, picture, age or sex, references, lines starting with a date, unexplained abbreviations (spell out NDIS etc. on first use).
- Always: email (the guide also asks for a phone; deliberately omitted on this public PDF, by your choice), reverse chronological order, no gaps, consistent formatting, headings in order of importance, clean PDF conversion.
- Automated checks: no `\bI\b|\bmy\b|\bme\b` in CV text; every bullet starts with a verb from an allow-list; ≤ 2 pages; text extractable from the PDF.

## 8. Quality gates (CI on every PR)

- `astro check`, ESLint, Prettier.
- **Confidentiality denylist:** build fails if content contains client or people names. The list is kept out of the repo (a `DENYLIST` CI secret, newline-separated) so the names never become public.
- **Anti-template lint:** fails on `linear-gradient`, `radial-gradient`, `box-shadow`, `backdrop-filter`, emoji in headings, and the words "passionate", "cutting-edge", "leverage", "seamless".
- Playwright: visual snapshots (home, case study, log, CV × 390/768/1440 × paper/night), reduced-motion snapshot, keyboard traversal, contact form states with a mocked action, axe-core = 0 violations.
- Lighthouse CI on the preview: ≥ 98 in all categories; home JS ≤ 15 KB gzip; LCP < 1.5 s (mobile, 4G); CLS < 0.02.

## 9. Risks

| Risk | Mitigation |
| --- | --- |
| Client confidentiality | Generic names, denylist in CI, no screenshots without blur. |
| Employer timesheet figures | Rounded only; confirmed acceptable. |
| Scroll-driven animations / View Transitions not supported everywhere | Both are enhancements; content is static and visible without them. |
| Font swap shifting layout | Metric-matched fallbacks; preload two files. |
| Margin red is AA, not AAA | Used only for errors and the "In progress" stamp; never for body text. |
| Vercel login wall on the public URL | Logged-out check in Phase 6; limit protection to previews if needed. |
