import { useEffect, useRef, useState } from 'react';
import { X, MapPin, Clock, Gift, CircleCheck, Send, ShieldCheck, Flame, ArrowRight, FileText } from 'lucide-react';
import { kindOf, isTrip } from '../../data/helpData';
import { placeOf, ago, whenLabel, seatsLeft, autoReply } from './utils';

export default function HelpDetail({ item, thread = [], joined, onClose, onDone, onDelete, onJoin, say, toast }) {
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const box = useRef(null);
  const k = kindOf(item.kind), done = item.status === 'done', need = item.mode === 'need', trip = isTrip(item.kind);
  const left = seatsLeft(item, joined), isIn = joined.includes(item.id);

  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    const o = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = o; };
  }, [onClose]);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' }); }, [thread.length, typing]);

  const send = t => {
    const m = t.trim(); if (!m || typing) return;
    say(item.id, true, m); setText(''); setTyping(true);
    setTimeout(() => { say(item.id, false, autoReply(m, item)); setTyping(false); }, 900);
  };
  const chips = trip ? ['Is there still a seat?', 'Where do we meet?', 'How much is my share?']
    : item.kind === 'notes' && !need ? ['Can you send a scan?', 'Is it complete?']
    : need ? ['I can help. Where should we meet?', 'I have it. Is this still needed?']
    : ['Is it still available?', 'Where can I collect it?'];

  return (
    <div className="hp-ov" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <article className="hp-dt" role="dialog" aria-modal="true" aria-label={item.title} style={{ '--c': `var(--${k.color})` }}>
        <button type="button" className="hp-x" onClick={onClose} aria-label="Close"><X size={18} /></button>

        <div className="hp-dh">
          <span className="hp-dic"><k.Icon size={28} /></span>
          <div>
            <div className="hp-tags"><em>{k.label}</em><em className={need ? 'need' : 'offer'}>{done ? 'Done' : need ? 'Needs help' : 'Offering'}</em>{item.urgent && !done && <em className="hot"><Flame size={11} />Urgent</em>}</div>
            <h2>{item.title}</h2>
          </div>
        </div>

        <div className="hp-db">
          <div className="hp-chips">
            <span><MapPin size={13} />{trip ? 'From ' : ''}{placeOf(item.place)?.name}</span>
            <span><Clock size={13} />{ago(item.at)}</span>
            {item.file && <span><FileText size={13} />{item.file}</span>}
          </div>

          {trip && (
            <div className="hp-trip">
              <div className="hp-route big"><span>{placeOf(item.place)?.name}</span><i /><span>{item.dest}</span></div>
              <div className="hp-tfacts"><b>{whenLabel(item.go)}</b><span>{left ? `${left} ${left === 1 ? 'seat' : 'seats'} left` : 'Trip is full'}</span>{item.cost && <span>{item.cost}</span>}</div>
            </div>
          )}

          <p className="hp-desc">{item.desc}</p>
          {item.reward && !done && <div className="hp-gem big"><Gift size={16} /><span>Reward for helping: <b>{item.reward}</b></span></div>}

          <div className="hp-who">
            <span className="avatar">{item.who.name[0]}</span>
            <span><b>{item.who.name}</b><small>{item.who.course || 'GBU student'}</small></span>
            <em><ShieldCheck size={14} />Verified</em>
          </div>

          {done ? (
            <div className="hp-ok"><CircleCheck size={18} />This one is sorted. Thanks to everyone who helped.</div>
          ) : item.mine ? (
            <div className="hp-own">
              <p>This is your post. {item.contact && <>People can reach you at <b>{item.contact}</b>.</>}</p>
              <div className="hp-btns">
                <button type="button" className="btn btn-primary" onClick={() => onDone(item.id)}>Mark as done</button>
                <button type="button" className="btn btn-ghost" onClick={() => onDelete(item.id)}>Delete</button>
              </div>
            </div>
          ) : (
            <div className="hp-chat">
              {trip && (isIn ? <div className="hp-ok"><CircleCheck size={18} />You joined this trip. Message {item.who.name.split(' ')[0]} to confirm the meeting point.</div>
                : <button type="button" className="btn btn-primary hp-join" disabled={!left} onClick={() => { onJoin(item.id); toast('You joined the trip.'); }}>{left ? 'Join this trip' : 'Trip is full'}<ArrowRight size={15} /></button>)}
              {item.kind === 'notes' && !need && <button type="button" className="btn btn-primary hp-join" onClick={() => toast('Demo: the file arrives once accounts are live.')}>Get these notes<ArrowRight size={15} /></button>}
              {(thread.length > 0 || typing) && (
                <div className="hp-th" ref={box} aria-live="polite">
                  {thread.map((m, i) => <p key={i} className={`hp-msg ${m.me ? 'me' : ''}`}>{m.t}</p>)}
                  {typing && <p className="hp-msg dots"><i /><i /><i /></p>}
                </div>
              )}
              <div className="hp-qk">{chips.map(q => <button type="button" key={q} onClick={() => send(q)}>{q}</button>)}</div>
              <form className="hp-cf" onSubmit={e => { e.preventDefault(); send(text); }}>
                <input value={text} onChange={e => setText(e.target.value)} placeholder={`Message ${item.who.name.split(' ')[0]}…`} aria-label="Message" />
                <button type="submit" disabled={!text.trim() || typing} aria-label="Send"><Send size={15} /></button>
              </form>
              <small className="hp-hint">Demo replies. Meet in a public campus spot, and share trip details with a friend.</small>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
