import { useState } from 'react';
import { Lightbox } from '../components/Lightbox';
import { PageHeader } from '../components/ui';
import { usePageTitle } from '../format';
import { FREE_ACTIVITIES, GALLERY, OUTLETS, PAID_ACTIVITIES, PROGRAMS } from '../content';

const PHOTOS = [
  ...GALLERY.map((g) => ({ image: g.image, title: g.title, caption: g.caption })),
  ...PROGRAMS.map((p) => ({ image: p.image, title: p.name, caption: p.tagline })),
  ...PAID_ACTIVITIES.map((a) => ({ image: a.image, title: a.name, caption: 'Water adventure' })),
  ...FREE_ACTIVITIES.map((a) => ({ image: a.image, title: a.name, caption: 'Included with every visit' })),
  ...OUTLETS.map((o) => ({ image: o.image, title: o.name, caption: o.hours })),
];

export default function GalleryPage() {
  usePageTitle('Gallery');
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <PageHeader eyebrow="Mahmya gallery" title={<>Moments you will <em>never forget</em>.</>} subtitle="Reefs, beach days, boat rides and long lunches — a look at a day on Mahmya." />
      <section className="s-section">
        <div className="s-container s-masonry">
          {PHOTOS.map((p, i) => (
            <button key={`${p.title}-${i}`} type="button" className="s-masonry-item" onClick={() => setOpen(i)} aria-label={`Open photo: ${p.title}`}>
              <img src={p.image} alt="" loading="lazy" />
              <span className="s-masonry-chip">{p.title}</span>
            </button>
          ))}
        </div>
      </section>
      {open !== null && <Lightbox items={PHOTOS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
