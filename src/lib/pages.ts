// Every public, indexable page: one list for the sitemap and the share images.
import { getProfile, getSkills, getWork } from './content';

/** The privacy notice's "Last updated" (shown on the page and in the sitemap). */
export const PRIVACY_UPDATED = new Date('2026-10-24T00:00:00Z');

export interface PublicPage {
  /** URL path with a trailing slash. */
  path: string;
  /** Share-image file name: /og/<slug>.png */
  slug: string;
  kicker: string;
  title: string;
  line?: string;
  /** A short line for the lower part of the share card (stack or lead skills). */
  stack?: string;
  /** false: no card of its own; the page shares the home card (DESIGN_PLAN call 8). */
  card?: boolean;
  /** When the content last changed: the sitemap's lastmod. */
  updated: Date;
}

export async function getPublicPages(): Promise<PublicPage[]> {
  const [profile, work, skills] = await Promise.all([getProfile(), getWork(), getSkills()]);
  return [
    {
      path: '/',
      slug: 'home',
      kicker: profile.title,
      title: profile.headline.join(' '),
      stack: skills.filter((s) => s.data.tier === 'lead').map((s) => s.data.name).join(' · '),
      updated: profile.updated,
    },
    ...work.map((w) => ({
      path: `/work/${w.id}/`,
      slug: `work-${w.id}`,
      kicker: `Project No. ${w.data.no}`,
      title: w.data.title,
      line: w.data.short,
      stack: w.data.stack.slice(0, 4).join(' · '),
      updated: w.data.updated,
    })),
    {
      path: '/cv/',
      slug: 'cv',
      kicker: 'Curriculum vitae',
      title: profile.cv.title,
      line: 'Experience, skills, education and certifications.',
      updated: profile.updated,
    },
    {
      path: '/privacy/',
      slug: 'privacy',
      kicker: 'Site notice',
      title: 'Privacy',
      card: false,
      updated: PRIVACY_UPDATED,
    },
  ];
}

/** Share image for a path; pages without their own card use the home card. */
export async function ogImageFor(path: string): Promise<string> {
  const normalised = path.endsWith('/') ? path : `${path}/`;
  const page = (await getPublicPages()).find((p) => p.path === normalised && p.card !== false);
  return `/og/${page?.slug ?? 'home'}.png`;
}
