import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GBU_CENTER, PLACES } from '../../data/lostFoundData';

const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const icon = (type, on) => L.divIcon({
  className: 'lf-pinw', html: `<span class="lf-pin ${type}${on ? ' on' : ''}"></span>`, iconSize: [28, 28], iconAnchor: [14, 34],
});


export default function LiveMap({ items = [], activeId = null, place = '', onOpen, onPlace, pick = false, type = 'lost', point = null, onPick, className = '' }) {
  const el = useRef(null), map = useRef(null), layer = useRef(null);
  const cb = useRef({}); cb.current = { onOpen, onPick, onPlace };

  useEffect(() => {
    const m = L.map(el.current, { center: GBU_CENTER, zoom: 16, minZoom: 14, maxZoom: 19, zoomControl: false });
    L.tileLayer(TILES, { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(m);
    L.control.zoom({ position: 'bottomright' }).addTo(m);
    // building labels (shown from zoom 16 up)
    PLACES.forEach(p => L.marker([p.lat, p.lng], {
      icon: L.divIcon({ className: 'lf-lblw', html: `<span class="lf-lbl" data-id="${p.id}">${p.name}</span>`, iconSize: [0, 0] }),
      zIndexOffset: -500, keyboard: false,
    }).on('click', () => cb.current.onPlace?.(p)).addTo(m));
    const zoom = () => m.getContainer().classList.toggle('lf-zl', m.getZoom() >= 16);
    m.on('zoomend', zoom); zoom();
    layer.current = L.layerGroup().addTo(m);
    if (pick) m.on('click', e => cb.current.onPick?.({ lat: e.latlng.lat, lng: e.latlng.lng }));
    map.current = m;
    const t = setTimeout(() => m.invalidateSize(), 350); // modals animate in, so re-measure after
    return () => { clearTimeout(t); m.remove(); map.current = layer.current = null; };
  }, [pick]);

  // highlight the selected building label
  useEffect(() => {
    el.current?.querySelectorAll('.lf-lbl').forEach(n => n.classList.toggle('on', n.dataset.id === place));
  }, [place, pick]);

  // pins
  useEffect(() => {
    const g = layer.current; if (!g) return;
    g.clearLayers();
    if (pick) {
      if (point) L.marker([point.lat, point.lng], { icon: icon(type, true), draggable: true })
        .on('dragend', e => { const p = e.target.getLatLng(); cb.current.onPick?.({ lat: p.lat, lng: p.lng }); }).addTo(g);
      return;
    }
    items.forEach(it => {
      if (it.lat == null) return;
      L.marker([it.lat, it.lng], { icon: icon(it.type, it.id === activeId), title: it.title })
        .bindTooltip(it.title, { direction: 'top', offset: [0, -34] })
        .on('click', () => cb.current.onOpen?.(it)).addTo(g);
    });
  }, [items, activeId, pick, point, type]);

  // fit the view when the list changes
  useEffect(() => {
    const m = map.current; if (!m || pick) return;
    const pts = items.filter(x => x.lat != null).map(x => [x.lat, x.lng]);
    if (!pts.length) m.setView(GBU_CENTER, 16);
    else if (pts.length === 1) m.setView(pts[0], 17);
    else m.fitBounds(pts, { padding: [36, 36], maxZoom: 17 });
  }, [items, pick]);

  // fly to the active item
  useEffect(() => {
    const m = map.current; if (!m || pick || !activeId) return;
    const it = items.find(x => x.id === activeId);
    if (it?.lat != null) m.flyTo([it.lat, it.lng], Math.max(m.getZoom(), 17), { duration: 0.6 });
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // keep the dropped pin in view
  useEffect(() => { if (pick && point) map.current?.panTo([point.lat, point.lng]); }, [pick, point]);

  return <div ref={el} className={`lf-map ${className}`} role="application" aria-label={pick ? 'Tap the map to drop a pin' : 'Map of lost and found items'} />;
}