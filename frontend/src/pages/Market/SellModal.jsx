import { useEffect, useMemo, useState } from 'react';
import { X, ImagePlus, Sparkles, TrendingUp } from 'lucide-react';
import { PLACES } from '../../data/lostFoundData';
import { CATEGORIES, CONDITIONS } from '../../data/marketData';
import { placeOf, readImage, suggestPrice, similar, money, ago } from './utils';

const blank = type => ({ type, title: '', cat: 'books', price: '', negotiable: true, cond: 'Good', place: '', desc: '', tags: '', contact: '', photo: null });

export default function SellModal({ initialType = 'sell', items, onClose, onSubmit, onOpen }) {
  const [f, setF] = useState(() => blank(initialType));
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k, v) => { setF(s => ({ ...s, [k]: v })); setErr(e => ({ ...e, [k]: '' })); };
  const sell = f.type === 'sell';

  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    const o = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = o; };
  }, [onClose]);

  const tip = useMemo(() => (sell && f.title.trim().length > 2 ? suggestPrice(f, items) : null), [sell, f.title, f.cat, items]);
  const matches = useMemo(() => (f.title.trim().length > 2 ? similar(f, items) : []), [f.title, f.cat, f.type, items]);

  const pickPhoto = async file => {
    if (!file) return;
    setBusy(true);
    try { set('photo', await readImage(file)); } catch { setErr(e => ({ ...e, photo: 'Could not read that image.' })); }
    setBusy(false);
  };

  const submit = e => {
    e.preventDefault();
    const er = {}, p = Number(f.price);
    if (!f.title.trim()) er.title = 'Give it a name.';
    if (f.price === '' || !Number.isFinite(p) || p < 0) er.price = sell ? 'Enter a price (0 for free).' : 'Enter your budget.';
    if (!f.place) er.place = 'Choose a meeting spot.';
    if (!f.contact.trim()) er.contact = 'Add a way to reach you.';
    setErr(er);
    if (Object.keys(er).length) return;
    onSubmit({
      type: f.type, title: f.title.trim(), cat: f.cat, price: Math.round(p), negotiable: f.negotiable && p > 0, cond: sell ? f.cond : '',
      place: f.place, at: new Date().toISOString(), desc: f.desc.trim() || 'No description added.',
      tags: f.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5), contact: f.contact.trim(), photo: f.photo,
      seller: { name: 'You', course: 'GBU student' },
    });
  };

  return (
    <div className="mk-ov" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form className="mk-sd" onSubmit={submit} noValidate role="dialog" aria-modal="true" aria-label="Post a listing">
        <header className="mk-sd-h">
          <div><h2>{sell ? 'Sell an item' : 'Post a request'}</h2><p>{sell ? 'Goes live right away.' : 'Sellers on campus will see it.'}</p></div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>

        <div className="mk-sd-b">
          <div className="mk-tog" role="group" aria-label="Type of listing">
            <button type="button" className={f.type === 'sell' ? 'on' : ''} onClick={() => set('type', 'sell')}>I'm selling</button>
            <button type="button" className={`want ${f.type === 'want' ? 'on' : ''}`} onClick={() => set('type', 'want')}>I'm looking for</button>
          </div>

          <label className="mk-f">{sell ? 'What are you selling?' : 'What do you need?'}
            <input className="mk-i" autoFocus value={f.title} maxLength={60} onChange={e => set('title', e.target.value)} placeholder={sell ? 'e.g. Engineering Mathematics book' : 'e.g. Scientific calculator'} />
            {err.title && <span className="mk-e">{err.title}</span>}
          </label>

          <div className="mk-f">
            <span>{sell ? 'Price' : 'Your budget'} <small>{sell ? '(0 = free)' : '(the most you can pay)'}</small></span>
            <label className="mk-money"><span>₹</span>
              <input type="number" min="0" inputMode="numeric" value={f.price} onChange={e => set('price', e.target.value)} placeholder="0" aria-label="Price" />
            </label>
            {err.price && <span className="mk-e">{err.price}</span>}
            {tip && (
              <div className="mk-tip">
                <b><TrendingUp size={15} />Similar items: {money(tip.low)} to {money(tip.high)}</b>
                <button type="button" onClick={() => set('price', String(tip.mid))}>Use {money(tip.mid)}</button>
              </div>
            )}
            <label className="mk-chk"><input type="checkbox" checked={f.negotiable} onChange={e => set('negotiable', e.target.checked)} />Price is negotiable</label>
          </div>

          <div className="mk-f">
            <span>Category</span>
            <div className="mk-chips">
              {CATEGORIES.map(c => (
                <button type="button" key={c.k} className={f.cat === c.k ? 'on' : ''} style={{ '--c': `var(--${c.color})` }} onClick={() => set('cat', c.k)}>
                  <c.Icon size={14} />{c.label}
                </button>
              ))}
            </div>
          </div>

          {sell && (
            <div className="mk-f">
              <span>Condition</span>
              <div className="mk-chips">
                {CONDITIONS.map(c => <button type="button" key={c} className={f.cond === c ? 'on' : ''} onClick={() => set('cond', c)}>{c}</button>)}
              </div>
            </div>
          )}

          <div className="mk-r2">
            <label className="mk-f">Meet at
              <select className="mk-i" value={f.place} onChange={e => set('place', e.target.value)}>
                <option value="">Choose a spot…</option>{PLACES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {err.place && <span className="mk-e">{err.place}</span>}
            </label>
            <label className="mk-f">Contact
              <input className="mk-i" value={f.contact} maxLength={80} onChange={e => set('contact', e.target.value)} placeholder="Phone or email" />
              {err.contact && <span className="mk-e">{err.contact}</span>}
            </label>
          </div>

          {sell && (f.photo ? (
            <div className="mk-pv"><img src={f.photo} alt="Preview of the item" /><button type="button" onClick={() => set('photo', null)}>Remove photo</button></div>
          ) : (
            <label className="mk-pa"><ImagePlus size={18} />{busy ? 'Processing…' : 'Add a photo (sells faster)'}
              <input type="file" accept="image/*" hidden onChange={e => { pickPhoto(e.target.files[0]); e.target.value = ''; }} />
            </label>
          ))}
          {err.photo && <span className="mk-e">{err.photo}</span>}

          <details className="mk-more">
            <summary>+ Add more details (optional)</summary>
            <div>
              <label className="mk-f">Description
                <textarea className="mk-i" rows={3} maxLength={240} value={f.desc} onChange={e => set('desc', e.target.value)} placeholder={sell ? 'Edition, age, defects, what is included…' : 'Brand, specs, when you need it…'} />
              </label>
              <label className="mk-f">Tags <small>Separate with commas</small>
                <input className="mk-i" value={f.tags} onChange={e => set('tags', e.target.value)} placeholder="Maths, Textbook" />
              </label>
            </div>
          </details>

          {matches.length > 0 && (
            <div className="lf-match">
              <b><Sparkles size={15} />{sell ? 'Students are looking for this' : 'Already listed for sale'}</b>
              {matches.map(m => <button type="button" key={m.id} onClick={() => onOpen(m)}><span>{m.title}</span><small>{money(m.price)} · {placeOf(m.place)?.name} · {ago(m.at)}</small></button>)}
            </div>
          )}
        </div>

        <footer className="mk-sd-f">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">{sell ? 'Post listing' : 'Post request'}</button>
        </footer>
      </form>
    </div>
  );
}