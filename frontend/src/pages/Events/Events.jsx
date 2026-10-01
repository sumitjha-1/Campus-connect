import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, CalendarPlus, Bell, History, Bookmark, Search, ArrowUpRight, RefreshCw, WifiOff, SearchX, List } from 'lucide-react';
import PageShell from '../../components/PageShell/PageShell';
import useGbuFeed from '../../hooks/useGbuFeed';
import useSaved from '../../hooks/useSaved';
import { toDate } from '../../services/gbu';
import { classify } from '../../data/categories';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import { campusImages } from '../../assets/images/campus';
import { snapshotEvents, snapshotNotices, SNAPSHOT_DATE } from '../../data/gbuSnapshot';
import Assistant from './Assistant';
import MonthCalendar from './MonthCalendar';
import { today, fmt, monthLabel, daysTo, inDays, keyOf, addToCalendar } from './utils';

const TABS = [
  { k: 'up', label: 'Upcoming', icon: CalendarDays },
  { k: 'past', label: 'Past events', icon: History },
  { k: 'notice', label: 'Notices', icon: Bell },
  { k: 'saved', label: 'Saved', icon: Bookmark },
];

function Num({ n }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(n); return; }
    let r, s; const f = t => { s ??= t; const p = Math.min((t - s) / 900, 1); setV(Math.round(n * (1 - (1 - p) ** 3))); if (p < 1) r = requestAnimationFrame(f); };
    r = requestAnimationFrame(f); return () => cancelAnimationFrame(r);
  }, [n]);
  return v;
}

function Countdown({ date }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const ms = (toDate(date)?.getTime() || 0) - now;
  if (ms <= 0) return <div className="cd today">Happening today</div>;
  const s = Math.floor(ms / 1000);
  return <div className="cd">{[['Days', Math.floor(s / 86400)], ['Hrs', Math.floor(s % 86400 / 3600)], ['Min', Math.floor(s % 3600 / 60)], ['Sec', s % 60]].map(([l, v]) => <div key={l}><b>{String(v).padStart(2, '0')}</b><small>{l}</small></div>)}</div>;
}

const mark = (t, n) => { if (!n) return t; const i = t.toLowerCase().indexOf(n); return i < 0 ? t : <>{t.slice(0, i)}<mark>{t.slice(i, i + n.length)}</mark>{t.slice(i + n.length)}</>; };

function Card({ it, upcoming, i, needle, saved, onSave }) {
  const { Icon, color, label } = classify(it);
  const n = daysTo(it.date);
  return (
    <article className="ev" style={{ '--c': `var(--${color})`, '--i': Math.min(i, 8) }}>
      <span className="ev-ic"><Icon size={24} /></span>
      <span className="ev-body">
        <span className="ev-meta"><em className="ev-tag">{label}</em><span>{fmt(it.date)}</span>{upcoming && n !== null && <span className="wh">{inDays(n)}</span>}</span>
        <a className="ev-link" href={it.href} target="_blank" rel="noopener noreferrer">{mark(it.title, needle)}</a>
        {it.org && <span className="ev-org">{mark(it.org, needle)}</span>}
      </span>
      <span className="ev-act">
        {upcoming && <button type="button" className="ev-cal" onClick={() => addToCalendar(it)} title="Add to calendar" aria-label="Add to calendar"><CalendarPlus size={17} /><span>Add</span></button>}
        <button type="button" className={`ev-save ${saved ? 'on' : ''}`} onClick={onSave} title={saved ? 'Remove from saved' : 'Save'} aria-pressed={saved} aria-label="Save"><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></button>
      </span>
      <ArrowUpRight className="ev-go" size={18} />
    </article>
  );
}

