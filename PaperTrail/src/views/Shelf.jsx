import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Trash2 } from 'lucide-react';
import { EmptyState } from '../components/ui.jsx';
import { authorLine } from '../components/PaperCard.jsx';

export default function Shelf({ papers, saved, remove, clear, open, go }) {
  const byId = new Map(papers.map((p) => [p.id, p]));
  const list = saved.map((id) => byId.get(id)).filter(Boolean);
  return (
    <div className="page">
      <header className="page-head"><p className="eyebrow"><span className="rule" />Focused reading</p><h1>Reading shelf</h1><p className="lede">Papers you have set aside for your next reading session.</p></header>
      {list.length ? (
        <>
          <div className="results-line"><span>{list.length} saved</span><button type="button" className="link-btn" onClick={clear}><Trash2 size={14} />Clear shelf</button></div>
          <ul className="shelf-list">
            <AnimatePresence initial={false}>
              {list.map((p) => (
                <motion.li key={p.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                  <div className="shelf-year">{p.year}</div>
                  <div className="shelf-main"><button type="button" className="title-btn" onClick={() => open(p)}>{p.title}</button><p>{authorLine(p)} · {p.journal || 'Independent publication'}</p></div>
                  <button type="button" className="link-btn" onClick={() => open(p)} aria-label={`Open ${p.title}`}>Open <ArrowUpRight size={14} /></button>
                  <button type="button" className="icon-btn" onClick={() => remove(p)} aria-label={`Remove from shelf: ${p.title}`}><X size={17} /></button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </>
      ) : <EmptyState image="empty-shelf.svg" title="Your shelf is clear" action={<button type="button" className="btn btn-primary" onClick={() => go('library')}>Browse the library</button>}>Bookmark papers from the library and they will wait for you here.</EmptyState>}
    </div>
  );
}
