import { useEffect, useMemo, useState } from 'react';
import { UploadCloud, Sparkles, X, Plus, ArrowUpRight, Linkedin, Search, MapPin, Users, Wand2, SearchX, Copy, Check, FileText, Building2 } from 'lucide-react';
import PageShell from '../../components/PageShell/PageShell';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import { campusImages } from '../../assets/images/campus';
import { JOBS, ALUMNI } from '../../data/jobsData';
import { readResume } from './readResume';
import Story from './Story';
import JobsAssistant from './JobsAssistant';
import { extractSkills, rank, fits, colorOf, jobLink, personLink, ago } from './utils';

const SAMPLE = `Aman Verma, B.Tech CSE, Gautam Buddha University
Skills: HTML, CSS, JavaScript, React, Node.js, MongoDB, Git, Python
Projects: Campus marketplace web app (React + Node), attendance tracker (Python, SQL)
Interests: web development, machine learning`;
const KIND = { referral: 'Referral', internship: 'Internship', job: 'Job' };
const PK = 'cc-alumni-posts';
const loadPosts = () => { try { return JSON.parse(localStorage.getItem(PK)) || []; } catch { return []; } };
const REASONS = [['referral', 'Ask for a referral'], ['advice', 'Career advice'], ['mock', 'Mock interview'], ['resume', 'Resume review'], ['placement', 'Placement tips'], ['hi', 'Just say hi']];
const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

