import { useState } from 'react';
import { Lightbox } from '../components/Lightbox';
import { PageHeader } from '../components/ui';
import { usePageTitle } from '../format';
import { Rich } from '../components/Rich';
import { FREE_ACTIVITIES, PAID_ACTIVITIES, PROGRAMS } from '../content';
import { useContent } from '../hooks';

/** The site's other photos, after the gallery's own. */
const MORE_PHOTOS = [
  ...PROGRAMS.map((p) => ({ image: p.image, title: p.name, caption: p.tagline })),
  ...PAID_ACTIVITIES.map((a) => ({ image: a.image, title: a.name, caption: 'Water adventure' })),
  ...FREE_ACTIVITIES.map((a) => ({ image: a.image, title: a.name, caption: 'Included with every visit' })),
];

export default function GalleryPage() {
  usePageTitle('Gallery');
  const [open, setOpen] = useState<number | null>(null);
  const { gallery, dining } = useContent();
  const photos = [
    ...gallery.photos.map((g) => ({ image: g.image, title: g.title, caption: g.caption })),
    ...MORE_PHOTOS,
    ...dining.venues.map((o) => ({ image: o.image, title: o.name, caption: o.hours })),
  ];
  return (
    <>
      <PageHeader eyebrow={gallery.eyebrow} title={<Rich text={gallery.title} />} subtitle={gallery.subtitle} />
      <section className="s-section">
        <div className="s-container s-masonry">
          {photos.map((p, i) => (
            <button key={`${p.title}-${i}`} type="button" className="s-masonry-item" onClick={() => setOpen(i)} aria-label={`Open photo: ${p.title}`}>
              <img src={p.image} alt="" loading="lazy" />
              <span className="s-masonry-chip">{p.title}</span>
            </button>
          ))}
        </div>
      </section>
      {open !== null && <Lightbox items={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
