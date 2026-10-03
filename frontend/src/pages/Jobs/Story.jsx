import { useEffect, useState } from 'react';

const STEPS = [
  { t: 'Still no internship?', d: 'Applications go unanswered and everyone around you seems to be placed already.', k: '0 replies' },
  { t: 'Relax, a senior is on the way.', d: 'Upload your resume. We read your skills, match real openings and show the GBU alumni inside those companies.', k: '92% match' },
  { t: 'Found, together.', d: 'An opening that fits you, and a senior who can refer you. Career tension gone.', k: '1 offer' },
];
const CONFETTI = ['#fbbf24', '#f472b6', '#34d399', '#60a5fa', '#a78bfa'];
const CHIPS = [['React', 0], ['Python', 1], ['SQL', 2]];

const Bubble = ({ cls, x, y, w, h, tail, lines }) => (
  <g className={cls}>
    <rect x={x} y={y} width={w} height={h} rx="14" fill="#fff" />
    <path d={tail} fill="#fff" />
    {lines.map((l, i) => (
      <text key={i} x={x + w / 2} y={y + h / 2 + (lines.length === 1 ? 5 : i * 17 - 4)} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1c2540" fontFamily="DM Sans, sans-serif">{l}</text>
    ))}
  </g>
);

// A student, a worried cloud, a GBU senior robot, a resume being scanned for skills, and a happy ending.
// Auto-plays, click a step to jump, hover to pause, move the mouse for a little depth.
export default function Story() {
  const [s, setS] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (hold || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setS(v => (v + 1) % 3), 5200);
    return () => clearTimeout(t);
  }, [s, hold]);
  const depth = e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3)); };

  return (
    <section className="jb-story" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <div className="jb-stage" data-s={s} onMouseMove={depth}>
        <svg viewBox="110 24 460 316" role="img" aria-label="A student without an internship uploads a resume, gets matched by a GBU senior and finds an offer">
          <defs>
            <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f8d2ae" /><stop offset="1" stopColor="#e3ac80" /></linearGradient>
            <linearGradient id="skin2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e9b88f" /><stop offset="1" stopColor="#c88c63" /></linearGradient>
            <linearGradient id="shirt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4f80ff" /><stop offset="1" stopColor="#2f58d4" /></linearGradient>
            <linearGradient id="gown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#25b88c" /><stop offset="1" stopColor="#157a5d" /></linearGradient>
          </defs>
          <rect className="sky" width="640" height="340" />
          <g className="v2" transform="translate(540 54)">
            <g className="rays">{Array.from({ length: 8 }, (_, i) => <line key={i} x1="0" y1="-32" x2="0" y2="-44" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" transform={`rotate(${i * 45})`} />)}</g>
            <circle r="22" fill="#fbbf24" />
          </g>

          {/* campus skyline: drifts slightly with the mouse */}
          <g className="skyline">
            <rect x="300" y="226" width="70" height="62" rx="4" /><path d="M308 226 A27 27 0 0 1 362 226Z" /><rect x="333" y="190" width="4" height="14" />
            <rect x="378" y="248" width="56" height="40" rx="3" /><rect x="236" y="250" width="54" height="38" rx="3" />
            <rect x="60" y="244" width="60" height="44" rx="3" /><rect x="520" y="240" width="64" height="48" rx="3" />
            <circle cx="140" cy="266" r="20" /><circle cx="500" cy="268" r="18" /><circle cx="600" cy="262" r="22" />
          </g>

          <g className="v0">
            <g className="cloud" transform="translate(190 56)">
              <ellipse cx="-34" cy="6" rx="32" ry="18" fill="#56627d" /><ellipse cx="0" cy="-6" rx="38" ry="24" fill="#56627d" /><ellipse cx="36" cy="6" rx="30" ry="17" fill="#56627d" />
            </g>
            {[158, 174, 190, 206, 222].map((x, i) => <line key={x} className="drop" x1={x} y1="86" x2={x - 4} y2="100" stroke="#9fd0ff" strokeWidth="3" strokeLinecap="round" style={{ animationDelay: `${i * 0.18}s` }} />)}
          </g>
          <rect className="ground" y="288" width="640" height="52" />

          {/* student: breathing, blinking, eyes follow the mouse */}
          <g transform="translate(190 36)">
            <ellipse cx="0" cy="264" rx="46" ry="8" fill="#000" opacity=".2" />
            <g className="stu">
              <rect x="-42" y="160" width="18" height="60" rx="9" fill="#f59e0b" /><rect x="-42" y="196" width="18" height="6" fill="#d97706" opacity=".6" />
              <rect x="-22" y="222" width="18" height="36" rx="8" fill="#2b3a67" /><rect x="4" y="222" width="18" height="36" rx="8" fill="#243258" />
              <ellipse cx="-14" cy="260" rx="14" ry="6" fill="#f4f6fb" /><ellipse cx="14" cy="260" rx="14" ry="6" fill="#f4f6fb" />
              <g className="breathe">
                <rect x="-31" y="146" width="62" height="92" rx="24" fill="url(#shirt)" />
                <path d="M-10 146 L0 162 L10 146Z" fill="#fff" /><path d="M-31 170 Q0 182 31 170" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="3" />
              </g>
              <g transform="translate(-30 164)"><g className="armL"><line x1="0" y1="0" x2="-6" y2="50" stroke="#3b6cf0" strokeWidth="15" strokeLinecap="round" /><circle cx="-6" cy="56" r="8" fill="#f1c19a" /></g></g>
              <g transform="translate(30 164)"><g className="armR"><line x1="0" y1="0" x2="6" y2="50" stroke="#3b6cf0" strokeWidth="15" strokeLinecap="round" /><circle cx="6" cy="56" r="8" fill="#f1c19a" /></g></g>
              <g className="head">
                <rect x="-8" y="136" width="16" height="16" rx="6" fill="#dca67b" />
                <circle cx="-29" cy="121" r="6" fill="#e8b48c" /><circle cx="29" cy="121" r="6" fill="#e8b48c" />
                <ellipse cx="0" cy="118" rx="29" ry="33" fill="url(#skin)" />
                <path d="M-31 116 Q-35 82 0 82 Q35 82 31 116 Q24 98 8 99 Q-8 92 -22 106 Q-28 108 -31 116Z" fill="#2a2330" /><path d="M-14 90 Q0 84 14 90" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" />
                <g className="eyes"><g className="eye"><ellipse cx="-11" cy="121" rx="5" ry="6" fill="#fff" /><circle cx="-11" cy="122" r="3.4" fill="#1d1d2b" /><circle cx="-10" cy="120.5" r="1.1" fill="#fff" /></g>
                  <g className="eye"><ellipse cx="11" cy="121" rx="5" ry="6" fill="#fff" /><circle cx="11" cy="122" r="3.4" fill="#1d1d2b" /><circle cx="12" cy="120.5" r="1.1" fill="#fff" /></g></g>
                <g className="v0" stroke="#2a2330" strokeWidth="2.6" strokeLinecap="round" fill="none"><path d="M-19 111 L-5 106" /><path d="M5 106 L19 111" /></g>
                <g className="v12" stroke="#2a2330" strokeWidth="2.6" strokeLinecap="round" fill="none"><path d="M-19 110 Q-12 105 -4 108" /><path d="M4 108 Q12 105 19 110" /></g>
                <path d="M0 124 Q-3 131 1 133" fill="none" stroke="#c98f68" strokeWidth="2" strokeLinecap="round" />
                <path className="v0" d="M-9 146 Q0 138 9 146" fill="none" stroke="#7a3b3b" strokeWidth="3" strokeLinecap="round" />
                <path className="v1" d="M-9 142 Q0 148 9 142" fill="none" stroke="#7a3b3b" strokeWidth="3" strokeLinecap="round" />
                <g className="v2"><path d="M-12 139 Q0 161 12 139Z" fill="#8a2b3a" /><path d="M-8 141 Q0 145 8 141" fill="#fff" /><circle cx="-21" cy="136" r="5" fill="#f9a8b8" opacity=".6" /><circle cx="21" cy="136" r="5" fill="#f9a8b8" opacity=".6" /></g>
                <path className="v0 sweat" d="M31 100 Q35 108 31 112 Q27 108 31 100Z" fill="#7dd3fc" />
              </g>
            </g>
            <text x="0" y="284" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="DM Sans, sans-serif">You</text>
          </g>

          {/* GBU senior: graduate with cap, stole and glasses */}
          <g transform="translate(470 36)">
            <ellipse cx="0" cy="264" rx="48" ry="8" fill="#000" opacity=".2" />
            <g className="bot">
              <rect x="-18" y="236" width="14" height="22" rx="6" fill="#1c2540" /><rect x="4" y="236" width="14" height="22" rx="6" fill="#1c2540" />
              <ellipse cx="-11" cy="260" rx="13" ry="6" fill="#111827" /><ellipse cx="11" cy="260" rx="13" ry="6" fill="#111827" />
              <path d="M-30 148 Q0 140 30 148 L43 248 Q0 256 -43 248Z" fill="url(#gown)" />
              <path d="M-14 146 L-6 250 L6 250 L14 146 Q0 152 -14 146Z" fill="#fbbf24" /><text x="0" y="208" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1c2540" fontFamily="Sora, sans-serif" transform="rotate(-90 0 208) translate(0 3)" opacity="0">GBU</text>
              <text x="0" y="200" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="Sora, sans-serif">GBU</text>
              <g transform="translate(30 158)"><line x1="0" y1="0" x2="6" y2="52" stroke="#168a68" strokeWidth="15" strokeLinecap="round" /><circle cx="6" cy="58" r="8" fill="#dba078" /></g>
              <g transform="translate(-30 158)"><g className="armW"><line x1="0" y1="0" x2="-8" y2="46" stroke="#168a68" strokeWidth="15" strokeLinecap="round" /><circle cx="-8" cy="52" r="8" fill="#dba078" /></g></g>
              <g className="head">
                <path d="M-33 112 Q-36 146 -22 146 L22 146 Q36 146 33 112Z" fill="#3a2418" />
                <path d="M30 100 Q58 104 48 150 Q44 124 30 122Z" fill="#3a2418" />
                <rect x="-8" y="136" width="16" height="16" rx="6" fill="#c98f68" />
                <ellipse cx="0" cy="118" rx="28" ry="32" fill="url(#skin2)" />
                <path d="M-29 112 Q-24 92 0 92 Q24 92 29 112 Q16 100 0 104 Q-16 100 -29 112Z" fill="#3a2418" />
                <g className="eyes"><g className="eye"><ellipse cx="-11" cy="121" rx="4.6" ry="5.6" fill="#fff" /><circle cx="-11" cy="122" r="3.2" fill="#2a1a10" /><circle cx="-10" cy="120.5" r="1" fill="#fff" /></g>
                  <g className="eye"><ellipse cx="11" cy="121" rx="4.6" ry="5.6" fill="#fff" /><circle cx="11" cy="122" r="3.2" fill="#2a1a10" /><circle cx="12" cy="120.5" r="1" fill="#fff" /></g></g>
                <circle cx="-11" cy="121" r="9" fill="none" stroke="#1c2540" strokeWidth="1.8" /><circle cx="11" cy="121" r="9" fill="none" stroke="#1c2540" strokeWidth="1.8" /><line x1="-2" y1="121" x2="2" y2="121" stroke="#1c2540" strokeWidth="1.8" />
                <path d="M-18 109 Q-11 105 -4 108 M4 108 Q11 105 18 109" fill="none" stroke="#3a2418" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M-11 140 Q0 150 11 140" fill="none" stroke="#9a3b4a" strokeWidth="3" strokeLinecap="round" /><circle cx="-20" cy="134" r="4.5" fill="#f9a8b8" opacity=".5" /><circle cx="20" cy="134" r="4.5" fill="#f9a8b8" opacity=".5" />
                <path d="M-40 94 L0 77 L40 94 L0 111Z" fill="#1c2540" /><path d="M-24 99 v10 Q0 119 24 109 v-10 Q0 108 -24 99Z" fill="#111a33" />
                <path className="tassel" d="M0 94 L30 98 L32 116" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" /><circle cx="32" cy="118" r="3.5" fill="#fbbf24" />
              </g>
            </g>
            <text className="v12" x="0" y="284" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="DM Sans, sans-serif">GBU alumna</text>
          </g>

          {/* step 1: inbox is empty */}
          <g className="v0" transform="translate(404 150)"><g className="inbox">
            <rect width="158" height="56" rx="14" fill="#fff" /><circle cx="26" cy="28" r="12" fill="#fee2e2" /><path d="M20 28 h12 M26 22 v12" stroke="#e11d63" strokeWidth="3" strokeLinecap="round" transform="rotate(45 26 28)" />
            <text x="48" y="25" fontSize="12" fontWeight="800" fill="#1c2540" fontFamily="Sora, sans-serif">Inbox</text><text x="48" y="43" fontSize="12" fontWeight="600" fill="#6b7694" fontFamily="DM Sans, sans-serif">0 replies to 24 applications</text>
          </g></g>

          {/* step 2: resume is scanned and skills pop out */}
          <g className="v1" transform="translate(284 96)"><g className="resume">
            <rect width="100" height="132" rx="10" fill="#fff" />
            <circle cx="20" cy="22" r="9" fill="#cfe0ff" />
            <rect x="36" y="15" width="48" height="7" rx="3" fill="#1c2540" /><rect x="36" y="27" width="32" height="5" rx="2" fill="#b6c0dc" />
            {[52, 66, 80, 94, 108].map((y, i) => <rect key={y} x="14" y={y} width={i % 2 ? 60 : 72} height="5" rx="2" fill="#d5dcee" />)}
            <rect className="scan" x="4" y="0" width="92" height="4" rx="2" fill="#1f9d78" />
            {CHIPS.map(([c, i]) => (
              <g key={c} transform={`translate(${-6 + i * 36} ${-30 - (i % 2) * 14})`}><g className="chip" style={{ animationDelay: `${0.7 + i * 0.45}s` }}>
                <rect width={c.length * 8 + 16} height="22" rx="11" fill="#1f9d78" /><text x={(c.length * 8 + 16) / 2} y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="DM Sans, sans-serif">{c}</text>
              </g></g>
            ))}
            <g transform="translate(50 150)"><g className="pulse"><rect x="-44" width="88" height="26" rx="13" fill="#1c2540" /><text y="17" textAnchor="middle" fontSize="12" fontWeight="800" fill="#34d399" fontFamily="Sora, sans-serif">92% match</text></g></g>
          </g></g>

          {/* step 3: linked up, offer, confetti */}
          <g className="v2">
            <path className="link" d="M240 196 Q336 266 432 196" fill="none" stroke="#0a66c2" strokeWidth="3" strokeDasharray="7 7" strokeLinecap="round" />
            <g transform="translate(286 108)"><g className="offer"><rect width="108" height="58" rx="12" fill="#fff" /><text x="54" y="25" textAnchor="middle" fontSize="15" fontWeight="800" fill="#1f9d78" fontFamily="Sora, sans-serif">OFFER</text><text x="54" y="45" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c2540" fontFamily="DM Sans, sans-serif">✓ Selected</text></g></g>
            <g transform="translate(294 220)"><rect width="84" height="22" rx="11" fill="#0a66c2" /><text x="42" y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="DM Sans, sans-serif">in Connected</text></g>
          </g>

          <Bubble cls="v0" x={236} y={96} w={170} h={40} tail="M236 112 L220 118 L236 124Z" lines={['Still no internship…']} />
          <Bubble cls="v1" x={356} y={50} w={210} h={56} tail="M462 108 L472 122 L482 108Z" lines={["Don't worry, come!", "I'll help you find one."]} />
          <Bubble cls="v2" x={118} y={30} w={156} h={40} tail="M190 70 L200 82 L210 70Z" lines={['I got an offer! 🎉']} />
          <Bubble cls="v2" x={396} y={38} w={116} h={36} tail="M472 76 L480 88 L488 76Z" lines={['Told you! 😄']} />

          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} className="cf" x={30 + i * 38} y="-12" width="8" height="12" rx="2" fill={CONFETTI[i % 5]} style={{ animationDelay: `${(i % 7) * 0.3}s`, '--r': `${i * 47}deg` }} />
          ))}
        </svg>
      </div>

      <div className="jb-mini" aria-live="polite">
        <div className="jb-dots" role="group" aria-label="Story steps">
          {STEPS.map((x, i) => <button type="button" key={x.t} className={s === i ? 'on' : ''} onClick={() => setS(i)} aria-label={`Step ${i + 1}: ${x.t}`} aria-pressed={s === i} />)}
          <em>{STEPS[s].k}</em>
        </div>
        <b>{STEPS[s].t}</b>
        <small>{STEPS[s].d}</small>
      </div>
    </section>
  );
}