// Renders each portrait variant (src/lib/portrait.ts) with sharp. Output carries no
// metadata: sharp drops EXIF, XMP and ICC unless asked to keep them.
import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { CROPS, FORMATS, TONES, file, type Crop, type Format, type Tone } from '../../lib/portrait';
import { palettes } from '../../design/tokens';

// Relative to the project root, where builds run (locally and on Vercel): the endpoint
// itself is bundled elsewhere, so a path relative to this file wouldn't resolve.
const master = (tone: Tone) => `src/assets/portrait/raymundo-oyong-${tone}.png`;

type Variant = { tone: Tone; crop: Crop; width: number; format: Format | 'jpg' };

export const getStaticPaths = (() => {
  const variants: { params: { file: string }; props: Variant }[] = [];
  for (const tone of TONES)
    for (const crop of Object.keys(CROPS) as Crop[])
      for (const width of CROPS[crop].widths)
        for (const format of FORMATS)
          variants.push({ params: { file: file(tone, crop, width, format) }, props: { tone, crop, width, format } });
  variants.push({
    params: { file: 'raymundo-oyong.jpg' },
    props: { tone: 'paper', crop: 'face', width: 600, format: 'jpg' },
  });
  return variants;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { tone, crop, width, format } = props as Variant;
  const { left, top, width: w, height: h } = CROPS[crop];
  let image = sharp(master(tone)).extract({ left, top, width: w, height: h }).resize({ width });
  if (format === 'jpg') image = image.flatten({ background: palettes.paper.paper }).jpeg({ quality: 82, mozjpeg: true });
  else if (format === 'avif') image = image.avif({ quality: 60, effort: 6 });
  else image = image.webp({ quality: 80, alphaQuality: 90 });
  const body = await image.toBuffer();
  const type = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
  return new Response(new Uint8Array(body), { headers: { 'Content-Type': type } });
};
