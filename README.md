# Inkfold

A reading library built only from comics we can prove are free to share.

Live: https://inkfold.vercel.app

## Why this exists

Free comic sites have a structural problem. Most of them host work nobody
licensed to them, so they cannot take payment openly, so they take it from
programmatic ad networks instead. Those networks resell inventory several layers
deep, and by the time a creative reaches a reader the site owner often cannot say
who wrote the script inside it. That is the mechanism behind redirect chains,
fake update prompts, and close buttons that open two more tabs.

The clutter is a symptom. Inkfold treats the cause: a smaller shelf, stocked only
with work that is genuinely cleared for redistribution.

## What is on the shelf

| Work | Creator | Licence | Source |
|---|---|---|---|
| Pepper & Carrot | David Revoy | CC BY 4.0 | [peppercarrot.com](https://www.peppercarrot.com/) |
| Hokusai Manga | Katsushika Hokusai | Public domain (d. 1849) | [Internet Archive / Smithsonian](https://archive.org/details/hokusaimangav5katsa) |

Pepper & Carrot is pulled live from the author's own `episodes.json`, so new
episodes appear without a redeploy and his server still sees our readers'
traffic. Hokusai volumes are served through the Internet Archive's IIIF endpoint.

Nothing enters `lib/catalog.ts` without a `license` and a `source` that resolve
to a real URL a reader can open and check.

## The no-clutter claim is enforced, not asserted

`next.config.mjs` sets a Content-Security-Policy that permits images from exactly
two origins — `peppercarrot.com` and `iiif.archive.org` — and blocks all
third-party script, frame and object sources. If someone later tries to drop an
ad tag in, the browser refuses it. `frame-src` and `object-src` are `none`.

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · TypeScript. No component
library, no analytics, no cookies.

## Running it

```bash
npm install
npm run dev
```

## Reader

- Strip mode (continuous vertical) and page mode
- `f` switches mode, `h` hides the toolbar, `←` `→` turn pages
- Reading position is kept in `localStorage`; nothing leaves the device

## Licensing

The Inkfold source code is MIT. The artwork is not ours: it belongs to its
creators and is shown under the licence named on each title page. Pepper &
Carrot by David Revoy is used under CC BY 4.0.

If you hold rights to something here and want it gone, say so and it comes down
the same day.
