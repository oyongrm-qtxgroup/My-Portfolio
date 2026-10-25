// Build-time GitHub data for the Proof band: one request to the API, kept to the
// allow-list in profile.yaml. If the API can't be reached the committed snapshot
// (src/data/github-snapshot.json) is used, so a build never fails on GitHub.
import { GITHUB_API, GITHUB_TOKEN } from 'astro:env/server';
import snapshot from '../data/github-snapshot.json';
import { fetchRepos, pick, type RawRepo, type Repo } from './github-data';
import { getProfile } from './content';

let loaded: Promise<Repo[]> | undefined;

/** The repos the page shows, fetched once per build. */
export function getRepos(): Promise<Repo[]> {
  loaded ??= load();
  return loaded;
}

async function load(): Promise<Repo[]> {
  const { github } = await getProfile();
  let raw: RawRepo[];
  try {
    raw = await fetchRepos(github.user, GITHUB_TOKEN, GITHUB_API);
  } catch (err) {
    console.warn(`github: ${(err as Error).message}; using src/data/github-snapshot.json`);
    raw = snapshot as RawRepo[];
  }
  const { repos, missing } = pick(raw, github.repos);
  for (const name of missing) console.warn(`github: ${name} is private or missing, so it is left off`);
  return repos;
}

/** "Pushed 25 Oct 2026". */
export const pushedOn = (day: string) =>
  `Pushed ${new Date(`${day}T00:00:00Z`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}`;
