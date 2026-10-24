# Raymundo Oyong — portfolio

Personal site and CV of Raymundo Oyong, AI product engineer at QTX.

**Status: being rebuilt.** The code on `main` is the previous React/Three.js version (kept for rollback). The new site is an "engineering logbook": plain paper, black ink, one blue accent, a red notebook margin, four case studies told as stories, short notes on what went wrong and what it taught, and a CV generated from the same content.

- Plan, phases and decisions: [`docs/REDESIGN_PLAN.md`](docs/REDESIGN_PLAN.md)
- Approved designs (snapshots of the design canvas): [`docs/design/`](docs/design/)
- How the content is written: [`docs/content/WRITING.md`](docs/content/WRITING.md)

## Stack (target)

Astro 7 (Node ≥ 22.23.4), static output on Vercel; content as Markdown in the repo; one server action for the contact form (Cloudflare Turnstile + Resend). No client framework, no database.

## Rollback

The legacy site is `main` at `148b5c7`; the last legacy production deployment on Vercel is `dpl_ZXiT92GCh2EKgtwRFh4n4BTGZ1nN`. Use Vercel's Instant Rollback to return to it.

## Commands

```sh
npm install
npm run dev            # local dev server
npm run build          # static build into dist/
npm run check          # type check
npm run lint:design    # fail on template-look patterns (gradients, shadows, glass, buzzwords)
npm run lint:denylist  # fail on confidential names (DENYLIST env var)
npm run verify         # after build: axe + layout checks + screenshots: npm run verify -- ./shots
```
