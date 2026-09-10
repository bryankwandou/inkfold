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

export type PaletteName =
  | 'void'
  | 'rust'
  | 'ember'
  | 'frost'
  | 'bone'
  | 'deep'
  | 'neon'
  | 'slate'
  | 'moss'
  | 'dusk';

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
  // Terrestrial set — added for Paper Streets, which happens at street level.
  //
  // `far` is the ground the panel starts on, usually sky, so it has to sit well
  // clear of `ink` in value or the silhouettes have nothing to be silhouettes
  // against. The first cut of moss and dusk had all three tones within a few
  // percent of black and the daylight pages came out as empty rectangles.
  neon: { far: '#150c22', near: '#2c1a44', ink: '#050208', accent: '#ff3d7f', glow: '#63e7ff', paper: '#efe8f4' },
  slate: { far: '#161a1f', near: '#2b323b', ink: '#07090b', accent: '#e05a3a', glow: '#9fb4c4', paper: '#eef1f4' },
  moss: { far: '#c2cdb4', near: '#5c6b51', ink: '#111710', accent: '#b4622c', glow: '#e8eddc', paper: '#f3f5ea' },
  dusk: { far: '#7a4a55', near: '#3b2440', ink: '#0d0812', accent: '#f08a4b', glow: '#ffcda4', paper: '#f4e9e4' },
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
  | { t: 'horizon'; y?: number }
  /* Street level. */
  | { t: 'city'; y?: number; density?: number; seed?: number; lit?: boolean }
  | { t: 'rain'; n?: number; slant?: number; seed?: number }
  | { t: 'room'; window?: boolean; y?: number }
  | { t: 'door'; x?: number; open?: boolean }
  | { t: 'stairs'; n?: number; flip?: boolean }
  | { t: 'crowd'; n?: number; y?: number; seed?: number }
  | { t: 'desk'; y?: number; clutter?: number; seed?: number }
  | { t: 'road'; vy?: number; lanes?: number }
  | { t: 'sign'; x?: number; y?: number; text?: string }
  | { t: 'trees'; y?: number; n?: number; seed?: number }
  | { t: 'screen'; x?: number; y?: number; w?: number; lines?: number; seed?: number }
  | { t: 'map'; seed?: number; mark?: [number, number] }
  | { t: 'blinds'; n?: number }
  /* Studio and stage. Added for Second Voice, which happens around a microphone. */
  | { t: 'booth'; y?: number; glass?: boolean; seed?: number }
  | { t: 'wave'; y?: number; amp?: number; n?: number; seed?: number; flat?: boolean }
  | { t: 'reel'; n?: number; y?: number; spin?: number }
  | { t: 'stage'; curtain?: boolean; y?: number }
  | { t: 'mic'; x?: number; y?: number; scale?: number }
  | { t: 'tower'; x?: number; h?: number; lit?: boolean };

