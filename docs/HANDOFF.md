# Handoff — 24 Oct 2026

## Where things stand

- Branch `claude/cool-bardeen-iztjyn` holds the Astro 7 rebuild (Phases 0–2). `main` is still the legacy React site at `148b5c7` and is what production serves (Vercel deployment `dpl_C2agw125ypRfqUV7HBzHkboPYyuz`, built from `main` after the history rewrite; this is the instant-rollback target). Production deploys automatically from `main`.
- **Design is approved and built:** the "engineering logbook" look (paper/night/auto themes, red margin line, condensed Archivo headings, Source Serif body, Plex Mono labels, stamps). See `docs/design/` and `/system/` on the preview. Keep it.
- **Content was rebuilt skills-first** after an interview with the owner (see `docs/REDESIGN_PLAN.md`, Phase 2, third rework). Positioning: AI and automation engineer; audience: hiring first, clients second. The structure is approved; the wording awaits his read-through on the preview.

## Content model

- `src/content/skills.yaml`: 3 lead skills + 7 foundations, each with proof points (outcomes only).
- `src/content/principles.yaml`: "How I work" (replaces the deleted Notes section).
- `src/content/work/*.mdx`: 3 project pages (Jayne Bandy AI, SAP & HR automation, care-plan drafting).
- `src/content/roles.yaml`: career rows and every CV bullet.
- `src/content/profile.yaml`: headline, lede, CV summary, figures, links.

## Facts confirmed by the owner (24 Oct 2026)

- Ortigas Land: Power Automate (desktop and cloud), two bots: one processes government remittances, one enters data in the SAP desktop client. Led a team of up to four developers including himself.
- "RL Finance" may be named. Other QTX work stays generic. Workable records are for fact-checking only.

## Next step

Phases 3–5 are built and Phase 6 is prepared (SEO, share images, redirects, performance); only the launch itself remains, on the owner's go-ahead (checklist in the plan, Phase 6). Turnstile and Resend keys are set in Vercel for Production only (24 Oct 2026); `/privacy/` references Cloudflare's Turnstile Privacy Addendum, which invisible mode requires. After any content change: `npm run build && npm run cv:pdf && npm run og && npm run build`, then commit the PDF and the cards.

## Practical notes

- **Node ≥ 22.23.4 needed** (Astro 7.4). The container ships 22.22: `npm install --prefix <scratch>/node24 node@24.22.1` and put `<scratch>/node24/node_modules/node/bin` first on PATH.
- `astro preview` can't serve this build (it contains a Vercel function); `scripts/verify.mjs` serves `.vercel/output/static` itself and mocks the contact action. Run `npm run build && npm run verify -- <shots-dir>`. To exercise the real action locally use `astro dev` (outbound calls to Cloudflare/Resend are blocked in the cloud sandbox).
- Deploy previews with the Vercel MCP `create_deployment` (gitSource: github, org `oyongrm-qtxgroup`, repo `My-Portfolio`, ref = branch, sha = pushed commit), project `prj_rJfvQXggKfrA31qJXop4ob57JAWb`, team `team_wU5QbmVCFy8q7JMs52647C5m`. Get a viewing link with `get_access_to_vercel_url`. Don't promote to production until the owner says so.
- Never commit client or people names. `npm run lint:denylist` reads names from the `DENYLIST` env var; the list is not stored in the repo.
