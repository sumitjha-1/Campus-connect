import { UserPlus, Compass, MessagesSquare, BellRing } from 'lucide-react';
import Section from '../../components/Section/Section';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import { campusImages } from '../../assets/images/campus';
import { steps } from '../../data/content';

const icons = [UserPlus, Compass, MessagesSquare, BellRing];
const colors = ['blue', 'green', 'amber', 'violet'];

export default function HowItWorks() {
  const { theme } = useTheme();
  return (
    <Section id="how" className="tint-mint">
      <div className="how">
        <div className="arch">
          <img src={campusImages.aerial[theme]} alt="Aerial view of the GBU campus" loading="lazy" />
          <span className="fchip chip-c">Your whole campus, one account</span>
        </div>
        <div>
          <p className="eyebrow">How it works</p>
          <h2>From sign-up to first match</h2>
          <p className="body">Four steps, and the first one is the only one that asks anything of you.</p>
          <ol className="path">
            {steps.map((s, i) => { const I = icons[i]; return (
              <li key={s.title} style={{ '--c': `var(--${colors[i]})` }}>
                <span className="num">{i + 1}</span>
                <div className="pstep">
                  <span className="stag"><I size={13} />{s.tag}</span>
                  <h3>{s.title}</h3><p>{s.desc}</p>
                </div>
              </li>); })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
