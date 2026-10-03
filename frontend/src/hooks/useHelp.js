import { useState, useCallback, useMemo } from 'react';
import { seedItems } from '../data/helpData';

const K = 'cc-hp-items', D = 'cc-hp-done', W = 'cc-hp-saved', C = 'cc-hp-chats', J = 'cc-hp-joined';
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// Posts made in this browser (localStorage) + sample posts. Swap for API calls once the backend exists.
// Returns { items, add, markDone, remove, saved, chats, say, joined, join }.
export default function useHelp() {
  const [mine, setMine] = useState(() => load(K, []));
  const [done, setDone] = useState(() => load(D, []));
  const [wish, setWish] = useState(() => load(W, []));
  const [chats, setChats] = useState(() => load(C, {}));
  const [joined, setJoined] = useState(() => load(J, []));

  const items = useMemo(() => [...mine.map(x => ({ ...x, mine: true })), ...seedItems]
    .map(x => ({ ...x, status: x.status === 'done' || done.includes(x.id) ? 'done' : 'open' }))
    .sort((a, b) => new Date(b.at) - new Date(a.at)), [mine, done]);

  const add = useCallback(data => {
    const it = { ...data, id: `u-${Date.now()}`, status: 'open' };
    setMine(v => { const n = [it, ...v]; save(K, n); return n; });
    return it;
  }, []);
  const markDone = useCallback(id => setDone(v => { const n = [...new Set([...v, id])]; save(D, n); return n; }), []);
  const remove = useCallback(id => setMine(v => { const n = v.filter(x => x.id !== id); save(K, n); return n; }), []);
  const toggle = useCallback(id => setWish(v => { const n = v.includes(id) ? v.filter(x => x !== id) : [...v, id]; save(W, n); return n; }), []);
  const join = useCallback(id => setJoined(v => { const n = [...new Set([...v, id])]; save(J, n); return n; }), []);
  const say = useCallback((id, me, t) => setChats(c => {
    const n = { ...c, [id]: [...(c[id] || []), { me, t, at: new Date().toISOString() }] }; save(C, n); return n;
  }), []);

  const saved = { ids: wish, toggle, has: id => wish.includes(id) };
  return { items, add, markDone, remove, saved, chats, say, joined, join };
}
