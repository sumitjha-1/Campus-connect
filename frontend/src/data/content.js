import { Calendar, Search, Store, HandHelping, Briefcase, Gift, Users } from 'lucide-react';

export const navLinks = [
  { label: 'Home', href: '#home' }, { label: 'About Us', href: '#about' }, { label: 'Solution', href: '#solution' },
  { label: 'Testimony', href: '#testimony' }, { label: 'Contact Us', href: '#contact' }];

// `short` = one-liner on the top cards; `desc` = the fuller line in the Solution tabs.
export const modules = [
  { key: 'lost', short: 'Find it, or return it.', title: 'Lost & Found', desc: 'Report a lost or found item. Offer a reward, like a shake or a treat.', icon: Search, color: 'rose' },
  { key: 'market', short: 'Buy and sell with students.', title: 'Marketplace', desc: 'Buy and sell between students, on campus, with people you can trust.', icon: Store, color: 'amber' },
  { key: 'alumni', short: 'Openings, with alumni insight.', title: 'Jobs & Alumni', desc: 'Internships and jobs, with GBU alumni already working at the company.', icon: Briefcase, color: 'accent' },
  { key: 'help', short: 'Ask, and a student helps.', title: 'Campus Assistance', desc: 'Borrow a calculator, find a travel partner, get a study buddy.', icon: HandHelping, color: 'green' },
  { key: 'events', short: 'Never miss what is on.', title: 'Events', desc: 'Upcoming and ongoing GBU events, pulled from the official website.', icon: Calendar, color: 'blue' }];

export const stats = [
  { big: '5 platforms', label: 'merged into one website' }, { big: 'AI-assisted', label: 'matching and search' }, { big: 'ID-verified', label: 'students only' }];

export const steps = [
  { title: 'Verify you are a student', tag: 'One-time check', desc: 'Sign up with your university email and student ID. AI checks the ID so only real GBU students get in.' },
  { title: 'Find what you need', tag: 'Five tools, one feed', desc: 'Search events, listings, jobs and requests in one place. Suggestions get better as you use it.' },
  { title: 'Post, reply or claim', tag: 'Direct and simple', desc: 'List an item, report something lost, ask for help or message an alumnus. Every account behind a post is verified.' },
  { title: 'Let the matches come to you', tag: 'Powered by AI', desc: 'When a found item fits your lost one, or a job has a GBU alumnus behind it, you get a notification.' }];

export const benefits = [
  { title: 'Get things back', desc: 'Lost something important? Offer a reward, like a shake or a treat, and thank the person who returns it.', icon: Gift },
  { title: 'Spend less', desc: 'Pick up books, cycles and lab gear second-hand from seniors instead of buying new.', icon: Store },
  { title: 'Get a head start', desc: 'Walk into an application knowing which GBU alumni already work there.', icon: Users },
  { title: 'Never miss out', desc: 'Events, exam-week favours and trip partners reach you before the moment passes.', icon: Calendar }];

export const testimonials = [
  { quote: 'I needed a scientific calculator an hour before my maths exam. Someone from the next hostel lent me theirs.', name: 'Riya Sharma', course: 'B.Tech IT, 3rd year' },
  { quote: 'I lost my wallet on Monday and had it back by evening. The reward went to the guy who found it, and we ended up having chai.', name: 'Aman Verma', course: 'B.Tech CSE, 2nd year' },
  { quote: 'I asked the alumni network about placements and a senior from my own department replied that night.', name: 'Neha Joshi', course: 'B.Tech ECE, 4th year' }];