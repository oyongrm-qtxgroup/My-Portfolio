// Sitemap of the public pages (src/lib/pages.ts), with absolute URLs.
import type { APIRoute } from 'astro';
import { getPublicPages } from '../lib/pages';

export const GET: APIRoute = async ({ site }) => {
  const urls = (await getPublicPages())
    .map((p) => `  <url><loc>${new URL(p.path, site)}</loc><lastmod>${p.updated.toISOString().slice(0, 10)}</lastmod></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
