import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, Gift, Flame, Bookmark, SearchX, X, Hand, Handshake, HandHelping, ShieldCheck, Sparkles } from 'lucide-react';
import PageShell from '../../components/PageShell/PageShell';
import useHelp from '../../hooks/useHelp';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import { campusImages } from '../../assets/images/campus';
import { KINDS, kindOf, isTrip } from '../../data/helpData';
import HelpAssistant from './HelpAssistant';
import HelpDetail from './HelpDetail';
import PostModal from './PostModal';
import { ago, placeOf, useCount, whenLabel, seatsLeft, actionLabel } from './utils';

// Both 3D scenes load only when this page opens, so Three.js stays out of the main bundle.
const HelpOrb = lazy(() => import('./HelpOrb'));
const RewardGift = lazy(() => import('./RewardGift'));

const TABS = [['all', 'All'], ['need', 'Requests'], ['offer', 'Offers'], ['travel', 'Travel'], ['notes', 'Notes'], ['mine', 'Mine'], ['saved', 'Saved']];
const STEPS = [
  [HandHelping, 'Ask', 'Post what you need, from a calculator to a cab partner.'],
  [Gift, 'Add a thank-you', 'Pick a small reward. Helpers see it before they reply.'],
  [Handshake, 'Meet and settle', 'Meet in a public spot, get the help, hand over the treat.'],
];

const Num = ({ n }) => <b>{useCount(n)}</b>;

// Two clearly different cards: a dashed "request" (something is missing) and a solid "offer" with a filled header (something is available).
function Card({ it, i, saved, joined, onSave, onOpen }) {
  const k = kindOf(it.kind), done = it.status === 'done', need = it.mode === 'need', trip = isTrip(it.kind);
  const urgent = it.urgent && !done;
  const Mode = need ? Hand : Handshake;
  return (
    <article className={`hp-card ${need ? 'need' : 'offer'} ${done ? 'done' : ''} ${urgent ? 'urgent' : ''}`} style={{ '--i': Math.min(i, 12), '--c': `var(--${k.color})` }}>
      <header className="hp-ch">
        <span className="hp-mode"><Mode size={13} />{done ? 'Done' : need ? 'Needs help' : 'Offering'}</span>
        <span className="hp-kind"><k.Icon size={14} />{k.short}</span>
        {urgent && <em className="hot"><Flame size={11} />Urgent</em>}
        <button type="button" className={`hp-save ${saved ? 'on' : ''}`} onClick={onSave} aria-pressed={saved} aria-label={saved ? 'Remove from saved' : 'Save'}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'} /></button>
      </header>
      <button type="button" className="hp-t" onClick={onOpen}>{it.title}</button>
      {trip ? (
        <div className="hp-trip sm">
          <div className="hp-route"><span>{placeOf(it.place)?.name}</span><i /><span>{it.dest}</span></div>
          <div className="hp-tfacts"><b>{whenLabel(it.go)}</b><span>{seatsLeft(it, joined) ? `${seatsLeft(it, joined)} seats left` : 'Full'}</span>{it.cost && <span>{it.cost}</span>}</div>
        </div>
      ) : <p className="hp-d">{it.desc}</p>}
      {it.reward && !done && <span className="hp-gem"><Gift size={13} />Reward: {it.reward}</span>}
      <div className="hp-foot">
        <span className="hp-by"><span className="avatar">{it.who.name[0]}</span><span><b>{it.who.name.split(' ')[0]}</b><small>{trip ? ago(it.at) : <>{placeOf(it.place)?.name} · {ago(it.at)}</>}</small></span></span>
        <span className="hp-go">{actionLabel(it, joined)}</span>
      </div>
    </article>
  );
}

