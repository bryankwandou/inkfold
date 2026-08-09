// Inkfold Studio — a comic page renderer.
//
// Every panel on an Inkfold original is drawn here, in code, from a scene
// description. No stock art, no external assets, nothing traced. That is what
// lets us put our own work on the same shelf as the CC BY and public-domain
// titles without hand-waving about where it came from.
//
// The house style is flat silhouette: strong shapes, a tight palette per
// chapter, and depth built from stacked layers rather than rendered detail.
// It suits a machine that draws with polygons and it dodges the trap of trying
// to fake a human hand at close range.

/** Deterministic PRNG. Same seed, same stars, every request. */
export function rng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export type PaletteName = 'void' | 'rust' | 'ember' | 'frost' | 'bone' | 'deep';

type Palette = {
  far: string;
  near: string;
  ink: string;
  accent: string;
  glow: string;
  paper: string;
};

export const PALETTES: Record<PaletteName, Palette> = {
  void: { far: '#070a12', near: '#111a2b', ink: '#02040a', accent: '#d93a22', glow: '#7fd6d1', paper: '#eae4d6' },
  rust: { far: '#170d09', near: '#301a10', ink: '#0a0503', accent: '#e2703a', glow: '#f0b866', paper: '#f0e6d4' },
  ember: { far: '#1a0a08', near: '#3d1410', ink: '#0d0403', accent: '#ff6b45', glow: '#ffc178', paper: '#f5e9dc' },
  frost: { far: '#0a1116', near: '#162b36', ink: '#030809', accent: '#4fb8c9', glow: '#b8e8f0', paper: '#e4eef2' },
  bone: { far: '#1b1a17', near: '#33302a', ink: '#0b0a09', accent: '#c9a227', glow: '#e8d9a0', paper: '#f2ece0' },
  deep: { far: '#04060e', near: '#0a1020', ink: '#010208', accent: '#6c5ce7', glow: '#9bb7ff', paper: '#e6e8f2' },
};

/* ── Layer vocabulary ─────────────────────────────────────────────── */

export type Layer =
  | { t: 'stars'; n?: number; seed?: number }
  | { t: 'disc'; cx: number; cy: number; r: number; fill?: 'far' | 'accent' | 'glow' | 'ink'; ring?: number }
  | { t: 'hull'; y: number; flip?: boolean; scale?: number }
  | { t: 'wreck'; seed?: number }
  | { t: 'corridor'; vy?: number }
  | { t: 'window'; shape?: 'round' | 'rect' }
  | { t: 'ribs'; n?: number }
  | { t: 'console'; y?: number }
  | { t: 'pod' }
  | { t: 'shelves'; seed?: number }
  | { t: 'figure'; x: number; scale?: number; pose?: Pose; fill?: 'ink' | 'accent' | 'paper'; flip?: boolean }
  | { t: 'wash'; from?: number; to?: number; color?: 'accent' | 'glow' | 'ink' }
  | { t: 'dust'; n?: number; seed?: number }
  | { t: 'beam'; x?: number; w?: number }
  | { t: 'horizon'; y?: number };

export type Pose = 'stand' | 'reach' | 'crouch' | 'suit' | 'seated' | 'float' | 'point' | 'slump';

export type Balloon = {
  x: number; // 0..1 within panel
  y: number;
  w?: number;
  text: string;
  tail?: number; // 0..1 horizontal position of tail foot, omit for none
  kind?: 'speech' | 'thought' | 'radio';
};

export type Panel = {
  x: number; // fractions of page
  y: number;
  w: number;
  h: number;
  pal?: PaletteName;
  layers: Layer[];
  caption?: string;
  captionAt?: 'top' | 'bottom';
  balloons?: Balloon[];
  sfx?: { x: number; y: number; text: string; size?: number };
};

export type PageSpec = {
  pal: PaletteName;
  panels: Panel[];
  seed?: number;
};

const W = 1000;
const H = 1500;
const GUT = 14; // gutter — the space between panels

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Greedy wrap on an average-advance estimate. Good enough for balloon copy. */
function wrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (!line.length) line = w;
    else if ((line + ' ' + w).length <= maxChars) line += ' ' + w;
    else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/* ── Layer painters ───────────────────────────────────────────────── */

