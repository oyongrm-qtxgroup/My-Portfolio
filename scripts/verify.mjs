// Builds nothing: run `npm run build` first. Serves the built static pages
// (scripts/serve-static.mjs), then checks every route at phone, tablet and desktop
// widths in both themes: axe-core (WCAG 2.2 A/AA), no sideways scrolling, and a
// screenshot of each; then layout shift with the fonts held back (the worst case).
// The contact action and Turnstile are mocked in the browser; the real action is
// exercised on the Vercel preview.
// Usage: node scripts/verify.mjs [screenshot-dir]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { serveStatic } from './serve-static.mjs';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const PORT = 4329;
const BASE = `http://localhost:${PORT}`;
const ROUTES = ['/', '/work/jayne-bandy-ai/', '/work/sap-automation/', '/work/ziaris/', '/cv/', '/privacy/', '/system/', '/no-such-page'];
// 320 px is WCAG reflow (a 1280 px window at 400% zoom); 390 also covers 200% zoom.
const WIDTHS = [320, 390, 768, 1024, 1440, 1920];
const THEMES = ['paper', 'night'];
const outDir = process.argv[2];
if (outDir) mkdirSync(outDir, { recursive: true });

const { close: stop } = await serveStatic(PORT);

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
      // Archivo is font-display: optional; fill the cache so the shots show it.
      await page.goto(BASE + '/', { waitUntil: 'networkidle' });
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

        // Lists of short items (stack, meta): no item breaks inside ("GPT-" / "5.5"),
        // and no rendered line starts with a separator ("· Supabase").
        const lists = await page.evaluate(() => {
          const out = [];
          for (const li of document.querySelectorAll('[data-stack-list] > li')) {
            const lines = li.getBoundingClientRect().height / parseFloat(getComputedStyle(li).lineHeight);
            if (lines < 1.5) continue;
            // Wrapping inside is right only for an item longer than the whole line.
            li.style.whiteSpace = 'nowrap';
            const fits = li.scrollWidth <= li.parentElement.clientWidth - parseFloat(getComputedStyle(li).marginLeft);
            li.style.whiteSpace = '';
            if (fits) out.push(`"${li.textContent}" breaks inside`);
          }
          for (const el of document.querySelectorAll('.stack, .meta dd, [data-stack-list]')) {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            let lastTop = null;
            while (walker.nextNode()) {
              const node = walker.currentNode;
              for (let i = 0; i < node.length; i++) {
                if (!node.data[i].trim()) continue;
                const range = document.createRange();
                range.setStart(node, i);
                range.setEnd(node, i + 1);
                const top = Math.round(range.getBoundingClientRect().top);
                if (lastTop === null || top > lastTop + 2) {
                  if (node.data[i] === '·') out.push(`a line starts with "·" in "${el.textContent.trim().slice(0, 40)}"`);
                  lastTop = top;
                }
              }
            }
          }
          return out;
        });
        for (const l of lists) failures.push(`${tag}: ${l}`);

        // Illustrations are invented (DS9): nothing in them may look like a phone number.
        const phoneLike = await page.evaluate(() =>
          [...document.querySelectorAll('.transcript, [data-ledger]')]
            .map((el) => el.textContent.replace(/\b(19|20)\d{2}\b/g, ''))
            .find((t) => /\+?\d[\d ()-]{8,}\d/.test(t)),
        );
        if (phoneLike) failures.push(`${tag}: something that looks like a phone number is in an illustration`);
        // The worked shift shows no money: no currency symbol, code or amount (DS9).
        const money = await page.evaluate(() =>
          [...document.querySelectorAll('[data-ledger]')].some((el) =>
            /[$€£¥₱]|\b(AUD|USD|PHP)\b|\d+\.\d{2}\b/.test(el.textContent),
          ),
        );
        if (money) failures.push(`${tag}: a currency symbol or amount is in the worked shift`);

        // A project's glyph is drawn from the same spec as a figure on its page.
        if (route.startsWith('/work/')) {
          const glyph = await page.evaluate(() => {
            const g = document.querySelector('.cs-glyph svg[data-glyph]');
            const figs = [...document.querySelectorAll('svg[data-figure]')].map((f) => [f.dataset.figure, f.dataset.boxes]);
            return g && { key: g.dataset.glyph, boxes: g.dataset.boxes, match: figs.some(([k, n]) => k === g.dataset.glyph && n === g.dataset.boxes) };
          });
          if (!glyph) failures.push(`${tag}: no project glyph`);
          else if (!glyph.match) failures.push(`${tag}: the glyph doesn't match a figure on the page`);
        }

        // Figures: margin red only on failure paths (DS7), never on a box or plain edge.
        const red = await page.evaluate(() => {
          const margin = getComputedStyle(document.documentElement).getPropertyValue('--margin').trim().toLowerCase();
          const toHex = (c) => {
            const m = c.match(/\d+/g);
            return m ? '#' + m.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, '0')).join('') : c;
          };
          const bad = [];
          for (const el of document.querySelectorAll('[data-figure] *')) {
            const cs = getComputedStyle(el);
            if (cs.display === 'none') continue;
            const isRed = [cs.stroke, cs.fill].some((c) => toHex(c) === margin);
            if (isRed && !el.closest('.fail')) bad.push(el.getAttribute('class') ?? el.tagName);
          }
          return bad;
        });
        if (red.length) failures.push(`${tag}: margin red outside a failure path in a figure (${red.slice(0, 3).join(', ')})`);

        // Typographic quotes in what people read (code samples aside).
        if (width === 1440) {
          const straight = await page.evaluate(() => {
            const main = document.querySelector('main')?.cloneNode(true);
            main?.querySelectorAll('code, pre, script, style, [data-allow-straight]').forEach((n) => n.remove());
            return (main?.textContent ?? '').match(/.{0,30}"/)?.[0];
          });
          if (straight) failures.push(`${tag}: straight double quote in "${straight.trim()}"`);
        }

        // Phones: a link that stands alone (not inside a sentence) is at least 44 px tall.
        if (width <= 390) {
          const small = await page.$$eval('a', (links) =>
            links
              .filter((a) => {
                // A link stretched over its row (::after inset 0) is as big as the row.
                const stretched = getComputedStyle(a, '::after').position === 'absolute';
                const box = (stretched ? a.offsetParent ?? a : a).getBoundingClientRect();
                if (!box.width || a.closest('[hidden], .visually-hidden, .skip')) return false;
                return a.parentElement?.textContent.trim() === a.textContent.trim() && box.height < 44;
              })
              .map((a) => a.textContent.trim().slice(0, 30)),
          );
          if (small.length) failures.push(`${tag}: link target(s) under 44 px: ${small.join(', ')}`);
        }

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

  // Late fonts: every font response held back 2 s, cold cache. Archivo (optional)
  // must never swap in, and the serif and mono swaps must not move the page.
  for (const width of [390, 1440]) {
    for (const route of ROUTES) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 } });
      await ctx.addInitScript(() => {
        window.__cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
      });
      await ctx.route('**/*.woff2', async (r) => {
        await new Promise((done) => setTimeout(done, 2000));
        await r.continue();
      });
      const p = await ctx.newPage();
      await p.goto(BASE + route, { waitUntil: 'load' });
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(500);
      const cls = await p.evaluate(() => window.__cls);
      if (cls >= 0.02) failures.push(`${route} @${width} late fonts: CLS ${cls.toFixed(3)} (budget < 0.02)`);
      await ctx.close();
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
      // Opening the menu pins the header; the wordmark and button must not move.
      const boxes = () =>
        p.evaluate(() =>
          ['.site-header .brand', '.menu-button'].map((s) => {
            const r = document.querySelector(s).getBoundingClientRect();
            return [Math.round(r.x), Math.round(r.width)];
          }),
        );
      await p.mouse.wheel(0, -100); // bring the tucked header back
      await p.waitForTimeout(400);
      const closed = await boxes();
      await button.focus();
      await p.keyboard.press('Enter');
      const opened = await boxes();
      if (JSON.stringify(closed) !== JSON.stringify(opened))
        failures.push(`${tag}: header moves when the menu opens (${JSON.stringify(closed)} → ${JSON.stringify(opened)})`);
      const expanded = await button.getAttribute('aria-expanded');
      if (expanded !== 'true') failures.push(`${tag}: aria-expanded is ${expanded} after opening`);
      if (!(await p.locator('#phone-menu').isVisible())) failures.push(`${tag}: sheet not visible`);
      if (!(await button.isVisible())) failures.push(`${tag}: Close button scrolled out of view`);
      const inert = await p.evaluate(() => document.querySelector('main')?.inert);
      if (!inert) failures.push(`${tag}: page behind the menu is not inert`);
      const small = await p.$$eval('#phone-menu a, #phone-menu button, .menu-button', (els) =>
        els.filter((el) => el.getBoundingClientRect().height < 44 && el.matches('button, .sheet-link, .contact-set a')).length,
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

  // The menu's foot (Download CV, contact set, availability, theme) fits above the fold
  // on the smallest phone we support, with 56 px link rows (DESIGN_PLAN Step 12).
  for (const theme of THEMES) {
    const ctx = await browser.newContext({ viewport: { width: 320, height: 568 } });
    await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
    const p = await ctx.newPage();
    const tag = `menu foot 320×568 ${theme}`;
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.locator('.menu-button').click();
    const m = await p.evaluate(() => {
      const sheet = document.querySelector('#phone-menu');
      const foot = sheet.querySelector('.sheet-foot').getBoundingClientRect();
      const rows = [...sheet.querySelectorAll('.sheet-link')].map((a) => a.getBoundingClientRect().height);
      const need = ['.cs-button', '.cs-email', '.cs-links', '.sheet-availability', '.theme-switch'].filter(
        (s) => !sheet.querySelector(s),
      );
      return { bottom: foot.bottom, scroll: sheet.scrollHeight - sheet.clientHeight, rows, need };
    });
    if (m.need.length) failures.push(`${tag}: missing ${m.need.join(', ')}`);
    if (m.bottom > 568 || m.scroll > 0) failures.push(`${tag}: foot ends at ${Math.round(m.bottom)} px (fold 568)`);
    if (m.rows.some((h) => h < 56)) failures.push(`${tag}: link rows ${m.rows.map(Math.round).join('/')} px (56 min)`);
    if (outDir) await p.screenshot({ path: join(outDir, `menu-open-320x568-${theme}.png`) });
    await ctx.close();
  }

  // One contact set per screen-end: where a page ends in the contact block, email,
  // LinkedIn, GitHub and the CV each appear once between it and the end of the page.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    for (const [route, end] of [
      ['/', '#contact'],
      ['/work/jayne-bandy-ai/', '.closing'],
      ['/work/ziaris/', '.closing'],
      ['/work/sap-automation/', '.closing'],
    ]) {
      await p.goto(BASE + route, { waitUntil: 'networkidle' });
      const counts = await p.evaluate((sel) => {
        const start = document.querySelector(sel);
        const links = [...document.querySelectorAll('main a, .site-footer a')].filter(
          (a) =>
            (start.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING || start.contains(a)) &&
            a.checkVisibility(), // the form's failed-send fallback stays hidden until it's needed
        );
        const kinds = {
          email: (h) => h.startsWith('mailto:'),
          linkedin: (h) => h.includes('linkedin.com'),
          github: (h) => /^https:\/\/github\.com\/[^/]+\/?$/.test(h),
          cv: (h) => h.endsWith('.pdf'),
        };
        return Object.fromEntries(
          Object.entries(kinds).map(([k, test]) => [k, links.filter((a) => test(a.getAttribute('href'))).length]),
        );
      }, end);
      for (const [k, n] of Object.entries(counts))
        if (n !== 1) failures.push(`contact set ${route}: ${k} appears ${n} times at the end of the page`);
    }
    await ctx.close();
  }

  // Proof grid (DESIGN_PLAN Step 13): every dot links to something that exists, every
  // case study's "Skills shown" tag lands on a grid row, and the table has headers.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    const grid = await p.evaluate(() => {
      const table = document.querySelector('.proof-grid table');
      return {
        rows: [...document.querySelectorAll('.proof-grid tbody tr')].map((tr) => tr.id),
        colHeads: table?.querySelectorAll('thead th[scope="col"]').length ?? 0,
        rowHeads: table?.querySelectorAll('tbody th[scope="row"]').length ?? 0,
        dots: [...document.querySelectorAll('.proof-grid a.mark')].map((a) => ({
          href: a.getAttribute('href'),
          name: a.getAttribute('aria-label'),
          ok: a.getAttribute('href').startsWith('#') ? !!document.getElementById(a.getAttribute('href').slice(1)) : null,
        })),
      };
    });
    if (grid.rows.length < 10 || grid.rowHeads !== grid.rows.length || grid.colHeads < 5)
      failures.push(`proof grid: ${grid.rows.length} rows, ${grid.rowHeads} row headers, ${grid.colHeads} column headers`);
    for (const d of grid.dots) {
      if (!/^Shown in /.test(d.name ?? '')) failures.push(`proof grid: dot to ${d.href} has no accessible name`);
      if (d.ok === false) failures.push(`proof grid: dot to ${d.href} lands nowhere`);
      if (d.ok === null && (await fetch(BASE + d.href)).status !== 200) failures.push(`proof grid: dot to ${d.href} is broken`);
    }
    for (const route of ['/work/jayne-bandy-ai/', '/work/ziaris/', '/work/sap-automation/']) {
      await p.goto(BASE + route, { waitUntil: 'networkidle' });
      const tags = await p.$$eval('.tags a', (as) => as.map((a) => a.getAttribute('href')));
      if (!tags.length) failures.push(`${route}: no "Skills shown" tags`);
      for (const href of tags)
        if (!href.startsWith('/#') || !grid.rows.includes(href.slice(2)))
          failures.push(`${route}: skill tag ${href} is not a proof-grid row`);
    }
    await ctx.close();
  }

  // Career timeline (DESIGN_PLAN Step 14): every role's segment is as long as its dates,
  // across on wide screens and down on phones, on the home page and /cv/.
  for (const [route, width] of [['/', 1440], ['/', 390], ['/cv/', 1440], ['/cv/', 390]]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(BASE + route, { waitUntil: 'networkidle' });
    const off = await p.evaluate(() => {
      const tl = document.querySelector('.timeline');
      if (!tl) return ['no timeline'];
      const track = tl.querySelector('.track').getBoundingClientRect();
      const from = +tl.dataset.from;
      const span = +tl.dataset.to - from;
      const down = track.height > track.width;
      const length = down ? track.height : track.width;
      return [...tl.querySelectorAll('.segment')].flatMap((el) => {
        const r = el.getBoundingClientRect();
        const want = ((+el.dataset.end - +el.dataset.start) / span) * length - 2; // the 2 px gap
        const got = down ? r.height : r.width;
        return Math.abs(got - want) > 1 ? [`${el.dataset.start}–${el.dataset.end}: ${got.toFixed(1)} px, want ${want.toFixed(1)}`] : [];
      });
    });
    for (const o of off) failures.push(`timeline ${route} @${width}: ${o}`);
    await ctx.close();
  }

  // /cv/: the PDF download stays in reach while reading on wide screens.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(BASE + '/cv/', { waitUntil: 'networkidle' });
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await p.waitForTimeout(300);
    const box = await p.evaluate(() => {
      const r = document.querySelector('.cv-sticky a')?.getBoundingClientRect();
      return r && { top: r.top, bottom: r.bottom, left: r.left };
    });
    if (!box || box.top < 0 || box.bottom > 900) failures.push(`/cv/: sticky PDF download not in view mid-page (${JSON.stringify(box)})`);
    await ctx.close();
  }

  // "On this page": each link lands with its heading below the sticky header.
  for (const width of [390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 844 } });
    const p = await ctx.newPage();
    await p.goto(BASE + '/work/ziaris/', { waitUntil: 'networkidle' });
    const links = await p.$$eval('.toc a', (as) => as.map((a) => a.getAttribute('href')));
    if (!links.length) failures.push(`on this page @${width}: no contents list`);
    for (const href of links) {
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.click(`.toc a[href="${href}"]`);
      await p.waitForTimeout(500);
      const pos = await p.evaluate((id) => {
        const h = document.getElementById(decodeURIComponent(id.slice(1)));
        const header = document.querySelector('.site-header').getBoundingClientRect();
        return h ? { top: h.getBoundingClientRect().top, under: Math.max(0, header.bottom) } : null;
      }, href);
      if (!pos) failures.push(`on this page @${width}: ${href} has no target`);
      else if (pos.top < pos.under - 1 || pos.top > 200) failures.push(`on this page @${width}: ${href} lands at ${Math.round(pos.top)}px`);
    }
    await ctx.close();
  }

  // Header: tucks away while scrolling down, comes back on any scroll up.
  for (const width of [390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 844 } });
    const p = await ctx.newPage();
    const tag = `header on scroll @${width}`;
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.mouse.wheel(0, 2400);
    await p.waitForTimeout(500);
    const down = await p.evaluate(() => document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0);
    if (down > 1) failures.push(`${tag}: header still covers the page while scrolling down`);
    await p.mouse.wheel(0, -200);
    await p.waitForTimeout(500);
    const up = await p.evaluate(() => document.querySelector('.site-header')?.getBoundingClientRect().top ?? -1);
    if (Math.abs(up) > 1) failures.push(`${tag}: header did not come back on scroll up (top ${up}px)`);
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

    // Sent: the fields give way to a "Received" stamp and a status line naming the address.
    await p.fill('#cf-email', 'name@example.com');
    await p.fill('#cf-message', 'A senior AI role on our platform team.');
    await form.locator('button[type=submit]').click();
    await p.locator('[data-received]:not([hidden])').waitFor({ timeout: 5000 }).catch(() => {});
    await p.waitForTimeout(600); // the stamp presses in from transparent
    const sent = await p.evaluate(() => ({
      stamp: document.querySelector('[data-received]')?.textContent ?? '',
      status: document.querySelector('[data-form-status]')?.textContent ?? '',
      cleared: document.querySelector('#cf-message')?.value === '',
      fieldsHidden: document.querySelector('[data-form-body]')?.hidden === true,
      focused: document.activeElement?.hasAttribute('data-again'),
    }));
    if (!sent.stamp.startsWith('Received')) failures.push(`${tag}: no "Received" stamp after sending`);
    if (!sent.status.includes('name@example.com')) failures.push(`${tag}: no confirmation status`);
    if (!sent.cleared) failures.push(`${tag}: form not cleared after sending`);
    if (!sent.fieldsHidden) failures.push(`${tag}: fields still shown after sending`);
    if (!sent.focused) failures.push(`${tag}: focus not on "Write another message" after sending`);
    await axe(p, `${tag} sent`);
    if (outDir) await form.screenshot({ path: join(outDir, `contact-sent-${theme}.png`) });

    // "Write another message" brings the empty fields back.
    await p.click('[data-again]');
    const back = await p.evaluate(() => ({
      shown: document.querySelector('[data-form-body]')?.hidden === false,
      focused: document.activeElement?.id,
    }));
    if (!back.shown || back.focused !== 'cf-name') failures.push(`${tag}: "Write another message" did not restore the form`);

    // Failed: an alert with the email fallback, and the message is kept.
    await p.fill('#cf-email', 'name@example.com');
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
  for (const route of ['/', '/work/jayne-bandy-ai/', '/cv/', '/no-such-page']) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const running = await page.evaluate(() => document.getAnimations().length);
    if (running > 0) failures.push(`reduced motion ${route}: ${running} animation(s) still running`);
  }
  await rm.close();

  // Theme switch with storage blocked (private modes, strict settings): the choice
  // still applies, survives an in-site page change, and drives the browser chrome.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('blocked', 'SecurityError');
        },
      });
    });
    const p = await ctx.newPage();
    const tag = 'theme switch, storage blocked';
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.locator('.site-footer label:has(input[value="night"])').click();
    const state = () =>
      p.evaluate(() => ({
        theme: document.documentElement.dataset.theme,
        chrome: document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
        checked: document.querySelector('.site-footer input[data-theme-set]:checked')?.value,
      }));
    const after = await state();
    if (after.theme !== 'night' || after.checked !== 'night') failures.push(`${tag}: Night didn't apply (${JSON.stringify(after)})`);
    if (after.chrome?.toUpperCase() !== '#131412') failures.push(`${tag}: theme-color is ${after.chrome}`);
    await p.locator('.inline-nav a[href="/cv/"]').click();
    await p.waitForURL('**/cv/');
    await p.waitForTimeout(300);
    if ((await state()).theme !== 'night') failures.push(`${tag}: choice lost on an in-site page change`);
    await p.addScriptTag({ content: axeSource });
    const res = await p.evaluate(() => window.axe.run(document.querySelector('.site-footer'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } }));
    for (const v of res.violations) failures.push(`${tag}: axe ${v.id} ${v.help}`);
    await ctx.close();
  }

  // Print: case studies fit on three A4 pages, printed from Night (paper colours).
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(() => localStorage.setItem('theme', 'night'));
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    for (const route of ['/work/jayne-bandy-ai/', '/work/sap-automation/', '/work/ziaris/']) {
      await p.goto(BASE + route, { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      await p.emulateMedia({ media: 'print' });
      await p.waitForTimeout(500); // the on-screen theme cross-fade (0.3 s)
      const ink = await p.evaluate(() => getComputedStyle(document.body).color);
      if (ink !== 'rgb(20, 20, 19)') failures.push(`print ${route}: text prints as ${ink}, not paper ink`);
      const pdf = await p.pdf({ format: 'A4', preferCSSPageSize: true });
      const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
      if (pages > 3) failures.push(`print ${route}: ${pages} A4 pages (budget 3)`);
      if (outDir) writeFileSync(join(outDir, `print-${route.split('/')[2]}.pdf`), pdf);
      await p.emulateMedia({ media: 'screen' });
    }
    await ctx.close();
  }

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
