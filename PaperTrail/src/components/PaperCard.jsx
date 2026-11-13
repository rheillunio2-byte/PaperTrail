import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ArrowUpRight } from 'lucide-react';
import { CLUSTERS } from '../data/seed.js';
import { BookmarkButton, Highlight } from './ui.jsx';

export const authorLine = (p) => (Array.isArray(p.authors) ? p.authors.join(', ') : p.authors) || 'Unknown authors';

export default function PaperCard({ paper: p, query = '', saved, onSave, onOpen, index = 0, compact = false }) {
  const c = CLUSTERS[p.color] || CLUSTERS.sage;
  return (
    <motion.article className={`paper-card ${compact ? 'compact' : ''}`} style={{ '--accent': c.color }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.35 }} whileHover={{ y: -2 }}>
      <div className="paper-card-top">
        <span className="topic-tag"><i />{p.topic}</span>
        {p.demo && <span className="demo-tag" title="Illustrative sample record">Demo</span>}
        <span className="year">{p.year}</span>
      </div>
      <h3><button type="button" className="title-btn" onClick={onOpen}><Highlight text={p.title} query={query} /></button></h3>
      <p className="byline"><Highlight text={authorLine(p)} query={query} /></p>
      <p className="journal">{p.journal || 'Independent publication'}</p>
      {!compact && <div className="chips">{p.keywords.map((k) => <span key={k}>{k}</span>)}</div>}
      <div className="paper-card-foot">
        <span className="meta"><Quote size={13} />{p.citations.toLocaleString()} citations{p.doi && <span className="doi">DOI {p.doi}</span>}</span>
        <span className="card-actions">
          <BookmarkButton saved={saved} onToggle={onSave} label={p.title} />
          <button type="button" className="link-btn" onClick={onOpen} aria-label={`Open details: ${p.title}`}>Details <ArrowUpRight size={14} /></button>
        </span>
      </div>
    </motion.article>
  );
}
