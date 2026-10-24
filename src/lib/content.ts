import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Skill = CollectionEntry<'skills'>;
export type Principle = CollectionEntry<'principles'>;
export type Work = CollectionEntry<'work'>;
export type Role = CollectionEntry<'roles'>;

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export async function getSkills(): Promise<Skill[]> {
  return (await getCollection('skills')).sort(byOrder);
}

export async function getPrinciples(): Promise<Principle[]> {
  return (await getCollection('principles')).sort(byOrder);
}

export async function getWork(): Promise<Work[]> {
  return (await getCollection('work')).sort(byOrder);
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
