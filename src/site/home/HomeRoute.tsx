// "Mahmya Island Experiences" (Figma 275:9542, Component 8): the day as a dashed
// route with ten stops. A photo card travels to each stop in turn while the
// section is on screen; any stop can be chosen, the tour can be paused, and
// "Skip" moves on to the next section. Reduced motion: no autoplay.

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Rich } from '../components/Rich';
import { useContent, useInView, useReducedMotion } from '../hooks';
import route from '../../assets/home/v2/route.svg';
import stampPalm from '../../assets/home/v2/stamp-palm.svg';
import stampPalmSmall from '../../assets/home/v2/stamp-palm-small.svg';
import shell from '../../assets/home/v2/shell.svg';
import starfish from '../../assets/home/v2/starfish.svg';
import clock from '../../assets/home/v2/clock-white.svg';

const STEP_MS = 4500;
/** The ten pins of the route, in the route drawing's own units (1600.6 × 473.35), in travel order. */
const PINS: [number, number][] = [
  [20.8, 22],
  [273.8, 147],
  [439.8, 188],
  [555.8, 323],
  [701.8, 450],
  [870.6, 375.9],
  [1050.6, 363.9],
  [1222.8, 378],
  [1370.8, 230],
  [1579.8, 180],
];
const ROUTE_W = 1600.6;
const ROUTE_H = 473.35;
const CARD_W = 557;

export function HomeRoute() {
  const content = useContent();
  const { stops } = content.islandStops;
  const head = content['home.route'];
  const section = useRef<HTMLElement>(null);
  const visible = useInView(section);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState<boolean | null>(null);
  const playing = stopped === null ? !reduced : !stopped;
  const stop = stops[active];

  useEffect(() => {
    if (!playing || !visible) return;
    const t = window.setInterval(() => setActive((i) => (i + 1) % stops.length), STEP_MS);
    return () => window.clearInterval(t);
  }, [playing, visible, stops.length]);

  const skip = () => {
    setStopped(true);
    const next = section.current?.nextElementSibling as HTMLElement | null;
    next?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  // The card follows the active pin, kept inside the section.
  const [px] = PINS[active];
  const cardLeft = Math.min(Math.max(px + 159.7 - CARD_W / 2, 100), 1920 - 100 - CARD_W);

  return (
    <section className="h-route" ref={section} aria-labelledby="h-route-title" style={{ '--card-x': cardLeft } as CSSProperties}>
      <img className="h-route-deco palm" src={stampPalm} alt="" width={172} height={245} />
      <img className="h-route-deco palm-small" src={stampPalmSmall} alt="" width={106} height={152} />
      <img className="h-route-deco shell" src={shell} alt="" width={145} height={137} />
      <img className="h-route-deco starfish" src={starfish} alt="" width={84} height={89} />

      <header className="h-route-head">
        <p className="h-route-eyebrow">{head.eyebrow}</p>
        <h2 id="h-route-title" className="h-route-title">
          <Rich text={head.title} />
        </h2>
        <span className="h-route-accent" aria-hidden />
      </header>

      <div className="h-route-actions">
        <button type="button" className="h-route-pill" onClick={() => setStopped(playing)} aria-pressed={!playing}>
          {playing ? 'Pause ❚❚' : 'Play ▶'}
        </button>
        <button type="button" className="h-route-pill" onClick={skip}>
          Skip ›
        </button>
      </div>

      <div className="h-route-map">
        <img className="h-route-line" src={route} alt="" width={ROUTE_W} height={ROUTE_H} />
        <ol className="h-route-pins" aria-label="The island day">
          {stops.map((s, i) => (
            <li key={i} style={{ left: `${(PINS[i][0] / ROUTE_W) * 100}%`, top: `${(PINS[i][1] / ROUTE_H) * 100}%` }}>
              <button type="button" className={i === active ? 'on' : undefined} aria-current={i === active ? 'step' : undefined} onClick={() => (setActive(i), setStopped(true))}>
                <span className="h-route-pin" aria-hidden />
                <span className="h-route-pin-label">
                  {s.time} · {s.label}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <article className="h-route-card" aria-live={playing ? 'off' : 'polite'}>
        {stops.map((s, i) => (
          <img key={i} src={s.image} alt={i === active ? s.title : ''} className={i === active ? 'on' : undefined} loading="lazy" />
        ))}
        <div className="h-route-glass">
          <h3>{stop.title}</h3>
          <p>{stop.text}</p>
          <p className="h-route-time">
            <img src={clock} alt="" width={14} height={14} />
            {stop.time}
          </p>
        </div>
      </article>
    </section>
  );
}
