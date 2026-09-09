// "Nine Tenths" — an Inkfold original.
//
// Written for this shelf and drawn by lib/studio/paint.ts. Released under
// CC BY-SA 4.0, which means it carries the same obligations we ask of anyone
// submitting to us: name the author, keep it open downstream.
//
// Salvage law, an archive nobody licensed, and the difference between owning a
// thing and having made it.

import type { Layer, PageSpec, PaletteName, Panel, Pose } from '../lib/studio/paint';

type Body = Omit<Panel, 'x' | 'y' | 'w' | 'h'>;
type Row = { h: number; cols: number[] };

/** Lay bodies into rows of weighted columns. Keeps the script readable. */
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

// Shorthand for the layer vocabulary.
const F = (x: number, scale = 1, pose: Pose = 'stand', fill?: 'ink' | 'accent' | 'paper', flip?: boolean): Layer =>
  ({ t: 'figure', x, scale, pose, fill, flip });
const S = (n = 90, seed = 1): Layer => ({ t: 'stars', n, seed });
const D = (cx: number, cy: number, r: number, fill?: 'far' | 'accent' | 'glow' | 'ink', ring?: number): Layer =>
  ({ t: 'disc', cx, cy, r, fill, ring });
const HULL = (y: number, flip?: boolean, scale?: number): Layer => ({ t: 'hull', y, flip, scale });
const WRECK = (seed = 1): Layer => ({ t: 'wreck', seed });
const CORR = (vy?: number): Layer => ({ t: 'corridor', vy });
const WIN = (shape?: 'round' | 'rect'): Layer => ({ t: 'window', shape });
const CONS = (y?: number): Layer => ({ t: 'console', y });
const POD: Layer = { t: 'pod' };
const SHELF = (seed = 1): Layer => ({ t: 'shelves', seed });
const DUST = (n = 40, seed = 1): Layer => ({ t: 'dust', n, seed });
const BEAM = (x?: number, w?: number): Layer => ({ t: 'beam', x, w });
const WASH = (from = 0, to = 0.5, color?: 'accent' | 'glow' | 'ink'): Layer => ({ t: 'wash', from, to, color });
const RIBS = (n = 7): Layer => ({ t: 'ribs', n });

// Balloon shorthand.
const say = (x: number, y: number, text: string, tail?: number, w?: number) => ({ x, y, text, tail, w });
const radio = (x: number, y: number, text: string, w?: number) =>
  ({ x, y, text, w, kind: 'radio' as const });
const think = (x: number, y: number, text: string, w?: number) =>
  ({ x, y, text, w, kind: 'thought' as const });

export type OriginalChapter = {
  id: string;
  number: number;
  title: string;
  pages: PageSpec[];
};

const R3: Row[] = [{ h: 0.4, cols: [1] }, { h: 0.3, cols: [1, 1] }, { h: 0.3, cols: [1] }];
const R4: Row[] = [{ h: 0.28, cols: [1, 1] }, { h: 0.44, cols: [1] }, { h: 0.28, cols: [1, 1] }];
const RT: Row[] = [{ h: 0.34, cols: [1] }, { h: 0.33, cols: [1] }, { h: 0.33, cols: [1] }];
const RS: Row[] = [{ h: 0.62, cols: [1] }, { h: 0.38, cols: [1, 1, 1] }];

/* ═══════════════════════ CHAPTER 1 ═══════════════════════ */

