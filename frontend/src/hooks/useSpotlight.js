import { useEffect } from 'react';
// Cursor-follow glow on cards: sets --mx/--my on the hovered card (CSS draws the glow).
export default function useSpotlight() {
  useEffect(() => {
    const on = e => {
      const c = e.target.closest?.('.fcard,.pcard,.tcard,.checks li'); if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, []);
}
