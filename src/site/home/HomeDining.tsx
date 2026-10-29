// "A Taste of Mahmya" (Figma 275:9569, Dining Section – 4 Card Grid): four cards
// in a row — the wider Island Buffet, then À La Carte, Beach Bar and Smoothie
// bar — each with its hours and the menu.

import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import type { OutletId } from '../../data/catalog';
import { MENU_FILES, OUTLETS, type Outlet } from '../content';
import clock from '../../assets/home/v2/clock-dark.svg';
import clockSolid from '../../assets/home/v2/clock-solid.svg';
import download from '../../assets/home/v2/download.svg';
import dots from '../../assets/home/v2/dots-dine.svg';
import buffet from '../../assets/home/v2/dine-buffet.jpg';
import alacarte from '../../assets/home/v2/dine-alacarte.jpg';
import bar from '../../assets/home/v2/dine-bar.jpg';
import smoothie from '../../assets/home/v2/dine-smoothie.jpg';

const PHOTOS: Record<OutletId, { src: string; position?: string }> = {
  buffet: { src: buffet, position: 'center 50%' },
  'a-la-carte': { src: alacarte, position: 'center 86%' },
  'beach-bar': { src: bar },
  smoothie: { src: smoothie },
};

/** "Download Menu" when the PDF exists; otherwise the contact form, ready to ask for it. */
function MenuButton({ outlet }: { outlet: Outlet }) {
  const file = MENU_FILES[outlet.id];
  if (file) {
    return (
      <a className="h-menu-btn" href={file} download aria-label={`Download the ${outlet.name} menu (PDF)`}>
        <img src={download} alt="" width={16} height={16} />
        Download Menu
      </a>
    );
  }
  return (
    <Link className="h-menu-btn" to="/contact" state={{ message: `Could you send me the ${outlet.name} menu, please?` }} aria-label={`Request the ${outlet.name} menu`}>
      <Mail size={16} aria-hidden />
      Request Menu
    </Link>
  );
}

export function HomeDining({ cta = true }: { cta?: boolean }) {
  return (
    <section className="h-dining" id="dining" aria-labelledby="h-dining-title">
      <header className="h-dining-head">
        <div className="h-dining-text">
          <p className="h-dining-eyebrow">Island Dining</p>
          <h2 id="h-dining-title" className="h-dining-title">
            A Taste of Mahmya
          </h2>
          <p className="h-dining-lead">Complete your island experience with fresh flavors, refreshing drinks, and beautiful Red Sea views.</p>
        </div>
        {cta && (
          <Link to="/activities#dining" className="h-dining-cta">
            Explore Dining
          </Link>
        )}
      </header>
      <div className="h-dine-cards">
        {OUTLETS.map((o) => (
          <article key={o.id} className={`h-dine${o.id === 'buffet' ? ' wide' : ''}`} aria-labelledby={`h-dine-${o.id}`}>
            <div className="h-dine-photo">
              <img src={PHOTOS[o.id].src} alt="" loading="lazy" style={{ objectPosition: PHOTOS[o.id].position }} />
              {o.id === 'buffet' && <img className="h-dine-dots" src={dots} alt="" width={148} height={31} />}
            </div>
            <div className="h-dine-body">
              <div className="h-dine-info">
                <h3 id={`h-dine-${o.id}`}>{o.name}</h3>
                <p className="h-dine-text">{o.description}</p>
                <p className="h-dine-hours">
                  <img src={o.id === 'smoothie' ? clockSolid : clock} alt="" width={14} height={14} />
                  {o.hours}
                </p>
              </div>
              <MenuButton outlet={o} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
