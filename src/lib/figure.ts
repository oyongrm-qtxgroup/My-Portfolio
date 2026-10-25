// Lays out a figure from a small spec (docs/DESIGN_PLAN.md Step 7). The grammar:
// solid box = deterministic code, dashed box = model-driven, stamp box = a person
// approves, dotted margin-red edge = what happens when it fails (the only red, DS7),
// circled numerals = the matching paragraphs in the prose. Two placements come from
// one spec: `wide` (columns and rows) and `narrow` (one column, for phones).

export type NodeKind = 'code' | 'model' | 'person';
export type EdgeKind = 'one' | 'two' | 'fail';

export interface FigNode {
  id: string;
  title: string;
  note?: string;
  kind?: NodeKind;
  /** Circled numeral matching a paragraph in the prose. */
  n?: number;
  /** Column and row in the wide placement. */
  at: [number, number];
}

export interface FigEdge {
  from: string;
  to: string;
  kind?: EdgeKind;
  /** Shown beside a failure edge ("system down / slot just taken"). */
  label?: string;
}

export interface FigSpec {
  nodes: FigNode[];
  edges: FigEdge[];
}

export interface Box {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string[];
  note: string[];
  n?: number;
}

export interface Line {
  d: string;
  kind: EdgeKind;
  /** Arrowheads: one path each, filled with the edge colour. */
  heads: string[];
}

export interface Label {
  x: number;
  y: number;
  lines: string[];
  anchor: 'start' | 'end' | 'middle';
}

export interface Layout {
  width: number;
  height: number;
  boxes: Box[];
  lines: Line[];
  labels: Label[];
}

// Type in the drawing: Plex Mono, so a character is 0.6 em wide and text can be
// wrapped exactly. Titles are upper case with 0.05 em tracking.
export const TYPE = { title: 13, note: 12, label: 11, lineGap: 1.45 };
const PAD = 12;
const charTitle = TYPE.title * 0.65;
const charNote = TYPE.note * 0.6;
const charLabel = TYPE.label * 0.6;

export function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function textBlock(node: FigNode, w: number) {
  const inner = w - PAD * 2;
  const title = wrap(node.title.toUpperCase(), Math.floor(inner / charTitle));
  const note = node.note ? wrap(node.note, Math.floor(inner / charNote)) : [];
  const h =
    PAD +
    title.length * TYPE.title * TYPE.lineGap +
    (note.length ? 4 + note.length * TYPE.note * TYPE.lineGap : 0) +
    PAD -
    4;
  return { title, note, h: Math.ceil(h) };
}

const arrow = (x: number, y: number, dir: 'r' | 'l' | 'u' | 'd', s = 7) => {
  const h = s / 2 + 0.5;
  if (dir === 'r') return `M${x} ${y} l${-s} ${-h} v${2 * h}z`;
  if (dir === 'l') return `M${x} ${y} l${s} ${-h} v${2 * h}z`;
  if (dir === 'd') return `M${x} ${y} l${-h} ${-s} h${2 * h}z`;
  return `M${x} ${y} l${-h} ${s} h${2 * h}z`;
};