const ch1: PageSpec[] = [
  {
    pal: 'void',
    seed: 11,
    panels: grid(R3, [
      {
        layers: [S(140, 3), D(0.72, 0.3, 0.1, 'far'), WRECK(4), HULL(0.86)],
        caption:
          'Past Ceres the lanes thin out and the law gets short enough to print on a mug. A hull adrift four hundred days belongs to whoever tows it home.',
      },
      {
        layers: [CONS(0.62), F(0.5, 1.05, 'seated')],
        balloons: [say(0.52, 0.24, 'Contact. Bearing two-two-nine. No transponder, no running lights.', 0.4, 0.72)],
      },
      {
        layers: [WASH(0, 0.4, 'ink'), F(0.44, 1.25, 'stand'), F(0.78, 1.1, 'stand', undefined, true)],
        balloons: [say(0.45, 0.2, 'Age it.', 0.35, 0.45)],
      },
      {
        layers: [S(60, 8), WIN('round'), D(0.5, 0.46, 0.19, 'far'), F(0.22, 1.3, 'point'), F(0.8, 1.15, 'stand', undefined, true)],
        balloons: [
          say(0.3, 0.16, 'Four hundred and six days, captain.', 0.4, 0.5),
          say(0.72, 0.78, 'Then she is ours.', 0.6, 0.42),
        ],
      },
    ]),
  },
  {
    pal: 'void',
    seed: 12,
    panels: grid(RT, [
      {
        layers: [S(110, 12), WRECK(9), D(0.18, 0.7, 0.07, 'accent')],
        caption: 'Her name was still legible under the burn scoring. AURORIA. Registered out of Bremen, forty-one years old.',
        captionAt: 'bottom',
      },
      {
        layers: [CORR(0.46), DUST(30, 5), F(0.34, 1.15, 'suit'), F(0.66, 1.05, 'suit', undefined, true)],
        balloons: [
          say(0.3, 0.18, 'Atmosphere is thin but it is breathing air. Somebody kept the scrubbers fed.', 0.4, 0.62),
          say(0.72, 0.74, 'For four hundred days?', 0.5, 0.4),
        ],
      },
      {
        layers: [WASH(0, 0.55, 'ink'), F(0.5, 1.5, 'stand', 'ink'), BEAM(0.5, 0.2)],
        balloons: [say(0.5, 0.22, 'Something did.', 0.5, 0.36)],
      },
    ]),
  },
  {
    pal: 'frost',
    seed: 13,
    panels: grid(R4, [
      { layers: [CORR(0.5), F(0.5, 1, 'suit')], caption: 'Deck two.' },
      { layers: [RIBS(9), DUST(50, 7), F(0.6, 1.1, 'crouch')], balloons: [say(0.5, 0.24, 'Idris. Power draw.', 0.5, 0.5)] },
      {
        layers: [WASH(0.1, 0.5, 'glow'), POD, DUST(40, 11)],
        balloons: [radio(0.28, 0.18, 'Everything is dead except one line. It runs aft and it is pulling hard.', 0.52)],
        sfx: { x: 0.82, y: 0.86, text: 'hmmmm', size: 0.075 },
      },
      { layers: [WASH(0, 0.6, 'ink'), F(0.42, 1.4, 'stand'), F(0.7, 1.2, 'reach', undefined, true)], balloons: [say(0.5, 0.2, 'Aft is cold storage.', 0.5, 0.52)] },
      { layers: [S(40, 19), WIN('rect'), D(0.5, 0.46, 0.14, 'glow')], caption: 'Nobody said anything for a while.', captionAt: 'bottom' },
    ]),
  },
  {
    pal: 'frost',
    seed: 14,
    panels: grid(RS, [
      {
        layers: [WASH(0.15, 0.55, 'glow'), POD, F(0.2, 1.2, 'stand'), F(0.82, 1.1, 'crouch', undefined, true), DUST(60, 13)],
        balloons: [
          say(0.32, 0.12, 'One pod. Still drawing.', 0.4, 0.48),
          say(0.68, 0.32, 'Occupied?', 0.5, 0.3),
          say(0.5, 0.86, 'Occupied.', 0.5, 0.3),
        ],
      },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.6, 'slump')], caption: 'Salvage law is short.' },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.6, 'stand')], caption: 'It does not have a line for this.' },
      { layers: [S(70, 23), D(0.5, 0.5, 0.22, 'accent')], caption: 'Not one.' },
    ]),
  },
];

/* ═══════════════════════ CHAPTER 2 ═══════════════════════ */

