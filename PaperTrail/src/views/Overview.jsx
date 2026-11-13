import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpRight, Clock3 } from 'lucide-react';
import { collections } from '../data/seed.js';
import { Img } from '../components/ui.jsx';
import PaperCard, { authorLine } from '../components/PaperCard.jsx';
import CitationMap from '../components/CitationMap.jsx';

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; };
const ago = (t) => { const m = Math.max(0, Math.round((Date.now() - t) / 60000)); return m < 1 ? 'Just now' : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };

export default function Overview({ papers, edges, saved, recent, activity, toggleSave, open, go, searchFor, openCollection }) {
  const [q, setQ] = useState('');
  const byId = new Map(papers.map((p) => [p.id, p]));
  const recentPapers = recent.map((id) => byId.get(id)).filter(Boolean).slice(0, 3);
  const continueList = recentPapers.length ? recentPapers : papers.slice(0, 3);
  const savedPapers = saved.map((id) => byId.get(id)).filter(Boolean);
  return (
    <div className="page overview">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="rule" />{greeting()}</p>
          <h1>Follow the trail<br />between <em>ideas.</em></h1>
          <p className="lede">Collect papers, see how they cite one another, and notice the questions the literature has not quite asked yet.</p>
          <form className="hero-search" role="search" onSubmit={(e) => { e.preventDefault(); searchFor(q); }}>
            <Search size={18} aria-hidden="true" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search titles, authors, topics or keywords" aria-label="Search your library" />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
          <p className="muted small">You are exploring a small <b>demonstration library</b>. Add your own papers any time.</p>
        </div>
        <Img src="hero-research-desk.svg" alt="Illustration of stacked papers with a trail of connected nodes" ratio="5 / 4" className="hero-art" />
      </section>

      <section className="block">
        <header className="block-head"><div><p className="eyebrow">Pick up where you left off</p><h2>Continue reading</h2></div><button type="button" className="link-btn" onClick={() => go('library')}>All papers <ArrowUpRight size={14} /></button></header>
        <div className="card-grid three">{continueList.map((p, i) => <PaperCard key={p.id} paper={p} compact saved={saved.includes(p.id)} onSave={() => toggleSave(p.id)} onOpen={() => open(p)} index={i} />)}</div>
      </section>

      <section className="block">
        <header className="block-head"><div><p className="eyebrow">Featured collections</p><h2>Ways into the literature</h2></div></header>
        <div className="collection-grid">
          {collections.map((c, i) => {
            const n = papers.filter(c.match).length;
            return (
              <motion.button type="button" key={c.id} className="collection-card" onClick={() => openCollection(c.id)} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Img src={c.image} alt="" ratio="16 / 9" />
                <span className="collection-body"><b>{c.title}</b><span>{c.note}</span><small>{n} paper{n === 1 ? '' : 's'}</small></span>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="block split">
        <div>
          <header className="block-head"><div><p className="eyebrow">Citation network</p><h2>Your literature at a glance</h2></div><button type="button" className="link-btn" onClick={() => go('connections')}>Open the map <ArrowUpRight size={14} /></button></header>
          <div className="preview-frame"><CitationMap papers={papers} edges={edges} selectedId={null} onSelect={() => go('connections')} preview /></div>
          <p className="muted small caption">Demonstration citations between sample papers. Arrows point from the citing paper to the cited one.</p>
        </div>
        <div className="side-stack">
          <div>
            <header className="block-head"><div><p className="eyebrow">Reading shelf</p><h2>Saved papers</h2></div></header>
            {savedPapers.length ? <ul className="mini-list">{savedPapers.slice(0, 4).map((p) => <li key={p.id}><button type="button" onClick={() => open(p)}><span>{p.title}</span><small>{authorLine(p)} · {p.year}</small></button></li>)}</ul> : <p className="muted small">Nothing saved yet. Use the bookmark on any paper.</p>}
            {savedPapers.length > 0 && <button type="button" className="link-btn" onClick={() => go('shelf')}>Open shelf <ArrowUpRight size={14} /></button>}
          </div>
          <div>
            <header className="block-head"><div><p className="eyebrow">Recent activity</p><h2>Your session</h2></div></header>
            {activity.length ? <ul className="activity">{activity.slice(0, 5).map((a) => <li key={a.id}><Clock3 size={13} aria-hidden="true" /><span>{a.text}</span><time>{ago(a.at)}</time></li>)}</ul> : <p className="muted small">Actions like saving or adding papers will appear here.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
