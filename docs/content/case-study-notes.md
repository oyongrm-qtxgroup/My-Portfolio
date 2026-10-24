# Case-study notes — "In hindsight" drafts

Drafted 24 Oct 2026 from Raymundo's own Workable time entries and tasks (Mar–Oct 2026). Written in the first person for the website. The CV never uses "I"; it has its own bullets.

**Status: draft, needs Raymundo's approval of the wording before Phase 2 publishes it.**

Rules: no client or people names, no prices, nothing a client could recognise as confidential.

---

## No. 01 — Jayne Bandy AI

**Evidence:** AI-provider credit ran out with no alert, which stopped chat replies and call scoring; built failure logging, admin alerts and a 15-minute health check. Four of five "can't find my appointment" cases were patients on file under the calling number with a different name spelling; fixed by matching on caller number. Restarted a review round to promise only what the booking systems could actually do. A reported "missed call" turned out to be the caller hanging up after 2 seconds.

> Most of the problems that reached a practice weren't the AI being wrong. The AI provider ran out of credit and nobody was alerted for days; patients couldn't be found because their name was spelt differently from the record. If I started again, I'd build the health checks and the plain lookups before the clever voice work, and I'd read the booking system's documentation before promising a practice owner a feature.

## No. 02 — Workforce & care platform (NDIS provider)

**Evidence:** bulk staff email showed "sent" while nothing went out; uploading a payment file silently closed invoices, rebuilt so the system suggests a match and Finance approves line by line; the roster staff picker silently dropped workers whose program didn't match. Defect register taken from seven open items to zero; a 25-ticket client test round closed with an empty queue.

> The worst defects were the silent ones: an email screen that said "sent" when nothing went out, a payment upload that quietly closed invoices, a staff list that quietly left people off. I now treat "nothing happened and nobody was told" as its own kind of bug. Anything in this system that touches money is now suggested by the software and approved by a person, one line at a time.

## No. 03 — Retirement-village finance (in progress)

**Evidence:** the deferred management fee was validated line by line against the finance team's own spreadsheet; once it matched to the cent, their example was locked in as a permanent automated check. A walkthrough booked for 90 minutes ran three hours. Monthly figures were corrected so each year's fee spreads across the actual days in each month.

> The finance team's own spreadsheet turned out to be the real specification. Once the system matched it to the cent, I locked their example in as a permanent automated test, and arguments about numbers became a test that either passes or doesn't. Next time I'd ask for that spreadsheet in the first week, not after the third walkthrough.

## No. 04 — Workable modules

**Evidence:** unfiltered live-update subscriptions on four busy pages (Backlog, My Work, Email and LinkedIn inboxes) drove database connection pressure and recurring incidents; fixed by filtering them. A six-hourly sync job was replaced with an on-demand, cached function to cut load and cost. Most modules started as colleagues' ideas, turned into a short spec, built, then handed back for their QA.

> Building for colleagues who can message you directly is fast, and that speed hides costs. A few busy screens listening for every change in the database were enough to exhaust its connections and cause repeat incidents. Now I check what a new screen costs the database before it ships, not after the first outage.

## No. 05 — SEED agents

**Evidence:** merges and deployments failed repeatedly because database migrations drifted between the prototype, development and production branches ("all issues are about migrations"). RAG cost was cut by refusing unrelated questions and caching answers. Tenant isolation was added before the first client deployment.

> Most of the time I lost on SEED went to database changes drifting between the prototype, development and production copies, not to the agents themselves. I'd put migrations under one owner and one pipeline from day one. On the AI side, the cheapest improvement was simply refusing off-topic questions and caching repeat answers.

## No. 06 — Care-plan drafting (aged care, in progress)

**Evidence:** contradictions, gaps and outdated or unreadable evidence become review items a reviewer must acknowledge, never resolved silently; every statement links to its source page. Actions went from 6.5 s to about 1 s by moving the database connection to HTTPS, not by changing the model. Wrote the Sprint 2 developer specifications as technical lead.

> With care plans, a confident wrong sentence is worse than no sentence. So every statement shows where it came from, and contradictions go to a clinician instead of being smoothed over. The biggest speed-up came from fixing a database connection, not from the model, which is a good reminder to check the plumbing before blaming the AI.
