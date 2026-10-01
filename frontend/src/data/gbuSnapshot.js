// Saved copy of gbu.ac.in (taken 1 Oct 2026). Shown only when the live fetch fails.
export const SNAPSHOT_DATE = '1 Oct 2026';
const E = 'https://www.gbu.ac.in/page/EventDetail/';
const N = 'https://www.gbu.ac.in/page/notices';
export const snapshotEvents = [
  ['31-10-2026', '5th P.N. Mathur Memorial National Moot Court Competition 2026 (31 Oct - 1 Nov)', 1777, 'School of Law, Justice and Governance'],
  ['29-10-2026', '21st International Conference on Emerging Frontiers in Cancer Research (29-31 Oct)', 1783, 'School of Biotechnology'],
  ['29-09-2026', 'Three Day International Conference on Buddhism and Scientific Temper in the Contemporary World', 1782, 'School of Buddhist Studies and Civilization'],
  ['22-09-2026', 'One day National Seminar on "150 Years of Vande Mataram"', 1781, 'SOHSS'],
  ['18-09-2026', 'Report on Guest Lecture on IPR', 1784, 'School of Law, Justice and Governance'],
  ['17-09-2026', 'Invited Lecture on "Sri Aurobindo and English Literature"', 1779, 'SOHSS'],
  ['14-09-2026', 'Hindi Diwas 2026', 1780, 'SOHSS'],
  ['07-09-2026', 'One Week Faculty Development Programme on Materials and Devices for Energy Applications', 1778, 'SOVSAS'],
  ['10-08-2026', '59th International Conference on Applied Ethology', 1774, 'School of Biotechnology'],
  ['24-07-2026', 'Three-Day International Conference on Indian Knowledge Systems', 1775, 'Center for Hindu Studies, SoHSS'],
  ['24-04-2026', '13th International Conference on Microelectronics Circuits and Systems "MICRO 2026"', 1768, 'School of ICT'],
  ['06-04-2026', 'IgNITion TechFest 2026', 1756, 'School of ICT'],
  ['26-03-2026', 'National Conference on Next Generation GST and Inclusive Growth (NGGIG-2026)', 1769, 'School of Management'],
  ['12-02-2026', '2nd IEEE International Conference on Cognitive Computing in Engineering (IC3ECSBHI-2026)', 1762, 'SOE'],
].map(([date, title, id, org]) => ({ date, title, href: E + id, org }));
export const snapshotNotices = [
  ['18-09-2026', "Advisory on Events and use of the University's Name and Identity"],
  ['17-09-2026', 'Uttar Pradesh Rani Laxmi Bai Scooty Yojana'],
  ['17-09-2026', 'Important Notice for UP Scholarship'],
  ['16-09-2026', 'Notice for Senior Wing - 31 UP Girls Battalion NCC Greater Noida'],
  ['16-09-2026', 'Fee submission deadline for Academic Session 2026-27 (Monsoon Semester) extended to 30 September 2026'],
].map(([date, title]) => ({ date, title, href: N, org: '' }));
