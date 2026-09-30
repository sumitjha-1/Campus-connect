import { ArrowRight } from 'lucide-react';
export default function FeatureCard({ icon: Icon, title, desc, color, href = '#solution' }) {
  return (<a href={href} className="fcard" style={{ '--c': `var(--${color})` }}>
    <span className="fcard-icon"><Icon size={22} /></span>
    <span className="fcard-arrow"><ArrowRight size={15} /></span>
    <span><h3>{title}</h3><p>{desc}</p></span></a>);
}
