// "Explore Mahmya Island Your Way" (Figma 275:9543, activities-bento-section):
// the island's activities as round photos in four columns, and the "Did You
// Know?" card with Red Sea facts that turn over on their own (or by the dots).

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent, useInView, useReducedMotion } from '../hooks';
import snorkeling from '../../assets/home/v2/act-snorkeling.jpg';
import paddle from '../../assets/home/v2/act-paddle.jpg';
import volleyball from '../../assets/home/v2/act-volleyball.jpg';
import seaspi from '../../assets/home/v2/act-seaspi.jpg';
import football from '../../assets/home/v2/act-football.jpg';
import banana from '../../assets/home/v2/act-banana.jpg';
import kayak from '../../assets/home/v2/act-kayak.jpg';
import ringo from '../../assets/home/v2/act-ringo.jpg';

type Activity = { name: string; image: string; to: string; size: number; position?: string };

/** Four columns of two, in the design's order. Paid water sports open the booking page with the add-on chosen. */
const COLUMNS: [Activity, Activity][] = [
  [
    { name: 'Snorkeling Adventure', image: snorkeling, to: '/activities', size: 150 },
    { name: 'Stand-Up Paddle', image: paddle, to: '/book?addon=sup', size: 150 },
  ],
  [
    { name: 'Beach Volleyball', image: volleyball, to: '/activities', size: 160 },
    { name: 'Sea-Spi Double', image: seaspi, to: '/book?addon=seaspi-15', size: 150 },
  ],
  [
    { name: 'Football', image: football, to: '/activities', size: 150 },
    { name: 'Banana Boat', image: banana, to: '/book?addon=banana', size: 150, position: 'center 74%' },
  ],
  [
    { name: 'Single or Double Kayak', image: kayak, to: '/book?addon=kayak-single', size: 150 },
    { name: 'Ringo Ride', image: ringo, to: '/book?addon=ringo', size: 150 },
  ],
];

const FACT_MS = 8000;

export function HomeExplore() {
  const { title: factsTitle, facts } = useContent()['home.facts'];
  const card = useRef<HTMLDivElement>(null);
  const visible = useInView(card);
  const reduced = useReducedMotion();
  const [fact, setFact] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (reduced || held || !visible) return;
    const t = window.setInterval(() => setFact((i) => (i + 1) % facts.length), FACT_MS);
    return () => window.clearInterval(t);
  }, [reduced, held, visible, facts.length]);

  return (
    <section className="h-explore" aria-labelledby="h-explore-title">
      <header className="h-explore-head">
        <p className="h-explore-eyebrow">Activities</p>
        <h2 id="h-explore-title" className="h-explore-title">
          Explore Mahmya Island Your Way
        </h2>
      </header>
      <div className="h-explore-grid">
        <ul className="h-explore-acts" aria-label="Activities on the island">
          {COLUMNS.map((col, c) => (
            <li key={c} className="h-explore-col">
              {col.map((a) => (
                <Link key={a.name} to={a.to} className="h-explore-act">
                  <span className="h-explore-photo" style={{ width: a.size, height: a.size }}>
                    <img src={a.image} alt="" loading="lazy" style={{ objectPosition: a.position }} />
                  </span>
                  <span className="h-explore-name">{a.name}</span>
                </Link>
              ))}
            </li>
          ))}
        </ul>
        <div className="h-dyk" ref={card} onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
          <div className="h-dyk-body">
            <h3 className="h-dyk-title">{factsTitle}</h3>
            <p className="h-dyk-text" aria-live="polite">
              {facts[fact % facts.length].text}
            </p>
          </div>
          <div className="h-dyk-dots" role="tablist" aria-label="Facts">
            {facts.map((_, i) => (
              <button key={i} type="button" role="tab" aria-selected={i === fact} aria-label={`Fact ${i + 1} of ${facts.length}`} className={i === fact ? 'on' : undefined} onClick={() => setFact(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
