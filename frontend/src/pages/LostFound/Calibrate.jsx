import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Copy, Check } from 'lucide-react';
import PageShell from '../../components/PageShell/PageShell';
import { PLACES, GBU_CENTER } from '../../data/lostFoundData';

// Dev tool at /lf-calibrate. Pick a building, click its spot on the map (it jumps to the next building),
// then press Copy and paste the result over POS in data/lostFoundData.js.
export default function Calibrate() {
  const el = useRef(null), map = useRef(null), layer = useRef(null);
  const [pts, setPts] = useState(() => Object.fromEntries(PLACES.map(p => [p.id, [p.lat, p.lng]])));
  const [cur, setCur] = useState(PLACES[0].id);
  const [done, setDone] = useState(false);
  const curRef = useRef(cur); curRef.current = cur;

  useEffect(() => {
    const m = L.map(el.current, { center: GBU_CENTER, zoom: 16, minZoom: 14, maxZoom: 19 });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(m);
    m.getContainer().classList.add('lf-zl');
    layer.current = L.layerGroup().addTo(m);
    m.on('click', e => {
      const id = curRef.current;
      setPts(s => ({ ...s, [id]: [+e.latlng.lat.toFixed(5), +e.latlng.lng.toFixed(5)] }));
      setCur(PLACES[(PLACES.findIndex(p => p.id === id) + 1) % PLACES.length].id);
    });
    map.current = m;
    return () => { m.remove(); map.current = layer.current = null; };
  }, []);

  useEffect(() => {
    const g = layer.current; if (!g) return; g.clearLayers();
    PLACES.forEach(p => L.marker(pts[p.id], { interactive: false, icon: L.divIcon({
      className: 'lf-lblw', iconSize: [0, 0], html: `<span class="lf-lbl ${p.id === cur ? 'on' : ''}">${p.name}</span>` }) }).addTo(g));
  }, [pts, cur]);

  const code = `const POS = {\n${PLACES.map(p => `  ${p.id}: [${pts[p.id].join(', ')}],`).join('\n')}\n};`;
  const copy = () => { navigator.clipboard?.writeText(code); setDone(true); setTimeout(() => setDone(false), 2000); };

  return (
    <PageShell>
      <section className="cb">
        <div className="cb-side">
          <h1>Place the buildings</h1>
          <p>Pick a building, then click its spot on the map. It moves on to the next one by itself. Press Copy when you finish and paste the result over <b>POS</b> in <code>lostFoundData.js</code>.</p>
          <div className="cb-list">
            {PLACES.map(p => <button type="button" key={p.id} className={p.id === cur ? 'on' : ''} onClick={() => { setCur(p.id); map.current?.flyTo(pts[p.id], 17); }}><span>{p.name}</span><small>{pts[p.id].join(', ')}</small></button>)}
          </div>
          <button type="button" className="btn btn-primary" onClick={copy}>{done ? <Check size={15} /> : <Copy size={15} />}{done ? 'Copied' : 'Copy coordinates'}</button>
        </div>
        <div ref={el} className="lf-map cb-map" />
      </section>
    </PageShell>
  );
}