// "Explore Mahmya Island Before You Arrive" — virtual tour (Figma 955:6781).
// Start opens a full-screen viewer you can drag (or use the arrow keys) to look around.

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Airplay, Compass, Play, X } from 'lucide-react';
import { Eyebrow } from '../components/ui';
import beach from '../../assets/site/tour/scrim.jpg';
import aerial from '../../assets/site/tour/panorama.jpg';

const SCENES = [
  { id: 'beach', label: 'Beach & bay', image: beach, alt: 'Mahmya’s beach with palm-leaf sunshades, the jetty and boats in the turquoise bay' },
  { id: 'aerial', label: 'From above', image: aerial, alt: 'Aerial view of Mahmya Island’s beach ringed by coral reef' },
];

function TourViewer({ onClose }: { onClose: () => void }) {
  const [scene, setScene] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      const d = { ArrowLeft: [-4, 0], ArrowRight: [4, 0], ArrowUp: [0, -4], ArrowDown: [0, 4] }[e.key];
      if (d) setPos((p) => ({ x: Math.min(100, Math.max(0, p.x + d[0])), y: Math.min(100, Math.max(0, p.y + d[1])) }));
    };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return createPortal(
    <div className="s-tour" role="dialog" aria-modal="true" aria-label="Virtual tour of Mahmya Island">
      <div
        className="s-tour-view"
        style={{ backgroundImage: `url(${SCENES[scene].image})`, backgroundPosition: `${pos.x}% ${pos.y}%` }}
        role="img"
        aria-label={`${SCENES[scene].alt}. Drag or use the arrow keys to look around.`}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          setPos({ x: Math.min(100, Math.max(0, d.px - ((e.clientX - d.x) / window.innerWidth) * 60)), y: Math.min(100, Math.max(0, d.py - ((e.clientY - d.y) / window.innerHeight) * 60)) });
        }}
        onPointerUp={() => (drag.current = null)}
      />
      <div className="s-tour-bar">
        <span className="s-tour-compass">
          <Compass size={18} aria-hidden /> N 27° 13′ 45″
        </span>
        <div className="s-tour-scenes" role="tablist" aria-label="Views">
          {SCENES.map((s, i) => (
            <button key={s.id} type="button" role="tab" aria-selected={i === scene} className={i === scene ? 'on' : undefined} onClick={() => (setScene(i), setPos({ x: 50, y: 50 }))}>
              {s.label}
            </button>
          ))}
        </div>
        <button type="button" className="s-tour-close" onClick={onClose} aria-label="Close the virtual tour" autoFocus>
          <X size={22} />
        </button>
      </div>
      <p className="s-tour-hint">Drag to look around · Esc to close</p>
    </div>,
    document.body,
  );
}

/** `home`: the homepage version (275:9620) — the two-line title, View Gallery next to Start and the current-location plate. */
export function VirtualTour({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <section className={`s-vtour${home ? ' home' : ''}`} aria-labelledby="s-vtour-title">
      <div className={home ? 'h-wrap' : 's-container'}>
        <div className="s-vtour-head">
          <div>
            <Eyebrow className="left">Virtual Tour</Eyebrow>
            <h2 id="s-vtour-title" className="s-title-lg left">
              Explore Mahmya Island Before You Arrive
            </h2>
          </div>
          <div className="s-vtour-actions">
            {home && (
              <Link to="/gallery" className="s-btn s-btn-outline s-btn-lg">
                View Gallery
              </Link>
            )}
            <button type="button" className="s-btn s-btn-primary s-btn-lg" onClick={() => setOpen(true)}>
              Start Virtual Tour <Play size={14} aria-hidden />
            </button>
          </div>
        </div>
        <div className="s-vtour-viewer">
          <img src={beach} alt="" loading="lazy" />
          <div className="s-vtour-scrim" />
          <button type="button" className="s-vtour-start" onClick={() => setOpen(true)}>
            <span className="s-vtour-ring">
              <span className="s-vtour-circle">
                <Airplay size={36} aria-hidden />
              </span>
            </span>
            <span className="s-vtour-label">Start Virtual Tour</span>
          </button>
          <span className="s-vtour-compass">
            <Compass size={20} aria-hidden /> N 27° 13′ 45″
          </span>
          {home && (
            <div className="s-vtour-plate">
              <p className="s-vtour-plate-label">
                <span aria-hidden /> Current location
              </p>
              <p className="s-vtour-plate-title">The Main Beach</p>
              <p className="s-vtour-plate-text">Take a virtual journey around Mahmya Island before your visit and discover the beaches, activities, dining areas, and unforgettable views waiting for you.</p>
            </div>
          )}
        </div>
      </div>
      {open && <TourViewer onClose={() => setOpen(false)} />}
    </section>
  );
}
