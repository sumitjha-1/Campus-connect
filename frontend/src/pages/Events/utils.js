import { toDate } from '../../services/gbu';
export const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
export const fmt = s => { const d = toDate(s); return d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : s; };
export const monthLabel = d => d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
export const daysTo = s => { const d = toDate(s); return d ? Math.round((d - today()) / 864e5) : null; };
export const inDays = n => n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : `In ${n} days`;
export const keyOf = it => it.href + it.date;

// Downloads a calendar file (.ics) that opens in Google, Apple or Outlook calendar.
export function addToCalendar(it) {
  const d = toDate(it.date); if (!d) return;
  const p = x => x.getFullYear() + String(x.getMonth() + 1).padStart(2, '0') + String(x.getDate()).padStart(2, '0');
  const e = new Date(d); e.setDate(e.getDate() + 1);
  const c = t => t.replace(/[,;\n]/g, ' ');
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CampusConnect//EN', 'BEGIN:VEVENT', `UID:${Date.now()}@campusconnect`,
    `DTSTAMP:${p(new Date())}T000000Z`, `DTSTART;VALUE=DATE:${p(d)}`, `DTEND;VALUE=DATE:${p(e)}`,
    `SUMMARY:${c(it.title)}`, `DESCRIPTION:${c(it.org || 'GBU event')} ${it.href}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = 'gbu-event.ics'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
