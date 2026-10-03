import { useEffect, useMemo, useState } from 'react';
import { X, Gift, Sparkles, FileUp } from 'lucide-react';
import { PLACES } from '../../data/lostFoundData';
import { KINDS, DESTS, TREATS, isTrip } from '../../data/helpData';
import { localInput, placeOf, similar, ago } from './utils';

const blank = (kind, mode) => ({ mode, kind, title: '', desc: '', place: '', dest: DESTS[0], go: localInput(new Date(Date.now() + 36e5 * 2)), seats: 2, cost: '', reward: '', urgent: false, contact: '', file: '' });

export default function PostModal({ initialKind = 'borrow', initialMode = 'need', items, onClose, onSubmit, onOpen }) {
  const [f, setF] = useState(() => blank(initialKind, initialMode));
  const [err, setErr] = useState({});
  const set = (k, v) => { setF(s => ({ ...s, [k]: v })); setErr(e => ({ ...e, [k]: '' })); };
  const need = f.mode === 'need', trip = isTrip(f.kind), notes = f.kind === 'notes';

  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    const o = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = o; };
  }, [onClose]);

  const matches = useMemo(() => (f.title.trim().length > 2 ? similar(f, items) : []), [f.title, f.kind, f.mode, items]);

  const submit = e => {
    e.preventDefault();
    const er = {};
    if (!f.title.trim()) er.title = 'Say what this is about.';
    if (!f.place) er.place = trip ? 'Choose where you leave from.' : 'Choose a meeting spot.';
    if (trip && new Date(f.go) < new Date()) er.go = 'Pick a time in the future.';
    if (!f.contact.trim()) er.contact = 'Add a way to reach you.';
    setErr(er);
    if (Object.keys(er).length) return;
    onSubmit({
      mode: f.mode, kind: f.kind, title: f.title.trim(), desc: f.desc.trim() || 'No details added.', place: f.place, at: new Date().toISOString(),
      dest: trip ? f.dest : '', go: trip ? new Date(f.go).toISOString() : '', seats: trip ? Math.max(1, Number(f.seats) || 1) : 0, cost: trip ? f.cost.trim() : '',
      reward: need ? f.reward.trim() : '', urgent: need && f.urgent, contact: f.contact.trim(), file: notes ? f.file : '', tags: [],
      who: { name: 'You', course: 'GBU student' },
    });
  };

  return (
    <div className="hp-ov" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form className="hp-form" onSubmit={submit} noValidate role="dialog" aria-modal="true" aria-label="Post to the help board">
        <header>
          <div><h2>{need ? 'Ask for help' : 'Offer your help'}</h2><p>{need ? 'Students nearby see it right away.' : 'Share a trip, notes or something to lend.'}</p></div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>

        <div className="hp-fb">
          <div className="hp-seg" role="group" aria-label="Type of post">
            <button type="button" className={f.mode === 'need' ? 'on' : ''} onClick={() => set('mode', 'need')}>I need help</button>
            <button type="button" className={f.mode === 'offer' ? 'on' : ''} onClick={() => set('mode', 'offer')}>I can offer</button>
          </div>

          <div className="hp-f">
            <span>What kind of help?</span>
            <div className="hp-kinds">
              {KINDS.map(k => (
                <button type="button" key={k.k} className={f.kind === k.k ? 'on' : ''} style={{ '--c': `var(--${k.color})` }} onClick={() => set('kind', k.k)}><k.Icon size={15} />{k.short}</button>
              ))}
            </div>
          </div>

          <label className="hp-f">{need ? 'What do you need?' : 'What are you offering?'}
            <input className="hp-in" autoFocus value={f.title} maxLength={60} onChange={e => set('title', e.target.value)}
              placeholder={trip ? 'e.g. Taxi to the airport on Sunday' : notes ? 'e.g. Data Structures notes' : 'e.g. Scientific calculator'} />
            {err.title && <span className="hp-err">{err.title}</span>}
          </label>

          {trip && (<>
            <div className="hp-two">
              <label className="hp-f">Going to
                <select className="hp-in" value={f.dest} onChange={e => set('dest', e.target.value)}>{DESTS.map(d => <option key={d}>{d}</option>)}</select>
              </label>
              <label className="hp-f">Leaving at
                <input className="hp-in" type="datetime-local" value={f.go} min={localInput()} onChange={e => set('go', e.target.value)} />
                {err.go && <span className="hp-err">{err.go}</span>}
              </label>
            </div>
            <div className="hp-two">
              <label className="hp-f">{need ? 'People needed' : 'Seats free'}
                <input className="hp-in" type="number" min="1" max="6" value={f.seats} onChange={e => set('seats', e.target.value)} />
              </label>
              <label className="hp-f">Fare share <small>Optional</small>
                <input className="hp-in" value={f.cost} maxLength={30} onChange={e => set('cost', e.target.value)} placeholder="Split equally" />
              </label>
            </div>
          </>)}

          <label className="hp-f">{trip ? 'Leaving from' : 'Meet at'}
            <select className="hp-in" value={f.place} onChange={e => set('place', e.target.value)}>
              <option value="">Choose a spot…</option>{PLACES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {err.place && <span className="hp-err">{err.place}</span>}
          </label>

          <label className="hp-f">Details <small>Optional</small>
            <textarea className="hp-in" rows={3} maxLength={240} value={f.desc} onChange={e => set('desc', e.target.value)}
              placeholder={notes ? 'Subject, semester, how many pages…' : trip ? 'Luggage, stops, anything riders should know…' : 'When you need it, for how long…'} />
          </label>

          {notes && !need && (
            <label className="hp-file"><FileUp size={18} />{f.file || 'Attach your notes (demo: only the name is saved)'}
              <input type="file" accept=".pdf,image/*,.doc,.docx" hidden onChange={e => { set('file', e.target.files[0]?.name || ''); e.target.value = ''; }} />
            </label>
          )}

          {need && (
            <div className="hp-f hp-rw">
              <span><Gift size={14} />Add a reward <small>Optional, a small thank-you for your helper</small></span>
              <div className="hp-treats">{TREATS.map(t => <button type="button" key={t} className={f.reward === t ? 'on' : ''} onClick={() => set('reward', f.reward === t ? '' : t)}>{t}</button>)}</div>
              <input className="hp-in" value={f.reward} maxLength={40} onChange={e => set('reward', e.target.value)} placeholder="Or write your own, like lunch at the canteen" aria-label="Reward" />
              <label className="hp-chk"><input type="checkbox" checked={f.urgent} onChange={e => set('urgent', e.target.checked)} />This is urgent, show it first</label>
            </div>
          )}

          <label className="hp-f">How can people reach you?
            <input className="hp-in" value={f.contact} maxLength={80} onChange={e => set('contact', e.target.value)} placeholder="Phone, email or hostel room" />
            {err.contact && <span className="hp-err">{err.contact}</span>}
          </label>

          {matches.length > 0 && (
            <div className="hp-match">
              <b><Sparkles size={15} />{need ? 'Someone is already offering this' : 'Students are asking for this'}</b>
              {matches.map(m => <button type="button" key={m.id} onClick={() => onOpen(m)}><span>{m.title}</span><small>{placeOf(m.place)?.name} · {ago(m.at)}</small></button>)}
            </div>
          )}
        </div>

        <footer>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">{need ? 'Post request' : 'Post offer'}</button>
        </footer>
      </form>
    </div>
  );
}
