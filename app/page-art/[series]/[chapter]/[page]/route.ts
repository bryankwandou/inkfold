import { NINE_TENTHS_CHAPTERS } from '@/content/nine-tenths';
import { renderPage, type PageSpec } from '@/lib/studio/paint';

/**
 * Originals are drawn on request rather than stored. The panels are a function
 * of the script plus a fixed seed, so a page is byte-identical every time and
 * the CDN can hold it for a year.
 */

const COVER: PageSpec = {
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

export const dynamicParams = false;

export function generateStaticParams() {
  const out: { series: string; chapter: string; page: string }[] = [
    { series: 'nine-tenths', chapter: 'cover', page: '1.svg' },
  ];
  for (const c of NINE_TENTHS_CHAPTERS) {
    c.pages.forEach((_, i) => {
      out.push({ series: 'nine-tenths', chapter: c.id, page: `${i + 1}.svg` });
    });
  }
  return out;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ series: string; chapter: string; page: string }> },
) {
  const { series, chapter, page } = await params;
  if (series !== 'nine-tenths') {
    return new Response('Unknown series', { status: 404 });
  }

  const n = Number.parseInt(page.replace(/\.svg$/, ''), 10);
  if (!Number.isFinite(n) || n < 1) {
    return new Response('Bad page', { status: 400 });
  }

  const spec =
    chapter === 'cover'
      ? COVER
      : NINE_TENTHS_CHAPTERS.find((c) => c.id === chapter)?.pages[n - 1];

  if (!spec) return new Response('No such page', { status: 404 });

  return new Response(renderPage(spec), {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
