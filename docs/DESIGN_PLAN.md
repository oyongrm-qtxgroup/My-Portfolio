# Design and frontend plan after the October 2026 design review

Status: **approved by the owner on 25 Oct 2026**, with the owner's inputs (portrait, repos, recommendations, LinkedIn URL) folded in. Implementation starts with Step 0. Tick each step off here as it merges. **All steps merged by 25 Oct 2026** (Step 0 in #11; Steps 1–18, the recommendations and the four repos in #12).

- Design review (64 findings, screenshots, "What to keep", "Make it pop", "Decisions for you"): https://claude.ai/artifact/Xia4cYPptqMorBu9DbTaGG
- Baseline: `main` at `73334e4`, live at https://raymundo-oyong.vercel.app (auto-deploys from `main`).
- Work branch: `claude/gracious-keller-nsc4p9` (implementation: `claude/amazing-johnson-1bop90`). One step = one pull request with a Vercel preview, one open at a time. After each merge the branch restarts from the new `main`. Nothing merges to `main` without the owner's explicit OK.
- Settled and not reopened here: the headline, all wording, the case-study facts and the title "Senior AI & Automation Engineer". This plan changes presentation, not substance. Where a step needs new words (section labels, a caption, the illustrative call), the draft is in the PR for the owner to read before merge.

Contents: 1 Decisions · 2 Calls I made · 3 Themes and de-duplicated issues · 4 What to keep, and how each step protects it · 5 Steps · 6 What I need from you · 7 How each step is checked · 8 Open items (mentioned, not fixed) · 9 Finding → step index

---

## 1. Decisions (owner's answers, 25 Oct 2026)

Answered in the planning session. Each step updates the doc it changes in the same PR, so the docs never contradict the site.

| # | Topic | Decision | Changes | Findings |
| --- | --- | --- | --- | --- |
| DS1 | GitHub repos | **Allow-list.** Only repos named in `profile.yaml` appear. Each shows name, a one-line description, primary language, "Pushed 12 Oct 2026" and a link. No star counts. | REDESIGN §1 *Content* (content was repo-only; GitHub becomes a second, build-time source) and §3 *Architecture* | M-01 |
| DS2 | Keeping repos current | **Daily, checked.** A GitHub Actions cron fetches the allow-listed repos, runs the denylist on what came back, compares with what production shows, and calls a Vercel Deploy Hook only if something changed and the check passed. It refuses to deploy while `DENYLIST` is unset. | HANDOFF *Practical notes*; a scheduled rebuild deploys production without a merge (code unchanged; only GitHub-derived dates and languages move) | M-01, M-07 |
| DS3 | Recommendation attribution | **Role and employer, plus the relationship**, e.g. "Engineering lead, QTX · worked with Raymundo on Jayne Bandy AI". No personal names. Quoted word for word with the writer's consent; each links to LinkedIn; a "See all recommendations on LinkedIn" link closes the set. No endorsement counts. | None: REDESIGN §1 *Names* and WRITING.md "No client or people names" stand as written | M-02 |
| DS4 | Portrait | **Ink-toned, in the hero's right column.** The turquoise wall is keyed out, so the figure stands on the page with no box; toned to the Paper and Night tokens ahead of time, so no CSS filters. On Paper a thin ink contour traced from the cut-out keeps the cream shirt from melting into the page; Night has no contour (it reads as a halo there). A tighter square face crop serves the phone and the share card. Approved 25 Oct 2026; the approved masters are `src/assets/portrait/raymundo-oyong-paper.png` and `-night.png` (880 × 1100, transparent, no metadata), and the square crop is the box x 140–740, y 80–680 of those masters. Desktop about 220 px wide above a ruled "Open to · Hours · Contact" block; phones 88 px beside the name line. Never on the CV PDF. | REDESIGN §2 #6 *Visuals* gains a portrait; §7 *no picture* on the CV stands and gets an automated check | G-01, H-01 |
| DS5 | Proof band | **One "Proof" band after Experience:** Intro → Selected work → Experience → Proof (repos, then two or three quotes) → Capabilities → Principles → Contact. A quote that names a project also appears on that project's page (one at most). No new nav item. | FIX_PLAN **D4** home order | M-01, M-02 |
| DS6 | Portrait uses | Home hero, **home share card** (replaces the "RO" monogram), **JSON-LD `Person.image`**, and the **/cv/ web page** (hidden by the print stylesheet). Not the 404. | REDESIGN §7 stands (PDF photo-free) | G-01, I-01, M-03 |
| DS7 | Red in figures | **Margin red for failure edges only:** the dotted line of a failure branch and its label ("system down / slot just taken"). Boxes stay ink. The line is dotted and labelled, so colour is never the only cue. | REDESIGN **§4** ("diagram highlights use ink" stays true for highlights) and **§9** risk row (margin red: errors, "In progress" stamp, **failure paths in figures**); /system/ swatch note | C-01, G-06 |
| DS8 | Wide screens | **One full-height margin rule from 1100 px up; max width stays 1240 px.** The rule sits at the rail edge behind header, rows and footer; the per-row draw-down stays as the load motion. Phones keep no edge line (D12). The case-study notes column already fits inside 1240 px. | REDESIGN **§4** *Layout* (one line) | V-03 |
| DS9 | Illustrative call | **Publish, labelled.** Eight to ten turns written from scratch (not from the licensed script library, not from test-call transcripts), invented practice, names, dates and tool output, headed "Illustrative call · invented names, times and practice". The owner reads it before merge. The same rule covers the Ziaris worked shift (G-05): invented, no rates or people, labelled. | FIX_PLAN **D15** gets a note: invented, labelled illustrations are allowed; recordings and screenshots stay ruled out | G-03, G-05 |
| DS10 | CV name | **"Raymundo Oyong" everywhere**, including the /cv/ page and the PDF. | `profile.yaml` `cv.name`; PDF regenerated | M-06 |
| DS11 | Font loading | **`font-display: optional` on Archivo, plus Apple and Android condensed fallbacks with measured `size-adjust`**, so a slow first visit still looks close and a late font can never move the page. | REDESIGN **§4** *Fonts* ("swap with metric-matched fallbacks") and **§9** risk row | T-01 |
| DS12 | Capabilities | **Proof grid.** Rows: the ten areas, lead areas first and set larger, each with its one-line summary as written. Columns: Jayne Bandy AI, Ziaris, SAP & HR, Other QTX work, Earlier roles. A filled dot links to the paragraph that proves it; a ring means used but not written up. Phones: a list per area with project tags. No numbers. | FIX_PLAN **D4** ("one line per area") and WRITING.md *Skill* shape (presentation only; the summaries are unchanged) | H-06, G-08 |
| DS13 | GitHub account | **`github.com/oyongrm-qtxgroup`**, where the code is. Replaces `github.com/oyong1926` in `profile.yaml`, the site and the CV (Step 0). Candidates to list once public: My-Portfolio (public), portpeek, Clear-Path, Craft-Track (owner will publish all three after the fixes in Step 5). | `profile.yaml` `links.github` | M-01 |
| DS14 | LinkedIn URL | **`https://www.linkedin.com/in/raymundo-oyong/`**, claimed 25 Oct 2026. Replaces the auto-generated URL everywhere (Step 0). Recommendations link to `…/in/raymundo-oyong/details/recommendations/`. | `profile.yaml` `links.linkedin`; FIX_PLAN T7 "Vanity LinkedIn URL" closed | M-02 |
| DS15 | Quotes | **Three excerpts, all from Ortigas Land colleagues:** a senior colleague (hardworking, reliable, eager to learn), a same-team colleague (takes full ownership, quality and attention to detail), and a same-team colleague on RPA and .NET (on the SAP & HR page). One or two sentences each, never the full text; "Read the full recommendation on LinkedIn" after each. Not quoted: a one-line one hidden on LinkedIn; one from a client that claims machine-learning work the site doesn't show; one from a classmate that claims eight years of AI work (contradicts the timeline) and uses a banned word. | none (DS3 applies) | M-02 |

