import type { License } from '@/lib/catalog';

/**
 * The badge is the product. It appears anywhere a title appears, and it always
 * resolves to the licence text itself rather than a page we wrote about it.
 */
export default function LicenceBadge({
  licence,
  href = false,
}: {
  licence: License;
  href?: boolean;
}) {
  const inner = (
    <>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {licence.short}
    </>
  );

  const cls =
    'inline-flex items-center gap-1.5 rounded-md border border-seal-600/45 bg-seal-600/12 px-2 py-1 text-[11px] font-medium text-seal-400';

  if (!href) return <span className={cls}>{inner}</span>;

  return (
    <a
      href={licence.url}
      target="_blank"
      rel="noreferrer noopener"
      className={`${cls} transition-colors hover:border-seal-500 hover:bg-seal-600/20`}
      title={licence.name}
    >
      {inner}
    </a>
  );
}
