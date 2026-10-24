// Every public, indexable page: one list for the sitemap and the share images.
import { getProfile, getWork } from './content';

export interface PublicPage {
  /** URL path with a trailing slash. */
  path: string;
  /** Share-image file name: /og/<slug>.png */
  slug: string;
  kicker: string;
  title: string;
  line?: string;
}

export async function getPublicPages(): Promise<PublicPage[]> {
  const [profile, work] = await Promise.all([getProfile(), getWork()]);
  return [
    {
      path: '/',
      slug: 'home',
      kicker: `${profile.name} · ${profile.title}`,
      title: profile.headline.join(' '),
    },
    ...work.map((w) => ({
      path: `/work/${w.id}/`,
      slug: `work-${w.id}`,
      kicker: `Project No. ${w.data.no} · ${profile.name}`,
      title: w.data.title,
      line: w.data.short,
    })),
    {
      path: '/cv/',
      slug: 'cv',
      kicker: 'Curriculum vitae',
      title: profile.cv.name,
      line: `${profile.cv.title}. Experience, skills, education and certifications.`,
    },
    {
      path: '/privacy/',
      slug: 'privacy',
      kicker: profile.name,
      title: 'Privacy',
      line: 'What this site collects, and who processes it.',
    },
  ];
}

/** Share image for a path; pages without their own card use the home card. */
export async function ogImageFor(path: string): Promise<string> {
  const normalised = path.endsWith('/') ? path : `${path}/`;
  const page = (await getPublicPages()).find((p) => p.path === normalised);
  return `/og/${page?.slug ?? 'home'}.png`;
}
