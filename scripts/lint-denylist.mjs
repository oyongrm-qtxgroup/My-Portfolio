// Confidentiality guard: fails if any client or people name appears in the site.
// The names live outside the public repo, in the DENYLIST environment variable
// (a CI secret), one name per line or comma-separated. Locally it skips when the
// variable is empty; in CI it fails, because an unset secret would check nothing.
// It scans the sources and the built site (which carries GitHub data).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const names = (process.env.DENYLIST ?? '')
  .split(/[\n,]/)
  .map((s) => s.trim())
  .filter(Boolean);

if (names.length === 0) {
  if (process.env.CI) {
    console.error('lint:denylist: DENYLIST is not set; add it as an Actions secret (docs/DESIGN_PLAN.md §6)');
    process.exit(1);
  }
  console.log('lint:denylist skipped (DENYLIST is not set)');
  process.exit(0);
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = new RegExp(`\\b(${names.map(escape).join('|')})\\b`, 'i');
const TEXT = /\.(astro|css|ts|js|mjs|md|mdx|ya?ml|json|html|txt|svg|xml)$/;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (TEXT.test(name)) yield path;
  }
}

const hits = [];
for (const dir of ['src', 'public', 'docs', 'dist', '.vercel/output/static']) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) continue;
  for (const file of walk(abs)) {
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (pattern.test(line)) hits.push(`${relative(ROOT, file)}:${i + 1}`);
      });
  }
}

if (hits.length) {
  // Print locations only, never the matched names.
  console.error(`lint:denylist found ${hits.length} confidential name(s) at:\n${hits.join('\n')}`);
  process.exit(1);
}
console.log(`lint:denylist ok (${names.length} names checked)`);
