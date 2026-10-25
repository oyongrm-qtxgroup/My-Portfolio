// Renders /cv/ from the build to public/raymundo-oyong-cv.pdf (A4, selectable
// text, fonts embedded) and checks it against the Harvard rules in
// docs/REDESIGN_PLAN.md §7. Run `npm run build` first, then rebuild after this
// so the new PDF ships.
//   npm run cv:pdf             write the PDF and its content hash
//   npm run cv:pdf -- --check  fail if the PDF is stale or a rule is broken (CI)
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { serveStatic } from './serve-static.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const PDF = join(ROOT, 'public/raymundo-oyong-cv.pdf');
const HASH = join(ROOT, 'public/raymundo-oyong-cv.sha256');
const check = process.argv.includes('--check');

// Harvard: bullets start with a strong action verb (past tense; present for current work).
const VERBS = new Set(
  `Added Administered Automated Built Building Cleared Coded Configured Created Cut Delivered Designed
  Developed Drafted Eliminated Enabled Established Hardened Implemented Improved Integrated Introduced
  Launched Lead Leads Led Maintained Mentored Migrated Modernised Moved Optimised Owned Partitioned Rebuilt
  Reduced Replaced Resolved Restricted Shipped Specified Streamlined Tuned Wrote`.split(/\s+/),
);

const failures = [];
const { base, close } = await serveStatic(4335);
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  await page.goto(`${base}/cv/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });

  const facts = await page.evaluate(() => ({
    text: document.querySelector('.cv')?.innerText ?? '',
    // A project's first bullet opens with its name in bold; the verb rule applies to what follows.
    bullets: [...document.querySelectorAll('[data-cv-bullet]')].map((li) =>
      (li.querySelector('[data-cv-text]') ?? li).textContent.trim(),
    ),
    // Per role: its header line and the start of its first bullet, to check reading order.
    roles: [...document.querySelectorAll('.cv-role')]
      .filter((el) => el.querySelector('[data-cv-text]'))
      .map((el) => ({
        header: el.querySelector('.cv-line')?.textContent.replace(/\s+/g, ' ').trim() ?? '',
        first: el.querySelector('[data-cv-text]')?.textContent.replace(/\s+/g, ' ').trim() ?? '',
      })),
    compounds: [...new Set(document.querySelector('.cv')?.innerText.match(/[A-Za-z]+-[A-Za-z]+/g) ?? [])],
    name: document.querySelector('.cv-name')?.textContent?.trim() ?? '',
    email: document.querySelector('.cv-contact a[href^="mailto:"]')?.textContent?.trim() ?? '',
  }));

  // Rules on the text itself.
  const pronoun = facts.text.match(/\b(I|my|me|mine|myself)\b/);
  if (pronoun) failures.push(`personal pronoun "${pronoun[0]}" in the CV`);
  if (/\+?\d[\d ()-]{8,}\d/.test(facts.text.replace(/\b(19|20)\d{2}\b/g, '')))
    failures.push('something that looks like a phone number is in the CV');
  if (!facts.email) failures.push('no email address in the CV header');
  for (const b of facts.bullets) {
    const verb = b.split(/\s+/)[0];
    if (!VERBS.has(verb)) failures.push(`bullet does not start with an action verb: "${b.slice(0, 60)}…"`);
  }

  const hash = createHash('sha256').update(facts.text.replace(/\s+/g, ' ').trim()).digest('hex');
  const footer = `<div style="width:100%;margin:0 15mm;display:flex;justify-content:space-between;font:7.5pt Georgia,serif;color:#56564f">
    <span>${facts.name} · ${facts.email}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`;
  const out = check ? join(mkdtempSync(join(tmpdir(), 'cv-')), 'cv.pdf') : PDF;
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: footer,
    tagged: true,
    outline: false,
  });

  const pdf = readFileSync(out, 'latin1');

  // What an applicant tracking system reads: the PDF's extracted text, in order.
  let extracted = '';
  try {
    extracted = execFileSync('pdftotext', [out, '-'], { encoding: 'utf8' }).replace(/\s+/g, ' ');
  } catch {
    failures.push('pdftotext is not installed (poppler-utils); it is needed to check the text an ATS reads');
  }
  if (extracted) {
    for (const word of ['Senior', 'LLM', 'RAG', 'RPA', 'retrieval-augmented'])
      if (!extracted.includes(word)) failures.push(`keyword "${word}" is missing from the extracted text`);
    // Each role's title and dates come before its bullets, never after them.
    for (const r of facts.roles) {
      const at = extracted.indexOf(r.header);
      const first = extracted.indexOf(r.first.split(' ').slice(0, 6).join(' '));
      if (at < 0) failures.push(`role header "${r.header}" is not one line in the extracted text`);
      else if (first < 0 || first < at) failures.push(`"${r.header}" is read after its first bullet`);
    }
    // A compound broken at a line end loses its hyphen in extraction ("retrievalaugmented").
    for (const c of facts.compounds) {
      const fused = c.replace('-', '');
      if (!extracted.includes(c) && extracted.includes(fused)) failures.push(`"${c}" is split at a line end`);
    }
  }
  const pages = (pdf.match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
  if (pages !== 2) failures.push(`the PDF has ${pages} page(s); it must be exactly 2`);
  // Every link must work from a forwarded PDF: email or an absolute https URL,
  // never the local build server or a relative path. With --check, the committed
  // PDF is checked too: its links aren't covered by the text hash.
  const pdfs = [['the PDF', pdf]];
  if (check && existsSync(PDF)) pdfs.push(['the committed PDF', readFileSync(PDF, 'latin1')]);
  for (const [label, body] of pdfs) {
    const links = [...body.matchAll(/\/URI\s*\(([^)]*)\)/g)].map((m) => m[1]);
    if (!links.length) failures.push(`${label} has no links`);
    for (const url of links) {
      if (!/^(mailto:|https:\/\/)/.test(url) || /localhost|127\.0\.0\.1/.test(url))
        failures.push(`${label} links to "${url}"; links must be mailto: or public https:// URLs`);
    }
  }
  // Chromium embeds the variable fonts as Type 3; what matters is that every font
  // maps back to Unicode, so the text can be selected, copied and parsed.
  // Count top-level fonts only: a CID font's descendant carries no map of its own.
  const fonts = (pdf.match(/\/Subtype\s*\/(Type0|Type1|Type3|TrueType|MMType1)\b/g) ?? []).length;
  const mapped = (pdf.match(/\/ToUnicode/g) ?? []).length;
  if (!fonts || mapped < fonts) failures.push(`only ${mapped} of ${fonts} fonts map to Unicode; text may not copy out`);

  if (check) {
    const recorded = existsSync(HASH) ? readFileSync(HASH, 'utf8').trim() : '';
    if (recorded !== hash) failures.push('the PDF is out of date: run `npm run build && npm run cv:pdf && npm run build`');
    if (!existsSync(PDF)) failures.push('public/raymundo-oyong-cv.pdf is missing');
  } else {
    writeFileSync(HASH, `${hash}\n`);
  }

  if (failures.length) {
    console.error(`cv:pdf found ${failures.length} problem(s):\n${failures.join('\n')}`);
    process.exitCode = 1;
  } else {
    console.log(`cv:pdf ok: ${pages} pages, ${facts.bullets.length} bullets${check ? ', PDF up to date' : `, written to public/`}`);
  }
} finally {
  await browser.close();
  await close();
}
