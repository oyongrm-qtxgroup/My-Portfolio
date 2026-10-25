// Screenshots each share card (/og/<slug>/, built from src/pages/og/[slug].astro)
// to public/og/<slug>.png at 1200×630. Run after `npm run build`, then build again
// so the images ship.
//   npm run og             write the images and their content hash
//   npm run og -- --check  fail if the images are missing or out of date (CI)
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { serveStatic } from './serve-static.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const BUILT = join(ROOT, '.vercel/output/static/og');
const OUT = join(ROOT, 'public/og');
const HASH = join(OUT, 'cards.sha256');
const check = process.argv.includes('--check');

if (!existsSync(BUILT)) throw new Error('No share cards in the build: run `npm run build` first.');
// Cards are the /og/<slug>/ pages; the PNGs from public/og sit beside them in the build.
const slugs = readdirSync(BUILT, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
mkdirSync(OUT, { recursive: true });

const failures = [];
const { base, close } = await serveStatic(4336);
const browser = await chromium.launch();
const hash = createHash('sha256');

try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  // Archivo is font-display: optional: fill the cache first so every card renders with it.
  await page.goto(`${base}/og/${slugs[0]}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  for (const slug of slugs) {
    await page.goto(`${base}/og/${slug}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // The card's markup and styles decide the image; hash them, not the PNG bytes.
    hash.update(slug).update(await page.evaluate(() => document.head.querySelector('style')?.textContent + document.body.innerHTML));
    const overflow = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const foot = document.querySelector('.foot');
      return !!h1 && !!foot && h1.getBoundingClientRect().bottom > foot.getBoundingClientRect().top;
    });
    if (overflow) failures.push(`${slug}: the title runs into the footer; shorten it or adjust the card`);
    if (!check) await page.screenshot({ path: join(OUT, `${slug}.png`) });
    else if (!existsSync(join(OUT, `${slug}.png`))) failures.push(`public/og/${slug}.png is missing`);
  }

  const digest = hash.digest('hex');
  if (check) {
    const recorded = existsSync(HASH) ? readFileSync(HASH, 'utf8').trim() : '';
    if (recorded !== digest) failures.push('share images are out of date: run `npm run build && npm run og && npm run build`');
  } else {
    writeFileSync(HASH, `${digest}\n`);
  }

  if (failures.length) {
    console.error(`og found ${failures.length} problem(s):\n${failures.join('\n')}`);
    process.exitCode = 1;
  } else {
    console.log(`og ok: ${slugs.length} cards${check ? ', up to date' : ' written to public/og/'}`);
  }
} finally {
  await browser.close();
  await close();
}
