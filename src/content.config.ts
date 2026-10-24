import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const status = z.enum(['live', 'shipped', 'in-progress', 'handed-over']);

// Case studies. Client names never appear: `client` is a generic description.
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
    hours: z.number().int(),
    tasks: z.number().int().optional(),
    stack: z.array(z.string()).min(1),
    status,
    hindsight: z.string(),
    cv: z
      .object({
        heading: z.string(),
        bullets: z.array(z.string()).min(1),
      })
      .optional(),
  }),
});

// One entry per shipped change, written for the person who uses the software.
const log = defineCollection({
  loader: file('src/content/log.yaml'),
  schema: z.object({
    date: z.coerce.date(),
    work: reference('work').optional(),
    label: z.string(),
    text: z.string(),
    status,
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
    now: z.object({ date: z.coerce.date(), lines: z.array(z.string()).min(1) }),
    figures: z.array(z.object({ value: z.string(), label: z.string() })).length(4),
  }),
});

export const collections = { work, log, roles, profile };
