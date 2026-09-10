import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://inkfold.vercel.app'),
  title: {
    default: 'Inkfold — comics with the paperwork attached',
    template: '%s · Inkfold',
  },
  description:
    'A reading library built only from work we can prove is free to share. No ad scripts, no trackers, no overlays between you and the page.',
  openGraph: {
    title: 'Inkfold — comics with the paperwork attached',
    description:
      'Licensed and public-domain comics, read clean. Every title shows its licence and links to its source.',
    type: 'website',
    url: 'https://inkfold.vercel.app',
  },
  icons: { icon: '/logo.svg' },
};

export const viewport: Viewport = {
  themeColor: '#0a0908',
};

function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" width={26} height={26} className="rounded-[6px]" />
      <span className="font-display text-[21px] leading-none tracking-tight text-paper-50">
        Inkfold
      </span>
    </span>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="grain min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-seal-500 focus:px-4 focus:py-2 focus:text-paper-50"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur-md">
          <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
            <Link href="/" aria-label="Inkfold home">
              <Wordmark />
            </Link>
            <div className="flex items-center gap-1 text-[14px] text-ink-300 sm:gap-2">
              <Link
                href="/library"
                className="rounded-md px-3 py-2 transition-colors hover:bg-ink-800 hover:text-paper-50"
              >
                Library
              </Link>
              <Link
                href="/studio"
                className="hidden rounded-md px-3 py-2 transition-colors hover:bg-ink-800 hover:text-paper-50 sm:block"
              >
                Studio
              </Link>
              <Link
                href="/licences"
                className="rounded-md px-3 py-2 transition-colors hover:bg-ink-800 hover:text-paper-50"
              >
                Licences
              </Link>
              <Link
                href="/library"
                className="ml-1 rounded-md bg-paper-50 px-3.5 py-2 font-medium text-ink-950 transition-colors hover:bg-paper-200"
              >
                Start reading
              </Link>
            </div>
          </nav>
        </header>

        <main id="main">{children}</main>

        <footer className="mt-28 border-t border-ink-800">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <Wordmark />
              <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-400">
                Inkfold carries only work whose licence we can point at. If a
                title cannot show its paperwork, it does not go on the shelf.
              </p>
            </div>
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-400">
                Read
              </h3>
              <ul className="mt-4 space-y-2.5 text-[14px] text-ink-300">
                <li>
                  <Link href="/library" className="hover:text-paper-50">
                    Full library
                  </Link>
                </li>
                <li>
                  <Link href="/series/nine-tenths" className="hover:text-paper-50">
                    Nine Tenths
                  </Link>
                </li>
                <li>
                  <Link href="/series/paper-streets" className="hover:text-paper-50">
                    Paper Streets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/series/pepper-and-carrot"
                    className="hover:text-paper-50"
                  >
                    Pepper &amp; Carrot
                  </Link>
                </li>
                <li>
                  <Link
                    href="/series/hokusai-manga"
                    className="hover:text-paper-50"
                  >
                    Hokusai Manga
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-400">
                Provenance
              </h3>
              <ul className="mt-4 space-y-2.5 text-[14px] text-ink-300">
                <li>
                  <Link href="/licences" className="hover:text-paper-50">
                    How titles get cleared
                  </Link>
                </li>
                <li>
                  <Link href="/studio" className="hover:text-paper-50">
                    How the originals are drawn
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.peppercarrot.com/"
                    className="hover:text-paper-50"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    peppercarrot.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://archive.org/details/hokusaimangav5katsa"
                    className="hover:text-paper-50"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Internet Archive
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-ink-800/70">
            <p className="mx-auto max-w-6xl px-5 py-6 text-[13px] text-ink-400">
              Artwork belongs to its creators and is shown under the licence
              named on each title page. Pepper &amp; Carrot by David Revoy is
              used under CC BY 4.0.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
