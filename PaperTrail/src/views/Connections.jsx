import React, { useState } from 'react';
import CitationMap from '../components/CitationMap.jsx';

export default function Connections({ papers, edges, open }) {
  const [sel, setSel] = useState(null);
  const cites = edges.filter((e) => e.kind === 'cites').length;
  return (
    <div className="page">
      <header className="page-head"><p className="eyebrow"><span className="rule" />Citation landscape</p><h1>Where ideas meet</h1><p className="lede">{papers.length} papers, {cites} citation links and {edges.length - cites} keyword connections. Citation links between sample papers are demonstration data; links you add by hand appear here too.</p></header>
      <CitationMap papers={papers} edges={edges} selectedId={sel} onSelect={(id) => setSel(id === sel ? null : id)} onOpen={open} />
    </div>
  );
}
