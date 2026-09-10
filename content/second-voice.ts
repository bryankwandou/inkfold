// "Second Voice" — an Inkfold original.
//
// Third title drawn entirely by lib/studio/paint.ts. Scripted here, composed
// from the layer vocabulary, released CC BY-SA 4.0.
//
// A dub artist signs a routine consent form so a session can be paid out, and
// eleven months later hears herself selling a bank. The signature is probably
// enforceable. What nobody in the chain checked is whether the studio ever held
// the rights it was selling on — and that question lives in a cardboard box.

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

/* Layer shorthand. */
const F = (
  x: number,
  scale = 1,
  pose: Pose = 'stand',
  fill?: 'ink' | 'accent' | 'paper',
  flip?: boolean,
): Layer => ({ t: 'figure', x, scale, pose, fill, flip });
const BOOTH = (y = 0.28, glass = true, seed = 1): Layer => ({ t: 'booth', y, glass, seed });
const WAVE = (y = 0.5, amp = 0.18, n = 64, seed = 1): Layer => ({ t: 'wave', y, amp, n, seed });
const FLAT = (y = 0.5): Layer => ({ t: 'wave', y, flat: true });
const REEL = (n = 2, y = 0.46, spin = 0): Layer => ({ t: 'reel', n, y, spin });
const STAGE = (curtain = true, y = 0.62): Layer => ({ t: 'stage', curtain, y });
const MIC = (x = 0.5, y = 0.46, scale = 1): Layer => ({ t: 'mic', x, y, scale });
const TOWER = (x = 0.5, h = 0.7, lit = true): Layer => ({ t: 'tower', x, h, lit });
const CITY = (y = 0.68, density = 1, seed = 1, lit = true): Layer =>
  ({ t: 'city', y, density, seed, lit });
const RAIN = (n = 120, slant = 0.22, seed = 1): Layer => ({ t: 'rain', n, slant, seed });
const ROOM = (window = true, y = 0.74): Layer => ({ t: 'room', window, y });
const DOOR = (x = 0.5, open = false): Layer => ({ t: 'door', x, open });
const CROWD = (n = 14, y = 0.86, seed = 1): Layer => ({ t: 'crowd', n, y, seed });
const DESK = (y = 0.7, clutter = 6, seed = 1): Layer => ({ t: 'desk', y, clutter, seed });
const SIGN = (x: number, y: number, text: string): Layer => ({ t: 'sign', x, y, text });
const SCREEN = (x = 0.5, y = 0.44, w = 0.46, lines = 7, seed = 1): Layer =>
  ({ t: 'screen', x, y, w, lines, seed });
const SHELF = (seed = 1): Layer => ({ t: 'shelves', seed });
const BLINDS = (n = 12): Layer => ({ t: 'blinds', n });
const WASH = (from = 0, to = 0.5, color?: 'accent' | 'glow' | 'ink'): Layer =>
  ({ t: 'wash', from, to, color });
const DUST = (n = 40, seed = 1): Layer => ({ t: 'dust', n, seed });
const BEAM = (x = 0.5, w = 0.18): Layer => ({ t: 'beam', x, w });
const CONSOLE = (y = 0.68): Layer => ({ t: 'console', y });
const STAIR = (n = 9, flip = false): Layer => ({ t: 'stairs', n, flip });
const DISC = (cx: number, cy: number, r: number, fill?: 'far' | 'accent' | 'glow' | 'ink'): Layer =>
  ({ t: 'disc', cx, cy, r, fill });

const say = (x: number, y: number, text: string, tail?: number, w?: number) =>
  ({ x, y, text, tail, w });
const think = (x: number, y: number, text: string, w?: number) =>
  ({ x, y, text, w, kind: 'thought' as const });
const line = (x: number, y: number, text: string, w?: number) =>
  ({ x, y, text, w, kind: 'radio' as const });

/* Page skeletons. Slot counts: R3 4, R4 5, RT 3, RS 4, RW 6. */
const R3: Row[] = [{ h: 0.4, cols: [1] }, { h: 0.3, cols: [1, 1] }, { h: 0.3, cols: [1] }];
const R4: Row[] = [{ h: 0.28, cols: [1, 1] }, { h: 0.44, cols: [1] }, { h: 0.28, cols: [1, 1] }];
const RT: Row[] = [{ h: 0.34, cols: [1] }, { h: 0.33, cols: [1] }, { h: 0.33, cols: [1] }];
const RS: Row[] = [{ h: 0.62, cols: [1] }, { h: 0.38, cols: [1, 1, 1] }];
const RW: Row[] = [{ h: 0.3, cols: [1, 1, 1] }, { h: 0.42, cols: [1] }, { h: 0.28, cols: [2, 1] }];

/* ═══════════════════ CHAPTER 1 — Room Tone ═══════════════════ */

