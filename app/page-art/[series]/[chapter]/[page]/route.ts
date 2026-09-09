import { ORIGINALS, getOriginal } from '@/lib/studio/library';
import { renderPage } from '@/lib/studio/paint';

/**
 * Originals are drawn on request rather than stored. The panels are a function
 * of the script plus a fixed seed, so a page is byte-identical every time and
 * the CDN can hold it for a year.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  const out: { series: string; chapter: string; page: string }[] = [];
  for (const o of ORIGINALS) {
    out.push({ series: o.slug, chapter: 'cover', page: '1.svg' });
    for (const c of o.chapters) {
      c.pages.forEach((_, i) => {
        out.push({ series: o.slug, chapter: c.id, page: `${i + 1}.svg` });
      });
    }
  }
  return out;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ series: string; chapter: string; page: string }> },
) {
  const { series, chapter, page } = await params;
  const original = getOriginal(series);
  if (!original) return new Response('Unknown series', { status: 404 });

  const n = Number.parseInt(page.replace(/\.svg$/, ''), 10);
  if (!Number.isFinite(n) || n < 1) {
    return new Response('Bad page', { status: 400 });
  }

  const spec =
    chapter === 'cover'
      ? original.cover
      : original.chapters.find((c) => c.id === chapter)?.pages[n - 1];

  if (!spec) return new Response('No such page', { status: 404 });

  return new Response(renderPage(spec), {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
