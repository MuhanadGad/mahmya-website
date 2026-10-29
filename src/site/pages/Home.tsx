// Homepage — Figma frame 275:9496 ("Homepage - 4"), section by section. The
// previous homepage (962:1980) is kept at /olddesign.

import { usePageTitle } from '../format';
import { HomeExplore } from '../home/HomeExplore';
import { HomeDining } from '../home/HomeDining';
import { HomeEvents } from '../home/HomeEvents';
import { HomeHero } from '../home/HomeHero';
import { HomeIntro } from '../home/HomeIntro';
import { HomePackages } from '../home/HomePackages';
import { HomeRoute } from '../home/HomeRoute';
import { Reviews } from '../sections/Reviews';
import { VirtualTour } from '../sections/VirtualTour';
import stampDining from '../../assets/home/v2/stamp-dining.png';
import stampGuests from '../../assets/home/v2/stamp-guests.png';

export function Home() {
  usePageTitle('');
  return (
    <div className="h-home">
      <HomeHero />
      <HomeIntro />
      <HomePackages />
      <HomeRoute />
      <HomeExplore />
      <HomeDining />
      <div className="h-reviews-wrap">
        <img className="h-stamp dining" src={stampDining} alt="" loading="lazy" width={149} height={153} />
        <img className="h-stamp guests" src={stampGuests} alt="" loading="lazy" width={266} height={268} />
        <Reviews />
      </div>
      <VirtualTour home />
      <HomeEvents />
    </div>
  );
}
