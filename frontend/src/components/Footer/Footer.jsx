import { GraduationCap, Instagram, Linkedin, Youtube } from 'lucide-react';
import { navLinks, modules } from '../../data/content';
const social = [{ n: 'Instagram', i: Instagram }, { n: 'LinkedIn', i: Linkedin }, { n: 'YouTube', i: Youtube }];
export default function Footer() {
  return (<footer id="contact" className="footer"><div className="wrap">
    <div className="foot-grid">
      <div className="foot-brand"><div className="logo"><span className="logo-mark"><GraduationCap size={20} /></span> Campus Connect</div>
        <p>All your campus needs in one place.<br />Connect. Discover. Grow Together.</p></div>
      <div><h4>Quick Links</h4>{navLinks.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}</div>
      <div><h4>Features</h4>{modules.map(m => <a key={m.key} href="#solution">{m.title}</a>)}</div>
      <div><h4>Follow Us</h4>{social.map(s => <a key={s.n} href="#" className="soc"><span><s.i size={16} /></span>{s.n}</a>)}</div>
    </div>
    <div className="wordmark" aria-hidden="true">Campus Connect</div>
    <p className="copy">© 2026 Campus Connect. All rights reserved.</p></div></footer>);
}
