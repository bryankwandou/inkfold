// Writes every original page to disk so they can be eyeballed in a browser.
// Throwaway tooling: output lands in .render-check/pages/.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ORIGINALS } from '../lib/studio/library';
import { renderPage } from '../lib/studio/paint';

const only = process.argv[2];
const dir = join(__dirname, '..', 'pages');
mkdirSync(dir, { recursive: true });
let n = 0;
for (const o of ORIGINALS) {
  if (only && o.slug !== only) continue;
  writeFileSync(join(dir, `${o.slug}-cover.svg`), renderPage(o.cover));
  n++;
  for (const c of o.chapters) {
    c.pages.forEach((spec, i) => {
      writeFileSync(join(dir, `${o.slug}-${c.id}-${i + 1}.svg`), renderPage(spec));
      n++;
    });
  }
}
console.log(`Wrote ${n} pages to ${dir}`);
