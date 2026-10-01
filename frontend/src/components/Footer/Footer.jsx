import { Link } from 'react-router-dom';
import { GraduationCap, Instagram, Linkedin, Youtube } from 'lucide-react';
import { navLinks, modules } from '../../data/content';
import { toolPath } from '../../data/tools';
const social = [{ n: 'Instagram', i: Instagram }, { n: 'LinkedIn', i: Linkedin }, { n: 'YouTube', i: Youtube }];
const to = h => (h.startsWith('#') && h !== '#contact' ? { pathname: '/', hash: h } : h);
export default function Footer() {
  return (<footer id="contact" className="footer"><div className="wrap">
    <div className="foot-grid">
      <div className="foot-brand"><div className="logo"><span className="logo-mark"><GraduationCap size={20} /></span> Campus Connect</div>
        <p>All your campus needs in one place.<br />Connect. Discover. Grow Together.</p></div>
      <div><h4>Quick Links</h4>{navLinks.map(l => l.href === '#contact' ? <a key={l.href} href="#contact">{l.label}</a> : <Link key={l.href} to={to(l.href)}>{l.label}</Link>)}</div>
      <div><h4>Features</h4>{modules.map(m => <Link key={m.key} to={toolPath[m.key]}>{m.title}</Link>)}</div>
      <div><h4>Follow Us</h4>{social.map(s => <a key={s.n} href="#" className="soc"><span><s.i size={16} /></span>{s.n}</a>)}</div>
    </div>
    <div className="wordmark" aria-hidden="true">Campus Connect</div>
    <p className="copy">© 2026 Campus Connect. All rights reserved.</p></div></footer>);
}
