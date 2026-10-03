import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, Megaphone, Sparkles, LayoutGrid, SearchX, Package, Handshake, BadgeCheck, Gift, ShieldCheck, Users, Eye, Wallet, X } from 'lucide-react';
import PageShell from '../../components/PageShell/PageShell';
import useMarket from '../../hooks/useMarket';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import { campusImages } from '../../assets/images/campus';
import { CATEGORIES, catOf } from '../../data/marketData';
import { marketHero } from '../../data/marketImages';
import MarketAssistant from './MarketAssistant';
import MarketCard from './MarketCard';
import MarketDetail from './MarketDetail';
import SellModal from './SellModal';
import { placeOf, useCount, ago } from './utils';

const TABS = [['all', 'All'], ['sell', 'For sale'], ['want', 'Wanted'], ['mine', 'Mine'], ['saved', 'Saved']];
const PRICES = [['', 'Any price'], ['0', 'Free'], ['500', 'Under ₹500'], ['2000', 'Under ₹2,000'], ['5000', 'Under ₹5,000']];
const QUICK = [['Books', 'books'], ['Cycles', 'cycles'], ['Electronics', 'electronics'], ['Lab gear', 'lab'], ['Free', '__free']];
const SAFE = [[Eye, 'Check before you pay', 'Look the item over in person.'], [Users, 'Meet in public', 'Library, cafeteria or main gate.'], [Wallet, 'Pay on the spot', 'Cash or UPI, only after you check.'], [ShieldCheck, 'Verified students', 'Every account is ID checked.']];

function Num({ n }) { return <>{useCount(n)}</>; }

// One friendly sentence instead of stat cards. Each highlighted part is a filter.
const SAY = { sell: 'items for sale', free: 'free', want: 'requests', sold: 'sold' };

function Pulse({ parts }) {
  return (
    <p className="mk-say" aria-label="Market summary">
      <i className="mk-live" />
      <span>Right now on campus:</span>
      {parts.map((p, k) => {
        const Tag = p.pick ? 'button' : 'span';
        return (
          <span key={p.k} className="mk-sp">
            <Tag type={p.pick ? 'button' : undefined} className={`mk-w ${p.on ? 'on' : ''}`} style={{ '--c': `var(--${p.color})` }} onClick={p.pick}>
              <b><Num n={p.n} /></b> {SAY[p.k]}
            </Tag>
            {k < parts.length - 1 && <em>·</em>}
          </span>
        );
      })}
    </p>
  );
}

