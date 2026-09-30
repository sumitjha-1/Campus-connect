import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext/ThemeContext';

// Sliding switch: the knob sits on the sun in light mode and on the moon in dark mode.
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';
  return (
    <button type="button" role="switch" aria-checked={dark} aria-label="Dark mode" className={`tswitch ${dark ? 'is-dark' : ''}`} onClick={toggleTheme}>
      <i className="knob" />
      <Sun size={15} /><Moon size={15} />
    </button>
  );
}