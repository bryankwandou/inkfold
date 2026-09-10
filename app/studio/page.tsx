import type { Metadata } from 'next';
import Link from 'next/link';
import { ORIGINALS, getOriginal } from '@/lib/studio/library';
import { LAYER_NOTES, PALETTES, renderPage } from '@/lib/studio/paint';

export const metadata: Metadata = {
  title: 'The studio',
  description:
    'How the Inkfold originals are drawn: a scene description, a seeded renderer, and a check suite that reads every page before you do.',
};

/** sRGB relative luminance, so the palette table can show its own working. */
function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Print a layer roughly the way it reads in the script file. */
function describe(layer: Record<string, unknown>): string {
  const { t, ...rest } = layer;
  const args = Object.entries(rest)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : String(v)}`)
    .join(', ');
  return args ? `${t} { ${args} }` : String(t);
}

export default function StudioPage() {
  const totals = ORIGINALS.reduce(
    (acc, o) => {
      const specs = [o.cover, ...o.chapters.flatMap((c) => c.pages)];
      acc.pages += specs.length;
      acc.panels += specs.reduce((n, s) => n + s.panels.length, 0);
      acc.layers += specs.reduce(
        (n, s) => n + s.panels.reduce((m, p) => m + p.layers.length, 0),
        0,
      );
      acc.bytes += specs.reduce((n, s) => n + renderPage(s).length, 0);
      return acc;
    },
    { pages: 0, panels: 0, layers: 0, bytes: 0 },
  );

  // Worked example: a real page, shown beside the description it was built from.
  // Both the picture and the listing come off the same object, so they cannot
  // disagree and the URL cannot rot if a chapter is ever renamed.
  const chapter = getOriginal('paper-streets')!.chapters[0];
  const example = chapter.pages[1];
  const exampleSrc = `/page-art/paper-streets/${chapter.id}/2.svg`;

  const vocabulary = Object.entries(LAYER_NOTES);
  const palettes = Object.entries(PALETTES);

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <header className="max-w-3xl">
        <p className="text-[12px] uppercase tracking-[0.16em] text-seal-500">
          Inkfold Studio
        </p>
        <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tight text-paper-50 sm:text-[60px]">
          Nobody drew these pages.
        </h1>
        <p className="mt-6 text-[17px] leading-relaxed text-ink-300">
          Both originals on this shelf were written as prose, broken into panels,
          and then described to a renderer as a stack of named layers. There is
          no sourced artwork in either of them and nothing was traced. A page is
          a function of its description and a fixed seed, which is the whole
          reason we can hand our own work back out under CC BY-SA without a
          clearance question anywhere in the chain.
        </p>
      </header>

      <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
        {[
          { n: String(totals.pages), l: 'Pages' },
          { n: String(totals.panels), l: 'Panels' },
          { n: String(totals.layers), l: 'Layer calls' },
          { n: `${Math.round(totals.bytes / 1024)} KB`, l: 'Total artwork' },
        ].map((s) => (
          <div key={s.l}>
            <dt className="font-display text-[36px] leading-none text-paper-50 tabular-nums">
              {s.n}
            </dt>
            <dd className="mt-1.5 text-[13px] tracking-wide text-ink-400">
              {s.l}
            </dd>
          </div>
        ))}
      </dl>

      {/* Worked example */}
      <section className="mt-24 border-t border-ink-800 pt-16">
        <h2 className="font-display text-[34px] leading-tight tracking-tight text-paper-50 sm:text-[42px]">
          One page, both ways
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-300">
          On the left is the second page of <em>Paper Streets</em>, chapter one,
          exactly as a reader gets it. On the right is the description it was
          built from, read out of the source file rather than transcribed, so it
          cannot drift from what you are looking at.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-hidden rounded-xl ring-1 ring-ink-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={exampleSrc}
              alt="Paper Streets, chapter one, page two"
              className="w-full"
            />
          </div>

          <div className="rounded-xl border border-ink-800 bg-ink-900/50 p-6">
            <p className="text-[12px] uppercase tracking-[0.14em] text-ink-400">
              palette {example.pal} · seed {example.seed ?? 'unset'} ·{' '}
              {example.panels.length} panels
            </p>
            <ol className="mt-5 space-y-5">
              {example.panels.map((panel, i) => (
                <li key={i}>
                  <p className="font-display text-[17px] text-paper-50">
                    Panel {i + 1}
                    <span className="ml-2 text-[13px] text-ink-400 tabular-nums">
                      {Math.round(panel.w * 100)} × {Math.round(panel.h * 100)}
                    </span>
                  </p>
                  <ul className="mt-2 space-y-1">
                    {panel.layers.map((layer, j) => (
                      <li
                        key={j}
                        className="font-mono text-[12.5px] leading-relaxed text-ink-300"
                      >
                        {describe(layer as unknown as Record<string, unknown>)}
                      </li>
                    ))}
                  </ul>
                  {panel.balloons?.length ? (
                    <p className="mt-2 text-[13px] italic leading-relaxed text-ink-400">
                      {panel.balloons.map((b) => `“${b.text}”`).join(' ')}
                    </p>
                  ) : null}
                  {panel.caption ? (
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-400">
                      Caption: {panel.caption}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Vocabulary */}
      <section className="mt-24 border-t border-ink-800 pt-16">
        <h2 className="font-display text-[34px] leading-tight tracking-tight text-paper-50 sm:text-[42px]">
          The vocabulary
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-300">
          {vocabulary.length} layers, and a page is some ordering of them. The
          list grew the way a prop cupboard does: <em>Nine Tenths</em> wanted a
          wreck and a cold-storage pod, then <em>Paper Streets</em> turned up
          asking for rain, a skyline and a filing desk.
        </p>

        <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {vocabulary.map(([name, note]) => (
            <div key={name} className="border-t border-ink-800 pt-4">
              <p className="font-mono text-[13px] text-seal-400">{name}</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-300">
                {note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Palettes */}
      <section className="mt-24 border-t border-ink-800 pt-16">
        <h2 className="font-display text-[34px] leading-tight tracking-tight text-paper-50 sm:text-[42px]">
          Ten palettes, and one rule about balloons
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-300">
          A chapter picks a palette and stays there. Dialogue is always{' '}
          <code className="font-mono text-[14px] text-paper-100">ink</code> on{' '}
          <code className="font-mono text-[14px] text-paper-100">paper</code>,
          and that pair has to clear 12:1 everywhere. We added the rule after two
          daylight palettes shipped with the ground, the silhouettes and the
          lettering all within a few percent of black, and those pages came out
          as empty rectangles.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {palettes.map(([name, pal]) => (
            <div
              key={name}
              className="overflow-hidden rounded-lg border border-ink-800"
            >
              <div className="flex h-20">
                {(['far', 'near', 'ink', 'accent', 'glow'] as const).map((k) => (
                  <div
                    key={k}
                    className="flex-1"
                    style={{ backgroundColor: pal[k] }}
                    title={`${k} ${pal[k]}`}
                  />
                ))}
              </div>
              <div
                className="px-3 py-2.5 text-[13px]"
                style={{ backgroundColor: pal.paper, color: pal.ink }}
              >
                <span className="font-mono">{name}</span>
                <span className="float-right tabular-nums opacity-70">
                  {contrast(pal.paper, pal.ink).toFixed(1)}:1
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Checks */}
      <section className="mt-24 border-t border-ink-800 pt-16">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-[34px] leading-[1.1] tracking-tight text-paper-50 sm:text-[42px]">
              Valid markup is not the same as a readable page.
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-ink-300">
              Every structural check passed while a figure&rsquo;s head floated
              clear of its shoulders on all sixty-six pages, a treeline painted
              over the road beneath it, and one panel slot sat empty because the
              grid helper had three bodies for four holes. None of that is
              malformed. It surfaced only once we rendered the lot and looked at
              it.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-300">
              Two of the rules below came straight off those pages. All of them
              run before anything ships.
            </p>
            <Link
              href="/licences"
              className="mt-8 inline-block text-[15px] text-seal-400 underline-offset-4 hover:underline"
            >
              How the borrowed half of the shelf gets cleared
            </Link>
          </div>

          <ul className="space-y-5">
            {[
              ['Tag balance', 'Everything opened is closed, self-closing tags aside.'],
              ['Live references', 'No url(#id) pointing at an id the document never defines.'],
              ['Numeric holes', 'No NaN, no Infinity, nothing undefined that reached a coordinate.'],
              ['Escaping', 'No raw ampersand in dialogue, which would break the parse outright.'],
              ['Determinism', 'The same description rendered twice has to be byte-identical.'],
              ['Balloon contrast', 'Every palette clears 12:1 between paper and ink.'],
              ['Panel coverage', 'Panels account for 97% of a page, so no slot sits silently empty.'],
            ].map(([title, body]) => (
              <li key={title} className="border-l-2 border-ink-700 pl-5">
                <p className="font-display text-[19px] text-paper-50">{title}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-300">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-24 rounded-2xl border border-ink-800 bg-ink-900/50 p-10">
        <h2 className="font-display text-[28px] text-paper-50">
          Read what came out of it
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/series/nine-tenths"
            className="rounded-lg bg-seal-500 px-6 py-3.5 text-[15px] font-medium text-paper-50 transition-colors hover:bg-seal-600"
          >
            Nine Tenths
          </Link>
          <Link
            href="/series/paper-streets"
            className="rounded-lg border border-ink-700 px-6 py-3.5 text-[15px] text-paper-100 transition-colors hover:border-ink-600 hover:bg-ink-900"
          >
            Paper Streets
          </Link>
          <a
            href="https://github.com/bryankwandou/inkfold/blob/main/lib/studio/paint.ts"
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg border border-ink-700 px-6 py-3.5 text-[15px] text-paper-100 transition-colors hover:border-ink-600 hover:bg-ink-900"
          >
            The renderer
          </a>
        </div>
      </section>
    </div>
  );
}
