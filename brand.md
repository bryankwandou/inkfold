# Inkfold — brand

## The name

**Inkfold.** Ink is the medium; the fold is both the page and the turn in a
story. Two syllables, one hard consonant cluster, no silent letters. It reads
identically in English and Bahasa Indonesia, which matters for a product whose
first non-English audience is Indonesian.

Checked before locking:

- `github.com/bryankwandou/inkfold` — available
- `inkfold.vercel.app` — available (404 DEPLOYMENT_NOT_FOUND)

Rejected: *kanso*, *panelith*, *tsuzuki*, *kirei*, *komiko*, *yomu*, *panelia*
(all resolve on `.vercel.app`). *Gutterlight* was free and technically the
sharper name — "gutter" is the real comics term for the space between panels —
but the English connotation is a drain, and that is not a fight worth taking on
for a consumer product.

## The mark

A cinnabar seal with a sheet folded down the middle. The two leaves are the
recto and verso of one page; the gap between them is the gutter. It reads as an
open book at 24px and as a hanko stamp at 200px.

The right leaf is set at 62% opacity so it reads as the reverse side of the
sheet rather than a mirrored copy. That asymmetry is what keeps it from
flattening into a generic book icon.

Source: `public/logo.svg`. Single path set, no gradients, no text — it survives
being printed in one colour.

## Palette

Ink, paper, seal — a hanko stamp on sumi-e paper.

| Token | Hex | Use |
|---|---|---|
| `ink-950` | `#0a0908` | Page background |
| `ink-900` | `#121010` | Raised surfaces |
| `ink-800` | `#1c1917` | Borders, dividers |
| `ink-400` | `#7d746d` | Secondary text |
| `paper-50` | `#faf6ec` | Primary text, the mark's paper |
| `paper-200` | `#e4dbc7` | Hover on light surfaces |
| `seal-500` | `#d93a22` | The single accent |
| `seal-600` | `#b32d18` | Accent pressed |

Every black in the system is warm. There is no blue-grey anywhere, which is what
separates this from the default dark-mode look. The seal red appears sparingly —
primary action, licence badge, section numerals — so it still registers as
emphasis rather than decoration.

## Type

- **Display:** Instrument Serif, 400. Editorial, high contrast, set tight
  (`-0.02em`) at large sizes.
- **UI and body:** Inter.

The serif carries every heading. A comics library should feel like it was set by
someone who reads, not shipped from a component library.

## Voice

Plain, specific, and willing to concede a point. The licences page states
outright that we are not claiming moral high ground over sites that need ad
revenue — the promise is narrower than that and gets narrower still when we say
it is enforced in the CSP rather than the copy.

No exclamation marks. No emoji. No "seamless", "revolutionary", "unleash",
"empower". Numbers instead of adjectives wherever a number exists.

## Motion

Entrances are choreographed in reading order via a `--d` delay custom property
on `.rise`, not fired simultaneously. Everything collapses under
`prefers-reduced-motion: reduce`.

The one substantial interaction is the demo on the landing page: the same comic
page shown twice, once wearing mock ad overlays that pop in one at a time the way
they actually do on load. The overlays are drawn in CSS and make no network
calls. Demonstrating the tax without levying it is the whole point.
