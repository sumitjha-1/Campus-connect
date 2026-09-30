import { X, Check } from 'lucide-react';
import Section from '../../components/Section/Section';
import { problems } from '../../data/content';

const fixes = [
  ['One place to look', 'Events, listings and requests in a single feed.'],
  ['Alerts that matter', 'A nudge before the deadline, not after it.'],
  ['Lost items go home', 'Finders can earn a reward, and ID-verified accounts keep it honest.'],
  ['Ask and get an answer', 'Post what you need and someone nearby can say yes.'],
];

export default function Problem() {
  return (
    <Section id="about" className="tint-a">
      <div className="head center">
        <p className="eyebrow">The problem</p>
        <h2>Useful Things Get Buried in Group Chats</h2>
        <p className="body">Right now, college life runs on WhatsApp groups and notice boards. Good opportunities slip past, and simple favours take a lot of asking around.</p>
      </div>
      <div className="ba stagger">
        <div className="panel bad">
          <h3><span className="mark"><X size={18} /></span>Today</h3>
          <ul>{problems.map(p => (<li key={p.title}><span className="mark"><p.icon size={16} /></span><div><b>{p.title}</b><small>{p.desc}</small></div></li>))}</ul>
        </div>
        <span className="vs">VS</span>
        <div className="panel good">
          <h3><span className="mark"><Check size={18} /></span>With Campus Connect</h3>
          <ul>{fixes.map(([t, d]) => (<li key={t}><span className="mark"><Check size={16} /></span><div><b>{t}</b><small>{d}</small></div></li>))}</ul>
        </div>
      </div>
    </Section>
  );
}