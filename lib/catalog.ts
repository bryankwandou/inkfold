// Inkfold catalog layer.
//
import { getOriginal } from '@/lib/studio/library';

// Rule of the house: nothing enters this file without a license we can point at.
// Every Series carries a `license` and a `source` that resolve to a real URL a
// reader can open and check for themselves. If a work cannot satisfy that, it
// does not ship.

export type License = {
  id: string;
  name: string;
  short: string;
  url: string;
  commercial: boolean;
};

export const LICENSES: Record<string, License> = {
  'cc-by-4.0': {
    id: 'cc-by-4.0',
    name: 'Creative Commons Attribution 4.0 International',
    short: 'CC BY 4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
    commercial: true,
  },
  'public-domain': {
    id: 'public-domain',
    name: 'Public domain — copyright expired',
    short: 'Public domain',
    url: 'https://en.wikipedia.org/wiki/Public_domain',
    commercial: true,
  },
  'cc-by-sa-4.0': {
    id: 'cc-by-sa-4.0',
    name: 'Creative Commons Attribution-ShareAlike 4.0 International',
    short: 'CC BY-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    commercial: true,
  },
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  pageCount: number;
  cover: string;
  pages: string[];
};

export type Series = {
  slug: string;
  title: string;
  author: string;
  authorNote: string;
  year: string;
  origin: string;
  kind: 'webcomic' | 'woodblock' | 'original';
  license: License;
  sourceName: string;
  sourceUrl: string;
  synopsis: string;
  tags: string[];
  languages?: string[];
  cover: string;
  chapters: Chapter[];
};

const PC = 'https://peppercarrot.com/0_sources';
const pad = (n: number) => String(n).padStart(2, '0');

/** Turn "ep24_The-Unity-Tree" into { num: 24, title: "The Unity Tree" }. */
function parseEpisode(dir: string): { num: number; title: string } {
  const m = /^ep(\d+)_(.*)$/.exec(dir);
  if (!m) return { num: 0, title: dir };
  return { num: Number(m[1]), title: m[2].replace(/-/g, ' ') };
}

type PcEpisode = {
  name: string;
  total_pages: number;
  translated_languages: string[];
};

/**
 * Pepper&Carrot by David Revoy — CC BY 4.0, explicitly cleared for commercial
 * redistribution. Fetched live so new episodes appear without a redeploy.
 */
