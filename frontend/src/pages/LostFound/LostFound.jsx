import { useMemo, useRef, useState } from 'react';
import { Search, Plus, Package, BadgeCheck, Undo2, Clock, Bookmark, FileText, SearchX } from 'lucide-react';
import PageShell from '../../components/PageShell/PageShell';
import useLostFound from '../../hooks/useLostFound';
import useSaved from '../../hooks/useSaved';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import { campusImages } from '../../assets/images/campus';
import { CATEGORIES, PLACES, catOf } from '../../data/lostFoundData';
import LFAssistant from './LFAssistant';
import LiveMap from './LiveMap';
import ItemCard from './ItemCard';
import ItemDetail from './ItemDetail';
import ReportModal from './ReportModal';
import { ago, placeOf, useCount } from './utils';

const TABS = [
  { k: 'all', label: 'All', icon: Package },
  { k: 'lost', label: 'Lost', icon: Search },
  { k: 'found', label: 'Found', icon: BadgeCheck },
  { k: 'mine', label: 'My reports', icon: FileText },
  { k: 'saved', label: 'Saved', icon: Bookmark },
];

function Stat({ n, label, icon: Icon, color }) {
  const v = useCount(n);
  return <div className="lf-stat" style={{ '--c': `var(--${color})` }}><i><Icon size={16} /></i><div><b>{v}</b><small>{label}</small></div></div>;
}

