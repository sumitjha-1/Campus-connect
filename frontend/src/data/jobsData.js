// Sample openings and alumni posts so the page is never empty.
// Replace with API calls (LinkedIn / Internshala feed, alumni database) once the backend exists.
const H = n => new Date(Date.now() - n * 36e5).toISOString();

// kind: 'internship' | 'job'   src: 'LinkedIn' | 'Internshala'
export const JOBS = [
  { id: 'j1', title: 'Web Development Intern', company: 'Paytm', loc: 'Noida', kind: 'internship', src: 'LinkedIn', pay: '₹15,000 / month', skills: ['html', 'css', 'javascript', 'react', 'git'] },
  { id: 'j2', title: 'Data Analyst Intern', company: 'Deloitte', loc: 'Gurugram', kind: 'internship', src: 'Internshala', pay: '₹12,000 / month', skills: ['excel', 'sql', 'power bi', 'data analysis'] },
  { id: 'j3', title: 'Machine Learning Intern', company: 'Samsung R&D', loc: 'Noida', kind: 'internship', src: 'LinkedIn', pay: '₹25,000 / month', skills: ['python', 'machine learning', 'tensorflow', 'pandas'] },
  { id: 'j4', title: 'Software Engineer Trainee', company: 'HCLTech', loc: 'Noida', kind: 'job', src: 'LinkedIn', pay: '₹4.5 LPA', skills: ['java', 'sql', 'git', 'spring'] },
  { id: 'j5', title: 'Embedded Systems Intern', company: 'Bharat Electronics', loc: 'Ghaziabad', kind: 'internship', src: 'Internshala', pay: '₹10,000 / month', skills: ['embedded', 'c++', 'arduino', 'iot', 'matlab'] },
  { id: 'j6', title: 'Graduate Engineer Trainee', company: 'NTPC', loc: 'Greater Noida', kind: 'job', src: 'LinkedIn', pay: '₹7 LPA', skills: ['autocad', 'matlab', 'communication'] },
  { id: 'j7', title: 'UI/UX Design Intern', company: 'Zoho', loc: 'Remote', kind: 'internship', src: 'Internshala', pay: '₹8,000 / month', skills: ['figma', 'ui/ux', 'html', 'css'] },
  { id: 'j8', title: 'Python Developer', company: 'Tech Mahindra', loc: 'Noida', kind: 'job', src: 'LinkedIn', pay: '₹5 LPA', skills: ['python', 'django', 'sql', 'git', 'linux'] },
  { id: 'j9', title: 'Digital Marketing Intern', company: 'Nykaa', loc: 'Remote', kind: 'internship', src: 'Internshala', pay: '₹6,000 / month', skills: ['seo', 'marketing', 'content writing', 'communication'] },
  { id: 'j10', title: 'Cybersecurity Analyst Trainee', company: 'Wipro', loc: 'Noida', kind: 'job', src: 'LinkedIn', pay: '₹4 LPA', skills: ['cybersecurity', 'networking', 'linux', 'python'] },
  { id: 'j11', title: 'Full Stack Intern', company: 'Razorpay', loc: 'Remote', kind: 'internship', src: 'LinkedIn', pay: '₹20,000 / month', skills: ['react', 'node', 'mongodb', 'javascript', 'git'] },
  { id: 'j12', title: 'Finance Intern', company: 'ICICI Securities', loc: 'Delhi', kind: 'internship', src: 'Internshala', pay: '₹8,000 / month', skills: ['finance', 'excel', 'tally', 'communication'] },
];

// kind: 'referral' | 'internship' | 'job'. Names are sample data.
export const ALUMNI = [
  { id: 'a1', name: 'Aarav Mehta', batch: 2021, branch: 'B.Tech CSE', company: 'Paytm', role: 'SDE-2', kind: 'referral', text: 'We are taking web interns this month. Send me your GitHub link and I will refer you.', skills: ['react', 'javascript', 'node'], at: H(5) },
  { id: 'a2', name: 'Priya Nair', batch: 2019, branch: 'B.Tech IT', company: 'Deloitte', role: 'Senior Analyst', kind: 'internship', text: 'An analytics internship is open in Gurugram. Strong Excel and SQL will get you shortlisted.', skills: ['sql', 'excel', 'power bi'], at: H(20) },
  { id: 'a3', name: 'Rohan Gupta', batch: 2020, branch: 'B.Tech ECE', company: 'Samsung R&D', role: 'Engineer', kind: 'referral', text: 'My ML team hires interns every summer. Show me one project and I will pass your resume on.', skills: ['python', 'machine learning'], at: H(30) },
  { id: 'a4', name: 'Sneha Gupta', batch: 2018, branch: 'B.Tech ECE', company: 'Bharat Electronics', role: 'Deputy Engineer', kind: 'internship', text: 'Summer training seats for ECE and ME students. Apply on the BEL portal and mention my name.', skills: ['embedded', 'c++', 'iot'], at: H(52) },
  { id: 'a5', name: 'Karan Mehta', batch: 2022, branch: 'B.Tech CSE', company: 'HCLTech', role: 'Software Engineer', kind: 'job', text: 'Off-campus drive for the 2026 batch. Java and SQL basics are enough to start.', skills: ['java', 'sql', 'git'], at: H(70) },
  { id: 'a6', name: 'Neha Joshi', batch: 2020, branch: 'MBA', company: 'Nykaa', role: 'Marketing Manager', kind: 'internship', text: 'Looking for content and SEO interns, fully remote. Send two writing samples.', skills: ['seo', 'content writing', 'marketing'], at: H(96) },
  { id: 'a7', name: 'Dev Malhotra', batch: 2021, branch: 'B.Tech IT', company: 'Razorpay', role: 'SDE', kind: 'referral', text: 'Full stack intern roles are open. I can refer you if you have a deployed project.', skills: ['react', 'node', 'mongodb'], at: H(110) },
  { id: 'a8', name: 'Isha Tiwari', batch: 2017, branch: 'B.Tech CSE', company: 'Wipro', role: 'Tech Lead', kind: 'job', text: 'Our security team is hiring trainees. Networking and Linux basics matter most.', skills: ['cybersecurity', 'linux', 'python'], at: H(140) },
  { id: 'a9', name: 'Saurabh Tyagi', batch: 2019, branch: 'B.Tech CSE', company: 'Zoho', role: 'Product Designer', kind: 'internship', text: 'Design internship open. Share a Figma link with two case studies.', skills: ['figma', 'ui/ux'], at: H(160) },
];
