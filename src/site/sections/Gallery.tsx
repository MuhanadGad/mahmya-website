// "Moments You Will Never Forget" — the polaroid gallery strip (Figma 955:6718).

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lightbox } from '../components/Lightbox';
import { Eyebrow } from '../components/ui';
import { GALLERY, POLAROID_TILT } from '../content';

export function GallerySection({ viewAll = true }: { viewAll?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setIndex(max <= 0 ? 0 : Math.round((el.scrollLeft / max) * (GALLERY.length - 1)));
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * 352, behavior: 'smooth' });
  };

  return (
    <section className="s-gallery" aria-labelledby="s-gallery-title">
      <header className="s-container s-gallery-head">
        <Eyebrow>Mahmya Gallery</Eyebrow>
        <h2 id="s-gallery-title" className="s-title-lg">
          Moments You Will Never Forget
        </h2>
        {viewAll && (
          <Link to="/gallery" className="s-btn s-btn-outline s-btn-sm">
            View all Gallery
          </Link>
        )}
      </header>
      <div className="s-polaroids" ref={track} tabIndex={0} role="region" aria-label="Photo gallery">
        {GALLERY.map((g, i) => (
          <button key={g.title} type="button" className="s-polaroid" style={{ '--tilt': `${POLAROID_TILT[i]}deg` } as React.CSSProperties} onClick={() => setOpen(i)} aria-label={`Open photo: ${g.title}`}>
            <img src={g.image} alt="" loading="lazy" />
            <span className="s-polaroid-title">{g.title}</span>
            <span className="s-polaroid-caption">{g.caption}</span>
          </button>
        ))}
      </div>
      <div className="s-gallery-controls">
        <button type="button" className="s-arrow-btn" onClick={() => step(-1)} aria-label="Previous photos">
          ←
        </button>
        <button type="button" className="s-arrow-btn" onClick={() => step(1)} aria-label="Next photos">
          →
        </button>
        <span className="s-progress" aria-hidden>
          <span style={{ width: `${((index + 1) / GALLERY.length) * 100}%` }} />
        </span>
        <span className="s-gallery-count">
          {String(index + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}
        </span>
      </div>
      {open !== null && <Lightbox items={GALLERY} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}
