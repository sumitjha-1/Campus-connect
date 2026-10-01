import { Laptop, Wallet, CreditCard, KeyRound, BookOpen, Shirt, CupSoda, Package } from 'lucide-react';

// Categories: icon + colour token (see global.css) for every item.
export const CATEGORIES = [
  { k: 'electronics', label: 'Electronics', Icon: Laptop, color: 'blue' },
  { k: 'wallet', label: 'Wallet & bags', Icon: Wallet, color: 'amber' },
  { k: 'id', label: 'ID & cards', Icon: CreditCard, color: 'violet' },
  { k: 'keys', label: 'Keys', Icon: KeyRound, color: 'rose' },
  { k: 'books', label: 'Books & notes', Icon: BookOpen, color: 'green' },
  { k: 'clothing', label: 'Clothing', Icon: Shirt, color: 'violet' },
  { k: 'bottle', label: 'Bottles', Icon: CupSoda, color: 'accent' },
  { k: 'other', label: 'Other', Icon: Package, color: 'blue' },
];
export const catOf = k => CATEGORIES.find(c => c.k === k) || CATEGORIES[CATEGORIES.length - 1];

// ---------------------------------------------------------------------------
// GBU on the map. The campus centre is real (Wikipedia: 28.4215 N, 77.5259 E).
// The building positions below are APPROXIMATE, spread around that centre.
// To make them exact, open  /lf-calibrate  in your browser, click each building
// on the map, press "Copy", and paste the result over POS below.
// ---------------------------------------------------------------------------
export const GBU_CENTER = [28.4215, 77.5259];

const POS = {
  library: [28.41973, 77.52618],
  buddha: [28.41881, 77.52363],
  sbsc: [28.42032, 77.52324],
  sohss: [28.42379, 77.52574],
  ict: [28.41678, 77.5233],
  soe: [28.4203, 77.52421],
  som: [28.41729, 77.52216],
  sobt: [28.41931, 77.52134],
  soljg: [28.41738, 77.52442],
  sovsas: [28.42075, 77.52309],
  academic: [28.4217, 77.525],
  admin: [28.41579, 77.52097],
  auditorium: [28.4195, 77.5244],
  cafeteria: [28.4211, 77.5273],
  sports: [28.42531, 77.52848],
  ghostel: [28.42142, 77.52089],
  hostel: [28.4236, 77.52352],
  health: [28.4192, 77.5283],
  bank: [28.42791, 77.5284],
  gate: [28.41651, 77.51743],
  parking: [28.41589, 77.5191],
};
// id, name, words the AI assistant understands. Order matters: "girls hostel" must come before "hostel".
const NAMES = [
  ['library', 'Central Library', ['library']],
  ['buddha', 'Buddha Statue & Lake', ['buddha', 'statue', 'lake']],
  ['sbsc', 'School of Buddhist Studies', ['buddhist', 'sbsc']],
  ['sohss', 'School of Humanities', ['humanities', 'sohss']],
  ['ict', 'School of ICT', ['ict', 'school of ict']],
  ['soe', 'School of Engineering', ['engineering', 'soe']],
  ['som', 'School of Management', ['management', 'som']],
  ['sobt', 'School of Biotechnology', ['biotech', 'biotechnology', 'sobt']],
  ['soljg', 'School of Law', ['law', 'soljg']],
  ['sovsas', 'School of Vocational Studies', ['vocational', 'sovsas']],
  ['academic', 'Academic Block', ['academic', 'classroom', 'class']],
  ['admin', 'Administrative Block', ['admin', 'administration', 'office', 'registrar']],
  ['auditorium', 'Auditorium', ['auditorium']],
  ['cafeteria', 'Cafeteria', ['cafeteria', 'canteen', 'food']],
  ['sports', 'Sports Complex', ['sports', 'ground', 'basketball', 'stadium']],
  ['ghostel', 'Girls Hostels', ['girls hostel', 'girls']],
  ['hostel', 'Boys Hostels', ['hostel', 'boys']],
  ['health', 'Health Centre', ['health', 'dispensary', 'medical']],
  ['bank', 'Bank & ATM', ['bank', 'atm']],
  ['gate', 'Main Gate', ['gate', 'entrance']],
  ['parking', 'Parking Area', ['parking']],
];
export const PLACES = NAMES.map(([id, name, keys]) => ({ id, name, keys, lat: POS[id][0], lng: POS[id][1] }));