function PostForm({ onClose, onSubmit }) {
  const [f, setF] = useState({ name: '', batch: '', company: '', role: '', kind: 'referral', text: '', skills: '', linkedin: '' });
  const [err, setErr] = useState('');
  const set = (k, v) => { setF(s => ({ ...s, [k]: v })); setErr(''); };
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    const o = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = o; };
  }, [onClose]);
  const submit = e => {
    e.preventDefault();
    if (!f.name.trim() || !f.company.trim() || !f.text.trim()) { setErr('Add your name, company and a short message.'); return; }
    onSubmit({
      id: `u-${Date.now()}`, mine: true, name: f.name.trim(), batch: f.batch.trim() || 'GBU', branch: 'GBU alumnus', company: f.company.trim(), role: f.role.trim() || 'Alumnus',
      kind: f.kind, text: f.text.trim(), skills: extractSkills(`${f.skills} ${f.text}`), linkedin: f.linkedin.trim(), at: new Date().toISOString(),
    });
  };
  return (
    <div className="jb-ov" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form className="jb-form" onSubmit={submit} noValidate role="dialog" aria-modal="true" aria-label="Post an opening">
        <header><div><h3>Post an opening</h3><p>For GBU alumni. Students see it with your LinkedIn link.</p></div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></header>
        <div className="jb-fb">
          <div className="jb-two">
            <label>Your name<input value={f.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Aarav Mehta" /></label>
            <label>Batch<input value={f.batch} onChange={e => set('batch', e.target.value)} placeholder="e.g. 2021" /></label>
          </div>
          <div className="jb-two">
            <label>Company<input value={f.company} onChange={e => set('company', e.target.value)} placeholder="e.g. Paytm" /></label>
            <label>Your role<input value={f.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Software Engineer" /></label>
          </div>
          <div className="jb-kinds" role="group" aria-label="Type of post">
            {Object.entries(KIND).map(([k, l]) => <button type="button" key={k} className={f.kind === k ? 'on' : ''} onClick={() => set('kind', k)}>{l}</button>)}
          </div>
          <label>What are you offering?<textarea rows={3} maxLength={220} value={f.text} onChange={e => set('text', e.target.value)} placeholder="e.g. Web intern roles are open. Send me your GitHub link." /></label>
          <label>Skills needed <small>Separate with commas</small><input value={f.skills} onChange={e => set('skills', e.target.value)} placeholder="React, Node, SQL" /></label>
          <label>Your LinkedIn link <small>Optional</small><input value={f.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://www.linkedin.com/in/…" /></label>
          {err && <p className="jb-err">{err}</p>}
        </div>
        <footer><button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary">Post opening</button></footer>
      </form>
    </div>
  );
}

const Faces = ({ list }) => (
  <span className="jb-faces">{list.slice(0, 3).map(a => <b key={a.id} title={a.name}>{a.name[0]}</b>)}</span>
);

function JobCard({ j, i, ranked, alumni, onCopy }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="jb-card" style={{ '--c': `var(--${colorOf(j.company)})`, '--i': Math.min(i, 8) }}>
      <header>
        <span className="jb-av">{j.company[0]}</span>
        <div className="jb-tt"><h3>{j.title}</h3><span>{j.company}</span></div>
        {ranked && <span className="jb-match-pill" title="Skill match"><b>{j.score}%</b>match</span>}
      </header>
      <ul className="jb-facts">
        <li><MapPin size={13} />{j.loc}</li>
        <li>{j.pay}</li>
        <li className={j.kind}>{j.kind === 'job' ? 'Full-time' : 'Internship'}</li>
        <li className={`src ${j.src.toLowerCase()}`}>{j.src}</li>
      </ul>
      <div className="jb-sk">{j.skills.map(s => <span key={s} className={j.matched?.includes(s) ? 'hit' : ''}>{s}</span>)}</div>
      {ranked && j.missing.length > 0 && <p className="jb-gap">Learn {j.missing.slice(0, 2).join(' and ')} to be a stronger fit.</p>}
      <footer>
        {alumni.length ? <button type="button" className={`jb-al ${open ? 'on' : ''}`} aria-expanded={open} onClick={() => setOpen(o => !o)}><Faces list={alumni} />{alumni.length} GBU {alumni.length === 1 ? 'alumnus' : 'alumni'} here</button> : <span className="jb-noal">No alumni listed yet</span>}
        <a className="btn btn-primary" href={jobLink(j)} target="_blank" rel="noopener noreferrer">Apply<ArrowUpRight size={14} /></a>
      </footer>
      {open && (
        <div className="jb-inl">
          {alumni.map(a => (
            <div className="jb-row" key={a.id}>
              <span className="avatar">{a.name[0]}</span>
              <div><b>{a.name}</b><small>{a.role} · Batch {a.batch}</small></div>
              <button type="button" className="jb-cp" onClick={() => onCopy(a)} aria-label={`Copy referral note for ${a.name}`}><Copy size={13} /></button>
              <a className="jb-li" href={personLink(a)} target="_blank" rel="noopener noreferrer"><Linkedin size={14} />Connect</a>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function AlumCard({ a, i, fit, onCopy }) {
  return (
    <article className="jb-pc" style={{ '--c': `var(--${colorOf(a.company)})`, '--i': Math.min(i, 8) }}>
      <header>
        <span className="avatar">{a.name[0]}</span>
        <div><b>{a.name}</b><small>{a.role} at {a.company}</small><small>Batch {a.batch} · {a.branch}</small></div>
        <em className={a.kind}>{KIND[a.kind]}</em>
      </header>
      <p>{a.text}</p>
      <div className="jb-sk">{a.skills.map(s => <span key={s}>{s}</span>)}</div>
      <footer>
        <small>{ago(a.at)}{fit && <span className="jb-fit">Fits your skills</span>}</small>
        <div className="jb-pa">
          <button type="button" className="jb-cp" onClick={() => onCopy(a)}><Copy size={13} />Referral note</button>
          <a className="jb-li" href={personLink(a)} target="_blank" rel="noopener noreferrer"><Linkedin size={14} />LinkedIn</a>
        </div>
      </footer>
    </article>
  );
}

export default function Jobs() {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [skills, setSkills] = useState([]);
  const [sk, setSk] = useState('');
  const [file, setFile] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [drag, setDrag] = useState(false);
  const [paste, setPaste] = useState(false);
  const [tab, setTab] = useState('jobs');
  const [kind, setKind] = useState('all');
  const [src, setSrc] = useState('all');
  const [q, setQ] = useState('');
  const [more, setMore] = useState(false);
  const [ak, setAk] = useState('all');
  const [reason, setReason] = useState('referral');
  const [cq, setCq] = useState('');
  const [cmore, setCmore] = useState(false);
  const [form, setForm] = useState(false);
  const [posts, setPosts] = useState(loadPosts);
  const [toast, setToast] = useState('');

  const say = m => { setToast(m); setTimeout(() => setToast(''), 3200); };
  const analyse = t => {
    const s = extractSkills(t);
    setSkills(s); setErr(s.length ? '' : 'No skills found. Add them below, one by one.');
    if (s.length) { setTab('jobs'); setTimeout(() => go('jb-feed'), 250); }
  };
  const onFile = async f => {
    if (!f) return;
    setBusy(true); setErr(''); setFile(f.name);
    try { const t = await readResume(f); setText(t.slice(0, 6000)); analyse(t); }
    catch (e) { setFile(''); setErr(e.message?.includes('pdfjs') || e.message?.includes('Failed to fetch dynamically') ? 'PDF reading needs: npm i pdfjs-dist. Or paste your text.' : e.message || 'Could not read that file.'); }
    setBusy(false);
  };
  const addSkill = e => {
    e.preventDefault();
    const v = sk.trim().toLowerCase();
    if (v && !skills.includes(v)) setSkills(s => [...s, v]);
    setSk('');
  };

  const ranked = skills.length > 0;
  const strength = Math.min(100, skills.length * 14);
  const allAlumni = useMemo(() => [...posts, ...ALUMNI], [posts]);
  const at = c => allAlumni.filter(a => a.company.toLowerCase() === c.toLowerCase());
  const needle = q.trim().toLowerCase();

  const list = useMemo(() => {
    const base = ranked ? rank(JOBS, skills).filter(j => j.score > 0) : JOBS;
    return base.filter(j => (kind === 'all' || j.kind === kind) && (src === 'all' || j.src === src)
      && (!needle || `${j.title} ${j.company} ${j.loc} ${j.skills.join(' ')}`.toLowerCase().includes(needle)));
  }, [ranked, skills, kind, src, needle]);
  const shown = more ? list : list.slice(0, 6);

  const people = useMemo(() => allAlumni
    .filter(a => (ak === 'all' || a.kind === ak) && (!needle || `${a.name} ${a.company} ${a.role} ${a.text}`.toLowerCase().includes(needle)))
    .sort((x, y) => (ranked ? Number(fits(y, skills)) - Number(fits(x, skills)) : 0)), [allAlumni, ak, needle, ranked, skills]);

  const post = a => { const n = [a, ...posts]; setPosts(n); try { localStorage.setItem(PK, JSON.stringify(n)); } catch {} setForm(false); setTab('alumni'); setAk('all'); setQ(''); say('Opening posted. Students can see it now.'); };
  const copyNote = a => {
    const note = `Hi ${a.name.split(' ')[0]}, I'm a GBU student interested in opportunities at ${a.company}.${skills.length ? ` My skills: ${skills.slice(0, 6).join(', ')}.` : ''} Could you share advice or refer me? Thank you!`;
    navigator.clipboard?.writeText(note); say('Referral note copied. Paste it in a LinkedIn message.');
  };
  const note = (a, r) => {
    const f = a.name.split(' ')[0], me = `I'm a GBU student${skills.length ? ` skilled in ${skills.slice(0, 5).join(', ')}` : ''}`;
    const ask = { referral: `I'm interested in openings at ${a.company}. Could you refer me or tell me how to apply?`, advice: 'Could I ask you a few questions about building a career in your field?',
      mock: 'Could we do a short mock interview? I would love your feedback.', resume: 'Could you look at my resume for ten minutes and tell me what to fix?',
      placement: 'Could you share how you prepared for placements?', hi: 'I would love to connect and learn from your journey.' }[r];
    return `Hi ${f}, ${me}. ${ask} Thank you!`;
  };
  const connect = a => { navigator.clipboard?.writeText(note(a, reason)); say('Message copied. Paste it when LinkedIn opens.'); };
  const cneedle = cq.trim().toLowerCase();
  const mentors = useMemo(() => { const seen = new Set(); return allAlumni.filter(a => !seen.has(a.name) && seen.add(a.name))
    .filter(a => !cneedle || `${a.name} ${a.company} ${a.role} ${a.branch}`.toLowerCase().includes(cneedle)); }, [allAlumni, cneedle]);
  const jumpJob = j => { setTab('jobs'); setKind('all'); setSrc('all'); setQ(j.title); setTimeout(() => go('jb-feed'), 60); };
  const jumpAlum = a => { setCq(a.company); setTimeout(() => go('jb-connect'), 60); };

  return (
    <PageShell hero>
      <section className="jb-hero">
        <img className="jb-bg" src={campusImages.jobs[theme]} alt="" />
        <div className="wrap">
          <div className="jb-hin">
            <h1>Your next internship is closer than you think.</h1>
            <p>Add your resume once. See openings from LinkedIn and Internshala ranked by fit, and find the GBU seniors already working there.</p>
            <form className="jb-find-hero" role="search" onSubmit={e => { e.preventDefault(); setTab('jobs'); go('jb-feed'); }}>
              <Search size={18} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search a role, company or skill" aria-label="Search openings" />
              <button type="submit">Search</button>
            </form>
            <div className="jb-nums">
              <span><b>{JOBS.length}</b> open roles</span>
              <span><b>{allAlumni.length}</b> alumni posts</span>
              <span><b>{new Set(JOBS.map(j => j.company)).size}</b> companies</span>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap jb-desk">
        <aside className="jb-side" id="jb-match">
          <div className="jb-sc">
            <div className="jb-sh">
              <div><h2>Your profile</h2><p>Read in your browser. Nothing is uploaded.</p></div>
              <span className="jb-ring" style={{ '--p': strength }} aria-label={`Profile strength ${strength}%`}><b>{strength}%</b></span>
            </div>

            <label className={`jb-drop ${drag ? 'drag' : ''}`}
              onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}>
              <span className="jb-dic">{file ? <FileText size={20} /> : <UploadCloud size={20} />}</span>
              <span><b>{busy ? 'Reading your resume…' : file || 'Upload your resume'}</b><small>PDF or .txt, drag it here or click</small></span>
              <input type="file" accept=".pdf,.txt,.md,application/pdf,text/plain" hidden onChange={e => { onFile(e.target.files[0]); e.target.value = ''; }} />
            </label>

            <button type="button" className="jb-link" onClick={() => setPaste(p => !p)} aria-expanded={paste}>{paste ? 'Hide pasted text' : 'Or paste your resume text'}</button>
            {paste && (
              <div className="jb-paste">
                <textarea rows={5} value={text} onChange={e => setText(e.target.value)} placeholder="Skills, projects, courses…" aria-label="Resume text" />
                <button type="button" className="btn btn-primary" disabled={!text.trim()} onClick={() => analyse(text)}><Sparkles size={15} />Find my matches</button>
              </div>
            )}
            {err && <p className="jb-err">{err}</p>}

            <div className="jb-skills">
              <h3>Skills we found</h3>
              {skills.length ? <div className="jb-chips">{skills.map(s => <span key={s}>{s}<button type="button" onClick={() => setSkills(v => v.filter(x => x !== s))} aria-label={`Remove ${s}`}><X size={12} /></button></span>)}</div>
                : <p className="jb-hint">Nothing yet. Upload a resume or add skills below.</p>}
              <form className="jb-add" onSubmit={addSkill}>
                <input value={sk} onChange={e => setSk(e.target.value)} placeholder="Add a skill, like figma" aria-label="Add a skill" />
                <button type="submit" aria-label="Add skill"><Plus size={16} /></button>
              </form>
            </div>
            {!ranked && <button type="button" className="jb-link" onClick={() => { setText(SAMPLE); analyse(SAMPLE); }}><Wand2 size={14} />See how it works with a sample resume</button>}
          </div>
          <Story />
        </aside>

        <section className="jb-main" id="jb-feed">
          <div className="jb-top">
            <div className="jb-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={tab === 'jobs'} className={tab === 'jobs' ? 'on' : ''} onClick={() => setTab('jobs')}><Building2 size={15} />Openings<span>{list.length}</span></button>
              <button type="button" role="tab" aria-selected={tab === 'alumni'} className={tab === 'alumni' ? 'on' : ''} onClick={() => setTab('alumni')}><Users size={15} />Alumni posts<span>{people.length}</span></button>
            </div>
            <label className="jb-find"><Search size={15} /><input value={q} onChange={e => setQ(e.target.value)} placeholder={tab === 'jobs' ? 'Role, company or skill' : 'Name, company or role'} aria-label="Search" />
              {q && <button type="button" onClick={() => setQ('')} aria-label="Clear search"><X size={14} /></button>}</label>
          </div>

          {tab === 'jobs' ? (<>
            <div className="jb-bar">
              <p className="jb-sum">{ranked ? <>Best matches for <b>{skills.length} skills</b>, strongest first</> : 'Add your resume to rank these by fit'}</p>
              <div className="jb-seg" role="group" aria-label="Type">
                {[['all', 'All'], ['internship', 'Internships'], ['job', 'Jobs']].map(([k, l]) => <button type="button" key={k} className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>{l}</button>)}
              </div>
              <select value={src} onChange={e => setSrc(e.target.value)} aria-label="Source">
                <option value="all">All sources</option><option value="LinkedIn">LinkedIn</option><option value="Internshala">Internshala</option>
              </select>
            </div>
            <div className="jb-grid">
              {shown.length ? shown.map((j, i) => <JobCard key={j.id} j={j} i={i} ranked={ranked} alumni={at(j.company)} onCopy={copyNote} />)
                : <div className="jb-empty"><SearchX size={30} /><b>No openings match yet</b><span>Add more skills, clear the search, or change the filters.</span></div>}
            </div>
            {list.length > 6 && <button type="button" className="btn btn-ghost jb-more" onClick={() => setMore(m => !m)}>{more ? 'Show fewer' : `Show all ${list.length} openings`}</button>}
            <p className="src">Sample openings. Apply opens a live search on LinkedIn or Internshala.</p>
          </>) : (<>
            <div className="jb-bar">
              <p className="jb-sum">Seniors from GBU who are hiring or can refer you</p>
              <div className="jb-seg" role="group" aria-label="Type">
                {[['all', 'All'], ['referral', 'Referrals'], ['internship', 'Internships'], ['job', 'Jobs']].map(([k, l]) => <button type="button" key={k} className={ak === k ? 'on' : ''} onClick={() => setAk(k)}>{l}</button>)}
              </div>
              <button type="button" className="btn btn-primary jb-postbtn" onClick={() => setForm(true)}><Plus size={15} />Post an opening</button>
            </div>
            <div className="jb-grid">
              {people.length ? people.map((a, i) => <AlumCard key={a.id} a={a} i={i} fit={ranked && fits(a, skills)} onCopy={copyNote} />)
                : <div className="jb-empty"><SearchX size={30} /><b>No alumni posts here yet</b><span>Clear the search, or be the first to post an opening.</span></div>}
            </div>
            <p className="src">Names and posts are sample data. LinkedIn opens a search for the person.</p>
          </>)}
        </section>
      </div>


      <section className="wrap jb-conn" id="jb-connect">
        <div className="jb-chead"><h2>Connect with GBU alumni</h2><p>Pick why you want to talk. We write the message and open LinkedIn, you just send it.</p></div>
        <div className="jb-reasons" role="group" aria-label="Reason to connect">
          {REASONS.map(([k, l]) => <button type="button" key={k} className={reason === k ? 'on' : ''} aria-pressed={reason === k} onClick={() => setReason(k)}>{l}</button>)}
        </div>
        <div className="jb-cbar">
          <label className="jb-find"><Search size={15} /><input value={cq} onChange={e => setCq(e.target.value)} placeholder="Search by name, company or branch" aria-label="Search alumni" />
            {cq && <button type="button" onClick={() => setCq('')} aria-label="Clear search"><X size={14} /></button>}</label>
          <p className="jb-prev"><b>Your message</b>{note({ name: 'Name', company: 'their company' }, reason)}</p>
        </div>
        <div className="jb-grid mc">
          {(cmore ? mentors : mentors.slice(0, 6)).map((a, i) => (
            <article className="jb-mc" key={a.id} style={{ '--c': `var(--${colorOf(a.company)})`, '--i': Math.min(i, 8) }}>
              <span className="avatar">{a.name[0]}</span>
              <div><b>{a.name}</b><small>{a.role} at {a.company}</small><small>Batch {a.batch} · {a.branch}</small></div>
              <a className="jb-li" href={personLink(a)} target="_blank" rel="noopener noreferrer" onClick={() => connect(a)}><Linkedin size={14} />Message on LinkedIn</a>
            </article>
          ))}
          {!mentors.length && <div className="jb-empty"><SearchX size={30} /><b>No alumni found</b><span>Try another name or company.</span></div>}
        </div>
        {mentors.length > 6 && <button type="button" className="btn btn-ghost jb-more" onClick={() => setCmore(m => !m)}>{cmore ? 'Show fewer' : `Show all ${mentors.length} alumni`}</button>}
        <p className="src">Names are sample data. LinkedIn opens a search for the person.</p>
      </section>

      <JobsAssistant alumni={allAlumni} skills={skills} onJob={jumpJob} onAlum={jumpAlum} />

      {form && <PostForm onClose={() => setForm(false)} onSubmit={post} />}
      {toast && <div className="jb-toast" role="status"><Check size={15} />{toast}</div>}
    </PageShell>
  );
}