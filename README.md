# Raymundo Oyong — portfolio

Personal site and CV of Raymundo Oyong, AI product engineer at QTX.

**Status: being rebuilt.** The code on `main` is the previous React/Three.js version (kept for rollback). The new site is an "engineering logbook": plain paper, black ink, one blue accent, a red notebook margin, dated entries of shipped work, and a CV generated from the same content.

- Plan, phases and decisions: [`docs/REDESIGN_PLAN.md`](docs/REDESIGN_PLAN.md)
- Approved designs (snapshots of the design canvas): [`docs/design/`](docs/design/)
- Case-study drafts: [`docs/content/case-study-notes.md`](docs/content/case-study-notes.md)

## Stack (target)

Astro, static output on Vercel; content as Markdown in the repo; one server action for the contact form (Cloudflare Turnstile + Resend). No client framework, no database.

## Rollback

The legacy site is `main` at `06fde79`; the last legacy production deployment on Vercel is `dpl_ZXiT92GCh2EKgtwRFh4n4BTGZ1nN`. Use Vercel's Instant Rollback to return to it.
