import Link from 'next/link';
import type { Series } from '@/lib/catalog';
import LicenceBadge from './LicenceBadge';

export default function SeriesCard({
  series,
  delay = 0,
}: {
  series: Series;
  delay?: number;
}) {
  const pages = series.chapters.reduce((n, c) => n + c.pageCount, 0);

  return (
    <Link
      href={`/series/${series.slug}`}
      className="rise group flex gap-5 rounded-2xl border border-ink-800 bg-ink-900/70 p-5 transition-colors hover:border-ink-600"
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      <div className="relative w-[112px] shrink-0 overflow-hidden rounded-lg bg-ink-800 ring-1 ring-ink-700">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={series.cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[25px] leading-tight text-paper-50">
            {series.title}
          </h3>
        </div>
        <p className="mt-1 text-[13px] text-ink-400">
          {series.author} · {series.year} · {series.origin}
        </p>

        <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-ink-300">
          {series.synopsis}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <LicenceBadge licence={series.license} />
          <span className="rounded-md border border-ink-700 px-2 py-1 text-[11px] text-ink-400">
            {series.chapters.length} chapters
          </span>
          <span className="rounded-md border border-ink-700 px-2 py-1 text-[11px] text-ink-400">
            {pages} pages
          </span>
        </div>
      </div>
    </Link>
  );
}
