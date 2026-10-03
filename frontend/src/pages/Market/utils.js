import { PLACES } from '../../data/lostFoundData';
import { CATEGORIES } from '../../data/marketData';
export { ago, whenFull, readImage, useCount } from '../LostFound/utils';

export const placeOf = id => PLACES.find(p => p.id === id);
export const money = n => (n > 0 ? `₹${Number(n).toLocaleString('en-IN')}` : 'Free');

// ---------- keyword matching (replace with a real AI call when the backend is ready) ----------
const tok = s => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const hit = (list, w) => list.some(h => h === w || (w.length > 3 && h.startsWith(w)));
const STOP = new Set('i my me the a an is was at in on find show any have there item items please can you help looking for where do does want need to buy sell selling sale get under below less than within upto up max rupees rs and with of it something anything around by cheap cheapest good best some'.split(' '));

export function score(x, words) {
  const t = tok(x.title), d = tok(x.desc), g = tok(x.tags.join(' '));
  return words.reduce((s, w) => s + (hit(t, w) ? 3 : 0) + (hit(g, w) ? 2 : 0) + (hit(d, w) ? 1 : 0), 0);
}

// Answers a chat question. Understands "under 500", "free", categories, "my listings" and "wanted".
export function assist(q, items) {
  const s = q.toLowerCase();
  if (/\bmy (listings?|items?|posts?|ads?)\b/.test(s)) {
    const m = items.filter(x => x.mine);
    return m.length ? { text: `You have ${m.length} listing${m.length > 1 ? 's' : ''}:`, items: m.slice(0, 4) }
      : { text: "You haven't posted anything yet. Tap “Sell an item” and it will show up here.", items: [] };
  }
  const free = /\bfree\b|giveaway|give away/.test(s);
  const m = /(?:under|below|less than|within|upto|up to|max|<)\s*(?:₹|rs\.?)?\s*(\d[\d,]*)/.exec(s) || /(?:₹|rs\.?)\s*(\d[\d,]*)/.exec(s);
  const max = free ? 0 : m ? +m[1].replace(/,/g, '') : null;
  const type = /\b(wanted|requests?|who wants|buyers?)\b/.test(s) ? 'want' : 'sell';
  const t = tok(s);
  const cat = CATEGORIES.find(c => c.keys.some(k => t.includes(k)));
  const words = t.filter(w => w.length > 1 && !/^\d+$/.test(w) && !STOP.has(w));
  const pool = items.filter(x => x.status === 'open' && x.type === type && (max == null || x.price <= max));
  const ranked = pool
    .map(x => ({ x, n: score(x, words) + (cat && x.cat === cat.k ? 3 : 0) }))
    .filter(r => r.n > 0 || (!words.length && !cat))
    .sort((a, b) => b.n - a.n || a.x.price - b.x.price);
  const lim = max != null ? ` ${free ? 'that are free' : `under ${money(max)}`}` : '';
  if (!ranked.length) return { text: `I couldn't find a match${lim} yet. Post a request and sellers will see it.`, items: [] };
  const hits = ranked.slice(0, 4).map(r => r.x);
  return { text: `${type === 'want' ? 'Students looking to buy' : 'Here is what I found'}${lim}${ranked.length > 4 ? ` (top 4 of ${ranked.length})` : ''}:`, items: hits };
}

// Fair-price hint from similar listings (same category, shared words in the title weigh first).
export function suggestPrice(d, items) {
  const w = tok(d.title).filter(x => x.length > 2 && !STOP.has(x));
  const pool = items.filter(x => x.type === 'sell' && x.price > 0 && x.cat === d.cat);
  const near = pool.filter(x => w.some(k => hit(tok(`${x.title} ${x.tags.join(' ')}`), k)));
  const use = near.length >= 2 ? near : pool;
  if (use.length < 2) return null;
  const p = use.map(x => x.price).sort((a, b) => a - b);
  const r = n => Math.max(10, Math.round(n / 10) * 10);
  return { low: r(p[Math.floor(p.length * 0.25)]), mid: r(p[Math.floor(p.length / 2)]), high: r(p[Math.min(p.length - 1, Math.floor(p.length * 0.75))]), n: use.length };
}

// While posting: open listings of the opposite type that look similar.
export function similar(d, items) {
  const w = tok(d.title).filter(x => x.length > 2 && !STOP.has(x));
  return items.filter(x => x.status === 'open' && x.type !== d.type)
    .map(x => ({ x, n: (x.cat === d.cat ? 2 : 0) + w.filter(k => hit(tok(`${x.title} ${x.tags.join(' ')}`), k)).length * 2 }))
    .filter(r => r.n >= 3).sort((a, b) => b.n - a.n).slice(0, 2).map(r => r.x);
}

// DEMO ONLY: a simulated reply from the other student.
export function autoReply(text, it) {
  const s = text.toLowerCase(), pl = placeOf(it.place)?.name || 'campus';
  if (it.type === 'want') return /have|got|sell/.test(s) ? `Great! Please send a photo and your price. I can meet near ${pl}.` : 'Sounds good. Message me the details.';
  const o = /₹\s*([\d,]+)/.exec(s);
  if (o && it.price > 0) {
    const v = +o[1].replace(/,/g, '');
    if (v >= it.price) return `Deal! Let's meet near ${pl}.`;
    if (!it.negotiable) return `Sorry, the price is fixed at ${money(it.price)}.`;
    return v >= it.price * 0.8 ? `Okay, ${money(v)} works. Let's meet near ${pl}.` : `That is too low for me. I can do ${money(Math.ceil(it.price * 0.9 / 10) * 10)}.`;
  }
  if (/available|still/.test(s)) return it.status === 'sold' ? 'Sorry, it has been sold.' : 'Yes, it is still available.';
  if (/meet|where|when|location/.test(s)) return `I can meet near ${pl}, usually after 4 PM.`;
  if (/price|cost|how much/.test(s)) return it.price > 0 ? `It is ${money(it.price)}${it.negotiable ? ', a little negotiable.' : '.'}` : 'It is free.';
  if (/\b(hi|hello|hey)\b/.test(s)) return 'Hi! Yes, tell me what you need.';
  return `Okay. Let me know when you can meet near ${pl}.`;
}
