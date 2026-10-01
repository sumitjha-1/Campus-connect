import { Bookmark, Clock, Gift, MapPin, Crosshair } from 'lucide-react';
import { catOf } from '../../data/lostFoundData';
import { ago, placeOf } from './utils';

export default function ItemCard({ it, i, saved, active, onSave, onOpen, onLocate }) {
  const c = catOf(it.cat);
  const ret = it.status === 'returned';
  return (
    <article className={`lf-card ${ret ? 'done' : ''} ${active ? 'act' : ''}`} style={{ '--c': `var(--${c.color})`, '--i': Math.min(i, 10) }}>
      <div className="lf-img">
        {it.photo ? <img src={it.photo} alt="" loading="lazy" /> : <c.Icon size={30} />}
        <span className={`lf-badge ${ret ? 'ret' : it.type}`}>{ret ? 'Returned' : it.type === 'lost' ? 'Lost' : 'Found'}</span>
        <button type="button" className={`lf-save ${saved ? 'on' : ''}`} onClick={onSave} aria-pressed={saved} aria-label={saved ? 'Remove from saved' : 'Save'}>
          <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="lf-body">
        <button type="button" className="lf-open" onClick={onOpen}>{it.title}</button>
        <span className="lf-m"><MapPin size={12} />{placeOf(it.place)?.name}<i>·</i><Clock size={12} />{ago(it.at)}</span>
        <p className="lf-desc">{it.desc}</p>
        {it.reward && !ret && <span className="lf-reward"><Gift size={12} />Reward: {it.reward}</span>}
      </div>
      <div className="lf-foot">
        <button type="button" className="lf-contact" onClick={onOpen}>
          {it.mine ? 'View report' : it.type === 'lost' ? 'Contact owner' : 'Contact finder'}
        </button>
        {!ret && <button type="button" className="lf-loc" onClick={onLocate} aria-label={`Show ${it.title} on the map`} title="Show on map"><Crosshair size={15} /></button>}
      </div>
    </article>
  );
}