# Portfolio revival — implementation plan

Status: **design approved (round 2) and open items answered, 24 Oct 2026.** Nothing below is built yet.

- Design canvas (source of truth, commentable): https://claude.ai/artifact/T6ctTPLx4F3tVGQ2pX2gue
- Snapshot of the approved artboards: [`docs/design/`](design/) — `Main` (home), `Work` (case study), `Log`, `Mobile`, `MobileMenu`, `Night*` (dark mode), `States` (motion and loading states), `System` (tokens + accessibility), `CVPage1/2` (A4 CV). Copy exact colours, sizes, spacing and copy from these files.

---

## 1. Decisions locked

| Topic | Decision |
| --- | --- |
| Direction | **Engineering logbook.** Plain paper, black ink, ballpoint-blue accent, red notebook-margin line, condensed form-style headings. No cards, shadows, gradients, glow, glass, 3D, particles, typing effects, custom cursor, skill bars. |
| Positioning | **AI and automation engineer** (changed 24 Oct 2026). Headline: "I build AI and software that does the work people shouldn't have to." Audience: hiring managers first, clients second. |
| Names | Named: **Jayne Bandy AI** (always the full name), **RL Finance**, **SEED**, **Workable**. Every other project is described generically: "workforce & care platform for an NDIS provider", "retirement-village finance", "care-plan drafting for an aged-care provider". No client people's names anywhere. |
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

### Phase 0 — Prep (S) — done 24 Oct 2026

- [x] Rollback point recorded: legacy site is `main` at `148b5c7` (2026-03-07); last legacy production deployment `dpl_ZXiT92GCh2EKgtwRFh4n4BTGZ1nN`. (A `v1-legacy` git tag could not be pushed from the build session; create it from GitHub if wanted.)
- [x] Deleted `PORTFOLIO_VIBE_PROMPT.md` and `.github/prompts/*` (old neon-look instructions).
- [x] README rewritten for the rebuild.
- [x] Removed the personal phone number and street address from `supabase/seed_resume.sql`, and purged them from all git history (rewrite + force-push of `main` and this branch, approved by the owner on 24 Oct 2026). Commit IDs changed; the legacy tip is now `148b5c7`.
- [x] ~~Export of the legacy Supabase content~~ — skipped by the owner's decision (losing it is acceptable). Contact-form messages in that database are the owner's to export privately if wanted.

### Phase 1 — Foundation (M) — built 24 Oct 2026, awaiting preview review

- [x] Vite SPA replaced with **Astro 7.4.2** (TypeScript strict) + `@astrojs/vercel` 11, static output. All legacy code, Supabase files and dependencies removed. Requires Node ≥ 22.23.4 (Vercel builds on 24.x).
- [x] Tokens in `src/design/tokens.ts` (single source; inlined as CSS; `/system` computes contrast from them).
- [x] Self-hosted variable fonts (Archivo wdth, Source Serif 4 opsz, Plex Mono 400/500) with measured fallback metrics; the two headline/body files are preloaded.
- [x] `Base` layout: no-flash theme bootstrap (paper / night / auto, follows OS changes), `<ClientRouter/>`, skip link, header, footer with theme switch, phone margin line on the page edge.
- [x] `MarginRow` and `Stamp` components; load motion (margin draw, line-by-line headline, fades, stamp press) with reduced-motion kill switch.
- [x] Pages: `/` (Phase 1 shell: hero, Now, figures), `/system` (noindex system sheet), 404 "No entry."
- [x] Scripts: `lint:design` (anti-template), `lint:denylist` (reads the `DENYLIST` secret), `verify` (axe WCAG 2.2 A/AA, no sideways scroll, reduced motion, screenshots at 390/768/1440 × paper/night). All pass locally: 0 type errors, 0 axe violations.
- [x] CI workflow `.github/workflows/ci.yml` runs all of the above on PRs and `main`.
- [ ] Owner reviews the Vercel preview against the canvas.
- Known: `npm audit` reports advisories in `@vercel/functions` / `@vercel/oidc` (adapter dependencies used only by server functions). The site has none yet; re-check before Phase 4 adds the contact action.

### Phase 2 — Content (M) — reworked 24 Oct 2026 after owner review, awaiting read-through

First version (6 case studies, 49-entry dated log, "2026 in figures" with hours and tasks) read like a weekly status report. Reworked on the owner's call:

