import { PLACES } from '../../data/lostFoundData';
import { KINDS, kindOf, isTrip } from '../../data/helpData';
export { ago, useCount } from '../LostFound/utils';

export const placeOf = id => PLACES.find(p => p.id === id);
export const seatsLeft = (it, joined) => Math.max(0, (it.seats || 0) - (joined.includes(it.id) ? 1 : 0));
export const localInput = (d = new Date()) => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);

// "Today, 6:00 PM" / "Tomorrow, 7:30 AM" / "Sat, 9:00 AM"
export function whenLabel(iso) {
  if (!iso) return '';
  const d = new Date(iso), t = new Date(); t.setHours(0, 0, 0, 0);
  const days = Math.round((new Date(d).setHours(0, 0, 0, 0) - t) / 864e5);
  const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  const day = days <= 0 ? 'Today' : days === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  return `${day}, ${time}`;
}

// What the main button says, depending on the post.
export function actionLabel(it, joined) {
  if (it.mine) return 'Manage';
  if (it.status === 'done') return 'Closed';
  if (isTrip(it.kind)) return seatsLeft(it, joined) ? (joined.includes(it.id) ? 'You joined' : it.mode === 'offer' ? 'Join trip' : 'Share this trip') : 'Full';
  if (it.kind === 'notes' && it.mode === 'offer') return 'Get notes';
  return it.mode === 'need' ? 'I can help' : 'Ask for it';
}

// ---------- keyword matching (replace with a real AI call when the backend is ready) ----------
const tok = s => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const hit = (list, w) => list.some(h => h === w || (w.length > 3 && h.startsWith(w)));
const STOP = new Set('i my me the a an is was at in on find show any have there please can you help looking for where do does want need to get some someone anyone who with of it and by from near about tomorrow today'.split(' '));

const score = (x, words) => {
  const t = tok(`${x.title} ${x.dest}`), d = tok(x.desc), g = tok(x.tags.join(' '));
  return words.reduce((s, w) => s + (hit(t, w) ? 3 : 0) + (hit(g, w) ? 2 : 0) + (hit(d, w) ? 1 : 0), 0);
};

// Returns { text, items, cta }. cta = { label, kind } opens the post form.
export function assist(q, items) {
  const s = q.toLowerCase();
  if (/\bmy (posts?|requests?|offers?|items?)\b/.test(s)) {
    const m = items.filter(x => x.mine);
    return m.length ? { text: `You have ${m.length} post${m.length > 1 ? 's' : ''}:`, items: m.slice(0, 4) }
      : { text: 'You have not posted anything yet. Ask for help or offer yours, it takes a minute.', items: [], cta: { label: 'Ask for help', kind: 'borrow' } };
  }
  if (/reward|treat|thank|pay/.test(s) && /how|what|work|give/.test(s))
    return { text: 'When you ask for help you can add a small reward, like a chai or a shake. The helper sees it before replying, and you hand it over when the favour is done. Rewards are optional.', items: [] };
  if (/safe|safety|trust|verify/.test(s))
    return { text: 'Every account is ID checked. Meet in public campus spots, and for taxis share the trip details with a friend before you leave.', items: [] };
  const t = tok(s);
  const kind = KINDS.find(k => k.keys.some(w => t.includes(w)));
  const offer = /\b(offering|can lend|i can help|share my|spare)\b/.test(s);
  const words = t.filter(w => w.length > 1 && !STOP.has(w));
  const pool = items.filter(x => x.status === 'open' && (!offer ? true : x.mode === 'offer'));
  const ranked = pool
    .map(x => ({ x, n: score(x, words) + (kind && x.kind === kind.k ? 3 : 0) }))
    .filter(r => r.n > 0 || (!words.length && !kind))
    .sort((a, b) => b.n - a.n || new Date(b.x.at) - new Date(a.x.at));
  if (!ranked.length) return { text: 'Nothing like that yet. Post it and students nearby will see it right away.', items: [], cta: { label: `Post a ${kind ? kindOf(kind.k).short.toLowerCase() : 'help'} request`, kind: kind?.k || 'other' } };
  return { text: `${ranked.length > 4 ? `Top 4 of ${ranked.length} matches` : 'Here is what I found'}:`, items: ranked.slice(0, 4).map(r => r.x) };
}

// While posting: open posts of the opposite mode that look similar.
export function similar(d, items) {
  const w = tok(d.title).filter(x => x.length > 2 && !STOP.has(x));
  return items.filter(x => x.status === 'open' && x.mode !== d.mode)
    .map(x => ({ x, n: (x.kind === d.kind ? 2 : 0) + w.filter(k => hit(tok(`${x.title} ${x.tags.join(' ')}`), k)).length * 2 }))
    .filter(r => r.n >= 3).sort((a, b) => b.n - a.n).slice(0, 2).map(r => r.x);
}

// DEMO ONLY: a simulated reply from the other student.
export function autoReply(text, it) {
  const s = text.toLowerCase(), pl = placeOf(it.place)?.name || 'campus';
  if (/\b(hi|hello|hey)\b/.test(s)) return 'Hi! Yes, tell me what you need.';
  if (/meet|where|when|location|pick/.test(s)) return isTrip(it.kind) ? `Let us meet near ${pl} ten minutes early.` : `I can meet near ${pl}, usually after 4 PM.`;
  if (/reward|treat|chai|coffee/.test(s)) return it.reward ? `${it.reward} sounds great, thank you!` : 'No reward needed, happy to help.';
  if (/fare|cost|share|split|pay/.test(s)) return it.cost ? `${it.cost}, we split it at the end.` : 'We will split it equally.';
  if (/have|can help|got it|available/.test(s)) return it.mode === 'need' ? `Perfect! Please bring it to ${pl}.` : 'Yes, it is still available.';
  return `Okay. Let me know when you can reach ${pl}.`;
}
