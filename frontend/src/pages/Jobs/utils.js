export { ago } from '../LostFound/utils';

// Skills the matcher can spot in a resume. Add more any time.
export const SKILLS = [
  'html', 'css', 'javascript', 'typescript', 'react', 'next.js', 'node', 'express', 'mongodb', 'sql', 'mysql', 'postgresql',
  'python', 'django', 'flask', 'pandas', 'numpy', 'machine learning', 'deep learning', 'tensorflow', 'data analysis',
  'java', 'spring', 'c++', 'c', 'php', 'flutter', 'android', 'git', 'docker', 'aws', 'linux', 'networking', 'cybersecurity',
  'excel', 'power bi', 'tableau', 'figma', 'ui/ux', 'embedded', 'arduino', 'iot', 'matlab', 'autocad', 'solidworks', 'vlsi',
  'seo', 'marketing', 'content writing', 'communication', 'finance', 'tally',
];
const ALIAS = { js: 'javascript', reactjs: 'react', 'react.js': 'react', nodejs: 'node', 'node.js': 'node', ml: 'machine learning', 'power-bi': 'power bi', powerbi: 'power bi', ux: 'ui/ux', ui: 'ui/ux', mern: 'react', postgres: 'postgresql' };

const isWord = c => /[a-z0-9]/.test(c || '');
function has(text, key) {
  let i = text.indexOf(key);
  while (i !== -1) {
    if (!isWord(text[i - 1]) && !isWord(text[i + key.length])) return true;
    i = text.indexOf(key, i + 1);
  }
  return false;
}

export function extractSkills(text) {
  const t = text.toLowerCase();
  const out = new Set(SKILLS.filter(s => has(t, s)));
  Object.entries(ALIAS).forEach(([a, s]) => { if (has(t, a)) out.add(s); });
  return [...out];
}

// Adds score (0-100), matched and missing skills to each job, best first.
export function rank(jobs, skills) {
  const mine = new Set(skills);
  return jobs
    .map(j => {
      const matched = j.skills.filter(s => mine.has(s));
      return { ...j, matched, missing: j.skills.filter(s => !mine.has(s)), score: Math.round((100 * matched.length) / j.skills.length) };
    })
    .sort((a, b) => b.score - a.score);
}

export const fits = (item, skills) => item.skills.some(s => skills.includes(s));

// Pretty colour per company, stable between renders.
const COLORS = ['blue', 'green', 'amber', 'rose', 'violet', 'accent'];
export const colorOf = name => COLORS[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % COLORS.length];

// Links: each opens the real site search, so they work today without a backend.
const enc = encodeURIComponent;
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const jobLink = j => j.src === 'LinkedIn'
  ? `https://www.linkedin.com/jobs/search/?keywords=${enc(`${j.title} ${j.company}`)}`
  : `https://internshala.com/${j.kind === 'job' ? 'jobs' : 'internships'}/keywords-${slug(j.title.replace(/intern(ship)?/i, ''))}`;
export const personLink = a => a.linkedin || `https://www.linkedin.com/search/results/people/?keywords=${enc(`${a.name} Gautam Buddha University`)}`;
