import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Case studies: the problem, what I did, and the notes that came out of it.
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
    cv: z
      .object({
        heading: z.string(),
        bullets: z.array(z.string()).min(1),
      })
      .optional(),
  }),
});

// Short stories about something that went wrong or surprised me, and what it taught me.
const notes = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    work: reference('work').optional(),
  }),
});

const roles = defineCollection({
  loader: file('src/content/roles.yaml'),
  schema: z.object({
    org: z.string(),
    place: z.string(),
    title: z.string(),
    start: z.string(),
    end: z.string().optional(),
    span: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()),
    current: z.boolean().default(false),
  }),
});

const profile = defineCollection({
  loader: file('src/content/profile.yaml'),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    location: z.string(),
    email: z.email(),
    links: z.object({ linkedin: z.url(), github: z.url() }),
    now: z.string(),
  }),
});

export const collections = { work, notes, roles, profile };
