import { useEffect, useRef, useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { classify } from '../../data/categories';
import { fmt } from './utils';

const STOP = new Set('what which events event upcoming show tell about notices notice circular circulars past when there have any the are this that next soon coming previous last held give list me for and from with please recent'.split(' '));
// Keyword search over the loaded feed. Replace with a real AI call when the backend is ready.
function answer(q, lists) {
  const s = q.toLowerCase();
  let pool = [...lists.up, ...lists.past, ...lists.notice], tag = '';
  if (/upcoming|next|soon|coming|this month/.test(s)) { pool = lists.up; tag = ' upcoming events'; }
  else if (/past|previous|last|held|recent/.test(s)) { pool = lists.past; tag = ' recent events'; }
  else if (/notice|circular|scholarship|fee|exam|advisory/.test(s)) { pool = lists.notice; tag = ' notices'; }
  const words = s.split(/\W+/).filter(w => w.length > 2 && !STOP.has(w));
  const hits = words.length ? pool.filter(x => words.some(w => `${x.title} ${x.org} ${classify(x).label}`.toLowerCase().includes(w))) : pool;
  if (!hits.length) return { text: "I couldn't find anything like that on the GBU site. Try a school name or a topic, like “conference” or “scholarship”.", items: [] };
  const lead = hits.length === 1 ? "There's one" : `Here are ${Math.min(hits.length, 4)}`;
  return { text: `${lead}${tag || ' match'}${hits.length > 4 ? ` (of ${hits.length})` : ''}:`, items: hits.slice(0, 4) };
}
const CHIPS = ["What's coming up?", 'Any scholarship notices?', 'Law events', 'Recent conferences'];

export default function Assistant({ lists }) {
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const box = useRef(null); const timer = useRef(0);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' }); }, [msgs, typing]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const ask = q => {
    if (!q.trim() || typing) return;
    setMsgs(m => [...m, { me: true, t: q }]); setText(''); setTyping(true);
    timer.current = setTimeout(() => { const a = answer(q, lists); setMsgs(m => [...m, { me: false, ...a, t: a.text }]); setTyping(false); }, 650);
  };
  const n = lists.up.length;
  return (
    <aside className="ai" aria-label="Event assistant">
      <div className="ai-h"><span className="ai-ic"><Bot size={18} /></span><div><b>Event assistant</b><small><i />Searches the GBU feed for you</small></div></div>
      <div className="ai-b" ref={box} aria-live="polite">
        <div className="ai-m"><p>Hi! {n ? `There ${n === 1 ? 'is 1 upcoming event' : `are ${n} upcoming events`} right now.` : 'Ask me about GBU events and notices.'} What would you like to know?</p></div>
        {msgs.map((m, i) => (
          <div key={i} className={`ai-m ${m.me ? 'me' : ''}`}>
            <p>{m.t}</p>
            {m.items?.map(it => <a key={it.href + it.date} href={it.href} target="_blank" rel="noopener noreferrer"><span>{it.title}</span><small>{fmt(it.date)}</small></a>)}
          </div>
        ))}
        {typing && <div className="ai-m"><p className="dots"><i /><i /><i /></p></div>}
      </div>
      <div className="ai-chips">{CHIPS.map(c => <button type="button" key={c} onClick={() => ask(c)}>{c}</button>)}</div>
      <form className="ai-f" onSubmit={e => { e.preventDefault(); ask(text); }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Ask about an event or notice" aria-label="Ask about an event or notice" />
        <button type="submit" aria-label="Send"><Send size={16} /></button>
      </form>
    </aside>
  );
}
