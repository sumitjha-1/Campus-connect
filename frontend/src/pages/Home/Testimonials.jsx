import { useState, useEffect } from 'react';
import { Quote, Star, ArrowLeft, ArrowRight } from 'lucide-react';
import Section from '../../components/Section/Section';
import { testimonials } from '../../data/content';

export default function Testimonials() {
  const n = testimonials.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = d => setI(v => (v + d + n) % n);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI(v => (v + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);
  return (
    <Section id="testimony" className="tint-violet">
      <div className="voices" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div>
          <p className="eyebrow">Testimonials</p>
          <h2>What students say</h2>
          <p className="body">Small moments where a quick reply made a big difference.</p>
          <div className="vctrl">
            <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label="Previous"><ArrowLeft size={18} /></button>
            <button type="button" className="icon-btn" onClick={() => go(1)} aria-label="Next"><ArrowRight size={18} /></button>
            <span className="vcount"><b>0{i + 1}</b> / 0{n}</span>
          </div>
        </div>
        <div className="deck">
          {testimonials.map((t, k) => {
            const o = (k - i + n) % n;
            return (
              <figure className="vcard" key={t.name} style={{ '--o': o }} aria-hidden={o !== 0}>
                <Quote className="vq" size={44} />
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  <span className="avatar">{t.name[0]}</span>
                  <span><b>{t.name}</b><small>{t.course}</small></span>
                  <span className="stars">{[0, 1, 2, 3, 4].map(s => <Star key={s} size={14} fill="currentColor" />)}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </Section>
  );
}