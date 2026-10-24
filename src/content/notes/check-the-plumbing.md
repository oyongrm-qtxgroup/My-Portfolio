---
title: Check the plumbing first
date: 2026-10-20
work: care-plan-drafting
summary: Actions took 6.5 seconds, and the fix was a database connection, not the model.
---

Every action in the care-plan tool took about six and a half seconds. In an AI product it's tempting to blame the AI for that.

It was the database connection. Moving it to Supabase's secure HTTPS endpoint, and switching database encryption back on in the process, brought actions down to about one second. Loading indicators and a page outline covered the rest of the wait.

Before tuning a prompt or swapping a model, I measure where the time actually goes. Usually it's somewhere boring.
