// "Paper Streets" — an Inkfold original.
//
// Second title drawn entirely by lib/studio/paint.ts. Same deal as Nine Tenths:
// scripted here, composed from the layer vocabulary, released CC BY-SA 4.0.
//
// Mapmakers have always planted streets that do not exist — a short row of
// houses invented to catch anyone who copies the sheet instead of surveying it.
// The trap only works while nobody builds on it. This is about what happens
// when somebody does.

import type { Layer, PageSpec, Panel, Pose } from '../lib/studio/paint';
import type { OriginalChapter } from './nine-tenths';

type Body = Omit<Panel, 'x' | 'y' | 'w' | 'h'>;
type Row = { h: number; cols: number[] };

function grid(rows: Row[], bodies: Body[]): Panel[] {
  const out: Panel[] = [];
  let y = 0;
  let i = 0;
  for (const r of rows) {
    const total = r.cols.reduce((a, b) => a + b, 0);
    let x = 0;
    for (const c of r.cols) {
      const w = c / total;
      if (bodies[i]) out.push({ ...bodies[i], x, y, w, h: r.h });
      x += w;
      i++;
    }
    y += r.h;
  }
  return out;
}

/* Layer shorthand — keeps the script readable as script. */
const F = (
  x: number,
  scale = 1,
  pose: Pose = 'stand',
  fill?: 'ink' | 'accent' | 'paper',
  flip?: boolean,
): Layer => ({ t: 'figure', x, scale, pose, fill, flip });
const CITY = (y = 0.68, density = 1, seed = 1, lit = true): Layer =>
  ({ t: 'city', y, density, seed, lit });
const RAIN = (n = 120, slant = 0.22, seed = 1): Layer => ({ t: 'rain', n, slant, seed });
const ROOM = (window = true, y = 0.74): Layer => ({ t: 'room', window, y });
const DOOR = (x = 0.5, open = false): Layer => ({ t: 'door', x, open });
const STAIR = (n = 9, flip = false): Layer => ({ t: 'stairs', n, flip });
const CROWD = (n = 14, y = 0.86, seed = 1): Layer => ({ t: 'crowd', n, y, seed });
const DESK = (y = 0.7, clutter = 6, seed = 1): Layer => ({ t: 'desk', y, clutter, seed });
const ROAD = (vy = 0.42, lanes = 5): Layer => ({ t: 'road', vy, lanes });
const SIGN = (x: number, y: number, text: string): Layer => ({ t: 'sign', x, y, text });
const TREES = (y = 0.78, n = 10, seed = 1): Layer => ({ t: 'trees', y, n, seed });
const SCREEN = (x = 0.5, y = 0.44, w = 0.46, lines = 7, seed = 1): Layer =>
  ({ t: 'screen', x, y, w, lines, seed });
const MAP = (seed = 1, mark?: [number, number]): Layer => ({ t: 'map', seed, mark });
const BLINDS = (n = 12): Layer => ({ t: 'blinds', n });
const SHELF = (seed = 1): Layer => ({ t: 'shelves', seed });
const WASH = (from = 0, to = 0.5, color?: 'accent' | 'glow' | 'ink'): Layer =>
  ({ t: 'wash', from, to, color });
const DUST = (n = 40, seed = 1): Layer => ({ t: 'dust', n, seed });
const BEAM = (x = 0.5, w = 0.18): Layer => ({ t: 'beam', x, w });
const CORR = (vy = 0.48): Layer => ({ t: 'corridor', vy });
const DISC = (cx: number, cy: number, r: number, fill?: 'far' | 'accent' | 'glow' | 'ink'): Layer =>
  ({ t: 'disc', cx, cy, r, fill });

const say = (x: number, y: number, text: string, tail?: number, w?: number) =>
  ({ x, y, text, tail, w });
const think = (x: number, y: number, text: string, w?: number) =>
  ({ x, y, text, w, kind: 'thought' as const });
const phone = (x: number, y: number, text: string, w?: number) =>
  ({ x, y, text, w, kind: 'radio' as const });

/* Page skeletons. */
const R3: Row[] = [{ h: 0.4, cols: [1] }, { h: 0.3, cols: [1, 1] }, { h: 0.3, cols: [1] }];
const R4: Row[] = [{ h: 0.28, cols: [1, 1] }, { h: 0.44, cols: [1] }, { h: 0.28, cols: [1, 1] }];
const RT: Row[] = [{ h: 0.34, cols: [1] }, { h: 0.33, cols: [1] }, { h: 0.33, cols: [1] }];
const RS: Row[] = [{ h: 0.62, cols: [1] }, { h: 0.38, cols: [1, 1, 1] }];
const RW: Row[] = [{ h: 0.3, cols: [1, 1, 1] }, { h: 0.42, cols: [1] }, { h: 0.28, cols: [2, 1] }];

/* ═══════════════════ CHAPTER 1 — The Correction Queue ═══════════════════ */

