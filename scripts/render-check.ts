// Renders every original page and asserts the SVG is well-formed enough to
// serve. Run with: npm run check:art
//
// It is not a full XML parser. It checks the things this renderer has actually
// got wrong before: unbalanced tags, unresolved references, NaN in coordinates,
// and text that escaped without being escaped.

import { ORIGINALS } from '../lib/studio/library';
import { PALETTES, renderPage, type PageSpec } from '../lib/studio/paint';

type Problem = { where: string; what: string };

const problems: Problem[] = [];

/**
 * Balloon and caption copy is `ink` set on `paper` and has to stay readable at
 * phone size, so every palette owes a real contrast ratio there.
 *
 * There is no equivalent rule for `far` against `ink`. The obvious one — insist
 * the ground a panel starts on differ in value from what silhouettes are drawn
 * in — flags void, deep and frost, which are meant to be near-black throughout
 * and read fine because those panels carry their own light: stars, a lit disc, a
 * console. Value separation is what the daylight pages needed, not what every
 * page needs, and a check that fires on working art would just get muted.
 */
function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

for (const [name, pal] of Object.entries(PALETTES)) {
  const [hi, lo] = [luminance(pal.paper), luminance(pal.ink)].sort((a, b) => b - a);
  const ratio = (hi + 0.05) / (lo + 0.05);
  if (ratio < 12) {
    problems.push({
      where: `palette ${name}`,
      what: `balloon copy contrast is ${ratio.toFixed(1)}:1`,
    });
  }
}

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

/**
 * Page coverage. The grid helper in the scripts lays bodies into rows of
 * columns and quietly skips a slot it has no body for, so a page that supplies
 * three panels to a four-slot template loses the fourth silently — and what the
 * reader gets is a dead rectangle of page background. Nothing about that is
 * malformed, which is why it survived every other check here and had to be
 * caught by looking at the art.
 */
function checkCoverage(where: string, spec: PageSpec) {
  const area = spec.panels.reduce((sum, p) => sum + p.w * p.h, 0);
  if (area < 0.97) {
    problems.push({
      where,
      what: `panels cover ${(area * 100).toFixed(1)}% of the page — a slot is empty`,
    });
  }
}

let pages = 0;
let bytes = 0;

for (const original of ORIGINALS) {
  const render = (label: string, spec: PageSpec) => {
    const svg = renderPage(spec);
    pages++;
    bytes += svg.length;
    check(label, svg);
    checkCoverage(label, spec);
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
