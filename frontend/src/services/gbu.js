import { GBU_PROXY } from '../config';
const BASE = 'https://www.gbu.ac.in';
const DATE = /(\d{2})-(\d{2})-(\d{4})/;
export const toDate = s => { const m = DATE.exec(s || ''); return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null; };

// Works for the table on /page/events and /page/notices, and for list items like "Title (dd-mm-yyyy)".
function parse(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const rows = [...doc.querySelectorAll('tr, li')];
  const seen = new Set(); const out = [];
  for (const r of rows) {
    const a = r.querySelector('a[href]'); const d = DATE.exec(r.textContent);
    if (!a || !d) continue;
    let href; try { href = new URL(a.getAttribute('href'), BASE).href; } catch { continue; }
    if (seen.has(href)) continue; seen.add(href);
    const cells = r.querySelectorAll('td');
    out.push({ date: d[0], title: a.textContent.replace(/\s+/g, ' ').trim(), href, org: (cells[3]?.textContent || '').replace(/\s+/g, ' ').trim() });
  }
  return out;
}

export async function loadGbu(path) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
  try {
    const res = await fetch(`${GBU_PROXY}${path}`, { signal: ctl.signal });
    if (!res.ok) throw new Error(res.status);
    const items = parse(await res.text());
    if (!items.length) throw new Error('empty');
    return items;
  } finally { clearTimeout(t); }
}
