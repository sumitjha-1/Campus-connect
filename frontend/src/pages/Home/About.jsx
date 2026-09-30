import { Sparkles, ShieldCheck, Globe, Gift } from 'lucide-react';
import Section from '../../components/Section/Section';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import { campusImages } from '../../assets/images/campus';

const pillars = [
  { icon: ShieldCheck, color: 'green', title: 'Verified by your student ID', text: 'AI checks every sign-up against a university or student ID, so the person on the other side is always a GBU student.' },
  { icon: Globe, color: 'blue', title: 'Connected to real sources', text: 'Events come from the official GBU website. Jobs and internships come from LinkedIn and Internshala, matched with our alumni records.' },
  { icon: Sparkles, color: 'violet', title: 'AI does the matching', text: 'Describe a lost wallet or upload a photo and the website looks for a matching found post. Search and recommendations learn what you need.' },
  { icon: Gift, color: 'rose', title: 'Rewards for honesty', text: 'Lost something important? Attach a reward, like a shake or a treat, and whoever finds it gets thanked properly.' },
];

export default function About() {
  const { theme } = useTheme();
  return (
    <Section id="about" className="tint-a">
      <div className="about">
        <div className="about-img">
          <img src={campusImages.gate[theme]} alt="Gautam Buddha University main building" loading="lazy" />
          <span className="fchip chip-a"><ShieldCheck size={16} />GBU students only</span>
          <span className="fchip chip-b"><Sparkles size={16} />Match found: blue wallet</span>
        </div>
        <div>
          <p className="eyebrow">About CampusConnect</p>
          <h2>The website GBU students were missing</h2>
          <p className="body">Campus life already runs on favours, second-hand deals and word of mouth. CampusConnect is one website that gives all of it a home, open only to GBU students and backed by AI.</p>
          <ul className="plist">
            {pillars.map(p => (
              <li className="pitem" key={p.title} style={{ '--c': `var(--${p.color})` }}>
                <span className="pi"><p.icon size={20} /></span>
                <div><b>{p.title}</b><small>{p.text}</small></div>
              </li>
            ))}
          </ul>
          <div className="sources">Pulls from <span>GBU website</span><span>LinkedIn</span><span>Internshala</span></div>
        </div>
      </div>
    </Section>
  );
}