const ch1: PageSpec[] = [
  {
    pal: 'slate',
    seed: 21,
    panels: grid(RT, [
      {
        layers: [CITY(0.72, 1, 5), RAIN(150, 0.26, 8), WASH(0, 0.45, 'ink')],
        caption:
          'Every street in this city exists twice. Once in asphalt, and once in a file at the Bureau of Survey and Record, where a clerk decides which of the two is wrong.',
      },
      {
        layers: [ROOM(true, 0.76), BLINDS(14), DESK(0.72, 7, 3), F(0.32, 1.0, 'seated')],
        balloons: [
          say(0.62, 0.24, 'Reyes. Queue was two hundred on Friday. It is two hundred and six.', 0.4, 0.6),
        ],
      },
      {
        layers: [DESK(0.66, 5, 9), SCREEN(0.5, 0.38, 0.5, 8, 2), F(0.2, 0.9, 'seated')],
        balloons: [say(0.66, 0.72, 'Then somebody keeps moving the streets.', 0.5, 0.5)],
      },
    ]),
  },
  {
    pal: 'slate',
    seed: 22,
    panels: grid(R4, [
      {
        layers: [SCREEN(0.5, 0.48, 0.72, 9, 4)],
        caption: 'Ticket 41-772. Opened eleven years ago. Reassigned nine times.',
      },
      {
        layers: [MAP(11), WASH(0, 0.3, 'ink')],
        balloons: [think(0.5, 0.22, 'Kestrel Row. Between Aldis and the freight yard.', 0.7)],
      },
      {
        layers: [ROOM(true, 0.78), BLINDS(16), F(0.28, 1.1, 'lean'), F(0.68, 1.05, 'stand', undefined, true)],
        balloons: [
          say(0.3, 0.18, 'Close it as duplicate. That is what the last four did.', 0.4, 0.52),
          say(0.72, 0.44, 'The last four did not read it.', 0.5, 0.42),
        ],
        caption: 'Marta Oyelaran had run the correction desk for nineteen years and had never once been curious in front of a supervisor.',
        captionAt: 'bottom',
      },
      {
        layers: [DESK(0.6, 4, 6), SCREEN(0.5, 0.36, 0.44, 6, 7)],
        balloons: [say(0.5, 0.76, 'Read it, then.', 0.5, 0.6)],
      },
      {
        layers: [MAP(13, [0.42, 0.5])],
        caption: 'So she read it.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 23,
    panels: grid(RT, [
      {
        layers: [SHELF(3), WASH(0, 0.4, 'ink'), F(0.36, 1.05, 'reach')],
        caption:
          'The complaint was two sentences long. A man wanted the city to fix his address. The city had been billing him for water on a street the city said did not exist.',
      },
      {
        layers: [SHELF(8), F(0.5, 1.0, 'carry'), DUST(50, 4)],
        balloons: [say(0.62, 0.24, 'Sixty-one atlas is in the cage. Nobody signs it out.', 0.45, 0.58)],
      },
      {
        layers: [DESK(0.64, 3, 12), MAP(21, [0.44, 0.46]), BEAM(0.4, 0.3)],
        balloons: [say(0.32, 0.78, 'I will bring it back by six.', 0.4, 0.46)],
        caption: 'She did not bring it back by six.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'dusk',
    seed: 24,
    panels: grid(RS, [
      {
        layers: [CITY(0.66, 1.1, 15), RAIN(90, 0.3, 6), F(0.24, 1.3, 'umbrella'), WASH(0, 0.5, 'ink')],
        caption:
          'Nadia Reyes was thirty-four and had spent nine of those years making the record agree with the ground. She had never considered that the record might be winning.',
      },
      { layers: [MAP(31, [0.5, 0.5])], },
      { layers: [SCREEN(0.5, 0.5, 0.8, 5, 11)] },
      {
        layers: [ROOM(false, 0.8), DISC(0.7, 0.24, 0.12, 'glow'), F(0.42, 1.15, 'stand')],
        balloons: [think(0.5, 0.24, 'It is a street. How hard can a street be.', 0.8)],
      },
    ]),
  },
];

/* ═══════════════════ CHAPTER 2 — Kestrel Row ═══════════════════ */

const ch2: PageSpec[] = [
  {
    pal: 'bone',
    seed: 31,
    panels: grid(RT, [
      {
        layers: [MAP(41, [0.46, 0.48]), WASH(0, 0.22, 'ink')],
        caption:
          'The 1961 atlas was drawn by a firm called Hallory & Sons, who surveyed the east flats on foot and inked the sheets by hand.',
      },
      {
        layers: [DESK(0.7, 5, 14), F(0.28, 1.0, 'seated'), BEAM(0.55, 0.24)],
        balloons: [think(0.6, 0.26, 'Kestrel Row. Two hundred feet. Eleven lots. No houses drawn on any of them.', 0.66)],
      },
      {
        layers: [MAP(43), WASH(0, 0.35, 'accent')],
        caption:
          'Eleven lots and no buildings. On a sheet where every other block was thick with them.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 32,
    panels: grid(R4, [
      { layers: [SHELF(19), DUST(60, 3)] },
      { layers: [MAP(45, [0.3, 0.62])] },
      {
        layers: [DESK(0.66, 8, 16), SCREEN(0.62, 0.36, 0.42, 8, 5), F(0.2, 0.95, 'seated')],
        caption:
          'The 1958 sheet did not have it. The 1964 sheet did. The 1972 sheet had it with a note in the margin that had been scratched out and initialled.',
        balloons: [say(0.42, 0.82, 'Marta. What is a trap street.', 0.4, 0.5)],
      },
      {
        layers: [ROOM(true, 0.76), BLINDS(12), F(0.5, 1.1, 'stand')],
        balloons: [say(0.5, 0.24, 'Where did you hear that phrase.', 0.5, 0.62)],
      },
      { layers: [MAP(47, [0.46, 0.48]), WASH(0.1, 0.5, 'accent')] },
    ]),
  },
  {
    pal: 'slate',
    seed: 33,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.74), BLINDS(15), F(0.3, 1.15, 'stand'), F(0.7, 1.1, 'lean', undefined, true)],
        balloons: [
          say(0.34, 0.16, 'A street you invent so you can prove somebody copied you.', 0.4, 0.56),
          say(0.7, 0.42, 'It only works if nobody ever goes and looks.', 0.5, 0.46),
        ],
      },
      {
        layers: [DESK(0.62, 4, 18), SCREEN(0.5, 0.4, 0.56, 7, 9)],
        caption:
          'Hallory & Sons put the row in to catch a rival firm. The rival copied the sheet, the case settled quietly, and the row stayed on the plate because pulling it would have cost more than leaving it.',
      },
      {
        layers: [MAP(51, [0.46, 0.48]), BEAM(0.46, 0.2)],
        balloons: [say(0.5, 0.78, 'The city bought the plates in 1968.', 0.5, 0.6)],
        caption: 'And every sheet the city drew afterward was drawn from those plates.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'dusk',
    seed: 34,
    panels: grid(RS, [
      {
        layers: [CITY(0.7, 1, 22), RAIN(70, 0.2, 12), WASH(0, 0.5, 'ink'), F(0.7, 1.2, 'stand', undefined, true)],
        caption:
          'Sixty-five years of maps, each one honest about where it came from, all of them carrying the same lie forward because nobody had ever been paid to check.',
      },
      { layers: [SCREEN(0.5, 0.5, 0.78, 6, 21)] },
      { layers: [MAP(53, [0.46, 0.48])] },
      {
        layers: [ROOM(false, 0.82), DISC(0.28, 0.22, 0.1, 'glow'), F(0.6, 1.05, 'seated')],
        balloons: [think(0.44, 0.26, 'Someone is paying a water bill on it.', 0.72)],
      },
    ]),
  },
];

/* ═══════════════════ CHAPTER 3 — Field Check ═══════════════════ */

const ch3: PageSpec[] = [
  {
    pal: 'moss',
    seed: 41,
    panels: grid(RT, [
      {
        layers: [ROAD(0.44, 6), TREES(0.5, 8, 4), WASH(0, 0.3, 'ink')],
        caption:
          'The east flats on a Tuesday morning: freight yard on one side, a terrace of shuttered workshops on the other, and between them a gap the width of a truck.',
      },
      {
        layers: [CITY(0.62, 1.15, 25, false), F(0.34, 1.25, 'walk'), DUST(30, 6)],
        balloons: [think(0.66, 0.24, 'Aldis Street ends here. Two hundred feet of nothing, then the yard fence.', 0.62)],
      },
      {
        layers: [CITY(0.58, 1.3, 27, false), BEAM(0.5, 0.26), F(0.48, 1.35, 'stand')],
        caption: 'Except the nothing had a kerb. A poured kerb, with a drain in it.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'moss',
    seed: 42,
    panels: grid(R4, [
      {
        layers: [ROAD(0.5, 4), DUST(20, 8)],
        caption: 'Fresh asphalt. Maybe four years old. Laid over something older.',
      },
      { layers: [CITY(0.6, 1.5, 29, false), SIGN(0.5, 0.42, 'Kestrel Row')] },
      {
        layers: [CITY(0.55, 1.4, 31, false), DOOR(0.62, false), F(0.3, 1.3, 'stand'), BEAM(0.62, 0.18)],
        balloons: [think(0.32, 0.2, 'The city has never paved this. There is no work order. There is no street.', 0.62)],
        caption:
          'A gate, a camera on a bracket, a mailbox with eleven slots and no names on any of them.',
        captionAt: 'bottom',
      },
      { layers: [SCREEN(0.5, 0.46, 0.5, 4, 13), WASH(0, 0.3, 'ink')] },
      {
        layers: [CITY(0.6, 1.3, 33, false), F(0.5, 1.2, 'crouch')],
        balloons: [say(0.5, 0.2, 'Help you?', 0.5, 0.42)],
      },
    ]),
  },
  {
    pal: 'slate',
    seed: 43,
    panels: grid(RT, [
      {
        layers: [CITY(0.56, 1.4, 35, false), F(0.28, 1.3, 'stand'), F(0.72, 1.4, 'stand', undefined, true), WASH(0, 0.35, 'ink')],
        balloons: [
          say(0.3, 0.16, 'Bureau of Survey. I am closing an old correction ticket.', 0.4, 0.56),
          say(0.72, 0.44, 'Nothing here to correct. Private access road.', 0.5, 0.48),
        ],
      },
      {
        layers: [CITY(0.5, 1.6, 37, false), DOOR(0.5, false), F(0.34, 1.25, 'point')],
        balloons: [
          say(0.62, 0.22, 'Private access roads have a parcel number. What is yours?', 0.42, 0.66),
        ],
      },
      {
        layers: [ROAD(0.48, 5), F(0.66, 1.15, 'walk', undefined, true), DUST(24, 11)],
        caption:
          'He did not have one, and he did not pretend to look it up. He told her the office would call her office, which is a sentence that has never once been about helping.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'dusk',
    seed: 44,
    panels: grid(RS, [
      {
        layers: [CITY(0.68, 1, 39), RAIN(100, 0.24, 14), WASH(0, 0.5, 'ink'), F(0.3, 1.25, 'umbrella')],
        caption:
          'She walked back to Aldis and stood at the corner for a while, doing the arithmetic that anyone in her job eventually does: how much of the city she had ever actually seen, against how much of it she had only ever read.',
      },
      { layers: [SCREEN(0.5, 0.5, 0.76, 5, 23)] },
      { layers: [MAP(57, [0.44, 0.5])] },
      {
        layers: [ROOM(true, 0.78), BLINDS(14), F(0.5, 1.1, 'seated')],
        balloons: [phone(0.5, 0.24, 'YOUR SITE VISIT HAS BEEN LOGGED AS OUT OF SCOPE. — M. OYELARAN', 0.72)],
      },
    ]),
  },
];

/* ═══════════════════ CHAPTER 4 — The Bill ═══════════════════ */

const ch4: PageSpec[] = [
  {
    pal: 'slate',
    seed: 51,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.76), BLINDS(18), DESK(0.74, 9, 15), F(0.24, 1.0, 'seated'), WASH(0, 0.3, 'ink')],
        caption:
          'Utilities keep better records than surveyors do, because utilities get paid and surveyors get filed.',
      },
      {
        layers: [SCREEN(0.5, 0.44, 0.66, 9, 25), DESK(0.86, 2, 17)],
        balloons: [think(0.5, 0.78, 'Water, since 1994. Metered. Somebody is drinking it.', 0.66)],
      },
      {
        layers: [SCREEN(0.5, 0.42, 0.7, 10, 27), WASH(0.05, 0.4, 'accent')],
        caption:
          'Eleven accounts. Eleven lots. Every one of them paid on the first working day of the month, from the same bank, for thirty-one years.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 52,
    panels: grid(R4, [
      { layers: [SHELF(23), DUST(45, 9)] },
      { layers: [MAP(61, [0.46, 0.48])] },
      {
        layers: [DESK(0.68, 10, 19), SCREEN(0.58, 0.36, 0.46, 9, 29), F(0.18, 0.95, 'seated'), BEAM(0.4, 0.2)],
        caption:
          'A street that does not exist cannot be inspected. Cannot be zoned. Cannot be valued by anyone who has to visit it. It can only be described, and a description is worth exactly as much as the paper under it.',
      },
      {
        layers: [ROOM(true, 0.74), F(0.34, 1.1, 'stand'), F(0.68, 1.05, 'lean', undefined, true)],
        balloons: [say(0.34, 0.18, 'Eleven addresses have been sold. Some of them twice.', 0.4, 0.56)],
      },
      {
        layers: [SCREEN(0.5, 0.5, 0.62, 6, 31), WASH(0, 0.35, 'accent')],
        balloons: [say(0.5, 0.2, 'Sold to whom.', 0.5, 0.48)],
      },
    ]),
  },
  {
    pal: 'slate',
    seed: 53,
    panels: grid(RW, [
      { layers: [SCREEN(0.5, 0.5, 0.8, 4, 33)] },
      { layers: [MAP(63, [0.5, 0.44])] },
      { layers: [ROOM(false, 0.8), F(0.5, 1.0, 'stand')] },
      {
        layers: [ROOM(true, 0.72), BLINDS(16), DESK(0.8, 6, 21), F(0.3, 1.15, 'seated'), F(0.72, 1.1, 'stand', undefined, true)],
        balloons: [
          say(0.66, 0.2, 'Companies that lasted nine months each. Registered, bought, sold, dissolved.', 0.5, 0.66),
          say(0.32, 0.5, 'That is not property. That is a laundry with a postcode.', 0.4, 0.52),
        ],
      },
      {
        layers: [DESK(0.6, 5, 23), SCREEN(0.5, 0.36, 0.4, 6, 35)],
        caption:
          'Marta stood behind her for a long minute and did not say the thing she had said to every clerk before this one.',
      },
      {
        layers: [ROOM(false, 0.78), F(0.44, 1.2, 'stand'), WASH(0, 0.4, 'ink')],
        balloons: [say(0.5, 0.26, 'Do not put this in the ticket.', 0.5, 0.62)],
      },
    ]),
  },
  {
    pal: 'dusk',
    seed: 54,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.76), BLINDS(13), F(0.32, 1.15, 'stand'), F(0.66, 1.1, 'stand', undefined, true)],
        balloons: [
          say(0.66, 0.2, 'Why not.', 0.5, 0.34),
          say(0.32, 0.46, 'Because the ticket system is not yours. It is his.', 0.42, 0.52),
        ],
      },
      {
        layers: [CORR(0.46), F(0.5, 1.05, 'walk'), WASH(0, 0.4, 'ink')],
        caption:
          'The Bureau signed off its own maps. There was no outside auditor, because a map is not a financial instrument, and everybody who could have argued otherwise worked in the building.',
      },
      {
        layers: [CITY(0.66, 1, 41), RAIN(120, 0.28, 16), F(0.72, 1.2, 'umbrella', undefined, true)],
        balloons: [think(0.36, 0.24, 'His.', 0.4)],
      },
    ]),
  },
];

/* ═══════════════════ CHAPTER 5 — Whitmore ═══════════════════ */

const ch5: PageSpec[] = [
  {
    pal: 'slate',
    seed: 61,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.72), BLINDS(20), DESK(0.8, 3, 25), F(0.68, 1.2, 'seated', undefined, true), WASH(0, 0.3, 'ink')],
        caption:
          'Deputy Registrar Colm Whitmore had signed the city sheets for twenty-two years. His office had the good window and a framed print of the 1961 plate.',
      },
      {
        layers: [ROOM(true, 0.74), F(0.3, 1.15, 'stand'), F(0.7, 1.15, 'seated', undefined, true)],
        balloons: [
          say(0.66, 0.18, 'Ticket 41-772. You have been busy with it.', 0.5, 0.56),
          say(0.3, 0.5, 'It has been open eleven years.', 0.4, 0.44),
        ],
      },
      {
        layers: [DESK(0.6, 4, 27), MAP(67, [0.46, 0.48]), BEAM(0.5, 0.22)],
        balloons: [say(0.5, 0.8, 'Some tickets are open because closing them costs more than the complaint is worth.', 0.5, 0.72)],
      },
    ]),
  },
  {
    pal: 'slate',
    seed: 62,
    panels: grid(R4, [
      { layers: [BLINDS(22), WASH(0, 0.4, 'ink')] },
      { layers: [SCREEN(0.5, 0.48, 0.6, 7, 37)] },
      {
        layers: [ROOM(true, 0.74), BLINDS(18), F(0.28, 1.2, 'stand'), F(0.74, 1.25, 'stand', undefined, true)],
        balloons: [
          say(0.3, 0.16, 'It is worth eleven addresses that have never been built on.', 0.4, 0.56),
          say(0.72, 0.44, 'Then nobody has been harmed, and you have a queue of two hundred and six.', 0.5, 0.54),
        ],
      },
      {
        layers: [DESK(0.62, 6, 29), F(0.3, 1.0, 'seated')],
        caption: 'He was not angry, which was the part she thought about afterward.',
      },
      {
        layers: [ROOM(false, 0.8), F(0.5, 1.3, 'stand'), WASH(0.1, 0.5, 'accent')],
        balloons: [say(0.5, 0.24, 'Who signed the 1994 connection order?', 0.5, 0.7)],
      },
    ]),
  },
  {
    pal: 'dusk',
    seed: 63,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.72), BLINDS(24), F(0.66, 1.3, 'stand', undefined, true), BEAM(0.3, 0.24)],
        caption:
          'He did not look it up either. That was two men in one week who had declined to check something a clerk could have checked in forty seconds.',
      },
      {
        layers: [ROOM(true, 0.76), F(0.34, 1.15, 'stand'), F(0.7, 1.2, 'point', undefined, true)],
        balloons: [
          say(0.68, 0.2, 'Go home, Reyes. Take Friday. You have earned it.', 0.5, 0.58),
        ],
      },
      {
        layers: [CORR(0.5), F(0.5, 1.1, 'walk'), WASH(0, 0.45, 'ink')],
        balloons: [think(0.5, 0.22, 'I did not ask for Friday.', 0.5)],
        caption: 'Her building pass stopped working on Thursday night.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'neon',
    seed: 64,
    panels: grid(RS, [
      {
        layers: [CITY(0.64, 1, 43), RAIN(140, 0.3, 18), WASH(0, 0.55, 'ink'), F(0.26, 1.3, 'stand'), SIGN(0.68, 0.24, 'Open Late')],
        caption:
          'A card that stops working is not an accusation. There is nothing to appeal. You simply stand outside a door you used to walk through, and the building carries on being right about you.',
      },
      { layers: [SCREEN(0.5, 0.5, 0.72, 5, 39)] },
      { layers: [MAP(71, [0.46, 0.48])] },
      {
        layers: [CITY(0.7, 1.4, 45), F(0.5, 1.2, 'stand'), BEAM(0.5, 0.2)],
        balloons: [think(0.5, 0.24, 'Everything I have is in that queue.', 0.66)],
      },
    ]),
  },
];

