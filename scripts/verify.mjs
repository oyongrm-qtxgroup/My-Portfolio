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
const ROUTES = ['/', '/work/jayne-bandy-ai/', '/work/sap-automation/', '/work/care-plan-drafting', '/cv/', '/system/', '/no-such-page'];
// 320 px is WCAG reflow (a 1280 px window at 400% zoom); 390 also covers 200% zoom.
const WIDTHS = [320, 390, 768, 1440];
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

  // Phone menu: a disclosure button; Escape closes it and returns focus; axe-clean when open.
  for (const theme of THEMES) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
    const p = await ctx.newPage();
    const tag = `phone menu ${theme}`;
    await p.goto(BASE + '/work/jayne-bandy-ai/', { waitUntil: 'networkidle' });
    await p.mouse.wheel(0, 1500); // open it from part-way down the page
    const button = p.locator('.menu-button');
    if (!(await button.isVisible())) failures.push(`${tag}: menu button not shown`);
    else {
      await button.focus();
      await p.keyboard.press('Enter');
      const expanded = await button.getAttribute('aria-expanded');
      if (expanded !== 'true') failures.push(`${tag}: aria-expanded is ${expanded} after opening`);
      if (!(await p.locator('#phone-menu').isVisible())) failures.push(`${tag}: sheet not visible`);
      if (!(await button.isVisible())) failures.push(`${tag}: Close button scrolled out of view`);
      const inert = await p.evaluate(() => document.querySelector('main')?.inert);
      if (!inert) failures.push(`${tag}: page behind the menu is not inert`);
      const small = await p.$$eval('#phone-menu a, #phone-menu button, .menu-button', (els) =>
        els.filter((el) => el.getBoundingClientRect().height < 44 && el.matches('button, .sheet-link')).length,
      );
      if (small) failures.push(`${tag}: ${small} target(s) under 44 px`);
      await p.addScriptTag({ content: axeSource });
      const res = await p.evaluate(() =>
        window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
        }),
      );
      for (const v of res.violations) failures.push(`${tag}: axe ${v.id} (${v.nodes.length}) ${v.help}`);
      if (outDir) await p.screenshot({ path: join(outDir, `menu-open-390-${theme}.png`) });
      await p.keyboard.press('Escape');
      if ((await button.getAttribute('aria-expanded')) !== 'false') failures.push(`${tag}: Escape did not close`);
      const focused = await p.evaluate(() => document.activeElement?.classList.contains('menu-button'));
      if (!focused) failures.push(`${tag}: focus did not return to the button`);
      // A link in the sheet navigates and leaves the menu closed on the new page.
      await button.click();
      await p.locator('#phone-menu a[href="/cv/"]').click();
      await p.waitForURL('**/cv/');
      await p.waitForTimeout(300);
      const after = await p.evaluate(() => ({
        expanded: document.querySelector('.menu-button')?.getAttribute('aria-expanded'),
        locked: document.documentElement.classList.contains('menu-lock'),
      }));
      if (after.expanded !== 'false' || after.locked) failures.push(`${tag}: menu state leaked across navigation`);
    }
    await ctx.close();
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
