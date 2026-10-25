// Daily refresh of the GitHub repos on the site (docs/DESIGN_PLAN.md DS2), run by
// .github/workflows/refresh.yml. Fetches the allow-listed repos the way the build
// does, checks them against DENYLIST, compares them with what production shows
// (/github.json) and calls the Vercel Deploy Hook only when they differ.
//   node scripts/github-refresh.mjs                       compare, deploy on a change
//   node scripts/github-refresh.mjs --dry-run             compare only
//   node scripts/github-refresh.mjs --against <file.json> compare with a saved copy
// Env: DENYLIST (required: it refuses to deploy unchecked data), VERCEL_DEPLOY_HOOK
// (required to deploy), GITHUB_TOKEN (optional), GITHUB_API (tests only).
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { API, fetchRepos, pick } from '../src/lib/github-data.ts';

const SITE = 'https://raymundo-oyong.vercel.app';
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const againstAt = args.indexOf('--against');
const against = againstAt >= 0 ? args[againstAt + 1] : undefined;

const fail = (message) => {
  console.error(`github-refresh: ${message}`);
  process.exit(1);
};

const { main: profile } = parse(readFileSync(new URL('../src/content/profile.yaml', import.meta.url), 'utf8'));
const { user, repos: allow } = profile.github;

const raw = await fetchRepos(user, process.env.GITHUB_TOKEN, process.env.GITHUB_API || API).catch((err) =>
  fail(`${err.message}; nothing changed`),
);
const { repos, missing } = pick(raw, allow);
for (const name of missing) console.log(`github-refresh: ${name} is private or missing, so it is left off`);

// The confidentiality check runs on exactly what would be published. Like
// lint:denylist it prints where a name was found, never the name.
const names = (process.env.DENYLIST ?? '')
  .split(/[\n,]/)
  .map((s) => s.trim())
  .filter(Boolean);
if (!names.length) fail('DENYLIST is not set, so the data can not be checked; refusing to deploy');
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = new RegExp(`\\b(${names.map(escape).join('|')})\\b`, 'i');
const hits = repos.flatMap((r, i) =>
  Object.entries(r)
    .filter(([, v]) => typeof v === 'string' && pattern.test(v))
    .map(([k]) => `repo ${i + 1} (${k})`),
);
if (hits.length) fail(`a confidential name is in ${hits.join(', ')}; not deploying`);

const current = against
  ? JSON.parse(readFileSync(against, 'utf8'))
  : await fetch(`${SITE}/github.json`, { signal: AbortSignal.timeout(10_000) })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`production answered ${r.status}`))))
      .catch((err) => (console.log(`github-refresh: ${err.message}; treating as changed`), null));

if (JSON.stringify(current) === JSON.stringify(repos)) {
  console.log(`github-refresh: no change (${repos.length} repos)`);
  process.exit(0);
}
console.log(`github-refresh: changed (${repos.length} repos)`);
if (dryRun || against) process.exit(0);

const hook = process.env.VERCEL_DEPLOY_HOOK;
if (!hook) fail('VERCEL_DEPLOY_HOOK is not set; can not deploy');
const res = await fetch(hook, { method: 'POST', signal: AbortSignal.timeout(10_000) });
if (!res.ok) fail(`the deploy hook answered ${res.status}`);
console.log('github-refresh: production rebuild started');
