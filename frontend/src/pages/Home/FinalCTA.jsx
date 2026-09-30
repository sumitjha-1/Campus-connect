import { ArrowRight } from 'lucide-react';
import Section from '../../components/Section/Section';
import Button from '../../components/Button/Button';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import { campusImages } from '../../assets/images/campus';

export default function FinalCTA() {
  const { theme } = useTheme();
  const img = theme === 'dark' ? campusImages.heroDark : campusImages.heroLight;
  return (
    <Section>
      <div className="cta" style={{ backgroundImage: `url(${img})` }}>
        <div className="cta-in">
          <div><h2>Your campus is already talking. Join the conversation.</h2><p>Sign up with your university email, upload your student ID, and you're in once it's verified.</p></div>
          <Button to="/register">Create your account <ArrowRight size={16} /></Button>
        </div>
      </div>
    </Section>
  );
}