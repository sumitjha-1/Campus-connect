import { Heart, MapPin, ArrowUpRight, Handshake } from 'lucide-react';
import { catOf } from '../../data/marketData';
import { ago, money, placeOf } from './utils';

const PIPS = { New: 5, 'Like new': 4, Good: 3, Fair: 2 };

// For-sale items are tagged photo cards with a ticket-stub footer. Wanted requests are sticky notes.
export default function MarketCard({ it, i, saved, isNew, deal, onSave, onOpen }) {
  const c = catOf(it.cat);
  const sold = it.status === 'sold', want = it.type === 'want', free = !want && it.price === 0;
  const style = { '--c': `var(--${c.color})`, '--i': Math.min(i, 12), '--t': `${((i % 3) - 1) * 1.4}deg` };
  const heart = (
    <button type="button" className={`mk-save ${saved ? 'on' : ''}`} onClick={onSave} aria-pressed={saved} aria-label={saved ? 'Remove from saved' : 'Save'}>
      <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );

  if (want) return (
    <article className={`mk-note ${sold ? 'sold' : ''}`} style={style}>
      {heart}
      <span className="mk-nk">{sold ? 'Fulfilled' : 'Wanted'} · {c.label}</span>
      <button type="button" className="mk-t note" onClick={onOpen}>{it.title}</button>
      <p className="mk-nd">{it.desc}</p>
      <span className="mk-budget">Budget {money(it.price)}</span>
      <div className="mk-nf">
        <span className="mk-who"><span className="avatar">{it.seller.name[0]}</span>{it.seller.name.split(' ')[0]}</span>
        <span className="mk-m"><MapPin size={12} />{placeOf(it.place)?.name}</span>
      </div>
      {!sold && !it.mine && <span className="mk-nbtn"><Handshake size={14} />I have this</span>}
    </article>
  );

  const pips = PIPS[it.cond] || 0;
  return (
    <article className={`mk-card ${sold ? 'sold' : ''}`} style={style}>
      <div className="mk-media">
        {it.photo ? <img src={it.photo} alt="" loading="lazy" /> : <div className="mk-ph"><c.Icon size={46} /></div>}
        <div className="mk-flags">
          {sold && <em className="sold">Sold</em>}
          {!sold && isNew && <em className="new"><i />New</em>}
          {!sold && deal && <em className="deal">Good price</em>}
        </div>
        {heart}
        <span className={`mk-tag ${free ? 'free' : ''}`}>{money(it.price)}</span>
      </div>
      <div className="mk-info">
        <span className="mk-cat"><c.Icon size={12} />{c.label}</span>
        <button type="button" className="mk-t" onClick={onOpen}>{it.title}</button>
        <span className="mk-m"><MapPin size={12} />{placeOf(it.place)?.name}<i>·</i>{ago(it.at)}</span>
        <div className="mk-meta">
          {it.cond && (
            <span className="mk-cond">
              <span className="mk-pips">{Array.from({ length: 5 }, (_, k) => <i key={k} className={k < pips ? 'on' : ''} />)}</span>
              {it.cond}
            </span>
          )}
          {it.negotiable && it.price > 0 && <em className="neg">Negotiable</em>}
        </div>
        <div className="mk-stub">
          <span className="mk-who"><span className="avatar">{it.seller.name[0]}</span>{it.seller.name.split(' ')[0]}</span>
          {!sold && <span className="mk-go">{it.mine ? 'Manage' : 'Chat'} <ArrowUpRight size={14} /></span>}
        </div>
      </div>
    </article>
  );
}