export default function LostFound() {
  const { theme } = useTheme();
  const lf = useLostFound();
  const saved = useSaved();
  const search = useRef(null), tt = useRef(0);
  const [tab, setTab] = useState('all');
  const [cat, setCat] = useState('All');
  const [place, setPlace] = useState('');
  const [sort, setSort] = useState('new');
  const [q, setQ] = useState('');
  const [report, setReport] = useState(null); // 'lost' | 'found' | null
  const [detail, setDetail] = useState(null); // item id
  const [focus, setFocus] = useState(null);   // item id highlighted on the map
  const [toast, setToast] = useState('');

  const { items } = lf;
  const open = detail ? items.find(x => x.id === detail) : null;
  const say = m => { setToast(m); clearTimeout(tt.current); tt.current = setTimeout(() => setToast(''), 3500); };

  const lists = useMemo(() => ({
    all: items, lost: items.filter(x => x.type === 'lost'), found: items.filter(x => x.type === 'found'),
    mine: items.filter(x => x.mine), saved: items.filter(x => saved.has(x.id)),
  }), [items, saved.ids]);

  const needle = q.trim().toLowerCase();
  const base = lists[tab];
  const cats = useMemo(() => { const m = {}; base.forEach(x => { m[x.cat] = (m[x.cat] || 0) + 1; }); return Object.entries(m); }, [base]);
  const shown = useMemo(() => base
    .filter(x => (cat === 'All' || x.cat === cat) && (!place || x.place === place)
      && (!needle || `${x.title} ${x.desc} ${x.tags.join(' ')} ${catOf(x.cat).label} ${placeOf(x.place)?.name}`.toLowerCase().includes(needle)))
    .sort((a, b) => (sort === 'new' ? 1 : -1) * (new Date(b.at) - new Date(a.at))), [base, cat, place, needle, sort]);

  // the map shows exactly what the list shows (open items only)
  const pins = useMemo(() => shown.filter(x => x.status === 'open'), [shown]);

  const stats = { reported: items.length, found: lists.found.length, returned: items.filter(x => x.status === 'returned').length, awaiting: items.filter(x => x.status === 'open').length };
  const pick = k => { setTab(k); setCat('All'); setFocus(null); };
  const goSearch = () => { document.getElementById('lf-tools')?.scrollIntoView({ behavior: 'smooth' }); search.current?.focus({ preventScroll: true }); };
  const locate = it => { setFocus(it.id); document.getElementById('lf-map')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };

  const submit = data => {
    const it = lf.add(data); setReport(null); setTab('all'); setCat('All'); setPlace(''); setQ(''); setFocus(it.id);
    say('Report posted. It is now pinned on the map.');
  };

  return (
    <PageShell hero>
      <section className="evh lf-hero">
        <div className="evh-bg" style={{ backgroundImage: `url(${campusImages.lostFound[theme]})` }} />
        <div className="wrap evh-in">
          <div className="evh-l">
            <h1>Lost something? <em>Find it on campus.</em></h1>
            <p className="lead">Report it, pin it on the map, and let AI match it with what others have found.</p>
            <div className="hero-cta">
              <button type="button" className="btn btn-primary" onClick={() => setReport('lost')}><Plus size={16} />Report an item</button>
              <button type="button" className="btn btn-glass" onClick={goSearch}><Search size={16} />Search items</button>
            </div>
          </div>
          <LFAssistant items={items} onOpen={it => setDetail(it.id)} />
        </div>
      </section>

      <div className="wrap pg-c lf-page">
        <section className="lf-stats" aria-label="Summary">
          <Stat n={stats.reported} label="Reported" icon={Package} color="primary" />
          <Stat n={stats.found} label="Found" icon={BadgeCheck} color="green" />
          <Stat n={stats.returned} label="Returned" icon={Undo2} color="blue" />
          <Stat n={stats.awaiting} label="Awaiting return" icon={Clock} color="rose" />
        </section>

        <div className="tb" id="lf-tools">
          <div className="tabs" role="tablist">
            {TABS.map(t => (
              <button key={t.k} type="button" role="tab" aria-selected={tab === t.k} className={tab === t.k ? 'on' : ''} onClick={() => pick(t.k)}>
                <t.icon size={14} /><em>{t.label}</em><span>{lists[t.k].length}</span>
              </button>
            ))}
          </div>
          <label className="search"><Search size={15} /><input ref={search} value={q} onChange={e => setQ(e.target.value)} placeholder="Search laptop, wallet, ID card…" aria-label="Search items" /></label>
          <select className="lf-sel" value={place} onChange={e => setPlace(e.target.value)} aria-label="Location">
            <option value="">All locations</option>{PLACES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="lf-sel" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort">
            <option value="new">Latest first</option><option value="old">Oldest first</option>
          </select>
        </div>

        <div className="lf-main">
          <div className="lf-list">
            {cats.length > 1 && (
              <div className="cats">
                <button type="button" className={cat === 'All' ? 'on' : ''} onClick={() => setCat('All')}>All <span>{base.length}</span></button>
                {CATEGORIES.filter(c => cats.some(([k]) => k === c.k)).map(c => (
                  <button type="button" key={c.k} className={cat === c.k ? 'on' : ''} onClick={() => setCat(c.k)}>{c.label} <span>{cats.find(([k]) => k === c.k)[1]}</span></button>
                ))}
              </div>
            )}
            <div className="lf-grid" key={tab + cat + place}>
              {shown.length ? shown.map((it, i) => (
                <ItemCard key={it.id} it={it} i={i} saved={saved.has(it.id)} active={focus === it.id}
                  onSave={() => saved.toggle(it.id)} onOpen={() => setDetail(it.id)} onLocate={() => locate(it)} />
              )) : (
                <div className="empty"><SearchX size={30} />
                  <b>{needle || cat !== 'All' || place ? 'Nothing matches that' : tab === 'mine' ? 'No reports yet' : tab === 'saved' ? 'Nothing saved yet' : 'No items here yet'}</b>
                  <span>{needle || cat !== 'All' || place ? 'Try a different word or clear the filters.' : tab === 'mine' ? 'Tap “Report an item” to add your first one.' : tab === 'saved' ? 'Tap the bookmark on any item to keep it here.' : 'Check back soon.'}</span>
                </div>
              )}
            </div>
          </div>

          <aside className="lf-side">
            <section className="lf-panel lf-mapp" id="lf-map">
              <div className="lf-ph">
                <b>Campus map</b>{place && <button type="button" className="lf-clear" onClick={() => setPlace('')}>Clear filter</button>}
                <span className="lf-leg"><i className="l" />Lost<i className="f" />Found<em>{pins.length} pinned</em></span>
              </div>
              <LiveMap items={pins} activeId={focus} place={place} onPlace={p => setPlace(v => (v === p.id ? '' : p.id))} onOpen={it => { setFocus(it.id); setDetail(it.id); }} />
              <p className="lf-tip">Click a pin to open the report. Click a building name to show only its items. The target icon on a card jumps to it.</p>
            </section>
          </aside>
        </div>
        <section className="lf-panel lf-recent">
      <div className="lf-ph"><b>Recent activity</b></div>
      <div className="lf-ra">
        {items.slice(0, 4).map(it => (
          <button type="button" key={it.id} onClick={() => setDetail(it.id)} style={{ '--c': it.status === 'returned' ? 'var(--blue)' : it.type === 'lost' ? 'var(--rose)' : 'var(--green)' }}>
            <i /><span><b>{it.title}</b><small>{it.status === 'returned' ? 'Returned to owner' : `Reported ${it.type}`} · {ago(it.at)}</small></span>
          </button>
        ))}
      </div>
    </section>
        <p className="src">Demo data: reports you add are saved in this browser until accounts and the backend are live. Map © OpenStreetMap contributors.</p>
      </div>

      {report && <ReportModal initialType={report} items={items} onClose={() => setReport(null)} onSubmit={submit} onOpen={it => setDetail(it.id)} />}
      {open && <ItemDetail item={open} onClose={() => setDetail(null)} onReturn={id => { lf.markReturned(id); say('Marked as returned.'); }}
        onDelete={id => { lf.remove(id); setDetail(null); say('Report deleted.'); }} onSent={() => say('Message sent.')} />}
      {toast && <div className="lf-toast" role="status">{toast}</div>}
    </PageShell>
  );
}