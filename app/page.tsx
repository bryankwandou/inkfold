import Link from 'next/link';
import { getCatalog } from '@/lib/catalog';
import CleanReadDemo from '@/components/CleanReadDemo';
import SeriesCard from '@/components/SeriesCard';

export const revalidate = 86400;

export default async function HomePage() {
  const catalog = await getCatalog();
  const chapters = catalog.reduce((n, s) => n + s.chapters.length, 0);
  const pages = catalog.reduce(
    (n, s) => n + s.chapters.reduce((m, c) => m + c.pageCount, 0),
    0,
  );
  const langs = catalog[0]?.languages?.length ?? 0;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-ink-800">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-seal-600/12 blur-[120px]"
        />
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:pt-28">
          <p
            className="rise inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900 px-3.5 py-1.5 text-[12px] tracking-wide text-ink-300"
            style={{ '--d': '0ms' } as React.CSSProperties}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-seal-500" />
            Every title on this shelf can show its licence
          </p>

          <h1
            className="rise mt-7 max-w-4xl font-display text-[46px] leading-[1.02] tracking-[-0.02em] text-paper-50 sm:text-[68px] lg:text-[82px]"
            style={{ '--d': '70ms' } as React.CSSProperties}
          >
            Comics with the
            <br />
            paperwork attached.
          </h1>

          <p
            className="rise mt-7 max-w-xl text-[17px] leading-relaxed text-ink-300"
            style={{ '--d': '150ms' } as React.CSSProperties}
          >
            Most free reading sites pay for themselves by renting your screen to
            whoever bids highest, and some of those bidders ship malware. Inkfold
            takes the other route: a smaller shelf, stocked only with work that is
            genuinely cleared to share, and a reader with nothing on top of it.
          </p>

          <div
            className="rise mt-9 flex flex-wrap items-center gap-3"
            style={{ '--d': '230ms' } as React.CSSProperties}
          >
            <Link
              href="/library"
              className="rounded-lg bg-seal-500 px-6 py-3.5 text-[15px] font-medium text-paper-50 transition-colors hover:bg-seal-600"
            >
              Open the library
            </Link>
            <Link
              href="/licences"
              className="rounded-lg border border-ink-700 px-6 py-3.5 text-[15px] text-paper-100 transition-colors hover:border-ink-600 hover:bg-ink-900"
            >
              See how titles get cleared
            </Link>
          </div>

          {/* Live counters, straight from the source APIs. */}
          <dl
            className="rise mt-16 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4"
            style={{ '--d': '310ms' } as React.CSSProperties}
          >
            {[
              { n: catalog.length, l: 'Series' },
              { n: chapters, l: 'Chapters' },
              { n: pages, l: 'Pages' },
              { n: langs, l: 'Languages' },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-display text-[38px] leading-none text-paper-50">
                  {s.n}
                </dt>
                <dd className="mt-1.5 text-[13px] tracking-wide text-ink-400">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── The argument ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="font-display text-[36px] leading-[1.1] tracking-tight text-paper-50 sm:text-[44px]">
              An ad slot is a stranger with write access to your page.
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-ink-300">
              Programmatic ad networks resell inventory several layers deep. By
              the time a creative lands in front of a reader, the site owner
              usually cannot say who wrote the script running inside it. That is
              the mechanism behind redirect chains, fake update prompts and the
              close buttons that open two more tabs.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-300">
              We are not claiming moral high ground over sites that need the
              revenue. We are making a narrower promise, and enforcing it in the
              response headers rather than the marketing copy: on Inkfold, the
              only origins allowed to load an image are the two archives our
              catalogue draws from.
            </p>

            <ul className="mt-8 space-y-3.5">
              {[
                ['0', 'third-party scripts on any reading page'],
                ['0', 'analytics or advertising cookies'],
                ['2', 'image origins permitted by our CSP'],
              ].map(([n, t]) => (
                <li key={t} className="flex items-baseline gap-4">
                  <span className="font-display text-[26px] leading-none text-seal-500 tabular-nums">
                    {n}
                  </span>
                  <span className="text-[15px] text-ink-300">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <CleanReadDemo />
        </div>
      </section>

      {/* ── Shelf ────────────────────────────────────────────── */}
      <section className="border-y border-ink-800 bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-[36px] leading-tight tracking-tight text-paper-50 sm:text-[44px]">
                On the shelf
              </h2>
              <p className="mt-3 max-w-lg text-[15px] text-ink-400">
                Small on purpose. Each entry links to the archive it came from so
                you can check the licence without taking our word for it.
              </p>
            </div>
            <Link
              href="/library"
              className="text-[15px] text-seal-400 underline-offset-4 hover:underline"
            >
              Browse everything
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {catalog.map((s, i) => (
              <SeriesCard key={s.slug} series={s} delay={i * 90} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Close ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-28 text-center">
        <h2 className="font-display text-[38px] leading-[1.08] tracking-tight text-paper-50 sm:text-[52px]">
          Start with the witch who keeps blowing up her own kitchen.
        </h2>
        <p className="mt-6 text-[16px] leading-relaxed text-ink-300">
          Thirty-nine episodes, translated by volunteers into seventy-two
          languages, released by its author under a licence that lets anyone put
          it on their own shelf. Including us.
        </p>
        <Link
          href="/series/pepper-and-carrot"
          className="mt-9 inline-block rounded-lg bg-paper-50 px-7 py-3.5 text-[15px] font-medium text-ink-950 transition-colors hover:bg-paper-200"
        >
          Read Pepper &amp; Carrot
        </Link>
      </section>
    </>
  );
}
