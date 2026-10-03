// Finds your photos automatically, wherever they sit inside src/assets.
//  - Hero: any file with "shopping" in its name. "After Dark" / "night" = dark theme, the other one = light theme.
//    (GBU Shopping Centre Campus Plaza.png  and  GBU Shopping Centre After Dark.png)
//  - Items: every image inside a folder called "items" (src/assets/items or src/assets/images/items).
//    A photo is matched to a listing when the file name shares a word with the listing title or tags
//    (cycle.png -> cycle listing, calculator.jpg -> calculator, lab-coat.png -> lab coat).
//    If you keep a light and a dark version (cycle-light.png / cycle-dark.png), the one for the current theme is used.
//    To force a match, add it to MANUAL below: { m1: 'grewal-maths' } (listing id -> part of the file name).
//    Run the app in dev and open the browser console: a table shows which file each listing got.
const all = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,webp,avif}', { eager: true, import: 'default' });
const files = Object.entries(all).map(([p, url]) => {
  const low = p.toLowerCase();
  const name = low.split('/').pop().replace(/\.[a-z]+$/, '');
  return { low, name, url, items: low.includes('/items/') };
});

const MANUAL = {};

const hero = files.filter(f => !f.items && f.name.includes('shopping'));
const isDark = f => /dark|night/.test(f.name);
export const marketHero = {
  light: (hero.find(f => !isDark(f)) || files.find(f => f.name === 'campus-market-day'))?.url,
  dark: (hero.find(isDark) || files.find(f => f.name === 'campus-market-night'))?.url,
};

const THEME_WORDS = new Set(['dark', 'night', 'light', 'day']);
const GENERIC = new Set('size set kit starter mini black white blue wireless handwritten latest used new good looking need for with the and semester year previous papers sale item items'.split(' '));
const norm = s => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const same = (a, b) => a === b || (a.length > 3 && b.length > 3 && (a.startsWith(b) || b.startsWith(a)));

const pics = files.filter(f => f.items).map(f => {
  const t = norm(f.name);
  const variant = t.some(w => w === 'dark' || w === 'night') ? 'dark' : t.some(w => w === 'light' || w === 'day') ? 'light' : null;
  const words = t.filter(w => !THEME_WORDS.has(w));
  return { ...f, variant, words, joined: words.join('') };
});

function find(it, theme) {
  if (!pics.length) return null;
  if (MANUAL[it.id]) {
    const m = pics.filter(p => p.low.includes(MANUAL[it.id].toLowerCase()));
    return m.find(p => p.variant === theme) || m.find(p => !p.variant) || m[0] || null;
  }
  const ws = [...new Set([...norm(it.title), ...it.tags.flatMap(norm)])].filter(w => w.length > 2 && !GENERIC.has(w));
  let top = 0, cand = [];
  for (const p of pics) {
    const s = ws.reduce((n, w) => n + (p.words.some(h => same(h, w)) ? 3 : w.length >= 5 && p.joined.includes(w) ? 2 : 0), 0);
    if (s > top) { top = s; cand = [p]; } else if (s === top && s > 0) cand.push(p);
  }
  if (!cand.length) return null;
  return cand.find(p => p.variant === theme) || cand.find(p => !p.variant) || cand[0];
}

export const itemImageFor = (it, theme = 'light') => find(it, theme)?.url || null;
export const matchReport = (list, theme = 'light') => list.map(it => ({ id: it.id, listing: it.title, file: find(it, theme)?.name || '(none)' }));
export const itemFileCount = pics.length;
