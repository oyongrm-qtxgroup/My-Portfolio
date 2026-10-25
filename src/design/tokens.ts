// Single source of truth for colour tokens. Base.astro renders these as CSS
// custom properties; the /system page computes contrast from the same values.

export const palettes = {
  paper: {
    paper: '#F6F6F3',
    ink: '#141413',
    ink2: '#56564F',
    rule: '#D8D8D2',
    accent: '#1D3FD8',
    margin: '#C8322A',
  },
  night: {
    paper: '#131412',
    ink: '#ECEBE6',
    ink2: '#A9A8A1',
    rule: '#2E2F2B',
    accent: '#93A8FF',
    margin: '#E0604F',
  },
} as const;

export type Mode = keyof typeof palettes;
export type Token = keyof (typeof palettes)['paper'];

const cssName: Record<Token, string> = {
  paper: '--paper',
  ink: '--ink',
  ink2: '--ink-2',
  rule: '--rule',
  accent: '--accent',
  margin: '--margin',
};

function declarations(mode: Mode): string {
  const p = palettes[mode];
  const vars = (Object.keys(p) as Token[]).map((t) => `${cssName[t]}:${p[t]}`).join(';');
  return `${vars};color-scheme:${mode === 'night' ? 'dark' : 'light'}`;
}

// No-JS visitors get the OS preference; with JS the bootstrap script sets data-theme.
// Print is always paper, whichever theme is on screen.
const colourCss = [
  `:root,:root[data-theme="paper"]{${declarations('paper')}}`,
  `:root[data-theme="night"]{${declarations('night')}}`,
  `@media (prefers-color-scheme:dark){:root:not([data-theme]){${declarations('night')}}}`,
  `@media print{:root,:root[data-theme],:root:not([data-theme]){${declarations('paper')}}}`,
].join('\n');

// ── Scales (DESIGN_PLAN Step 7: new components use these from day one; the old
// literals are snapped to them in Step 18). Rendered as custom properties below.

/** Spacing steps in px: --space-1 … --space-10. */
export const space = [4, 8, 12, 16, 20, 24, 32, 40, 56, 72] as const;

/** Rule (line) widths: hairline dividers, figure strokes, ruled rows, emphasis. */
export const rules = { hair: '1px', fine: '1.5px', firm: '2px', heavy: '3px' } as const;

/** Type sizes: mono labels, body text, titles; display sizes are fluid. */
export const type = {
  'mono-s': '12px',
  mono: '13px',
  'body-s': '17px',
  body: '18px',
  'body-l': '20px',
  'title-s': '24px',
  title: '34px',
  'display-s': 'clamp(36px, 5vw, 56px)',
  display: 'clamp(44px, 7.4vw, 92px)',
  'display-l': 'clamp(56px, 10vw, 132px)',
} as const;

/** Motion: durations and the one easing curve. */
export const motion = { fast: '0.2s', base: '0.45s', slow: '0.7s', ease: 'cubic-bezier(0.2, 0.7, 0, 1)' } as const;

export const scalesCss = `:root{${[
  ...space.map((v, i) => `--space-${i + 1}:${v}px`),
  ...Object.entries(rules).map(([k, v]) => `--rule-${k}:${v}`),
  ...Object.entries(type).map(([k, v]) => `--type-${k}:${v}`),
  ...Object.entries(motion).map(([k, v]) => `--motion-${k}:${v}`),
].join(';')}}`;

/** Everything Base.astro renders into the page head: colours, then the scales. */
export const tokensCss = `${colourCss}\n${scalesCss}`;

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function wcagLevel(ratio: number): 'AAA' | 'AA' | 'fail' {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'fail';
}
