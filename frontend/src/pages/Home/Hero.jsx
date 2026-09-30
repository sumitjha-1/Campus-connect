import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarCheck, PackageCheck, HandHelping, Store, Plane } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import { campusImages } from '../../assets/images/campus';
import Button from '../../components/Button/Button';

// Cards that scroll upwards on the right side of the hero
const cards = [
  { i: PackageCheck, c: 'rose', tag: 'Lost & Found', t: 'Blue wallet found', s: 'The owner is offering a reward.' },
  { i: HandHelping, c: 'green', tag: 'Help', t: 'Calculator needed', s: 'Maths exam tomorrow, Block C.' },
  { i: Store, c: 'amber', tag: 'Market', t: 'Maths books for sale', s: '₹250, posted by a senior.' },
  { i: Plane, c: 'violet', tag: 'Help', t: 'Travel partner wanted', s: 'Delhi trip on Friday evening.' },
  { i: CalendarCheck, c: 'blue', tag: 'Event', t: 'Tech Fest 2026', s: 'Registrations are open.' },
];
const words = ['events', 'lost items', 'used books', 'a travel partner', 'answers'];

const Track = ({ list }) => (
  <div className="track">
    {[...list, ...list].map((f, k) => (
      <div className="rc" key={f.t + k} style={{ '--c': `var(--${f.c})` }}>
        <span className="gi"><f.i size={18} /></span>
        <div><span className="tag">{f.tag}</span><b>{f.t}</b><small>{f.s}</small></div>
      </div>
    ))}
  </div>
);

export default function Hero() {
  const { theme } = useTheme();
  const root = useRef(null), bg = useRef(null), torch = useRef(null);
  const [w, setW] = useState(0);
  const img = theme === 'dark' ? campusImages.heroDark : campusImages.heroLight;

  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true, raf = 0, ticking = false, mx = 0, my = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; root.current.classList.toggle('off', !visible); });
    io.observe(root.current);
    if (calm) return () => io.disconnect();
    const a = setInterval(() => visible && setW(v => (v + 1) % words.length), 2200);
    const paint = () => {
      ticking = false;
      const r = root.current.getBoundingClientRect();
      if (torch.current) torch.current.style.transform = `translate3d(${mx - r.left - 260}px,${my - r.top - 260}px,0)`;
      if (bg.current && scrollY < 900) bg.current.style.transform = `translate3d(0,${scrollY * 0.1}px,0) scale(1.08)`;
    };
    const ask = () => { if (!ticking && visible) { ticking = true; raf = requestAnimationFrame(paint); } };
    const move = e => { mx = e.clientX; my = e.clientY; ask(); };
    addEventListener('pointermove', move, { passive: true });
    addEventListener('scroll', ask, { passive: true });
    return () => { io.disconnect(); clearInterval(a); removeEventListener('pointermove', move); removeEventListener('scroll', ask); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="home" className="hero" ref={root}>
      <div ref={bg} className="hero-bg" style={{ backgroundImage: `url(${img})` }} />
      <div className="hero-shade" /><div className="hero-torch" ref={torch} />
      <div className="wrap"><div className="hero-in">
        <p className="pill"><span className="dot" />Built for students, by students</p>
        <h1><span className="ln"><span>Connect.</span></span><span className="ln"><span>Discover.</span></span><span className="ln"><span><em>Grow Together.</em></span></span></h1>
        <p className="lead">Find <span className="rot" key={w}>{words[w]}</span> in seconds. Sell what you don't need, ask for a hand, and meet people who have been where you are.</p>
        <div className="hero-cta"><Button to="/register">Get Started <ArrowRight size={16} /></Button><Button href="#features" variant="glass">Explore Campus</Button></div>
        <p className="proof"><span className="faces"><b>R</b><b>A</b><b>N</b><b>+</b></span>500+ students already here</p>
      </div>
      <aside className="rail" aria-hidden="true">
        <div className="col a"><Track list={cards} /></div>
      </aside></div>
      <span className="mouse" aria-hidden="true"><i />Scroll</span>
    </section>
  );
}