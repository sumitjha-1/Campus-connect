import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Menu, X, ArrowUp, ArrowUpRight } from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { navLinks } from '../../data/content';

const Auth = ({ className = '', onGo }) => (
  <div className={`auth ${className}`}>
    <Link to="/login" className="a-login" onClick={onGo}>Login</Link>
    <Link to="/register" className="a-join" onClick={onGo}>Sign up <ArrowUpRight size={15} /></Link>
  </div>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const bar = useRef(null);
  useEffect(() => {
    let ticking = false;
    const run = () => {
      ticking = false;
      setScrolled(window.scrollY > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
      let cur = 'home';
      for (const l of navLinks) { const el = document.getElementById(l.href.slice(1)); if (el && el.getBoundingClientRect().top <= 140) cur = l.href.slice(1); }
      setActive(cur);
    };
    const on = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
    run(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (<>
    <header className={`nav ${scrolled || open ? 'solid' : ''}`}>
      <div className="nav-in">
        <Link to="/" className="logo"><span className="logo-mark"><GraduationCap size={20} /></span> Campus Connect</Link>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {navLinks.map(l => <a key={l.href} href={l.href} className={active === l.href.slice(1) ? 'active' : ''} onClick={() => setOpen(false)}>{l.label}</a>)}
          <Auth className="m" onGo={() => setOpen(false)} />
        </nav>
        <div className="nav-right">
          <Auth className="d" />
          <ThemeToggle />
          <button className="icon-btn menu" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
      <span ref={bar} className="nav-bar" />
    </header>
    <a href="#home" className={`totop ${scrolled ? 'show' : ''}`} aria-label="Back to top"><ArrowUp size={18} /></a>
  </>);
}