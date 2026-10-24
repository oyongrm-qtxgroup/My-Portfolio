import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'work'>;
export type LogEntry = CollectionEntry<'log'>;
export type Role = CollectionEntry<'roles'>;

/** 24.10 */
export function dayMonth(d: Date): string {
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}`;
}

export function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function monthName(d: Date): string {
  return d.toLocaleDateString('en-AU', { month: 'long', timeZone: 'UTC' });
}

export async function getWork(): Promise<Work[]> {
  return (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
}

/** Newest first. */
export async function getLog(): Promise<LogEntry[]> {
  return (await getCollection('log')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime() || b.id.localeCompare(a.id),
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

/** Log filters: one per case study, plus "client work" for entries without one. */
export async function getLogFilters() {
  const [work, log] = await Promise.all([getWork(), getLog()]);
  const filters = work.map((w) => ({
    slug: w.id,
    label: w.data.title,
    count: log.filter((e) => e.data.work?.id === w.id).length,
  }));
  const other = log.filter((e) => !e.data.work).length;
  if (other) filters.push({ slug: 'client-work', label: 'Client work', count: other });
  return filters.filter((f) => f.count > 0);
}
