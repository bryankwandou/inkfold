import type { Metadata } from 'next';
import { getCatalog } from '@/lib/catalog';
import LicenceBadge from '@/components/LicenceBadge';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Licences',
  description:
    'How a title gets onto Inkfold, and the licence behind every work we host.',
};

const GATE = [
  {
    n: '01',
    h: 'Find the licence statement, not a claim about it',
    p: 'A forum post saying a work is free is not evidence. We need the licence named by the rights holder on a page they control, or a documented death date that puts the work out of copyright.',
  },
  {
    n: '02',
    h: 'Check that redistribution is actually permitted',
    p: 'Plenty of free-to-read work is not free to re-host. CC BY and CC BY-SA permit it. CC BY-NC-ND does not, and we turn those down however much we would like to carry them.',
  },
  {
    n: '03',
    h: 'Record the attribution the licence requires',
    p: 'CC BY obliges us to name the author, the licence and any changes made. That obligation is why the badge and the source link appear on every page rather than buried in a footer.',
  },
  {
    n: '04',
    h: 'Keep serving from the source where we can',
    p: 'Pepper & Carrot pages load straight from the author’s own server, so his traffic figures still count our readers and he can pull or update a page without asking us.',
  },
];

export default async function LicencesPage() {
  const catalog = await getCatalog();

  return (
    <div className="mx-auto max-w-4xl px-5 py-20">
      <h1 className="font-display text-[44px] leading-tight tracking-tight text-paper-50 sm:text-[56px]">
        How a title gets onto the shelf
      </h1>
      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-300">
        Scanlation aggregators are the reason free comic sites have the reputation
        they do. They host work nobody licensed to them, which means they cannot
        take payment openly, which means they take it from ad networks that do not
        ask questions. The clutter is a symptom. This is the part we fixed first.
      </p>

      <ol className="mt-14 space-y-10">
        {GATE.map((g) => (
          <li key={g.n} className="grid gap-4 sm:grid-cols-[64px_1fr]">
            <span className="font-display text-[30px] leading-none text-seal-500 tabular-nums">
              {g.n}
            </span>
            <div>
              <h2 className="font-display text-[24px] leading-snug text-paper-50">
                {g.h}
              </h2>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-300">
                {g.p}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-16 rounded-2xl border border-seal-600/35 bg-seal-600/8 p-8">
        <h2 className="font-display text-[24px] text-paper-50">
          The fifth route: write it ourselves
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-300">
          Clearance is slow, and a library that only ever borrows is at the mercy
          of what other people happen to release. So one title on the shelf is
          ours outright. <em>Nine Tenths</em> is scripted and then drawn by a
          renderer we wrote — no sourced artwork anywhere in it, which means the
          clearance question never arises. We put it out under CC BY-SA 4.0,
          the same terms we ask of anyone submitting to us.
        </p>
      </div>

      <h2 className="mt-20 font-display text-[32px] text-paper-50">
        What we currently host
      </h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-ink-700 text-left text-[12px] uppercase tracking-[0.12em] text-ink-400">
              <th className="py-3 pr-4 font-medium">Work</th>
              <th className="py-3 pr-4 font-medium">Creator</th>
              <th className="py-3 pr-4 font-medium">Licence</th>
              <th className="py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800">
            {catalog.map((s) => (
              <tr key={s.slug}>
                <td className="py-4 pr-4 text-paper-100">{s.title}</td>
                <td className="py-4 pr-4 text-ink-300">{s.author}</td>
                <td className="py-4 pr-4">
                  <LicenceBadge licence={s.license} href />
                </td>
                <td className="py-4">
                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-seal-400 underline-offset-2 hover:underline"
                  >
                    {s.sourceName}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-16 rounded-2xl border border-ink-800 bg-ink-900/60 p-8">
        <h2 className="font-display text-[24px] text-paper-50">
          If you hold rights to something here
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-300">
          Tell us and we will pull it the same day, no argument and no process to
          wade through. We would also like to know where our clearance went
          wrong, because a mistake in step one usually means the same mistake is
          sitting in the queue behind it.
        </p>
      </div>
    </div>
  );
}