const ch2: PageSpec[] = [
  {
    pal: 'frost',
    seed: 21,
    panels: grid(RT, [
      {
        layers: [WASH(0.2, 0.5, 'glow'), POD, DUST(40, 3)],
        caption: 'The manifest called her Ilse Halvard. Sole crew. Sole owner. Departure logged forty-one months ago, destination left blank.',
      },
      {
        layers: [CONS(0.6), F(0.3, 1, 'seated'), F(0.72, 1.05, 'stand', undefined, true)],
        balloons: [
          say(0.3, 0.2, 'Vitals are shallow but they are there. She could come up.', 0.4, 0.58),
          say(0.74, 0.66, 'Could is doing a lot of work in that sentence.', 0.5, 0.44),
        ],
      },
      {
        layers: [WASH(0, 0.6, 'ink'), F(0.24, 1.3, 'stand'), F(0.5, 1.2, 'point', 'accent'), F(0.78, 1.15, 'stand', undefined, true)],
        balloons: [say(0.55, 0.18, 'Then we log her as cargo and we keep moving.', 0.45, 0.6)],
      },
    ]),
  },
  {
    pal: 'frost',
    seed: 22,
    panels: grid(R4, [
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'stand', 'accent')], balloons: [say(0.5, 0.2, 'Cargo.', 0.5, 0.34)] },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'stand')], balloons: [say(0.5, 0.2, 'You heard me.', 0.5, 0.42)] },
      {
        layers: [CORR(0.44), F(0.3, 1.1, 'stand'), F(0.68, 1.05, 'point', 'accent', true), DUST(30, 9)],
        balloons: [
          say(0.28, 0.14, 'Bergen. She is a person.', 0.4, 0.46),
          say(0.7, 0.42, 'She is a person aboard a derelict I have a filing window on. Those are two facts and only one of them pays.', 0.5, 0.56),
        ],
      },
      { layers: [S(50, 31), WIN('round'), D(0.5, 0.46, 0.16, 'far')], caption: 'Halcyon Salvage sent a man with every crew. Bergen was ours.' },
      { layers: [WASH(0, 0.55, 'ink'), F(0.46, 1.4, 'slump')], caption: 'He was not cruel. He was correct. It is a worse thing to argue with.', captionAt: 'bottom' },
    ]),
  },
  {
    pal: 'bone',
    seed: 23,
    panels: grid(R3, [
      {
        layers: [SHELF(5), DUST(50, 17), F(0.5, 1.25, 'stand')],
        caption: 'We found the rest of it on deck four.',
      },
      { layers: [SHELF(9), F(0.4, 1.1, 'reach')], balloons: [say(0.5, 0.2, 'Captain. Come and look at this.', 0.45, 0.66)] },
      { layers: [SHELF(13), DUST(70, 21)], sfx: { x: 0.5, y: 0.6, text: '', size: 0.01 } },
      {
        layers: [SHELF(2), F(0.24, 1.2, 'stand'), F(0.74, 1.15, 'crouch', undefined, true), DUST(40, 27)],
        balloons: [
          say(0.3, 0.14, 'Drives. Thousands of them.', 0.4, 0.5),
          say(0.72, 0.7, 'Not thousands. Nine hundred and four. They are numbered.', 0.5, 0.5),
        ],
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 24,
    panels: grid(RS, [
      {
        layers: [SHELF(33), WASH(0, 0.35, 'ink'), F(0.5, 1.3, 'stand'), DUST(60, 35)],
        caption: 'Thirty years of one woman working. Paintings, cuts of film, notebooks, forty drafts of the same eleven minutes.',
        balloons: [think(0.66, 0.76, 'Nobody makes nine hundred of anything for the money.', 0.52)],
      },
      { layers: [SHELF(41), F(0.5, 1.4, 'crouch')], caption: 'No backups off-ship.' },
      { layers: [SHELF(43), F(0.5, 1.4, 'reach')], caption: 'No copies filed anywhere.' },
      { layers: [WASH(0, 0.6, 'accent'), F(0.5, 1.4, 'stand', 'ink')], caption: 'This was the only one.' },
    ]),
  },
];

/* ═══════════════════════ CHAPTER 3 ═══════════════════════ */

const ch3: PageSpec[] = [
  {
    pal: 'rust',
    seed: 31,
    panels: grid(RT, [
      {
        layers: [CONS(0.58), F(0.68, 1.1, 'seated', 'accent'), DUST(20, 3)],
        caption: 'Bergen filed intent that night. I watched him do it. He did not hide it, which is the part I keep coming back to.',
      },
      {
        layers: [WASH(0, 0.55, 'ink'), F(0.3, 1.3, 'point'), F(0.74, 1.2, 'seated', 'accent', true)],
        balloons: [
          say(0.3, 0.16, 'You are filing the archive as recovered property.', 0.4, 0.56),
          say(0.72, 0.7, 'I am filing it as what it is.', 0.5, 0.44),
        ],
      },
      {
        layers: [CONS(0.66), F(0.5, 1.15, 'stand')],
        balloons: [say(0.5, 0.2, 'And then what happens to it?', 0.5, 0.52)],
      },
    ]),
  },
  {
    pal: 'rust',
    seed: 32,
    panels: grid(R4, [
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'seated', 'accent')], balloons: [say(0.5, 0.22, 'Rights get assessed.', 0.5, 0.5)] },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'stand')], balloons: [say(0.5, 0.22, 'Assessed by who?', 0.5, 0.48)] },
      {
        layers: [SHELF(7), WASH(0, 0.4, 'ink'), F(0.28, 1.2, 'seated', 'accent'), F(0.74, 1.2, 'stand', undefined, true)],
        balloons: [
          say(0.3, 0.14, 'Legal. They price it, they license what sells, and they hold the rest.', 0.42, 0.58),
          say(0.7, 0.5, 'Hold it where?', 0.5, 0.36),
          say(0.5, 0.86, 'In the vault. Where it is safe.', 0.5, 0.5),
        ],
      },
      { layers: [SHELF(11), DUST(40, 13)], caption: 'Safe.' },
      { layers: [WASH(0, 0.6, 'ink'), F(0.5, 1.45, 'slump')], caption: 'Nine hundred and four drives, and the word he reached for was safe.', captionAt: 'bottom' },
    ]),
  },
  {
    pal: 'rust',
    seed: 33,
    panels: grid(R3, [
      {
        layers: [S(90, 41), WIN('rect'), D(0.5, 0.46, 0.13, 'accent'), F(0.16, 1.2, 'stand')],
        caption: 'I have hauled a lot of dead ships. You get used to the arithmetic of it.',
      },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.4, 'stand')], balloons: [think(0.5, 0.24, 'A hull is worth its mass. A cargo is worth its market.', 0.6)] },
      { layers: [SHELF(19), F(0.5, 1.3, 'reach')], balloons: [think(0.5, 0.2, 'What is thirty years worth, if the price is set by the only people allowed to sell it?', 0.62)] },
      {
        layers: [WASH(0.1, 0.55, 'accent'), F(0.36, 1.3, 'stand'), F(0.72, 1.2, 'stand', undefined, true)],
        balloons: [say(0.5, 0.18, 'Idris. How long is the filing window?', 0.45, 0.6)],
      },
    ]),
  },
  {
    pal: 'rust',
    seed: 34,
    panels: grid(RS, [
      {
        layers: [CONS(0.62), F(0.32, 1.15, 'stand'), F(0.72, 1.1, 'seated', undefined, true), DUST(20, 23)],
        balloons: [
          say(0.34, 0.12, 'Ninety hours from transmit. After that it is company property and undoing it takes a court.', 0.42, 0.62),
          say(0.7, 0.66, 'And before that?', 0.5, 0.38),
        ],
      },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'stand')], caption: 'Before that,' },
      { layers: [WASH(0, 0.5, 'accent'), F(0.5, 1.5, 'point', 'ink')], caption: 'it belongs' },
      { layers: [S(60, 51), D(0.5, 0.5, 0.24, 'accent')], caption: 'to nobody at all.' },
    ]),
  },
];

