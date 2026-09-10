// The originals shelf. One entry per title we wrote and drew ourselves.
//
// Everything downstream — the art route, the catalog, the page counts on the
// library cards — reads from here, so adding a title is one import and one row.

import { NINE_TENTHS_CHAPTERS, type OriginalChapter } from '../../content/nine-tenths';
import { PAPER_STREETS_CHAPTERS, PAPER_STREETS_COVER } from '../../content/paper-streets';
import { SECOND_VOICE_CHAPTERS, SECOND_VOICE_COVER } from '../../content/second-voice';
import type { PageSpec } from './paint';

const NINE_TENTHS_COVER: PageSpec = {
  pal: 'void',
  seed: 900,
  panels: [
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      layers: [
        { t: 'stars', n: 220, seed: 61 },
        { t: 'disc', cx: 0.74, cy: 0.22, r: 0.17, fill: 'far' },
        { t: 'wreck', seed: 77 },
        { t: 'beam', x: 0.38, w: 0.22 },
        { t: 'hull', y: 0.72 },
        { t: 'figure', x: 0.38, scale: 1.5, pose: 'stand', fill: 'ink' },
        { t: 'dust', n: 70, seed: 9 },
      ],
      caption: 'NINE TENTHS — a salvage story',
      captionAt: 'bottom',
    },
  ],
};

export type Original = {
  slug: string;
  cover: PageSpec;
  chapters: OriginalChapter[];
};

export const ORIGINALS: Original[] = [
  { slug: 'nine-tenths', cover: NINE_TENTHS_COVER, chapters: NINE_TENTHS_CHAPTERS },
  { slug: 'paper-streets', cover: PAPER_STREETS_COVER, chapters: PAPER_STREETS_CHAPTERS },
  { slug: 'second-voice', cover: SECOND_VOICE_COVER, chapters: SECOND_VOICE_CHAPTERS },
];

export function getOriginal(slug: string): Original | undefined {
  return ORIGINALS.find((o) => o.slug === slug);
}
