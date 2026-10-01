import { useEffect, useState } from 'react';
import { PLACES, catOf } from '../../data/lostFoundData';

export const placeOf = id => PLACES.find(p => p.id === id);

export function ago(iso) {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso)) / 6e4));
  if (m < 2) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? 'Yesterday' : d < 14 ? `${d} days ago` : new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
export const whenFull = iso => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
// value for <input type="datetime-local"> in local time
export const localInput = (d = new Date()) => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);

// Counts up to n (skipped when the user prefers reduced motion).
export function useCount(n) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(n); return; }
    let r, s; const f = t => { s ??= t; const p = Math.min((t - s) / 800, 1); setV(Math.round(n * (1 - (1 - p) ** 3))); if (p < 1) r = requestAnimationFrame(f); };
    r = requestAnimationFrame(f); return () => cancelAnimationFrame(r);
  }, [n]);
  return v;
}

// Reads an image file and shrinks it so it fits comfortably in localStorage.
export const readImage = (file, max = 640) => new Promise((res, rej) => {
  const fr = new FileReader(); fr.onerror = rej;
  fr.onload = () => {
    const img = new Image(); img.onerror = rej;
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.78));
    };
    img.src = fr.result;
  };
  fr.readAsDataURL(file);
});

// ---------- keyword matching (replace with a real AI call when the backend is ready) ----------
const tok = s => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const hit = (list, w) => list.some(h => h === w || (w.length > 3 && h.startsWith(w)));
const STOP = new Set('i my me the a an is was near at in on find show any have there lost found item items please can you help looking for where did last left and with of to it report reports missing picked up lose misplaced search something anything around by'.split(' '));

export function score(x, words) {
  const t = tok(x.title), d = tok(x.desc), g = tok(`${x.tags.join(' ')} ${catOf(x.cat).label}`);
  return words.reduce((s, w) => s + (hit(t, w) ? 3 : 0) + (hit(g, w) ? 2 : 0) + (hit(d, w) ? 1 : 0), 0);
}

// Answers a chat question from the loaded items. "I lost X" searches found items, "I found X" searches lost items.
export function assist(q, items) {
  const s = q.toLowerCase();
  if (/\bmy (reports?|items?)\b/.test(s)) {
    const m = items.filter(x => x.mine);
    return m.length ? { text: `You have ${m.length} report${m.length > 1 ? 's' : ''}:`, items: m.slice(0, 4) }
      : { text: "You haven't reported anything yet. Tap “Report an Item” and it will show up here.", items: [] };
  }
  const lost = /\b(lost|lose|missing|misplaced|left)\b/.test(s), found = /\b(found|picked)\b/.test(s);
  const want = lost && !found ? 'found' : found && !lost ? 'lost' : null;
  const place = PLACES.find(p => p.keys.some(k => s.includes(k)));
  const words = tok(s).filter(w => w.length > 1 && !STOP.has(w));
  const open = items.filter(x => x.status === 'open' && (!want || x.type === want));
  const ranked = open
    .map(x => ({ x, n: score(x, words) + (place && x.place === place.id ? 2 : 0) }))
    .filter(r => r.n > 0 || (!words.length && !place))
    .sort((a, b) => b.n - a.n || new Date(b.x.at) - new Date(a.x.at));
  const where = place ? ` near ${place.name}` : '';
  if (!ranked.length) return { text: `I couldn't find a match${where} yet. Report it, and anyone who finds it will see it on the campus map.`, items: [] };
  const hits = ranked.slice(0, 4).map(r => r.x);
  return { text: `${want ? `Possible matches among ${want} items` : 'Here is what I found'}${where}${ranked.length > 4 ? ` (top 4 of ${ranked.length})` : ''}:`, items: hits };
}

// DEMO ONLY: ranks found items with a made-up match %. Replace with a real image-similarity API.
export function photoMatches(file, items) {
  const seed = (file.size + file.name.length * 31) % 97;
  return items.filter(x => x.status === 'open' && x.type === 'found')
    .map((x, i) => ({ ...x, match: 94 - ((i * 17 + seed) % 33) }))
    .sort((a, b) => b.match - a.match).slice(0, 3);
}

// While reporting: open items of the opposite type that look similar (same category/place, shared words).
export function possibleMatches(d, items) {
  const w = tok(d.title).filter(x => x.length > 2 && !STOP.has(x));
  return items.filter(x => x.status === 'open' && x.type !== d.type)
    .map(x => ({ x, n: (x.cat === d.cat ? 2 : 0) + (x.place === d.place ? 1 : 0) + w.filter(k => hit(tok(`${x.title} ${x.tags.join(' ')}`), k)).length * 2 }))
    .filter(r => r.n >= 3).sort((a, b) => b.n - a.n).slice(0, 2).map(r => r.x);
}

// Picks the nearest building when someone taps the map.
export const nearest = (lat, lng) => PLACES.reduce((b, p) => {
  const d = (p.lat - lat) ** 2 + (p.lng - lng) ** 2; return d < b.d ? { p, d } : b;
}, { p: PLACES[0], d: Infinity }).p;