/* ═══════════════════════ CHAPTER 4 ═══════════════════════ */

const ch4: PageSpec[] = [
  {
    pal: 'void',
    seed: 41,
    panels: grid(RT, [
      {
        layers: [S(130, 5), HULL(0.8), D(0.8, 0.24, 0.08, 'far'), WRECK(15)],
        caption: 'They call it nine tenths because possession is nine tenths of the law. Nobody ever says what the last tenth is.',
      },
      {
        layers: [CORR(0.5), F(0.36, 1.15, 'stand'), F(0.66, 1.1, 'stand', undefined, true)],
        balloons: [
          say(0.32, 0.16, 'You are going to do something stupid.', 0.4, 0.52),
          say(0.7, 0.68, 'I am going to do something slow. There is a difference.', 0.5, 0.5),
        ],
      },
      {
        layers: [WASH(0, 0.55, 'ink'), F(0.5, 1.4, 'stand'), BEAM(0.5, 0.16)],
        balloons: [say(0.5, 0.2, 'Wake her up.', 0.5, 0.4)],
      },
    ]),
  },
  {
    pal: 'frost',
    seed: 42,
    panels: grid(R4, [
      { layers: [WASH(0.1, 0.5, 'glow'), POD, DUST(30, 9)], balloons: [say(0.5, 0.22, 'Captain, she has been under for three years.', 0.5, 0.6)] },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'stand')], balloons: [say(0.5, 0.22, 'Then she has waited long enough.', 0.5, 0.56)] },
      {
        layers: [WASH(0.15, 0.5, 'glow'), POD, F(0.18, 1.15, 'crouch'), F(0.84, 1.1, 'stand', undefined, true), DUST(50, 15)],
        balloons: [
          say(0.32, 0.12, 'If she comes up wrong, that is on me. Not you.', 0.4, 0.52),
          say(0.7, 0.4, 'It is on all of us. That is what a crew is.', 0.5, 0.48),
        ],
        sfx: { x: 0.5, y: 0.9, text: 'clunk', size: 0.08 },
      },
      { layers: [WASH(0.2, 0.6, 'glow'), POD], caption: 'Cycle started.' },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.4, 'stand'), F(0.24, 1.2, 'stand', 'accent')], caption: 'Bergen watched from the hatch and did not stop us. He did not have to. He had ninety hours and he knew it.', captionAt: 'bottom' },
    ]),
  },
  {
    pal: 'ember',
    seed: 43,
    panels: grid(R3, [
      { layers: [WASH(0.1, 0.6, 'accent'), POD, DUST(60, 21)], caption: 'It took nine hours.' },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'slump', 'paper')], sfx: { x: 0.5, y: 0.4, text: 'hhhk', size: 0.09 } },
      { layers: [WASH(0.1, 0.5, 'glow'), F(0.5, 1.4, 'crouch', 'paper')], balloons: [say(0.5, 0.22, 'Easy. Easy. You are aboard the Kestrel Nine.', 0.5, 0.6)] },
      {
        layers: [WASH(0, 0.55, 'ink'), F(0.34, 1.3, 'crouch'), F(0.7, 1.25, 'slump', 'paper', true)],
        balloons: [say(0.68, 0.18, 'Did it hold?', 0.5, 0.4)],
      },
    ]),
  },
  {
    pal: 'ember',
    seed: 44,
    panels: grid(RS, [
      {
        layers: [WASH(0.05, 0.5, 'ink'), F(0.3, 1.35, 'stand'), F(0.7, 1.3, 'slump', 'paper', true), DUST(30, 27)],
        balloons: [
          say(0.32, 0.12, 'Did what hold?', 0.4, 0.4),
          say(0.68, 0.42, 'The cold. Deck four. Did the cold hold on deck four.', 0.5, 0.5),
        ],
      },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'stand')], caption: 'Three years under.' },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'slump', 'paper')], caption: 'First question out of her.' },
      { layers: [WASH(0.1, 0.6, 'accent'), F(0.5, 1.4, 'reach', 'ink')], caption: 'Not where. Not who. Did it hold.' },
    ]),
  },
];

