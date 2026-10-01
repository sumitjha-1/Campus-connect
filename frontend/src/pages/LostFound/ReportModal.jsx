import { useEffect, useMemo, useState } from 'react';
import { X, ImagePlus, Sparkles, LocateFixed } from 'lucide-react';
import LiveMap from './LiveMap';
import { CATEGORIES } from '../../data/lostFoundData';
import { localInput, placeOf, possibleMatches, readImage, ago, nearest } from './utils';

const blank = type => ({ type, title: '', cat: 'electronics', place: '', lat: null, lng: null, when: localInput(), desc: '', tags: '', reward: '', contact: '', photo: null });

// Slide-in form. onSubmit receives the clean item object; the page adds it to the feed.
export default function ReportModal({ initialType = 'lost', items, onClose, onSubmit, onOpen }) {
  const [f, setF] = useState(() => blank(initialType));
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k, v) => { setF(s => ({ ...s, [k]: v })); setErr(e => ({ ...e, [k]: '' })); };
  const pin = pt => { setF(s => ({ ...s, lat: pt.lat, lng: pt.lng, place: nearest(pt.lat, pt.lng).id })); setErr(e => ({ ...e, place: '' })); };
  const locate = () => navigator.geolocation?.getCurrentPosition(
    p => pin({ lat: p.coords.latitude, lng: p.coords.longitude }),
    () => setErr(e => ({ ...e, place: 'Could not get your location. Tap the map instead.' })));

  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    const o = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = o; };
  }, [onClose]);

  const matches = useMemo(() => (f.title.trim().length > 2 ? possibleMatches(f, items) : []), [f.title, f.cat, f.place, f.type, items]);

  const pickPhoto = async file => {
    if (!file) return;
    setBusy(true);
    try { set('photo', await readImage(file)); } catch { setErr(e => ({ ...e, photo: 'Could not read that image.' })); }
    setBusy(false);
  };

  const submit = e => {
    e.preventDefault();
    const er = {};
    if (!f.title.trim()) er.title = 'Give the item a name.';
    if (!f.place) er.place = 'Tap the map to drop a pin.';
    if (!f.contact.trim()) er.contact = 'Add a way to reach you.';
    if (new Date(f.when) > new Date()) er.when = 'The time cannot be in the future.';
    setErr(er);
    if (Object.keys(er).length) return;
    onSubmit({
      type: f.type, title: f.title.trim(), cat: f.cat, place: f.place, lat: f.lat, lng: f.lng, at: new Date(f.when).toISOString(),
      desc: f.desc.trim() || 'No description added.', tags: f.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5),
      reward: f.type === 'lost' ? f.reward.trim() : '', contact: f.contact.trim(), photo: f.photo,
    });
  };

  const lost = f.type === 'lost';
  return (
    <div className="lf-ov" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form className="lf-dr" onSubmit={submit} noValidate role="dialog" aria-modal="true" aria-label="Report an item">
        <header className="lf-dh">
          <div><h2>Report an item</h2><p>It appears on the campus map right away.</p></div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>

        <div className="lf-db">
          <div className="lf-seg" role="group" aria-label="Type of report">
            {[['lost', 'I lost something'], ['found', 'I found something']].map(([k, l]) => (
              <button type="button" key={k} className={`${k} ${f.type === k ? 'on' : ''}`} aria-pressed={f.type === k} onClick={() => set('type', k)}>{l}</button>
            ))}
          </div>

          <label className="lf-fl">Item name
            <input className="lf-in" value={f.title} maxLength={60} onChange={e => set('title', e.target.value)} placeholder="e.g. Blue water bottle" />
            {err.title && <span className="lf-err">{err.title}</span>}
          </label>

          <div className="lf-two">
            <label className="lf-fl">Category
              <select className="lf-in" value={f.cat} onChange={e => set('cat', e.target.value)}>{CATEGORIES.map(c => <option key={c.k} value={c.k}>{c.label}</option>)}</select>
            </label>
            <label className="lf-fl">{lost ? 'Lost on' : 'Found on'}
              <input className="lf-in" type="datetime-local" value={f.when} max={localInput()} onChange={e => set('when', e.target.value)} />
              {err.when && <span className="lf-err">{err.when}</span>}
            </label>
          </div>

          <div className="lf-fl">
            <span>Where on campus?</span>
            <LiveMap pick type={f.type} point={f.lat != null ? { lat: f.lat, lng: f.lng } : null} onPick={pin} className="lf-pickmap" />
            <div className="lf-pickbar">
              <small className="lf-hint">{f.place ? `Pinned near ${placeOf(f.place).name}` : 'Tap the map where it happened.'}</small>
              <button type="button" className="lf-pickbtn" onClick={locate}><LocateFixed size={13} />Use my location</button>
            </div>
            {err.place && <span className="lf-err">{err.place}</span>}
          </div>

          <label className="lf-fl">Description
            <textarea className="lf-in" rows={3} maxLength={240} value={f.desc} onChange={e => set('desc', e.target.value)} placeholder="Colour, brand, marks, what is inside…" />
          </label>

          <label className="lf-fl">Tags <small className="lf-hint">Separate with commas</small>
            <input className="lf-in" value={f.tags} onChange={e => set('tags', e.target.value)} placeholder="Apple, Laptop" />
          </label>

          {lost && (
            <label className="lf-fl">Reward <small className="lf-hint">Optional, like a shake or a treat</small>
              <input className="lf-in" value={f.reward} maxLength={50} onChange={e => set('reward', e.target.value)} placeholder="A treat at the canteen" />
            </label>
          )}

          <label className="lf-fl">How can people reach you?
            <input className="lf-in" value={f.contact} maxLength={80} onChange={e => set('contact', e.target.value)} placeholder="Email, phone or hostel room" />
            {err.contact && <span className="lf-err">{err.contact}</span>}
          </label>

          <div className="lf-fl">
            <span>Photo <small className="lf-hint">Optional, helps AI matching</small></span>
            {f.photo ? (
              <div className="lf-prev"><img src={f.photo} alt="Preview of the item" /><button type="button" onClick={() => set('photo', null)}>Remove</button></div>
            ) : (
              <label className="lf-drop"><ImagePlus size={20} />{busy ? 'Processing…' : 'Add a photo'}
                <input type="file" accept="image/*" hidden onChange={e => { pickPhoto(e.target.files[0]); e.target.value = ''; }} />
              </label>
            )}
            {err.photo && <span className="lf-err">{err.photo}</span>}
          </div>

          {matches.length > 0 && (
            <div className="lf-match">
              <b><Sparkles size={15} />Possible matches already posted</b>
              {matches.map(m => <button type="button" key={m.id} onClick={() => onOpen(m)}><span>{m.title}</span><small>{placeOf(m.place)?.name} · {ago(m.at)}</small></button>)}
            </div>
          )}
        </div>

        <footer className="lf-df">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Post report</button>
        </footer>
      </form>
    </div>
  );
}