**This plan unbans nothing in `npm run lint:design`.** The portrait is toned at build time (no `filter:`); figures are flat SVG strokes (no gradients or shadows); the only blend mode used (`mix-blend-mode`) is not on the list. One possible exception is flagged in Step 6: a verbatim recommendation that contains a banned word ("passionate", "seamless"…). The default is to pick a different quote; an exemption scoped to quote text happens only on your OK.

---

## 2. Calls I made for you (object when reviewing if you disagree)

1. **One contact set, and a slimmer footer where a contact block sits directly above it** (H-07, N-02, N-06). Email, LinkedIn, GitHub and CV come from one component used in Contact, the case-study closing block and the phone menu. On the home page and case studies the footer then drops to colophon, Privacy and theme switch; /cv/, /privacy/ and the 404 keep the full footer. This revises FIX_PLAN Step 2's "footer leads with name, email, LinkedIn and CV" on those two page types.
2. **Margin notes restate facts from the paragraph beside them** (C-04): "4 tools the agent may call", "Finance approves line by line". WRITING.md's "state each fact once" gets an explicit exception for a note that pulls out a fact from the paragraph it sits next to. No new facts, no numbers that aren't already in that paragraph.
3. **Repo one-liners are written in `profile.yaml`** (DS1), checked by CI like all other content. GitHub's own description is used only when a repo has no line there. That way the daily rebuild changes dates and languages only, never wording.
4. **`lint:denylist` fails closed in CI** once the `DENYLIST` secret is set (today it skips silently when the variable is empty). It lands in Step 5, which pulls in outside content, and Step 5 doesn't merge until the secret exists.
5. **Plex Mono 600 isn't shipped.** Figure titles use 500 and the box weight carries emphasis (C-02).
6. **No italic is shipped.** Quotes are set upright with a hanging quote mark; a lint rule rejects `<em>` and `*text*` in content (T-05).
7. **The phone menu threshold stays at 760 px**, proven by a verify check at 899 px, rather than moving to 900 (F-01).
8. **Privacy reuses the home share card** instead of a half-empty card of its own (I-01).
9. **Site dates read "2026 – now", "2024 – 25"** from one date component (H-05). The CV keeps its month format ("January 2026 – Present").
10. **Rings in the proof grid come only from what the CV bullets already say.** You check each ring in the PR (DS12).
11. **Token scales arrive with the first new component** (Step 7), not at the end: new figures, the timeline and the grid use space, rule and type tokens from day one. Snapping the existing literals to those scales stays last (Step 18): it touches every file and nobody sees the difference.

---

## 3. Themes and de-duplicated issues

The 64 findings reduce to 50 issues in 7 themes. V-01 (the site is text only) is the umbrella for themes T3–T6 and is closed when they are. F-07 (verify misses these regressions) is split across Steps 1–3, each check landing with the fix it guards.

