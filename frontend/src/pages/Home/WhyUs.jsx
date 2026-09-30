import { Layers } from 'lucide-react';
import Section from '../../components/Section/Section';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import { campusImages } from '../../assets/images/campus';
import { benefits } from '../../data/content';

const colors = ['rose', 'amber', 'green', 'blue'];
const shape = ['wide', '', '', 'wide']; // bento sizes

export default function WhyUs() {
  const { theme } = useTheme();
  return (
    <Section className="tint-mint">
      <div className="head center">
        <p className="eyebrow">Why CampusConnect</p>
        <h2>What students get out of it</h2>
        <p className="body">Less searching, fewer lost things, more people to ask.</p>
      </div>
      <div className="bento stagger">
        <div className="tile photo">
          <img src={campusImages.dome[theme]} alt="The dome at Gautam Buddha University" loading="lazy" />
          <div className="cap"><span className="chip-live"><i />Made for GBU</span><h3>A community that stays<br />inside the campus gates.</h3></div>
        </div>
        {benefits.map((b, i) => (
          <div className={`tile ${shape[i]}`} style={{ '--c': `var(--${colors[i]})` }} key={b.title}>
            <span className="ti"><b.icon size={22} /></span>
            <h3>{b.title}</h3><p>{b.desc}</p>
          </div>
        ))}
        <div className="tile wide stat">
          <span className="ti"><Layers size={22} /></span>
          <div className="big"><b>5</b> tools <b>1</b> login</div>
          <p>Lost &amp; found, marketplace, jobs and alumni, campus assistance and events, all on one verified account.</p>
        </div>
      </div>
    </Section>
  );
}