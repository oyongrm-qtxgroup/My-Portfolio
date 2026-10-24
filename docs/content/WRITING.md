# How the site is written

Adapted from the Harvard Extension School OCS guide (resume language), minus the rules that only make sense on a one-page CV. The CV itself follows the full guide; see `docs/REDESIGN_PLAN.md` §7.

## Keep from the guide

- **Specific, not general.** "Dentally, the third practice system behind one script", not "multiple integrations".
- **Active.** Say who did what: "I traced it to…", "the system now refuses…".
- **Fact-based: quantify and qualify.** Numbers describe outcomes for the people using the software: 6.5 s to about 1 s, 70–80% less manual SAP work, 100+ hours a month of HR work gone. Then one clause of qualification: why it mattered.
- **Express, don't impress.** Plain words. No "leveraged", "seamless", "passionate", "cutting-edge" (`npm run lint:design` fails on them).
- **Written for people who scan.** The first sentence of every block carries the point. One idea per paragraph, short paragraphs, headings that say something.
- **Consistent.** Dates as "Oct 2026"; UK/Australian spelling; "Jayne Bandy AI" and "RL Finance" in full.
- **No spelling or grammar errors.** Read it aloud before committing.

## Deliberately different from a CV

- **Lead with what I can do for the reader**, then prove it. Projects are evidence for a skill, never the other way round.
- **First person is fine** on the site. No incident diaries or dated logs of what happened at work.
- **Never measure effort.** No hours logged, tasks closed, tickets or defects counted, or "delivered X work packages". Those belong in a status report, not a portfolio. Numbers describe outcomes only.
- **No client or people names.** Describe clients generically ("a disability-support provider"). `npm run lint:denylist` checks this.

## Shapes

- **Skill** (`src/content/skills.yaml`): `pitch` says what I can do for the reader in one to three sentences; each `proof` is one sentence with an outcome, linked to a project page where one exists. Lead areas get three or four proof points; foundations get two.
- **Principle** (`src/content/principles.yaml`): a title that states the rule; a body of 30–60 words with one concrete example; tied to one skill. No dates.
- **Project page** (`src/content/work/*.mdx`): § 1 The challenge (who, what hurts, in two or three sentences) · Fig. 1 · § 2 The approach (two or three headed paragraphs, outcomes not feature lists) · § 3 The result (outcomes, in two or three sentences) · the skills it shows come from the `skills` field.
- **CV bullet** (`src/content/roles.yaml`): starts with a verb, no "I", one outcome per bullet.
