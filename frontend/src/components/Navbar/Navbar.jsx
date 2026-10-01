import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, ArrowUp, ArrowUpRight, ChevronDown } from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { navLinks, modules } from '../../data/content';
import { toolPath } from '../../data/tools';

const Auth = ({ className = '', onGo }) => (
  <div className={`auth ${className}`}>
    <Link to="/login" className="a-login" onClick={onGo}>Login</Link>
    <Link to="/register" className="a-join" onClick={onGo}>Sign up <ArrowUpRight size={15} /></Link>
  </div>
);

// One navbar for the whole site.
// Home page: section links (About, Solution…) plus a Services menu.
// Every other page: Home + the five tools directly, so you can jump between Events, Lost & Found, Marketplace…
// `forceSolid` keeps it opaque on pages that have no dark hero behind it.
export default function Navbar({ forceSolid = false }) {
  const { pathname } = useLocation();
  const home = pathname === '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [svc, setSvc] = useState(false);
  const bar = useRef(null);
  const dd = useRef(null);
  useEffect(() => {
    let ticking = false;
    const run = () => {
      ticking = false;
      setScrolled(window.scrollY > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
      if (!home) return;
      let cur = 'home';
      for (const l of navLinks) { if (!l.href.startsWith('#')) continue; const el = document.getElementById(l.href.slice(1)); if (el && el.getBoundingClientRect().top <= 140) cur = l.href.slice(1); }
      setActive(cur);
    };
    const on = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
    run(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [home]);
  useEffect(() => { setSvc(false); setOpen(false); }, [pathname]);
  useEffect(() => { // close the Services menu on outside click or Esc
    const off = e => { if (dd.current && !dd.current.contains(e.target)) setSvc(false); };
    const esc = e => e.key === 'Escape' && setSvc(false);
    document.addEventListener('pointerdown', off); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', off); document.removeEventListener('keydown', esc); };
  }, []);
  const close = () => { setOpen(false); setSvc(false); };
  const desktop = () => matchMedia('(min-width:901px)').matches;
  const onTool = modules.some(m => pathname === toolPath[m.key]);
  const item = l => {
    const route = !l.href.startsWith('#');
    if (route) return <Link key={l.href} to={l.href} className={pathname === l.href ? 'active' : ''} onClick={close}>{l.label}</Link>;
    const cls = home && active === l.href.slice(1) ? 'active' : '';
    if (home || l.href === '#contact') return <a key={l.href} href={l.href} className={cls} onClick={close}>{l.label}</a>;
    return <Link key={l.href} to={{ pathname: '/', hash: l.href }} onClick={close}>{l.label}</Link>;
  };
  return (<>
    <header className={`nav ${home ? '' : 'inner'} ${forceSolid || scrolled || open ? 'solid' : ''}`}>
      <div className="nav-in">
        <Link to="/" className="logo"><span className="logo-mark"><GraduationCap size={20} /></span><span className="logo-t"> Campus Connect</span></Link>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {home ? <>
            {navLinks.map(item)}
            <div ref={dd} className={`svc-dd ${svc ? 'open' : ''} ${onTool ? 'active' : ''}`} onMouseEnter={() => desktop() && setSvc(true)} onMouseLeave={() => desktop() && setSvc(false)}>
              <button type="button" className="svc-btn" aria-expanded={svc} onClick={() => setSvc(o => !o)}>Services <ChevronDown size={14} /></button>
              <div className="svc-menu"><div className="svc-card">
                {modules.map(m => (
                  <Link key={m.key} to={toolPath[m.key]} style={{ '--c': `var(--${m.color})` }} onClick={close}>
                    <span className="si"><m.icon size={18} /></span><span><b>{m.title}</b><small>{m.short}</small></span>
                  </Link>
                ))}
              </div></div>
            </div>
          </> : <>
            <Link to="/" onClick={close}>Home</Link>
            {modules.map(m => (
              <Link key={m.key} to={toolPath[m.key]} className={pathname === toolPath[m.key] ? 'active' : ''} onClick={close}><m.icon size={15} /><span>{m.title}</span></Link>
            ))}
          </>}
          <Auth className="m" onGo={close} />
        </nav>
        <div className="nav-right">
          <Auth className="d" />
          <ThemeToggle />
          <button className="icon-btn menu" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
      <span ref={bar} className="nav-bar" />
    </header>
    <a href="#home" className={`totop ${scrolled ? 'show' : ''}`} aria-label="Back to top" onClick={e => { if (!home) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}><ArrowUp size={18} /></a>
  </>);
}
