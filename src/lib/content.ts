import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'work'>;
export type Note = CollectionEntry<'notes'>;
export type Role = CollectionEntry<'roles'>;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Oct 2026 (three-letter months everywhere; the en-AU locale would give "Sept"). */
export function monthYear(d: Date): string {
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export async function getWork(): Promise<Work[]> {
  return (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
}

/** Newest first. */
export async function getNotes(): Promise<Note[]> {
  return (await getCollection('notes')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id),
  );
}

/** Most recent role first ("January 2024" sorts above "May 2019"). */
export async function getRoles(): Promise<Role[]> {
  const started = (r: Role) => Date.parse(`1 ${r.data.start} UTC`);
  return (await getCollection('roles')).sort((a, b) => started(b) - started(a));
}

export async function getProfile() {
  const entry = await getEntry('profile', 'main');
  if (!entry) throw new Error('src/content/profile.yaml needs a "main" entry');
  return entry.data;
}
