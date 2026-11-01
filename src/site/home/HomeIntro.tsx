// "Discover Mahmya" (Figma 513:9300): the introduction with the two overlapping
// boat photos (65:4903) and the speed-boat stamp (275:9497).

import { Link } from 'react-router-dom';
import { Rich } from '../components/Rich';
import { useContent } from '../hooks';
import stamp from '../../assets/home/v2/stamp-speedboat.png';

export function HomeIntro() {
  const intro = useContent()['home.intro'];
  return (
    <section className="h-intro h-wrap wide" aria-labelledby="h-intro-title">
      <div className="h-intro-text">
        <p className="h-eyebrow">{intro.eyebrow}</p>
        <h2 id="h-intro-title" className="h-intro-title">
          <Rich text={intro.title} />
        </h2>
        <span className="h-accent" aria-hidden />
        <p className="h-intro-body">
          <Rich text={intro.body} />
        </p>
        <Link to="/island" className="h-btn-outline">
          {intro.button}
        </Link>
      </div>
      <div className="h-intro-collage">
        <img className="back" src={intro.backImage} alt={intro.backImageAlt} loading="lazy" width={1044} height={756} />
        <img className="stamp" src={stamp} alt="" loading="lazy" width={193} height={198} />
        <img className="front" src={intro.frontImage} alt={intro.frontImageAlt} loading="lazy" width={1090} height={805} />
      </div>
    </section>
  );
}
