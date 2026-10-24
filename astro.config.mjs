import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

// Canonical URL is the planned free alias (docs/REDESIGN_PLAN.md §2, item 3).
export default defineConfig({
  site: 'https://raymundo-oyong.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [mdx()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
});
