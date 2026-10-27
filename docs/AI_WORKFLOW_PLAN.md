# Plan: show how I work with coding agents

Status: **draft, waiting on the owner's answers in §6** (27 Oct 2026). Nothing in it is built yet. Tick each step off here as it merges.

- Baseline: `main` at `116d318`, live at https://raymundo-oyong.vercel.app.
- Work branch: `claude/ecstatic-galileo-g0vfal`. One step = one pull request with a Vercel preview. Nothing merges to `main` without the owner's explicit OK.
- Evidence: a read-only pass on 27 Oct 2026 over the portfolio repo and six QTX repos (commits, PRs, reviews, check runs, agent config files). The findings stay out of this public repo; only the general claims below, worded to match what the record shows, come in.
- Rules that still apply: `docs/content/WRITING.md` (outcomes, not effort; no client or people names) and `npm run lint:design` / `lint:denylist`. This plan unbans nothing.

Contents: 1 Decisions · 2 What the record supports · 3 Calls I made · 4 Steps · 5 Draft wording · 6 What I need from you · 7 How each step is checked

---

## 1. Decisions (owner's answers, 27 Oct 2026)

| # | Topic | Decision |
| --- | --- | --- |
| AW1 | Tools | Cursor for about a month (Jan 2026), then GitHub Copilot in VS Code and Visual Studio, now Claude Code (desktop app and VS Code extension). |
| AW2 | Framing | **Engineering practice, not "vibe coding".** The site says how changes are planned, checked and reviewed. It never says which client product was built with which tool, and never suggests a client's product was generated without review. |
| AW3 | Review | CodeQL scans pull requests; its findings are cross-checked with Claude and fixed when they are real. Copilot review gives a second opinion. |

## 2. What the record supports

Only claims in this table go on the site. "Seen" means it's in the commit, PR or check history, not inferred.

| Claim | Seen in |
| --- | --- |
| Plans written for an agent to execute, before the code: a spec, a plan, numbered phases, a handoff note for the next session, and a short list of what needs the owner. | Every QTX repo since Feb 2026, and this one (`docs/*_PLAN.md`, `HANDOFF.md`). |
| The way of working moved with the tools: Copilot instruction files and agent-mode plan prompts (Feb–May 2026), then Claude Code with a `CLAUDE.md`, custom skills and cloud sessions (Jun 2026 on). | Instruction and prompt files; commit trailers. |
| House rules live in the repo, so each session starts from the same conventions and gates ("add zero type errors", required checks, what needs a human). | `CLAUDE.md`, `.claude/skills/`, `.github/instructions/`. |
| Security scan findings triaged against the full alert list: real ones fixed, false positives dismissed with a written reason, regressions from a fix caught and fixed. | CodeQL check runs and the PRs that close alerts. |
| Dependency alerts checked for reachability against the built output before patching, ending at zero open audit findings. | A dated security-triage doc and the PRs that follow it. |
| A real bug from a Copilot review fixed with a test that fails without the fix. | One promotion PR and its follow-up. |
| Teammates' PRs reviewed with Claude: bot findings checked, turned into numbered change requests with file and line, then re-verified before approval. | Review history on a client repo. |
| Each PR records the gates it passed (type check, tests, build, lint). CI gates were added after the escapes they prevent. | PR bodies; comments in the CI workflow. |
| This site: every change came from an agent session on its own branch and passed type checks, browser tests, a CV readability check, a share-image check and a client-name check before merge. | This repo, public. |

