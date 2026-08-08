import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCatalog, getSeries } from '@/lib/catalog';
import LicenceBadge from '@/components/LicenceBadge';

export const revalidate = 86400;

export async function generateStaticParams() {
  const catalog = await getCatalog();
  return catalog.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeries(slug);
  if (!series) return { title: 'Not found' };
  return { title: series.title, description: series.synopsis.slice(0, 155) };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const series = await getSeries(slug);
  if (!series) notFound();

  const pages = series.chapters.reduce((n, c) => n + c.pageCount, 0);
  const first = series.chapters[0];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <nav className="mb-10 text-[13px] text-ink-400">
        <Link href="/library" className="hover:text-paper-100">
          Library
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-300">{series.title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
        <div>
          <div className="overflow-hidden rounded-xl bg-ink-800 ring-1 ring-ink-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={series.cover}
              alt={`Cover of ${series.title}`}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>

          {first && (
            <Link
              href={`/read/${series.slug}/${first.id}`}
              className="mt-5 block rounded-lg bg-seal-500 px-5 py-3.5 text-center text-[15px] font-medium text-paper-50 transition-colors hover:bg-seal-600"
            >
              Start from the beginning
            </Link>
          )}

          <dl className="mt-7 space-y-4 text-[14px]">
            {[
              ['Creator', series.author],
              ['Published', series.year],
              ['Origin', series.origin],
              ['Length', `${series.chapters.length} chapters · ${pages} pages`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[12px] uppercase tracking-[0.12em] text-ink-400">
                  {k}
                </dt>
                <dd className="mt-1 text-paper-100">{v}</dd>
              </div>
            ))}
            <div>
              <dt className="text-[12px] uppercase tracking-[0.12em] text-ink-400">
                Licence
              </dt>
              <dd className="mt-2">
                <LicenceBadge licence={series.license} href />
                <p className="mt-2 text-[13px] leading-relaxed text-ink-400">
                  {series.license.name}. Sourced from{' '}
                  <a
                    href={series.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-seal-400 underline-offset-2 hover:underline"
                  >
                    {series.sourceName}
                  </a>
                  .
                </p>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h1 className="font-display text-[46px] leading-[1.05] tracking-tight text-paper-50 sm:text-[58px]">
            {series.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-300">
            {series.synopsis}
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-400">
            {series.authorNote}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {series.tags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-ink-700 px-2.5 py-1 text-[12px] text-ink-300"
              >
                {t}
              </span>
            ))}
          </div>

          {series.languages && (
            <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-ink-400">
              Volunteer translators have carried this into{' '}
              <span className="text-paper-100">
                {series.languages.length} languages
              </span>
              , Bahasa Indonesia among them.
            </p>
          )}

          <h2 className="mt-14 font-display text-[28px] text-paper-50">
            Chapters
          </h2>
          <ol className="mt-5 divide-y divide-ink-800 border-y border-ink-800">
            {series.chapters.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/read/${series.slug}/${c.id}`}
                  className="group flex items-center gap-4 py-3.5 transition-colors hover:bg-ink-900/70"
                >
                  <span className="w-12 shrink-0 text-right font-display text-[20px] text-ink-400 tabular-nums group-hover:text-seal-400">
                    {c.number}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[15px] text-paper-100">
                    {c.title}
                  </span>
                  <span className="shrink-0 text-[13px] text-ink-400">
                    {c.pageCount} pp
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
