// "A Taste of Mahmya" (Figma 275:9569, Dining Section – 4 Card Grid): four cards
// in a row — the wider Island Buffet, then À La Carte, Beach Bar and Smoothie
// bar — each with its hours and the menu.

import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Rich } from '../components/Rich';
import { useContent } from '../hooks';
import type { Venue } from '../site-content';
import clock from '../../assets/home/v2/clock-dark.svg';
import clockSolid from '../../assets/home/v2/clock-solid.svg';
import download from '../../assets/home/v2/download.svg';
import dots from '../../assets/home/v2/dots-dine.svg';

/** Where the original photos are cropped, as framed in the design. */
const FOCUS: Record<string, string> = { buffet: 'center 50%', 'a-la-carte': 'center 86%' };

/** "Download Menu" when a menu was uploaded (a PDF or image, opened in a new tab: the file is on the API's origin, where `download` is ignored); otherwise the contact form, ready to ask for it. */
function MenuButton({ outlet }: { outlet: Venue }) {
  if (outlet.menu) {
    return (
      <a className="h-menu-btn" href={outlet.menu} target="_blank" rel="noreferrer" download aria-label={`Download the ${outlet.name} menu (opens in a new tab)`}>
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
  const content = useContent();
  const head = content['home.dining'];
  return (
    <section className="h-dining" id="dining" aria-labelledby="h-dining-title">
      <header className="h-dining-head">
        <div className="h-dining-text">
          <p className="h-dining-eyebrow">{head.eyebrow}</p>
          <h2 id="h-dining-title" className="h-dining-title">
            <Rich text={head.title} />
          </h2>
          <p className="h-dining-lead">{head.lead}</p>
        </div>
        {cta && (
          <Link to="/activities#dining" className="h-dining-cta">
            {head.button}
          </Link>
        )}
      </header>
      <div className="h-dine-cards">
        {content.dining.venues.map((o, i) => (
          <article key={o.id} className={`h-dine${i === 0 ? ' wide' : ''}`} aria-labelledby={`h-dine-${o.id}`}>
            <div className="h-dine-photo">
              <img src={o.image} alt="" loading="lazy" style={{ objectPosition: o.image.startsWith('/content/') ? FOCUS[o.id] : undefined }} />
              {i === 0 && <img className="h-dine-dots" src={dots} alt="" width={148} height={31} />}
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
