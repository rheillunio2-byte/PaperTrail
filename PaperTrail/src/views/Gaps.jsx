import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CircleHelp, BookmarkPlus, BookmarkCheck, FlaskConical } from 'lucide-react';
import { gapSeeds } from '../data/seed.js';
import { topicLinkCount } from '../lib/graph.js';

export default function Gaps({ papers, edges, directions, toggleDirection, open }) {
  const [theme, setTheme] = useState('all');
  const byId = new Map(papers.map((p) => [p.id, p]));
  const cards = useMemo(() => gapSeeds.map((g) => ({ ...g, links: topicLinkCount(papers, edges, g.between), papers: g.support.map((id) => byId.get(id)).filter(Boolean) })).filter((g) => g.papers.length), [papers, edges]);
  const themes = [...new Set(gapSeeds.flatMap((g) => g.between))];
  const shown = cards.filter((g) => theme === 'all' || g.between.includes(theme));
  return (
    <div className="page">
      <header className="page-head"><p className="eyebrow"><span className="rule" />Research frontier</p><h1>Questions worth asking</h1><p className="lede">Underexplored intersections in <em>your collection</em>, surfaced as starting points for reading, not conclusions about the field.</p></header>
      <aside className="notice" role="note"><FlaskConical size={18} aria-hidden="true" /><p><b>Exploratory signals, not verified findings.</b> These directions were written for the demo collection. The link counts below are calculated live from the papers you have here. A low count may simply mean a paper is not in your library. Check the wider literature before treating any of this as a gap.</p></aside>
      <div className="chip-filter" role="group" aria-label="Filter by theme">
        <button type="button" className={theme === 'all' ? 'on' : ''} aria-pressed={theme === 'all'} onClick={() => setTheme('all')}>All themes</button>
        {themes.map((t) => <button type="button" key={t} className={theme === t ? 'on' : ''} aria-pressed={theme === t} onClick={() => setTheme(theme === t ? 'all' : t)}>{t}</button>)}
      </div>
      <div className="gap-list">
        {shown.map((g, i) => {
          const saved = directions.includes(g.id);
          return (
            <motion.article key={g.id} className="gap-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="gap-index"><span>{String(i + 1).padStart(2, '0')}</span><em className="signal">{g.signal}</em></div>
              <div className="gap-main">
                <p className="gap-between">{g.between[0]} <i aria-hidden="true">×</i> {g.between[1]}</p>
                <h3>{g.title}</h3>
                <p>{g.why}</p>
                <p className="evidence"><b>{g.links}</b> citation link{g.links === 1 ? '' : 's'} between these topics in this collection</p>
                <div className="support"><span>Supporting papers</span>{g.papers.map((p) => <button type="button" key={p.id} onClick={() => open(p)}>{p.title}</button>)}</div>
              </div>
              <button type="button" className={`btn ${saved ? 'btn-soft' : 'btn-ghost'}`} aria-pressed={saved} onClick={() => toggleDirection(g)}>{saved ? <BookmarkCheck size={15} /> : <BookmarkPlus size={15} />}{saved ? 'Saved' : 'Save direction'}</button>
            </motion.article>
          );
        })}
        {!shown.length && <p className="muted">No directions for this theme in your current collection.</p>}
      </div>
      <p className="method-note"><CircleHelp size={14} aria-hidden="true" />Method: directions are hand-written sample hypotheses. PaperTrail does not mine the literature, and only counts links among papers you have added.</p>
    </div>
  );
}