export default function Events() {
  const { theme } = useTheme();
  const saved = useSaved();
  const search = useRef(null);
  const [tab, setTab] = useState('up');
  const [view, setView] = useState('list');
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [day, setDay] = useState(null);
  const [cal, setCal] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const ev = useGbuFeed('/page/events', snapshotEvents);
  const no = useGbuFeed('/page/notices', snapshotNotices);

  useEffect(() => { // press "/" to jump to search
    const k = e => { if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); search.current?.focus(); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);

  const lists = useMemo(() => {
    const t = today(); const w = x => toDate(x.date)?.getTime() || 0;
    const e = ev.items.map(x => ({ ...x, kind: 'event' }));
    const L = {
      up: e.filter(x => w(x) >= t).sort((a, b) => w(a) - w(b)),
      past: e.filter(x => w(x) < t).sort((a, b) => w(b) - w(a)),
      notice: no.items.map(x => ({ ...x, kind: 'notice' })).sort((a, b) => w(b) - w(a)),
    };
    L.saved = [...L.up, ...L.past, ...L.notice].filter(x => saved.has(keyOf(x)));
    return L;
  }, [ev.items, no.items, saved.ids]);

  const needle = q.trim().toLowerCase();
  const base = lists[tab];
  const cats = useMemo(() => { const m = {}; base.forEach(x => { const l = classify(x).label; m[l] = (m[l] || 0) + 1; }); return Object.entries(m); }, [base]);
  const shown = base.filter(x => (cat === 'All' || classify(x).label === cat) && (!needle || `${x.title} ${x.org}`.toLowerCase().includes(needle)));
  const groups = useMemo(() => { const m = new Map(); shown.forEach(x => { const d = toDate(x.date); const k = d ? monthLabel(d) : 'Other'; m.set(k, [...(m.get(k) || []), x]); }); return [...m]; }, [shown]);
  const allEvents = useMemo(() => [...lists.up, ...lists.past], [lists]);
  const calItems = allEvents.filter(x => { const d = toDate(x.date); return d && (day ? d.toDateString() === day.toDateString() : d.getMonth() === cal.getMonth() && d.getFullYear() === cal.getFullYear()); });
  const status = tab === 'notice' ? no.status : ev.status;
  const next = lists.up[0]; const nc = next && classify(next); const nn = next && daysTo(next.date);
  const pick = k => { setTab(k); setCat('All'); setView('list'); };
  let idx = 0;
  const card = (it, up) => <Card key={keyOf(it)} it={it} upcoming={up} i={idx++} needle={needle} saved={saved.has(keyOf(it))} onSave={() => saved.toggle(keyOf(it))} />;

  return (
    <PageShell hero>
      <section className="evh">
        <div className="evh-bg" style={{ backgroundImage: `url(${campusImages.aerial[theme]})` }} />
        <div className="wrap evh-in">
          <div className="evh-l">
            <div className={`feed-status ${ev.status}`}>
              {ev.status === 'snapshot' ? <><WifiOff size={14} />Saved copy from {SNAPSHOT_DATE}<button type="button" onClick={() => { ev.retry(); no.retry(); }}>Retry</button></>
                : ev.status === 'live' ? <><i />Live from gbu.ac.in</> : <><RefreshCw size={14} className="spin" />Checking gbu.ac.in…</>}
            </div>
            <h1>What's on <em>at GBU</em></h1>
            <p className="lead">Every upcoming event, past event and official notice from the university website, in one place you can search, save and add to your calendar.</p>
            <div className="evh-stats">
              <div><b><Num n={lists.up.length} /></b><small>upcoming</small></div>
              <div><b><Num n={lists.past.length} /></b><small>past events</small></div>
              <div><b><Num n={lists.notice.length} /></b><small>notices</small></div>
            </div>
          </div>
          <Assistant lists={lists} />
        </div>
      </section>

      <div className="wrap pg-c">
        {next && (
          <section className="spot" style={{ '--c': `var(--${nc.color})` }}>
            <div className="spot-l">
              <span className="ev-ic"><nc.Icon size={26} /></span>
              <div>
                <p className="spot-k"><i />Next up · {nn !== null && inDays(nn)}</p>
                <h2>{next.title}</h2>
                <p className="spot-m"><em className="ev-tag">{nc.label}</em>{fmt(next.date)}{next.org && ` · ${next.org}`}</p>
              <div className="spot-act">
                <a className="btn btn-primary" href={next.href} target="_blank" rel="noopener noreferrer">Details <ArrowUpRight size={15} /></a>
                <button type="button" className="btn btn-ghost" onClick={() => addToCalendar(next)}><CalendarPlus size={16} />Add to calendar</button>
              </div>
              </div>
            </div>
            <div className="spot-r">
              <Countdown date={next.date} />
            </div>
          </section>
        )}

        <div className="tb">
          <div className="tabs" role="tablist">
            {TABS.map(t => (
              <button key={t.k} type="button" role="tab" aria-selected={view === 'list' && tab === t.k} className={view === 'list' && tab === t.k ? 'on' : ''} onClick={() => pick(t.k)}>
                <t.icon size={16} /><em>{t.label}</em><span>{lists[t.k].length}</span>
              </button>
            ))}
          </div>
          <label className="search"><Search size={16} /><input ref={search} value={q} onChange={e => setQ(e.target.value)} placeholder="Search events" aria-label="Search" /><kbd>/</kbd></label>
          <div className="vsw" role="group" aria-label="View">
            <button type="button" className={view === 'list' ? 'on' : ''} onClick={() => setView('list')} aria-label="List view"><List size={16} /></button>
            <button type="button" className={view === 'cal' ? 'on' : ''} onClick={() => setView('cal')} aria-label="Calendar view"><CalendarDays size={16} /></button>
          </div>
        </div>

        {view === 'cal' ? (
          <div className="cal-wrap">
            <MonthCalendar events={allEvents} month={cal} setMonth={m => { setCal(m); setDay(null); }} selected={day} onSelect={setDay} />
            <div className="cal-list">
              <h3 className="mo">{day ? fmt(day.toLocaleDateString('en-GB').replace(/\//g, '-')) : monthLabel(cal)}<span>{calItems.length}</span></h3>
              {calItems.length ? calItems.map(it => card(it, lists.up.includes(it))) : <div className="empty"><CalendarDays size={28} /><b>No events {day ? 'on this day' : 'this month'}</b><span>Days with dots have events. Try another month.</span></div>}
            </div>
          </div>
        ) : (<>
          {cats.length > 1 && <div className="cats"><button type="button" className={cat === 'All' ? 'on' : ''} onClick={() => setCat('All')}>All <span>{base.length}</span></button>{cats.map(([c, n]) => <button type="button" key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c} <span>{n}</span></button>)}</div>}
          <div className="ev-list" key={tab + cat}>
            {status === 'loading' ? [0, 1, 2, 3].map(i => <div className="ev sk" key={i} />)
              : groups.length ? groups.map(([m, items]) => (
                <section className="mo-group" key={m}><h3 className="mo">{m}<span>{items.length}</span></h3>{items.map(it => card(it, tab === 'up'))}</section>))
              : <div className="empty"><SearchX size={30} />
                  <b>{needle || cat !== 'All' ? 'Nothing matches that' : tab === 'saved' ? 'Nothing saved yet' : tab === 'up' ? 'No upcoming events right now' : 'Nothing here yet'}</b>
                  <span>{needle || cat !== 'All' ? 'Try a different word or clear the filter.' : tab === 'saved' ? 'Tap the bookmark on any event or notice to keep it here.' : 'Check back soon, or look at past events.'}</span></div>}
          </div>
        </>)}
        <p className="src">Source: <a href="https://www.gbu.ac.in" target="_blank" rel="noopener noreferrer">gbu.ac.in</a>. Titles open the official page. Saved items stay in this browser.</p>
      </div>
    </PageShell>
  );
}