const ch1: PageSpec[] = [
  {
    pal: 'slate',
    seed: 1101,
    panels: grid(RT, [
      {
        layers: [CITY(0.7, 1, 3), TOWER(0.72, 0.62), RAIN(90, 0.2, 4), WASH(0, 0.4, 'ink')],
        caption:
          'Before a film reaches anyone here it passes through four rooms above a tyre shop, where nine people say its lines again in a language it was not written in.',
      },
      {
        layers: [BOOTH(0.26, true, 5), MIC(0.62, 0.6, 0.7), F(0.3, 1.0, 'stand')],
        caption: 'Studio 4. Sari Halim, nineteen years on the roster, second on the call sheet since 2011.',
      },
      {
        layers: [MIC(0.5, 0.44, 1.15), WASH(0.1, 0.5, 'ink')],
        balloons: [line(0.5, 0.8, 'Take eleven. Same line. Less of the hallway in it.', 0.66)],
      },
    ]),
  },
  {
    pal: 'slate',
    seed: 1102,
    panels: grid(R4, [
      {
        layers: [WAVE(0.5, 0.22, 70, 6)],
        caption: 'Take eleven.',
      },
      {
        layers: [WAVE(0.5, 0.2, 70, 7)],
        caption: 'Take twelve.',
      },
      {
        layers: [BOOTH(0.24, true, 8), CONSOLE(0.72), F(0.24, 1.05, 'seated'), F(0.74, 1.0, 'seated', undefined, true)],
        balloons: [
          say(0.3, 0.16, 'You are pushing the consonants. It is a kitchen, not a courtroom.', 0.4, 0.56),
          say(0.72, 0.42, 'It has been a courtroom since Tuesday.', 0.6, 0.42),
        ],
        caption: 'Bram Setiadi had engineered her sessions since the tape days and had never once flattered her.',
        captionAt: 'bottom',
      },
      {
        layers: [MIC(0.5, 0.42, 0.9), F(0.22, 0.9, 'lean')],
        balloons: [say(0.58, 0.76, 'Thirteen.', 0.5, 0.4)],
      },
      {
        layers: [WAVE(0.5, 0.24, 70, 9), WASH(0, 0.25, 'glow')],
        caption: 'Thirteen was the one.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 1103,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.76), DESK(0.7, 7, 11), F(0.7, 1.0, 'seated', undefined, true), F(0.3, 1.05, 'stand')],
        caption:
          'Payment went through the front office, which meant paper, which meant Ratna, who had a stack of it and a bus to catch.',
        balloons: [say(0.66, 0.2, 'Sign the three with the flags. Same as March.', 0.5, 0.5)],
      },
      {
        layers: [DESK(0.6, 4, 12), BEAM(0.44, 0.26), DUST(40, 13)],
        balloons: [
          say(0.32, 0.24, 'This one is new.', 0.4, 0.4),
          say(0.7, 0.66, 'Archive consent. Everyone signs it. It is so the old sessions can be catalogued.', 0.56, 0.5),
        ],
      },
      {
        layers: [ROOM(false, 0.8), F(0.42, 1.1, 'stand'), WASH(0.05, 0.4, 'ink')],
        caption:
          'It ran to one page. Two of its clauses used the word perpetuity, and neither of them was the clause about cataloguing.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'dusk',
    seed: 1104,
    panels: grid(RS, [
      {
        layers: [CITY(0.66, 1.1, 21), RAIN(70, 0.24, 22), F(0.26, 1.25, 'umbrella'), WASH(0, 0.5, 'ink')],
        caption:
          'She signed it in the doorway with the pen chained to the counter, because the bus was at six and the fee cleared on Friday.',
      },
      { layers: [SCREEN(0.5, 0.5, 0.72, 5, 23)] },
      { layers: [MIC(0.5, 0.5, 0.85), WASH(0.1, 0.4, 'ink')] },
      {
        layers: [ROOM(true, 0.8), BLINDS(12), F(0.44, 1.05, 'slump')],
        balloons: [think(0.5, 0.24, 'Nineteen years. Nobody has ever asked me for my voice in writing before.', 0.82)],
      },
    ]),
  },
];

/* ═══════════════════ CHAPTER 2 — The Clause ═══════════════════ */

const ch2: PageSpec[] = [
  {
    pal: 'bone',
    seed: 1201,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.78), DESK(0.74, 5, 31), SCREEN(0.62, 0.4, 0.4, 6, 32), F(0.24, 1.0, 'seated')],
        caption: 'Eleven months later, on a Sunday, in her sister’s kitchen, with the television on for nobody.',
      },
      {
        layers: [SCREEN(0.5, 0.46, 0.66, 4, 33), WASH(0.1, 0.45, 'glow')],
        balloons: [line(0.5, 0.78, 'Your savings deserve a bank that answers. Talk to us today.', 0.7)],
      },
      {
        layers: [ROOM(true, 0.8), F(0.46, 1.1, 'stand'), WASH(0, 0.3, 'ink')],
        caption:
          'She knew the reading. She knew where the breath came, because she had put it there, in a booth, on a Tuesday, for a cartoon about a fox.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'frost',
    seed: 1202,
    panels: grid(R4, [
      {
        layers: [SCREEN(0.5, 0.46, 0.72, 8, 34)],
        caption: 'She played it back forty times.',
      },
      {
        layers: [WAVE(0.5, 0.2, 72, 35)],
        caption: 'Then she played her own showreel underneath it.',
      },
      {
        layers: [ROOM(false, 0.82), SCREEN(0.3, 0.4, 0.38, 6, 36), SCREEN(0.72, 0.5, 0.38, 6, 37), F(0.5, 0.95, 'seated')],
        balloons: [
          think(0.5, 0.2, 'Not a soundalike. A soundalike breathes in the wrong place.', 0.8),
        ],
        caption: 'The vowels were hers. The mistakes were hers. The Tuesday was hers.',
        captionAt: 'bottom',
      },
      {
        layers: [DESK(0.66, 6, 38), BEAM(0.5, 0.22)],
        balloons: [say(0.5, 0.74, 'Ratna. The form in March. I need the copy I signed.', 0.5, 0.62)],
      },
      {
        layers: [DESK(0.24, 11, 40), BEAM(0.5, 0.3), FLAT(0.42)],
        caption: 'The office did not keep copies for the talent. It kept originals for the studio.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 1203,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.76), DESK(0.72, 8, 39), F(0.66, 1.0, 'seated', undefined, true), F(0.28, 1.05, 'lean')],
        balloons: [
          say(0.32, 0.18, 'One page. Nine lines. I want to read the nine lines.', 0.42, 0.5),
          say(0.7, 0.6, 'It is with legal now. Everything from March went with the sale.', 0.56, 0.46),
        ],
      },
      {
        layers: [SHELF(41), DUST(50, 42), F(0.4, 1.0, 'reach')],
        caption:
          'The studio had been sold in April to a group that owned two radio networks and a company nobody could describe in one sentence.',
      },
      {
        layers: [DESK(0.6, 3, 43), SCREEN(0.5, 0.38, 0.5, 9, 44), BEAM(0.42, 0.3)],
        balloons: [think(0.5, 0.76, 'Perpetual, worldwide, all media now known or later devised.', 0.78)],
      },
    ]),
  },
  {
    pal: 'dusk',
    seed: 1204,
    panels: grid(RS, [
      {
        layers: [CITY(0.68, 1, 45), TOWER(0.3, 0.58), RAIN(60, 0.2, 46), WASH(0, 0.45, 'ink'), F(0.7, 1.2, 'stand')],
        caption:
          'A friend read it twice and said the thing lawyers say when they would rather not be quoted, which is that it depends what the studio had to give away in the first place.',
      },
      { layers: [SCREEN(0.5, 0.5, 0.76, 6, 47)] },
      { layers: [WAVE(0.5, 0.16, 60, 48)] },
      {
        layers: [ROOM(true, 0.82), BLINDS(14), F(0.42, 1.05, 'stand'), DISC(0.74, 0.24, 0.1, 'glow')],
        balloons: [think(0.5, 0.22, 'Depends on what they had.', 0.7)],
      },
    ]),
  },
];

/* ═══════════════════ CHAPTER 3 — Room 4 ═══════════════════ */

const ch3: PageSpec[] = [
  {
    pal: 'slate',
    seed: 1301,
    panels: grid(RT, [
      {
        layers: [CITY(0.74, 0.9, 51), RAIN(50, 0.18, 52), SIGN(0.5, 0.3, 'Studio 4'), WASH(0, 0.35, 'ink')],
        caption:
          'The building had not changed. The plate by the door had, and so had the lock, and so had the person who decided who came through it.',
      },
      {
        layers: [DOOR(0.5, true), BEAM(0.5, 0.24), F(0.3, 1.1, 'stand'), F(0.7, 1.05, 'stand', undefined, true)],
        balloons: [
          say(0.3, 0.2, 'They took the tape library out in a van. Six trips.', 0.4, 0.5),
          say(0.7, 0.56, 'Took it where, Bram.', 0.6, 0.36),
        ],
      },
      {
        layers: [SHELF(53), DUST(60, 54), F(0.5, 1.0, 'carry')],
        caption:
          'Two floors down, in a room that used to hold the foley junk, a contractor was feeding forty years of magnetic tape into a rack of machines.',
      },
    ]),
  },
  {
    pal: 'ember',
    seed: 1302,
    panels: grid(R4, [
      { layers: [REEL(2, 0.46, 0)], caption: 'Ingest, 09:14.' },
      { layers: [REEL(2, 0.46, 1.1)], caption: 'Ingest, 09:15.' },
      {
        layers: [SHELF(55), CONSOLE(0.74), F(0.28, 1.05, 'seated'), F(0.66, 1.0, 'stand', undefined, true), DUST(40, 56)],
        balloons: [
          say(0.3, 0.16, 'Contract says clean and digitise. Twelve hundred hours a month.', 0.42, 0.58),
          say(0.72, 0.44, 'And after you clean it?', 0.58, 0.36),
          say(0.36, 0.66, 'After I clean it, it is not my box any more.', 0.48, 0.5),
        ],
      },
      { layers: [REEL(2, 0.46, 2.2), WASH(0, 0.3, 'ink')], caption: 'Ingest, 09:16.' },
      {
        layers: [SCREEN(0.5, 0.44, 0.6, 8, 57)],
        caption: 'Every reel came out the far side as a folder with a session date on it.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'slate',
    seed: 1303,
    panels: grid(RT, [
      {
        layers: [CONSOLE(0.66), SCREEN(0.5, 0.34, 0.56, 9, 58), F(0.22, 1.0, 'seated'), F(0.76, 0.95, 'seated', undefined, true)],
        balloons: [say(0.5, 0.16, 'Search my name in it.', 0.44, 0.4)],
      },
      {
        layers: [SCREEN(0.5, 0.44, 0.78, 11, 59), WASH(0.1, 0.4, 'glow')],
        caption: 'Halim, S. — 4,118 sessions. First entry: 12 August 2006.',
      },
      {
        layers: [BOOTH(0.24, true, 60), MIC(0.6, 0.62, 0.62), F(0.32, 1.0, 'slump')],
        balloons: [think(0.5, 0.2, 'I was twenty-six. I had a cold that week.', 0.72)],
      },
    ]),
  },
  {
    pal: 'frost',
    seed: 1304,
    panels: grid(RS, [
      {
        layers: [ROOM(true, 0.78), CONSOLE(0.8), SCREEN(0.62, 0.36, 0.44, 8, 61), F(0.26, 1.15, 'point'), WASH(0, 0.3, 'ink')],
        balloons: [
          say(0.56, 0.14, 'The folders are not the problem. Look at what is subscribed to the folders.', 0.4, 0.62),
        ],
        caption:
          'A second system was reading the archive on a schedule. It had been reading it since May, and it was not making a catalogue.',
        captionAt: 'bottom',
      },
      { layers: [WAVE(0.5, 0.22, 64, 62)] },
      { layers: [WAVE(0.5, 0.22, 64, 63)] },
      { layers: [WAVE(0.5, 0.22, 64, 64)] },
    ]),
  },
];

/* ═══════════════════ CHAPTER 4 — Twelve Hundred Hours ═══════════════════ */

const ch4: PageSpec[] = [
  {
    pal: 'bone',
    seed: 1401,
    panels: grid(RT, [
      {
        layers: [DESK(0.7, 9, 71), BEAM(0.4, 0.3), DUST(40, 72), F(0.72, 1.0, 'seated', undefined, true)],
        caption:
          'They did the arithmetic on the back of a call sheet, because neither of them trusted a spreadsheet they had not built themselves.',
      },
      {
        layers: [SCREEN(0.5, 0.42, 0.7, 10, 73)],
        caption: 'Forty-one voices in the archive. Eleven of them dead. Two of them children in 1998.',
      },
      {
        layers: [ROOM(true, 0.8), DESK(0.72, 6, 74), F(0.3, 1.0, 'seated'), F(0.68, 1.0, 'lean', undefined, true)],
        balloons: [
          say(0.32, 0.2, 'Twelve hundred hours of me. What does that buy them?', 0.44, 0.5),
          say(0.7, 0.6, 'Everything you can do. Then the version of it that never gets tired.', 0.58, 0.46),
        ],
      },
    ]),
  },
  {
    pal: 'slate',
    seed: 1402,
    panels: grid(R4, [
      { layers: [MIC(0.5, 0.46, 0.85)], caption: 'What a voice costs, per hour, with a person attached.' },
      { layers: [FLAT(0.5), WASH(0, 0.3, 'ink')], caption: 'What it costs without one.' },
      {
        layers: [BOOTH(0.26, true, 75), CONSOLE(0.76), F(0.24, 1.0, 'seated'), F(0.5, 0.95, 'stand'), F(0.76, 1.0, 'stand', undefined, true)],
        balloons: [
          say(0.28, 0.14, 'Ayu got the call sheet for the new serial. Forty episodes.', 0.4, 0.5),
          say(0.74, 0.4, 'Good. She has waited two years for forty episodes.', 0.6, 0.42),
          say(0.42, 0.66, 'It is not performance. It is correction. The machine reads, she fixes what it fumbles.', 0.5, 0.56),
        ],
      },
      {
        layers: [SCREEN(0.5, 0.44, 0.5, 7, 76)],
        caption: 'Rate offered: one fifth of scale, described in the letter as a convenience.',
      },
      {
        layers: [ROOM(false, 0.82), F(0.44, 1.1, 'slump'), WASH(0.1, 0.45, 'ink')],
        caption: 'Ayu took it. Rent is monthly and principle is not.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'ember',
    seed: 1403,
    panels: grid(RT, [
      {
        layers: [BOOTH(0.22, true, 77), MIC(0.64, 0.6, 0.66), F(0.3, 1.0, 'stand'), WASH(0, 0.3, 'accent')],
        caption:
          'The first correction session ran nine hours. The machine said a woman’s name four hundred times and got the stress wrong on every one.',
      },
      {
        layers: [WAVE(0.5, 0.12, 80, 78), WASH(0, 0.35, 'ink')],
        balloons: [line(0.5, 0.8, 'Fix from forty-one. And the laugh at fifty-two, it is doing a cough.', 0.72)],
      },
      {
        layers: [CONSOLE(0.7), F(0.24, 1.0, 'seated'), F(0.72, 0.95, 'seated', undefined, true), SCREEN(0.5, 0.34, 0.4, 6, 79)],
        balloons: [say(0.5, 0.16, 'Whose laugh is it, though. Ask it that.', 0.46, 0.5)],
      },
    ]),
  },
  {
    pal: 'dusk',
    seed: 1404,
    panels: grid(RS, [
      {
        layers: [CITY(0.7, 1.1, 80), TOWER(0.68, 0.6), RAIN(80, 0.24, 81), WASH(0, 0.5, 'ink'), F(0.3, 1.2, 'umbrella')],
        caption:
          'She walked home the long way, past the transmitter, and did the sum she had been avoiding: the archive was not her past work. It was her future work, already done, by something that would never ask for Friday off.',
      },
      { layers: [SCREEN(0.5, 0.5, 0.7, 6, 82)] },
      { layers: [MIC(0.5, 0.5, 0.8)] },
      { layers: [FLAT(0.5)] },
    ]),
  },
];

/* ═══════════════════ CHAPTER 5 — Second Voice ═══════════════════ */

const ch5: PageSpec[] = [
  {
    pal: 'neon',
    seed: 1501,
    panels: grid(RT, [
      {
        layers: [CITY(0.66, 1.2, 91), TOWER(0.5, 0.74), WASH(0, 0.45, 'ink'), DUST(30, 92)],
        caption:
          'The network launched it in September with a name that tested well. Second Voice. Forty languages, one licence, no scheduling.',
      },
      {
        layers: [STAGE(true, 0.6), CROWD(16, 0.9, 93), BEAM(0.5, 0.26), F(0.5, 0.9, 'point')],
        balloons: [line(0.5, 0.18, 'Nobody loses work. This frees our artists for the work that matters.', 0.78)],
      },
      {
        layers: [CROWD(20, 0.84, 94), WASH(0.1, 0.5, 'ink'), F(0.36, 1.05, 'stand')],
        caption: 'Sari was in row nine, holding a lanyard with her own name spelled with one L.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'neon',
    seed: 1502,
    panels: grid(R4, [
      { layers: [SCREEN(0.5, 0.46, 0.66, 5, 95)], caption: 'Demo one: a hospital drama, dubbed overnight.' },
      { layers: [SCREEN(0.5, 0.46, 0.66, 5, 96)], caption: 'Demo two: forty years of archive, searchable by feeling.' },
      {
        layers: [STAGE(true, 0.64), BEAM(0.42, 0.22), F(0.32, 0.95, 'stand'), F(0.66, 1.0, 'reach', undefined, true), CROWD(10, 0.92, 97)],
        balloons: [
          say(0.66, 0.14, 'Question from row nine.', 0.5, 0.42),
          say(0.3, 0.44, 'Which forty artists, and did any of them see the second page?', 0.44, 0.56),
        ],
        caption: 'The microphone runner reached her a beat late, which meant the room heard the question twice.',
        captionAt: 'bottom',
      },
      {
        layers: [MIC(0.5, 0.42, 0.9), WASH(0, 0.35, 'accent')],
        balloons: [line(0.5, 0.8, 'All performers were compensated under their agreements.', 0.68)],
      },
      {
        layers: [FLAT(0.5)],
        caption: 'Which was true, and answered nothing, and was the sentence she went home with.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'frost',
    seed: 1503,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.76), DESK(0.72, 7, 98), SCREEN(0.66, 0.36, 0.4, 8, 99), F(0.26, 1.0, 'seated')],
        caption:
          'Eleven of the forty answered her message. Six had signed the same page in the same doorway. Two had signed it for a parent who could no longer read it.',
      },
      {
        layers: [SCREEN(0.5, 0.44, 0.76, 12, 100)],
        caption: 'They started a document. It had no title for a week, and then it had a very boring one.',
      },
      {
        layers: [ROOM(true, 0.8), DESK(0.7, 5, 101), F(0.3, 1.0, 'seated'), F(0.7, 1.0, 'seated', undefined, true)],
        balloons: [
          say(0.32, 0.18, 'Suing over the signature is a coin toss and it takes four years.', 0.44, 0.54),
          say(0.7, 0.6, 'Then we do not argue about the signature.', 0.56, 0.42),
        ],
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 1504,
    panels: grid(RS, [
      {
        layers: [SHELF(102), DUST(60, 103), BEAM(0.38, 0.3), F(0.62, 1.1, 'reach', undefined, true)],
        caption:
          'A studio can only sell what it holds. Everything the machine had learned came off tape, and every reel of tape was made under a contract older than the machine, older than the network, and in most cases older than the word for what they had done with it.',
      },
      { layers: [REEL(2, 0.46, 0.4)] },
      { layers: [REEL(2, 0.46, 1.4)] },
      { layers: [SHELF(104), DUST(30, 105)] },
    ]),
  },
];

/* ═══════════════════ CHAPTER 6 — Chain of Title ═══════════════════ */

const ch6: PageSpec[] = [
  {
    pal: 'frost',
    seed: 1601,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.74), BLINDS(16), DESK(0.72, 4, 111), F(0.66, 1.0, 'seated', undefined, true), F(0.28, 1.05, 'stand')],
        caption:
          'The lawyer worked out of two rooms above a print shop and had spent nine years on residuals for session musicians, which is another way of saying she was not surprised by anything.',
        balloons: [say(0.66, 0.18, 'Your signature is probably good. Sit down anyway.', 0.5, 0.48)],
      },
      {
        layers: [DESK(0.64, 6, 112), SCREEN(0.5, 0.34, 0.46, 7, 113), BEAM(0.44, 0.26)],
        balloons: [
          say(0.5, 0.74, 'You gave them the archive. Did they ever own the archive?', 0.5, 0.66),
        ],
      },
      {
        layers: [ROOM(true, 0.8), F(0.34, 1.05, 'point'), F(0.7, 1.0, 'stand', undefined, true)],
        balloons: [
          say(0.34, 0.2, 'They made it. They paid for the studio time.', 0.44, 0.46),
          say(0.72, 0.58, 'They paid for a use. Read what the use was.', 0.58, 0.42),
        ],
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 1602,
    panels: grid(R4, [
      { layers: [DESK(0.18, 13, 114), BEAM(0.46, 0.34), DUST(20, 115)], caption: 'Session agreement, 1994.' },
      { layers: [DESK(0.18, 13, 116), BEAM(0.54, 0.34), DUST(20, 117)], caption: 'Session agreement, 2001.' },
      {
        layers: [SHELF(118), DESK(0.78, 8, 119), F(0.26, 1.0, 'kneel'), F(0.68, 1.05, 'crouch', undefined, true), BEAM(0.5, 0.3), DUST(50, 120)],
        balloons: [
          say(0.3, 0.14, 'Recording made solely for the exhibition of the titled programme.', 0.4, 0.6),
          say(0.72, 0.46, 'It says solely. It says it in every one of them until 2016.',  0.58, 0.46),
        ],
        caption: 'Nobody had gone looking, because the boxes were heavy and the answer was assumed.',
        captionAt: 'bottom',
      },
      { layers: [DESK(0.18, 13, 121), BEAM(0.42, 0.34), DUST(20, 122)], caption: 'Session agreement, 2009.' },
      { layers: [DESK(0.18, 13, 123), BEAM(0.58, 0.34), DUST(20, 124)], caption: 'Session agreement, 2015.' },
    ]),
  },
  {
    pal: 'frost',
    seed: 1603,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.76), DESK(0.7, 5, 125), SCREEN(0.64, 0.36, 0.42, 9, 126), F(0.28, 1.0, 'seated')],
        caption:
          'So the question stopped being whether Sari had given her voice away in March, and became whether the studio had anything to give her away with.',
      },
      {
        layers: [SCREEN(0.5, 0.44, 0.74, 10, 127), WASH(0.1, 0.4, 'glow')],
        balloons: [think(0.5, 0.2, 'Training is a use. It is a use nobody named, because nobody had to.', 0.82)],
      },
      {
        layers: [ROOM(true, 0.8), F(0.32, 1.05, 'stand'), F(0.68, 1.0, 'lean', undefined, true)],
        balloons: [
          say(0.34, 0.2, 'And if a court says training is not a use at all?', 0.44, 0.5),
          say(0.7, 0.6, 'Then we are early, and being early is not the same as being wrong.', 0.56, 0.46),
        ],
      },
    ]),
  },
  {
    pal: 'dusk',
    seed: 1604,
    panels: grid(RS, [
      {
        layers: [CITY(0.68, 1, 128), RAIN(70, 0.22, 129), TOWER(0.26, 0.56), WASH(0, 0.5, 'ink'), F(0.66, 1.2, 'walk', undefined, true)],
        caption:
          'They filed nothing that week. They wrote a letter instead, four pages, with a list attached, and the list was the part that frightened people: forty-one names, and beside each one the titles the tape had actually been made for.',
      },
      { layers: [SCREEN(0.5, 0.5, 0.7, 8, 130)] },
      { layers: [SHELF(131), DUST(30, 132)] },
      { layers: [REEL(2, 0.46, 2.6)] },
    ]),
  },
];

/* ═══════════════════ CHAPTER 7 — Room Tone, Reprise ═══════════════════ */

const ch7: PageSpec[] = [
  {
    pal: 'slate',
    seed: 1701,
    panels: grid(RW, [
      { layers: [SCREEN(0.5, 0.5, 0.8, 4, 141)], caption: 'Day one: no reply.' },
      { layers: [SCREEN(0.5, 0.5, 0.8, 5, 142)], caption: 'Day nine: an acknowledgement.' },
      { layers: [SCREEN(0.5, 0.5, 0.8, 6, 143)], caption: 'Day twenty: a meeting request.' },
      {
        layers: [ROOM(true, 0.74), BLINDS(18), DESK(0.76, 3, 144), F(0.22, 1.0, 'seated'), F(0.44, 0.95, 'seated'), F(0.74, 1.0, 'seated', undefined, true), WASH(0, 0.25, 'ink')],
        balloons: [
          say(0.26, 0.14, 'We are not conceding the point. We are proposing a process.', 0.42, 0.54),
          say(0.72, 0.42, 'Then propose it to all forty-one of us at once.', 0.6, 0.42),
        ],
        caption: 'The room had eleven people in it and one of them was there to count how long it took.',
        captionAt: 'bottom',
      },
      {
        layers: [DESK(0.66, 7, 145), SCREEN(0.44, 0.36, 0.38, 7, 146), BEAM(0.6, 0.22)],
        balloons: [say(0.5, 0.76, 'Withdraw the model. Then we talk about the archive.', 0.5, 0.62)],
      },
      { layers: [FLAT(0.5)], caption: 'Nine days of nothing.' },
    ]),
  },
  {
    pal: 'ember',
    seed: 1702,
    panels: grid(RT, [
      {
        layers: [BOOTH(0.24, true, 147), MIC(0.62, 0.6, 0.66), F(0.3, 1.0, 'stand'), WASH(0, 0.3, 'accent')],
        caption:
          'Meanwhile the work carried on, because it always does. Ayu corrected the machine on a serial about a fishing village and got faster at it, which was the part she hated.',
      },
      {
        layers: [CONSOLE(0.68), SCREEN(0.5, 0.34, 0.44, 7, 148), F(0.24, 1.0, 'seated'), F(0.74, 0.95, 'stand', undefined, true)],
        balloons: [
          say(0.5, 0.16, 'Four hundred lines today. Two years ago that was a fortnight.', 0.44, 0.58),
        ],
      },
      {
        layers: [WAVE(0.5, 0.1, 90, 149), WASH(0, 0.4, 'ink')],
        caption: 'A correction is not a performance. There is no take thirteen in it. There is only the take that stops being wrong.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 1703,
    panels: grid(R4, [
      { layers: [SHELF(150), DUST(30, 151)], caption: 'Box 12.' },
      { layers: [SHELF(152), DUST(30, 153)], caption: 'Box 40.' },
      {
        layers: [SHELF(154), DESK(0.78, 9, 155), F(0.3, 1.05, 'crouch'), F(0.7, 1.0, 'kneel', undefined, true), BEAM(0.48, 0.3), DUST(60, 156)],
        balloons: [
          say(0.32, 0.14, 'Here. Nineteen ninety-six, and it is signed by the founder himself.', 0.42, 0.58),
          say(0.72, 0.44, 'Solely for the exhibition of the titled programme.', 0.6, 0.44),
        ],
        caption: 'Eleven hours in a storage unit in Cakung, with a torch, in August.',
        captionAt: 'bottom',
      },
      { layers: [DESK(0.18, 14, 157), BEAM(0.44, 0.34), DUST(20, 158)], caption: 'Box 61.' },
      { layers: [DESK(0.18, 14, 159), BEAM(0.56, 0.34), DUST(20, 160)], caption: 'Box 74.' },
    ]),
  },
  {
    pal: 'frost',
    seed: 1704,
    panels: grid(RS, [
      {
        layers: [ROOM(true, 0.76), BLINDS(14), DESK(0.74, 4, 161), F(0.28, 1.1, 'stand'), F(0.68, 1.0, 'seated', undefined, true)],
        balloons: [
          say(0.3, 0.16, 'Four hundred and six agreements. Every one of them scoped to a title.', 0.42, 0.58),
        ],
        caption:
          'They scanned all of it in a print shop that stayed open late, and sent it as one file, and the file was larger than the model.',
        captionAt: 'bottom',
      },
      { layers: [SCREEN(0.5, 0.5, 0.74, 9, 162)] },
      { layers: [SCREEN(0.5, 0.5, 0.74, 7, 163)] },
      { layers: [SCREEN(0.5, 0.5, 0.74, 11, 164)] },
    ]),
  },
];

/* ═══════════════════ CHAPTER 8 — Credit ═══════════════════ */

const ch8: PageSpec[] = [
  {
    pal: 'frost',
    seed: 1801,
    panels: grid(RT, [
      {
        layers: [ROOM(true, 0.74), BLINDS(16), DESK(0.76, 3, 171), F(0.2, 1.0, 'seated'), F(0.42, 0.95, 'seated'), F(0.76, 1.0, 'seated', undefined, true)],
        caption:
          'It took five months and it did not end in a courtroom, which disappointed a reporter and nobody else.',
      },
      {
        layers: [DESK(0.66, 6, 172), SCREEN(0.5, 0.34, 0.48, 9, 173), BEAM(0.4, 0.26)],
        balloons: [say(0.5, 0.76, 'Read the third page again. Slowly.', 0.5, 0.56)],
      },
      {
        layers: [ROOM(true, 0.8), F(0.3, 1.05, 'stand'), F(0.7, 1.0, 'stand', undefined, true)],
        balloons: [
          say(0.32, 0.2, 'Withdrawn from service. Retrained from nothing we did not clear.', 0.44, 0.54),
          say(0.72, 0.6, 'And the tapes go where we can see them.', 0.58, 0.42),
        ],
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 1802,
    panels: grid(R4, [
      {
        layers: [SHELF(174), DUST(30, 175)],
        caption: 'The archive was deposited with a trust the artists sit on.',
      },
      {
        layers: [DESK(0.62, 7, 176), BEAM(0.5, 0.24)],
        caption: 'Each use asks. Each ask names a title, a term, and a fee.',
      },
      {
        layers: [ROOM(true, 0.78), DESK(0.74, 5, 177), SCREEN(0.66, 0.36, 0.4, 8, 178), F(0.26, 1.05, 'seated'), F(0.72, 1.0, 'lean', undefined, true)],
        balloons: [
          say(0.28, 0.16, 'It is not a win. They keep the ones we cleared.',  0.4, 0.52),
          say(0.74, 0.44, 'It is a list with our names on it. We did not have one of those in March.', 0.6, 0.48),
        ],
        caption:
          'Consent is duller than victory and it survives a change of owner, which victory does not.',
        captionAt: 'bottom',
      },
      {
        layers: [SCREEN(0.5, 0.42, 0.52, 11, 179)],
        caption: 'Forty-one names, alphabetical, in the credits of everything the archive touches.',
      },
      {
        layers: [DESK(0.2, 12, 180), BEAM(0.5, 0.3), DUST(20, 181)],
        caption: 'Ayu is paid at scale for correction work now. It is still correction work.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'ember',
    seed: 1803,
    panels: grid(RT, [
      {
        layers: [BOOTH(0.24, true, 182), MIC(0.6, 0.6, 0.7), F(0.32, 1.0, 'stand'), WASH(0, 0.25, 'accent')],
        caption:
          'She went back on a Tuesday, for a cartoon about a fox, because the fox had a fourth season and nobody else does that voice.',
      },
      {
        layers: [CONSOLE(0.68), F(0.24, 1.0, 'seated'), F(0.74, 0.95, 'seated', undefined, true), SCREEN(0.5, 0.34, 0.4, 6, 183)],
        balloons: [
          line(0.3, 0.16, 'Room tone first. Thirty seconds. Say nothing.', 0.5),
          say(0.74, 0.5, 'I remember how it goes.', 0.6, 0.36),
        ],
      },
      {
        layers: [MIC(0.5, 0.44, 1.1), WASH(0.08, 0.4, 'ink')],
        caption:
          'Room tone is the sound of an empty room with the machine running. Every studio records it. Without it, the silences between lines belong to nobody, and the cut shows.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'ember',
    seed: 1804,
    panels: grid(RS, [
      {
        layers: [BOOTH(0.22, true, 184), MIC(0.64, 0.58, 0.66), F(0.3, 1.02, 'stand'), BEAM(0.34, 0.2), DUST(30, 185)],
        caption:
          'Thirty seconds of nothing, recorded carefully, by a person who was asked first and named afterwards. That is the whole argument, and it took five months, and it is not finished anywhere else.',
      },
      { layers: [WAVE(0.5, 0.04, 90, 186)] },
      { layers: [WAVE(0.5, 0.2, 70, 187)] },
      {
        layers: [SCREEN(0.5, 0.5, 0.72, 12, 188)],
        caption: 'Halim, S.',
        captionAt: 'bottom',
      },
    ]),
  },
];

export const SECOND_VOICE_CHAPTERS: OriginalChapter[] = [
  { id: 'ch01', number: 1, title: 'Room Tone', pages: ch1 },
  { id: 'ch02', number: 2, title: 'The Clause', pages: ch2 },
  { id: 'ch03', number: 3, title: 'Room 4', pages: ch3 },
  { id: 'ch04', number: 4, title: 'Twelve Hundred Hours', pages: ch4 },
  { id: 'ch05', number: 5, title: 'Second Voice', pages: ch5 },
  { id: 'ch06', number: 6, title: 'Chain of Title', pages: ch6 },
  { id: 'ch07', number: 7, title: 'Room Tone, Reprise', pages: ch7 },
  { id: 'ch08', number: 8, title: 'Credit', pages: ch8 },
];

export const SECOND_VOICE_COVER: PageSpec = {
  pal: 'ember',
  seed: 1901,
  panels: [
    {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      layers: [
        BOOTH(0.2, true, 1902),
        // Mic to one side, figure to the other, so neither sits on the title.
        MIC(0.68, 0.52, 1.05),
        F(0.28, 1.15, 'stand'),
        WAVE(0.86, 0.07, 90, 1903),
        BEAM(0.2, 0.16),
        DUST(40, 1904),
      ],
      caption: 'SECOND VOICE — forty-one names and one signature',
      captionAt: 'bottom',
    },
  ],
};
