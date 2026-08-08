import type { Metadata } from 'next';
import { getCatalog } from '@/lib/catalog';
import SeriesCard from '@/components/SeriesCard';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Library',
  description:
    'Every series on Inkfold, with its licence and the archive it came from.',
};

export default async function LibraryPage() {
  const catalog = await getCatalog();

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <header className="max-w-2xl">
        <h1 className="font-display text-[44px] leading-tight tracking-tight text-paper-50 sm:text-[56px]">
          The library
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-ink-300">
          Two series today. We would rather grow this slowly and be able to
          answer the licence question for every single entry than pad it out with
          work we have no right to host.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {catalog.map((s, i) => (
          <SeriesCard key={s.slug} series={s} delay={i * 90} />
        ))}
      </div>

      <aside className="mt-14 rounded-2xl border border-dashed border-ink-700 p-8">
        <h2 className="font-display text-[24px] text-paper-50">
          Know something we should carry?
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-400">
          We take submissions for work released under CC BY, CC BY-SA, or any
          licence permitting redistribution, plus anything demonstrably out of
          copyright. Creators keep everything: we host a copy, credit you on the
          title page, and link back to wherever you sell or collect support.
        </p>
      </aside>
    </div>
  );
}
