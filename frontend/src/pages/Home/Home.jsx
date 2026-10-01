import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ChatBot from '../../components/ChatBot/ChatBot';
import Hero from './Hero'; import Features from './Features'; import About from './About'; import Solution from './Solution';
import HowItWorks from './HowItWorks'; import WhyUs from './WhyUs'; import Testimonials from './Testimonials'; import FinalCTA from './FinalCTA';
export default function Home() {
  const { hash } = useLocation();
  // arriving from another page with #section in the link: scroll there
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 80);
    return () => clearTimeout(t);
  }, [hash]);
  return (<><Navbar /><main><Hero /><Features /><About /><Solution /><HowItWorks /><WhyUs /><Testimonials /><FinalCTA /></main><Footer /><ChatBot /></>);
}
