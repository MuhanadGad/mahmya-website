// "Discover Mahmya" (Figma 513:9300): the introduction with the two overlapping
// boat photos (65:4903) and the speed-boat stamp (275:9497).

import { Link } from 'react-router-dom';
import yacht from '../../assets/home/intro-yacht.jpg';
import speedboat from '../../assets/home/intro-speedboat.jpg';
import stamp from '../../assets/home/v2/stamp-speedboat.png';

export function HomeIntro() {
  return (
    <section className="h-intro h-wrap wide" aria-labelledby="h-intro-title">
      <div className="h-intro-text">
        <p className="h-eyebrow">Discover Mahmya</p>
        <h2 id="h-intro-title" className="h-intro-title">
          The Red Sea Experience
          <br />
          You’ll Remember
        </h2>
        <span className="h-accent" aria-hidden />
        <p className="h-intro-body">
          A complete Red Sea experience on Big Giftun Island.
          <br />
          Set sail from Hurghada and discover a peaceful island escape with turquoise waters, beautiful beaches, unforgettable snorkeling, and authentic Egyptian hospitality.
        </p>
        <Link to="/island" className="h-btn-outline">
          Discover Mahmya Island
        </Link>
      </div>
      <div className="h-intro-collage">
        <img className="back" src={speedboat} alt="A speedboat skimming across the turquoise water off Big Giftun" loading="lazy" width={1044} height={756} />
        <img className="stamp" src={stamp} alt="" loading="lazy" width={193} height={198} />
        <img className="front" src={yacht} alt="A Mahmya boat anchored in the clear shallows by the island" loading="lazy" width={1090} height={805} />
      </div>
    </section>
  );
}
