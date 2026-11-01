// "A Taste of Mahmya." — island dining (Figma 917:4567–4569). Choosing a venue
// opens its details and switches the photo.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Eyebrow } from '../components/ui';
import { useContent } from '../hooks';

export function Dining({ cta = true }: { cta?: boolean }) {
  const { note, venues } = useContent().dining;
  const [open, setOpen] = useState(venues[0]?.id);
  const current = venues.find((o) => o.id === open) ?? venues[0];
  if (!current) return null;
  return (
    <section className="s-dining" id="dining" aria-labelledby="s-dining-title">
      <div className="s-container">
        <div className="s-dining-head">
          <div>
            <Eyebrow className="left">Island dining</Eyebrow>
            <h2 id="s-dining-title" className="s-dining-title">
              A <em>Taste</em> of Mahmya.
            </h2>
            <p className="s-dining-sub">Complete your island experience with fresh flavors, refreshing drinks, and beautiful Red Sea views.</p>
          </div>
          {cta && (
            <Link to="/activities#dining" className="s-btn s-btn-outline s-btn-sm">
              Explore Dining
            </Link>
          )}
        </div>
        <div className="s-dining-body">
          <div className="s-dining-photo">
            {venues.map((o) => (
              <img key={o.id} src={o.image} alt={o.id === current.id ? `${o.name} on Mahmya Island` : ''} className={o.id === current.id ? 'on' : undefined} loading="lazy" />
            ))}
            <span className="s-dining-chip">{current.name}</span>
          </div>
          <div className="s-dining-list">
            {venues.map((o, i) => {
              const isOpen = o.id === current.id;
              return (
                <div key={o.id} className={`s-dining-row${isOpen ? ' open' : ''}`}>
                  <button type="button" className="s-dining-row-head" aria-expanded={isOpen} aria-controls={`dining-${o.id}`} onClick={() => setOpen(o.id)}>
                    <span className="s-dining-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="s-dining-name">{o.name}</span>
                  </button>
                  <div id={`dining-${o.id}`} className="s-dining-detail" hidden={!isOpen}>
                    <p>{o.description}</p>
                    <p className="s-dining-hours">
                      <Clock size={16} aria-hidden />
                      {o.hours}
                    </p>
                  </div>
                </div>
              );
            })}
            <p className="s-dining-note">{note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