/* ═══════════════════════ CHAPTER 5 ═══════════════════════ */

const ch5: PageSpec[] = [
  {
    pal: 'bone',
    seed: 51,
    panels: grid(RT, [
      {
        layers: [SHELF(3), F(0.5, 1.3, 'stand', 'paper'), DUST(50, 7)],
        caption: 'She walked deck four before she would take water. Touched every third rack, the way you check a fence line.',
      },
      {
        layers: [SHELF(9), F(0.28, 1.2, 'reach', 'paper'), F(0.76, 1.15, 'stand', undefined, true)],
        balloons: [
          say(0.3, 0.14, 'Nine hundred and four.', 0.4, 0.42),
          say(0.72, 0.62, 'You counted them in your sleep?', 0.5, 0.5),
        ],
      },
      {
        layers: [SHELF(15), F(0.5, 1.25, 'stand', 'paper')],
        balloons: [say(0.5, 0.2, 'I counted them awake. For thirty years. Sleep was the easy part.', 0.5, 0.66)],
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 52,
    panels: grid(R4, [
      { layers: [SHELF(21), F(0.5, 1.3, 'crouch', 'paper')], balloons: [say(0.5, 0.24, 'Who are you people?', 0.5, 0.52)] },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.45, 'stand')], balloons: [say(0.5, 0.24, 'Salvage.', 0.5, 0.36)] },
      {
        layers: [SHELF(27), WASH(0, 0.3, 'ink'), F(0.3, 1.25, 'stand', 'paper'), F(0.72, 1.2, 'stand', undefined, true)],
        balloons: [
          say(0.3, 0.12, 'Then the Auroria is yours.', 0.4, 0.48),
          say(0.7, 0.36, 'She is.', 0.5, 0.3),
          say(0.5, 0.82, 'And the drives?', 0.5, 0.4),
        ],
      },
      { layers: [WASH(0, 0.55, 'ink'), F(0.5, 1.4, 'stand')], caption: 'I did not answer fast enough.' },
      { layers: [SHELF(31), F(0.5, 1.3, 'slump', 'paper')], caption: 'She had already read it off me.', captionAt: 'bottom' },
    ]),
  },
  {
    pal: 'deep',
    seed: 53,
    panels: grid(R3, [
      {
        layers: [S(120, 33), WIN('round'), D(0.5, 0.46, 0.18, 'far'), F(0.18, 1.2, 'stand', 'paper')],
        caption: 'She told it plainly, which is how you tell a thing you have gone over too many times to dress up.',
      },
      {
        layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.4, 'stand', 'paper')],
        balloons: [say(0.5, 0.2, 'I signed a distribution deal at twenty-six. Nine years of work, one signature.', 0.5, 0.7)],
      },
      {
        layers: [SHELF(37), WASH(0, 0.35, 'ink'), F(0.5, 1.3, 'slump', 'paper')],
        balloons: [say(0.5, 0.2, 'They shelved six of the nine. Not because they were bad. Because releasing them would have competed with the three.', 0.5, 0.74)],
      },
      {
        layers: [S(60, 39), D(0.5, 0.5, 0.2, 'accent'), F(0.5, 1.25, 'stand', 'ink')],
        balloons: [say(0.5, 0.78, 'I could not buy them back. I had made them and I could not buy them back.', 0.5, 0.72)],
      },
    ]),
  },
  {
    pal: 'deep',
    seed: 54,
    panels: grid(RS, [
      {
        layers: [S(100, 43), WIN('rect'), D(0.5, 0.46, 0.15, 'glow'), F(0.2, 1.25, 'stand', 'paper'), F(0.8, 1.2, 'stand', undefined, true)],
        balloons: [
          say(0.32, 0.12, 'So I left. Bought a hull, took everything, and went somewhere the filing does not reach.', 0.42, 0.6),
          say(0.7, 0.68, 'Four hundred days past a lane. That is not somewhere. That is nowhere.', 0.5, 0.5),
        ],
      },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.45, 'stand', 'paper')], caption: 'Nowhere was the point.' },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.45, 'slump', 'paper')], caption: 'Nowhere is also how a person ends up in a pod' },
      { layers: [WASH(0.1, 0.6, 'accent'), F(0.5, 1.4, 'stand', 'ink')], caption: 'with nine hundred drives and no witnesses.' },
    ]),
  },
];

