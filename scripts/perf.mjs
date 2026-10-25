// Measures layout shift (CLS) and Largest Contentful Paint (LCP) on a throttled
// phone, cold cache, against the built static pages (scripts/serve-static.mjs).
// Run `npm run build` first. Fails if any run reaches the CLS budget
// (docs/REDESIGN_PLAN.md §8).
//   npm run perf              5 runs on each route
//   npm run perf -- --runs 1  fewer runs while iterating
import { chromium } from 'playwright';
import { serveStatic } from './serve-static.mjs';

const PORT = 4337;
const ROUTES = ['/', '/work/jayne-bandy-ai/', '/cv/'];
const CLS_BUDGET = 0.02;
const runsArg = process.argv.indexOf('--runs');
const RUNS = runsArg > 0 ? Number(process.argv[runsArg + 1]) : 5;

// A mid-range phone on a slow mobile connection.
const NETWORK = { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 };
const CPU_SLOWDOWN = 4;

// Records every layout shift (minus those right after input) and the last LCP candidate.
const OBSERVE = () => {
  window.__perf = { cls: 0, shifts: [], lcp: 0, lcpEl: '' };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__perf.cls += e.value;
      window.__perf.shifts.push({
        value: e.value,
        at: Math.round(e.startTime),
        nodes: e.sources.map((s) => s.node?.nodeName?.toLowerCase() + (s.node?.className ? `.${String(s.node.className).split(' ')[0]}` : '')),
      });
    }
  }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((list) => {
    const last = list.getEntries().at(-1);
    window.__perf.lcp = Math.round(last.startTime);
    const el = last.element;
    window.__perf.lcpEl = el ? el.nodeName.toLowerCase() + (el.className ? `.${String(el.className).split(' ')[0]}` : '') : '';
  }).observe({ type: 'largest-contentful-paint', buffered: true });
};

const { base, close } = await serveStatic(PORT);
const browser = await chromium.launch();
const failures = [];

try {
  for (const route of ROUTES) {
    const results = [];
    for (let i = 0; i < RUNS; i++) {
      // A fresh context per run is a cold cache.
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      });
      await context.addInitScript(OBSERVE);
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', NETWORK);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });
      await page.goto(base + route, { waitUntil: 'load', timeout: 60_000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2500); // the load sequence, and any late font swap
      results.push(await page.evaluate(() => window.__perf));
      await context.close();
    }
    for (const [i, r] of results.entries()) {
      const shifts = r.shifts.map((s) => `${s.value.toFixed(3)}@${s.at}ms ${s.nodes.join(' ')}`).join('; ');
      console.log(`${route} run ${i + 1}: CLS ${r.cls.toFixed(3)}  LCP ${r.lcp} ms (${r.lcpEl})${shifts ? `  shifts: ${shifts}` : ''}`);
      if (r.cls >= CLS_BUDGET) failures.push(`${route} run ${i + 1}: CLS ${r.cls.toFixed(3)} (budget < ${CLS_BUDGET})`);
    }
    const lcps = results.map((r) => r.lcp).sort((a, b) => a - b);
    console.log(`${route}: worst CLS ${Math.max(...results.map((r) => r.cls)).toFixed(3)}, median LCP ${lcps[Math.floor(lcps.length / 2)]} ms\n`);
  }
} finally {
  await browser.close();
  await close();
}

if (failures.length) {
  console.error(`perf found ${failures.length} problem(s):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`perf ok: ${ROUTES.length} routes × ${RUNS} runs, CLS < ${CLS_BUDGET} on every run`);
