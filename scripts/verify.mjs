// Builds nothing: run `npm run build` first. Serves dist/ with `astro preview`,
// then checks every route at phone, tablet and desktop widths in both themes:
// axe-core (WCAG 2.2 A/AA), no sideways scrolling, and a screenshot of each.
// Usage: node scripts/verify.mjs [screenshot-dir]
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const PORT = 4329;
const BASE = `http://localhost:${PORT}`;
const ROUTES = ['/', '/work/jayne-bandy-ai/', '/work/care-plan-drafting', '/notes/', '/notes', '/system/', '/no-such-page'];
const WIDTHS = [390, 768, 1440];
const THEMES = ['paper', 'night'];
const outDir = process.argv[2];
if (outDir) mkdirSync(outDir, { recursive: true });

// `astro preview` runs as a background daemon in Astro 7: stop any old one first.
const astro = (...args) =>
  new Promise((resolve) => spawn('npx', ['astro', ...args], { stdio: 'ignore' }).on('exit', resolve));
await astro('preview', 'stop');
spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
const stop = () => astro('preview', 'stop');

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('preview server did not start');
}

const failures = [];

try {
  await waitForServer();
  const browser = await chromium.launch();
  for (const theme of THEMES) {
    for (const width of WIDTHS) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.addInitScript((t) => localStorage.setItem('theme', t), theme);
      const page = await context.newPage();
      for (const route of ROUTES) {
        const tag = `${route} @${width} ${theme}`;
        await page.goto(BASE + route, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1600); // let the load sequence finish

        const applied = await page.evaluate(() => document.documentElement.dataset.theme);
        if (applied !== theme) failures.push(`${tag}: theme is "${applied}"`);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        if (overflow > 0) failures.push(`${tag}: scrolls sideways by ${overflow}px`);

        await page.addScriptTag({ content: axeSource });
        const result = await page.evaluate(() =>
          window.axe.run(document, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
          }),
        );
        for (const v of result.violations) {
          failures.push(`${tag}: axe ${v.id} (${v.nodes.length}) ${v.help}`);
        }

        if (outDir) {
          const name = `${route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replaceAll('/', '_')}-${width}-${theme}.png`;
          // 'disabled' fast-forwards finished animations, so the shot shows the end state.
          await page.screenshot({ path: join(outDir, name), fullPage: true, animations: 'disabled' });
        }
      }
      await context.close();
    }
  }

  // Reduced motion: content must be fully visible with no animation running.
  const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await rm.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const running = await page.evaluate(() => document.getAnimations().length);
  if (running > 0) failures.push(`reduced motion: ${running} animation(s) still running`);
  await rm.close();

  await browser.close();
} catch (err) {
  failures.push(String(err));
} finally {
  await stop();
}

if (failures.length) {
  console.error(`verify found ${failures.length} problem(s):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`verify ok: ${ROUTES.length} routes × ${WIDTHS.length} widths × ${THEMES.length} themes`);
