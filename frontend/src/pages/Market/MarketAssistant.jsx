import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, X, GripHorizontal } from 'lucide-react';
import { placeOf, ago, money, assist } from './utils';

const CHIPS = ['Books under ₹300', 'Cycle for sale', 'Free items', 'Show my listings'];

// Floating assistant. Opened from the dock; drag the header to move it anywhere.
export default function MarketAssistant({ items, open, onClose, onOpen }) {
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const [pos, setPos] = useState(null); // null = default spot above the dock
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
    setPos({
      x: Math.min(Math.max(8, e.clientX - g.dx), window.innerWidth - w - 8),
      y: Math.min(Math.max(8, e.clientY - g.dy), window.innerHeight - h - 8),
    });
  };
  const up = () => { grab.current = null; };

  const ask = q => {
    if (!q.trim() || typing) return;
    setText(''); setMsgs(m => [...m, { me: true, t: q }]); setTyping(true);
    timer.current = setTimeout(() => { const a = assist(q, items); setMsgs(m => [...m, { me: false, t: a.text, items: a.items }]); setTyping(false); }, 650);
  };

  const place = pos ? { left: pos.x, top: pos.y, bottom: 'auto', translate: 'none' } : undefined;

  return (
    <aside ref={panel} style={place} className={`mk-ai ${open ? 'open' : ''}`} aria-label="Marketplace assistant" aria-hidden={!open}>
      <header onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onDoubleClick={() => setPos(null)} title="Drag to move. Double-click to reset.">
        <span className="mk-ai-ic"><Sparkles size={16} /></span>
        <div><b>Ask AI</b><small>Finds items, prices and requests for you</small></div>
        <GripHorizontal size={16} className="mk-grip" aria-hidden="true" />
        <button type="button" onClick={onClose} aria-label="Close assistant"><X size={16} /></button>
      </header>
      <div className="mk-ai-b" ref={box} aria-live="polite">
        <p className="mk-ai-m">Tell me what you need, like “calculator under ₹500” or “lab coat”.</p>
        {msgs.map((m, i) => (
          <div key={i} className={`mk-ai-r ${m.me ? 'me' : ''}`}>
            <p className="mk-ai-m">{m.t}</p>
            {m.items?.map(it => (
              <button type="button" key={it.id} onClick={() => onOpen(it)}>
                <span>{it.title}</span>
                <small>{money(it.price)} · {placeOf(it.place)?.name} · {ago(it.at)}</small>
              </button>
            ))}
          </div>
        ))}
        {typing && <p className="mk-ai-m dots"><i /><i /><i /></p>}
      </div>
      <div className="mk-ai-c">{CHIPS.map(c => <button type="button" key={c} onClick={() => ask(c)}>{c}</button>)}</div>
      <form onSubmit={e => { e.preventDefault(); ask(text); }}>
        <input ref={input} value={text} onChange={e => setText(e.target.value)} placeholder="What are you looking for…" aria-label="Ask about an item" />
        <button type="submit" aria-label="Send"><Send size={15} /></button>
      </form>
    </aside>
  );
}