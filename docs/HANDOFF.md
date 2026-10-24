# Handoff — 24 Oct 2026

## Where things stand

- Branch `claude/cool-bardeen-iztjyn` holds the Astro 7 rebuild (Phases 0–2). `main` is still the legacy React site at `148b5c7` and is what production serves (Vercel deployment `dpl_ZXiT92GCh2EKgtwRFh4n4BTGZ1nN`).
- **Design is approved and built:** the "engineering logbook" look (paper/night/auto themes, red margin line, condensed Archivo headings, Source Serif body, Plex Mono labels, stamps). See `docs/design/` and `/system/` on the preview. Keep it.
- **Content is NOT approved.** Three attempts (a dated log of 49 shipped items with hours/tasks; then 10 "notes" about incidents plus 4 case studies) all read as QTX status reporting. The owner's verdict: too QTX, too much unnecessary detail, and it doesn't show his skills, knowledge and experience.

## What went wrong

All content was mined from QTX's Workable timesheets and tasks, so it narrates QTX operations (incidents, tickets, client walkthroughs). The site needs to lead with **Raymundo's capabilities**, using projects only as evidence.

## Next step

Interview the owner first (audience, positioning, which skills to lead with, what to cut), propose a content structure built around skills and expertise, and get approval before rewriting `src/content/**`. Remove or keep the Notes section only on his say-so (he dislikes it now).

## Practical notes

- **Node ≥ 22.23.4 needed** (Astro 7.4). The container ships 22.22: `npm install --prefix <scratch>/node24 node@24.22.1` and put its `bin/node` first on PATH.
- `astro preview` is a background daemon in Astro 7; `scripts/verify.mjs` stops and starts it. Run `npm run build && npm run verify -- <shots-dir>`.
- Deploy previews with the Vercel MCP `create_deployment` (gitSource: github, org `oyongrm-qtxgroup`, repo `My-Portfolio`, ref = branch, sha = pushed commit), project `prj_rJfvQXggKfrA31qJXop4ob57JAWb`, team `team_wU5QbmVCFy8q7JMs52647C5m`. Get a viewing link with `get_access_to_vercel_url`. Don't promote to production until the owner says so.
- Never commit client or people names. `npm run lint:denylist` reads names from the `DENYLIST` env var; the list is not stored in the repo.