/** Columns and rows, for wide screens. */
export function layoutWide(spec: FigSpec, width = 960, gapX = 36, gapY = 64): Layout {
  const cols = Math.max(...spec.nodes.map((n) => n.at[0])) + 1;
  const rows = Math.max(...spec.nodes.map((n) => n.at[1])) + 1;
  const colW = (width - gapX * (cols - 1)) / cols;
  const blocks = new Map(spec.nodes.map((n) => [n.id, textBlock(n, colW)]));
  const rowH = Array.from({ length: rows }, (_, r) =>
    Math.max(...spec.nodes.filter((n) => n.at[1] === r).map((n) => blocks.get(n.id)!.h)),
  );
  const rowY = rowH.map((_, r) => rowH.slice(0, r).reduce((a, h) => a + h + gapY, 0) + 12);
  const boxes: Box[] = spec.nodes.map((n) => {
    const b = blocks.get(n.id)!;
    const [c, r] = n.at;
    return {
      id: n.id,
      kind: n.kind ?? 'code',
      x: c * (colW + gapX),
      // Boxes sit centred on their row, so arrows between rows of different heights meet the middle.
      y: rowY[r] + (rowH[r] - b.h) / 2,
      w: colW,
      h: b.h,
      title: b.title,
      note: b.note,
      n: n.n,
    };
  });
  const byId = new Map(boxes.map((b) => [b.id, b]));
  const lines: Line[] = [];
  const labels: Label[] = [];
  for (const e of spec.edges) {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;
    const kind = e.kind ?? 'one';
    const ay = a.y + a.h / 2;
    const by = b.y + b.h / 2;
    if (Math.abs(ay - by) < 1 || a.y === b.y) {
      // Same row: straight across, between facing sides.
      const right = a.x < b.x;
      const x1 = right ? a.x + a.w : a.x;
      const x2 = right ? b.x : b.x + b.w;
      const y = (Math.max(a.y, b.y) + Math.min(a.y + a.h, b.y + b.h)) / 2;
      if (kind === 'two') {
        lines.push({ d: `M${x1} ${y - 6} H${x2 - (right ? 6 : -6)}`, kind, heads: [arrow(x2, y - 6, right ? 'r' : 'l')] });
        lines.push({ d: `M${x2} ${y + 6} H${x1 + (right ? 6 : -6)}`, kind, heads: [arrow(x1, y + 6, right ? 'l' : 'r')] });
      } else {
        lines.push({ d: `M${x1} ${y} H${x2 - (right ? 6 : -6)}`, kind, heads: [arrow(x2, y, right ? 'r' : 'l')] });
      }
      if (e.label) labels.push({ x: (x1 + x2) / 2, y: y - 10, lines: [e.label], anchor: 'middle' });
    } else {
      // Down (or up) from the middle of A, then across into the near side of B; or,
      // when B sits right below A, straight into its top (or bottom).
      const down = b.y > a.y;
      const x = a.x + a.w / 2;
      const y1 = down ? a.y + a.h : a.y;
      if (x > b.x && x < b.x + b.w) {
        const y2 = down ? b.y : b.y + b.h;
        lines.push({ d: `M${x} ${y1} V${y2 + (down ? -6 : 6)}`, kind, heads: [arrow(x, y2, down ? 'd' : 'u')] });
        if (e.label) {
          const l = wrap(e.label, Math.floor((a.w / 2 - 8) / charLabel));
          labels.push({ x: x + 8, y: y1 + 16, lines: l, anchor: 'start' });
        }
        continue;
      }
      const toRight = b.x > x;
      const x2 = toRight ? b.x : b.x + b.w;
      lines.push({
        d: `M${x} ${y1} V${by} H${x2 + (toRight ? -6 : 6)}`,
        kind,
        heads: [arrow(x2, by, toRight ? 'r' : 'l')],
      });
      if (e.label) {
        const lines2 = wrap(e.label, Math.floor((a.w / 2 - 8) / charLabel));
        labels.push({ x: x + 8, y: y1 + 16, lines: lines2, anchor: 'start' });
      }
    }
  }
  const height = Math.max(...boxes.map((b) => b.y + b.h)) + 12;
  return { width, height, boxes, lines, labels };
}

/** One column for phones: the main path (row 0) left to right, then each failure
 *  branch in the order its edges run. An edge to the next box goes straight down;
 *  one that skips boxes (as a failure leaving the main path does) runs down the
 *  right-hand gutter. */
export function layoutNarrow(spec: FigSpec, width = 300, gap = 40): Layout {
  const gutter = 44;
  const w = width - gutter;
  const main = spec.nodes.filter((n) => n.at[1] === 0).sort((p, q) => p.at[0] - q.at[0]);
  const order = [...main];
  for (const e of spec.edges) {
    const to = spec.nodes.find((n) => n.id === e.to)!;
    if (!order.includes(to)) order.push(to);
  }
  for (const n of spec.nodes) if (!order.includes(n)) order.push(n);
  let y = 12;
  const boxes: Box[] = order.map((n) => {
    const b = textBlock(n, w);
    const box = { id: n.id, kind: n.kind ?? 'code', x: 0, y, w, h: b.h, title: b.title, note: b.note, n: n.n };
    y += b.h + gap;
    return box;
  });
  const index = new Map(boxes.map((b, i) => [b.id, i]));
  const byId = new Map(boxes.map((b) => [b.id, b]));
  const lines: Line[] = [];
  const labels: Label[] = [];
  let lane = 0;
  for (const e of spec.edges) {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;
    const kind = e.kind ?? 'one';
    const ia = index.get(e.from)!;
    const ib = index.get(e.to)!;
    const cx = w / 2;
    if (Math.abs(ia - ib) === 1) {
      const down = ib > ia;
      const y1 = down ? a.y + a.h : a.y;
      const y2 = down ? b.y : b.y + b.h;
      if (kind === 'two') {
        lines.push({ d: `M${cx - 8} ${y1} V${y2 - (down ? 6 : -6)}`, kind, heads: [arrow(cx - 8, y2, down ? 'd' : 'u')] });
        lines.push({ d: `M${cx + 8} ${y2} V${y1 + (down ? 6 : -6)}`, kind, heads: [arrow(cx + 8, y1, down ? 'u' : 'd')] });
      } else {
        lines.push({ d: `M${cx} ${y1} V${y2 - (down ? 6 : -6)}`, kind, heads: [arrow(cx, y2, down ? 'd' : 'u')] });
      }
    } else {
      // Out of A's right side, down the gutter, into B's right side.
      const gx = w + 14 + (lane++ % 2) * 14;
      const ay = a.y + Math.min(a.h / 2, 24);
      const by = b.y + Math.min(b.h / 2, 24);
      lines.push({ d: `M${w} ${ay} H${gx} V${by} H${w + 6}`, kind, heads: [arrow(w, by, 'l')] });
      if (e.label) {
        const l = wrap(e.label, Math.floor((w - 16) / charLabel));
        labels.push({ x: w - 4, y: b.y - 8 - (l.length - 1) * TYPE.label * TYPE.lineGap, lines: l, anchor: 'end' });
      }
    }
  }
  return { width, height: y - gap + 12, boxes, lines, labels };
}