- [x] **No effort metrics anywhere**: no hours logged, tasks closed or per-item status lists. Numbers only describe outcomes (6.5 s → 1 s, 70–80% less manual SAP work).
- [x] **Notes replace the log**: 10 short stories (`src/content/notes/*.md`): what went wrong or surprised me, and what it changed. Month and year only, no stamps. Home shows the latest 3; `/notes/` has all of them.
- [x] **Four case studies, written as stories**: § 1 The problem · Fig. 1 · § 2 What I did (headed paragraphs, outcomes not feature lists) · notes from the project. Workable and SEED are no longer case studies; their best moments are notes, and their CV bullets live under the QTX role.
- [x] **"Now"** is one line about current interests, not current tasks. The intro is about Raymundo; QTX appears in the location line and the CV.
- [x] Writing rules: `docs/content/WRITING.md` (the Harvard guide's language rules, minus the CV-only ones).
- [x] Every claim checked against its source record; three overstatements found and corrected. `lint:denylist` (41 names) passes.
- [ ] Owner reads the notes and case studies and flags anything wrong or not in their voice.
- Screenshots: still none (no demo environment reachable); diagrams carry the case studies.

**Third rework, 24 Oct 2026: skills first (owner-approved structure).** The notes and the case-study-first home still narrated QTX operations. After an interview with the owner the content model is now built around skills:

- [x] `skills.yaml`: three lead areas (Voice & conversational AI, Document AI you can trust, Process automation & RPA) and seven foundations (Solutions architecture, Software development, Integrations & payments, Data security & privacy, Data & reliability, Technical leadership, Working with clients), each with proof points.
- [x] `principles.yaml`: five "How I work" principles replace the notes. Notes, `/notes/` and `docs/content/case-study-notes.md` deleted.
- [x] Three project pages as evidence: Jayne Bandy AI, SAP & HR automation (Ortigas Land), care-plan drafting. Shape: challenge → approach → result → skills shown. The NDIS and retirement-village case studies are now one-line proof points.
- [x] Home: intro · figures (outcomes only) · § 01 What I do · § 02 How I build · § 03 Selected work · § 04 How I work · § 05 Experience (Ortigas on equal footing with QTX) · § 06 Write.
- [x] All CV bullets now live in `roles.yaml` (`highlights`, or `projects` for QTX); effort counts removed ("68 of 73 work packages", ticket rounds).
- [ ] Owner reads the preview and flags wording.

### Phase 3 — Pages and responsiveness (M) — built 24 Oct 2026, awaiting preview review
- [x] `/cv/` (HTML) from `profile` (summary, `cv` block: skills, education, certifications) and `roles`; consecutive roles at one organisation share a heading. On screen it uses the logbook frame; `@media print` gives the A4 sheet (2 pages, no "I", no phone).
- [x] Phone menu: disclosure button (`aria-expanded`, `aria-controls`), sheet with numbered links, email and theme switch; Escape closes and returns focus; the page behind is `inert`; the header pins while open; inline links remain the no-JS fallback.
- [x] `verify` now covers `/cv/`, 320 px (WCAG reflow; 390 px covers 200 % zoom) and a scripted menu pass (open, inert, 44 px targets, axe with the menu open, Escape, focus return, no state leaking across navigation).
- Original scope, kept for reference:
- Home and `/work/[slug]/` exist from Phase 2; Phase 3 adds `/cv/` (HTML), the phone menu, and checks every page against the canvas.
- Phone: menu is a disclosure button (`aria-expanded`, Escape closes, focus returns to the button); 44 px minimum targets; reflow at 320 px and 200 % zoom with no sideways scroll.
- **Done when:** screens match the canvas at 390 / 768 / 1440 in both modes; full keyboard pass.

### Phase 4 — Motion and states (M) — built 24 Oct 2026; live keys pending
- [x] Contact: `src/actions/index.ts` (validate → honeypot → best-effort per-instance rate limit → Turnstile siteverify → Resend HTTP API; nothing stored). `ContactForm.astro` posts through the action in place: idle / invalid (errors under fields, focus moves to the first) / sending / sent ("Received · dd.mm · hh:mm" stamp) / failed (message kept, mailto fallback). Without JS the form posts to `/contact/` (on-demand page) which shows the result; Turnstile needs JS, so a no-JS sender is pointed to email.
- [x] Turnstile loads only when the form is near view (home JS 12.3 KB gzip without it). Outside production the action uses Cloudflare's test keys and a dry run when `RESEND_API_KEY` is missing; in production missing keys fail closed.
- [x] Figures count up (700 ms delay, 1.1 s ease-out; whole numbers only; final value in the HTML for screen readers and no-JS). Ink line on page changes slower than 150 ms.
- [x] `verify` serves `.vercel/output/static` itself (`astro preview` can't serve a build with a Vercel function) and tests the form states with a mocked action and stubbed Turnstile.
- [x] `npm audit` clean: `overrides` pin patched `zod` (in `@vercel/cli-config`) and `path-to-regexp` (in `@vercel/routing-utils`).
- [ ] Owner adds, for **Production** only: `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET`, `RESEND_API_KEY` (optional: `CONTACT_TO`, `CONTACT_FROM`). Then a real message is sent from the production URL as the acceptance test.
- Original scope, kept for reference:
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