/* ═══════════════════════ CHAPTER 6 ═══════════════════════ */

const ch6: PageSpec[] = [
  {
    pal: 'rust',
    seed: 61,
    panels: grid(RT, [
      {
        layers: [CONS(0.6), F(0.3, 1.15, 'seated', 'accent'), F(0.74, 1.1, 'stand', undefined, true)],
        caption: 'Bergen put it to her straight, and to be fair to him, he put it to her first.',
      },
      {
        layers: [WASH(0, 0.55, 'ink'), F(0.28, 1.3, 'point', 'accent'), F(0.72, 1.25, 'stand', 'paper', true)],
        balloons: [
          say(0.3, 0.14, 'Halcyon will honour a creator credit. Your name stays on everything.', 0.4, 0.58),
          say(0.72, 0.68, 'My name is not the part I am worried about.', 0.5, 0.48),
        ],
      },
      {
        layers: [SHELF(5), WASH(0, 0.35, 'ink'), F(0.5, 1.25, 'stand', 'paper')],
        balloons: [say(0.5, 0.2, 'Ask me what I want and I will tell you. Nobody has asked in thirty years.', 0.5, 0.7)],
      },
    ]),
  },
  {
    pal: 'rust',
    seed: 62,
    panels: grid(R4, [
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.45, 'stand')], balloons: [say(0.5, 0.24, 'What do you want.', 0.5, 0.46)] },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.45, 'stand', 'paper')], balloons: [say(0.5, 0.24, 'I want it out.', 0.5, 0.4)] },
      {
        layers: [SHELF(11), WASH(0, 0.3, 'ink'), F(0.26, 1.25, 'stand', 'paper'), F(0.7, 1.2, 'seated', 'accent', true)],
        balloons: [
          say(0.3, 0.12, 'All of it. Open, free to copy, free to sell if somebody wants to. No permission needed from me or anyone.', 0.42, 0.6),
          say(0.72, 0.56, 'You would make it worthless.', 0.5, 0.44),
          say(0.44, 0.86, 'I would make it unlosable.', 0.45, 0.5),
        ],
      },
      { layers: [WASH(0, 0.55, 'ink'), F(0.5, 1.4, 'seated', 'accent')], caption: 'He genuinely did not follow. I could see him trying.' },
      { layers: [SHELF(17), F(0.5, 1.3, 'stand', 'paper')], caption: 'To him a thing you cannot fence is a thing you have lost.', captionAt: 'bottom' },
    ]),
  },
  {
    pal: 'ember',
    seed: 63,
    panels: grid(R3, [
      {
        layers: [WASH(0.1, 0.5, 'accent'), F(0.36, 1.3, 'stand', 'paper'), F(0.74, 1.2, 'stand', undefined, true)],
        caption: 'She found me on the gantry after.',
      },
      {
        layers: [S(90, 23), HULL(0.78), F(0.3, 1.2, 'stand', 'paper'), F(0.66, 1.15, 'stand', undefined, true)],
        balloons: [
          say(0.3, 0.14, 'Your man files in sixty hours.', 0.4, 0.46),
          say(0.7, 0.6, 'Sixty-one.', 0.5, 0.34),
        ],
      },
      {
        layers: [WASH(0, 0.55, 'ink'), F(0.36, 1.3, 'stand', 'paper'), F(0.72, 1.25, 'stand', undefined, true)],
        balloons: [
          say(0.34, 0.16, 'You have a transmitter.', 0.4, 0.46),
          say(0.7, 0.66, 'I have a transmitter and a mortgage and a crew of three.', 0.5, 0.52),
        ],
      },
    ]),
  },
  {
    pal: 'ember',
    seed: 64,
    panels: grid(RS, [
      {
        layers: [S(80, 29), HULL(0.82), D(0.78, 0.22, 0.07, 'accent'), F(0.24, 1.3, 'stand', 'paper'), F(0.76, 1.25, 'slump', undefined, true)],
        balloons: [
          say(0.34, 0.1, 'I am not asking you to be brave. I am asking you to be quick.', 0.42, 0.58),
          say(0.68, 0.62, 'Those are the same thing at this range.', 0.5, 0.48),
        ],
      },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'stand', 'paper')], caption: 'She did not push.' },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'stand')], caption: 'She had made her case and she let it sit,' },
      { layers: [WASH(0.1, 0.6, 'accent'), F(0.5, 1.45, 'stand', 'ink')], caption: 'which is how you know somebody means it.' },
    ]),
  },
];

