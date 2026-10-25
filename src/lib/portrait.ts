// Every published size of the portrait, derived at build time from the approved
// masters in src/assets/portrait/ (880 × 1100, transparent, toned per theme; the
// paper master carries the ink contour). Served by src/pages/portrait/[file].ts.
// Never used on the CV PDF (docs/REDESIGN_PLAN.md §7).

export type Tone = 'paper' | 'night';
export type Crop = 'full' | 'face';
export type Format = 'avif' | 'webp';

export const ALT = 'Raymundo Oyong';
export const TONES: Tone[] = ['paper', 'night'];
export const FORMATS: Format[] = ['avif', 'webp'];

// 'full' is the whole 4:5 master; 'face' the approved square box x 140–740, y 80–680.
export const CROPS: Record<Crop, { left: number; top: number; width: number; height: number; widths: number[] }> = {
  full: { left: 0, top: 0, width: 880, height: 1100, widths: [220, 330, 440] },
  face: { left: 140, top: 80, width: 600, height: 600, widths: [88, 120, 176, 240, 264] },
};

export const file = (tone: Tone, crop: Crop, width: number, format: Format) =>
  `raymundo-oyong-${tone}-${crop}-${width}.${format}`;

export const src = (tone: Tone, crop: Crop, width: number, format: Format) => `/portrait/${file(tone, crop, width, format)}`;

export const srcset = (tone: Tone, crop: Crop, format: Format) =>
  CROPS[crop].widths.map((w) => `${src(tone, crop, w, format)} ${w}w`).join(', ');

export const height = (crop: Crop, width: number) => Math.round((width * CROPS[crop].height) / CROPS[crop].width);

// A fixed address for structured data (Person.image) and other sites: square, on paper.
export const STABLE = '/portrait/raymundo-oyong.jpg';
