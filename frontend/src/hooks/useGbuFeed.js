import { useEffect, useState, useCallback } from 'react';
import { loadGbu } from '../services/gbu';

// Returns { items, status, retry } where status is 'loading' | 'live' | 'snapshot'.
export default function useGbuFeed(path, fallback) {
  const [s, setS] = useState({ items: [], status: 'loading' });
  const [n, setN] = useState(0);
  useEffect(() => {
    let off = false;
    setS(v => ({ ...v, status: 'loading' }));
    loadGbu(path).then(items => !off && setS({ items, status: 'live' }))
      .catch(() => !off && setS({ items: fallback, status: 'snapshot' }));
    return () => { off = true; };
  }, [path, n]);
  const retry = useCallback(() => setN(v => v + 1), []);
  return { ...s, retry };
}
