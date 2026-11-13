import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from './ui.jsx';

const blank = { title: '', authors: '', year: String(new Date().getFullYear()), journal: '', doi: '', topic: '', keywords: '', abstract: '', cites: [] };

export default function AddPaper({ papers, onClose, onAdd }) {
  const [f, setF] = useState(blank);
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggleCite = (id) => setF({ ...f, cites: f.cites.includes(id) ? f.cites.filter((x) => x !== id) : [...f.cites, id] });
  const submit = (e) => {
    e.preventDefault();
    const year = Number(f.year);
    if (!f.title.trim()) return setErr('Please enter a paper title.');
    if (!Number.isInteger(year) || year < 1800 || year > new Date().getFullYear() + 1) return setErr('Please enter a valid publication year.');
    const split = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);
    const topic = f.topic.trim() || 'Uncategorised';
    const colors = ['sage', 'clay', 'blue', 'gold', 'lavender'];
    onAdd({ id: Date.now(), demo: false, title: f.title.trim(), authors: split(f.authors), year, journal: f.journal.trim(), doi: f.doi.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, ''), topic, citations: 0, color: colors[papers.length % colors.length], keywords: split(f.keywords).length ? split(f.keywords) : [topic], cites: f.cites, abstract: f.abstract.trim() });
  };
  return (
    <Modal onClose={onClose} label="Add a research paper">
      <form onSubmit={submit} className="add-form" noValidate>
        <div className="eyebrow">Expand your collection</div>
        <h2>Add a paper</h2>
        <p className="muted small">Entered by hand. PaperTrail does not look up or verify metadata, so check details against the source.</p>
        <label className="field">Title<input value={f.title} onChange={set('title')} placeholder="Full paper title" required aria-invalid={!!err && !f.title.trim()} /></label>
        <label className="field">Authors <span className="hint">comma separated</span><input value={f.authors} onChange={set('authors')} placeholder="A. Rivera, M. Chen" /></label>
        <div className="field-row">
          <label className="field">Journal<input value={f.journal} onChange={set('journal')} placeholder="Publication name" /></label>
          <label className="field narrow">Year<input type="number" value={f.year} onChange={set('year')} /></label>
        </div>
        <div className="field-row">
          <label className="field">DOI<input value={f.doi} onChange={set('doi')} placeholder="10.xxxx/xxxxx" /></label>
          <label className="field">Topic<input value={f.topic} onChange={set('topic')} placeholder="e.g. Student wellbeing" /></label>
        </div>
        <label className="field">Keywords <span className="hint">comma separated</span><input value={f.keywords} onChange={set('keywords')} placeholder="Peer learning, Feedback" /></label>
        <label className="field">Abstract or notes<textarea rows="3" value={f.abstract} onChange={set('abstract')} placeholder="What is this paper about?" /></label>
        <fieldset className="field cite-picker"><legend>References papers already in your library <span className="hint">optional, draws citation links on the map</span></legend>
          <div className="cite-list">{papers.map((p) => <label key={p.id} className="check"><input type="checkbox" checked={f.cites.includes(p.id)} onChange={() => toggleCite(p.id)} /><span>{p.title}</span></label>)}</div>
        </fieldset>
        {err && <p className="form-error" role="alert">{err}</p>}
        <div className="modal-actions"><span className="spacer" /><button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary"><Plus size={15} />Add to library</button></div>
      </form>
    </Modal>
  );
}