/* ═══════════════════════ CHAPTER 7 ═══════════════════════ */

const ch7: PageSpec[] = [
  {
    pal: 'void',
    seed: 71,
    panels: grid(RT, [
      {
        layers: [S(140, 3), HULL(0.84), D(0.2, 0.28, 0.09, 'far'), WRECK(7)],
        caption: 'Hour fifty-nine. Bergen went to the comms deck to transmit and found me already in the chair.',
      },
      {
        layers: [CONS(0.6), F(0.34, 1.15, 'seated'), F(0.74, 1.1, 'stand', 'accent', true)],
        balloons: [
          say(0.72, 0.16, 'Captain. Get up.', 0.5, 0.42),
          say(0.3, 0.66, 'In a minute.', 0.4, 0.38),
        ],
      },
      {
        layers: [WASH(0, 0.55, 'ink'), F(0.3, 1.3, 'seated'), F(0.72, 1.25, 'point', 'accent', true)],
        balloons: [say(0.68, 0.18, 'What are you sending.', 0.5, 0.46)],
      },
    ]),
  },
  {
    pal: 'void',
    seed: 72,
    panels: grid(R4, [
      { layers: [CONS(0.55), F(0.5, 1.1, 'seated')], balloons: [say(0.5, 0.22, 'Everything.', 0.5, 0.4)] },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'stand', 'accent')], balloons: [say(0.5, 0.22, 'To who?', 0.5, 0.36)] },
      {
        layers: [CONS(0.62), F(0.26, 1.15, 'seated'), F(0.74, 1.2, 'stand', 'accent', true), DUST(20, 11)],
        balloons: [
          say(0.32, 0.12, 'Every relay on the corridor. Ceres, Bremen, the university buoys, four hundred open mirrors.', 0.42, 0.6),
          say(0.72, 0.58, 'That is theft.', 0.5, 0.36),
          say(0.42, 0.86, 'It was nobody’s for one more hour. You told me that yourself.', 0.45, 0.56),
        ],
      },
      { layers: [WASH(0, 0.55, 'ink'), F(0.5, 1.45, 'stand', 'accent')], caption: 'He could have hit me. He thought about it.' },
      { layers: [CONS(0.5), F(0.5, 1.1, 'seated')], caption: 'Instead he asked the only question that mattered.', captionAt: 'bottom' },
    ]),
  },
  {
    pal: 'ember',
    seed: 73,
    panels: grid(R3, [
      {
        layers: [WASH(0, 0.5, 'ink'), F(0.34, 1.35, 'stand', 'accent'), F(0.72, 1.25, 'seated', undefined, true)],
        balloons: [say(0.34, 0.16, 'Do you understand what this costs you?', 0.4, 0.58)],
      },
      {
        layers: [CONS(0.58), F(0.5, 1.15, 'seated')],
        balloons: [say(0.5, 0.2, 'The ship. The licence. Probably the crew.', 0.5, 0.6)],
      },
      { layers: [WASH(0.1, 0.55, 'accent'), F(0.5, 1.4, 'reach', 'ink')], sfx: { x: 0.5, y: 0.5, text: 'SEND', size: 0.13 } },
      {
        layers: [S(120, 47), HULL(0.86), D(0.5, 0.3, 0.05, 'glow'), WRECK(19)],
        caption: 'Nine hundred and four drives went out at once. It took forty minutes.',
        captionAt: 'bottom',
      },
    ]),
  },
  {
    pal: 'ember',
    seed: 74,
    panels: grid(RS, [
      {
        layers: [CONS(0.55), F(0.2, 1.15, 'seated'), F(0.5, 1.2, 'stand', 'paper'), F(0.82, 1.15, 'stand', 'accent', true), DUST(30, 23)],
        balloons: [
          say(0.5, 0.1, 'It is out.', 0.5, 0.34),
          say(0.28, 0.6, 'It is out and it is not coming back.', 0.45, 0.5),
        ],
      },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'stand', 'paper')], caption: 'She did not cry.' },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'reach', 'paper')], caption: 'She sat down on the deck plate' },
      { layers: [WASH(0.1, 0.6, 'accent'), F(0.5, 1.4, 'seated', 'ink')], caption: 'and breathed like somebody put down.' },
    ]),
  },
];

/* ═══════════════════════ CHAPTER 8 ═══════════════════════ */

