import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// "Small favours, properly thanked": a gift box that opens when you hover, tap or press Enter.
// Coral box = the person who asked. Teal ribbon = the person who helped. Treats float out when it opens.
// Opens once by itself when it scrolls into view. Pauses off screen, honours reduced motion, frees GPU memory on exit.
// Needs:  npm i three

const std = (c, r = 0.5) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0.05 });
const radial = (stops, s = 128) => {
  const c = document.createElement('canvas'); c.width = c.height = s;
  const g = c.getContext('2d'), r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  stops.forEach(([o, col]) => r.addColorStop(o, col));
  g.fillStyle = r; g.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(c);
};
const free = obj => obj.traverse(o => { o.geometry?.dispose(); o.material?.map?.dispose(); o.material?.dispose(); });
const TREAT = [0xffd36b, 0x5eead4, 0xffffff, 0xff8a5c];

export default function RewardGift() {
  const el = useRef(null);

  useEffect(() => {
    const host = el.current; if (!host) return;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); } catch { return; }
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(36, 1, 0.1, 50); cam.position.set(0, 1.7, 8.4); cam.lookAt(0, 0.35, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 6, 5); scene.add(key);
    const rim = new THREE.PointLight(0x2dd4bf, 70, 22); rim.position.set(-4, 2, -3); scene.add(rim);

    const coral = std(0xf2663a), coralDark = std(0xd9532a), teal = std(0x14b8a6, 0.38);
    const gift = new THREE.Group(); scene.add(gift);
    const box = (w, h, d, m, x = 0, y = 0, z = 0) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); return b; };
    gift.add(box(2, 1.5, 2, coral), box(0.42, 1.51, 2.01, teal), box(2.01, 1.51, 0.42, teal));

    // lid hinges at the back top edge
    const lid = new THREE.Group(); lid.position.set(0, 0.75, -1.1);
    lid.add(box(2.24, 0.46, 2.24, coralDark, 0, 0.23, 1.1), box(0.42, 0.47, 2.25, teal, 0, 0.23, 1.1), box(2.25, 0.47, 0.42, teal, 0, 0.23, 1.1));
    [-1, 1].forEach(s => {
      const loop = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 12, 28), teal);
      loop.position.set(s * 0.3, 0.7, 1.1); loop.rotation.z = s * -0.65; lid.add(loop);
    });
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), teal); knot.position.set(0, 0.56, 1.1); lid.add(knot);
    gift.add(lid);

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial([[0, 'rgba(255,211,107,.95)'], [0.4, 'rgba(255,170,80,.35)'], [1, 'rgba(255,170,80,0)']]), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.position.set(0, 0.85, 0); glow.scale.setScalar(0.01); gift.add(glow);

    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.6), new THREE.MeshBasicMaterial({ map: radial([[0, 'rgba(0,0,0,.55)'], [1, 'rgba(0,0,0,0)']]), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.2; scene.add(shadow);

    const treats = Array.from({ length: 24 }, (_, i) => {
      const m = new THREE.Mesh(i % 3 ? new THREE.OctahedronGeometry(0.1) : new THREE.SphereGeometry(0.085, 10, 10), new THREE.MeshBasicMaterial({ color: TREAT[i % 4], transparent: true }));
      m.visible = false; scene.add(m);
      return { m, ph: i / 24, a: i * 2.4, r: 0.25 + (i % 5) * 0.16 };
    });

    let open = 0, pinned = false, hover = false, intro = 0, seen = false, vis = true, raf = 0, last = 0, t = 0, px = 0, py = 0;
    const draw = () => renderer.render(scene, cam);
    const pose = () => { lid.rotation.x = -open * 1.25; glow.scale.setScalar(0.01 + open * 3.4); glow.material.opacity = open; };
    const size = () => {
      const w = host.clientWidth || 280, h = host.clientHeight || 280;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); if (calm) { pose(); draw(); }
    };
    const toggle = () => { pinned = !pinned; if (calm) { open = pinned ? 1 : 0; pose(); draw(); } };
    const enter = () => { hover = true; if (calm) { open = 1; pose(); draw(); } };
    const leave = () => { hover = false; px = py = 0; if (calm) { open = pinned ? 1 : 0; pose(); draw(); } };
    const move = e => { const r = host.getBoundingClientRect(); px = ((e.clientX - r.left) / r.width - 0.5) * 2; py = ((e.clientY - r.top) / r.height - 0.5) * 2; };
    const key$ = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };
    host.addEventListener('click', toggle); host.addEventListener('pointerenter', enter); host.addEventListener('pointerleave', leave);
    host.addEventListener('pointermove', move); host.addEventListener('keydown', key$);

    const frame = now => {
      raf = requestAnimationFrame(frame);
      if (!vis || document.hidden) return;
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; t += dt;
      if (intro > 0) intro -= dt;
      const goal = hover || pinned || intro > 0 ? 1 : 0;
      open += (goal - open) * Math.min(1, dt * 6);
      pose();
      gift.position.y = Math.sin(t * 1.4) * 0.08;
      gift.rotation.y += ((0.55 + Math.sin(t * 0.4) * 0.22 + px * 0.5) - gift.rotation.y) * 0.06;
      gift.rotation.x += (py * 0.12 - gift.rotation.x) * 0.06;
      shadow.scale.setScalar(1 - gift.position.y * 0.5);
      treats.forEach(p => {
        p.m.visible = open > 0.05;
        if (!p.m.visible) return;
        const u = (t * 0.32 + p.ph) % 1, sp = 0.4 + u;
        p.m.position.set(Math.cos(p.a + t * 0.6) * p.r * sp, 0.9 + u * 2.7, Math.sin(p.a + t * 0.6) * p.r * sp);
        p.m.scale.setScalar(open * Math.sin(Math.PI * u) * 1.2 + 0.01); p.m.rotation.y = t * 2 + p.a;
      });
      draw();
    };

    size();
    const ro = new ResizeObserver(size); ro.observe(host);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !seen) { seen = true; intro = 3.2; if (calm) { open = 1; pose(); draw(); } } }, { threshold: 0.4 });
    io.observe(host);
    if (!calm) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      host.removeEventListener('click', toggle); host.removeEventListener('pointerenter', enter); host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointermove', move); host.removeEventListener('keydown', key$);
      free(scene); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="hp-gift">
      <div ref={el} className="hp-gift-c" role="button" tabIndex={0} aria-label="Reward gift box. Press Enter to open or close it." />
      <p>Hover or tap the box to open it.</p>
    </div>
  );
}