function paintLayer(l: Layer, p: Palette, w: number, h: number, seed: number): string {
  const r = rng(seed);

  switch (l.t) {
    case 'stars': {
      const n = l.n ?? 90;
      const rr = rng(l.seed ?? seed);
      let out = '';
      for (let i = 0; i < n; i++) {
        const x = rr() * w;
        const y = rr() * h;
        const s = rr();
        const rad = s > 0.94 ? 2.4 : s > 0.75 ? 1.4 : 0.8;
        out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad}" fill="${p.paper}" opacity="${(0.25 + s * 0.6).toFixed(2)}"/>`;
      }
      return out;
    }

    case 'disc': {
      const fill =
        l.fill === 'accent' ? p.accent : l.fill === 'glow' ? p.glow : l.fill === 'ink' ? p.ink : p.near;
      const cx = l.cx * w;
      const cy = l.cy * h;
      const rad = l.r * w;
      let out = `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fill}"/>`;
      if (l.ring) {
        out += `<ellipse cx="${cx}" cy="${cy}" rx="${rad * l.ring}" ry="${rad * l.ring * 0.22}" fill="none" stroke="${p.glow}" stroke-width="3" opacity="0.5"/>`;
      }
      return out;
    }

    case 'horizon': {
      const y = (l.y ?? 0.72) * h;
      return `<rect x="0" y="${y}" width="${w}" height="${h - y}" fill="${p.ink}"/>`;
    }

    case 'hull': {
      // A slab of ship crossing the frame. Angular, no curves — reads as mass.
      const y = l.y * h;
      const s = l.scale ?? 1;
      const d = `M${-40} ${y} L${w * 0.22} ${y - 70 * s} L${w * 0.68} ${y - 92 * s} L${w + 40} ${y - 30 * s} L${w + 40} ${y + 190 * s} L${-40} ${y + 150 * s} Z`;
      const g = l.flip ? `transform="translate(${w},0) scale(-1,1)"` : '';
      return `<g ${g}><path d="${d}" fill="${p.ink}"/><path d="M${w * 0.24} ${y - 62 * s} L${w * 0.62} ${y - 80 * s} L${w * 0.6} ${y - 58 * s} L${w * 0.26} ${y - 42 * s} Z" fill="${p.glow}" opacity="0.35"/></g>`;
    }

    case 'wreck': {
      const rr = rng(l.seed ?? seed);
      let out = '';
      for (let i = 0; i < 9; i++) {
        const cx = rr() * w;
        const cy = h * (0.25 + rr() * 0.6);
        const sz = 24 + rr() * 90;
        const rot = rr() * 360;
        out += `<g transform="translate(${cx.toFixed(0)},${cy.toFixed(0)}) rotate(${rot.toFixed(0)})"><path d="M${-sz / 2} ${-sz / 6} L${sz / 3} ${-sz / 2} L${sz / 2} ${sz / 5} L${-sz / 4} ${sz / 2} Z" fill="${p.ink}" opacity="0.92"/></g>`;
      }
      return out;
    }

    case 'corridor': {
      // One-point perspective: a vanishing rectangle with rib lines to it.
      const vx = w / 2;
      const vy = (l.vy ?? 0.48) * h;
      const iw = w * 0.2;
      const ih = h * 0.16;
      let out = `<rect x="0" y="0" width="${w}" height="${h}" fill="${p.near}"/>`;
      out += `<rect x="${vx - iw / 2}" y="${vy - ih / 2}" width="${iw}" height="${ih}" fill="${p.glow}" opacity="0.22"/>`;
      const corners = [
        [0, 0],
        [w, 0],
        [w, h],
        [0, h],
      ];
      const inner = [
        [vx - iw / 2, vy - ih / 2],
        [vx + iw / 2, vy - ih / 2],
        [vx + iw / 2, vy + ih / 2],
        [vx - iw / 2, vy + ih / 2],
      ];
      for (let i = 0; i < 4; i++) {
        const a = corners[i];
        const b = inner[i];
        const c = corners[(i + 1) % 4];
        const d = inner[(i + 1) % 4];
        const shade = i === 0 ? 0.0 : i === 2 ? 0.45 : 0.7;
        out += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${d[0]} ${d[1]} L${c[0]} ${c[1]} Z" fill="${p.ink}" opacity="${shade}"/>`;
      }
      for (let k = 1; k <= 5; k++) {
        const t = k / 6;
        const x1 = vx - iw / 2 + (0 - (vx - iw / 2)) * (1 - t);
        const y1 = vy - ih / 2 + (0 - (vy - ih / 2)) * (1 - t);
        const x2 = vx + iw / 2 + (w - (vx + iw / 2)) * (1 - t);
        const y2 = vy + ih / 2 + (h - (vy + ih / 2)) * (1 - t);
        out += `<rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="none" stroke="${p.ink}" stroke-width="2.5" opacity="0.55"/>`;
      }
      return out;
    }

    case 'window': {
      // Interior framing: everything outside the aperture is hull.
      const cx = w / 2;
      const cy = h * 0.46;
      const rad = Math.min(w, h) * 0.31;
      const id = `m${seed}`;
      const hole =
        l.shape === 'rect'
          ? `<rect x="${cx - rad}" y="${cy - rad * 0.8}" width="${rad * 2}" height="${rad * 1.6}" rx="18" fill="#000"/>`
          : `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="#000"/>`;
      return `<mask id="${id}"><rect width="${w}" height="${h}" fill="#fff"/>${hole}</mask><rect width="${w}" height="${h}" fill="${p.ink}" mask="url(#${id})"/><circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${p.glow}" stroke-width="4" opacity="0.4"/>`;
    }

    case 'ribs': {
      const n = l.n ?? 7;
      let out = '';
      for (let i = 0; i < n; i++) {
        const x = (i / (n - 1)) * w;
        out += `<rect x="${x - 9}" y="0" width="18" height="${h}" fill="${p.ink}" opacity="0.55"/>`;
      }
      return out;
    }

    case 'console': {
      const y = (l.y ?? 0.68) * h;
      let out = `<path d="M0 ${y + 40} L${w * 0.18} ${y - 26} L${w * 0.82} ${y - 26} L${w} ${y + 40} L${w} ${h} L0 ${h} Z" fill="${p.ink}"/>`;
      const rr = rng(seed + 7);
      for (let i = 0; i < 22; i++) {
        const x = w * 0.2 + rr() * w * 0.6;
        const yy = y - 14 + rr() * 34;
        const on = rr() > 0.45;
        out += `<rect x="${x.toFixed(0)}" y="${yy.toFixed(0)}" width="${(6 + rr() * 16).toFixed(0)}" height="5" rx="2" fill="${on ? p.glow : p.accent}" opacity="${on ? 0.75 : 0.5}"/>`;
      }
      return out;
    }

    case 'pod': {
      // A cold-storage pod, seen side-on.
      const cx = w / 2;
      const cy = h * 0.55;
      const pw = w * 0.62;
      const ph = h * 0.26;
      return (
        `<rect x="${cx - pw / 2}" y="${cy - ph / 2}" width="${pw}" height="${ph}" rx="${ph / 2}" fill="${p.ink}"/>` +
        `<rect x="${cx - pw / 2 + 26}" y="${cy - ph / 2 + 20}" width="${pw - 52}" height="${ph - 40}" rx="${(ph - 40) / 2}" fill="${p.glow}" opacity="0.28"/>` +
        `<ellipse cx="${cx - pw * 0.16}" cy="${cy}" rx="${pw * 0.1}" ry="${ph * 0.17}" fill="${p.ink}" opacity="0.85"/>` +
        `<rect x="${cx - pw / 2 - 16}" y="${cy + ph / 2 - 6}" width="${pw + 32}" height="16" rx="6" fill="${p.ink}"/>`
      );
    }

    case 'shelves': {
      const rr = rng(l.seed ?? seed);
      let out = `<rect width="${w}" height="${h}" fill="${p.near}"/>`;
      const rows = 6;
      for (let r0 = 0; r0 < rows; r0++) {
        const y = (r0 / rows) * h + 18;
        out += `<rect x="0" y="${y + h / rows - 26}" width="${w}" height="9" fill="${p.ink}"/>`;
        let x = 8;
        while (x < w - 14) {
          const bw = 9 + rr() * 22;
          const bh = h / rows - 40 - rr() * 18;
          out += `<rect x="${x.toFixed(0)}" y="${(y + h / rows - 26 - bh).toFixed(0)}" width="${bw.toFixed(0)}" height="${bh.toFixed(0)}" fill="${rr() > 0.82 ? p.accent : p.ink}" opacity="${(0.65 + rr() * 0.35).toFixed(2)}"/>`;
          x += bw + 3;
        }
      }
      return out;
    }

    case 'wash': {
      const from = l.from ?? 0;
      const to = l.to ?? 1;
      const c = l.color === 'accent' ? p.accent : l.color === 'ink' ? p.ink : p.glow;
      const id = `w${seed}${Math.round(from * 100)}`;
      return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="${from}"/><stop offset="1" stop-color="${c}" stop-opacity="${to}"/></linearGradient><rect width="${w}" height="${h}" fill="url(#${id})"/>`;
    }

    case 'dust': {
      const rr = rng(l.seed ?? seed + 3);
      let out = '';
      for (let i = 0; i < (l.n ?? 40); i++) {
        out += `<circle cx="${(rr() * w).toFixed(1)}" cy="${(rr() * h).toFixed(1)}" r="${(0.6 + rr() * 2).toFixed(1)}" fill="${p.paper}" opacity="${(0.1 + rr() * 0.35).toFixed(2)}"/>`;
      }
      return out;
    }

    case 'beam': {
      const x = (l.x ?? 0.5) * w;
      const bw = (l.w ?? 0.18) * w;
      const id = `b${seed}`;
      return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.glow}" stop-opacity="0.55"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/></linearGradient><path d="M${x - bw * 0.25} 0 L${x + bw * 0.25} 0 L${x + bw} ${h} L${x - bw} ${h} Z" fill="url(#${id})"/>`;
    }

    case 'figure':
      return paintFigure(l, p, w, h);
  }
  return '';
}

