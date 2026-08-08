'use client';

import { useEffect, useState } from 'react';

/**
 * Side-by-side of the same page, one wearing the junk a typical aggregator
 * layers on top of it. The overlays here are inert mockups — no network calls,
 * nothing loaded from a third party. The point is to show the tax, not levy it.
 */

const CLUTTER = [
  {
    id: 'sticky',
    label: 'Sticky bottom banner',
    cls: 'absolute inset-x-0 bottom-0 h-[52px] bg-[#1d4ed8] text-white flex items-center justify-center text-[11px] font-semibold tracking-wide',
    body: 'DOWNLOAD NOW — YOUR DEVICE IS AT RISK',
  },
  {
    id: 'corner',
    label: 'Floating close-button trap',
    cls: 'absolute right-3 top-3 w-[128px] rounded bg-[#111] ring-1 ring-white/20 p-2 text-[10px] text-white/80',
    body: 'Ad · 00:14',
  },
  {
    id: 'interstitial',
    label: 'Full-page interstitial',
    cls: 'absolute inset-0 backdrop-blur-[2px] bg-black/70 flex flex-col items-center justify-center gap-2 text-center px-4',
    body: 'Continue reading?',
  },
];

function PagePlate({ dim = false }: { dim?: boolean }) {
  // A stand-in comic page drawn in CSS so the demo costs nothing to load.
  return (
    <div
      className={`h-full w-full bg-paper-100 p-3 transition-opacity ${
        dim ? 'opacity-90' : ''
      }`}
      aria-hidden="true"
    >
      <div className="grid h-full grid-rows-[1.35fr_1fr_1.1fr] gap-2">
        <div className="rounded-[3px] bg-ink-800/85 ring-1 ring-ink-700" />
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[3px] bg-ink-700/80 ring-1 ring-ink-600" />
          <div className="rounded-[3px] bg-ink-800/85 ring-1 ring-ink-700" />
        </div>
        <div className="rounded-[3px] bg-ink-700/70 ring-1 ring-ink-600" />
      </div>
    </div>
  );
}

export default function CleanReadDemo() {
  const [noisy, setNoisy] = useState(true);
  const [tick, setTick] = useState(0);

  // Let the junk pop in one at a time, the way it actually does on page load.
  useEffect(() => {
    if (!noisy) {
      setTick(0);
      return;
    }
    const t = window.setInterval(
      () => setTick((n) => (n >= CLUTTER.length ? n : n + 1)),
      520,
    );
    return () => window.clearInterval(t);
  }, [noisy]);

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-[22px] leading-tight text-paper-50">
            The same page, twice
          </h3>
          <p className="mt-1 text-[13px] text-ink-400">
            Mock overlays, drawn locally. Nothing here phones home.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setNoisy((v) => !v)}
          aria-pressed={noisy}
          className="rounded-lg border border-ink-700 bg-ink-800 px-4 py-2 text-[13px] font-medium text-paper-100 transition-colors hover:border-seal-500 hover:text-paper-50"
        >
          {noisy ? 'Strip the overlays' : 'Put the overlays back'}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Cluttered */}
        <figure>
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-ink-700">
            <PagePlate dim={noisy} />
            {noisy &&
              CLUTTER.slice(0, tick).map((c) => (
                <div key={c.id} className={`${c.cls} rise`}>
                  {c.id === 'interstitial' ? (
                    <>
                      <span className="text-[13px] font-semibold text-white">
                        {c.body}
                      </span>
                      <span className="rounded bg-[#22c55e] px-3 py-1 text-[11px] font-bold text-black">
                        CLICK TO CONTINUE
                      </span>
                    </>
                  ) : (
                    c.body
                  )}
                </div>
              ))}
          </div>
          <figcaption className="mt-2.5 text-[12px] text-ink-400">
            Typical aggregator ·{' '}
            <span className="text-seal-400">
              {noisy ? `${tick} overlay${tick === 1 ? '' : 's'}` : 'off'}
            </span>
          </figcaption>
        </figure>

        {/* Clean */}
        <figure>
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-ink-700">
            <PagePlate />
          </div>
          <figcaption className="mt-2.5 text-[12px] text-ink-400">
            Inkfold · <span className="text-paper-100">the page</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
