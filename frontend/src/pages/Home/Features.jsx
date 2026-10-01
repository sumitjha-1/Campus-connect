import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Section from '../../components/Section/Section';
import { modules, stats } from '../../data/content';
import { toolPath } from '../../data/tools';

function Count({ text }) {
  const m = /^(\d+)(.*)$/.exec(text); const ref = useRef(null); const [n, setN] = useState(0);
  useEffect(() => {
    if (!m) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t = +m[1];
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(t); return; }
      const s = performance.now();
      const step = now => { const p = Math.min((now - s) / 1300, 1); setN(Math.round(t * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
    io.observe(ref.current); return () => io.disconnect();
  }, []);
  return <strong ref={ref}>{m ? n + m[2] : text}</strong>;
}

export default function Features() {
  return (
    <Section id="features" className="overlap">
      <nav className="dock stagger" aria-label="Campus services">
        {modules.map(m => (
          <Link key={m.key} to={toolPath[m.key]} className="dock-item" style={{ '--c': `var(--${m.color})` }}>
            <span className="di"><m.icon size={20} /></span>
            <span><b>{m.title}</b><small>{m.short}</small></span>
            <ArrowUpRight className="da" size={16} />
          </Link>
        ))}
      </nav>
      <div className="figures stagger">
        {stats.map(s => (<div key={s.label}><Count text={s.big} /><small>{s.label}</small></div>))}
      </div>
    </Section>
  );
}