// Old saved reports (no pin yet) fall back to the centre of their place.
export const withPos = x => {
  if (x.lat != null) return x;
  const p = PLACES.find(p => p.id === x.place);
  return p ? { ...x, lat: p.lat, lng: p.lng } : x;
};

// Sample reports so the page is never empty. Times are relative to "now".
const H = n => new Date(Date.now() - n * 36e5).toISOString();
const S = (id, type, title, cat, place, hrs, desc, tags, extra = {}) =>
  ({ id, type, title, cat, place, at: H(hrs), desc, tags, reward: '', contact: '', status: 'open', photo: null, ...extra });

const raw = [
  S('s9', 'found', 'Scientific calculator', 'electronics', 'academic', 8, 'Casio scientific calculator left on a desk.', ['Calculator', 'Casio']),
  S('s1', 'lost', 'MacBook Air M1', 'electronics', 'library', 5, 'Space grey laptop with charger. Small sticker on the lid.', ['Apple', 'Laptop']),
  S('s2', 'found', 'AirPods case', 'electronics', 'ict', 22, 'White earbuds case found near the School of ICT entrance.', ['Apple', 'Earbuds']),
  S('s10', 'lost', 'Bluetooth headphones', 'electronics', 'hostel', 26, 'Over-ear black headphones in a grey pouch.', ['Headphones', 'Black'], { reward: 'A shake' }),
  S('s3', 'lost', 'Brown leather wallet', 'wallet', 'cafeteria', 30, 'Brown wallet with a few cards inside.', ['Wallet', 'Brown'], { reward: 'A treat at the canteen' }),
  S('s11', 'lost', 'Spectacles case', 'other', 'library', 40, 'Dark blue case with prescription glasses.', ['Glasses', 'Case']),
  S('s4', 'found', 'Student ID card', 'id', 'gate', 52, 'GBU ID card found near the main gate. Name starts with A.', ['ID card', 'GBU']),
  S('s5', 'lost', 'Car keys', 'keys', 'parking', 70, 'Black key with a Toyota logo and a small keychain.', ['Keys', 'Toyota']),
  S('s6', 'found', 'Black water bottle', 'bottle', 'sports', 80, 'Black steel bottle found near the basketball court.', ['Bottle', 'Steel']),
  S('s7', 'lost', 'DSA textbook', 'books', 'academic', 96, 'Data Structures and Algorithms book. Lost in a classroom.', ['Book', 'DSA']),
  S('s8', 'found', 'Black hoodie', 'clothing', 'auditorium', 120, 'Black hoodie with a small logo, found after the tech fest.', ['Hoodie', 'Clothing']),
  S('s12', 'found', 'Blue wallet', 'wallet', 'library', 150, 'Returned to its owner.', ['Wallet', 'Blue'], { status: 'returned' }),
  S('s13', 'lost', 'Lab coat', 'clothing', 'soe', 12, 'White lab coat, size M, name written inside the collar.', ['Lab coat', 'White']),
  S('s14', 'found', 'Grey umbrella', 'other', 'sohss', 34, 'Foldable grey umbrella left near the entrance.', ['Umbrella', 'Grey']),
  S('s15', 'lost', 'Pen drive 64 GB', 'electronics', 'som', 18, 'Black SanDisk pen drive with project files.', ['Pen drive', 'SanDisk']),
  S('s16', 'found', 'Spectacles', 'other', 'buddha', 60, 'Black-framed glasses found on a bench by the lake.', ['Glasses', 'Black']),
];

// Spread samples around their building so pins in the same place don't stack.
export const seedItems = raw.map((x, i) => {
  const p = PLACES.find(p => p.id === x.place); const a = i * 2.4;
  return { ...x, lat: p.lat + Math.sin(a) * 0.00022, lng: p.lng + Math.cos(a) * 0.00028 };
});