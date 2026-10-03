import { useEffect, useRef, useState } from 'react';
import { X, MapPin, Clock, CircleCheck, Send, ShieldCheck } from 'lucide-react';
import { catOf } from '../../data/marketData';
import { placeOf, ago, money, autoReply } from './utils';

export default function MarketDetail({ item, thread = [], onClose, onSold, onDelete, say }) {
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const box = useRef(null);
  const c = catOf(item.cat);
  const sold = item.status === 'sold', want = item.type === 'want', free = !want && item.price === 0;
  const talk = thread.length > 0 || typing;

  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    const o = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = o; };
  }, [onClose]);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' }); }, [thread.length, typing]);

  const send = t => {
    const m = t.trim(); if (!m || typing) return;
    say(item.id, true, m); setText(''); setTyping(true);
    setTimeout(() => { say(item.id, false, autoReply(m, item)); setTyping(false); }, 900);
  };
  const off = p => Math.round(item.price * p / 10) * 10;
  const chips = want ? ['I have this. Interested?', 'What condition do you need?']
    : ['Is it still available?', ...(item.negotiable && item.price > 0 ? [`Can you do ${money(off(0.9))}?`] : []), 'Where can we meet?'];

  return (
    <div className="mk-ov" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <article className="mk-dt" role="dialog" aria-modal="true" aria-label={item.title} style={{ '--c': `var(--${c.color})` }}>
        <button type="button" className="mk-x" onClick={onClose} aria-label="Close"><X size={18} /></button>

        <div className="mk-dt-img">
          {item.photo ? <img src={item.photo} alt={item.title} /> : <div className="mk-ph big"><c.Icon size={64} /></div>}
          <span className={`mk-kind ${sold ? 'sold' : want ? 'want' : free ? 'free' : ''}`}>{sold ? (want ? 'Fulfilled' : 'Sold') : want ? 'Wanted' : free ? 'Free' : 'For sale'}</span>
        </div>

        <div className="mk-dt-b">
          <div className="mk-dt-top">
            <h2>{item.title}</h2>
            <b>{want ? `Up to ${money(item.price)}` : money(item.price)}</b>
          </div>

          <div className="mk-dt-chips">
            <span className="t"><c.Icon size={13} />{c.label}</span>
            {item.cond && <span>{item.cond}</span>}
            {item.negotiable && item.price > 0 && <span>Negotiable</span>}
            <span><MapPin size={13} />{placeOf(item.place)?.name}</span>
            <span><Clock size={13} />{ago(item.at)}</span>
          </div>

          <p className="mk-desc">{item.desc}</p>

          <div className="mk-seller">
            <span className="avatar">{item.seller.name[0]}</span>
            <span><b>{item.seller.name}</b><small>{item.seller.course || 'GBU student'}</small></span>
            <em><ShieldCheck size={14} />Verified</em>
          </div>

          {sold ? (
            <div className="mk-ok"><CircleCheck size={18} />{want ? 'This request has been fulfilled.' : 'This item has been sold.'}</div>
          ) : item.mine ? (
            <div className="mk-own">
              <p>This is your listing. {item.contact && <>People can reach you at <b>{item.contact}</b>.</>}</p>
              <div className="mk-btns">
                <button type="button" className="btn btn-primary" onClick={() => onSold(item.id)}>{want ? 'Mark as bought' : 'Mark as sold'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => onDelete(item.id)}>Delete</button>
              </div>
            </div>
          ) : (
            <div className="mk-chat">
              {talk && (
                <div className="mk-th" ref={box} aria-live="polite">
                  {thread.map((m, i) => <p key={i} className={`mk-msg ${m.me ? 'me' : ''}`}>{m.t}</p>)}
                  {typing && <p className="mk-msg dots"><i /><i /><i /></p>}
                </div>
              )}
              <div className="mk-qk">{chips.map(q => <button type="button" key={q} onClick={() => send(q)}>{q}</button>)}</div>
              <form className="mk-cf" onSubmit={e => { e.preventDefault(); send(text); }}>
                <input value={text} onChange={e => setText(e.target.value)} placeholder={`Message ${item.seller.name.split(' ')[0]}…`} aria-label="Message" />
                <button type="submit" disabled={!text.trim() || typing} aria-label="Send"><Send size={15} /></button>
              </form>
              <small className="mk-hintx">Demo replies. Meet in a public campus spot and check the item before paying.</small>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}