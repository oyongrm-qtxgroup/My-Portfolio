// Exactly the repo list the page shows. The daily refresh (scripts/github-refresh.mjs)
// compares GitHub with this file on production and redeploys only on a difference.
import type { APIRoute } from 'astro';
import { getRepos } from '../lib/github';

export const GET: APIRoute = async () =>
  new Response(`${JSON.stringify(await getRepos(), null, 2)}\n`, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
