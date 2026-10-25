// Rasterises public/favicon.svg (Paper colours) to the icons browsers and phones
// ask for: favicon.ico (32 px, PNG inside) and apple-touch-icon.png (180 px, full
// bleed: iOS rounds the corners itself). Run after `python3 scripts/favicon.py`.
//   npm run icons             write them
//   npm run icons -- --check  fail if they don't match favicon.svg (CI)
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const PUBLIC = join(new URL('..', import.meta.url).pathname, 'public');
const svg = readFileSync(join(PUBLIC, 'favicon.svg'), 'utf8');
const check = process.argv.includes('--check');

const png = (source, size) => sharp(Buffer.from(source), { density: (72 * size) / 32 }).resize(size, size).png().toBuffer();

// An .ico holding one PNG: a 6-byte header, one 16-byte directory entry, the image.
function ico(image, size) {
  const head = Buffer.alloc(22);
  head.writeUInt16LE(0, 0); // reserved
  head.writeUInt16LE(1, 2); // type: icon
  head.writeUInt16LE(1, 4); // one image
  head.writeUInt8(size % 256, 6);
  head.writeUInt8(size % 256, 7);
  head.writeUInt16LE(1, 10); // colour planes
  head.writeUInt16LE(32, 12); // bits per pixel
  head.writeUInt32LE(image.length, 14);
  head.writeUInt32LE(22, 18); // offset of the image
  return Buffer.concat([head, image]);
}

const files = {
  'favicon.ico': ico(await png(svg, 32), 32),
  'apple-touch-icon.png': await png(svg.replace(/ rx="3"/, ''), 180),
};

const stale = [];
for (const [name, data] of Object.entries(files)) {
  if (!check) writeFileSync(join(PUBLIC, name), data);
  else {
    let current;
    try {
      current = readFileSync(join(PUBLIC, name));
    } catch {
      current = Buffer.alloc(0);
    }
    if (!current.equals(data)) stale.push(name);
  }
}
if (stale.length) {
  console.error(`icons out of date: ${stale.join(', ')}; run \`npm run icons\``);
  process.exitCode = 1;
} else console.log(`icons ok: ${Object.keys(files).join(', ')}${check ? ', up to date' : ' written'}`);
