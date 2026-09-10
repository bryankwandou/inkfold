// Renders one page per new layer so they can be looked at before a script is
// written against them. Output goes to .render-check/preview.svg — throwaway.
//
// Run with: npx tsc -p scripts/tsconfig.json && node .render-check/scripts/layer-preview.js

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { renderPage, type Layer, type PageSpec } from '../lib/studio/paint';

const stacks: { label: string; layers: Layer[] }[] = [
  { label: 'booth', layers: [{ t: 'booth', y: 0.26 }, { t: 'figure', x: 0.5, scale: 0.8, pose: 'stand' }] },
  { label: 'wave', layers: [{ t: 'wave', y: 0.5, amp: 0.22, n: 70 }] },
  { label: 'wave flat', layers: [{ t: 'wave', y: 0.5, flat: true }] },
  { label: 'reel', layers: [{ t: 'reel', n: 2, y: 0.44 }] },
  { label: 'stage', layers: [{ t: 'stage' }, { t: 'figure', x: 0.5, scale: 0.9, pose: 'stand' }] },
  { label: 'mic', layers: [{ t: 'mic', x: 0.5, y: 0.45, scale: 1 }] },
  { label: 'tower', layers: [{ t: 'city', y: 0.8, density: 1 }, { t: 'tower', x: 0.5, h: 0.7 }] },
  { label: 'mic + booth', layers: [{ t: 'booth', y: 0.22 }, { t: 'mic', x: 0.62, y: 0.6, scale: 0.8 }] },
];

const spec: PageSpec = {
  pal: 'slate',
  seed: 5,
  panels: stacks.map((s, i) => ({
    x: (i % 2) * 0.5,
    y: Math.floor(i / 2) * 0.25,
    w: 0.5,
    h: 0.25,
    layers: s.layers,
    caption: s.label,
    captionAt: 'bottom' as const,
  })),
};

const out = join(__dirname, '..', 'preview.svg');
writeFileSync(out, renderPage(spec));
console.log(`Wrote ${out}`);
