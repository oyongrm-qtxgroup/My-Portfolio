// Fails the build if the site drifts back toward the generic "AI template" look.
// Rules: docs/REDESIGN_PLAN.md §8 and the "Never" list in docs/design/System.dc.html.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SCAN = ['src'];
const EXTS = new Set(['.astro', '.css', '.ts', '.md', '.mdx', '.yaml', '.yml', '.json']);

const cssRules = [
  [/linear-gradient\(/i, 'gradient'],
  [/radial-gradient\(/i, 'gradient'],
  [/conic-gradient\(/i, 'gradient'],
  [/box-shadow\s*:(?!\s*none)/i, 'drop shadow'],
  [/text-shadow\s*:(?!\s*none)/i, 'text shadow'],
  [/backdrop-filter\s*:/i, 'glass blur'],
  [/filter\s*:\s*blur\(/i, 'blur'],
];

const wordRules = [
  /\bpassionate\b/i,
  /\bcutting[- ]edge\b/i,
  /\bleverag(e|es|ed|ing)\b/i,
  /\bseamless(ly)?\b/i,
  /\bsynerg(y|ies)\b/i,
  /\brockstar\b/i,
  /\bninja\b/i,
  /\bgame[- ]changer\b/i,
];

const emoji = /\p{Extended_Pictographic}/u;
// No italic is shipped (DESIGN_PLAN call 6): no <em> or *emphasis* in content.
const italic = [/<em\b/i, /(?<![*\w])\*(?![\s*])[^*\n]+?(?<![\s*])\*(?![*\w])/];
const isContent = (file) => /src\/content\/.+\.(mdx?|ya?ml)$/.test(file);
const headingLine = /^\s*(#{1,6}\s|<h[1-6][\s>])/i;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (EXTS.has(extname(name))) yield path;
  }
}

const problems = [];
for (const base of SCAN) {
  for (const file of walk(join(ROOT, base))) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      const where = `${relative(ROOT, file)}:${i + 1}`;
      for (const [re, what] of cssRules) if (re.test(line)) problems.push(`${where}  ${what}`);
      for (const re of wordRules) if (re.test(line)) problems.push(`${where}  banned word "${line.match(re)[0]}"`);
      if (headingLine.test(line) && emoji.test(line)) problems.push(`${where}  emoji in a heading`);
      if (isContent(file) && !line.trimStart().startsWith('#') && italic.some((re) => re.test(line)))
        problems.push(`${where}  italic in content (none is shipped)`);
    });
  }
}

if (problems.length) {
  console.error(`lint:design found ${problems.length} problem(s):\n${problems.join('\n')}`);
  process.exit(1);
}
console.log('lint:design ok');
