import React from 'react';
import { ExternalLink, Copy, ArrowUpRight, Link2 } from 'lucide-react';
import { CLUSTERS } from '../data/seed.js';
import { relatedTo } from '../lib/graph.js';
import { BookmarkButton, Modal } from './ui.jsx';
import { authorLine } from './PaperCard.jsx';

export default function PaperDetail({ paper: p, papers, edges, saved, onSave, onClose, onOpenPaper, notify }) {
  const c = CLUSTERS[p.color] || CLUSTERS.sage;
  const related = relatedTo(p, papers, edges);
  const citesOut = related.filter((r) => r.kind === 'cites' && r.rel.startsWith('Cited')).length;
  const citedBy = related.filter((r) => r.kind === 'cites' && r.rel.startsWith('Cites')).length;
  const doiUrl = p.doi ? (p.doi.startsWith('http') ? p.doi : `https://doi.org/${p.doi}`) : null;
  const copyDoi = async () => { try { await navigator.clipboard.writeText(p.doi); notify('DOI copied'); } catch { notify('Could not copy. Select the DOI text instead.'); } };
  return (
    <Modal onClose={onClose} label={`Paper details: ${p.title}`} wide>
      <div className="detail" style={{ '--accent': c.color }}>
        <div className="detail-head">
          <span className="topic-tag"><i />{p.topic}</span>{p.demo && <span className="demo-tag">Demo record</span>}
        </div>
        <h2>{p.title}</h2>
        <p className="detail-authors">{authorLine(p)}</p>
        <dl className="detail-facts">
          <div><dt>Publication</dt><dd>{p.journal || 'Not specified'}</dd></div>
          <div><dt>Year</dt><dd>{p.year}</dd></div>
          <div><dt>Reported citations</dt><dd>{p.citations.toLocaleString()}</dd></div>
          <div><dt>DOI</dt><dd className="mono">{p.doi || 'Not provided'}</dd></div>
        </dl>
        <section><h4>Abstract</h4><p className="abstract">{p.abstract || 'No abstract has been added. Use this space for your own reading notes.'}</p></section>
        <section><h4>Keywords</h4><div className="chips">{p.keywords.map((k) => <span key={k}>{k}</span>)}</div></section>
        <section>
          <h4>In your collection</h4>
          <p className="muted small">{citesOut} paper{citesOut === 1 ? '' : 's'} referenced here · {citedBy} paper{citedBy === 1 ? '' : 's'} referencing this one</p>
          {related.length === 0 ? <p className="muted small">No links yet. Add citations or shared keywords to connect this paper.</p> : (
            <ul className="related">{related.map(({ paper: r, rel, kind }) => (
              <li key={r.id}><button type="button" onClick={() => onOpenPaper(r)}><span className={`rel-kind ${kind}`}><Link2 size={13} /></span><span className="rel-title">{r.title}</span><em>{rel}</em><ArrowUpRight size={14} /></button></li>
            ))}</ul>
          )}
        </section>
        {p.demo && <p className="demo-note">This is an illustrative sample record. Its DOI is not a live identifier, so no external link is offered.</p>}
        <div className="modal-actions">
          <span className="saver"><BookmarkButton saved={saved} onToggle={onSave} label={p.title} /><span>{saved ? 'On your reading shelf' : 'Save to reading shelf'}</span></span>
          <span className="spacer" />
          {p.doi && <button type="button" className="btn btn-ghost" onClick={copyDoi}><Copy size={15} />Copy DOI</button>}
          {doiUrl && !p.demo && <a className="btn btn-primary" href={doiUrl} target="_blank" rel="noopener noreferrer">Open source <ExternalLink size={14} /></a>}
        </div>
      </div>
    </Modal>
  );
}
