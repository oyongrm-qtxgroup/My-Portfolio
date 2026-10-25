import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// What I can do, with the evidence for it. `lead` areas get a full block on the
// home page; `foundation` areas sit in the "How I build" grid.
const skills = defineCollection({
  loader: file('src/content/skills.yaml'),
  schema: z.object({
    order: z.number().int(),
    tier: z.enum(['lead', 'foundation']),
    name: z.string(),
    summary: z.string(),
    pitch: z.string(),
    proof: z
      .array(
        z.object({
          text: z.string(),
          work: reference('work').optional(),
        }),
      )
      .min(1),
  }),
});

// Working principles ("How I work"): no dates, no incident stories.
const principles = defineCollection({
  loader: file('src/content/principles.yaml'),
  schema: z.object({
    order: z.number().int(),
    title: z.string(),
    body: z.string(),
    skill: reference('skills'),
  }),
});

// Project pages: the challenge, the approach and the result, as evidence for skills.
// Client names never appear: `client` is a generic description.
const work = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/work' }),
  schema: z.object({
    no: z.string().regex(/^\d{2}$/),
    order: z.number().int(),
    title: z.string(),
    short: z.string(),
    line: z.string(),
    client: z.string(),
    role: z.string(),
    period: z.string(),
    stack: z.array(z.string()).min(1),
    status: z.enum(['live', 'shipped', 'in-progress', 'handed-over']),
    skills: z.array(reference('skills')).min(1),
  }),
});

// Employment history. Every CV bullet lives here: `highlights` for a role, or
// `projects` when a role's bullets are grouped by project (as at QTX).
const roles = defineCollection({
  loader: file('src/content/roles.yaml'),
  schema: z.object({
    org: z.string(),
    short: z.string(),
    place: z.string(),
    title: z.string(),
    start: z.string(),
    end: z.string().optional(),
    summary: z.string(),
    highlights: z.array(z.string()).default([]),
    projects: z
      .array(z.object({ heading: z.string(), bullets: z.array(z.string()).min(1) }))
      .default([]),
    current: z.boolean().default(false),
  }),
});

const profile = defineCollection({
  loader: file('src/content/profile.yaml'),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    headline: z.array(z.string()).min(1),
    lede: z.string(),
    summary: z.string(),
    location: z.string(),
    availability: z.string(),
    availabilityChecked: z.coerce.string().regex(/^\d{4}-\d{2}$/),
    email: z.email(),
    links: z.object({ linkedin: z.url(), github: z.url() }),
    // Repos shown in the Proof band (DESIGN_PLAN DS1): only these, each only while public.
    github: z.object({
      user: z.string(),
      repos: z.array(z.object({ name: z.string(), line: z.string().optional() })).min(1),
    }),
    // The date the content last changed, for the footer (not the build date: a daily
    // GitHub rebuild mustn't move it).
    updated: z.coerce.date(),
    // Each figure links to the case study that proves it (DESIGN_PLAN Step 12).
    figures: z.array(z.object({ value: z.string(), label: z.string(), work: reference('work') })).min(3).max(4),
    cv: z.object({
      name: z.string(),
      title: z.string(),
      location: z.string(),
      site: z.string(),
      skills: z.array(z.object({ label: z.string(), items: z.string() })).min(1),
      education: z.array(
        z.object({
          school: z.string(),
          place: z.string(),
          degree: z.string(),
          year: z.string(),
          notes: z.array(z.string()).default([]),
        }),
      ),
      certifications: z.array(z.object({ name: z.string(), date: z.string() })),
    }),
  }),
});

// Recommendations, quoted word for word (DESIGN_PLAN DS3, DS15). Attributed by role and
// employer only; no entry without the writer's consent date.
const endorsements = defineCollection({
  loader: file('src/content/endorsements.yaml'),
  schema: z.object({
    quote: z.string().min(1),
    role: z.string(),
    employer: z.string(),
    relationship: z.string().optional(),
    work: reference('work').optional(),
    home: z.boolean().default(false),
    source_url: z.url(),
    consented: z.coerce.date(),
    checked: z.coerce.date(),
  }),
});

export const collections = { skills, principles, work, roles, profile, endorsements };
