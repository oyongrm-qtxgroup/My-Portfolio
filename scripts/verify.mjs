// Builds nothing: run `npm run build` first. Serves the built static pages
// (.vercel/output/static), then checks every route at phone, tablet and desktop
// widths in both themes: axe-core (WCAG 2.2 A/AA), no sideways scrolling, and a
// screenshot of each. The contact action and Turnstile are mocked in the browser;
// the real action is exercised on the Vercel preview.
// Usage: node scripts/verify.mjs [screenshot-dir]
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { extname, join, normalize } from 'node:path';
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

// `astro preview` can't serve a build with a Vercel function in it, so serve the
// static output the way Vercel does: /path/ → /path/index.html, unknown → 404.html.
const ROOT = new URL('../.vercel/output/static/', import.meta.url).pathname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf' };
const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, BASE).pathname)).replace(/^(\.\.[/\\])+/, '');
  const file = [join(ROOT, path), join(ROOT, path, 'index.html'), join(ROOT, `${path}.html`)].find(
    (f) => f.startsWith(ROOT) && existsSync(f) && statSync(f).isFile(),
  );
  const served = file ?? join(ROOT, '404.html');
  res.writeHead(file ? 200 : 404, { 'content-type': TYPES[extname(served)] ?? 'application/octet-stream' });
  res.end(readFileSync(served));
});
await new Promise((resolve) => server.listen(PORT, resolve));
const stop = () => new Promise((resolve) => server.close(resolve));

// Turnstile stub: renders nothing and hands out a token at once.
const TURNSTILE_STUB = `window.turnstile = { render: () => 'w1', getResponse: () => 'test-token', reset: () => {} };`;
async function mockContact(page, reply) {
  await page.route('https://challenges.cloudflare.com/**', (route) =>
    route.fulfill({ contentType: 'text/javascript', body: TURNSTILE_STUB }),
  );
  await page.route('**/_actions/contact**', reply);
}

async function axe(page, tag) {
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(() =>
    window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    }),
  );
  for (const v of result.violations) failures.push(`${tag}: axe ${v.id} (${v.nodes.length}) ${v.help}`);
}

const failures = [];

try {
  const browser = await chromium.launch();
  for (const theme of THEMES) {
    for (const width of WIDTHS) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.route('https://challenges.cloudflare.com/**', (route) =>
        route.fulfill({ contentType: 'text/javascript', body: TURNSTILE_STUB }),
      );
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

  // Contact form states (docs/design/States, D) with a mocked action.
  for (const theme of THEMES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
    const p = await ctx.newPage();
    const tag = `contact ${theme}`;
    let replies = 0;
    await mockContact(p, (route) => {
      replies++;
      // First send succeeds (devalue-encoded result), the second fails like a server error.
      if (replies === 1)
        return route.fulfill({ status: 200, contentType: 'application/json+devalue', body: '[{"received":1},true]' });
      return route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ type: 'AstroActionError', code: 'INTERNAL_SERVER_ERROR', status: 500, message: "The message didn't send." }),
      });
    });
    await p.goto(BASE + '/#contact', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1600); // let the load sequence finish
    const form = p.locator('[data-contact]');

    // Invalid: errors in words under the fields, focus on the first one.
    await form.locator('button[type=submit]').click();
    const invalid = await p.evaluate(() => ({
      email: document.querySelector('#cf-email')?.getAttribute('aria-invalid'),
      emailErr: document.querySelector('#cf-email-err')?.textContent,
      focused: document.activeElement?.id,
    }));
    if (invalid.email !== 'true' || !invalid.emailErr) failures.push(`${tag}: invalid email not flagged`);
    if (invalid.focused !== 'cf-email') failures.push(`${tag}: focus not moved to the first invalid field`);
    if (replies) failures.push(`${tag}: invalid form was sent`);
    await axe(p, `${tag} invalid`);
    if (outDir) await form.screenshot({ path: join(outDir, `contact-invalid-${theme}.png`) });

    // Sent: "Received" stamp and a status line; the form clears.
    await p.fill('#cf-email', 'alex@clinic.com.au');
    await p.fill('#cf-message', 'A booking line for three clinics.');
    await form.locator('button[type=submit]').click();
    await p.locator('[data-received]:not([hidden])').waitFor({ timeout: 5000 }).catch(() => {});
    await p.waitForTimeout(600); // the stamp presses in from transparent
    const sent = await p.evaluate(() => ({
      stamp: document.querySelector('[data-received]')?.textContent ?? '',
      status: document.querySelector('[data-form-status]')?.textContent ?? '',
      cleared: document.querySelector('#cf-message')?.value === '',
    }));
    if (!sent.stamp.startsWith('Received')) failures.push(`${tag}: no "Received" stamp after sending`);
    if (!sent.status.includes('alex@clinic.com.au')) failures.push(`${tag}: no confirmation status`);
    if (!sent.cleared) failures.push(`${tag}: form not cleared after sending`);
    await axe(p, `${tag} sent`);
    if (outDir) await form.screenshot({ path: join(outDir, `contact-sent-${theme}.png`) });

    // Failed: an alert with the email fallback, and the message is kept.
    await p.fill('#cf-email', 'alex@clinic.com.au');
    await p.fill('#cf-message', 'Keep this message, please.');
    await form.locator('button[type=submit]').click();
    await p.locator('[data-failed]:not([hidden])').waitFor({ timeout: 5000 }).catch(() => {});
    const failed = await p.evaluate(() => ({
      shown: !document.querySelector('[data-failed]')?.hidden,
      kept: document.querySelector('#cf-message')?.value,
      enabled: !document.querySelector('.send')?.disabled,
    }));
    if (!failed.shown) failures.push(`${tag}: failed state not shown`);
    if (failed.kept !== 'Keep this message, please.') failures.push(`${tag}: message lost after a failure`);
    if (!failed.enabled) failures.push(`${tag}: Send stays disabled after a failure`);
    await axe(p, `${tag} failed`);
    if (outDir) await form.screenshot({ path: join(outDir, `contact-failed-${theme}.png`) });
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