export async function getPepperCarrot(lang = 'en'): Promise<Series> {
  const res = await fetch(`${PC}/episodes.json`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Pepper&Carrot index failed: ${res.status}`);
  const episodes: PcEpisode[] = await res.json();

  const chapters: Chapter[] = episodes
    .filter((e) => e.total_pages > 0)
    .map((e) => {
      const { num, title } = parseEpisode(e.name);
      const stem = (suffix: string) =>
        `${PC}/${e.name}/low-res/${
          e.translated_languages.includes(lang) ? lang : 'en'
        }_Pepper-and-Carrot_by-David-Revoy_E${pad(num)}${suffix}.jpg`;

      return {
        id: e.name,
        number: num,
        title,
        pageCount: e.total_pages,
        cover: stem(''),
        pages: Array.from({ length: e.total_pages }, (_, i) =>
          stem(`P${pad(i + 1)}`),
        ),
      };
    })
    .sort((a, b) => a.number - b.number);

  const langs = new Set<string>();
  episodes.forEach((e) => e.translated_languages.forEach((l) => langs.add(l)));

  return {
    slug: 'pepper-and-carrot',
    title: 'Pepper & Carrot',
    author: 'David Revoy',
    authorNote:
      'Drawn in Krita and funded by readers directly, with every source file published alongside the finished page.',
    year: '2014 — ongoing',
    origin: 'France',
    kind: 'webcomic',
    license: LICENSES['cc-by-4.0'],
    sourceName: 'peppercarrot.com',
    sourceUrl: 'https://www.peppercarrot.com/',
    synopsis:
      'Pepper is a young witch raised by three chaotic aunts in the forest of Squirrel’s End. Her cat Carrot is the only creature who takes her experiments seriously, which is unfortunate, because most of them end in smoke. A warm fantasy serial about failing at magic in public and trying again anyway.',
    tags: ['Fantasy', 'All ages', 'Serial', 'Full colour'],
    languages: [...langs].sort(),
    cover: chapters[chapters.length - 1]?.cover ?? '',
    chapters,
  };
}

/**
 * Public-domain woodblock volumes held by the Smithsonian and served through
 * the Internet Archive's IIIF endpoint. Hokusai died in 1849; these are long
 * out of copyright in every jurisdiction we serve.
 */
type ArchiveVolume = { id: string; label: string; pages: number };

const HOKUSAI_VOLUMES: ArchiveVolume[] = [
  { id: 'denshinkaishuhov1katsa', label: 'Volume 1', pages: 30 },
  { id: 'denshinkaishuhov2kats', label: 'Volume 2', pages: 34 },
  { id: 'denshinkaishuhov3katsa', label: 'Volume 3', pages: 33 },
  { id: 'denshinkaishuhov8katsa', label: 'Volume 8', pages: 33 },
  { id: 'denshinkaishuhov13kats', label: 'Volume 13', pages: 32 },
  { id: 'denshinkaishuhov14katsa', label: 'Volume 14', pages: 32 },
  { id: 'hokusaimangav5katsa', label: 'Volume 5', pages: 33 },
];

const iiif = (id: string, page: number, width = 1200) =>
  `https://iiif.archive.org/iiif/${id}$${page}/full/${width},/0/default.jpg`;

export function getHokusaiManga(): Series {
  const chapters: Chapter[] = HOKUSAI_VOLUMES.map((v, idx) => ({
    id: v.id,
    number: idx + 1,
    title: v.label,
    pageCount: v.pages,
    cover: iiif(v.id, 1, 700),
    // Page 0 is the archive's own scan wrapper, so we start the reader at 1.
    pages: Array.from({ length: v.pages - 1 }, (_, i) => iiif(v.id, i + 1)),
  }));

  return {
    slug: 'hokusai-manga',
    title: 'Hokusai Manga',
    author: 'Katsushika Hokusai',
    authorNote:
      'The sketchbooks that put the word “manga” into print, published from 1814 and still being copied by working artists two centuries on.',
    year: '1814 — 1878',
    origin: 'Japan',
    kind: 'woodblock',
    license: LICENSES['public-domain'],
    sourceName: 'Internet Archive / Smithsonian Libraries',
    sourceUrl: 'https://archive.org/details/hokusaimangav5katsa',
    synopsis:
      'Fifteen volumes of woodblock sketches with no plot and no hero: wrestlers mid-throw, blind men crossing a bridge, ghosts, carpenters, waves, a page of nothing but faces caught laughing. Hokusai drew whatever moved and let the arrangement carry the meaning.',
    tags: ['Woodblock', 'Historical', 'Art reference', 'Public domain'],
    cover: iiif('denshinkaishuhov1katsa', 1, 700),
    chapters,
  };
}

/**
 * Inkfold originals. Written for this shelf and drawn by lib/studio/paint.ts —
 * every panel is generated from a scene description at request time, so there
 * is no sourced artwork anywhere in it. We hold the copyright and we release it
 * under the same terms we ask of submissions.
 */
function originalChapters(slug: string): Chapter[] {
  const art = (chapter: string, page: number) => `/page-art/${slug}/${chapter}/${page}.svg`;
  const source = getOriginal(slug);
  if (!source) throw new Error(`No original registered for ${slug}`);

  return source.chapters.map((c) => ({
    id: c.id,
    number: c.number,
    title: c.title,
    pageCount: c.pages.length,
    cover: art(c.id, 1),
    pages: c.pages.map((_, i) => art(c.id, i + 1)),
  }));
}

export function getNineTenths(): Series {
  const chapters = originalChapters('nine-tenths');

  return {
    slug: 'nine-tenths',
    title: 'Nine Tenths',
    author: 'Inkfold Studio',
    authorNote:
      'Scripted as prose, then composed panel by panel in code. The figures are silhouettes because a machine drawing polygons should play to that instead of faking a hand it does not have.',
    year: '2026',
    origin: 'Original',
    kind: 'original',
    license: LICENSES['cc-by-sa-4.0'],
    sourceName: 'github.com/bryankwandou/inkfold',
    sourceUrl: 'https://github.com/bryankwandou/inkfold/blob/main/content/nine-tenths.ts',
    synopsis:
      'Past Ceres, a hull adrift four hundred days belongs to whoever tows it home. Captain Mara Okonkwo tags the Auroria expecting scrap and finds a woman in cold storage, thirty years of her work on nine hundred drives, and a company man with a filing window. The law is not wrong. That turns out to be the problem.',
    tags: ['Science fiction', 'Drama', 'Mature themes', 'Drawn in code'],
    cover: '/page-art/nine-tenths/cover/1.svg',
    chapters,
  };
}

/**
 * Second original. Same production line as Nine Tenths — prose script, layer
 * stacks, seeded renderer — pointed at a city instead of a wreck, which is what
 * the terrestrial half of the layer vocabulary was built for.
 */
export function getPaperStreets(): Series {
  return {
    slug: 'paper-streets',
    title: 'Paper Streets',
    author: 'Inkfold Studio',
    authorNote:
      'Built out of the same renderer as Nine Tenths with a street-level vocabulary added: skylines, rain, interiors, and a map layer that draws a plausible grid from a seed.',
    year: '2026',
    origin: 'Original',
    kind: 'original',
    license: LICENSES['cc-by-sa-4.0'],
    sourceName: 'github.com/bryankwandou/inkfold',
    sourceUrl: 'https://github.com/bryankwandou/inkfold/blob/main/content/paper-streets.ts',
    synopsis:
      'Surveyors have always planted streets that do not exist, a short invented row that proves who copied whose sheet. Kestrel Row went onto the city plate in 1961 and stayed. Nadia Reyes, a corrections clerk with a queue of two hundred and six, works out that somebody has been paying its water bill since 1994 — and that eleven addresses with no ground under them have been sold nineteen times.',
    tags: ['Crime', 'Drama', 'Mature themes', 'Drawn in code'],
    cover: '/page-art/paper-streets/cover/1.svg',
    chapters: originalChapters('paper-streets'),
  };
}

/**
 * Third original. The layer vocabulary grew a studio wing for this one —
 * booths, waveforms, tape reels, a stage — because the story lives around a
 * microphone and none of the existing props could stand in for one.
 */
export function getSecondVoice(): Series {
  return {
    slug: 'second-voice',
    title: 'Second Voice',
    author: 'Inkfold Studio',
    authorNote:
      'Drawn with the same renderer as the other two originals, extended with the props a recording studio needs: acoustic foam, a glass panel, reels that turn a little further in each panel.',
    year: '2026',
    origin: 'Original',
    kind: 'original',
    license: LICENSES['cc-by-sa-4.0'],
    sourceName: 'github.com/bryankwandou/inkfold',
    sourceUrl: 'https://github.com/bryankwandou/inkfold/blob/main/content/second-voice.ts',
    synopsis:
      'Sari Halim has dubbed other people’s films for nineteen years. She signs a one-page consent form in a doorway so a session fee will clear on Friday, and eleven months later hears her own breath in a bank advertisement she never recorded. Her signature will probably hold up. The question nobody in the chain thought to ask is whether the studio ever owned what it sold — and the answer is in four hundred and six paper contracts in a storage unit.',
    tags: ['Drama', 'Contemporary', 'Mature themes', 'Drawn in code'],
    cover: '/page-art/second-voice/cover/1.svg',
    chapters: originalChapters('second-voice'),
  };
}

export async function getCatalog(lang = 'en'): Promise<Series[]> {
  const [pepper] = await Promise.all([getPepperCarrot(lang)]);
  return [
    getNineTenths(),
    getPaperStreets(),
    getSecondVoice(),
    pepper,
    getHokusaiManga(),
  ];
}

export async function getSeries(
  slug: string,
  lang = 'en',
): Promise<Series | undefined> {
  const all = await getCatalog(lang);
  return all.find((s) => s.slug === slug);
}