export type Pose =
  | 'stand'
  | 'reach'
  | 'crouch'
  | 'suit'
  | 'seated'
  | 'float'
  | 'point'
  | 'slump'
  | 'walk'
  | 'run'
  | 'carry'
  | 'lean'
  | 'kneel'
  | 'umbrella';

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

    case 'city': {
      // Skyline as stacked blocks. Windows go in on a coarse grid so the
      // towers read as occupied rather than as bar charts.
      const rr = rng(l.seed ?? seed);
      const base = (l.y ?? 0.68) * h;
      const density = l.density ?? 1;
      let out = '';
      // Two ranks: a hazier one behind, the solid one in front.
      for (const rank of [0, 1]) {
        const shade = rank === 0 ? p.near : p.ink;
        // The back rank sits in haze. Letting the sky through it is what keeps a
        // skyline from reading as one flat black mass.
        const fade = rank === 0 ? ' opacity="0.5"' : '';
        const off = rank === 0 ? -h * 0.06 : 0;
        let x = -30;
        while (x < w + 30) {
          const bw = Math.max(26, (34 + rr() * 96) / density);
          const bh = (0.12 + rr() * 0.46) * h * (rank === 0 ? 0.8 : 1);
          const top = base + off - bh;
          // Buildings stop at the street line rather than running off the bottom
          // of the panel. Without that horizon a skyline reads as a row of bars.
          out += `<rect x="${x.toFixed(0)}" y="${top.toFixed(0)}" width="${bw.toFixed(0)}" height="${(base - top + 2).toFixed(0)}" fill="${shade}"${fade}/>`;
          // Roof furniture on the front rank: a stub or a mast, so the skyline
          // has a profile instead of a flat cut.
          if (rank === 1 && rr() > 0.55) {
            const sw = bw * (0.2 + rr() * 0.3);
            const sh = h * (0.01 + rr() * 0.035);
            out += `<rect x="${(x + bw * 0.2).toFixed(0)}" y="${(top - sh).toFixed(0)}" width="${sw.toFixed(0)}" height="${sh.toFixed(0)}" fill="${shade}"/>`;
          }
          if (rank === 1 && l.lit !== false) {
            for (let wy = top + 14; wy < base - 14; wy += 22) {
              for (let wx = x + 8; wx < x + bw - 10; wx += 16) {
                if (rr() > 0.62) {
                  const warm = rr() > 0.3;
                  out += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="7" height="10" fill="${warm ? p.glow : p.accent}" opacity="${(0.35 + rr() * 0.5).toFixed(2)}"/>`;
                }
              }
            }
          }
          x += bw + 4;
        }
      }
      out += `<rect y="${base.toFixed(0)}" width="${w}" height="${(h - base).toFixed(0)}" fill="${p.ink}"/>`;
      return out;
    }

    case 'rain': {
      const rr = rng(l.seed ?? seed + 11);
      const slant = l.slant ?? 0.22;
      let out = '';
      for (let i = 0; i < (l.n ?? 120); i++) {
        const x = rr() * (w + h * slant) - h * slant;
        const y = rr() * h;
        const len = 26 + rr() * 58;
        out += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + len * slant).toFixed(1)}" y2="${(y + len).toFixed(1)}" stroke="${p.paper}" stroke-width="${rr() > 0.8 ? 1.8 : 1}" opacity="${(0.12 + rr() * 0.3).toFixed(2)}"/>`;
      }
      return out;
    }

    case 'room': {
      // Interior: back wall, floor line, optional window throwing a light patch.
      const fy = (l.y ?? 0.74) * h;
      let out = `<rect width="${w}" height="${fy}" fill="${p.near}"/><rect y="${fy}" width="${w}" height="${h - fy}" fill="${p.ink}"/>`;
      out += `<rect y="${fy - 10}" width="${w}" height="10" fill="${p.ink}" opacity="0.7"/>`;
      if (l.window !== false) {
        const wx = w * 0.58;
        const wy = fy - h * 0.42;
        const ww = w * 0.3;
        const wh = h * 0.3;
        out += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="${p.glow}" opacity="0.3"/>`;
        out += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="none" stroke="${p.ink}" stroke-width="6"/>`;
        out += `<line x1="${wx + ww / 2}" y1="${wy}" x2="${wx + ww / 2}" y2="${wy + wh}" stroke="${p.ink}" stroke-width="5"/>`;
        // Light falling on the floor, sheared toward the viewer.
        out += `<path d="M${wx} ${fy} L${wx + ww} ${fy} L${wx + ww * 1.5} ${h} L${wx - ww * 0.35} ${h} Z" fill="${p.glow}" opacity="0.14"/>`;
      }
      return out;
    }

    case 'door': {
      const dx = (l.x ?? 0.5) * w;
      const dw = w * 0.22;
      const dh = h * 0.46;
      const dy = h * 0.72 - dh;
      let out = `<rect x="${dx - dw / 2}" y="${dy}" width="${dw}" height="${dh}" fill="${p.ink}"/>`;
      if (l.open) {
        out =
          `<rect x="${dx - dw / 2}" y="${dy}" width="${dw}" height="${dh}" fill="${p.glow}" opacity="0.55"/>` +
          `<path d="M${dx - dw / 2} ${dy + dh} L${dx + dw / 2} ${dy + dh} L${dx + dw} ${h} L${dx - dw} ${h} Z" fill="${p.glow}" opacity="0.18"/>` +
          `<rect x="${dx - dw / 2 - 9}" y="${dy - 9}" width="${dw + 18}" height="${dh + 9}" fill="none" stroke="${p.ink}" stroke-width="9"/>`;
      } else {
        out += `<circle cx="${dx + dw * 0.32}" cy="${dy + dh * 0.55}" r="5" fill="${p.glow}" opacity="0.8"/>`;
        out += `<rect x="${dx - dw / 2 - 9}" y="${dy - 9}" width="${dw + 18}" height="${dh + 9}" fill="none" stroke="${p.near}" stroke-width="9"/>`;
      }
      return out;
    }

    case 'stairs': {
      const n = l.n ?? 9;
      const stepW = w / (n + 2);
      const stepH = h / (n + 3);
      let out = '';
      for (let i = 0; i < n; i++) {
        const x = i * stepW;
        const y = h - (i + 1) * stepH;
        out += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(w - x).toFixed(0)}" height="${(stepH + 2).toFixed(0)}" fill="${p.ink}" opacity="${(0.55 + (i / n) * 0.45).toFixed(2)}"/>`;
      }
      const g = l.flip ? `transform="translate(${w},0) scale(-1,1)"` : '';
      return `<g ${g}>${out}</g>`;
    }

    case 'crowd': {
      // A rank of small bodies. Anonymous by design — nobody here has a name.
      const rr = rng(l.seed ?? seed + 5);
      const n = l.n ?? 14;
      const base = (l.y ?? 0.86) * h;
      let out = '';
      for (let i = 0; i < n; i++) {
        const x = rr() * w;
        const sc = 0.5 + rr() * 0.35;
        const bh = h * 0.3 * sc;
        const bw = bh * 0.26;
        out += `<g transform="translate(${x.toFixed(0)},${(base + rr() * 20).toFixed(0)})"><circle cx="0" cy="${(-bh).toFixed(0)}" r="${(bw * 0.44).toFixed(1)}" fill="${p.ink}"/><path d="M${-bw / 2} ${-bh * 0.82} q${bw / 2} ${-bh * 0.12} ${bw} 0 l${bw * 0.12} ${bh * 0.86} l${-bw * 1.24} 0 Z" fill="${p.ink}"/></g>`;
      }
      return out;
    }

    case 'desk': {
      // Foreground table edge with paperwork. The clerk's whole world.
      const y = (l.y ?? 0.7) * h;
      const rr = rng(l.seed ?? seed + 13);
      // Slab first, then the paperwork on top of it. The other way round put the
      // sheets behind whoever was sitting at the desk and sized them like doors.
      let out = `<rect x="0" y="${y}" width="${w}" height="${h - y}" fill="${p.ink}"/>`;
      out += `<rect x="0" y="${y}" width="${w}" height="7" fill="${p.glow}" opacity="0.3"/>`;
      for (let i = 0; i < (l.clutter ?? 6); i++) {
        const sw = w * (0.06 + rr() * 0.07);
        const sx = w * 0.04 + rr() * (w * 0.86);
        const sy = y + 16 + rr() * (h - y) * 0.5;
        out += `<g transform="translate(${sx.toFixed(0)},${sy.toFixed(0)}) rotate(${(rr() * 22 - 11).toFixed(1)})"><rect width="${sw.toFixed(0)}" height="${(sw * 0.74).toFixed(0)}" fill="${p.paper}" opacity="0.55" stroke="${p.paper}" stroke-opacity="0.3" stroke-width="1.5"/></g>`;
      }
      return out;
    }

    case 'road': {
      const vy = (l.vy ?? 0.42) * h;
      const vx = w / 2;
      let out = `<rect y="${vy}" width="${w}" height="${h - vy}" fill="${p.near}"/>`;
      out += `<path d="M${vx - 26} ${vy} L${vx + 26} ${vy} L${w * 1.3} ${h} L${-w * 0.3} ${h} Z" fill="${p.ink}"/>`;
      const lanes = l.lanes ?? 5;
      for (let i = 0; i < lanes; i++) {
        const t0 = (i + 0.15) / lanes;
        const t1 = (i + 0.6) / lanes;
        const at = (t: number) => {
          const tt = t * t; // perspective foreshortening
          return [vx + (vx - vx) * tt, vy + (h - vy) * tt, 4 + tt * 22];
        };
        const [, y0, w0] = at(t0);
        const [, y1, w1] = at(t1);
        out += `<path d="M${vx - w0 / 2} ${y0} L${vx + w0 / 2} ${y0} L${vx + w1 / 2} ${y1} L${vx - w1 / 2} ${y1} Z" fill="${p.paper}" opacity="0.5"/>`;
      }
      return out;
    }

    case 'sign': {
      const sx = (l.x ?? 0.5) * w;
      const sy = (l.y ?? 0.3) * h;
      const txt = (l.text ?? '').toUpperCase();
      const fs = Math.max(15, w * 0.05);
      const bw = Math.max(fs * 3, txt.length * fs * 0.62 + fs);
      const bh = fs * 1.8;
      return (
        `<rect x="${(sx - bw / 2).toFixed(0)}" y="${(sy - bh / 2).toFixed(0)}" width="${bw.toFixed(0)}" height="${bh.toFixed(0)}" rx="4" fill="${p.ink}" stroke="${p.accent}" stroke-width="3"/>` +
        `<text x="${sx.toFixed(0)}" y="${(sy + fs * 0.36).toFixed(0)}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="${fs.toFixed(0)}" font-weight="700" letter-spacing="${(fs * 0.08).toFixed(1)}" fill="${p.accent}" text-anchor="middle">${esc(txt)}</text>`
      );
    }

    case 'trees': {
      const rr = rng(l.seed ?? seed + 17);
      const base = (l.y ?? 0.78) * h;
      let out = '';
      for (let i = 0; i < (l.n ?? 10); i++) {
        const x = rr() * w;
        const th = h * (0.1 + rr() * 0.22);
        const tw = th * (0.42 + rr() * 0.26);
        // Trunk, then a canopy of overlapping lobes. Drawn as a spike first,
        // which read as an arrowhead rather than a tree.
        const cy = base - th * 0.66;
        out += `<rect x="${(x - tw * 0.06).toFixed(1)}" y="${(base - th * 0.6).toFixed(1)}" width="${(tw * 0.12).toFixed(1)}" height="${(th * 0.6).toFixed(1)}" fill="${p.ink}"/>`;
        const lobes: [number, number, number][] = [
          [x, cy - th * 0.14, tw * 0.34],
          [x - tw * 0.3, cy + th * 0.04, tw * 0.28],
          [x + tw * 0.3, cy + th * 0.02, tw * 0.27],
          [x - tw * 0.12, cy + th * 0.18, tw * 0.26],
          [x + tw * 0.16, cy + th * 0.2, tw * 0.24],
        ];
        for (const [lx, ly, lr] of lobes) {
          out += `<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="${lr.toFixed(1)}" fill="${p.ink}"/>`;
        }
      }
      // A band at the foot of the trunks, not a slab down to the panel edge.
      // Filling to the bottom made this layer opaque to everything drawn under
      // it — a road beneath a treeline simply vanished.
      out += `<rect y="${base}" width="${w}" height="${(h - base) * 0.12 + 6}" fill="${p.ink}"/>`;
      return out;
    }

    case 'screen': {
      // A monitor face: glow panel with ragged text rules on it.
      const rr = rng(l.seed ?? seed + 19);
      const sw = (l.w ?? 0.46) * w;
      const sh = sw * 0.66;
      const sx = (l.x ?? 0.5) * w - sw / 2;
      const sy = (l.y ?? 0.44) * h - sh / 2;
      let out = `<rect x="${sx.toFixed(0)}" y="${sy.toFixed(0)}" width="${sw.toFixed(0)}" height="${sh.toFixed(0)}" rx="6" fill="${p.ink}"/>`;
      out += `<rect x="${(sx + 8).toFixed(0)}" y="${(sy + 8).toFixed(0)}" width="${(sw - 16).toFixed(0)}" height="${(sh - 16).toFixed(0)}" fill="${p.glow}" opacity="0.22"/>`;
      const rows = l.lines ?? 7;
      for (let i = 0; i < rows; i++) {
        const ly = sy + 20 + (i * (sh - 34)) / rows;
        out += `<rect x="${(sx + 18).toFixed(0)}" y="${ly.toFixed(0)}" width="${((sw - 46) * (0.3 + rr() * 0.66)).toFixed(0)}" height="5" rx="2" fill="${p.glow}" opacity="${(0.4 + rr() * 0.5).toFixed(2)}"/>`;
      }
      out += `<path d="M${sx + sw * 0.36} ${sy + sh} L${sx + sw * 0.64} ${sy + sh} L${sx + sw * 0.72} ${sy + sh + 34} L${sx + sw * 0.28} ${sy + sh + 34} Z" fill="${p.ink}"/>`;
      return out;
    }

    case 'map': {
      // A street grid seen flat, with an optional circled block.
      const rr = rng(l.seed ?? seed + 23);
      let out = `<rect width="${w}" height="${h}" fill="${p.paper}"/>`;
      const cols: number[] = [];
      for (let x = w * 0.06; x < w * 0.96; x += w * (0.08 + rr() * 0.1)) cols.push(x);
      const rows: number[] = [];
      for (let y = h * 0.06; y < h * 0.96; y += h * (0.07 + rr() * 0.09)) rows.push(y);
      for (const x of cols)
        out += `<line x1="${x.toFixed(0)}" y1="0" x2="${(x + (rr() * 30 - 15)).toFixed(0)}" y2="${h}" stroke="${p.ink}" stroke-width="${rr() > 0.75 ? 5 : 2}" opacity="0.55"/>`;
      for (const y of rows)
        out += `<line x1="0" y1="${y.toFixed(0)}" x2="${w}" y2="${(y + (rr() * 24 - 12)).toFixed(0)}" stroke="${p.ink}" stroke-width="${rr() > 0.8 ? 5 : 2}" opacity="0.55"/>`;
      for (let i = 0; i < 26; i++) {
        const bx = rr() * w * 0.9;
        const by = rr() * h * 0.9;
        out += `<rect x="${bx.toFixed(0)}" y="${by.toFixed(0)}" width="${(10 + rr() * 30).toFixed(0)}" height="${(8 + rr() * 22).toFixed(0)}" fill="${p.ink}" opacity="0.16"/>`;
      }
      if (l.mark) {
        const mx = l.mark[0] * w;
        const my = l.mark[1] * h;
        out += `<circle cx="${mx}" cy="${my}" r="${(w * 0.11).toFixed(0)}" fill="none" stroke="${p.accent}" stroke-width="6" opacity="0.95"/>`;
        out += `<line x1="${mx}" y1="${my + w * 0.11}" x2="${mx + w * 0.18}" y2="${my + w * 0.26}" stroke="${p.accent}" stroke-width="5"/>`;
      }
      return out;
    }

    case 'blinds': {
      const n = l.n ?? 12;
      let out = '';
      for (let i = 0; i < n; i++) {
        const y = (i / n) * h;
        out += `<rect x="0" y="${y.toFixed(1)}" width="${w}" height="${(h / n) * 0.52}" fill="${p.ink}" opacity="0.62"/>`;
      }
      return out;
    }

    case 'booth': {
      // A recording booth from inside the control room: foam wall, a glass
      // panel with the talent behind it, and a boom arm coming in from the top.
      const rr = rng(l.seed ?? seed + 31);
      const gy = (l.y ?? 0.3) * h;
      let out = `<rect width="${w}" height="${h}" fill="${p.near}"/>`;
      // Acoustic wedges, tiled.
      const cell = Math.max(26, w / 14);
      for (let x = 0; x < w; x += cell) {
        for (let y = 0; y < h; y += cell) {
          out += `<path d="M${x} ${y + cell} L${x + cell / 2} ${y} L${x + cell} ${y + cell} Z" fill="${p.ink}" opacity="${(0.2 + rr() * 0.28).toFixed(2)}"/>`;
        }
      }
      if (l.glass !== false) {
        const gx = w * 0.12;
        const gw = w * 0.76;
        const gh = h * 0.46;
        out += `<rect x="${gx.toFixed(0)}" y="${gy.toFixed(0)}" width="${gw.toFixed(0)}" height="${gh.toFixed(0)}" fill="${p.far}"/>`;
        out += `<rect x="${gx.toFixed(0)}" y="${gy.toFixed(0)}" width="${gw.toFixed(0)}" height="${gh.toFixed(0)}" fill="${p.glow}" opacity="0.1"/>`;
        // A floor line and a stand inside, so the glass reads as a room rather
        // than a hole cut in the wall.
        const fy = gy + gh * 0.74;
        out += `<rect x="${gx.toFixed(0)}" y="${fy.toFixed(0)}" width="${gw.toFixed(0)}" height="${(gy + gh - fy).toFixed(0)}" fill="${p.ink}" opacity="0.55"/>`;
        out += `<line x1="${(gx + gw * 0.72).toFixed(0)}" y1="${fy.toFixed(0)}" x2="${(gx + gw * 0.72).toFixed(0)}" y2="${(gy + gh * 0.3).toFixed(0)}" stroke="${p.ink}" stroke-width="5"/>`;
        // The reflection streak that says "there is glass here".
        out += `<path d="M${gx + gw * 0.08} ${gy + gh} L${gx + gw * 0.42} ${gy} L${gx + gw * 0.56} ${gy} L${gx + gw * 0.22} ${gy + gh} Z" fill="${p.paper}" opacity="0.07"/>`;
        out += `<rect x="${gx.toFixed(0)}" y="${gy.toFixed(0)}" width="${gw.toFixed(0)}" height="${gh.toFixed(0)}" fill="none" stroke="${p.ink}" stroke-width="7"/>`;
      }
      return out;
    }

    case 'wave': {
      // An audio waveform, mirrored about its own centre line. `flat` kills the
      // amplitude, which is the panel where the take has stopped.
      const rr = rng(l.seed ?? seed + 37);
      const cy = (l.y ?? 0.5) * h;
      const n = l.n ?? 64;
      const amp = (l.flat ? 0.01 : (l.amp ?? 0.18)) * h;
      const step = w / n;
      let out = `<line x1="0" y1="${cy}" x2="${w}" y2="${cy}" stroke="${p.glow}" stroke-width="2" opacity="0.5"/>`;
      for (let i = 0; i < n; i++) {
        const env = Math.sin((i / n) * Math.PI);
        const a = amp * (0.25 + rr() * 0.75) * (0.35 + env * 0.8);
        out += `<rect x="${(i * step + step * 0.2).toFixed(1)}" y="${(cy - a).toFixed(1)}" width="${(step * 0.6).toFixed(1)}" height="${(a * 2).toFixed(1)}" rx="${(step * 0.3).toFixed(1)}" fill="${p.glow}" opacity="${(0.55 + rr() * 0.4).toFixed(2)}"/>`;
      }
      return out;
    }

    case 'reel': {
      // Tape reels on a deck. Two by default, sitting on a slab.
      const n = l.n ?? 2;
      const cy = (l.y ?? 0.46) * h;
      const rad = Math.min(h * 0.2, w / (n * 2.6));
      let out = `<rect y="${(cy + rad * 1.25).toFixed(0)}" width="${w}" height="${(h - cy - rad * 1.25).toFixed(0)}" fill="${p.ink}"/>`;
      const gap = w / (n + 1);
      const centres: number[] = [];
      for (let i = 0; i < n; i++) centres.push(gap * (i + 1));
      for (const cx of centres) {
        out += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${rad.toFixed(0)}" fill="${p.ink}"/>`;
        out += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(rad * 0.82).toFixed(0)}" fill="${p.near}"/>`;
        // Three spokes, rotated by `spin` so consecutive panels read as motion.
        for (let k = 0; k < 3; k++) {
          const a = (k / 3) * Math.PI * 2 + (l.spin ?? 0);
          out += `<line x1="${(cx + Math.cos(a) * rad * 0.2).toFixed(1)}" y1="${(cy + Math.sin(a) * rad * 0.2).toFixed(1)}" x2="${(cx + Math.cos(a) * rad * 0.72).toFixed(1)}" y2="${(cy + Math.sin(a) * rad * 0.72).toFixed(1)}" stroke="${p.ink}" stroke-width="${(rad * 0.16).toFixed(1)}"/>`;
        }
        out += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(rad * 0.16).toFixed(0)}" fill="${p.accent}"/>`;
      }
      // The tape between them.
      if (centres.length > 1) {
        out += `<path d="M${centres[0]} ${cy - rad} Q${w / 2} ${cy - rad * 1.7} ${centres[centres.length - 1]} ${cy - rad}" fill="none" stroke="${p.ink}" stroke-width="4"/>`;
      }
      return out;
    }

    case 'stage': {
      // A theatre stage seen from the house: boards, footlights, and drapes.
      const y = (l.y ?? 0.62) * h;
      let out = `<rect width="${w}" height="${h}" fill="${p.far}"/>`;
      out += `<rect y="${y.toFixed(0)}" width="${w}" height="${(h - y).toFixed(0)}" fill="${p.ink}"/>`;
      for (let i = 0; i < 9; i++) {
        const fx = (w / 9) * (i + 0.5);
        out += `<ellipse cx="${fx.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(w * 0.03).toFixed(0)}" ry="${(h * 0.012).toFixed(0)}" fill="${p.glow}" opacity="0.8"/>`;
        out += `<path d="M${fx - w * 0.05} ${y} L${fx + w * 0.05} ${y} L${fx + w * 0.13} ${y - h * 0.3} L${fx - w * 0.13} ${y - h * 0.3} Z" fill="${p.glow}" opacity="0.07"/>`;
      }
      if (l.curtain !== false) {
        for (const side of [0, 1]) {
          const base = side === 0 ? 0 : w;
          const dir = side === 0 ? 1 : -1;
          for (let i = 0; i < 4; i++) {
            const x = base + dir * (i * w * 0.045);
            out += `<path d="M${x} 0 Q${x + dir * w * 0.03} ${y * 0.5} ${x} ${y} L${x + dir * w * 0.05} ${y} Q${x + dir * w * 0.075} ${y * 0.5} ${x + dir * w * 0.05} 0 Z" fill="${p.ink}" opacity="${(0.95 - i * 0.12).toFixed(2)}"/>`;
          }
        }
      }
      return out;
    }

    case 'mic': {
      // A studio mic in close-up: capsule basket, shock mount, boom.
      const cx = (l.x ?? 0.5) * w;
      const cy = (l.y ?? 0.46) * h;
      const s = (l.scale ?? 1) * Math.min(w, h) * 0.3;
      let out = '';
      out += `<line x1="${cx.toFixed(0)}" y1="${(cy - s * 1.4).toFixed(0)}" x2="${cx.toFixed(0)}" y2="${(cy - s * 0.62).toFixed(0)}" stroke="${p.ink}" stroke-width="${(s * 0.09).toFixed(1)}"/>`;
      out += `<ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${(s * 0.62).toFixed(0)}" ry="${(s * 0.7).toFixed(0)}" fill="none" stroke="${p.ink}" stroke-width="${(s * 0.07).toFixed(1)}"/>`;
      out += `<rect x="${(cx - s * 0.34).toFixed(0)}" y="${(cy - s * 0.5).toFixed(0)}" width="${(s * 0.68).toFixed(0)}" height="${(s * 1.0).toFixed(0)}" rx="${(s * 0.32).toFixed(0)}" fill="${p.ink}"/>`;
      // Grille lines across the basket.
      for (let i = 1; i < 7; i++) {
        const gy = cy - s * 0.5 + (i * s) / 7;
        out += `<line x1="${(cx - s * 0.3).toFixed(0)}" y1="${gy.toFixed(1)}" x2="${(cx + s * 0.3).toFixed(0)}" y2="${gy.toFixed(1)}" stroke="${p.glow}" stroke-width="${(s * 0.03).toFixed(1)}" opacity="0.35"/>`;
      }
      out += `<rect x="${(cx - s * 0.12).toFixed(0)}" y="${(cy + s * 0.5).toFixed(0)}" width="${(s * 0.24).toFixed(0)}" height="${(s * 0.5).toFixed(0)}" fill="${p.ink}"/>`;
      out += `<circle cx="${(cx + s * 0.5).toFixed(0)}" cy="${(cy - s * 0.36).toFixed(0)}" r="${(s * 0.09).toFixed(0)}" fill="${p.accent}"/>`;
      return out;
    }

    case 'tower': {
      // A broadcast mast: tapering lattice with a lamp on top.
      const cx = (l.x ?? 0.5) * w;
      const top = (1 - (l.h ?? 0.72)) * h;
      const base = h;
      const half = w * 0.09;
      let out = `<path d="M${cx - half} ${base} L${cx - half * 0.13} ${top} L${cx + half * 0.13} ${top} L${cx + half} ${base} Z" fill="none" stroke="${p.ink}" stroke-width="5"/>`;
      const steps = 12;
      for (let i = 0; i < steps; i++) {
        const t0 = i / steps;
        const t1 = (i + 1) / steps;
        const y0 = base + (top - base) * t0;
        const y1 = base + (top - base) * t1;
        const hw0 = half * (1 - t0 * 0.87);
        const hw1 = half * (1 - t1 * 0.87);
        out += `<line x1="${(cx - hw0).toFixed(1)}" y1="${y0.toFixed(1)}" x2="${(cx + hw1).toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${p.ink}" stroke-width="3"/>`;
        out += `<line x1="${(cx + hw0).toFixed(1)}" y1="${y0.toFixed(1)}" x2="${(cx - hw1).toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${p.ink}" stroke-width="3"/>`;
        out += `<line x1="${(cx - hw1).toFixed(1)}" y1="${y1.toFixed(1)}" x2="${(cx + hw1).toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${p.ink}" stroke-width="3"/>`;
      }
      if (l.lit !== false) {
        out += `<circle cx="${cx.toFixed(0)}" cy="${top.toFixed(0)}" r="${(w * 0.022).toFixed(0)}" fill="${p.accent}"/>`;
        out += `<circle cx="${cx.toFixed(0)}" cy="${top.toFixed(0)}" r="${(w * 0.06).toFixed(0)}" fill="${p.accent}" opacity="0.18"/>`;
      }
      return out;
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

  // Head and body are separate primitives on purpose. They used to share one
  // path, with the head drawn as a near-closed arc — and SVG resolved that arc
  // to the circle above the start point rather than below it, so every figure
  // in both books wore its head a full radius too high, floating clear of the
  // shoulders. An explicit circle cannot be misread.
  type Build = { head: [number, number, number]; body: string };

  const builds: Record<Pose, Build> = {
    stand: {
      head: [0, -318, 46],
      body: 'M-52,-262 q52,-30 104,0 l16,150 -30,8 -6,-92 -8,196 -32,0 -8,-196 -6,92 -30,-8 Z',
    },
    reach: {
      head: [0, -318, 46],
      body: 'M-52,-262 q52,-30 104,0 l60,-70 22,20 -66,96 -8,146 -34,0 -6,-90 -10,90 -34,0 -6,-192 Z',
    },
    crouch: {
      head: [-10, -228, 44],
      body: 'M-64,-176 q56,-34 112,-4 l14,86 -28,10 -10,-52 -4,124 -34,0 -14,-92 -30,74 -30,-12 Z',
    },
    suit: {
      head: [0, -328, 54],
      body: 'M-64,-268 q64,-34 128,0 l18,168 -34,10 -8,-104 -10,214 -40,0 -10,-214 -8,104 -34,-10 Z',
    },
    seated: {
      head: [6, -256, 44],
      body: 'M-46,-202 q52,-28 100,0 l12,104 82,10 0,34 -116,0 -6,-64 -8,64 -36,0 Z',
    },
    float: {
      head: [0, -288, 46],
      body: 'M-52,-232 q52,-30 104,0 l58,50 -16,26 -62,-40 -10,120 -30,42 -26,-16 26,-58 -8,-88 -60,32 -14,-28 Z',
    },
    point: {
      head: [0, -318, 46],
      body: 'M-52,-262 q52,-30 104,0 l92,26 -8,30 -100,-14 -8,140 -32,0 -6,-88 -10,88 -32,0 -6,-192 Z',
    },
    slump: {
      head: [-14, -258, 44],
      body: 'M-62,-206 q54,-26 106,2 l10,120 -30,6 -8,-70 -6,150 -34,0 -10,-150 -8,70 -28,-6 Z',
    },
    walk: {
      head: [0, -318, 46],
      body: 'M-52,-262 q52,-30 104,0 l14,144 -28,10 -8,-88 -2,86 46,102 -28,16 -46,-104 -40,96 -28,-14 44,-104 -6,-84 -8,90 -28,-10 Z',
    },
    run: {
      head: [10, -310, 44],
      body: 'M-48,-256 q54,-30 104,2 l64,42 -16,28 -62,-32 -6,64 58,88 -28,20 -62,-92 -54,86 -28,-18 52,-86 -8,-70 -20,64 -28,-10 Z',
    },
    carry: {
      head: [0, -318, 46],
      body: 'M-56,-262 q56,-30 112,0 l6,52 44,10 0,30 -50,-6 -6,158 -32,0 -6,-96 -8,96 -32,0 -6,-192 Z',
    },
    lean: {
      head: [22, -312, 44],
      body: 'M-30,-256 q52,-28 100,0 l10,132 -28,8 -6,-84 -4,190 -34,0 -12,-188 -46,-2 0,-30 44,0 Z',
    },
    kneel: {
      head: [-4, -234, 44],
      body: 'M-54,-182 q54,-28 106,0 l12,96 -28,8 -8,-56 0,90 66,4 0,32 -104,0 -8,-64 -34,58 -28,-16 Z',
    },
    umbrella: {
      head: [0, -308, 44],
      body:
        'M-50,-254 q50,-28 100,0 l12,140 -28,8 -6,-86 -6,186 -32,0 -8,-186 -6,86 -28,-8 Z' +
        ' M-4,-392 q-96,10 -104,58 q52,-26 104,-14 q52,-12 104,14 q-8,-48 -104,-58 Z' +
        ' M-2,-392 l0,150 -18,0 0,-150 Z',
    },
  };

  const { head, body } = builds[pose];
  const flip = l.flip ? ` scale(-1,1)` : '';

  // A silhouette on a dark ground is only a silhouette if the ground is lighter.
  // Half these panels are ink figures against ink buildings, so every figure
  // carries a rim drawn behind its own fill.
  const rim = l.fill === 'paper' ? p.ink : p.paper;
  const shape =
    `<circle cx="${head[0]}" cy="${head[1]}" r="${head[2]}"/><path d="${body}"/>`;

  return (
    `<g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) scale(${s.toFixed(3)})${flip}">` +
    `<g fill="none" stroke="${rim}" stroke-width="8" stroke-linejoin="round" opacity="0.26">${shape}</g>` +
    `<g fill="${fill}">${shape}</g>` +
    `</g>`
  );
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

/* ── Glossary ─────────────────────────────────────────────────────── */

/**
 * One line per layer, for the page that explains how this works to readers.
 *
 * Typed as a full record over `Layer['t']`, so adding a layer to the union
 * without describing it here is a build error rather than a gap on the page.
 */
export const LAYER_NOTES: Record<Layer['t'], string> = {
  stars: 'A seeded starfield. Same seed, same sky, on every request.',
  disc: 'A planet, a moon, or a lamp — whichever the script needs a circle to be.',
  hull: 'Ship plating in profile, with the panel lines running off the edge.',
  wreck: 'A broken hull: spar, torn plate, and debris scattered by seed.',
  corridor: 'One-point perspective down a passage, vanishing where told.',
  window: 'A port cut through the near wall, round or square.',
  ribs: 'Structural ribs receding, which is how a corridor gets its depth.',
  console: 'A working surface with readouts, drawn as bars rather than glyphs.',
  pod: 'A cold-storage capsule, lid glass, occupant implied.',
  shelves: 'Racking. Used for drive archives and, at street level, files.',
  figure: 'A person, from a pose name and a scale. Fourteen poses so far.',
  wash: 'A vertical gradient over everything below it — light, smoke, or dread.',
  dust: 'Motes. Cheap, and it stops flat fills from reading as flat.',
  beam: 'A shaft of light with a soft edge, angled from a source off-panel.',
  horizon: 'A single line that turns an empty field into a place.',
  city: 'A skyline in three ranks, the back ones hazed, roofs cluttered in front.',
  rain: 'Slanted strokes at a given density. It is a mood layer and it knows it.',
  room: 'Interior walls and a floor line, with an optional window.',
  door: 'A doorway, open or shut, which is usually the point of the panel.',
  stairs: 'A flight in profile, run and rise from a step count.',
  crowd: 'Repeated figures at falling scale, so a street reads as populated.',
  desk: 'A desk slab with paperwork on top of it, cluttered to taste.',
  road: 'Asphalt in perspective with lane markings that converge properly.',
  sign: 'Lettering on a plate. The only text in the art that is not dialogue.',
  trees: 'Trunks with lobed canopies and a band of ground at their feet.',
  screen: 'A monitor with lines of text, drawn as rules of varying length.',
  map: 'A plausible street grid from a seed, with an optional mark on it.',
  blinds: 'Horizontal slats over whatever is behind them.',
  booth: 'A recording booth from the control room: foam, glass, and a boom arm.',
  wave: 'A waveform. Flatten it and the panel is a take that has stopped.',
  reel: 'Tape reels on a deck, spokes rotated so consecutive panels read as motion.',
  stage: 'A stage from the house — boards, footlights, and drapes down both sides.',
  mic: 'A studio microphone in close-up, basket and shock mount included.',
  tower: 'A broadcast mast, lattice tapering to a lamp.',
};
