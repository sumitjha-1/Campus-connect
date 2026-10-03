import { useState, useCallback, useMemo, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext/ThemeContext';
import { seedItems } from '../data/marketData';
import { itemImageFor, matchReport, itemFileCount } from '../data/marketImages';

const K = 'cc-mk-items', R = 'cc-mk-sold', W = 'cc-mk-saved', C = 'cc-mk-chats';
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// Listings made in this browser (localStorage) + sample listings. Swap for API calls once the backend exists.
// Returns { items, add, markSold, remove, saved, chats, say }.
export default function useMarket() {
  const { theme } = useTheme();
  // Sample listings get a photo from the items folder when a file name matches (light/dark version by theme).
  const seeds = useMemo(() => seedItems.map(x => (x.photo ? x : { ...x, photo: itemImageFor(x, theme) })), [theme]);
  useEffect(() => { if (import.meta.env.DEV) { console.info(`Marketplace: ${itemFileCount} item photos found`); console.table(matchReport(seedItems, theme)); } }, [theme]);
  const [mine, setMine] = useState(() => load(K, []));
  const [sold, setSold] = useState(() => load(R, []));
  const [wish, setWish] = useState(() => load(W, []));
  const [chats, setChats] = useState(() => load(C, {}));

  const items = useMemo(() => [...mine.map(x => ({ ...x, mine: true })), ...seeds]
    .map(x => ({ ...x, status: x.status === 'sold' || sold.includes(x.id) ? 'sold' : 'open' }))
    .sort((a, b) => new Date(b.at) - new Date(a.at)), [mine, sold]);

  const add = useCallback(data => {
    const it = { ...data, id: `u-${Date.now()}`, status: 'open' };
    setMine(v => { const n = [it, ...v]; save(K, n); return n; });
    return it;
  }, []);
  const markSold = useCallback(id => setSold(v => { const n = [...new Set([...v, id])]; save(R, n); return n; }), []);
  const remove = useCallback(id => setMine(v => { const n = v.filter(x => x.id !== id); save(K, n); return n; }), []);
  const toggle = useCallback(id => setWish(v => { const n = v.includes(id) ? v.filter(x => x !== id) : [...v, id]; save(W, n); return n; }), []);
  const say = useCallback((id, me, t) => setChats(c => {
    const n = { ...c, [id]: [...(c[id] || []), { me, t, at: new Date().toISOString() }] }; save(C, n); return n;
  }), []);

  const saved = { ids: wish, toggle, has: id => wish.includes(id) };
  return { items, add, markSold, remove, saved, chats, say };
}