/* ═══════════════════ CHAPTER 6 — The Ledger ═══════════════════ */

const ch6: PageSpec[] = [
  {
    pal: 'bone',
    seed: 71,
    panels: grid(RT, [
      {
        layers: [SHELF(31), DUST(70, 12), F(0.3, 1.05, 'reach')],
        caption:
          'Land registry is public. That is the whole point of it, and it is the only thing that saved her, because a public record does not care whether your pass still works.',
      },
      {
        layers: [DESK(0.7, 12, 33), SCREEN(0.56, 0.36, 0.46, 10, 41), F(0.18, 0.95, 'seated')],
        balloons: [think(0.56, 0.76, 'Eleven lots. Thirty-one years. Nineteen transfers.', 0.6)],
      },
      {
        layers: [SCREEN(0.5, 0.44, 0.74, 11, 43), WASH(0.05, 0.4, 'accent')],
        caption:
          'Each sale priced a little above the last. Each buyer a company that had existed for less than a year. Each valuation signed by a surveyor who had never had to stand on the ground, because there was no ground to stand on.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 72,
    panels: grid(R4, [
      { layers: [MAP(73, [0.46, 0.48])] },
      { layers: [SCREEN(0.5, 0.48, 0.56, 8, 45)] },
      {
        layers: [DESK(0.66, 8, 35), SCREEN(0.5, 0.36, 0.52, 9, 47), F(0.2, 1.0, 'seated'), BEAM(0.42, 0.22)],
        caption:
          'Forty million had moved across eleven lots of nothing. Not stolen, exactly. Walked through a door that the city had built by accident in 1961 and had been holding open ever since.',
      },
      {
        layers: [SCREEN(0.5, 0.46, 0.5, 6, 49)],
        balloons: [think(0.5, 0.8, 'Whitmore countersigned four of them.', 0.62)],
      },
      {
        layers: [SHELF(37), F(0.5, 1.1, 'stand'), WASH(0, 0.4, 'ink')],
        caption: 'Four out of nineteen. Enough to be a career, not enough to be a headline.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'dusk',
    seed: 73,
    panels: grid(RW, [
      { layers: [CITY(0.66, 1.2, 47), RAIN(60, 0.2, 20)] },
      { layers: [ROOM(true, 0.78), F(0.5, 1.05, 'seated')] },
      { layers: [SCREEN(0.5, 0.5, 0.72, 5, 51)] },
      {
        layers: [ROOM(true, 0.74), BLINDS(12), F(0.3, 1.2, 'stand'), F(0.7, 1.15, 'stand', undefined, true), WASH(0, 0.3, 'ink')],
        balloons: [
          say(0.32, 0.18, 'Take it to the Bureau and Whitmore reviews it. Take it to the police and they ask the Bureau to verify the map.', 0.4, 0.62),
          say(0.72, 0.5, 'Everyone checks with the people who drew it.', 0.5, 0.44),
        ],
      },
      {
        layers: [DESK(0.6, 5, 39), F(0.34, 1.05, 'seated')],
        caption: 'Marta had come to her flat on a Saturday, which she had never done in nine years.',
      },
      {
        layers: [ROOM(false, 0.8), F(0.5, 1.2, 'stand'), BEAM(0.5, 0.24)],
        balloons: [say(0.5, 0.24, 'Then it cannot go to anybody. It has to go to everybody.', 0.5, 0.72)],
      },
    ]),
  },
  {
    pal: 'neon',
    seed: 74,
    panels: grid(RT, [
      {
        layers: [CITY(0.62, 1, 49), RAIN(130, 0.26, 22), WASH(0, 0.5, 'ink'), F(0.7, 1.25, 'stand', undefined, true)],
        caption:
          'The plates were city property, drawn under a survey contract that predated the modern statute. She read the 1968 purchase agreement four times to be sure.',
      },
      {
        layers: [DESK(0.68, 7, 41), SCREEN(0.54, 0.36, 0.48, 9, 53), F(0.2, 1.0, 'seated')],
        balloons: [think(0.56, 0.76, 'Bought outright. No restriction on publication. They never wrote one, because who would want them.', 0.62)],
      },
      {
        layers: [MAP(77, [0.46, 0.48]), WASH(0.1, 0.45, 'accent')],
        caption: 'One hundred and forty sheets. Every version, every year, side by side.',
        captionAt: 'bottom',
      },
    ]),
  },
];

/* ═══════════════════ CHAPTER 7 — The Gate ═══════════════════ */

const ch7: PageSpec[] = [
  {
    pal: 'neon',
    seed: 81,
    panels: grid(RT, [
      {
        layers: [CITY(0.6, 1.2, 51, false), RAIN(80, 0.24, 24), WASH(0, 0.55, 'ink'), F(0.28, 1.3, 'walk')],
        caption:
          'She went back at eleven at night, because a photograph of a kerb is worth more than a paragraph about a kerb, and she had run out of paragraphs.',
      },
      {
        layers: [CITY(0.55, 1.4, 53, false), DOOR(0.56, true), BEAM(0.56, 0.22), F(0.28, 1.25, 'crouch')],
        balloons: [think(0.68, 0.22, 'The gate is open.', 0.46)],
      },
      {
        layers: [ROAD(0.46, 4), CITY(0.44, 1.6, 55, false), F(0.5, 1.2, 'walk'), DUST(30, 14)],
        caption:
          'Behind it: a yard the size of the eleven lots, four containers, a portable office with a light on, and a van being loaded by people who did not look up.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'neon',
    seed: 82,
    panels: grid(R4, [
      { layers: [CITY(0.5, 1.5, 57, false), DUST(20, 16)] },
      { layers: [SCREEN(0.5, 0.46, 0.5, 5, 55)] },
      {
        layers: [CITY(0.5, 1.4, 59, false), BEAM(0.4, 0.24), F(0.24, 1.2, 'crouch'), CROWD(6, 0.8, 18), WASH(0, 0.4, 'ink')],
        caption:
          'An address that does not exist receives no inspections. No fire officer, no labour visit, no census. It is the only kind of place in a city where nobody is ever counted.',
      },
      {
        layers: [CITY(0.55, 1.3, 61, false), F(0.5, 1.15, 'stand')],
        balloons: [say(0.5, 0.2, 'Hey.', 0.5, 0.3)],
      },
      {
        layers: [ROAD(0.5, 5), F(0.4, 1.3, 'run'), DUST(26, 20), WASH(0, 0.45, 'ink')],
        sfx: { x: 0.7, y: 0.4, text: 'CLANG', size: 0.13 },
      },
    ]),
  },
  {
    pal: 'neon',
    seed: 83,
    panels: grid(RS, [
      {
        layers: [CITY(0.6, 1.3, 63), RAIN(110, 0.3, 26), F(0.34, 1.35, 'run'), WASH(0, 0.5, 'ink')],
        caption:
          'She was not chased far. Men who work at an address the city has never heard of do not want a foot pursuit down a street the city has.',
      },
      { layers: [CITY(0.7, 1.2, 65), RAIN(50, 0.24, 28)] },
      { layers: [SCREEN(0.5, 0.5, 0.7, 4, 57)] },
      {
        layers: [ROOM(false, 0.8), F(0.5, 1.1, 'slump'), DISC(0.72, 0.24, 0.1, 'glow')],
        balloons: [think(0.42, 0.26, 'Nineteen photographs.', 0.6)],
      },
    ]),
  },
  {
    pal: 'dusk',
    seed: 84,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.76), BLINDS(14), DESK(0.82, 8, 43), F(0.28, 1.05, 'seated'), BEAM(0.6, 0.22)],
        caption:
          'By four in the morning she had the atlas scanned, the registry extracts, the utility ledger, the nineteen photographs, and a plain page explaining what a trap street is.',
      },
      {
        layers: [SCREEN(0.5, 0.42, 0.7, 10, 59), WASH(0.05, 0.4, 'glow')],
        balloons: [think(0.5, 0.8, 'Once it is in four hundred places, it cannot be corrected in one.', 0.68)],
      },
      {
        layers: [MAP(81, [0.46, 0.48]), BEAM(0.46, 0.2)],
        caption: 'She circled Kestrel Row in red, the way Hallory & Sons had circled it in 1961.',
        captionAt: 'bottom',
      },
    ]),
  },
];

/* ═══════════════════ CHAPTER 8 — Filed ═══════════════════ */

const ch8: PageSpec[] = [
  {
    pal: 'moss',
    seed: 91,
    panels: grid(RT, [
      {
        layers: [CITY(0.7, 1, 67), TREES(0.74, 6, 22), WASH(0, 0.25, 'ink')],
        caption:
          'The archive went up at 06:12 on a Sunday, under the licence the plates had always been eligible for and had never once been given.',
      },
      {
        layers: [SCREEN(0.5, 0.44, 0.72, 9, 61), DESK(0.9, 2, 45)],
        balloons: [phone(0.5, 0.8, 'MIRRORED — 41 SITES. 06:40. — ARCHIVE BOT', 0.66)],
      },
      {
        layers: [CROWD(18, 0.84, 24), CITY(0.6, 1.2, 69), F(0.5, 1.15, 'stand', 'accent')],
        caption:
          'By Tuesday a hobbyist in the north had walked the whole east flats with a phone and posted a list of nine more.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'slate',
    seed: 92,
    panels: grid(R4, [
      { layers: [SCREEN(0.5, 0.48, 0.6, 8, 63)] },
      { layers: [MAP(83, [0.46, 0.48])] },
      {
        layers: [ROOM(true, 0.72), BLINDS(20), DESK(0.82, 4, 47), F(0.66, 1.25, 'slump', undefined, true), WASH(0, 0.35, 'ink')],
        caption:
          'Whitmore was not arrested. He was retired, at his own request, with the pension he had accrued and a paragraph in the internal bulletin that used the word restructuring.',
      },
      {
        layers: [CORR(0.48), F(0.4, 1.1, 'walk'), F(0.72, 1.05, 'walk', undefined, true)],
        balloons: [say(0.5, 0.2, 'Four countersignatures is not a case. It is a filing habit.', 0.5, 0.68)],
      },
      {
        layers: [ROOM(false, 0.8), F(0.5, 1.15, 'stand'), BEAM(0.5, 0.2)],
        caption: 'The yard behind the gate was cleared in a single night, before anyone official arrived.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'moss',
    seed: 93,
    panels: grid(RW, [
      { layers: [ROAD(0.46, 5), TREES(0.52, 6, 26)] },
      { layers: [CITY(0.6, 1.3, 71, false), SIGN(0.5, 0.44, 'Kestrel Row')] },
      { layers: [MAP(85, [0.46, 0.48])] },
      {
        layers: [CITY(0.56, 1.4, 73, false), F(0.32, 1.3, 'stand'), F(0.68, 1.2, 'stand', undefined, true), BEAM(0.5, 0.24)],
        balloons: [
          say(0.34, 0.18, 'They will just find another gap in another sheet.', 0.4, 0.56),
          say(0.7, 0.48, 'They will. And someone will walk that one too.', 0.5, 0.48),
        ],
      },
      {
        layers: [DESK(0.62, 6, 49), SCREEN(0.5, 0.36, 0.42, 6, 65)],
        caption:
          'The Bureau published its correction queue in full six months later. It was not an apology. It was cheaper than the alternative, which is the only reason any institution has ever opened anything.',
      },
      {
        layers: [ROOM(true, 0.76), F(0.46, 1.15, 'seated'), DISC(0.74, 0.22, 0.1, 'glow')],
        balloons: [think(0.42, 0.26, 'Two hundred and six. Public.', 0.6)],
      },
    ]),
  },
  {
    pal: 'dusk',
    seed: 94,
    panels: grid(RS, [
      {
        layers: [CITY(0.66, 1, 75), DISC(0.24, 0.2, 0.09, 'glow'), F(0.7, 1.25, 'walk', undefined, true), WASH(0, 0.45, 'ink')],
        caption:
          'A map is a promise about the ground. Kestrel Row was a lie told for a good reason, kept for a lazy one, and used in the end by people who understood the difference better than the office that drew it.',
      },
      { layers: [MAP(87, [0.46, 0.48])] },
      { layers: [CITY(0.68, 1.4, 77)] },
      { layers: [ROAD(0.44, 5), TREES(0.5, 5, 28)] },
    ]),
  },
];

export const PAPER_STREETS_CHAPTERS: OriginalChapter[] = [
  { id: 'ch1', number: 1, title: 'The Correction Queue', pages: ch1 },
  { id: 'ch2', number: 2, title: 'Kestrel Row', pages: ch2 },
  { id: 'ch3', number: 3, title: 'Field Check', pages: ch3 },
  { id: 'ch4', number: 4, title: 'The Bill', pages: ch4 },
  { id: 'ch5', number: 5, title: 'Whitmore', pages: ch5 },
  { id: 'ch6', number: 6, title: 'The Ledger', pages: ch6 },
  { id: 'ch7', number: 7, title: 'The Gate', pages: ch7 },
  { id: 'ch8', number: 8, title: 'Filed', pages: ch8 },
];

export const PAPER_STREETS_COVER: PageSpec = {
  pal: 'neon',
  seed: 901,
  panels: [
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      layers: [
        CITY(0.7, 1, 101),
        RAIN(160, 0.28, 102),
        WASH(0, 0.5, 'ink'),
        // The lamp stays off the figure. Put a widening beam behind someone and
        // it comes through the gap between their legs as two lit wedges.
        BEAM(0.76, 0.14),
        SIGN(0.62, 0.22, 'Kestrel Row'),
        F(0.27, 0.95, 'umbrella'),
        DUST(40, 103),
      ],
      caption: 'PAPER STREETS — eleven lots that were never there',
      captionAt: 'bottom',
    },
  ],
};
