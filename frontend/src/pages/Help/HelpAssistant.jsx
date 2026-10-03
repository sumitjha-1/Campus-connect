import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, X, GripHorizontal, Plus } from 'lucide-react';
import { kindOf } from '../../data/helpData';
import { assist, placeOf, ago } from './utils';

const CHIPS = ['Who can lend a calculator?', 'Taxi to the airport', 'Lift to Knowledge Park', 'Notes for DBMS', 'How do rewards work?'];

// Floating assistant. Drag the header to move it, double-click to reset.
export default function HelpAssistant({ items, open, onToggle, onOpen, onPost }) {
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const [pos, setPos] = useState(null);
  const box = useRef(null), timer = useRef(0), input = useRef(null), panel = useRef(null), grab = useRef(null);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' }); }, [msgs, typing]);
  useEffect(() => { if (open) setTimeout(() => input.current?.focus({ preventScroll: true }), 250); }, [open]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const down = e => {
    if (e.target.closest('button')) return;
    const r = panel.current.getBoundingClientRect();
    grab.current = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = e => {
    const g = grab.current; if (!g) return;
    const w = panel.current.offsetWidth, h = panel.current.offsetHeight;
    setPos({ x: Math.min(Math.max(8, e.clientX - g.dx), window.innerWidth - w - 8), y: Math.min(Math.max(8, e.clientY - g.dy), window.innerHeight - h - 8) });
  };
  const ask = q => {
    if (!q.trim() || typing) return;
    setText(''); setMsgs(m => [...m, { me: true, t: q }]); setTyping(true);
    timer.current = setTimeout(() => { setMsgs(m => [...m, { me: false, ...assist(q, items) }]); setTyping(false); }, 650);
  };
  const place = pos ? { left: pos.x, top: pos.y, bottom: 'auto', right: 'auto' } : undefined;

  return (<>
    <button type="button" className={`hp-fab ${open ? 'on' : ''}`} onClick={onToggle} aria-expanded={open}><Sparkles size={17} />Ask AI</button>
    <aside ref={panel} style={place} className={`hp-ai ${open ? 'open' : ''}`} aria-label="Campus assistance assistant" aria-hidden={!open}>
      <header onPointerDown={down} onPointerMove={move} onPointerUp={() => { grab.current = null; }} onPointerCancel={() => { grab.current = null; }} onDoubleClick={() => setPos(null)} title="Drag to move. Double-click to reset.">
        <span className="hp-ai-ic"><Sparkles size={16} /></span>
        <div><b>Help finder</b><small>Finds people, trips and notes for you</small></div>
        <GripHorizontal size={16} className="hp-grip" aria-hidden="true" />
        <button type="button" onClick={onToggle} aria-label="Close assistant"><X size={16} /></button>
      </header>
      <div className="hp-ai-b" ref={box} aria-live="polite">
        <p className="hp-ai-m">Tell me what you need, like “calculator before my exam” or “cab to Delhi on Friday”.</p>
        {msgs.map((m, i) => (
          <div key={i} className={`hp-ai-r ${m.me ? 'me' : ''}`}>
            <p className="hp-ai-m">{m.t}</p>
            {m.items?.map(it => (
              <button type="button" key={it.id} onClick={() => onOpen(it)}>
                <span>{it.title}</span>
                <small>{kindOf(it.kind).short} · {it.mode === 'need' ? 'Needs help' : 'Offering'} · {placeOf(it.place)?.name} · {ago(it.at)}</small>
              </button>
            ))}
            {m.cta && <button type="button" className="cta" onClick={() => onPost(m.cta.kind)}><Plus size={14} />{m.cta.label}</button>}
          </div>
        ))}
        {typing && <p className="hp-ai-m dots"><i /><i /><i /></p>}
      </div>
      <div className="hp-ai-c">{CHIPS.map(c => <button type="button" key={c} onClick={() => ask(c)}>{c}</button>)}</div>
      <form onSubmit={e => { e.preventDefault(); ask(text); }}>
        <input ref={input} value={text} onChange={e => setText(e.target.value)} placeholder="What do you need help with…" aria-label="Ask the assistant" />
        <button type="submit" aria-label="Send"><Send size={15} /></button>
      </form>
    </aside>
  </>);
}
