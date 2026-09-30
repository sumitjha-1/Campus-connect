import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ChatBot from '../../components/ChatBot/ChatBot';
import Hero from './Hero'; import Features from './Features'; import About from './About'; import Solution from './Solution';
import HowItWorks from './HowItWorks'; import WhyUs from './WhyUs'; import Testimonials from './Testimonials'; import FinalCTA from './FinalCTA';
export default function Home() {
  return (<><Navbar /><main><Hero /><Features /><About /><Solution /><HowItWorks /><WhyUs /><Testimonials /><FinalCTA /></main><Footer /><ChatBot /></>);
}
