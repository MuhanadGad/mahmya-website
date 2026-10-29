// "Choose Your Mahmya Experience" — the five packages guests can book (Figma 914:4288, 914:4037).

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PackageCard } from '../components/PackageCard';
import { Eyebrow } from '../components/ui';
import { childNote, usePackages } from '../../lib/packages';

export function Packages({ seeAll = true }: { seeAll?: boolean }) {
  const row = useRef<HTMLDivElement>(null);
  const packages = usePackages();
  // When the row is wider than the screen, open it centred on the most popular package.
  useEffect(() => {
    const el = row.current;
    const featured = el?.querySelector<HTMLElement>('.s-pkg.featured');
    if (!el || !featured || el.scrollWidth <= el.clientWidth) return;
    const item = featured.parentElement as HTMLElement;
    el.scrollLeft = item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2;
  }, []);
  return (
    <section className="s-packages" aria-labelledby="s-packages-title">
      <div className="s-container s-packages-head">
        <Eyebrow>Packages</Eyebrow>
        <h2 id="s-packages-title" className="s-title-xl">
          Choose Your Mahmya Experience
        </h2>
        {seeAll && (
          <Link to="/packages" className="s-btn s-btn-outline s-btn-sm">
            See all Programs
          </Link>
        )}
      </div>
      <div className="s-packages-row" role="list" ref={row}>
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
