import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const rules = [
  [/lost|found|wallet|reward/i, 'Open Lost & Found, tap Post and add a photo plus where you lost or found it. If you are offering a reward, say so there. Only ID-verified students can reply, so it stays safe.'],
  [/sell|buy|market|book/i, 'Go to Marketplace and tap Sell. Add a photo, a price and a short description. Interested students message you directly.'],
  [/travel|trip|partner|cab/i, 'Post a request under Campus Help with your destination, date and time. Students going the same way can reply and team up.'],
  [/calculator|help|borrow/i, 'Post what you need under Campus Help, like a calculator before an exam. Someone nearby can reply and lend a hand.'],
  [/alumni|job|intern|career|referral/i, 'The Alumni Network lets you message graduates from your college about internships, jobs and careers. You can also ask for mock interviews.'],
  [/id|verify|sign|login|register/i, 'Students verify with a college ID card when they sign up. It keeps the community real, and it is only used to confirm you study here.'],
];
const chips = ['Report a lost item', 'Sell something', 'Find a travel partner', 'Talk to alumni'];
const reply = q => (rules.find(([re]) => re.test(q)) || [0, 'I am not sure about that one yet. Try one of the suggestions above, or write to us from the Contact section.'])[1];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ me: false, t: 'Hi! Ask me anything about using Campus Connect.' }]);
  const [text, setText] = useState('');
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [msgs, open]);
  const ask = q => { if (!q.trim()) return; setMsgs(m => [...m, { me: true, t: q }, { me: false, t: reply(q) }]); setText(''); };
  return (<>
    {open && (
      <div className="chat" role="dialog" aria-label="Chat assistant">
        <div className="chat-h"><span className="logo-mark"><MessageCircle size={16} /></span><div><b>Chat with us</b><small>Quick answers about the app</small></div>
          <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close chat"><X size={16} /></button></div>
        <div className="chat-b">
          {msgs.map((m, i) => <p key={i} className={`bub ${m.me ? 'me' : ''}`}>{m.t}</p>)}
          <div ref={end} />
        </div>
        <div className="chips">{chips.map(c => <button type="button" key={c} onClick={() => ask(c)}>{c}</button>)}</div>
        <form className="chat-f" onSubmit={e => { e.preventDefault(); ask(text); }}>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Type your question" aria-label="Your question" />
          <button type="submit" aria-label="Send"><Send size={16} /></button>
        </form>
      </div>
    )}
    <button type="button" className="chat-fab" onClick={() => setOpen(o => !o)} aria-label="Open chat">{open ? <X size={22} /> : <MessageCircle size={22} />}</button>
  </>);
}