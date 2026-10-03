import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, X, GripHorizontal } from 'lucide-react';
import { JOBS } from '../../data/jobsData';
import { extractSkills, rank, fits } from './utils';

const CHIPS = ['Internships for React', 'Alumni at Paytm', 'Show my best matches', 'How do I get a referral?'];

// Keyword answers from the loaded data. Replace with a real AI call when the backend is ready.
function assist(q, alumni, mine) {
  const s = q.toLowerCase();
  const company = JOBS.map(j => j.company).find(c => s.includes(c.toLowerCase()));
  const kind = /intern/.test(s) ? 'internship' : /\bjobs?\b|full.?time|trainee/.test(s) ? 'job' : null;
  const sk = extractSkills(s);
  if (/refer|connect|linkedin|alumn|senior/.test(s)) {
    if (/how|tip/.test(s) && !company) return { text: 'Pick a reason in the Connect section, copy the ready message, and send it on LinkedIn. Mention your skills and the role you want. Short notes get replies.', items: [] };
    const pool = alumni.filter(a => (!company || a.company === company) && (!sk.length || fits(a, sk)));
    return pool.length ? { text: `GBU alumni${company ? ` at ${company}` : ''} who can help:`, items: pool.slice(0, 4).map(a => ({ a })) }
      : { text: `No alumni found${company ? ` at ${company}` : ''} yet. Try the Connect section and search by name.`, items: [] };
  }
  const use = sk.length ? sk : /\b(my|best|match(es)?)\b/.test(s) ? mine : [];
  const pool = JOBS.filter(j => (!kind || j.kind === kind) && (!company || j.company === company));
  const list = use.length ? rank(pool, use).filter(j => j.score > 0) : pool;
  if (!list.length) return { text: 'No openings match that yet. Try a skill like react, python or excel.', items: [] };
  return { text: `${list.length} opening${list.length > 1 ? 's' : ''} found${list.length > 4 ? ' (top 4)' : ''}:`, items: list.slice(0, 4).map(j => ({ j })) };
}

// Floating assistant. Drag the header to move it anywhere. Double-click the header to reset.
export default function JobsAssistant({ alumni, skills, onJob, onAlum }) {
  const [open, setOpen] = useState(false);
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
    timer.current = setTimeout(() => { const a = assist(q, alumni, skills); setMsgs(m => [...m, { me: false, ...a }]); setTyping(false); }, 650);
  };
  const place = pos ? { left: pos.x, top: pos.y, bottom: 'auto', right: 'auto' } : undefined;

  return (<>
    <button type="button" className={`jb-fab ${open ? 'on' : ''}`} onClick={() => setOpen(o => !o)} aria-expanded={open}><Sparkles size={17} />Ask AI</button>
    <aside ref={panel} style={place} className={`jb-ai ${open ? 'open' : ''}`} aria-label="Jobs assistant" aria-hidden={!open}>
      <header onPointerDown={down} onPointerMove={move} onPointerUp={() => { grab.current = null; }} onPointerCancel={() => { grab.current = null; }} onDoubleClick={() => setPos(null)} title="Drag to move. Double-click to reset.">
        <span className="jb-ai-ic"><Sparkles size={16} /></span>
        <div><b>Career assistant</b><small>Finds openings and alumni for you</small></div>
        <GripHorizontal size={16} className="jb-grip" aria-hidden="true" />
        <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant"><X size={16} /></button>
      </header>
      <div className="jb-ai-b" ref={box} aria-live="polite">
        <p className="jb-ai-m">Ask me for openings by skill, alumni at a company, or how to get a referral.</p>
        {msgs.map((m, i) => (
          <div key={i} className={`jb-ai-r ${m.me ? 'me' : ''}`}>
            <p className="jb-ai-m">{m.t || m.text}</p>
            {m.items?.map((x, k) => x.j
              ? <button type="button" key={k} onClick={() => { onJob(x.j); setOpen(false); }}><span>{x.j.title}</span><small>{x.j.company} · {x.j.pay} · {x.j.loc}</small></button>
              : <button type="button" key={k} onClick={() => { onAlum(x.a); setOpen(false); }}><span>{x.a.name}</span><small>{x.a.role} at {x.a.company} · Batch {x.a.batch}</small></button>)}
          </div>
        ))}
        {typing && <p className="jb-ai-m dots"><i /><i /><i /></p>}
      </div>
      <div className="jb-ai-c">{CHIPS.map(c => <button type="button" key={c} onClick={() => ask(c)}>{c}</button>)}</div>
      <form onSubmit={e => { e.preventDefault(); ask(text); }}>
        <input ref={input} value={text} onChange={e => setText(e.target.value)} placeholder="Ask about jobs or alumni…" aria-label="Ask the assistant" />
        <button type="submit" aria-label="Send"><Send size={15} /></button>
      </form>
    </aside>
  </>);
}