// Renders every original page and asserts the SVG is well-formed enough to
// serve. Run with: npm run check:art
//
// It is not a full XML parser. It checks the things this renderer has actually
// got wrong before: unbalanced tags, unresolved references, NaN in coordinates,
// and text that escaped without being escaped.

import { ORIGINALS } from '../lib/studio/library';
import { renderPage, type PageSpec } from '../lib/studio/paint';

type Problem = { where: string; what: string };

const problems: Problem[] = [];

function check(where: string, svg: string) {
  const fail = (what: string) => problems.push({ where, what });

  if (!svg.startsWith('<svg ') || !svg.endsWith('</svg>')) fail('not an svg element');
  if (/NaN|Infinity|undefined|null/.test(svg)) fail('numeric or binding hole in output');

  // Every id referenced by url(#x) must be defined somewhere in the document.
  const defined = new Set([...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of svg.matchAll(/url\(#([^)]+)\)/g)) {
    if (!defined.has(m[1])) fail(`dangling reference to #${m[1]}`);
  }
  if (/url\(#[^)]*\)\)/.test(svg)) fail('doubled parenthesis in a url() reference');

  // Tag balance, ignoring self-closing tags.
  const opens = [...svg.matchAll(/<([a-zA-Z]+)(?:\s[^>]*?)?(\/?)>/g)];
  const closes = [...svg.matchAll(/<\/([a-zA-Z]+)>/g)];
  const tally = new Map<string, number>();
  for (const [, tag, selfClose] of opens) {
    if (selfClose === '/') continue;
    tally.set(tag, (tally.get(tag) ?? 0) + 1);
  }
  for (const [, tag] of closes) tally.set(tag, (tally.get(tag) ?? 0) - 1);
  for (const [tag, n] of tally) if (n !== 0) fail(`${tag} tags off by ${n}`);

  // Raw ampersands would break the parse; the escaper should have caught them.
  const textBodies = [...svg.matchAll(/>([^<>]*)</g)].map((m) => m[1]);
  for (const body of textBodies) {
    if (/&(?!(amp|lt|gt|quot|apos|#\d+);)/.test(body)) fail('unescaped ampersand in text');
  }

  if (svg.length < 400) fail(`suspiciously small (${svg.length} bytes)`);
}

let pages = 0;
let bytes = 0;

for (const original of ORIGINALS) {
  const render = (label: string, spec: PageSpec) => {
    const svg = renderPage(spec);
    pages++;
    bytes += svg.length;
    check(label, svg);
    // Determinism: the same spec must produce the same bytes.
    if (renderPage(spec) !== svg) problems.push({ where: label, what: 'render is not deterministic' });
  };

  render(`${original.slug}/cover`, original.cover);
  for (const chapter of original.chapters) {
    chapter.pages.forEach((spec, i) => render(`${original.slug}/${chapter.id}/${i + 1}`, spec));
  }
}

const titles = ORIGINALS.map((o) => `${o.slug} (${o.chapters.length} ch)`).join(', ');
console.log(`Originals: ${titles}`);
console.log(`Rendered ${pages} pages, ${(bytes / 1024).toFixed(0)} KB total, ${(bytes / pages / 1024).toFixed(1)} KB average.`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems.slice(0, 40)) console.error(`  ${p.where}: ${p.what}`);
  process.exit(1);
}
console.log('All pages structurally clean.');
