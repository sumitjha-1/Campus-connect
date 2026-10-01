import { useEffect, useMemo, useState } from 'react';
import { X, MapPin, Clock, Gift, CircleCheck } from 'lucide-react';
import { catOf } from '../../data/lostFoundData';
import { placeOf, whenFull } from './utils';
import LiveMap from './LiveMap';

// Details for one report. Messages are demo-only until accounts and a backend exist.
export default function ItemDetail({ item, onClose, onReturn, onDelete, onSent }) {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const c = catOf(item.cat);
  const ret = item.status === 'returned';
  const pin = useMemo(() => [item], [item]);

  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    const o = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = o; };
  }, [onClose]);

  const send = e => { e.preventDefault(); if (!msg.trim()) return; setSent(true); onSent(); };

  return (
    <div className="lf-ov c" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <article className="lf-md" role="dialog" aria-modal="true" aria-label={item.title} style={{ '--c': `var(--${c.color})` }}>
        <div className="lf-img big">
          {item.photo ? <img src={item.photo} alt={item.title} /> : <c.Icon size={56} />}
          <span className={`lf-badge ${ret ? 'ret' : item.type}`}>{ret ? 'Returned' : item.type === 'lost' ? 'Lost' : 'Found'}</span>
          <button type="button" className="icon-btn lf-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="lf-mb">
          <h2>{item.title}</h2>
          <div className="lf-mrow">
            <span className="lf-m"><MapPin size={15} />{placeOf(item.place)?.name}</span>
            <span className="lf-m"><Clock size={15} />{whenFull(item.at)}</span>
            <span className="lf-m"><c.Icon size={15} />{c.label}</span>
          </div>
          {item.lat != null && <LiveMap items={pin} activeId={item.id} className="lf-mini" />}
          <p className="lf-full">{item.desc}</p>
          {item.tags.length > 0 && <div className="lf-tags">{item.tags.map(t => <span key={t}>{t}</span>)}</div>}
          {item.reward && !ret && <div className="lf-reward big"><Gift size={16} />Reward offered: {item.reward}</div>}

          {ret ? (
            <div className="lf-ok"><CircleCheck size={18} />This item has been returned to its owner.</div>
          ) : item.mine ? (
            <div className="lf-own">
              <p>This is your report. {item.contact && <>People can reach you at <b>{item.contact}</b>.</>}</p>
              <div className="lf-btns">
                <button type="button" className="btn btn-primary" onClick={() => onReturn(item.id)}>Mark as returned</button>
                <button type="button" className="btn btn-ghost" onClick={() => onDelete(item.id)}>Delete report</button>
              </div>
            </div>
          ) : sent ? (
            <div className="lf-ok"><CircleCheck size={18} />Message sent. The {item.type === 'lost' ? 'owner' : 'finder'} will see it.</div>
          ) : (
            <form className="lf-send" onSubmit={send}>
              <label className="lf-fl">{item.type === 'lost' ? 'Tell the owner where you found it' : 'Describe it so the finder can confirm it is yours'}
                <textarea className="lf-in" rows={3} value={msg} onChange={e => setMsg(e.target.value)} placeholder="Write your message…" />
              </label>
              <button type="submit" className="btn btn-primary" disabled={!msg.trim()}>{item.type === 'lost' ? 'Send to owner' : 'Send claim'}</button>
              <small className="lf-hint">Demo: messages start working once accounts are live.</small>
            </form>
          )}
        </div>
      </article>
    </div>
  );
}