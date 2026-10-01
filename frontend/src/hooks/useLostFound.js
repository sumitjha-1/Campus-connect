import { useState, useCallback, useMemo } from 'react';
import { seedItems, withPos } from '../data/lostFoundData';

const K = 'cc-lf-items', R = 'cc-lf-returned';
const load = k => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// Reports made in this browser (localStorage) + sample reports. Swap for API calls once the backend exists.
// Returns { items, add, markReturned, remove }.
export default function useLostFound() {
  const [mine, setMine] = useState(() => load(K));
  const [ret, setRet] = useState(() => load(R));

  const items = useMemo(() => [...mine.map(x => ({ ...x, mine: true })), ...seedItems]
    .map(x => ({ ...x, status: x.status === 'returned' || ret.includes(x.id) ? 'returned' : 'open' }))
    .map(withPos)
    .sort((a, b) => new Date(b.at) - new Date(a.at)), [mine, ret]);

  const add = useCallback(data => {
    const it = { ...data, id: `u-${Date.now()}`, status: 'open' };
    setMine(v => { const n = [it, ...v]; save(K, n); return n; });
    return it;
  }, []);
  const markReturned = useCallback(id => setRet(v => { const n = [...new Set([...v, id])]; save(R, n); return n; }), []);
  const remove = useCallback(id => setMine(v => { const n = v.filter(x => x.id !== id); save(K, n); return n; }), []);

  return { items, add, markReturned, remove };
}