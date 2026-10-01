import { Scale, FlaskConical, Flower2, Languages, Sparkles, Cpu, Briefcase, GraduationCap, Presentation, CalendarDays, Award, IndianRupee, ShieldCheck, Megaphone, FileText, Users, Bell } from 'lucide-react';

// First matching rule wins. Gives every event and notice its own icon, colour and label.
const EVENT = [
  [/moot|\blaw\b|legal|ipr/i, Scale, 'rose', 'Law'],
  [/cancer|biotech|ethology/i, FlaskConical, 'green', 'Life sciences'],
  [/buddh/i, Flower2, 'amber', 'Buddhist studies'],
  [/hindi|vande|literature|aurobindo|hindu|knowledge systems/i, Languages, 'violet', 'Humanities'],
  [/techfest|ignition|cultural|fest/i, Sparkles, 'violet', 'Fest'],
  [/microelectronic|ieee|computing|\bict\b/i, Cpu, 'blue', 'Engineering & ICT'],
  [/gst|management/i, Briefcase, 'amber', 'Management'],
  [/faculty development|fdp|workshop|lecture|training/i, GraduationCap, 'green', 'Workshop & lecture'],
  [/conference|seminar|symposium/i, Presentation, 'blue', 'Conference'],
];
const NOTICE = [
  [/scholarship|scooty|yojana|stipend/i, Award, 'amber', 'Scholarship'],
  [/\bfee|payment|refund/i, IndianRupee, 'green', 'Fees'],
  [/ncc|battalion/i, ShieldCheck, 'rose', 'NCC'],
  [/advisory|warning|alert/i, Megaphone, 'rose', 'Advisory'],
  [/exam|result|date ?sheet/i, FileText, 'blue', 'Exams'],
  [/admission|counselling|registration/i, Users, 'violet', 'Admissions'],
];
export function classify(item) {
  const text = `${item.title} ${item.org || ''}`;
  const rules = item.kind === 'notice' ? NOTICE : EVENT;
  const r = rules.find(([re]) => re.test(text));
  if (r) return { Icon: r[1], color: r[2], label: r[3] };
  return item.kind === 'notice' ? { Icon: Bell, color: 'blue', label: 'Notice' } : { Icon: CalendarDays, color: 'accent', label: 'Event' };
}
