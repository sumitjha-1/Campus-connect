import { useState, useEffect } from 'react';
import Section from '../../components/Section/Section';
import Button from '../../components/Button/Button';
import { modules } from '../../data/content';

// sample screens shown in the preview window
const demo = {
  events: [['Tech Fest 2026', 'Fri · 5 PM · Auditorium', 'Register'], ['Coding Club meetup', 'Sat · Lab 3', 'Join'], ['Cultural night', 'Next Mon · Open ground', 'Remind me']],
  lost: [['Blue wallet', 'Found near the library · Reward offered', 'Claim'], ['Student ID card', 'Lost in Block C', 'I found it'], ['Water bottle', 'Found at the canteen', 'Claim']],
  market: [['Engineering maths book', 'Posted by a senior · ₹250', 'Chat'], ['Cycle, good condition', '₹3,000', 'Chat'], ['Lab coat, size M', '₹150', 'Chat']],
  help: [['Scientific calculator', 'Needed for tomorrow\'s maths exam', 'I have one'], ['Travel partner to Delhi', 'Friday evening, sharing a cab', 'Count me in'], ['Notes for Data Structures', 'Missed two lectures', 'I can share']],
  alumni: [['Aarav Mehta, Batch of 2021', 'Software engineer · open to questions', 'Message'], ['Priya Nair, Batch of 2019', 'Product designer · offers mock interviews', 'Message'], ['Rohan Gupta, Batch of 2020', 'Data analyst · referrals', 'Message']],
};

export default function Solution() {
  const [hot, setHot] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setHot(h => (h + 1) % modules.length), 5000);
    return () => clearTimeout(t);
  }, [hot, paused]);
  const m = modules[hot];
  return (
    <Section id="solution">
      <div className="head center">
        <p className="eyebrow">Our solution</p><h2>Everything You Need, Behind One Login</h2>
        <p className="body">Pick a tool to see how it looks inside.</p>
      </div>
      <div className="showcase" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="stabs">
          {modules.map((x, i) => (
            <button key={x.key} type="button" className={`stab ${hot === i ? 'on' : ''}`} style={{ '--c': `var(--${x.color})` }} onClick={() => setHot(i)}>
              <i><x.icon size={20} /></i><span><b>{x.title}</b><small>{x.desc}</small></span><em className="bar" />
            </button>
          ))}
          <Button to="/register">Get Started</Button>
        </div>
        <div className="win" style={{ '--c': `var(--${m.color})` }}>
          <div className="win-h"><i /><i /><i /><b>{m.title}</b></div>
          <div className="win-b" key={hot}>
            {demo[m.key].map(([t, s, a]) => (<div className="row" key={t}><span className="ri"><m.icon size={18} /></span><div><b>{t}</b><small>{s}</small></div><span className="go">{a}</span></div>))}
          </div>
        </div>
      </div>
    </Section>
  );
}