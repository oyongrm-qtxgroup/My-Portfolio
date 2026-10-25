// schema.org structured data shared by the pages (DESIGN_PLAN Step 17): one Person,
// referred to by @id from the case studies' Articles and the WebSite.
import { STABLE as portraitUrl } from './portrait';
import type { getProfile, getRoles, getSkills } from './content';

type Profile = Awaited<ReturnType<typeof getProfile>>;
type Roles = Awaited<ReturnType<typeof getRoles>>;
type Skills = Awaited<ReturnType<typeof getSkills>>;

export const personId = (site: URL) => new URL('/#person', site).href;
export const websiteId = (site: URL) => new URL('/#website', site).href;

/** The Person and the WebSite, for the home page. */
export function homeGraph(site: URL, profile: Profile, roles: Roles, skills: Skills) {
  const current = roles.find((r) => r.data.current);
  const person = {
    '@type': 'Person',
    '@id': personId(site),
    name: profile.name,
    jobTitle: profile.title,
    description: profile.summary,
    url: site.href,
    email: `mailto:${profile.email}`,
    image: new URL(portraitUrl, site).href,
    address: { '@type': 'PostalAddress', addressCountry: 'PH' },
    ...(current && { worksFor: { '@type': 'Organization', name: current.data.org } }),
    alumniOf: profile.cv.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
    hasOccupation: {
      '@type': 'Occupation',
      name: profile.title,
      skills: skills.filter((s) => s.data.tier === 'lead').map((s) => s.data.name).join(', '),
    },
    knowsAbout: skills.map((s) => s.data.name),
    sameAs: [profile.links.linkedin, profile.links.github],
  };
  const website = {
    '@type': 'WebSite',
    '@id': websiteId(site),
    url: site.href,
    name: profile.name,
    inLanguage: 'en-AU',
    author: { '@id': personId(site) },
  };
  return { '@context': 'https://schema.org', '@graph': [person, website] };
}

interface ArticleInput {
  url: URL;
  title: string;
  description: string;
  about: string;
  updated: Date;
  image: URL;
  authorName: string;
}

/** A case study: an Article by the Person, and where it sits on the site. */
export function articleGraph(site: URL, a: ArticleInput) {
  const article = {
    '@type': 'Article',
    '@id': `${a.url.href}#article`,
    headline: a.title,
    description: a.description,
    url: a.url.href,
    mainEntityOfPage: a.url.href,
    image: a.image.href,
    inLanguage: 'en-AU',
    dateModified: a.updated.toISOString().slice(0, 10),
    author: { '@type': 'Person', '@id': personId(site), name: a.authorName, url: site.href },
    about: { '@type': 'SoftwareApplication', name: a.title, description: a.about },
    isPartOf: { '@id': websiteId(site) },
  };
  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.href },
      { '@type': 'ListItem', position: 2, name: 'Selected work', item: new URL('/#work', site).href },
      { '@type': 'ListItem', position: 3, name: a.title, item: a.url.href },
    ],
  };
  return { '@context': 'https://schema.org', '@graph': [article, breadcrumbs] };
}
