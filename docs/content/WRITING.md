# How the site is written

Adapted from the Harvard Extension School OCS guide (resume language), minus the rules that only make sense on a one-page CV. The CV itself follows the full guide; see `docs/REDESIGN_PLAN.md` §7.

## Keep from the guide

- **Specific, not general.** "Dentally, the third practice system behind one script", not "multiple integrations".
- **Active.** Say who did what: "I traced it to…", "the system now refuses…".
- **Fact-based: quantify and qualify.** Numbers describe outcomes for the people using the software: 6.5 s to about 1 s, 70–80% less manual SAP work, 100+ hours a month of HR work gone. Then one clause of qualification: why it mattered.
- **Express, don't impress.** Plain words. No "leveraged", "seamless", "passionate", "cutting-edge" (`npm run lint:design` fails on them).
- **Written for people who scan.** The first sentence of every note carries the point; the `summary` field is that sentence. One idea per paragraph, short paragraphs, headings that say something.
- **Consistent.** Dates as "Oct 2026" on notes; UK/Australian spelling; "Jayne Bandy AI" in full.
- **No spelling or grammar errors.** Read it aloud before committing.

## Deliberately different from a CV

- **First person and narrative are fine** on notes and case studies. A note is a short story: what happened, what I did, what I'd do next time.
- **Never measure effort.** No hours logged, tasks closed, tickets counted, or "delivered X work packages". Those belong in a status report, not a portfolio.
- **No client or people names.** Describe clients generically ("a disability-support provider"). `npm run lint:denylist` checks this.

## Shapes

- **Note:** title that names the surprise; `summary` = the point in one sentence; body 90–150 words; ends on what changed in how I work.
- **Case study:** § 1 The problem (who, what hurts, in two or three sentences) · § 2 What I did (two or three headed paragraphs, outcomes not feature lists) · margin notes for the human details · links to the notes from the project.
