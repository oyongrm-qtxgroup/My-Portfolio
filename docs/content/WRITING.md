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

- **Lead with the work, then say what it proves** (changed 25 Oct 2026, `docs/FIX_PLAN.md` D4). The home page shows the projects and the experience first; Capabilities then sums up what that work shows, one line per area, linked to the project behind it.
- **State each fact once**, where it carries the most weight. A number in the figures strip isn't repeated in the intro or the capabilities. One exception (DESIGN_PLAN call 2): a **margin note** on a case study may pull out a fact from the section beside it ("4 tools the agent may call", "Finance approves line by line"). No new facts, and no number that isn't already in that section.
- **First person is fine** on the site. No incident diaries or dated logs of what happened at work.
- **Never measure effort.** No hours logged, tasks closed, tickets or defects counted, or "delivered X work packages". Those belong in a status report, not a portfolio. Numbers describe outcomes only.
- **No client or people names.** Describe clients generically ("a disability-support provider"). `npm run lint:denylist` checks this.

## Shapes

- **Skill** (`src/content/skills.yaml`): `summary` is the one line shown under Capabilities on the home page (no numbers; the figures carry those); `pitch` is the longer description of the area in one to three sentences (kept as source text; the site shows `summary`); each `proof` is one sentence with an outcome, linked to a project page where one exists (`work`) or else to the Experience row(s) it comes from (`where`, role ids). Lead areas get three or four proof points; foundations get two. The home page shows the areas as a proof grid (DESIGN_PLAN DS12): a dot where a proof point or a case study shows the area, a ring (`used`: a project id, `qtx` or `earlier`) where the CV bullets say it was used but nothing is written up. Rings come only from the CV bullets; no numbers in the grid.
- **Principle** (`src/content/principles.yaml`): a title that states the rule; a body of 30–60 words with one concrete example; tied to one skill. No dates. Three at most.
- **Project page** (`src/content/work/*.mdx`): The challenge (who, what hurts, in two or three sentences) · Fig. 1, and more figures where they show what the text doesn't (failure paths, approval points) · The approach (headed paragraphs, outcomes not feature lists; for AI work also **How it's evaluated**, **Data handling** and **What I built**: personal scope and team size) · The result (outcomes, in two or three sentences; if figures can't be published, say so). The page then shows a byline, the skills from the `skills` field as quiet tags linking to their proof-grid row, and a closing contact block. At most one product-feature line; no § numbers.
- **CV bullet** (`src/content/roles.yaml`): starts with a verb, no "I", one outcome per bullet.
- **Quote** (`src/content/endorsements.yaml`, since DESIGN_PLAN Step 6): an excerpt of a LinkedIn recommendation, one or two sentences, **word for word**. A cut is marked "…"; a bracketed substitution ("[the client]") only with the writer's OK of the edited text. Attributed by role and employer, plus the relationship where it helps ("Senior colleague, Ortigas Land"); the writer's name never goes in the repo. Each entry records the date the writer consented (the build refuses an entry without it) and the date the text was last checked against LinkedIn. Two or three on the home page, at most one on a project page (one that names that project). Never italic: no italic is shipped, and `lint:design` rejects `<em>` and `*text*` in content.