**Not supported, so not claimed:** Cursor work (no trace in any repo, and the Jan 2026 commits are from Lovable); "every PR is reviewed" (many feature PRs are self-merged into `dev`); "CodeQL on every PR" in every repo (in some it runs only on PRs into production branches, and in one it doesn't run).

## 3. Calls I made (object when reviewing if you disagree)

1. **No effort counts.** No PR, commit or session numbers, and no "built in a weekend" (WRITING.md "Never measure effort").
2. **Test counts stay off the site.** They read as effort. The claim is that every change ships with its checks, not how many tests there are.
3. **Cursor goes on the CV tools line at most**, never in a proof point, because nothing shows the work.
4. **Lovable isn't named.** A teammate uses it in several repos; it isn't part of how you work. Change this if you want "worked alongside Lovable-built front ends" on the CV.
5. **"Agents write most of the code" is stated plainly** on this site's case study. It's true here, and the point is what you do around it. On client work the site only says how changes are planned, checked and reviewed (AW2).

## 4. Steps

### Step 1: CodeQL and agent review on this repo (S)

- **Why first:** the case study (Step 3) says changes are scanned and reviewed. This repo is public, so readers can check that against its own CI. Today CI here is the build job and the Vercel preview only.
- **Changes:** `.github/workflows/codeql.yml` (JavaScript/TypeScript and Actions, on pull requests and weekly). Optionally Copilot review on pull requests (repo setting, owner).
- **Needs from you:** in GitHub → Settings → Branches, make `build` and `CodeQL` required checks on `main`.

### Step 2: An "AI-assisted delivery" capability (S)

- **Changes:** a new area in `src/content/skills.yaml` (draft in §5), proof points linked to the Step 3 page and to the QTX Experience row; a new row in the proof grid. One security proof point on CodeQL triage under `security`.
- **Files:** `src/content/skills.yaml`, the proof-grid tests in `scripts/verify.mjs` if they count rows.

### Step 3: Case study "How this site is built" (M)

- **Shape (WRITING.md *Project page*):** The challenge (a portfolio that has to stay accurate, checkable and free of client names while one person changes it often) · Fig. 1, the loop: written plan → agent session on its own branch → gates (type check, design lint, browser tests, CV PDF check, share-image check, client-name check, CodeQL) → Vercel preview → my review → merge, with the failure edge back to the session in margin red (DS7) · The approach: *Plans an agent can execute* · *House rules in the repo* · *Gates before merge* · *A second opinion on every finding* · *Handoffs between sessions* · **How it's checked** · **What I built** (I write the plans, rules and gates and review every change; agents write most of the code) · The result.
- **Files:** `src/content/work/this-site.mdx` (id to confirm, Q1), `src/lib/figures.ts`, `src/content/skills.yaml` (`work:` links).

### Step 4: CV (S)

- **Changes:** a tools line and one QTX bullet (drafts in §5). Regenerate the PDF and keep it inside the page budget.
- **Files:** `src/content/profile.yaml`, `src/content/roles.yaml`, `public/raymundo-oyong-cv.pdf` (+ `.sha256`).

### Step 5: Docs (S)

- `docs/content/WRITING.md`: one line on how to describe agent work (AW2). `docs/HANDOFF.md`: this plan is done.

## 5. Draft wording (for your read; final copy goes in each PR)

**Capability** (`ai-delivery`, lead area, after Document AI):

- Summary: Coding agents that work from a written plan and pass the same checks as any other change before it merges.
- Proof:
  - Plans written for an agent to execute: each step names its files, its checks and what done looks like, and a handoff note carries the context to the next session. (`where: [qtx]`, `work: this-site`)
  - House rules kept in the repository, so every agent session starts with the same conventions, gates and limits on what it may do without a person. (`where: [qtx]`)
  - Every change on this site came from an agent session on its own branch and passed type checks, browser tests, a CV readability check and a client-name check before I merged it. (`work: this-site`)

**Security proof point:** Security-scan findings triaged against the full alert list: real ones fixed, false positives dismissed with a written reason. (`where: [qtx]`)

**CV tools line:** AI-assisted development: Claude Code (plans, custom skills, cloud sessions), GitHub Copilot (agent mode, code review), CodeQL, Dependabot

**CV bullet (QTX):** Set up delivery with coding agents working from written plans and repository rules, with CodeQL, type checks and tests gating each merge.

## 6. What I need from you

| # | Question | My recommendation |
| --- | --- | --- |
| Q1 | Where does the case study live: a fourth project in Selected work, or a page linked from the footer ("How this site is built")? | Fourth project, last in order. It's the only work anyone can inspect end to end. |
| Q2 | Cursor on the CV tools line? | Leave it off. |
| Q3 | Lovable anywhere? | Leave it off (§3 call 4). |
| Q4 | OK with "agents write most of the code" on this site's case study? | Yes; hiding it reads worse once someone opens the repo. |
| Q5 | Required checks and Copilot review on this repo (Step 1). | Yes to both. |
| Every step | Your OK before any merge to `main`; `DENYLIST` for `lint:denylist` only. | — |

## 7. How each step is checked

As in `docs/DESIGN_PLAN.md` §7: `npm run check`, `lint:design`, build, `verify`, `cv:pdf -- --check`, `og -- --check`, `lint:denylist` with your secret, screenshots of the pages the step touches, then a Vercel preview for your review.
