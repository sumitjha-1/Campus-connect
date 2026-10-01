import { useEffect, useRef, useState } from 'react';
import { Send, Bot, Camera, ChevronDown } from 'lucide-react';
import { placeOf, ago, assist, photoMatches } from './utils';

const CHIPS = ['I lost my AirPods', 'Find ID card', 'Show my reports'];

// Compact chat. Starts as a slim bar (title + input); opens when you click the input or the arrow.
export default function LFAssistant({ items, onOpen }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const box = useRef(null), timer = useRef(0), file = useRef(null);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' }); }, [msgs, typing]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const send = (me, make) => {
    setOpen(true); setMsgs(m => [...m, { me: true, t: me }]); setTyping(true);
    timer.current = setTimeout(() => { setMsgs(m => [...m, { me: false, ...make() }]); setTyping(false); }, 650);
  };
  const ask = q => { if (!q.trim() || typing) return; setText(''); send(q, () => { const a = assist(q, items); return { t: a.text, items: a.items }; }); };
  const photo = f => {
    if (!f || typing) return;
    send(`Photo: ${f.name}`, () => {
      const r = photoMatches(f, items);
      return r.length ? { t: 'Demo: photo matching is simulated until the AI backend is connected. Closest found items:', items: r } : { t: 'There are no found items to compare with yet.', items: [] };
    });
  };
  const n = items.filter(x => x.status === 'open').length;

  return (
    <aside className={`ai ai-c ${open ? 'open' : ''}`} aria-label="Lost and found assistant">
      <div className="ai-h">
        <span className="ai-ic"><Bot size={15} /></span>
        <div><b>Ask AI</b><small><i />{n} items open right now</small></div>
        <button type="button" className="ai-t" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label={open ? 'Collapse assistant' : 'Expand assistant'}><ChevronDown size={16} /></button>
      </div>
      {open && (<>
        <div className="ai-b" ref={box} aria-live="polite">
          <div className="ai-m"><p>Tell me what you lost or found, like “laptop near library”.</p></div>
          {msgs.map((m, i) => (
            <div key={i} className={`ai-m ${m.me ? 'me' : ''}`}>
              <p>{m.t}</p>
              {m.items?.map(it => (
                <button type="button" key={it.id} onClick={() => onOpen(it)}>
                  <span>{it.title}</span>
                  <small>{it.match ? `${it.match}% match · ` : ''}{placeOf(it.place)?.name} · {ago(it.at)}</small>
                </button>
              ))}
            </div>
          ))}
          {typing && <div className="ai-m"><p className="dots"><i /><i /><i /></p></div>}
        </div>
        <div className="ai-chips">
          {CHIPS.map(c => <button type="button" key={c} onClick={() => ask(c)}>{c}</button>)}
        </div>
      </>)}
      <form className="ai-f" onSubmit={e => { e.preventDefault(); ask(text); }}>
        <input value={text} onFocus={() => setOpen(true)} onChange={e => setText(e.target.value)} placeholder="Describe what you lost…" aria-label="Ask about a lost or found item" />
        <input ref={file} type="file" accept="image/*" hidden onChange={e => { photo(e.target.files[0]); e.target.value = ''; }} />
        <button type="button" className="cam" onClick={() => file.current?.click()} aria-label="Search by photo"><Camera size={15} /></button>
        <button type="submit" aria-label="Send"><Send size={15} /></button>
      </form>
    </aside>
  );
}