import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig, AnimatePresence, motion } from 'framer-motion';
import { seedPapers } from './data/seed.js';
import { buildEdges } from './lib/graph.js';
import { usePersistent, useHashRoute, useReducedMotion } from './lib/store.js';
import Nav, { ROUTES } from './components/Nav.jsx';
import { Logo, Splash, Toasts, SkeletonCards } from './components/ui.jsx';
import PaperDetail from './components/PaperDetail.jsx';
import AddPaper from './components/AddPaper.jsx';
import Overview from './views/Overview.jsx';
import Library from './views/Library.jsx';
import Shelf from './views/Shelf.jsx';

const Connections = lazy(() => import('./views/Connections.jsx'));
const Gaps = lazy(() => import('./views/Gaps.jsx'));

const defaultFilters = { query: '', sort: 'added', year: 'all', topic: 'all', collection: null };

export default function App() {
  const reduced = useReducedMotion();
  const [route, go] = useHashRoute(ROUTES.map((r) => r.id), 'overview');
  const [userPapers, setUserPapers] = usePersistent('pt.userPapers', []);
  const [saved, setSaved] = usePersistent('pt.saved', [1, 4]);
  const [recent, setRecent] = usePersistent('pt.recent', []);
  const [activity, setActivity] = usePersistent('pt.activity', []);
  const [directions, setDirections] = usePersistent('pt.directions', []);
  const [filters, setFilters] = useState(defaultFilters);
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [ready, setReady] = useState(false);
  const toastId = useRef(0);

  const papers = useMemo(() => [...userPapers, ...seedPapers], [userPapers]);
  const edges = useMemo(() => buildEdges(papers), [papers]);
  const byId = useMemo(() => new Map(papers.map((p) => [p.id, p])), [papers]);

  useEffect(() => { const t = setTimeout(() => setReady(true), reduced ? 0 : 950); return () => clearTimeout(t); }, [reduced]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const notify = useCallback((msg, action) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, msg, action }]);
    setTimeout(() => dismiss(id), action ? 6000 : 2800);
  }, [dismiss]);
  const log = useCallback((text) => setActivity((a) => [{ id: Date.now() + Math.random(), text, at: Date.now() }, ...a].slice(0, 20)), [setActivity]);

  const open = useCallback((p) => {
    setSelected(p);
    setRecent((r) => [p.id, ...r.filter((x) => x !== p.id)].slice(0, 6));
  }, [setRecent]);

  const toggleSave = (id) => {
    const p = byId.get(id);
    if (saved.includes(id)) { setSaved(saved.filter((x) => x !== id)); notify('Removed from reading shelf', { label: 'Undo', run: () => setSaved((s) => (s.includes(id) ? s : [id, ...s])) }); log(`Removed “${p?.title}” from shelf`); }
    else { setSaved([id, ...saved]); notify('Saved to reading shelf'); log(`Saved “${p?.title}”`); }
  };
  const clearShelf = () => { const prev = saved; setSaved([]); notify('Shelf cleared', { label: 'Undo', run: () => setSaved(prev) }); };
  const addPaper = (p) => { setUserPapers([p, ...userPapers]); setAdding(false); setFilters(defaultFilters); go('library'); notify('Paper added to your library'); log(`Added “${p.title}”`); };
  const toggleDirection = (g) => {
    const on = directions.includes(g.id);
    setDirections(on ? directions.filter((x) => x !== g.id) : [...directions, g.id]);
    notify(on ? 'Research direction removed' : 'Research direction saved'); if (!on) log(`Saved direction “${g.title}”`);
  };

  // Ctrl/Cmd + K or "/" jumps to library search
  useEffect(() => {
    const onKey = (e) => {
      const typing = /input|textarea|select/i.test(document.activeElement?.tagName || '');
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) { e.preventDefault(); focusSearch(); }
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  });
  const focusSearch = () => { go('library'); setTimeout(() => document.getElementById('library-search')?.focus(), 80); };

  const view = {
    overview: <Overview papers={papers} edges={edges} saved={saved} recent={recent} activity={activity} toggleSave={toggleSave} open={open} go={go} searchFor={(q) => { setFilters({ ...defaultFilters, query: q }); go('library'); }} openCollection={(id) => { setFilters({ ...defaultFilters, collection: id }); go('library'); }} />,
    library: <Library papers={papers} saved={saved} filters={filters} setFilters={setFilters} toggleSave={toggleSave} open={open} onAdd={() => setAdding(true)} />,
    connections: <Connections papers={papers} edges={edges} open={open} />,
    gaps: <Gaps papers={papers} edges={edges} directions={directions} toggleDirection={toggleDirection} open={open} />,
    shelf: <Shelf papers={papers} saved={saved} remove={(p) => toggleSave(p.id)} clear={clearShelf} open={open} go={go} />,
  }[route];

  return (
    <MotionConfig reducedMotion="user">
      <Splash done={ready} />
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav route={route} go={go} savedCount={saved.length} libraryCount={papers.length} onAdd={() => setAdding(true)} onSearch={focusSearch} />
      <main id="main" tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={route} initial={{ opacity: 0, y: reduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -6 }} transition={{ duration: reduced ? 0 : 0.28, ease: 'easeOut' }}>
            <Suspense fallback={<div className="page"><SkeletonCards /></div>}>{view}</Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="site-footer"><Logo height={26} /><p>Demonstration library. Sample records are illustrative, not real publications. Changes are stored in this browser only.</p></footer>
      <AnimatePresence>{adding && <AddPaper papers={papers} onClose={() => setAdding(false)} onAdd={addPaper} />}</AnimatePresence>
      <AnimatePresence>{selected && <PaperDetail paper={selected} papers={papers} edges={edges} saved={saved.includes(selected.id)} onSave={() => toggleSave(selected.id)} onClose={() => setSelected(null)} onOpenPaper={open} notify={notify} />}</AnimatePresence>
      <Toasts toasts={toasts} dismiss={dismiss} />
    </MotionConfig>
  );
}
