// "The Red Sea Experience You'll Remember" with the illustrated route map (Figma 914:3420–3422, 914:3408).

import { Link } from 'react-router-dom';
import { Rich } from '../components/Rich';
import { useContent } from '../hooks';
import redSeaMap from '../../assets/site/intro/red-sea-map.jpg';

export function Intro({ withButton = true }: { withButton?: boolean }) {
  const intro = useContent()['home.intro'];
  return (
    <section className="s-intro" aria-labelledby="s-intro-title">
      <div className="s-container s-intro-head">
        <h2 id="s-intro-title" className="s-intro-title">
          <Rich text={intro.title} />
        </h2>
        <p className="s-intro-text">
          <Rich text={intro.body} />
        </p>
        {withButton && (
          <Link to="/island" className="s-btn s-btn-outline">
            {intro.button}
          </Link>
        )}
      </div>
      <figure className="s-intro-map">
        <img
          src={redSeaMap}
          alt="Illustrated map: boats leave Mahmya Beach Marina in Hurghada, pass Dolphin House and reach Mahmya Island on Big Giftun; Small Giftun lies to the south."
          loading="lazy"
          width={1680}
          height={940}
        />
      </figure>
    </section>
  );
}
