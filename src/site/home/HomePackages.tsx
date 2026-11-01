// "Experiences – Swipe Carousel" (Figma 513:9313): the five packages, opening
// centred on the most popular one.

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PackageCard } from '../components/PackageCard';
import { childNote, usePackages } from '../../lib/packages';
import { Rich } from '../components/Rich';
import { useContent } from '../hooks';
import stamp from '../../assets/home/v2/stamp-programs.png';

export function HomePackages() {
  const row = useRef<HTMLDivElement>(null);
  const packages = usePackages();
  const head = useContent()['home.packages'];
  useEffect(() => {
    const el = row.current;
    const featured = el?.querySelector<HTMLElement>('.s-pkg.featured');
    if (!el || !featured || el.scrollWidth <= el.clientWidth) return;
    const item = featured.parentElement as HTMLElement;
    el.scrollLeft = item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2;
  }, []);

  return (
    <section className="h-packages" aria-labelledby="h-packages-title">
      <img className="h-packages-stamp" src={stamp} alt="" loading="lazy" width={193} height={196} />
      <header className="h-wrap wide h-packages-head">
        <p className="h-eyebrow">{head.eyebrow}</p>
        <div className="h-title-row">
          <h2 id="h-packages-title" className="h-title">
            <Rich text={head.title} />
          </h2>
          <Link to="/packages" className="h-btn-outline small">
            {head.button}
          </Link>
        </div>
        <p className="h-lead">{head.lead}</p>
      </header>
      <div className="s-packages-row h-packages-row" role="list" ref={row}>
        {packages
          .filter((p) => p.status === 'active')
          .map((p) => (
            <div role="listitem" key={p.id} className="s-packages-item">
              <PackageCard program={p} />
            </div>
          ))}
      </div>
      <p className="s-child-note">
        {childNote(packages)} • Children under 3 are <strong>FREE</strong>
      </p>
    </section>
  );
}
