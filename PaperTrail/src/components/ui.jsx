import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Bookmark, BookmarkCheck } from 'lucide-react';
import { asset } from '../lib/store.js';

export function Logo({ variant = 'full', height = 34 }) {
  const file = variant === 'icon' ? 'papertrail-icon' : variant === 'light' ? 'papertrail-logo-light' : 'papertrail-logo';
  return <img className="logo-img" src={asset(`brand/${file}.svg`)} height={height} alt="PaperTrail" draggable="false" />;
}

// Image with a tinted fallback so a missing file never leaves a broken-image icon.
export function Img({ src, alt, className = '', ratio = '16 / 10' }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`img-frame ${className}`} style={{ aspectRatio: ratio }}>
      {failed ? <div className="img-fallback" role="img" aria-label={alt} /> : <img src={asset(`images/${src}`)} alt={alt} loading="lazy" onError={() => setFailed(true)} />}
    </div>
  );
}

export function Highlight({ text, query }) {
  const q = query.trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}

export function BookmarkButton({ saved, onToggle, label }) {
  return (
    <motion.button type="button" className={`icon-btn bookmark ${saved ? 'is-saved' : ''}`} onClick={(e) => { e.stopPropagation(); onToggle(); }} whileTap={{ scale: 0.88 }} aria-pressed={saved} aria-label={`${saved ? 'Remove from reading shelf' : 'Save to reading shelf'}: ${label}`} title={saved ? 'Remove from reading shelf' : 'Save to reading shelf'}>
      <motion.span key={String(saved)} initial={{ scale: 0.6, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} style={{ display: 'grid' }}>
        {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </motion.span>
    </motion.button>
  );
}

export function SkeletonCards({ count = 3 }) {
  return <div className="skeleton-list" aria-busy="true" aria-label="Loading papers">{Array.from({ length: count }).map((_, i) => <div className="skeleton-row" key={i}><i /><i /><i /></div>)}</div>;
}

export function EmptyState({ image, title, children, action }) {
  return (
    <div className="empty-state">
      <Img src={image} alt="" ratio="13 / 8" className="empty-art" />
      <h3>{title}</h3><p>{children}</p>{action}
    </div>
  );
}

export function Splash({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="splash" role="status" aria-label="Loading PaperTrail" exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}><Logo variant="light" height={46} /></motion.div>
          <div className="splash-bar"><motion.i initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.9, ease: 'easeInOut' }} /></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toasts({ toasts, dismiss }) {
  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} layout className="toast" initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}>
            <Check size={15} /><span>{t.msg}</span>
            {t.action && <button type="button" onClick={() => { t.action.run(); dismiss(t.id); }}>{t.action.label}</button>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Accessible modal: Esc to close, focus trap, focus restored on close.
export function Modal({ onClose, label, children, wide }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    const node = ref.current;
    const focusables = () => node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusables()[0]?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      if (e.key === 'Tab') {
        const f = [...focusables()]; if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [onClose]);
  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div ref={ref} role="dialog" aria-modal="true" aria-label={label} className={`modal ${wide ? 'wide' : ''}`} initial={{ opacity: 0, y: 22, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.98 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
        <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Close dialog"><X size={19} /></button>
        {children}
      </motion.div>
    </motion.div>
  );
}
