// Graph helpers: edges, deterministic force layout, and gap analysis.

export function buildEdges(papers) {
  const ids = new Set(papers.map((p) => p.id));
  const edges = [];
  papers.forEach((p) => (p.cites || []).forEach((t) => { if (ids.has(t)) edges.push({ from: p.id, to: t, kind: 'cites' }); }));
  // Dashed "related" links: shared keywords between papers that do not already cite each other.
  for (let i = 0; i < papers.length; i++) for (let j = i + 1; j < papers.length; j++) {
    const a = papers[i], b = papers[j];
    const linked = edges.some((e) => (e.from === a.id && e.to === b.id) || (e.from === b.id && e.to === a.id));
    const shared = a.keywords.filter((k) => b.keywords.includes(k));
    if (!linked && shared.length) edges.push({ from: a.id, to: b.id, kind: 'related', shared });
  }
  return edges;
}

// Small deterministic force layout so any number of papers can be placed without hard-coded coordinates.
export function layout(papers, edges, w = 900, h = 520) {
  const n = papers.length;
  const pos = new Map();
  papers.forEach((p, i) => {
    const a = (i / Math.max(n, 1)) * Math.PI * 2;
    pos.set(p.id, { x: w / 2 + Math.cos(a) * w * 0.3, y: h / 2 + Math.sin(a) * h * 0.3, vx: 0, vy: 0 });
  });
  for (let it = 0; it < 260; it++) {
    const cool = 1 - it / 260;
    papers.forEach((a) => papers.forEach((b) => {
      if (a.id >= b.id) return;
      const pa = pos.get(a.id), pb = pos.get(b.id);
      let dx = pa.x - pb.x, dy = pa.y - pb.y; const d2 = Math.max(dx * dx + dy * dy, 40);
      const f = 52000 / d2, d = Math.sqrt(d2); dx /= d; dy /= d;
      pa.vx += dx * f * cool; pa.vy += dy * f * cool; pb.vx -= dx * f * cool; pb.vy -= dy * f * cool;
    }));
    edges.forEach((e) => {
      const pa = pos.get(e.from), pb = pos.get(e.to); if (!pa || !pb) return;
      const rest = e.kind === 'cites' ? 190 : 250, k = e.kind === 'cites' ? 0.02 : 0.008;
      const dx = pb.x - pa.x, dy = pb.y - pa.y, d = Math.max(Math.hypot(dx, dy), 1), f = (d - rest) * k;
      pa.vx += (dx / d) * f; pa.vy += (dy / d) * f; pb.vx -= (dx / d) * f; pb.vy -= (dy / d) * f;
    });
    pos.forEach((p) => {
      p.vx += (w / 2 - p.x) * 0.004; p.vy += (h / 2 - p.y) * 0.004;
      p.x += Math.max(-24, Math.min(24, p.vx)); p.y += Math.max(-24, Math.min(24, p.vy));
      p.vx *= 0.6; p.vy *= 0.6;
      p.x = Math.max(70, Math.min(w - 70, p.x)); p.y = Math.max(60, Math.min(h - 70, p.y));
    });
  }
  // Fit the result to the canvas so small collections do not huddle in the middle.
  const xs = [...pos.values()].map((p) => p.x), ys = [...pos.values()].map((p) => p.y);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  if (n > 1) pos.forEach((p) => {
    p.x = x1 > x0 ? 100 + ((p.x - x0) / (x1 - x0)) * (w - 200) : w / 2;
    p.y = y1 > y0 ? 80 + ((p.y - y0) / (y1 - y0)) * (h - 190) : h / 2;
  });
  // Push apart any nodes that still sit too close, so circles and labels never collide.
  const MIN = 135, ids = [...pos.keys()];
  for (let it = 0; it < 80; it++) for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const a = pos.get(ids[i]), b = pos.get(ids[j]);
    let dx = b.x - a.x, dy = b.y - a.y; let d = Math.hypot(dx, dy);
    if (d >= MIN) continue;
    if (d < 0.01) { dx = 1; dy = 0.3; d = Math.hypot(dx, dy); }
    const push = (MIN - d) / 2 + 0.5;
    a.x -= (dx / d) * push; a.y -= (dy / d) * push; b.x += (dx / d) * push; b.y += (dy / d) * push;
    [a, b].forEach((q) => { q.x = Math.max(80, Math.min(w - 80, q.x)); q.y = Math.max(70, Math.min(h - 110, q.y)); });
  }
  return pos;
}

export function relatedTo(paper, papers, edges) {
  const out = [];
  papers.forEach((p) => {
    if (p.id === paper.id) return;
    const e = edges.find((x) => (x.from === paper.id && x.to === p.id) || (x.to === paper.id && x.from === p.id));
    if (!e) return;
    const rel = e.kind === 'cites' ? (e.from === paper.id ? 'Cited by this paper' : 'Cites this paper') : `Shares: ${e.shared.join(', ')}`;
    out.push({ paper: p, rel, kind: e.kind });
  });
  return out.sort((a, b) => (a.kind === 'cites' ? -1 : 1) - (b.kind === 'cites' ? -1 : 1));
}

// Counts citation links that exist between the two topics in the current collection.
export function topicLinkCount(papers, edges, [ta, tb]) {
  const topic = new Map(papers.map((p) => [p.id, p.topic]));
  return edges.filter((e) => e.kind === 'cites' && ((topic.get(e.from) === ta && topic.get(e.to) === tb) || (topic.get(e.from) === tb && topic.get(e.to) === ta))).length;
}
