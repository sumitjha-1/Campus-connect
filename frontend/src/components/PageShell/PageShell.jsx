import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

// Shared frame for inner pages: the same navbar and footer as the home page.
// `hero` = the page starts with a dark full-width hero, so the navbar can be transparent at the top.
export default function PageShell({ children, hero = false }) {
  return (<><Navbar forceSolid={!hero} /><main className={hero ? 'pgm' : 'pg'}>{children}</main><Footer /></>);
}
