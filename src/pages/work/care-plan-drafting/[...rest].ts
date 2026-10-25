// Care-plan drafting is no longer a project page (docs/FIX_PLAN.md D5). Old links,
// with or without a trailing slash, go home. A config redirect can't do this:
// on Vercel it matches only the exact path without the slash.
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ redirect }) => redirect('/', 301);
