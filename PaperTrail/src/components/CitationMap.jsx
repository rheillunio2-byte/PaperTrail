import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Maximize2, ArrowUpRight } from 'lucide-react';
import { CLUSTERS } from '../data/seed.js';
import { layout } from '../lib/graph.js';
import { useReducedMotion } from '../lib/store.js';
import { authorLine } from './PaperCard.jsx';

const W = 900, H = 520;
const radius = (p) => 16 + Math.sqrt(p.citations || 0) * 1.7;

export default function CitationMap({ papers, edges, selectedId, onSelect, onOpen, preview = false }) {
  const rm = useReducedMotion();
  const pos = useMemo(() => layout(papers, edges, W, H), [papers, edges]);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);
  const drag = useRef(null);
  const byId = useMemo(() => new Map(papers.map((p) => [p.id, p])), [papers]);
  const active = hover ?? selectedId;
  const activePaper = active != null ? byId.get(active) : null;
  const neighbours = useMemo(() => {
    const s = new Set(); if (active == null) return s;
    edges.forEach((e) => { if (e.from === active) s.add(e.to); if (e.to === active) s.add(e.from); });
    return s;
  }, [active, edges]);

  const zoom = (f, cx = W / 2, cy = H / 2) => setView((v) => {
    const k = Math.max(0.5, Math.min(2.6, v.k * f)); const r = k / v.k;
    return { k, x: cx - (cx - v.x) * r, y: cy - (cy - v.y) * r };
  });
  useEffect(() => {
    if (preview) return;
    const el = svgRef.current; if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoom(e.deltaY < 0 ? 1.12 : 0.89, ((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [preview]);

  const onPointerDown = (e) => { if (preview || e.target.closest('.map-node')) return; drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; e.currentTarget.setPointerCapture?.(e.pointerId); };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const r = svgRef.current.getBoundingClientRect();
    setView((v) => ({ ...v, x: drag.current.vx + ((e.clientX - drag.current.x) / r.width) * W, y: drag.current.vy + ((e.clientY - drag.current.y) / r.height) * H }));
  };
  const endDrag = () => { drag.current = null; };
  const onKeyNode = (e, p) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(p.id); } };
  const dur = rm ? 0 : 0.7;

  return (
    <div className={`map ${preview ? 'is-preview' : ''}`}>
      <div className="map-canvas">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Citation map. Use Tab to move between papers and Enter to select." onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerLeave={endDrag} className={drag.current ? 'dragging' : ''}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L10 5L0 9z" fill="#1f4d3a" /></marker>
            <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#d9d1bd" /></pattern>
          </defs>
          <rect width={W} height={H} fill="url(#grid)" opacity=".6" />
          <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
            {edges.map((e, i) => {
              const a = pos.get(e.from), b = pos.get(e.to); if (!a || !b) return null;
              const ra = radius(byId.get(e.from)), rb = radius(byId.get(e.to));
              const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
              const x1 = a.x + (dx / d) * ra, y1 = a.y + (dy / d) * ra, x2 = b.x - (dx / d) * (rb + (e.kind === 'cites' ? 5 : 0)), y2 = b.y - (dy / d) * (rb + (e.kind === 'cites' ? 5 : 0));
              const mx = (x1 + x2) / 2 - dy * 0.08, my = (y1 + y2) / 2 + dx * 0.08;
              const on = active != null && (e.from === active || e.to === active);
              return <motion.path key={`${e.from}-${e.to}-${e.kind}`} d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} fill="none" className={`map-edge ${e.kind} ${on ? 'on' : active != null ? 'dim' : ''}`} markerEnd={e.kind === 'cites' ? 'url(#arrow)' : undefined} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: dur, delay: rm ? 0 : 0.15 + i * 0.05 }} />;
            })}
            {papers.map((p, i) => {
              const q = pos.get(p.id), r = radius(p), col = (CLUSTERS[p.color] || CLUSTERS.sage).color;
              const dim = active != null && p.id !== active && !neighbours.has(p.id);
              return (
                <motion.g key={p.id} className={`map-node ${p.id === selectedId ? 'selected' : ''} ${dim ? 'dim' : ''}`} tabIndex={preview ? -1 : 0} role="button" aria-label={`${p.title}, ${p.year}. ${p.citations} reported citations.`} aria-pressed={p.id === selectedId}
                  initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: rm ? 0 : i * 0.06, duration: rm ? 0 : 0.4 }} style={{ transformOrigin: `${q.x}px ${q.y}px`, transformBox: 'view-box' }}
                  onClick={() => onSelect(p.id)} onDoubleClick={() => onOpen?.(p)} onKeyDown={(e) => onKeyNode(e, p)} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(p.id)} onBlur={() => setHover(null)}>
                  <circle cx={q.x} cy={q.y} r={r + 9} className="node-halo" fill={col} />
                  <circle cx={q.x} cy={q.y} r={r} className="node-core" fill={col} />
                  <text x={q.x} y={q.y + 4} textAnchor="middle" className="node-year">{String(p.year).slice(2)}</text>
                  {!preview && <text x={q.x} y={q.y + r + 20} textAnchor="middle" className="node-label">{p.topic}</text>}
                </motion.g>
              );
            })}
          </g>
        </svg>
        {!preview && (
          <div className="map-controls" role="group" aria-label="Map zoom controls">
            <button type="button" onClick={() => zoom(1.25)} aria-label="Zoom in"><Plus size={16} /></button>
            <button type="button" onClick={() => zoom(0.8)} aria-label="Zoom out"><Minus size={16} /></button>
            <button type="button" onClick={() => setView({ x: 0, y: 0, k: 1 })} aria-label="Reset view"><Maximize2 size={15} /></button>
          </div>
        )}
        {!preview && <p className="map-hint">Scroll to zoom · drag to pan · select a node to inspect</p>}
      </div>
      {!preview && (
        <aside className="map-panel" aria-live="polite">
          {activePaper ? (
            <>
              <span className="topic-tag" style={{ '--accent': (CLUSTERS[activePaper.color] || CLUSTERS.sage).color }}><i />{activePaper.topic}</span>
              <h3>{activePaper.title}</h3>
              <p className="muted small">{authorLine(activePaper)} · {activePaper.year}</p>
              <p className="map-stat"><b>{edges.filter((e) => e.kind === 'cites' && e.from === activePaper.id).length}</b> references in collection · <b>{edges.filter((e) => e.kind === 'cites' && e.to === activePaper.id).length}</b> cited by collection</p>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpen(activePaper)}>Open paper <ArrowUpRight size={14} /></button>
            </>
          ) : <p className="muted small">Hover or select a paper to see how it connects to the rest of your collection.</p>}
          <div className="legend">
            <h4>Legend</h4>
            <ul>
              {Object.values(CLUSTERS).map((c) => <li key={c.label}><i className="dot" style={{ background: c.color }} />{c.label}</li>)}
              <li><svg width="30" height="10" aria-hidden="true"><path d="M0 5H24" stroke="#1f4d3a" strokeWidth="2" /><path d="M24 1L30 5L24 9z" fill="#1f4d3a" /></svg>Cites (demo links)</li>
              <li><svg width="30" height="10" aria-hidden="true"><path d="M0 5H30" stroke="#a8a08a" strokeWidth="2" strokeDasharray="3 4" /></svg>Shared keywords</li>
              <li className="muted">Node size reflects reported citation count. The number inside is the publication year (last two digits).</li>
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}
