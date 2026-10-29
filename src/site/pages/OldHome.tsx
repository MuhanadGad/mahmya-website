// The previous homepage — Figma frame 962:1980 ("Homepage"), section by section —
// kept at /olddesign with its own centred navigation and footer.

import { usePageTitle } from '../format';
import { Activities } from '../sections/Activities';
import { Dining } from '../sections/Dining';
import { GallerySection } from '../sections/Gallery';
import { Hero } from '../sections/Hero';
import { Intro } from '../sections/Intro';
import { Journey } from '../sections/Journey';
import { Packages } from '../sections/Packages';
import { Reviews } from '../sections/Reviews';
import { VirtualTour } from '../sections/VirtualTour';

export default function OldHome() {
  usePageTitle('Previous design');
  return (
    <>
      <Hero />
      <Intro />
      <Packages />
      <Journey />
      <Activities />
      <Dining />
      <Reviews />
      <GallerySection />
      <VirtualTour />
    </>
  );
}
