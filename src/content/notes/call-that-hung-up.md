---
title: The call that hung up on itself
date: 2026-07-29
summary: Outbound AI calls dropped the moment they connected because of one unfilled placeholder and a phone system that failed silently.
---

QTX's AI sales caller was dropping calls the instant they connected, before it said a word. The logs looked clean.

The cause was a placeholder in the opening line that was never filled in. The phone system rejected the message and closed the call without reporting an error. Two silent layers, stacked on top of each other, so each one hid the other.

The fix was one line. What mattered more was the check that now stops a script with an unfilled placeholder before any call goes out. When a system fails quietly, the useful work is making the next failure loud.
