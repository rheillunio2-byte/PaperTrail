import React, { useMemo } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { collections } from '../data/seed.js';
import { EmptyState } from '../components/ui.jsx';
import PaperCard, { authorLine } from '../components/PaperCard.jsx';

const SORTS = {
  added: ['Recently added', null],
  newest: ['Year, newest first', (a, b) => b.year - a.year],
  oldest: ['Year, oldest first', (a, b) => a.year - b.year],
  cited: ['Most cited', (a, b) => b.citations - a.citations],
  title: ['Title, A to Z', (a, b) => a.title.localeCompare(b.title)],
};

export default function Library({ papers, saved, filters, setFilters, toggleSave, open, onAdd }) {
  const { query, sort, year, topic, collection } = filters;
  const set = (patch) => setFilters({ ...filters, ...patch });
  const topics = useMemo(() => [...new Set(papers.map((p) => p.topic))].sort(), [papers]);
  const years = useMemo(() => [...new Set(papers.map((p) => String(p.year)))].sort().reverse(), [papers]);
  const col = collections.find((c) => c.id === collection);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = papers.filter((p) => (!q || `${p.title} ${authorLine(p)} ${p.topic} ${p.journal} ${p.keywords.join(' ')} ${p.doi}`.toLowerCase().includes(q)) && (year === 'all' || String(p.year) === year) && (topic === 'all' || p.topic === topic) && (!col || col.match(p)));
    const fn = SORTS[sort][1]; if (fn) r = [...r].sort(fn);
    return r;
  }, [papers, query, sort, year, topic, col]);
  const active = query || year !== 'all' || topic !== 'all' || collection;
  const reset = () => setFilters({ query: '', sort, year: 'all', topic: 'all', collection: null });
  return (
    <div className="page">
      <header className="page-head"><p className="eyebrow"><span className="rule" />Collection</p><h1>Research library</h1><p className="lede">Every paper you have gathered, in one place you can scan, sort and search.</p></header>
      <div className="toolbar" role="search">
        <label className="searchbox"><Search size={18} aria-hidden="true" /><span className="sr-only">Search library</span><input id="library-search" value={query} onChange={(e) => set({ query: e.target.value })} placeholder="Search titles, authors, topics, DOIs" />{query && <button type="button" className="icon-btn" onClick={() => set({ query: '' })} aria-label="Clear search"><X size={16} /></button>}<kbd>Ctrl K</kbd></label>
        <label className="select"><span>Sort</span><select value={sort} onChange={(e) => set({ sort: e.target.value })}>{Object.entries(SORTS).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}</select></label>
        <label className="select"><span>Year</span><select value={year} onChange={(e) => set({ year: e.target.value })}><option value="all">All years</option>{years.map((y) => <option key={y}>{y}</option>)}</select></label>
      </div>
      <div className="chip-filter" role="group" aria-label="Filter by topic">
        <button type="button" className={topic === 'all' ? 'on' : ''} aria-pressed={topic === 'all'} onClick={() => set({ topic: 'all' })}>All topics</button>
        {topics.map((t) => <button type="button" key={t} className={topic === t ? 'on' : ''} aria-pressed={topic === t} onClick={() => set({ topic: topic === t ? 'all' : t })}>{t}</button>)}
      </div>
      <div className="results-line" aria-live="polite">
        <span>{results.length} of {papers.length} papers{col ? ` · ${col.title}` : ''}</span>
        {active && <button type="button" className="link-btn" onClick={reset}>Clear filters</button>}
      </div>
      {results.length ? <div className="card-grid two">{results.map((p, i) => <PaperCard key={p.id} paper={p} query={query} saved={saved.includes(p.id)} onSave={() => toggleSave(p.id)} onOpen={() => open(p)} index={i} />)}</div>
        : <EmptyState image="empty-search.svg" title={papers.length ? 'No papers match' : 'Your library is empty'} action={<div className="empty-actions">{active && <button type="button" className="btn btn-ghost" onClick={reset}>Clear filters</button>}<button type="button" className="btn btn-primary" onClick={onAdd}><Plus size={15} />Add a paper</button></div>}>{papers.length ? 'Try a different spelling, or remove a filter. You can also add the paper you are looking for.' : 'Add your first paper to begin building a collection.'}</EmptyState>}
    </div>
  );
}