const ch8: PageSpec[] = [
  {
    pal: 'frost',
    seed: 81,
    panels: grid(RT, [
      {
        layers: [S(110, 5), HULL(0.8), D(0.74, 0.26, 0.08, 'far')],
        caption: 'Halcyon pulled the licence in eleven days. The hearing took four minutes, which felt about right.',
      },
      {
        layers: [CONS(0.6), F(0.3, 1.1, 'stand'), F(0.72, 1.05, 'stand', undefined, true)],
        balloons: [
          say(0.3, 0.14, 'They offered you a settlement to say it was a systems fault.', 0.4, 0.56),
          say(0.72, 0.66, 'They did.', 0.5, 0.32),
        ],
      },
      {
        layers: [WASH(0, 0.55, 'ink'), F(0.5, 1.4, 'stand')],
        balloons: [say(0.5, 0.2, 'A fault would have meant it could be undone. It cannot. That was the whole point.', 0.5, 0.72)],
      },
    ]),
  },
  {
    pal: 'bone',
    seed: 82,
    panels: grid(R4, [
      { layers: [SHELF(3), F(0.5, 1.25, 'stand', 'paper')], caption: 'Halvard teaches now. Bremen took her back on the strength of work they had never been allowed to see.' },
      { layers: [SHELF(9), DUST(40, 13)], caption: 'Her drives are on eleven hundred mirrors. Two are on a fishing boat.' },
      {
        layers: [SHELF(15), WASH(0, 0.3, 'ink'), F(0.3, 1.2, 'stand', 'paper'), F(0.72, 1.15, 'stand', undefined, true)],
        balloons: [
          say(0.3, 0.12, 'Somebody in Lagos cut a new score to the eleven minutes. It is better than mine.', 0.42, 0.58),
          say(0.7, 0.58, 'Does that bother you?', 0.5, 0.42),
          say(0.44, 0.86, 'It is the first thing in thirty years that did not.', 0.45, 0.56),
        ],
      },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.4, 'stand')], caption: 'I fly freight now. Smaller hull, worse routes.' },
      { layers: [S(80, 21), HULL(0.82)], caption: 'Idris stayed. Vey stayed. Bergen did not, and I do not hold it against him.', captionAt: 'bottom' },
    ]),
  },
  {
    pal: 'deep',
    seed: 83,
    panels: grid(R3, [
      {
        layers: [S(140, 29), D(0.68, 0.28, 0.11, 'far'), WRECK(31), HULL(0.88)],
        caption: 'People ask whether I would do it again, and they always ask it like the answer is obviously yes.',
      },
      {
        layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.4, 'stand')],
        balloons: [think(0.5, 0.24, 'It is not obvious. I lost a ship I spent nineteen years paying for.', 0.62)],
      },
      {
        layers: [S(90, 33), WIN('round'), D(0.5, 0.46, 0.17, 'glow')],
        balloons: [think(0.5, 0.8, 'The law was not wrong. That is the part nobody wants. It was correct and it would have buried her anyway.', 0.66)],
      },
      {
        layers: [WASH(0.1, 0.55, 'accent'), F(0.5, 1.35, 'stand', 'ink')],
        balloons: [think(0.5, 0.24, 'Correct and buried are allowed to be the same sentence. I just did not want to be the one holding the spade.', 0.64)],
      },
    ]),
  },
  {
    pal: 'deep',
    seed: 84,
    panels: grid(RS, [
      {
        layers: [S(160, 37), D(0.3, 0.34, 0.13, 'glow'), HULL(0.9), DUST(30, 41)],
        caption: 'Possession is nine tenths of the law. The last tenth is what you do in the hour before anybody owns it.',
      },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'stand', 'paper')], caption: 'Nine hundred' },
      { layers: [WASH(0, 0.5, 'ink'), F(0.5, 1.5, 'reach', 'paper')], caption: 'and four,' },
      { layers: [WASH(0.15, 0.6, 'accent'), F(0.5, 1.45, 'point', 'ink')], caption: 'still out there.' },
    ]),
  },
];

export const NINE_TENTHS_CHAPTERS: OriginalChapter[] = [
  { id: 'ch01', number: 1, title: 'Four Hundred Days', pages: ch1 },
  { id: 'ch02', number: 2, title: 'Cold Storage', pages: ch2 },
  { id: 'ch03', number: 3, title: 'The Manifest', pages: ch3 },
  { id: 'ch04', number: 4, title: 'Nine Tenths', pages: ch4 },
  { id: 'ch05', number: 5, title: 'Wake Cycle', pages: ch5 },
  { id: 'ch06', number: 6, title: 'What It Cost', pages: ch6 },
  { id: 'ch07', number: 7, title: 'The Filing', pages: ch7 },
  { id: 'ch08', number: 8, title: 'Open Channel', pages: ch8 },
];

export function findPage(chapterId: string, pageIndex: number): PageSpec | undefined {
  return NINE_TENTHS_CHAPTERS.find((c) => c.id === chapterId)?.pages[pageIndex];
}
