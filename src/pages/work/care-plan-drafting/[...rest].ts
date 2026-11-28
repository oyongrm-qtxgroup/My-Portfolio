// Care-plan drafting came back as the SmartCP project page (Nov 2026). Old links,
// with or without a trailing slash, go there. A config redirect can't do this:
// on Vercel it matches only the exact path without the slash.
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ redirect }) => redirect('/work/smartcp/', 301);