export default function Market() {
  const { theme } = useTheme();
  const mk = useMarket();
  const tt = useRef(0);
  const [ratio, setRatio] = useState(0); // the hero takes the photo's own shape, so the whole picture shows
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('all');
  const [cat, setCat] = useState('All');
  const [priceMax, setPriceMax] = useState('');
  const [sort, setSort] = useState('new');
  const [q, setQ] = useState('');
  const [post, setPost] = useState(null);     // 'sell' | 'want' | null
  const [detail, setDetail] = useState(null); // listing id
  const [ai, setAi] = useState(false);
  const [toast, setToast] = useState('');
  const heroSrc = marketHero[theme] || campusImages.market[theme];

  useEffect(() => { const t = setTimeout(() => setReady(true), 550); return () => clearTimeout(t); }, []);
  useEffect(() => { const k = e => e.key === 'Escape' && setAi(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);

  const { items, saved } = mk;
  const open = detail ? items.find(x => x.id === detail) : null;
  const say = m => { setToast(m); clearTimeout(tt.current); tt.current = setTimeout(() => setToast(''), 3500); };

  const lists = useMemo(() => ({
    all: items, sell: items.filter(x => x.type === 'sell'), want: items.filter(x => x.type === 'want'),
    mine: items.filter(x => x.mine), saved: items.filter(x => saved.has(x.id)),
  }), [items, saved.ids]);

  const needle = q.trim().toLowerCase();
  const base = lists[tab];
  const counts = useMemo(() => { const m = {}; base.forEach(x => { m[x.cat] = (m[x.cat] || 0) + 1; }); return m; }, [base]);
  const shown = useMemo(() => base
    .filter(x => (cat === 'All' || x.cat === cat) && (priceMax === '' || x.price <= +priceMax)
      && (!needle || `${x.title} ${x.desc} ${x.tags.join(' ')} ${catOf(x.cat).label} ${placeOf(x.place)?.name}`.toLowerCase().includes(needle)))
    .sort((a, b) => ((a.status === 'sold') - (b.status === 'sold'))
      || (sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : new Date(b.at) - new Date(a.at))),
  [base, cat, priceMax, needle, sort]);

  const live = items.filter(x => x.status === 'open');
  const stats = {
    listed: live.filter(x => x.type === 'sell').length, wanted: live.filter(x => x.type === 'want').length,
    sold: items.filter(x => x.status === 'sold').length, free: live.filter(x => x.type === 'sell' && x.price === 0).length,
  };
  // "Good price": at least 20% under the middle price of its category
  const median = useMemo(() => {
    const g = {}; items.filter(x => x.type === 'sell' && x.price > 0).forEach(x => { (g[x.cat] ||= []).push(x.price); });
    const m = {}; Object.entries(g).forEach(([k, v]) => { if (v.length >= 3) m[k] = v.sort((a, b) => a - b)[Math.floor(v.length / 2)]; });
    return m;
  }, [items]);
  const isDeal = x => x.type === 'sell' && x.status === 'open' && x.price > 0 && median[x.cat] && x.price <= median[x.cat] * 0.8;
  const isNew = x => x.status === 'open' && Date.now() - new Date(x.at) < 864e5;

  const filtered = !!needle || cat !== 'All' || priceMax !== '';
  const requests = live.filter(x => x.type === 'want').slice(0, 6);
  const showWall = tab === 'all' && !filtered && requests.length > 0;
  const grid = showWall ? shown.filter(x => x.type !== 'want') : shown;
  const rail = [['All', base.length], ...CATEGORIES.filter(c => counts[c.k]).map(c => [c.k, counts[c.k]])];

  const toResults = () => document.getElementById('mk-results')?.scrollIntoView({ behavior: 'smooth' });
  const go = fn => () => { fn(); setTimeout(toResults, 60); };
  const quick = k => { if (k === '__free') { setTab('all'); setCat('All'); setPriceMax('0'); } else { setTab('all'); setCat(k); setPriceMax(''); } setTimeout(toResults, 60); };
  const clear = () => { setQ(''); setCat('All'); setPriceMax(''); };
  const submit = data => {
    const it = mk.add(data); setPost(null); setTab('all'); clear();
    say(it.type === 'sell' ? 'Listing posted. Students can see it now.' : 'Request posted. Sellers can see it now.');
  };
  const card = (it, i) => <MarketCard key={it.id} it={it} i={i} saved={saved.has(it.id)} isNew={isNew(it)} deal={isDeal(it)}
    onSave={() => saved.toggle(it.id)} onOpen={() => setDetail(it.id)} />;

  return (
    <PageShell hero>
      <section className="mk-hero" style={{ '--r': ratio || 1.7 }}>
        <img key={heroSrc} className="mk-photo" src={heroSrc} alt="" onLoad={e => setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)} />
        <div className="wrap">
          <div className="mk-hin">
            <p className="mk-pill"><i />{stats.listed} items for sale on campus today</p>
            <h1>Everything you need, <em>from someone on campus.</em></h1>
            <p className="mk-lead">Books, cycles, lab gear and more, bought and sold between GBU students. Post in a minute and chat right away.</p>
            <form className="mk-find" onSubmit={e => { e.preventDefault(); setTab('all'); toResults(); }} role="search">
              <Search size={18} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search books, cycle, calculator…" aria-label="Search the marketplace" />
              <button type="submit">Search</button>
            </form>
            <div className="mk-qc">{QUICK.map(([l, k]) => <button type="button" key={k} onClick={() => quick(k)}>{l}</button>)}</div>
          </div>
        </div>
      </section>

      <div className="wrap mk-page">
        <Pulse
          newest={live.find(x => x.type === 'sell')}
          parts={[
            { k: 'sell', label: 'for sale', n: stats.listed, w: Math.max(stats.listed - stats.free, 0), color: 'primary', on: tab === 'sell',
              pick: go(() => { setTab('sell'); setCat('All'); setPriceMax(''); }) },
            { k: 'free', label: 'free', n: stats.free, w: stats.free, color: 'rose', on: priceMax === '0',
              pick: go(() => { setTab('all'); setCat('All'); setPriceMax('0'); }) },
            { k: 'want', label: 'wanted', n: stats.wanted, w: stats.wanted, color: 'amber', on: tab === 'want',
              pick: go(() => { setTab('want'); setCat('All'); setPriceMax(''); }) },
            { k: 'sold', label: 'sold', n: stats.sold, w: stats.sold, color: 'green' },
          ]}
        />

        <div className="mk-bar" id="mk-results">
          <div className="mk-seg" role="tablist" style={{ '--i': TABS.findIndex(t => t[0] === tab) }}>
            <span className="mk-thumb" />
            {TABS.map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); setCat('All'); }}>
                {l}<span>{lists[k].length}</span>
              </button>
            ))}
          </div>
          <label className="mk-bs"><Search size={15} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search listings" aria-label="Search listings" />{q && <button type="button" onClick={() => setQ('')} aria-label="Clear search"><X size={14} /></button>}</label>
          <select className={`mk-sel ${cat !== 'All' ? 'act' : ''}`} value={cat} onChange={e => setCat(e.target.value)} aria-label="Category">
            {rail.map(([k, n]) => <option key={k} value={k}>{k === 'All' ? 'All categories' : catOf(k).label} ({n})</option>)}
          </select>
          <select className="mk-sel" value={priceMax} onChange={e => setPriceMax(e.target.value)} aria-label="Price">{PRICES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          <select className="mk-sel" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort">
            <option value="new">Latest first</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
          </select>
        </div>

        {showWall && (
          <section className="mk-wall">
            <div className="mk-sh"><h3>Wanted wall</h3><span>Students looking for something. Have it? Say so.</span></div>
            <div className="mk-notes">{requests.map((it, i) => card(it, i))}</div>
          </section>
        )}

        <div className="mk-sh">
          <h3>{tab === 'want' ? 'Requests' : tab === 'mine' ? 'Your listings' : tab === 'saved' ? 'Saved' : showWall ? 'Fresh on the shelves' : 'Listings'}</h3>
          <span>{grid.length} {grid.length === 1 ? 'item' : 'items'}</span>
          {filtered && <button type="button" onClick={clear}>Clear filters</button>}
        </div>

        <div className="mk-grid" key={tab + cat + priceMax + sort}>
          {!ready ? Array.from({ length: 8 }, (_, i) => <div className="mk-sk" key={i} />)
            : grid.length ? grid.map((it, i) => card(it, i))
            : (
              <div className="mk-empty-s"><SearchX size={34} />
                <b>{filtered ? 'Nothing matches that' : tab === 'mine' ? 'No listings yet' : tab === 'saved' ? 'Nothing saved yet' : 'No listings here yet'}</b>
                <span>{filtered ? 'Try a different word, or post a request and let sellers find you.' : tab === 'mine' ? 'Tap Sell to post your first item.' : tab === 'saved' ? 'Tap the heart on any listing to keep it here.' : 'Check back soon.'}</span>
                <div>{filtered && <button type="button" className="btn btn-ghost" onClick={clear}>Clear filters</button>}<button type="button" className="btn btn-primary" onClick={() => setPost(filtered ? 'want' : 'sell')}>{filtered ? 'Post a request' : 'Sell an item'}</button></div>
              </div>
            )}
        </div>

        <section className="mk-safe" aria-label="Trade safely">
          {SAFE.map(([I, t, d]) => <div key={t}><i><I size={18} /></i><span><b>{t}</b><small>{d}</small></span></div>)}
        </section>
        <p className="src">Demo data: listings you add are saved in this browser until accounts and the backend are live.</p>
      </div>

      <nav className="mk-dock" aria-label="Marketplace actions">
        <button type="button" className="main" onClick={() => setPost('sell')}><Plus size={17} />Sell</button>
        <button type="button" onClick={() => setPost('want')}><Megaphone size={16} />Request</button>
        <button type="button" onClick={() => setAi(o => !o)} aria-expanded={ai}><Sparkles size={16} />Ask AI</button>
      </nav>
      <MarketAssistant items={items} open={ai} onClose={() => setAi(false)} onOpen={it => { setDetail(it.id); setAi(false); }} />

      {post && <SellModal initialType={post} items={items} onClose={() => setPost(null)} onSubmit={submit} onOpen={it => setDetail(it.id)} />}
      {open && <MarketDetail item={open} thread={mk.chats[open.id]} say={mk.say} onClose={() => setDetail(null)}
        onSold={id => { mk.markSold(id); say(open.type === 'want' ? 'Marked as bought.' : 'Marked as sold.'); }}
        onDelete={id => { mk.remove(id); setDetail(null); say('Listing deleted.'); }} />}
      {toast && <div className="mk-toast" role="status">{toast}</div>}
    </PageShell>
  );
}