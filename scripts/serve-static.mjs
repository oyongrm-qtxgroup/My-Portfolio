// Serves the built static pages (.vercel/output/static) the way Vercel does:
// /path/ → /path/index.html, unknown paths → 404.html. Used by verify and cv:pdf,
// because `astro preview` can't serve a build that contains a Vercel function.
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { brotliCompressSync } from 'node:zlib';

const ROOT = new URL('../.vercel/output/static/', import.meta.url).pathname;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
};

/** Starts the server; resolves to { base, close }. */
export async function serveStatic(port) {
  if (!existsSync(join(ROOT, 'index.html'))) throw new Error('No build found: run `npm run build` first.');
  const base = `http://localhost:${port}`;
  const server = createServer((req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, base).pathname)).replace(/^(\.\.[/\\])+/, '');
    const file = [join(ROOT, path), join(ROOT, path, 'index.html'), join(ROOT, `${path}.html`)].find(
      (f) => f.startsWith(ROOT) && existsSync(f) && statSync(f).isFile(),
    );
    const served = file ?? join(ROOT, '404.html');
    const type = TYPES[extname(served)] ?? 'application/octet-stream';
    const headers = { 'content-type': type };
    // Like Vercel: hashed assets cache for a year, text is brotli-compressed.
    if (path.startsWith('/_astro/')) headers['cache-control'] = 'public, max-age=31536000, immutable';
    let body = readFileSync(served);
    if (/text|javascript|xml|svg/.test(type) && /\bbr\b/.test(req.headers['accept-encoding'] ?? '')) {
      body = brotliCompressSync(body);
      headers['content-encoding'] = 'br';
    }
    res.writeHead(file ? 200 : 404, headers);
    res.end(body);
  });
  await new Promise((resolve) => server.listen(port, resolve));
  return { base, close: () => new Promise((resolve) => server.close(resolve)) };
}
