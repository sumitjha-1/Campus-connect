import { useState, useCallback } from 'react';
const KEY = 'cc-saved-events';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
// Bookmarks kept in this browser only (localStorage). Swap for an API call once the backend exists.
export default function useSaved() {
  const [ids, setIds] = useState(read);
  const toggle = useCallback(id => setIds(v => {
    const n = v.includes(id) ? v.filter(x => x !== id) : [...v, id];
    try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {}
    return n;
  }), []);
  return { ids, toggle, has: id => ids.includes(id) };
}
