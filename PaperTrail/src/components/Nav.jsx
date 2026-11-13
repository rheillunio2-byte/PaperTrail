import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Plus, Search } from 'lucide-react';
import { Logo } from './ui.jsx';

export const ROUTES = [
  { id: 'overview', label: 'Overview' },
  { id: 'library', label: 'Library' },
  { id: 'connections', label: 'Citation map' },
  { id: 'gaps', label: 'Gap explorer' },
  { id: 'shelf', label: 'Reading shelf' },
];

export default function Nav({ route, go, savedCount, libraryCount, onAdd, onSearch }) {
  const [open, setOpen] = useState(false);
  const badge = (id) => (id === 'shelf' ? savedCount : id === 'library' ? libraryCount : null);
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a href="#overview" className="brand-link" aria-label="PaperTrail home" onClick={() => setOpen(false)}><Logo height={34} /></a>
        <nav className="nav-desktop" aria-label="Primary">
          {ROUTES.map((r) => (
            <a key={r.id} href={`#${r.id}`} className={`nav-link ${route === r.id ? 'active' : ''}`} aria-current={route === r.id ? 'page' : undefined}>
              {route === r.id && <motion.span layoutId="nav-indicator" className="nav-indicator" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              <span className="nav-text">{r.label}{badge(r.id) != null && <small>{badge(r.id)}</small>}</span>
            </a>
          ))}
        </nav>
        <div className="topbar-actions">
          <button type="button" className="icon-btn" onClick={onSearch} aria-label="Search library (Ctrl or Cmd + K)" title="Search (Ctrl/Cmd + K)"><Search size={18} /></button>
          <button type="button" className="btn btn-primary btn-sm" onClick={onAdd}><Plus size={15} /><span className="hide-sm">Add paper</span></button>
          <button type="button" className="icon-btn nav-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-nav" className="nav-mobile" aria-label="Primary mobile" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {ROUTES.map((r) => (
              <a key={r.id} href={`#${r.id}`} className={route === r.id ? 'active' : ''} aria-current={route === r.id ? 'page' : undefined} onClick={() => setOpen(false)}>
                {r.label}{badge(r.id) != null && <small>{badge(r.id)}</small>}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
