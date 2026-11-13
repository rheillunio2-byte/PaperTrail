import { useCallback, useEffect, useState } from 'react';

// localStorage wrapper that never throws (private mode, quota, SSR).
function read(key, fallback) {
  try { const v = window.localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
export function usePersistent(key, initial) {
  const [value, setValue] = useState(() => read(key, initial));
  useEffect(() => { try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ } }, [key, value]);
  return [value, setValue];
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)'); if (!mq) return;
    const on = () => setReduced(mq.matches); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

export const asset = (p) => `${import.meta.env.BASE_URL}${p}`;

export function useHashRoute(routes, fallback) {
  const parse = () => { const h = window.location.hash.replace('#', ''); return routes.includes(h) ? h : fallback; };
  const [route, setRoute] = useState(parse);
  useEffect(() => { const on = () => setRoute(parse()); window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on); }, []);
  const go = useCallback((r) => { window.location.hash = r; window.scrollTo({ top: 0 }); }, []);
  return [route, go];
}