/**
 * Silhouette figures. Deliberately not detailed — at this scale a shape reads
 * as a person and a face does not read as a face.
 */
function paintFigure(l: Extract<Layer, { t: 'figure' }>, p: Palette, w: number, h: number): string {
  const s = (l.scale ?? 1) * h * 0.0016;
  const x = l.x * w;
  const y = h;
  const fill = l.fill === 'accent' ? p.accent : l.fill === 'paper' ? p.paper : p.ink;
  const pose = l.pose ?? 'stand';

  const bodies: Record<Pose, string> = {
    stand:
      'M0,-330 a46,46 0 1,1 0.1,0 M-52,-262 q52,-30 104,0 l16,150 -30,8 -6,-92 -8,196 -32,0 -8,-196 -6,92 -30,-8 Z',
    reach:
      'M0,-330 a46,46 0 1,1 0.1,0 M-52,-262 q52,-30 104,0 l60,-70 22,20 -66,96 -8,146 -34,0 -6,-90 -10,90 -34,0 -6,-192 Z',
    crouch:
      'M-10,-236 a44,44 0 1,1 0.1,0 M-64,-176 q56,-34 112,-4 l14,86 -28,10 -10,-52 -4,124 -34,0 -14,-92 -30,74 -30,-12 Z',
    suit:
      'M0,-338 a56,52 0 1,1 0.1,0 M-64,-268 q64,-34 128,0 l18,168 -34,10 -8,-104 -10,214 -40,0 -10,-214 -8,104 -34,-10 Z',
    seated:
      'M6,-268 a44,44 0 1,1 0.1,0 M-46,-202 q52,-28 100,0 l12,104 82,10 0,34 -116,0 -6,-64 -8,64 -36,0 Z',
    float:
      'M0,-300 a46,46 0 1,1 0.1,0 M-52,-232 q52,-30 104,0 l58,50 -16,26 -62,-40 -10,120 -30,42 -26,-16 26,-58 -8,-88 -60,32 -14,-28 Z',
    point:
      'M0,-330 a46,46 0 1,1 0.1,0 M-52,-262 q52,-30 104,0 l92,26 -8,30 -100,-14 -8,140 -32,0 -6,-88 -10,88 -32,0 -6,-192 Z',
    slump:
      'M-14,-268 a44,44 0 1,1 0.1,0 M-62,-206 q54,-26 106,2 l10,120 -30,6 -8,-70 -6,150 -34,0 -10,-150 -8,70 -28,-6 Z',
  };

  const flip = l.flip ? ` scale(-1,1)` : '';
  return `<g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) scale(${s.toFixed(3)})${flip}"><path d="${bodies[pose]}" fill="${fill}"/></g>`;
}

