import { BookOpen, Laptop, Bike, FlaskConical, Armchair, Shirt, PenTool, Package } from 'lucide-react';

// Categories: icon + colour token (see global.css) + words the AI assistant understands.
export const CATEGORIES = [
  { k: 'books', label: 'Books & notes', Icon: BookOpen, color: 'green', keys: ['book', 'books', 'notes', 'textbook', 'novel'] },
  { k: 'electronics', label: 'Electronics', Icon: Laptop, color: 'blue', keys: ['laptop', 'phone', 'calculator', 'headphone', 'headphones', 'charger', 'arduino', 'electronics', 'fan'] },
  { k: 'cycles', label: 'Cycles', Icon: Bike, color: 'amber', keys: ['cycle', 'bicycle', 'bike', 'scooter'] },
  { k: 'lab', label: 'Lab & drawing', Icon: FlaskConical, color: 'violet', keys: ['lab', 'coat', 'apron', 'drafter', 'drawing'] },
  { k: 'hostel', label: 'Hostel & room', Icon: Armchair, color: 'rose', keys: ['table', 'chair', 'bucket', 'mattress', 'hostel', 'cooler', 'kettle', 'room'] },
  { k: 'clothing', label: 'Clothing', Icon: Shirt, color: 'accent', keys: ['blazer', 'jacket', 'hoodie', 'shirt', 'clothes', 'shoes'] },
  { k: 'stationery', label: 'Stationery', Icon: PenTool, color: 'blue', keys: ['pen', 'pens', 'stationery', 'register', 'sketch'] },
  { k: 'other', label: 'Other', Icon: Package, color: 'violet', keys: [] },
];
export const catOf = k => CATEGORIES.find(c => c.k === k) || CATEGORIES[CATEGORIES.length - 1];
export const CONDITIONS = ['New', 'Like new', 'Good', 'Fair'];

// Sample listings so the page is never empty. Times are relative to "now".
// type: 'sell' = an item for sale, 'want' = a request to buy (price = budget). price 0 = free.
const H = n => new Date(Date.now() - n * 36e5).toISOString();
const P = (name, course) => ({ name, course });
const S = (id, type, title, cat, price, cond, place, hrs, desc, tags, seller, extra = {}) =>
  ({ id, type, title, cat, price, negotiable: false, cond, place, at: H(hrs), desc, tags, seller, contact: '', status: 'open', photo: null, ...extra });

export const seedItems = [
  S('m1', 'sell', 'Engineering Mathematics (B.S. Grewal)', 'books', 250, 'Good', 'library', 6, 'Latest edition, clean pages, a few pencil marks in chapter 4.', ['Maths', 'Textbook'], P('Ankit Rawat', 'B.Tech CSE, 4th year')),
  S('m2', 'sell', 'Hero Sprint cycle, 21 gears', 'cycles', 3000, 'Good', 'hostel', 20, 'Used for one year. New tyres, chain just oiled. Lock included.', ['Cycle', 'Gears'], P('Rohit Kumar', 'B.Tech ME, 4th year'), { negotiable: true }),
  S('m3', 'sell', 'White lab coat, size M', 'lab', 150, 'Like new', 'soe', 9, 'Worn only for one semester. Washed and ironed.', ['Lab coat', 'Size M'], P('Sneha Gupta', 'B.Tech ECE, 3rd year')),
  S('m4', 'sell', 'Casio fx-991EX calculator', 'electronics', 600, 'Like new', 'academic', 14, 'Allowed in exams. Cover and spare battery included.', ['Casio', 'Calculator'], P('Mohit Singh', 'B.Tech IT, 3rd year')),
  S('m5', 'sell', 'Study table with chair', 'hostel', 1800, 'Good', 'hostel', 40, 'Sturdy wooden table and a cushioned chair. Pick up from the hostel.', ['Table', 'Chair'], P('Vikas Sharma', 'M.Tech, 2nd year'), { negotiable: true }),
  S('m6', 'sell', 'Data Structures handwritten notes', 'books', 80, 'Good', 'ict', 26, 'Complete unit-wise notes with solved examples. Photocopy-friendly.', ['DSA', 'Notes'], P('Riya Sharma', 'B.Tech IT, 3rd year')),
  S('m7', 'sell', 'boAt Rockerz wireless headphones', 'electronics', 700, 'Good', 'cafeteria', 30, 'Battery lasts all day. Charging cable included.', ['boAt', 'Headphones'], P('Aman Verma', 'B.Tech CSE, 2nd year'), { negotiable: true }),
  S('m8', 'sell', 'Mini drafter + drawing kit', 'lab', 350, 'Like new', 'soe', 52, 'Used for Engineering Graphics only. Set squares and compass included.', ['Drafter', 'Drawing'], P('Neha Joshi', 'B.Tech ECE, 4th year')),
  S('m9', 'sell', 'Hostel starter set (bucket, mug, hangers)', 'hostel', 0, 'Good', 'hostel', 33, 'Leaving the hostel, giving this away. First come, first served.', ['Free', 'Bucket'], P('Karan Mehta', 'B.Tech CSE, 4th year')),
  S('m10', 'sell', 'Table cooler fan', 'electronics', 900, 'Good', 'ghostel', 70, 'Quiet, three speeds, water tank works fine.', ['Cooler', 'Fan'], P('Pooja Yadav', 'B.Tech BT, 3rd year'), { negotiable: true }),
  S('m11', 'sell', 'Arduino Uno starter kit', 'electronics', 750, 'New', 'ict', 18, 'Sealed kit with breadboard, sensors and jumper wires.', ['Arduino', 'Kit'], P('Dev Malhotra', 'B.Tech ECE, 2nd year')),
  S('m12', 'sell', 'Black formal blazer, size L', 'clothing', 500, 'Good', 'auditorium', 95, 'Worn twice for placement events. Dry cleaned.', ['Blazer', 'Formal'], P('Saurabh Tyagi', 'B.Tech CSE, 4th year')),
  S('m13', 'sell', 'Operating Systems (Galvin)', 'books', 300, 'Good', 'library', 110, 'Sold within a day.', ['OS', 'Textbook'], P('Anjali Singh', 'B.Tech IT, 3rd year'), { status: 'sold' }),
  S('m14', 'want', 'Looking for a cycle for the semester', 'cycles', 2500, '', 'hostel', 12, 'Any working cycle is fine. Can pick it up today.', ['Cycle'], P('Harsh Pandey', 'B.Tech CSE, 1st year'), { negotiable: true }),
  S('m15', 'want', 'Need a scientific calculator', 'electronics', 400, '', 'academic', 5, 'Exam next week. Casio or similar.', ['Calculator'], P('Priya Nair', 'B.Tech IT, 1st year')),
  S('m16', 'want', 'Used laptop for coding', 'electronics', 20000, '', 'ict', 48, 'i5 or Ryzen 5, 8 GB RAM, SSD. Please share the bill if you have it.', ['Laptop', 'Coding'], P('Yash Chauhan', 'B.Tech CSE, 2nd year'), { negotiable: true }),
  S('m17', 'want', 'Previous year papers for DBMS', 'books', 100, '', 'library', 28, 'Last five years if possible. Printed or PDF.', ['DBMS', 'Papers'], P('Isha Tiwari', 'B.Tech IT, 2nd year')),
];
