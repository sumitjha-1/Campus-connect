import { Calculator, Car, Footprints, FileText, Users, HandHelping } from 'lucide-react';

// Kinds of help: icon + colour token (see global.css) + words the AI assistant understands.
export const KINDS = [
  { k: 'borrow', label: 'Borrow or lend', short: 'Borrow', Icon: Calculator, color: 'amber', hint: 'Calculator, lab coat, charger', keys: ['borrow', 'lend', 'calculator', 'coat', 'charger', 'drafter', 'lab', 'cable'] },
  { k: 'travel', label: 'Travel partner', short: 'Travel', Icon: Car, color: 'blue', hint: 'Share a taxi and split the fare', keys: ['taxi', 'cab', 'travel', 'trip', 'airport', 'delhi', 'station', 'metro'] },
  { k: 'ride', label: 'Campus lift', short: 'Lift', Icon: Footprints, color: 'rose', hint: 'A lift to Knowledge Park or the gate', keys: ['lift', 'ride', 'drop', 'bike', 'knowledge', 'park', 'pari'] },
  { k: 'notes', label: 'Notes', short: 'Notes', Icon: FileText, color: 'violet', hint: 'Share or find class notes', keys: ['notes', 'pyq', 'papers', 'manual', 'lecture', 'handwritten'] },
  { k: 'study', label: 'Study buddy', short: 'Study', Icon: Users, color: 'green', hint: 'Prepare for an exam together', keys: ['study', 'buddy', 'partner', 'exam', 'prepare', 'group'] },
  { k: 'other', label: 'Something else', short: 'Other', Icon: HandHelping, color: 'accent', hint: 'Any small favour', keys: [] },
];
export const kindOf = k => KINDS.find(c => c.k === k) || KINDS[KINDS.length - 1];
export const isTrip = k => k === 'travel' || k === 'ride';

export const DESTS = ['Knowledge Park', 'Pari Chowk', 'Noida Sector 62', 'Botanical Garden Metro', 'Delhi (Kashmere Gate)', 'New Delhi Station', 'IGI Airport', 'Greater Noida West', 'Somewhere else'];
export const TREATS = ['A chai', 'A cold coffee', 'A shake', 'A samosa', 'Lunch', 'Just thanks'];

// Sample posts so the page is never empty. Times are relative to "now".
// mode: 'need' = asking for help, 'offer' = offering help.
const H = n => new Date(Date.now() - n * 36e5).toISOString();
const F = n => new Date(Date.now() + n * 36e5).toISOString();
const P = (name, course) => ({ name, course });
const S = (id, kind, mode, title, place, hrs, desc, who, extra = {}) =>
  ({ id, kind, mode, title, place, at: H(hrs), desc, who, tags: [], reward: '', urgent: false, contact: '', status: 'open', dest: '', go: '', seats: 0, cost: '', file: '', ...extra });

export const seedItems = [
  S('h1', 'borrow', 'need', 'Need a scientific calculator', 'academic', 1, 'Maths exam tomorrow at 10 AM. Casio fx-991 or similar. I will return it before lunch.', P('Priya Nair', 'B.Tech IT, 1st year'), { urgent: true, reward: 'A chai', tags: ['Calculator'] }),
  S('h2', 'ride', 'need', 'Lift to Knowledge Park', 'gate', 2, 'Need to collect a printout and be back by evening. Happy to pay for the petrol.', P('Harsh Pandey', 'B.Tech CSE, 1st year'), { dest: 'Knowledge Park', go: F(2), seats: 1, reward: 'Petrol money', urgent: true }),
  S('h3', 'travel', 'offer', 'Taxi to Delhi, Kashmere Gate', 'gate', 6, 'Cab already booked for Friday morning. Three seats are free, fare split equally.', P('Aman Verma', 'B.Tech CSE, 2nd year'), { dest: 'Delhi (Kashmere Gate)', go: F(30), seats: 3, cost: 'About ₹250 each' }),
  S('h4', 'travel', 'need', 'Partner for an airport cab', 'gate', 9, 'Flight on Sunday at 6 AM. Looking for one or two people to share the cab.', P('Ankit Rawat', 'B.Tech ME, 4th year'), { dest: 'IGI Airport', go: F(52), seats: 2, cost: 'Split equally' }),
  S('h5', 'notes', 'offer', 'Data Structures unit-wise notes', 'ict', 12, 'Handwritten, 62 pages with solved examples. I can send a scan to anyone who needs it.', P('Riya Sharma', 'B.Tech IT, 3rd year'), { tags: ['DSA', 'Handwritten'], file: 'DSA-notes.pdf' }),
  S('h6', 'notes', 'offer', 'Engineering Maths II solved papers', 'library', 20, 'Last five years of solved question papers, neatly organised by unit.', P('Mohit Singh', 'B.Tech IT, 3rd year'), { tags: ['Maths', 'PYQ'], file: 'Maths-II-PYQ.pdf' }),
  S('h7', 'notes', 'need', 'Notes for DBMS units 3 and 4', 'library', 28, 'Missed two lectures because of a fever. Photos or a scan are both fine.', P('Isha Tiwari', 'B.Tech IT, 2nd year'), { reward: 'A shake', tags: ['DBMS'] }),
  S('h8', 'study', 'need', 'Study partner for Operating Systems', 'library', 15, 'Evenings in the library, around 6 PM. Want to revise deadlocks and scheduling together.', P('Yash Chauhan', 'B.Tech CSE, 2nd year'), { tags: ['OS', 'Exam'] }),
  S('h9', 'borrow', 'need', 'Lab coat for tomorrow’s practical', 'soe', 4, 'Forgot mine at home. Size M or L, I will wash it and return it.', P('Neha Joshi', 'B.Tech ECE, 4th year'), { reward: 'A samosa', urgent: true, tags: ['Lab coat'] }),
  S('h10', 'borrow', 'offer', 'Can lend: drafter and set squares', 'hostel', 30, 'Not using my drawing kit this semester. Message me and collect it from the hostel.', P('Dev Malhotra', 'B.Tech ECE, 2nd year'), { tags: ['Drafter'] }),
  S('h11', 'ride', 'offer', 'Bike to Pari Chowk at 6 PM', 'gate', 5, 'Going on my bike, one seat free. Helmet available.', P('Karan Mehta', 'B.Tech CSE, 4th year'), { dest: 'Pari Chowk', go: F(7), seats: 1 }),
  S('h12', 'other', 'need', 'Help carrying a mattress to the hostel', 'cafeteria', 22, 'Two people for ten minutes. I bought it from the market near the gate.', P('Pooja Yadav', 'B.Tech BT, 3rd year'), { reward: 'A cold coffee' }),
  S('h13', 'borrow', 'need', 'Type-C laptop charger', 'ict', 60, 'Got one from a friend in the next hostel.', P('Saurabh Tyagi', 'B.Tech CSE, 4th year'), { status: 'done' }),
];
