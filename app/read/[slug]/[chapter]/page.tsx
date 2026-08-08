import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSeries } from '@/lib/catalog';
import Reader from '@/components/Reader';

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}): Promise<Metadata> {
  const { slug, chapter } = await params;
  const series = await getSeries(slug);
  const ch = series?.chapters.find((c) => c.id === chapter);
  if (!series || !ch) return { title: 'Not found' };
  return {
    title: `${ch.title} — ${series.title}`,
    description: `Chapter ${ch.number} of ${series.title} by ${series.author}, ${ch.pageCount} pages, read without ads or trackers.`,
  };
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter } = await params;
  const series = await getSeries(slug);
  if (!series) notFound();

  const i = series.chapters.findIndex((c) => c.id === chapter);
  if (i === -1) notFound();
  const ch = series.chapters[i];

  return (
    <Reader
      seriesSlug={series.slug}
      seriesTitle={series.title}
      chapterId={ch.id}
      chapterTitle={ch.title}
      chapterNumber={ch.number}
      pages={ch.pages}
      prevId={i > 0 ? series.chapters[i - 1].id : null}
      nextId={i < series.chapters.length - 1 ? series.chapters[i + 1].id : null}
    />
  );
}
