import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { KINDS } from '../../data/helpData';

// The orb IS the board: every dot is an open post, coloured by kind.
// Bigger dots = offers. Pulsing ring = urgent. A light travelling along an arc = a helper heading to someone who asked.
// Drag to spin, hover a dot to read it, click it to open it. The legend highlights a kind and filters the board.
// Needs:  npm i three

const HUE = { borrow: 0xf5b544, travel: 0x5b9bff, ride: 0xff6b95, notes: 0xb39bff, study: 0x3fdcae, other: 0x6ee7d0 };
const css = k => '#' + (HUE[k] ?? HUE.other).toString(16).padStart(6, '0');
const R = 2.2;
const lerp = THREE.MathUtils.lerp;

const fib = (i, n, r) => {
  const y = 1 - ((i + 0.5) / n) * 2, q = Math.sqrt(1 - y * y), a = i * 2.399963;
  return new THREE.Vector3(Math.cos(a) * q, y, Math.sin(a) * q).multiplyScalar(r);
};
const glowTexture = () => {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(94,234,212,.5)'); r.addColorStop(0.45, 'rgba(99,102,241,.16)'); r.addColorStop(1, 'rgba(99,102,241,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};
const free = obj => obj.traverse(o => { o.geometry?.dispose(); o.material?.map?.dispose(); o.material?.dispose(); });

export default function HelpOrb({ items = [], kind = null, onKind, onPick }) {
  const host = useRef(null), tip = useRef(null);
  const api = useRef({ nodes: [], rings: [], pulses: [], vel: 0 });
  const kindRef = useRef(null), prev = useRef(0);
  const cb = useRef({}); cb.current = { onPick };
  const [hov, setHov] = useState(null);
  kindRef.current = hov || kind;

  const counts = useMemo(() => {
    const m = {}; items.forEach(x => { if (x.status === 'open') m[x.kind] = (m[x.kind] || 0) + 1; }); return m;
  }, [items]);

  // ---------- scene (created once) ----------
  useEffect(() => {
    const el = host.current; if (!el) return;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); } catch { return; }
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 50); cam.position.set(0, 0, 8.2);
    const world = new THREE.Group(); world.rotation.x = 0.32; scene.add(world);
    const data = new THREE.Group(); world.add(data);

    const N = 320, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) fib(i, N, R).toArray(pos, i * 3);
    const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xcfe3ff, size: 0.04, transparent: true, opacity: 0.8, depthWrite: false }));
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(R * 0.985, 2), new THREE.MeshBasicMaterial({ color: 0x7aa2ff, wireframe: true, transparent: true, opacity: 0.14 }));
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, depthWrite: false }));
    glow.scale.setScalar(R * 3.6);
    world.add(dust, shell); scene.add(glow);

    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), v3 = new THREE.Vector3();
    let raf = 0, vis = true, t = 0, last = 0, drag = null, hover = null;
    const draw = () => renderer.render(scene, cam);
    const size = () => {
      const w = el.clientWidth || 320, h = el.clientHeight || 320;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); if (calm) draw();
    };

    const point = e => { const r = el.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); return r; };
    const hit = () => {
      ray.setFromCamera(ndc, cam);
      const h = ray.intersectObjects(api.current.nodes, false).find(x => x.object.getWorldPosition(v3).z > -0.4);
      return h ? h.object : null;
    };
    const showTip = (m, r) => {
      const n = tip.current; if (!n) return;
      if (!m) { n.style.opacity = 0; return; }
      const it = m.userData.item, p = m.getWorldPosition(new THREE.Vector3()).project(cam);
      n.textContent = `${it.mode === 'need' ? 'Needs help' : 'Offering'}: ${it.title}`;
      n.style.transform = `translate(${(p.x * 0.5 + 0.5) * r.width}px,${(-p.y * 0.5 + 0.5) * r.height}px) translate(-50%,-150%)`;
      n.style.opacity = 1;
    };
    const down = e => { drag = { x: e.clientX, y: e.clientY, moved: 0 }; el.setPointerCapture(e.pointerId); el.classList.add('drag'); showTip(null); };
    const move = e => {
      const r = point(e);
      if (drag) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        world.rotation.y += dx * 0.007; world.rotation.x = THREE.MathUtils.clamp(world.rotation.x + dy * 0.005, -0.9, 0.9);
        api.current.vel = dx * 0.0009; drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy);
      } else {
        hover = hit(); el.style.cursor = hover ? 'pointer' : ''; showTip(hover, r);
      }
      if (calm) draw();
    };
    const up = () => {
      if (drag && drag.moved < 5) { const m = hit(); if (m) cb.current.onPick?.(m.userData.item); }
      drag = null; el.classList.remove('drag');
    };
    const leave = () => { hover = null; showTip(null); };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('pointerleave', leave);

    const frame = now => {
      raf = requestAnimationFrame(frame);
      if (!vis || document.hidden) return;
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; t += dt;
      const A = api.current, k = kindRef.current;
      if (!drag && !hover) { world.rotation.y += dt * 0.16 + A.vel; A.vel *= 0.94; }
      A.nodes.forEach((m, i) => {
        const on = !k || m.userData.k === k;
        m.scale.setScalar(lerp(m.scale.x, (on ? 1 : 0.55) * (1 + 0.14 * Math.sin(t * 2 + i)) * (m === hover ? 1.7 : 1), 0.15));
        m.material.opacity = lerp(m.material.opacity, on ? 1 : 0.22, 0.12);
      });
      A.rings.forEach((r, i) => {
        const ph = (t * 0.9 + i * 0.37) % 1;
        r.visible = !k || r.userData.k === k;
        r.scale.setScalar(1 + ph * 1.1); r.material.opacity = 0.75 * (1 - ph); r.lookAt(cam.position);
      });
      A.pulses.forEach(p => {
        const on = !k || p.k === k;
        p.u = (p.u + dt * p.sp) % 1;
        p.mesh.position.copy(p.curve.getPoint(p.u)); p.mesh.scale.setScalar(0.3 + Math.sin(Math.PI * p.u) * 0.9); p.mesh.visible = on;
        p.line.material.opacity = lerp(p.line.material.opacity, on ? 0.34 : 0.05, 0.12);
      });
      draw();
    };

    Object.assign(api.current, { data, draw });
    size();
    const ro = new ResizeObserver(size); ro.observe(el);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(el);
    if (!calm) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); el.removeEventListener('pointerleave', leave);
      free(scene); renderer.dispose(); renderer.domElement.remove();
      api.current = { nodes: [], rings: [], pulses: [], vel: 0 };
    };
  }, []);

  // ---------- data (rebuilt when posts change) ----------
  useEffect(() => {
    const A = api.current; if (!A.data) return;
    [...A.data.children].forEach(c => { A.data.remove(c); free(c); });
    A.nodes = []; A.rings = []; A.pulses = [];

    const open = items.filter(x => x.status === 'open').sort((a, b) => a.id.localeCompare(b.id)).slice(0, 36);
    const at = new Map();
    open.forEach((it, i) => {
      const p = fib(i, open.length, R); at.set(it.id, p);
      const m = new THREE.Mesh(new THREE.SphereGeometry(it.mode === 'offer' ? 0.1 : 0.075, 16, 16), new THREE.MeshBasicMaterial({ color: HUE[it.kind] ?? HUE.other, transparent: true }));
      m.position.copy(p); m.userData = { item: it, k: it.kind }; A.data.add(m); A.nodes.push(m);
      if (it.urgent) {
        const r = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.18, 32), new THREE.MeshBasicMaterial({ color: 0xff6b95, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
        r.position.copy(p); r.userData = { k: it.kind }; A.data.add(r); A.rings.push(r);
      }
    });

    const offers = open.filter(x => x.mode === 'offer');
    open.filter(x => x.mode === 'need').slice(0, 14).forEach((n, i) => {
      const o = offers.find(x => x.kind === n.kind) || offers[i % Math.max(offers.length, 1)]; if (!o) return;
      const a = at.get(o.id), b = at.get(n.id);
      const mid = a.clone().add(b).multiplyScalar(0.5).setLength(R + 0.5 + a.distanceTo(b) * 0.22);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(36)), new THREE.LineBasicMaterial({ color: HUE[n.kind] ?? HUE.other, transparent: true, opacity: 0.34, depthWrite: false }));
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      A.data.add(line, mesh); A.pulses.push({ curve, line, mesh, k: n.kind, u: (i * 0.23) % 1, sp: 0.16 + (i % 4) * 0.03 });
    });

    if (open.length > prev.current && prev.current) A.vel = 0.05; // a new post gives the orb a little spin
    prev.current = open.length;
    A.draw?.();
  }, [items]);

  return (
    <div className="hp-orbwrap">
      <div ref={host} className="hp-orb" role="img" aria-label="A globe of students. Each dot is an open help post, and lines show helpers connecting to requests.">
        <div ref={tip} className="hp-orb-tip" aria-hidden="true" />
      </div>
      <ul className="hp-orb-key" aria-label="Highlight a kind of help">
        {KINDS.map(k => (
          <li key={k.k}>
            <button type="button" className={kind === k.k ? 'on' : ''} style={{ '--d': css(k.k) }} aria-pressed={kind === k.k}
              onMouseEnter={() => setHov(k.k)} onMouseLeave={() => setHov(null)} onFocus={() => setHov(k.k)} onBlur={() => setHov(null)}
              onClick={() => onKind?.(k.k)}>
              <i />{k.short}<span>{counts[k.k] || 0}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="hp-orb-hint">Big dot = offering, small dot = needs help. Drag to spin, click a dot to open it.</p>
    </div>
  );
}