// The GitHub repos shown in the Proof band (docs/DESIGN_PLAN.md DS1, DS2). Shared by
// the build (src/lib/github.ts) and the daily refresh (scripts/github-refresh.mjs, run
// by Node directly, so only erasable TypeScript here), so both produce the same list.

/** The fields the site uses from GitHub's repository object. */
export interface RawRepo {
  name: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  archived: boolean;
  html_url: string;
  private: boolean;
}

/** An allow-list entry in profile.yaml: the repo name and, usually, our own line. */
export interface AllowedRepo {
  name: string;
  line?: string;
}

/** Exactly what the page shows, and what /github.json publishes. */
export interface Repo {
  name: string;
  line: string;
  language: string | null;
  /** Day of the last push, YYYY-MM-DD (UTC). */
  pushed: string;
  url: string;
  archived: boolean;
}

export const API = 'https://api.github.com';

/** One request for every public repo of the account. Throws on any failure. */
export async function fetchRepos(user: string, token?: string, api = API): Promise<RawRepo[]> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'raymundo-oyong-portfolio',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${api}/users/${encodeURIComponent(user)}/repos?per_page=100&type=owner`, {
    headers,
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`GitHub API answered ${res.status}`);
  const body = await res.json();
  if (!Array.isArray(body)) throw new Error('GitHub API returned something other than a list');
  return body as RawRepo[];
}

/**
 * Keeps the allow-listed repos that are public, in allow-list order. A repo that is
 * private or missing is reported in `missing` (the caller warns), never shown.
 */
export function pick(raw: RawRepo[], allow: AllowedRepo[]): { repos: Repo[]; missing: string[] } {
  const byName = new Map(raw.map((r) => [r.name.toLowerCase(), r]));
  const repos: Repo[] = [];
  const missing: string[] = [];
  for (const a of allow) {
    const r = byName.get(a.name.toLowerCase());
    if (!r || r.private) {
      missing.push(a.name);
      continue;
    }
    repos.push({
      name: r.name,
      line: a.line ?? r.description ?? '',
      language: r.language,
      pushed: r.pushed_at.slice(0, 10),
      url: r.html_url,
      archived: r.archived,
    });
  }
  return { repos, missing };
}