| Theme | Issue | Findings | Evidence kept |
| --- | --- | --- | --- |
| **T1 Measured regressions and layout bugs** | Font swap moves the page on phones | T-01, F-07 (CLS) | CLS 0.069 on /, 0.038 case study, 0.032 /cv/ on a throttled phone; budget < 0.02 (REDESIGN §8) |
| | Header mono swaps late | T-04 | Plex Mono 2 × 15 KB, not subset or preloaded |
| | Headline staircases at 320 px | T-03 | `.ln { display: inline-block }` per line |
| | Stack and "Built with" break badly | H-04, C-03 | "· Supabase" line starts; "GPT-" / "5.5" on the flagship page |
| | Opening the phone menu shifts the header | N-01 | Wordmark +20 px, button −24 px |
| | Extra gap above first sub-heading | C-05 | `h3:first-child` never matches after the hidden `<h2>` |
| | Phone hero buttons mismatched | H-02 | 320 and 390 px shots |
| | Experience dates look truncated | H-05 | "2026–" |
| | Caption repeats label; faux-bold mono | C-06, C-02 | Flow.astro figcaption; weight 700 with only 400/500 loaded |
| | Work-row wash lopsided | S-02 | `padding: 22px 12px 22px 0` |
| | Rail labels become stubs on phones | V-04 | "IN / FIGURES" from forced `<br>` |
| | Straight quotes in a principle | H-08 | principles.yaml:18 |
| **T2 States, accessibility, print** | Hover sticks on touch; buttons go blue | S-01, V-05 | Blue on Send and hero buttons breaks D12 |
| | Sending state washed out | S-03 | Hover blue + 70% opacity |
| | Focused invalid field shows blue | S-04 | Focus overrides `[aria-invalid]` |
| | Sent stamp date format | S-05 | "25.10 · 03:23" |
| | `aria-current="page"` on a section link | N-03 | "Work" on /work/* |
| | Theme switch semantics, storage fallback, browser chrome | N-04, N-05 | Three toggles for one choice; blocked storage resets to Auto; theme-color ignores the choice |
| | 40-word link names on work rows | F-03 | Whole row is one `<a>` |
| | `lang="en"` | F-05 | WRITING.md uses UK/Australian spelling |
| | Visited links look unvisited | F-06 | `a { color: inherit }` |
| | No print stylesheet; Night prints grey | M-04 | Home 5 pages incl. the form; case study 4 pages |
| **T3 Identity** | No face anywhere | G-01, I-01 (home card), M-03 (`Person.image`) | JSON-LD image is the share card |
| | Hero right side empty; availability easy to miss | H-01 | 1440 px fold |
| | Two spellings of the name | M-06 (name) | "Raymundo M. Oyong" on /cv/ only |
| | Freshness dates | M-07 | Footer date is the build date; a daily rebuild would change it daily |
| **T4 Proof** | Code is only a text link | M-01 | GitHub link in Contact only |
| | No third-party voice | M-02 | None on any page |
| **T5 Figure system** | Figures hide the model/code boundary and the failure path | C-01, C-02, F-04, G-02, G-06 | Five equal boxes; failure path a separate strip; all six figures alike |
| | Evaluation not drawn | G-04 | Text only |
| | Ziaris rules engine not shown | G-05 | Text only |
| | Behaviour described, never shown | G-03 | Turn-taking, date resolution, name check, callback |
| | Notes column empty | C-04 | 240 px column reserved, unused |
| | No reading aids on 5,000 px phone pages | C-08 | h3 ids exist, nothing links to them |
| | Weak next link; empty case-study hero | C-09, C-10 | 13 px mono link |
| **T6 Home rhythm** | Every band the same weight | V-02 (and V-01) | Six rows, one recipe |
| | Figures are dead ends | H-03 | "3", "70–80%", "100+ h" unlinked |
| | Capabilities read as a spec sheet | H-06, G-08 | Ten equal rows, links on half |
| | "Skills shown" loud, weak destination | C-07 | 22 px blue links back to one-line rows |
| | Eight years not visible at a glance | G-07 | Experience list only |
| | CV page: no persistent download | M-06 (download) | Link scrolls away |
| | Contact details repeated, different sets | H-07, N-02, N-06 | Home ends with two copies; menu has email only |
| | Wide screens float, rule breaks per band | V-03 | 1920 px shot |
| **T7 Edges** | Share cards interchangeable; tiny footer line | I-01 (rest) | Six cards, one silhouette |
| | Favicon blurs; no PNG, ICO or manifest | I-02, M-05 | System-font "RO", half-pixel rule |
| | 404 bare | I-03 | Three small links |
| | Structured data thin | M-03 (rest) | No Article, BreadcrumbList, WebSite, sitemap `lastmod` |
| | No type, space, rule or motion scale | T-02, F-02 | ~25 literal sizes, 12 spacings |
| | Breakpoints scattered | F-01 | 640, 760/761, 900, 1040, 1100 in nine files |
| | Italic would be synthesised | T-05 | Upright Source Serif only |

---

## 4. What to keep, and how each step protects it

The review's "What to keep" list, with the step that comes closest to each item and the check that keeps it intact. Any PR that breaks one of these doesn't merge.

| Keep | Nearest steps | Guard |
| --- | --- | --- |
| Token system, measured contrast | 7, 18 add scales; palettes unchanged | `tokens.ts` palette object byte-identical; /system/ contrast table unchanged; new colours: none |
| Type trio (Archivo condensed, Source Serif 4, Plex Mono) | 1 changes loading only | Same three families; subset Plex Mono checked glyph-for-glyph against what the site uses |
| Red margin rail and its single draw-down | 15 adds a full-height rule | Draw-down kept as the load motion; reduced motion shows the static rule; desktop only |
| Work-first home order, plain section names (D4, D10) | 5 inserts Proof after Experience; 12 changes weights | Selected work stays the first section after the intro; Proof has no nav item |
| No-flash theming, Auto default, two designed themes | 3 (N-04, N-05) touches the bootstrap | Existing "theme applied" check, plus a storage-blocked run; every screenshot set in both themes |
| Header tuck/return; phone menu accessibility | 2 (N-01), 12 (menu foot) | Existing menu and scroll checks, plus header position stable on open |
| Reduced motion stops everything | 3, 8, 17 add small motions (sending line, 404 stamp) | Reduced-motion check extended from / to a case study, /cv/ and the 404: 0 running animations |
| Contact form states | 3 (S-03, S-04) | Existing invalid / sent / failed checks, unchanged assertions |
| Performance discipline | 4 (portrait), 7–11 (inline SVG) | Home JS ≤ 15 KB gzip; no new client script except where named; portrait not preloaded and not the LCP element; LCP and CLS measured per step |
| Stamps used sparingly; case-study spine | 7–11, 17 | At most one stamp mark per figure; the call sits inside the figures part of the spine (challenge → figures → approach → result) |
| Reflow, no sideways scroll; phone layout from 900 px down | all | Overflow check at 320 / 390 / 768 / 1024 / 1440 / 1920 |
| CV pipeline and ATS checks; PDF photo-free | 4, 14 | `cv:pdf` gains "no images in the PDF" (`pdfimages -list` empty); all existing checks |

---

## 5. Steps

Order: impact on getting interviews first, effort second. Every step leaves the live site strictly better on its own. Steps 4–6 wait on inputs from you (§6); if those aren't ready, Steps 7–11 can go first without breaking anything.

Changes from the suggested order, and why:
- **Token scales move into Step 7** (the first new component), so the figures, grid and timeline don't add new literals; only the clean-up of old literals stays last.
- **The illustrative call (Step 8) comes before the other figures**, because it's one of the three highest-impact items and only needs the Jayne Bandy AI page.
- **The footer date (M-07) lands with the GitHub cron (Step 5)**, because a daily rebuild would otherwise change "Updated" every day.
- **The skills-tag change (C-07) moves to the proof grid step (13)**, since its new destination is a grid row.

Effort: S under half a day, M one to two days, L more. "Identity risk" is risk to the logbook look and voice.

### Step 0: Correct the LinkedIn and GitHub links (S, identity risk none; do first) — merged 25 Oct 2026 (#11)

- **Why first:** the LinkedIn custom URL was claimed on 25 Oct 2026, and LinkedIn generally stops honouring the old auto-generated URL once a custom one is set. The live site and the CV PDF header still print the old URL, and the GitHub link points at `oyong1926`, not the account that holds the code (DS13, DS14).
- **Changes:** `links.linkedin` → `https://www.linkedin.com/in/raymundo-oyong/`, `links.github` → `https://github.com/oyongrm-qtxgroup`. That one source feeds the footer, the home Contact section, JSON-LD `sameAs`, /cv/ and the PDF. Regenerate the PDF; mark FIX_PLAN T7 "Vanity LinkedIn URL" done.
- **Files:** `src/content/profile.yaml`, `public/raymundo-oyong-cv.pdf` (+ `.sha256`), `docs/FIX_PLAN.md`.
- **Verified by:** `pdftotext` shows both new URLs in the CV header, and the PDF link annotations point to them; a grep of the build finds neither old URL; standard checks.
- **Needs from you:** your OK to ship it ahead of the rest. Optional: open the old LinkedIn URL in a logged-out browser to see whether it still resolves.

### Phase A: defects and measured regressions

#### Step 1: No jump on phones (S–M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** T-01, T-04, T-03, F-07 (CLS check, 1024 and 1920 widths).
- **Changes:**
  - `font-display: optional` on Archivo (DS11). Fallback stack in order: Arial Narrow, Avenir Next Condensed (Apple), Roboto Condensed / sans-serif-condensed (Android), Arial; each its own `@font-face` with measured `size-adjust` and ascent/descent overrides.
  - Re-measure Source Serif's fallback on Android (no Georgia there); add a Noto Serif-matched face if it shifts.
  - Plex Mono subset like the other two (`scripts/subset-fonts.sh`) and the 400 weight preloaded.
  - At ≤ 480 px, `.ln { display: inline }` so the headline balances as one block.
  - New `scripts/perf.mjs`: Playwright, throttled phone (150 ms RTT, 1.6 Mbps, 4× CPU, 390 × 844 @3x), cold cache, 5 runs each on /, /work/jayne-bandy-ai/ and /cv/; prints CLS and LCP per run; fails at CLS ≥ 0.02.
  - In `verify`: one deterministic worst case per route (font responses delayed 2 s), CLS must be < 0.02; widths gain 1024 and 1920.
- **Files:** `src/styles/fonts.css`, `scripts/subset-fonts.sh`, `src/assets/fonts/` (Plex Mono subsets), `src/layouts/Base.astro`, `src/pages/index.astro`, `scripts/perf.mjs` (new), `scripts/verify.mjs`, `package.json` (`perf` script), `docs/REDESIGN_PLAN.md` §4 and §9.
- **Verified by:** CLS before and after on the throttled profile (target 0 on every run); the delayed-font run failing on `main` and passing on the branch; 320 px headline shots; font bytes before and after; a check whether a late-arriving Archivo is picked up after an in-site navigation (ClientRouter) or only on the next full load, reported in the PR.
- **Needs from you:** a look at the preview on your own phone. The Apple condensed face can't be measured here (it isn't available on Linux), so its `size-adjust` comes from published metrics; with `optional` that only affects how a slow first visit looks, not CLS.

#### Step 2: Layout bugs (M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** H-04 and C-03, N-01, C-05, H-02, H-05, C-02, C-06, S-02, V-04, H-08, F-07 (header, stack and quote checks).
- **Changes:**
  - New `StackList` component: a `<ul>`, each item `white-space: nowrap`, separators drawn by `li + li::before`, used in work rows and the case-study "Built with". At ≤ 900 px "Built with" takes the full row.
  - Phone menu: when the header pins, inset by the wrap padding instead of adding it again.
  - `.prose :is(h3:first-child, .visually-hidden + h3) { margin-top: 0 }`.
  - Hero buttons at ≤ 480 px: two equal columns.
  - One date component: "2026 – now", "2024 – 25", tabular figures, derived from `start`/`end` in `roles.yaml`.
  - Figure titles at 500 (no faux bold); captions carry the sentence only.
  - Work-row wash and focus ring with even 12 px insets, text still on the column line.
  - Rail labels at ≤ 900 px: hidden where a visible heading follows, one line elsewhere ("Selected work · 3"); the `<br>` applies only in the rail.
  - Curly quotes in principles.yaml.
  - New verify checks: header box (x, y, width) equal before and after opening the menu; no rendered line in a stack or meta list starts with "·" and no item breaks inside; no straight double quote in rendered prose.
- **Files:** `src/components/StackList.astro` (new), `WorkRow.astro`, `src/pages/work/[slug].astro`, `SiteHeader.astro`, `Section.astro`, `Flow.astro`, `MarginRow.astro`, `src/pages/index.astro`, `src/content/principles.yaml`, `src/styles/base.css`, `scripts/verify.mjs`.
- **Verified by:** each new check shown failing on `main` and passing on the branch; before/after shots of the work rows, meta grid, menu open/closed, and the first sub-heading at all six widths in both themes.
- **Needs from you:** nothing.

#### Step 3: States, accessibility and print (M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** S-01, V-05, S-03, S-04, S-05, N-03, N-04, N-05, F-03, F-05, F-06, M-04, F-07 (print check).
- **Changes:**
  - Hover rules inside `@media (hover: hover)`; touch gets an `:active` 2 px ink inset.
  - Buttons never turn blue: hover inverts ink and paper (D12, blue for links only).
  - `.send:disabled` wins over hover: ink at full opacity, "Sending…", and the ink-progress line under the button (no line under reduced motion).
  - `[aria-invalid="true"]:focus-visible`: 3 px margin-red underline plus a 2 px outline.
  - Sent stamp "Received · 25 Oct, 03:23".
  - `aria-current="true"` for section links.
  - One `theme-color` meta set by the bootstrap from the active theme.
  - Theme switch as a radio group, with an in-memory fallback the bootstrap reads when storage throws.
  - Work-row link is the title, with its hit area stretched over the row; the rest is description.
  - `lang="en-AU"`.
  - A quiet visited state on case-study links (arrow turns ink-2).
  - Print stylesheet for all site pages: paper tokens forced, nav, buttons, form, menu and theme switch hidden, external URLs printed after links, no breaks inside figures or notes, rail kept on A4. Target: a case study on 3 pages.
  - Verify: print-to-PDF page count for each case study (≤ 3); a storage-blocked run of the theme switch; reduced-motion check on more routes.
- **Files:** `ContactForm.astro`, `src/pages/index.astro`, `WorkRow.astro`, `SiteHeader.astro`, `ThemeSwitch.astro`, `src/layouts/Base.astro`, `src/styles/base.css` (or a new `print.css`), `scripts/verify.mjs`.
- **Verified by:** existing contact-state checks unchanged and passing; screenshots of sending and invalid in both themes; axe with the theme switch as a radio group; a screen-reader link list for the home page (title-only names); printed PDFs of /, each case study and /privacy/ from Night mode, attached to the PR.
- **Needs from you:** nothing.

### Phase B: proof and identity

#### Step 4: Portrait and the hero (M, identity risk low–medium) — merged 25 Oct 2026 (#12)

- **Findings:** G-01, H-01, I-01 (home card), M-03 (`Person.image`), M-06 (name, DS10), M-07 ("Availability checked").
- **Changes:**
  - The approved masters were made in the planning session (wall keyed out, 4:5 crop, grayscale with raised contrast, toned to the Paper and Night tokens, ink contour on Paper) and committed with this plan; the original photo is not in the repo. Astro `<Picture>` and sharp derive every size and the square face crop from the masters. If the contour looks rough at the hair at real size, it may be smoothed (blur and re-threshold the outline) without changing the look.
  - Astro `<Picture>` serves AVIF/WebP with width and height. Both tones are in the markup; the inactive one is `display: none` and lazy, so only the visible one downloads. Not preloaded, so the lede stays the LCP element.
  - Hero right column (DS4): portrait, then three ruled lines in the `.sidenote` style: "Open to · …", "Hours · UTC+8", "Contact · email". The availability wording stays exactly as in `profile.yaml`; only its placement changes. "Availability checked Oct 2026" from a new `availabilityChecked` field.
  - Phones: 88 px beside the name line, the block before the lede.
  - Home share card: the portrait in the margin column instead of "RO".
  - JSON-LD `Person.image` points at a stable portrait URL.
  - /cv/ web page: portrait in the header, hidden in print.
  - `cv.name` becomes "Raymundo Oyong"; PDF regenerated.
  - `cv:pdf` gains a no-images check.
- **Files:** `src/assets/portrait/` (approved masters, already committed), `src/pages/index.astro`, `src/pages/cv.astro`, `src/pages/og/[slug].astro`, `src/content/profile.yaml`, `src/content.config.ts`, `scripts/cv-pdf.mjs`, `public/og/index.png`, `public/raymundo-oyong-cv.pdf` (+ `.sha256`), `docs/REDESIGN_PLAN.md` §2 and §7.
- **Verified by:** `exiftool` (or sharp metadata) on the committed files shows no metadata; LCP element still the lede on phone and desktop; image bytes per width; shots at all six widths in both themes; the PDF check failing when a test image is added to the print view; home card at 500 px wide.
- **Needs from you:** nothing beyond a look at the preview; the proof was approved on 25 Oct 2026. Alt text: "Raymundo Oyong".

#### Step 5: Code on GitHub (M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** M-01, M-07 (footer date), the repos half of DS5.
- **Changes:**
  - `profile.yaml` gains `github.repos: [{ name, line? }]` (DS1, call 3).
  - A build-time loader makes one request (`GET /users/oyongrm-qtxgroup/repos?per_page=100`, optional `GITHUB_TOKEN` in Vercel for the rate limit) and keeps only allow-listed repos: `pushed_at`, `language`, `archived`, `html_url`, and `description` only where no `line` is set.
  - If the API fails, the build uses the committed snapshot (`src/data/github-snapshot.json`, refreshed in each PR). An allow-listed repo that is private or missing from a good response is left off with a build warning (see the allow-list below).
  - The build emits `/github.json` (exactly what the page shows) for the cron to compare against.
  - Proof band after Experience (DS5), repos half: name, line, language, "Pushed 12 Oct 2026", link. A line under Experience on /cv/ (screen only).
  - `.github/workflows/refresh.yml`: daily cron at about 03:17 UTC+8, plus manual run. It fetches the same data, runs the denylist on it (fails if `DENYLIST` is unset), compares with production's `/github.json`, and only on a difference calls the hook from the `VERCEL_DEPLOY_HOOK` secret (DS2).
  - Footer "Updated" from a `updated` date in `profile.yaml`, not the build date (M-07).
  - `lint:denylist` fails in CI when `DENYLIST` is empty (call 4).
- **Files:** `src/content.config.ts`, `src/lib/github.ts` (new), `src/data/github-snapshot.json` (new), `src/pages/github.json.ts` (new), `src/pages/index.astro`, `src/pages/cv.astro`, `src/components/SiteFooter.astro`, `src/content/profile.yaml`, `scripts/github-refresh.mjs` (new), `scripts/lint-denylist.mjs`, `.github/workflows/refresh.yml` (new), `docs/REDESIGN_PLAN.md` §1 and §3, `docs/HANDOFF.md`.
- **Verified by:** builds with the API reachable, unreachable (snapshot used) and with an allow-listed repo still private (left off, warning shown); `github-refresh.mjs --dry-run` reporting "no change" and "changed" against a saved copy; the denylist run on the fetched data with a planted test name. Scheduled workflows only run from `main`, so the first real run is a manual one right after merge, watched with you.
- **Allow-list (DS13):** My-Portfolio, portpeek, Clear-Path, Craft-Track, each listed only once it is public. The loader skips a private or missing allow-listed repo with a build warning rather than a failure, so publishing them can happen in any order. Before you flip each one to public:
  - **portpeek:** commits are authored with your work email and the app id is `group.qtx.portpeek`, so confirm QTX is happy for it to be yours to publish under MIT. Its history keeps old test fixtures with a local Windows path and two project folder names (both names are on the allowed list); fine to leave, or squash the history first.
  - **Clear-Path:** clean. Add a licence (e.g. MIT) so "public" also means "reusable".
  - **Craft-Track:** the README badge says "License: Proprietary" and names the family studio. Change the licence if you mean it to be open, and swap the 15 seed phone numbers (real-format Philippine mobiles) for obviously fake ones. I can prepare both changes as a PR on that repo if you want.
  - All three: no secrets, keys or committed `.env` files in any commit (scan of 25 Oct 2026). The scan doesn't replace the denylist run; that waits for the secret.
- **Needs from you:**
  - A one-line description per repo for `profile.yaml`, or approval of the drafts in the PR.
  - The **`DENYLIST` Actions secret** set (merge prerequisite; what goes in it is in §6).
  - A **Deploy Hook** (how to create it is in §6) stored as the `VERCEL_DEPLOY_HOOK` Actions secret.
  - Optional: a read-only `GITHUB_TOKEN` in Vercel.

#### Step 6: In their words (S–M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** M-02, the quotes half of DS5, T-05 (lint rule).
- **Changes:**
  - New `src/content/endorsements.yaml` collection: `quote`, `role`, `employer`, `relationship`, optional `work` reference, `source_url`, `consented` (date, required) and `checked` (date). The schema refuses an entry without consent.
  - Two or three on the home Proof band; at most one on a case study, where `work` is set.
  - Set in Source Serif at 22 px, upright, with a hanging opening quote mark in the rail, a 1.5 px ink top rule and the attribution in mono (DS3).
  - "Read on LinkedIn ↗" per quote and "See all recommendations on LinkedIn" after the set, both to your recommendations page.
  - Quotes stay word for word. A cut is marked "…"; a bracketed substitution ("[the client]") is used only with the writer's OK of the edited text.
  - Lint rejects `<em>` and `*text*` in content.
- **Files:** `src/content/endorsements.yaml` (new), `src/content.config.ts`, `src/components/Quote.astro` (new), `src/pages/index.astro`, `src/pages/work/[slug].astro`, `scripts/lint-design.mjs`, `docs/content/WRITING.md` (a *Quote* shape).
- **Verified by:** denylist on the quotes (must pass before the PR opens); straight-quote check; `lint:design` with no exemptions; shots in both themes at all widths; axe (a quote is a `<figure>` with `<blockquote>` and `<figcaption>`).
- **Selection (DS15):** two excerpts on the home Proof band (senior colleague; same-team colleague on ownership) and the RPA excerpt on the SAP & HR page. All three are from Ortigas Land, so they back the RPA and team years; none speaks to the AI work yet.
- **Needs from you:**
  - Each writer's consent to be quoted on the site, with the date. Writers' names never go into the repo.
  - Your OK on each attribution line, e.g. "Senior colleague, Ortigas Land" and "Same team, Ortigas Land".
  - Worth asking for, not blocking: a recommendation from a QTX colleague who has seen the Jayne Bandy AI or Ziaris work. That's the missing third-party voice for the AI roles. A QTX quote that names a client would be cut with "…".
  - None of the three excerpts contains a banned word, so no `lint:design` exemption is needed.

### Phase C: the figure system

#### Step 7: Figure component and the Jayne Bandy AI figure (L, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** C-01, F-04, C-02 (superseded), the token-scale half of F-02 and T-02 (new tokens only).
- **Changes:**
  - New `Figure` component that renders inline SVG from a small spec: nodes, lanes, edges, callouts, with a wide and a narrow placement for each node.
  - The grammar: solid 1.5 px ink box = deterministic code; dashed box = model-driven; a stamp-style box = a person approves; dotted margin-red edge = failure path (DS7); circled numerals that match bold run-ins in the prose.
  - Colours from tokens, so it themes and prints.
  - Accessibility: `role="img"` labelled by the figcaption, plus a visually hidden ordered list of the real steps and the failure path.
  - Jayne Bandy AI Fig. 1 and Fig. 2 become one figure with the failure branch (caller → voice layer → agent ⇄ tools ⇄ practice system; on failure, the agent apologises and the team is asked to call back), drawn only from facts already on the page.
  - Space, rule, type and motion scales added to `tokens.ts`, rendered as custom properties, shown on /system/, used by `Figure`.
  - /system/ gains the figure legend.
- **Files:** `src/components/Figure.astro` (new), `src/lib/figure.ts` (layout from spec, new), `src/content/work/jayne-bandy-ai.mdx` (figure spec and the circled-numeral markers; no wording changes), `src/design/tokens.ts`, `src/pages/system.astro`, `docs/REDESIGN_PLAN.md` §4 and §9.
- **Verified by:** figure at 320, 390, 768, 1024, 1440, 1920 in both themes, and printed; no sideways scroll at 320; a screen reader reading the hidden list (NVDA or VoiceOver transcript in the PR); red used only on failure edges (a test over the SVG); HTML weight added per page.
- **Needs from you:** a read of the figure against the facts.

#### Step 8: Illustrative call (M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** G-03 (DS9).
- **Changes:**
  - Between Fig. 1 and The approach: a logbook transcript of 8–10 short turns in Source Serif, speaker labels in mono (CALLER / AGENT), tool calls as mono lines with plain invented names that match the page's wording, e.g. `find free slots (day: Tue 3 Nov)`.
  - Margin notes point at turns: "confirms the caller's name before booking", "relative date resolved from today's date", "the tool result, not the model, decides the slot", and an apology-and-callback turn.
  - Headed "Illustrative call · invented names, times and practice".
- **Files:** `src/components/Transcript.astro` (new), `src/content/work/jayne-bandy-ai.mdx`, `docs/FIX_PLAN.md` (D15 note).
- **Verified by:** denylist; a check that no number in the transcript looks like a phone number (the CV's phone pattern reused); shots; screen reader order (turn, then its note); your read-through.
- **Needs from you:** confirm that the wording isn't from the licensed script library. I'll write it fresh, and won't use the test-call transcripts at all (open item).

#### Step 9: The other figures (M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** G-06, G-04, G-05, and C-01 on the remaining pages.
- **Changes:**
  - SAP & HR: "HR APPROVES" as the stamp box, the strongest mark in the figure; the exception exit as a red dotted branch to "left for a person".
  - Ziaris Fig. 1 in the same grammar.
  - The evaluation gate on Jayne Bandy AI: plain-English request → 4–5 scripted scenarios and comparison with past calls → LLM judge (dashed) → admin reads results (APPROVED / SENT BACK) → version saved, restorable.
  - Ziaris worked shift as an invented ledger, no money (DS9): "Sat, 7:00–15:00, worker A, participant B" → pay lines named by rule → one invoice line by funding type → MYOB export row, labelled "Illustrative shift; no real rates or people".
  - `Flow.astro` removed once unused.
- **Files:** `src/content/work/sap-automation.mdx`, `src/content/work/ziaris.mdx`, `src/content/work/jayne-bandy-ai.mdx`, `src/components/Ledger.astro` (new), `src/components/Flow.astro` (removed).
- **Verified by:** as Step 7; no currency symbol or amount in the ledger (a test); your read-through.
- **Needs from you:** a read of each figure against the facts.

#### Step 10: Margin notes and reading aids (M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** C-04, C-08.
- **Changes:**
  - Two or three notes per section, each pulling out a fact from the paragraph beside it (call 2), e.g. "4 tools the agent may call", "3 practice systems, 1 script", "15-minute health check", "Callers told it's an AI at the start"; Ziaris "Finance approves line by line"; SAP "Stops on an unexpected screen". On phones they sit after their paragraph, as the component already does.
  - "On this page": sticky in the rail at ≥ 900 px, a compact list under the meta on phones, built from the h3 ids.
- **Files:** `src/content/work/*.mdx` (`notes` props), `Section.astro`, `src/pages/work/[slug].astro`, `docs/content/WRITING.md` (the note exception).
- **Verified by:** each note traced to its paragraph in a table in the PR; sticky contents not covering the tucked header; anchor links landing below the header; shots.
- **Needs from you:** a read of the notes.

#### Step 11: Project glyphs (M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** G-02, C-09, C-10, I-01 (work cards).
- **Changes:**
  - A 120 × 80 abstract drawing per project, generated from its figure spec (no labels).
  - Placed in the work rows (number column on desktop, above the title on phones), the case-study hero at about 280 px with the LIVE / SHIPPED stamp over its corner, a next-project panel (number, title in display type, short line, glyph), and the work share cards.
- **Files:** `src/components/Glyph.astro` (new), `src/lib/figure.ts`, `WorkRow.astro`, `src/pages/work/[slug].astro`, `src/pages/og/[slug].astro`, `public/og/*.png`.
- **Verified by:** glyphs from the same spec as the figures (a test renders both); cards at 500 px; shots.
- **Needs from you:** nothing.

### Phase D: home rhythm

#### Step 12: Home rhythm and one contact set (M, identity risk medium) — merged 25 Oct 2026 (#12)

- **Findings:** V-02, H-03, H-07, N-02, N-06.
- **Changes:**
  - Work rows larger (title 40–44 px on desktop, glyph, more air); Principles at pull-quote scale; Contact as the closing statement. Rail and rules stay throughout.
  - Each figure links to its case study.
  - One `ContactSet` (call 1): footer slims where a contact block sits directly above. The phone menu foot gets Download CV as the one button, then email, LinkedIn, GitHub, availability and theme switch, with 56 px link rows.
- **Files:** `src/pages/index.astro`, `WorkRow.astro`, `src/components/ContactSet.astro` (new), `SiteFooter.astro`, `SiteHeader.astro`, `src/pages/work/[slug].astro`.
- **Risk:** this changes the page everyone sees first. Mitigation: before/after phone and desktop page heights and full-page shots side by side with `main`.
- **Verified by:** shots; existing menu checks plus "menu foot fits above the fold at 320 × 568"; each contact link appears once per screen-end (a test).
- **Needs from you:** a look at the preview.

#### Step 13: Proof grid (M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** H-06, G-08, C-07 (DS12).
- **Changes:**
  - Capabilities as a real `<table>` with row and column headers. Each dot is a link with an accessible name ("Shown in Jayne Bandy AI") to the proving paragraph or Experience row.
  - Lead areas set larger.
  - Phones: a list per area with project tags.
  - `skills.yaml` proof points gain an optional `where` (`qtx`, `earlier`) for those without a project page.
  - "Skills shown" on case studies become quiet mono tags linking to their grid row.
- **Files:** `src/pages/index.astro`, `src/components/ProofGrid.astro` (new), `src/content/skills.yaml`, `src/content.config.ts`, `src/pages/work/[slug].astro`, `docs/content/WRITING.md`, `docs/FIX_PLAN.md` (D4 note).
- **Verified by:** every dot resolves to an existing id (a test); axe; a screen-reader pass of the table; shots.
- **Needs from you:** check each ring.

#### Step 14: Career timeline and the CV page (M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** G-07, M-06 (sticky download).
- **Changes:**
  - One ruled line 2018 → now, drawn to scale from `roles.yaml`: year ticks in mono, role segments in ink weight by seniority, employer names above, a marker where LLM work begins (2026); vertical on phones. Shown above the Experience list and under the /cv/ header (screen only).
  - "Download the PDF" sticky in the /cv/ rail.
- **Files:** `src/components/Timeline.astro` (new), `src/pages/index.astro`, `src/pages/cv.astro`.
- **Verified by:** segment lengths match the dates (a test); the PDF unchanged (`cv:pdf -- --check`); shots.
- **Needs from you:** nothing.

#### Step 15: Wide screens (S, identity risk medium) — merged 25 Oct 2026 (#12)

- **Findings:** V-03 (DS8).
- **Changes:**
  - From 1100 px, one fixed rule at the rail edge for the full window height, behind content.
  - The per-row draw-down stays as the load animation; reduced motion shows the static rule.
  - Phones and tablets unchanged.
- **Files:** `src/styles/base.css`, `src/styles/motion.css`, `docs/REDESIGN_PLAN.md` §4.
- **Verified by:** shots at 1024, 1440 and 1920 in both themes; the rule on whole pixels at 1×, 1.5× and 2× (the Step 6 fix of the last round stays); print unaffected.
- **Needs from you:** a look at 1440 and 1920 on your own monitor.

### Phase E: edges

#### Step 16: Share cards and icons (S–M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** I-01 (rest), I-02, M-05.
- **Changes:**
  - Cards: the footer line dropped or set at 22 px; privacy reuses the home card (call 8).
  - Favicon "RO" as outlined Archivo paths at 72% width, about 75% of the tile height, with the rule on whole pixels.
  - `favicon.ico` (32), `apple-touch-icon.png` (180) and a minimal `site.webmanifest` in the paper colour, all from the same source.
- **Files:** `src/pages/og/[slug].astro`, `scripts/og-images.mjs`, `public/og/*.png`, `public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png`, `public/site.webmanifest`, `src/layouts/Base.astro`, `src/lib/pages.ts`.
- **Verified by:** cards at 500 px; favicon at 16 and 32 px in light and dark tabs; after merge, LinkedIn Post Inspector and an X card check on production (previews are login-protected).
- **Needs from you:** nothing.

#### Step 17: 404 and structured data (S, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** I-03, M-03 (rest).
- **Changes:**
  - 404: "No entry" stamp pressed beside the heading (the stamp motion, off under reduced motion) and the three work rows instead of three small links.
  - Case studies: `Article` with author → the Person, `about`, `dateModified`, `BreadcrumbList`, `og:type="article"`.
  - Person: `alumniOf`, `hasOccupation`; a `WebSite` node.
  - Sitemap `lastmod` from the `updated` dates.
- **Files:** `src/pages/404.astro`, `src/pages/work/[slug].astro`, `src/pages/index.astro`, `src/layouts/Base.astro`, `src/pages/sitemap.xml.ts`, `src/content.config.ts`.
- **Verified by:** JSON-LD validated (schema.org validator offline copy or Google's Rich Results test on production after merge); shots of the 404; reduced-motion check on the 404.
- **Needs from you:** nothing.

#### Step 18: Scales and breakpoints (M, identity risk low) — merged 25 Oct 2026 (#12)

- **Findings:** T-02, F-02 (rest), F-01.
- **Changes:**
  - Snap the ~25 literal sizes and 12 spacings to the Step 7 scales.
  - Three named breakpoints (phone 640, stack 900, wide 1100) as `@custom-media` (Lightning CSS) or one documented constant.
  - Verify proves the 760 px menu threshold at 899 px (call 7).
- **Files:** `src/styles/base.css`, every component and page with literals, `src/design/tokens.ts`, `src/pages/system.astro`, `scripts/verify.mjs`.
- **Risk:** touches every file. Mitigation: a pixel diff of all routes × six widths × two themes against the previous step; any difference over 2 px is listed and justified in the PR.
- **Verified by:** the pixel diff; `grep` showing no literal `px` font sizes left outside tokens.
- **Needs from you:** nothing.

**Sizes:** 1, 6 and 16 are S–M; 15 and 17 are S; 7 is L; the rest are M. Highest-impact order if time runs short: 1 → 4 → 7 → 8 → 5 → 6 → 2 → 3 → 13 → 12 → the rest.

---

## 6. What I need from you

| When | What |
| --- | --- |
| Approving this plan | Approved 25 Oct 2026. |
| Step 0 | OK to ship the link fix first. |
| Step 1 | A look at the preview on your phone. |
| Step 4 | A look at the preview (proof approved). |
| Step 5 | Make the repos public after the fixes listed in Step 5; one-liners; `DENYLIST` Actions secret; Deploy Hook as the `VERCEL_DEPLOY_HOOK` secret; optional `GITHUB_TOKEN`. |
| Step 6 | Writers' consent and dates; OK on attribution lines; optionally a QTX recommendation. |
| Steps 7–10 | Read-throughs of figures, the illustrative call (and its library check) and the margin notes. |
| Steps 12–13, 15 | Preview looks; check the proof-grid rings. |
| Every step | `DENYLIST` for the `lint:denylist` command only. You supply it; I never print it, write it to a file or commit it. Your explicit OK before any merge to `main`. |

**Creating the Deploy Hook (before Step 5 merges).** In Vercel, open the portfolio project → Settings → Git → Deploy Hooks. Name it `daily-refresh`, branch `main`, then Create Hook. Copy the URL it shows. In GitHub, open `oyongrm-qtxgroup/My-Portfolio` → Settings → Secrets and variables → Actions → New repository secret, name `VERCEL_DEPLOY_HOOK`, and paste the URL. Don't paste it in chat or anywhere else: anyone who has it can start a production build. If it ever leaks, delete the hook in Vercel and make a new one.

**What goes in `DENYLIST`.** It's the list of names that must never appear on the site, one per line, case doesn't matter. A name that's on it makes the build fail and prints only the file and line, never the name. Put in:
- every QTX client organisation, including short forms and project codenames that give a client away: the dental practices behind Jayne Bandy AI, the NDIS provider Ziaris was built for, the aged-care provider behind SmartCP, the retirement-village client, and any other client. The repo names in your QTX GitHub organisation are a good checklist to start from;
- the names of people at those clients, and any patient or participant names that appear in test data or call transcripts;
- the names of the people whose recommendations are quoted (DS3 attributes by role only).

Leave out the names that are allowed on the site: QTX, Ortigas Land, OCLP Holdings, Jayne Bandy AI, RL Finance, SEED, Workable, Ziaris, SmartCP, vendor and product names (ElevenLabs, Twilio, Supabase…), and your own name. Store it in GitHub the same way as the hook, under the name `DENYLIST`. The first build session checked 41 names (REDESIGN_PLAN Phase 2); if that list still exists somewhere, it's the place to start.

---

## 7. How each step is checked (standard)

1. Node 24 from the scratchpad: `npm install --prefix <scratchpad>/node24 node@24.22.1`, its `node_modules/node/bin` first on PATH; `npm ci`.
2. `npm run check` and `npm run lint:design` (must pass; this plan unbans nothing).
3. After any content change: `npm run build && npm run cv:pdf && npm run og && npm run build`.
4. `npm run lint:denylist`, with `DENYLIST` supplied by you for that command only.
5. `npm run verify -- <scratchpad>/shots` (served by `scripts/serve-static.mjs`, not `astro preview`); `npm run cv:pdf -- --check`; `npm run og -- --check`. From Step 1 on: `npm run perf` (throttled phone CLS and LCP, 5 runs per route).
6. Screenshots of every route at 320, 390, 768, 1024, 1440 and 1920 in Paper and Night, before (`main`) and after, attached to the PR for the pages the step touches. Budgets on every step: CLS < 0.02 on the throttled phone profile, home JS ≤ 15 KB gzip, no sideways scroll, axe 0 violations.
7. Re-read the diff adversarially; push to `claude/gracious-keller-nsc4p9`; deploy a Vercel **preview** (Vercel MCP `create_deployment`, per HANDOFF) and send you the link with the shots, measurements and any PDF text diff.
8. You review. Merging to `main` (production) happens only on your explicit OK. If production misbehaves, Vercel's instant rollback restores the previous deployment.

---

## 8. Open items (mentioned, not fixed)

- ~~The `DENYLIST` Actions secret isn't set.~~ Set 25 Oct 2026, with `VERCEL_DEPLOY_HOOK`; CI runs the name check on every build.
- **Jayne Bandy AI test-call transcripts aren't de-identified.** The illustrative call (Step 8) doesn't draw on them in any way; raise de-identification with the team separately.
- ~~A custom LinkedIn URL hasn't been claimed.~~ Claimed 25 Oct 2026 (`/in/raymundo-oyong`); the site and CV switched to it in Step 0 (#11).
- Your LinkedIn headline reads "Senior AI Software Engineer | Microsoft Certified" while the site and CV say "Senior AI & Automation Engineer". Recruiters compare them; whether to align them is your call on LinkedIn, not a site change.
- From the last plan, still open: FIX_PLAN §5 Q2, a small public sample repo (e.g. a toy booking agent with an evaluation harness). If the allow-list in Step 5 turns out thin, that's the one remaining direct proof of AI engineering.

---

## 9. Finding → step index

| Step | Findings |
| --- | --- |
| 0 | none (DS13, DS14 link corrections) |
| 1 | T-01, T-03, T-04, F-07 (CLS, widths) |
| 2 | H-02, H-04, H-05, H-08, C-02, C-03, C-05, C-06, N-01, S-02, V-04, F-07 (header, stack, quotes) |
| 3 | V-05, S-01, S-03, S-04, S-05, N-03, N-04, N-05, F-03, F-05, F-06, M-04, F-07 (print) |
| 4 | G-01, H-01, I-01 (home card), M-03 (Person.image), M-06 (name), M-07 (availability) |
| 5 | M-01, M-07 (footer date) |
| 6 | M-02, T-05 |
| 7 | C-01, F-04, C-02 (final), F-02 and T-02 (new scales) |
| 8 | G-03 |
| 9 | G-04, G-05, G-06 |
| 10 | C-04, C-08 |
| 11 | G-02, C-09, C-10, I-01 (work cards) |
| 12 | V-02, H-03, H-07, N-02, N-06 |
| 13 | H-06, G-08, C-07 |
| 14 | G-07, M-06 (download) |
| 15 | V-03 |
| 16 | I-01 (rest), I-02, M-05 |
| 17 | I-03, M-03 (rest) |
| 18 | T-02, F-02 (rest), F-01 |
| Themes T3–T6 | V-01 (umbrella) |

All 64 findings are placed: V-01–V-05, H-01–H-08, C-01–C-10, G-01–G-08, M-01–M-07, N-01–N-06, S-01–S-05, T-01–T-05, I-01–I-03, F-01–F-07.