/* ── Balloons and captions ────────────────────────────────────────── */

function paintBalloon(b: Balloon, p: Palette, pw: number, ph: number, i: number): string {
  const kind = b.kind ?? 'speech';
  const maxW = (b.w ?? 0.46) * pw;
  const fs = Math.max(15, Math.min(21, pw * 0.032));
  const chars = Math.floor(maxW / (fs * 0.5));
  const lines = wrap(b.text, Math.max(12, chars));
  const lh = fs * 1.32;
  const padX = fs * 0.85;
  const padY = fs * 0.75;
  const boxW = maxW;
  const boxH = lines.length * lh + padY * 2;
  const x = b.x * pw - boxW / 2;
  const y = b.y * ph - boxH / 2;

  const bg = kind === 'radio' ? p.ink : p.paper;
  const fg = kind === 'radio' ? p.paper : p.ink;
  const stroke = kind === 'radio' ? p.glow : p.ink;

  let shape: string;
  if (kind === 'thought') {
    shape = `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="${boxH / 2.4}" fill="${bg}" stroke="${stroke}" stroke-width="2.5"/>`;
  } else if (kind === 'radio') {
    shape = `<path d="M${x} ${y} L${x + boxW} ${y} L${x + boxW - 12} ${y + boxH} L${x + 12} ${y + boxH} Z" fill="${bg}" stroke="${stroke}" stroke-width="2.5"/>`;
  } else {
    shape = `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="14" fill="${bg}" stroke="${stroke}" stroke-width="2.5"/>`;
  }

  let tail = '';
  if (b.tail !== undefined) {
    const tx = x + boxW * b.tail;
    const ty = y + boxH;
    tail = `<path d="M${tx - 13} ${ty - 3} L${tx + 15} ${ty - 3} L${tx - 4} ${ty + 30} Z" fill="${bg}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${tx - 10} ${ty - 5} L${tx + 12} ${ty - 5} Z" fill="${bg}"/>`;
  }

  const text = lines
    .map(
      (ln, k) =>
        `<tspan x="${(x + boxW / 2).toFixed(1)}" dy="${k === 0 ? 0 : lh}">${esc(ln)}</tspan>`,
    )
    .join('');

  return `${shape}${tail}<text x="${(x + boxW / 2).toFixed(1)}" y="${(y + padY + fs * 0.85).toFixed(1)}" font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif" font-size="${fs.toFixed(1)}" font-weight="500" fill="${fg}" text-anchor="middle">${text}</text>`;
}

