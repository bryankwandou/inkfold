'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  seriesSlug: string;
  seriesTitle: string;
  chapterId: string;
  chapterTitle: string;
  chapterNumber: number;
  pages: string[];
  prevId: string | null;
  nextId: string | null;
};

type Mode = 'strip' | 'page';

export default function Reader({
  seriesSlug,
  seriesTitle,
  chapterId,
  chapterTitle,
  chapterNumber,
  pages,
  prevId,
  nextId,
}: Props) {
  const [mode, setMode] = useState<Mode>('strip');
  const [index, setIndex] = useState(0);
  const [chrome, setChrome] = useState(true);
  const [loaded, setLoaded] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const progressKey = `inkfold:progress:${seriesSlug}`;

  // Restore the reader's preference, then remember where they stopped.
  useEffect(() => {
    const saved = window.localStorage.getItem('inkfold:mode');
    if (saved === 'page' || saved === 'strip') setMode(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('inkfold:mode', mode);
  }, [mode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        progressKey,
        JSON.stringify({ chapterId, page: index, at: Date.now() }),
      );
    } catch {
      // Private browsing with storage disabled: reading still works.
    }
  }, [progressKey, chapterId, index]);

  const step = useCallback(
    (delta: number) => {
      setIndex((i) => Math.min(pages.length - 1, Math.max(0, i + delta)));
    },
    [pages.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'd':
          if (mode === 'page') {
            e.preventDefault();
            step(1);
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (mode === 'page') {
            e.preventDefault();
            step(-1);
          }
          break;
        case 'f':
          setMode((m) => (m === 'strip' ? 'page' : 'strip'));
          break;
        case 'h':
          setChrome((c) => !c);
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, step]);

  const pct = Math.round(((index + 1) / pages.length) * 100);

  return (
    <div className="min-h-dvh bg-ink-950">
      {/* Reader bar. Collapses with `h` so the page can stand alone. */}
      <div
        className={`sticky top-16 z-30 border-b border-ink-800 bg-ink-950/92 backdrop-blur transition-transform duration-300 ${
          chrome ? 'translate-y-0' : '-translate-y-[200%]'
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3">
          <Link
            href={`/series/${seriesSlug}`}
            className="text-[13px] text-ink-400 transition-colors hover:text-paper-50"
          >
            ← {seriesTitle}
          </Link>

          <span className="text-[14px] text-paper-100">
            <span className="text-ink-400">Ch {chapterNumber}</span>{' '}
            {chapterTitle}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[12px] tabular-nums text-ink-400">
              {mode === 'page'
                ? `${index + 1} / ${pages.length}`
                : `${pages.length} pages`}
            </span>

            <div
              className="flex rounded-lg border border-ink-700 p-0.5"
              role="group"
              aria-label="Reading mode"
            >
              {(['strip', 'page'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={`rounded-md px-2.5 py-1 text-[12px] capitalize transition-colors ${
                    mode === m
                      ? 'bg-paper-50 text-ink-950'
                      : 'text-ink-300 hover:text-paper-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {mode === 'page' && (
          <div className="h-0.5 w-full bg-ink-800">
            <div
              className="h-full bg-seal-500 transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      {/* Pages */}
      {mode === 'strip' ? (
        <div ref={stripRef} className="strip mx-auto max-w-[860px] py-6">
          {pages.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={`Page ${i + 1}`}
              loading={i < 2 ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={() => setLoaded((n) => n + 1)}
              className="bg-ink-900"
            />
          ))}
        </div>
      ) : (
        <div className="relative mx-auto max-w-[900px] px-4 py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={pages[index]}
            src={pages[index]}
            alt={`Page ${index + 1} of ${pages.length}`}
            className="mx-auto h-auto w-full rounded-sm bg-ink-900"
          />
          {/* Preload the next page so the turn is instant. */}
          {pages[index + 1] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pages[index + 1]} alt="" className="hidden" aria-hidden />
          )}

          <button
            type="button"
            aria-label="Previous page"
            onClick={() => step(-1)}
            disabled={index === 0}
            className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize disabled:cursor-default"
          />
          <button
            type="button"
            aria-label="Next page"
            onClick={() => step(1)}
            disabled={index === pages.length - 1}
            className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize disabled:cursor-default"
          />
        </div>
      )}

      {/* Chapter hand-off */}
      <div className="mx-auto flex max-w-[860px] items-center justify-between gap-4 px-4 pb-24 pt-10">
        {prevId ? (
          <Link
            href={`/read/${seriesSlug}/${prevId}`}
            className="rounded-lg border border-ink-700 px-5 py-3 text-[14px] text-paper-100 transition-colors hover:border-ink-600 hover:bg-ink-900"
          >
            ← Previous chapter
          </Link>
        ) : (
          <span />
        )}
        {nextId ? (
          <Link
            href={`/read/${seriesSlug}/${nextId}`}
            className="rounded-lg bg-seal-500 px-5 py-3 text-[14px] font-medium text-paper-50 transition-colors hover:bg-seal-600"
          >
            Next chapter →
          </Link>
        ) : (
          <Link
            href={`/series/${seriesSlug}`}
            className="rounded-lg border border-ink-700 px-5 py-3 text-[14px] text-paper-100 hover:bg-ink-900"
          >
            Back to chapter list
          </Link>
        )}
      </div>

      <p className="pb-16 text-center text-[12px] text-ink-600">
        {loaded > 0 && mode === 'strip' ? `${loaded} of ${pages.length} loaded · ` : ''}
        f — switch mode · h — hide bar · ← → — turn page
      </p>
    </div>
  );
}