export default function Help() {
  const { theme } = useTheme();
  const hp = useHelp();
  const tt = useRef(0);
  const [tab, setTab] = useState('all');
  const [kind, setKind] = useState('All');
  const [sort, setSort] = useState('new');
  const [q, setQ] = useState('');
  const [post, setPost] = useState(null);     // { kind, mode } | null
  const [detail, setDetail] = useState(null); // item id
  const [ai, setAi] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { const k = e => e.key === 'Escape' && setAi(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);

  const { items, saved, joined } = hp;
  const open = detail ? items.find(x => x.id === detail) : null;
  const say = m => { setToast(m); clearTimeout(tt.current); tt.current = setTimeout(() => setToast(''), 3500); };

  const lists = useMemo(() => ({
    all: items, need: items.filter(x => x.mode === 'need'), offer: items.filter(x => x.mode === 'offer'),
    travel: items.filter(x => isTrip(x.kind)), notes: items.filter(x => x.kind === 'notes'),
    mine: items.filter(x => x.mine), saved: items.filter(x => saved.has(x.id)),
  }), [items, saved.ids]);

  const needle = q.trim().toLowerCase();
  const base = lists[tab];
  const counts = useMemo(() => { const m = {}; base.forEach(x => { m[x.kind] = (m[x.kind] || 0) + 1; }); return m; }, [base]);
  const shown = useMemo(() => base
    .filter(x => (kind === 'All' || x.kind === kind)
      && (!needle || `${x.title} ${x.desc} ${x.dest} ${x.tags.join(' ')} ${kindOf(x.kind).label} ${placeOf(x.place)?.name}`.toLowerCase().includes(needle)))
    .sort((a, b) => ((a.status === 'done') - (b.status === 'done'))
      || (sort === 'urgent' ? Number(!!b.urgent) - Number(!!a.urgent) : sort === 'reward' ? Number(!!b.reward) - Number(!!a.reward) : 0)
      || new Date(b.at) - new Date(a.at)), [base, kind, needle, sort]);

  const live = items.filter(x => x.status === 'open');
  const stats = {
    open: live.filter(x => x.mode === 'need').length, rewards: live.filter(x => x.reward).length,
    trips: live.filter(x => isTrip(x.kind)).length, helped: items.filter(x => x.status === 'done').length + 38,
  };
  const filtered = !!needle || kind !== 'All';
  const pick = t => { setTab(t); setKind('All'); };
  const clear = () => { setQ(''); setKind('All'); };
  const toBoard = () => document.getElementById('hp-board')?.scrollIntoView({ behavior: 'smooth' });
  const start = (k, mode = 'need') => { setAi(false); setPost({ kind: k, mode }); };
  const submit = data => {
    const it = hp.add(data); setPost(null); setTab('all'); clear(); setTimeout(toBoard, 80);
    say(it.mode === 'need' ? 'Request posted. Students nearby can see it now.' : 'Offer posted. Thank you for helping out.');
  };

  return (
    <PageShell hero>
      <section className="hp-hero">
        <img key={theme} className="hp-bg" src={campusImages.help[theme]} alt="" />
        <div className="wrap hp-hin">
          <div className="hp-copy">
            <h1>Stuck on something? <span>Another student can help.</span></h1>
            <p className="hp-lead">Borrow a calculator, split a taxi, get a lift to Knowledge Park or pick up notes. Say a small thank-you with a reward.</p>
            <div className="hero-cta">
              <button type="button" className="btn hp-btn-need" onClick={() => start('borrow')}><Hand size={16} />I need help</button>
              <button type="button" className="btn hp-btn-offer" onClick={() => start('travel', 'offer')}><Handshake size={16} />I can help</button>
            </div>
            <div className="hp-quick" role="group" aria-label="Quick request">
              <span>Need something fast?</span>
              {KINDS.map(k => <button type="button" key={k.k} onClick={() => start(k.k)}><k.Icon size={14} />{k.short}</button>)}
            </div>
          </div>
          <Suspense fallback={<div className="hp-orbwrap" />}>
            <HelpOrb
              items={items}
              kind={kind === 'All' ? null : kind}
              onKind={k => { setTab('all'); setKind(v => (v === k ? 'All' : k)); toBoard(); }}
              onPick={it => setDetail(it.id)}
            />
          </Suspense>
        </div>
      </section>

      <div className="wrap hp-page">
        <p className="hp-say" aria-label="Summary"><i />Right now on campus: <span><Num n={stats.open} /> asking for help</span><span><Num n={stats.rewards} /> with a reward</span><span><Num n={stats.trips} /> trips to share</span><span><Num n={stats.helped} /> helped this term</span></p>

        <div className="hp-bar" id="hp-board">
          <div className="hp-tabs" role="tablist">
            {TABS.map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => pick(k)}>{l}<span>{lists[k].length}</span></button>
            ))}
          </div>
          <label className="hp-search"><Search size={15} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search calculator, taxi, notes…" aria-label="Search the help board" />{q && <button type="button" onClick={() => setQ('')} aria-label="Clear search"><X size={14} /></button>}</label>
          <select className="hp-sel" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort">
            <option value="new">Latest first</option><option value="urgent">Urgent first</option><option value="reward">Rewards first</option>
          </select>
        </div>

        <div className="hp-cats">
          <button type="button" className={kind === 'All' ? 'on' : ''} onClick={() => setKind('All')}>All <span>{base.length}</span></button>
          {KINDS.filter(k => counts[k.k]).map(k => (
            <button type="button" key={k.k} className={kind === k.k ? 'on' : ''} onClick={() => setKind(k.k)}>{k.short} <span>{counts[k.k]}</span></button>
          ))}
        </div>

        <p className="hp-legend" aria-label="How to read the cards">
          <span className="need"><Hand size={13} />Needs help: someone is asking</span>
          <span className="offer"><Handshake size={13} />Offering: someone is sharing</span>
        </p>

        <div className="hp-grid" key={tab + kind + sort}>
          {shown.length ? shown.map((it, i) => <Card key={it.id} it={it} i={i} saved={saved.has(it.id)} joined={joined} onSave={() => saved.toggle(it.id)} onOpen={() => setDetail(it.id)} />) : (
            <div className="hp-empty"><SearchX size={34} />
              <b>{filtered ? 'Nothing matches that' : tab === 'mine' ? 'You have not posted yet' : tab === 'saved' ? 'Nothing saved yet' : 'Nothing here yet'}</b>
              <span>{filtered ? 'Try another word, or post a request and let helpers come to you.' : tab === 'mine' ? 'Ask for help or offer yours and it will show up here.' : tab === 'saved' ? 'Tap the bookmark on any post to keep it here.' : 'Be the first to post.'}</span>
              <div>{filtered && <button type="button" className="btn btn-ghost" onClick={clear}>Clear filters</button>}<button type="button" className="btn hp-btn-need" onClick={() => start('borrow')}>I need help</button></div>
            </div>
          )}
        </div>

        <section className="hp-how" aria-label="How rewards work">
          <Suspense fallback={<div className="hp-gift" />}><RewardGift /></Suspense>
          <div className="hp-how-b">
            <div className="hp-hh"><h2>Small favours, properly thanked</h2><p>Rewards are optional and always agreed in the chat before anyone moves.</p></div>
            <ol>{STEPS.map(([I, t, d]) => <li key={t}><i><I size={20} /></i><span><b>{t}</b><small>{d}</small></span></li>)}</ol>
            <p className="hp-safe"><ShieldCheck size={16} />Every account is ID checked. Meet in public campus spots and share taxi details with a friend.</p>
          </div>
        </section>
        <p className="src">Demo data: posts you add are saved in this browser until accounts and the backend are live.</p>
      </div>

      {/* One dock for everything. The old separate "Ask AI" button is hidden by help.css. */}
      <nav className="hp-dock" aria-label="Help actions">
        <button type="button" className="need" onClick={() => start('borrow')}><Hand size={16} />I need help</button>
        <button type="button" className="offer" onClick={() => start('travel', 'offer')}><Handshake size={16} />I can help</button>
        <i className="sep" aria-hidden="true" />
        <button type="button" className={`ai ${ai ? 'on' : ''}`} onClick={() => setAi(o => !o)} aria-expanded={ai}><Sparkles size={16} />Find with AI</button>
      </nav>
      <HelpAssistant items={items} open={ai} onToggle={() => setAi(o => !o)} onOpen={it => { setDetail(it.id); setAi(false); }} onPost={k => start(k)} />

      {post && <PostModal initialKind={post.kind} initialMode={post.mode} items={items} onClose={() => setPost(null)} onSubmit={submit} onOpen={it => setDetail(it.id)} />}
      {open && <HelpDetail item={open} thread={hp.chats[open.id]} joined={joined} say={hp.say} toast={say} onClose={() => setDetail(null)} onJoin={hp.join}
        onDone={id => { hp.markDone(id); say('Marked as done.'); }} onDelete={id => { hp.remove(id); setDetail(null); say('Post deleted.'); }} />}
      {toast && <div className="hp-toast" role="status">{toast}</div>}
    </PageShell>
  );
}