// usage: node render.mjs <outdir> <frames: "a-b" or "1,2,3"> [step] [quality]
// ANGLE=d3d11 (default, real GPU) or ANGLE=swiftshader (software fallback).
import { chromium } from 'playwright-core'; import http from 'http'; import fs from 'fs'; import path from 'path';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [,, outdir, spec, step = '1', qual = '0.96'] = process.argv;
fs.mkdirSync(outdir, { recursive: true });
let frames = [];
for (const part of spec.split(',')) { if (part.includes('-')) { const [a, b] = part.split('-').map(Number); for (let f = a; f <= b; f += +step) frames.push(f); } else frames.push(+part); }
const root = process.env.WEB || path.resolve('web');
const srv = http.createServer((q, s) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p)) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': p.endsWith('.js') ? 'text/javascript' : 'text/html' }); fs.createReadStream(p).pipe(s); }).listen(0);
await new Promise(r => srv.on('listening', r));

const GPU_ARGS = ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--disable-gpu-driver-bug-workarounds'];
const SW_ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const args = process.env.ANGLE === 'swiftshader' ? SW_ARGS : GPU_ARGS;
const b = await chromium.launch({ executablePath: CHROME, args });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on('console', m => { const t = m.text(); if (!t.includes('404')) console.log('PAGE', t); });
pg.on('pageerror', e => console.log('ERR', e.message));

const ready = () => pg.waitForFunction(() => window.ready || window.err, null, { timeout: 180000 });
const url = `http://localhost:${srv.address().port}/index.html${process.env.HASH || ''}`;
await pg.goto(url); await ready();
if (await pg.evaluate(() => window.err)) { console.log('page error'); process.exit(1); }

const good = (d) => d.length > 60000;   // blank/black frames encode to ~17k base64 chars
let reloads = 0;
const t0 = Date.now(); let done = 0;
for (const f of frames) {
  const file = path.join(outdir, `f${String(f).padStart(4, '0')}.jpg`);
  if (process.env.RESUME && fs.existsSync(file) && fs.statSync(file).size >= 40000) continue;
  let d = '';
  for (let attempt = 0; attempt < 4; attempt++) {
    d = await pg.evaluate(([f, q]) => { window.renderFrame(f); return document.getElementById('c').toDataURL('image/jpeg', q); }, [f, +qual]);
    if (good(d)) break;
    reloads++;
    console.log('blank frame %d, reloading page (%d)', f, reloads);
    await pg.reload(); await ready();
  }
  if (!good(d)) { console.log('frame %d failed after retries', f); continue; }
  fs.writeFileSync(file, Buffer.from(d.split(',')[1], 'base64'));
  done++;
}
const dt = (Date.now() - t0) / 1000;
console.log(`done ${done} frames, ${(dt / Math.max(done, 1)).toFixed(2)} s/frame, ${reloads} reloads`);
await b.close(); srv.close();
