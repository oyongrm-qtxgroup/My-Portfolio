import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

// Canonical URL is the planned free alias (docs/REDESIGN_PLAN.md §2, item 3).
export default defineConfig({
  site: 'https://raymundo-oyong.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [mdx()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Inline all CSS: it is small, and separate files blocked the first paint.
  build: { inlineStylesheets: 'always' },
  // The old site's blog is gone; its links go home (posts: src/pages/blog/[...slug].ts).
  redirects: { '/blog': '/' },
  // Contact form (src/actions). Pages stay static; only the action runs on demand.
  // Secrets are optional at build time: the action refuses to run in production
  // without them, and falls back to Cloudflare's test keys and a dry run elsewhere.
  env: {
    schema: {
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
      TURNSTILE_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({ context: 'server', access: 'public', default: 'oyongrm@gmail.com' }),
      CONTACT_FROM: envField.string({
        context: 'server',
        access: 'public',
        default: 'Portfolio contact form <onboarding@resend.dev>',
      }),
      VERCEL_ENV: envField.string({ context: 'server', access: 'public', optional: true }),
    },
  },
});
