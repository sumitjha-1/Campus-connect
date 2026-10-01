import { Check } from 'lucide-react';
import PageShell from '../../components/PageShell/PageShell';
import Button from '../../components/Button/Button';
import { modules } from '../../data/content';

// What each tool will do. Replace with the real page when it is built.
const plans = {
  market: ['List an item with photos and a price in under a minute', 'Browse by category: books, cycles, lab gear, electronics', 'Message the seller directly, only verified students', 'AI-powered search and recommendations'],
  alumni: ['Internships and jobs from LinkedIn and Internshala', 'See which GBU alumni already work at each company', 'Message alumni for advice or referrals', 'AI picks openings that suit your course and skills'],
  help: ['Post a request: a calculator, notes, a study partner', 'Find someone travelling to the same place', 'Offer help and see who needs it nearby', 'Get notified when someone replies'],
};

export default function ToolPage({ k }) {
  const m = modules.find(x => x.key === k);
  return (
    <PageShell>
      <section className="redir tool" style={{ '--c': `var(--${m.color})` }}>
        <span className="redir-ic"><m.icon size={30} /></span>
        <p className="eyebrow">Coming soon</p>
        <h1>{m.title}</h1>
        <p className="body">{m.desc}</p>
        <ul className="soon-list">{(plans[k] || []).map(t => <li key={t}><Check size={16} />{t}</li>)}</ul>
        <Button to="/">Back to home</Button>
      </section>
    </PageShell>
  );
}
