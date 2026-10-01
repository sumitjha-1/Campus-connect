import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toDate } from '../../services/gbu';
import { classify } from '../../data/categories';
import { monthLabel, today } from './utils';

const dk = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
// Month grid. Days with events show coloured dots; click a day to see its events.
export default function MonthCalendar({ events, month, setMonth, selected, onSelect }) {
  const map = useMemo(() => { const o = {}; events.forEach(e => { const d = toDate(e.date); if (d) (o[dk(d)] ||= []).push(e); }); return o; }, [events]);
  const first = (month.getDay() + 6) % 7; // week starts Monday
  const n = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: n }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  const step = k => setMonth(new Date(month.getFullYear(), month.getMonth() + k, 1));
  const t = today();
  return (
    <div className="cal">
      <div className="cal-h">
        <b>{monthLabel(month)}</b>
        <div>
          <button type="button" onClick={() => { const d = new Date(); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); onSelect(null); }}>Today</button>
          <button type="button" aria-label="Previous month" onClick={() => step(-1)}><ChevronLeft size={16} /></button>
          <button type="button" aria-label="Next month" onClick={() => step(1)}><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="cal-w">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}</div>
      <div className="cal-g">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const ev = map[dk(d)] || [];
          const cls = ['cal-d', ev.length && 'has', selected && dk(selected) === dk(d) && 'sel', dk(d) === dk(t) && 'now'].filter(Boolean).join(' ');
          return (
            <button key={i} type="button" className={cls} onClick={() => onSelect(selected && dk(selected) === dk(d) ? null : d)} aria-label={`${d.toDateString()}, ${ev.length} events`}>
              <b>{d.getDate()}</b>
              <i>{ev.slice(0, 3).map((e, k) => <u key={k} style={{ background: `var(--${classify(e).color})` }} />)}</i>
            </button>
          );
        })}
      </div>
    </div>
  );
}