function paintCaption(txt: string, p: Palette, pw: number, ph: number, at: 'top' | 'bottom'): string {
  const fs = Math.max(14, Math.min(19, pw * 0.028));
  const lines = wrap(txt, Math.floor(pw / (fs * 0.52)));
  const lh = fs * 1.34;
  const boxH = lines.length * lh + fs * 1.1;
  const y = at === 'top' ? 0 : ph - boxH;
  const text = lines
    .map((ln, k) => `<tspan x="${fs * 0.9}" dy="${k === 0 ? 0 : lh}">${esc(ln)}</tspan>`)
    .join('');
  return `<rect x="0" y="${y}" width="${pw}" height="${boxH}" fill="${p.paper}"/><text x="${fs * 0.9}" y="${(y + fs * 1.4).toFixed(1)}" font-family="Georgia, 'Times New Roman', serif" font-size="${fs.toFixed(1)}" font-style="italic" fill="${p.ink}">${text}</text>`;
}

/* ── Page assembly ────────────────────────────────────────────────── */

export function renderPage(spec: PageSpec): string {
  const basePal = PALETTES[spec.pal];
  const seed0 = spec.seed ?? 1;

  let body = `<rect width="${W}" height="${H}" fill="${basePal.ink}"/>`;

  spec.panels.forEach((pn, idx) => {
    const p = PALETTES[pn.pal ?? spec.pal];
    const px = pn.x * W + GUT / 2;
    const py = pn.y * H + GUT / 2;
    const pw = pn.w * W - GUT;
    const ph = pn.h * H - GUT;
    const clip = `c${idx}`;
    const seed = seed0 * 131 + idx * 17 + 5;

    let inner = `<rect width="${pw}" height="${ph}" fill="${p.far}"/>`;
    pn.layers.forEach((l, li) => {
      inner += paintLayer(l, p, pw, ph, seed + li * 29);
    });

    if (pn.caption) inner += paintCaption(pn.caption, p, pw, ph, pn.captionAt ?? 'top');
    (pn.balloons ?? []).forEach((b, bi) => {
      inner += paintBalloon(b, p, pw, ph, bi);
    });
    if (pn.sfx) {
      const fs = (pn.sfx.size ?? 0.11) * pw;
      inner += `<text x="${(pn.sfx.x * pw).toFixed(0)}" y="${(pn.sfx.y * ph).toFixed(0)}" font-family="Impact, 'Arial Black', sans-serif" font-size="${fs.toFixed(0)}" fill="${p.accent}" stroke="${p.paper}" stroke-width="${(fs * 0.05).toFixed(1)}" paint-order="stroke" text-anchor="middle" transform="rotate(-6 ${(pn.sfx.x * pw).toFixed(0)} ${(pn.sfx.y * ph).toFixed(0)})">${esc(pn.sfx.text)}</text>`;
    }

    body +=
      `<defs><clipPath id="${clip}"><rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="3"/></clipPath></defs>` +
      `<g clip-path="url(#${clip})"><g transform="translate(${px},${py})">${inner}</g></g>` +
      `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="3" fill="none" stroke="${basePal.paper}" stroke-width="3" opacity="0.9"/>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">${body}</svg>`;
}
