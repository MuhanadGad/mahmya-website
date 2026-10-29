// "PackageCard" (Figma 22:3275 / 22:3530): package photo, prices (adult and
// child 3–11, from the cloud system for its programs — the same price for every
// guest), what's included and Book Now.

import { Link } from 'react-router-dom';
import { displayRate } from '../../../shared/cloud.ts';
import type { PackageDef } from '../../../shared/packages.ts';
import { includeIcon, photoOf } from '../../lib/packages';
import { eur } from '../format';
import { islandToday, useCatalog } from '../hooks';

export function PackageCard({ program, featured = program.featured }: { program: PackageDef; featured?: boolean }) {
  const { adult, child } = displayRate(useCatalog(), program.id, islandToday());
  return (
    <article className={`s-pkg${featured ? ' featured' : ''}`} aria-labelledby={`pkg-${program.id}`}>
      <div className="s-pkg-photo">
        <img src={photoOf(program.photo)} alt="" loading="lazy" />
        {featured && <span className="s-pkg-badge">Most popular</span>}
      </div>
      <div className="s-pkg-title">
        <h3 id={`pkg-${program.id}`}>{program.name}</h3>
        <p>{program.tagline}</p>
      </div>
      <div className="s-pkg-prices">
        <div className="s-pkg-price-row">
          <div>
            <span className="s-pkg-k">Adult</span>
            <span className="s-pkg-adult">{eur(adult)}</span>
          </div>
          <div className="s-pkg-child">
            <span className="s-pkg-k">Child (3–11)</span>
            <span>{eur(child)}</span>
          </div>
        </div>
      </div>
      <hr />
      <div className="s-pkg-includes">
        <span className="s-pkg-k">What’s included</span>
        <ul>
          {program.includes.map((text) => {
            const Icon = includeIcon(text);
            return (
              <li key={text}>
                <span className="s-pkg-ico" aria-hidden>
                  <Icon size={featured ? 14 : 11} strokeWidth={2} />
                </span>
                {text}
              </li>
            );
          })}
        </ul>
      </div>
      <Link to={`/book?program=${program.id}`} className={`s-pkg-cta${featured ? ' primary' : ''}`} aria-label={`Book ${program.name}`}>
        Book Now
      </Link>
    </article>
  );
}
