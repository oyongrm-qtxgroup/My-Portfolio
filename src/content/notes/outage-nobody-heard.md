---
title: The outage nobody heard
date: 2026-10-07
work: jayne-bandy-ai
summary: An AI provider ran out of credit and nothing told anyone, so I now build the health check before the feature.
---

In early October the AI provider behind Jayne Bandy AI's website chat ran out of credit. The chat stopped answering visitors, the support assistant went quiet and call scoring stopped, and not one alert fired. It surfaced days later, when someone noticed the chat had gone silent.

The fix took an afternoon. Every failed AI reply is now logged, shows on an admin status card and sends an alert, and a check runs every fifteen minutes.

The lesson took longer to sink in. Most of what reached a practice was never the model being wrong; it was the plumbing around it failing without a sound. I build the health check first now.
