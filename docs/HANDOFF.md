# Handoff — 25 Oct 2026

## Where things stand

- **Launched.** `main` holds the Astro 7 rebuild (merged as `add74fe`, PR #1) and production serves it at https://raymundo-oyong.vercel.app. Production deploys automatically from `main`; to roll back, use Vercel's instant rollback to the previous production deployment.
- **Design is approved and built:** the "engineering logbook" look (paper/night/auto themes, red margin line, condensed Archivo headings, Source Serif body, Plex Mono labels, stamps). See `docs/design/` and `/system/`. Keep it.
- **Design plan done.** [`docs/DESIGN_PLAN.md`](DESIGN_PLAN.md) (approved 25 Oct 2026) is fully merged: Step 0 in #11, Steps 1–18 in #12, with the three recommendations (writers' consent 25 Oct 2026) and the four public repos. Still open, the owner's call: the Jayne Bandy AI test-call transcripts aren't de-identified; the LinkedIn headline differs from the site's title; portpeek's app id is `group.qtx.portpeek`.
- **Post-launch fixes:** an independent review (recruiter, hiring manager, designer) produced the fix plan in [`docs/FIX_PLAN.md`](FIX_PLAN.md), approved by the owner on 24 Oct 2026. It is worked one pull request per step, one at a time, each with a Vercel preview; nothing merges to `main` without the owner's OK. Its §1 lists the decisions that replace parts of `docs/REDESIGN_PLAN.md` §1–4; each step updates those docs as it lands.

## Content model

- `src/content/skills.yaml`: 3 lead skills + 7 foundations, each with proof points (outcomes only).
- `src/content/principles.yaml`: "How I work" principles.
- `src/content/work/*.mdx`: 3 project pages (Jayne Bandy AI, Ziaris, SAP & HR automation). Care-plan drafting (SmartCP) is a line in the QTX role; its old URL redirects home.
- `src/content/roles.yaml`: career rows and every CV bullet.
- `src/content/profile.yaml`: headline, lede, CV summary, figures, links.

## Facts confirmed by the owner

- Ortigas Land: Power Automate (desktop and cloud), two bots: one processes government remittances, one enters data in the SAP desktop client. Led a four-person development team (the count includes him); written as "a four-person development team" everywhere (24 Oct 2026).
- Names: **Jayne Bandy AI** (always in full), **RL Finance**, **SEED**, **Workable**, **Ziaris** (the NDIS workforce & care platform; use only this name for it) and **SmartCP** (care-plan drafting) may be named; SEED and Workable are explained in one clause on first use. Ziaris and SmartCP were cleared on 25 Oct 2026; their clients stay generic. Every other QTX client and project is described generically. No client or people names anywhere. (Confirmed 24 Oct 2026; replaces the earlier "other QTX work stays generic" line.) Workable records are for fact-checking only.
- Email only: no phone number on the site or the PDF.
- No Jayne Bandy AI usage figures, demo number, recordings or screenshots are published. Model and vendor names, the evaluation method and data handling may be described.

## Practical notes

- **Node 24 needed** (Astro 7.4). The container ships 22.22: `npm install --prefix <scratch>/node24 node@24.22.1` and put `<scratch>/node24/node_modules/node/bin` first on PATH.
- After any content change: `npm run build && npm run cv:pdf && npm run og && npm run build`, then commit the PDF and the cards. `npm run verify` before every push.
- `astro preview` can't serve this build (it contains a Vercel function); `scripts/verify.mjs` serves `.vercel/output/static` itself (`scripts/serve-static.mjs`) and mocks the contact action. Run `npm run build && npm run verify -- <shots-dir>`. To exercise the real action locally use `astro dev` (outbound calls to Cloudflare/Resend are blocked in the cloud sandbox).
- Turnstile and Resend keys are set in Vercel for Production only. `/privacy/` references Cloudflare's Turnstile Privacy Addendum, which invisible mode requires.
- Deploy previews with the Vercel MCP `create_deployment` (gitSource: github, org `oyongrm-qtxgroup`, repo `My-Portfolio`, ref = branch, sha = pushed commit), project `prj_rJfvQXggKfrA31qJXop4ob57JAWb`, team `team_wU5QbmVCFy8q7JMs52647C5m`. Get a viewing link with `get_access_to_vercel_url`. Never promote to production without the owner's OK.
- Previews are behind Vercel Authentication, so link-preview checks (LinkedIn Post Inspector, X) only work on production.
- Never commit client or people names. `npm run lint:denylist` reads names from the `DENYLIST` env var; the list is not stored in the repo. It also scans the built site (GitHub data lands there) and, since DESIGN_PLAN Step 5, **fails in CI when the `DENYLIST` secret is unset**.
- **GitHub repos (DESIGN_PLAN Step 5).** The Proof band lists only the repos in `profile.yaml` `github.repos`, each only while public; write each one's `line` there. The build fetches them once (optional `GITHUB_TOKEN` in Vercel lifts the rate limit) and falls back to `src/data/github-snapshot.json`; refresh the snapshot in a PR when repos change. A **daily scheduled rebuild** (`.github/workflows/refresh.yml`, 03:17 UTC+8, also runnable by hand) redeploys production through the `VERCEL_DEPLOY_HOOK` secret only when GitHub's data differs from production's `/github.json`, and refuses to run while `DENYLIST` is unset. Such a deploy changes no code: only the repos' dates and languages move.
- **Icons (DESIGN_PLAN Step 16).** `public/favicon.svg` is generated: `python3 scripts/favicon.py` (needs fonttools + brotli, like `subset-fonts.sh`) draws "RO" from Archivo's outlines; then `npm run icons` writes `favicon.ico` and `apple-touch-icon.png` from it (`-- --check` compares). Pages without a card of their own (`card: false` in `src/lib/pages.ts`, e.g. /privacy/) share the home card.
- **Footer "Updated"** comes from `profile.yaml` `updated`, not the build date: bump it with each content change. Each case study has its own `updated` in its frontmatter (the sitemap's `lastmod` and the Article's `dateModified`); the privacy notice's date is `PRIVACY_UPDATED` in `src/lib/pages.ts`.
