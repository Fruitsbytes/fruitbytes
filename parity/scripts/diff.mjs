#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const STENCIL_DIR = path.resolve('baselines/stencil');
const ASTRO_DIR = path.resolve('baselines/astro');
const DIFF_DIR = path.resolve('reports/diff');
const SUMMARY_PATH = path.resolve('reports/summary.json');

if (!fs.existsSync(STENCIL_DIR)) {
  console.error(`Missing ${STENCIL_DIR}. Run \`npm run capture:stencil\` first.`);
  process.exit(1);
}
if (!fs.existsSync(ASTRO_DIR)) {
  console.error(`Missing ${ASTRO_DIR}. Run \`npm run capture:astro\` first.`);
  process.exit(1);
}

fs.mkdirSync(DIFF_DIR, { recursive: true });

const files = fs.readdirSync(STENCIL_DIR).filter((f) => f.endsWith('.png'));
const summary = [];

for (const file of files) {
  const stencilPath = path.join(STENCIL_DIR, file);
  const astroPath = path.join(ASTRO_DIR, file);

  if (!fs.existsSync(astroPath)) {
    summary.push({ file, status: 'missing-astro' });
    continue;
  }

  const a = PNG.sync.read(fs.readFileSync(stencilPath));
  const b = PNG.sync.read(fs.readFileSync(astroPath));

  if (a.width !== b.width || a.height !== b.height) {
    summary.push({
      file,
      status: 'size-mismatch',
      stencil: { width: a.width, height: a.height },
      astro: { width: b.width, height: b.height },
    });
    continue;
  }

  const { width, height } = a;
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(a.data, b.data, diff.data, width, height, {
    threshold: 0.1,
  });
  const totalPixels = width * height;
  const ratio = mismatched / totalPixels;

  fs.writeFileSync(path.join(DIFF_DIR, file), PNG.sync.write(diff));

  summary.push({
    file,
    status: ratio === 0 ? 'identical' : ratio < 0.01 ? 'near-match' : 'differs',
    mismatched,
    totalPixels,
    ratio,
  });
}

fs.writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2));

console.log('\nParity diff summary:');
for (const row of summary) {
  const pct = row.ratio !== undefined ? `${(row.ratio * 100).toFixed(2)}%` : '';
  console.log(`  ${row.file.padEnd(30)} ${row.status.padEnd(15)} ${pct}`);
}
console.log(`\nFull report: ${SUMMARY_PATH}`);
console.log(`Diff images: ${DIFF_DIR}`);
