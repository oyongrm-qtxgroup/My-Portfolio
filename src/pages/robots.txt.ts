// Everything public is crawlable except the internal pages; points to the sitemap.
// /og/ stays crawlable so link previews can fetch the share images; the card
// templates there are noindex.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nDisallow: /system/\nDisallow: /contact/\n\nSitemap: ${new URL('/sitemap.xml', site)}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
