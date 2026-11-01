// "One day, beautifully unfolded." — the photo timeline with the marina map
// (Figma 704:1022). Each stop shows its own photo, time and description. On the
// homepage (559:7826) the day plays through on its own, with a pause button.

import { useEffect, useRef, useState } from 'react';
import { Clock, MapPin, Pause, Plane, Play } from 'lucide-react';
import { Eyebrow } from '../components/ui';
import { Rich } from '../components/Rich';
import { useContent, useInView, useReducedMotion } from '../hooks';
import marinaMap from '../../assets/site/island/marina-map.png';

const STEP_MS = 5000;

/** `home`: the homepage version (559:7826) — full width, and the day plays on its own. */
export function IslandDay({ home = false }: { home?: boolean }) {
  const autoplay = home;
  const wrap = home ? 'h-wrap' : 's-container';
  const content = useContent();
  const { stops } = content.islandStops;
  const page = content['island.page'];
  const location = content.location;
  const [active, setActive] = useState(0);
  const stop = stops[active];
  const section = useRef<HTMLElement>(null);
  const visible = useInView(section);
  const reduced = useReducedMotion();
  const [stopped, setStopped] = useState<boolean | null>(null);
  const playing = autoplay && (stopped === null ? !reduced : !stopped);

  useEffect(() => {
    if (!playing || !visible) return;
    const t = window.setInterval(() => setActive((i) => (i + 1) % stops.length), STEP_MS);
    return () => window.clearInterval(t);
  }, [playing, visible, stops.length]);

  return (
    <section className="s-islandday" aria-labelledby="s-islandday-title" ref={section}>
      <header className={`${wrap} s-islandday-head`}>
        <Eyebrow>{page.dayEyebrow}</Eyebrow>
        <h2 id="s-islandday-title" className="s-islandday-title">
          <Rich text={page.dayTitle} />
        </h2>
        <p>{page.dayText}</p>
      </header>
      <div className={`${wrap} s-islandday-grid`}>
        <div className="s-islandday-photo">
          {stops.map((s, i) => (
            <img key={i} src={s.image} alt={i === active ? s.title : ''} className={i === active ? 'on' : undefined} loading={i === 0 ? 'eager' : 'lazy'} />
          ))}
        </div>
        <div className="s-islandday-side">
          <div className="s-islandday-card map" id="location">
            <a href={content.links.maps} target="_blank" rel="noreferrer" className="s-islandday-map" aria-label={`Open ${location.marinaName} in Google Maps`}>
              <img src={marinaMap} alt="Map showing Mahmya Beach Marina on Sheraton Road, Hurghada" loading="lazy" />
            </a>
            <div className="s-landmarks">
              <div>
                <span className="s-landmark-ico" aria-hidden>
                  <Plane size={20} />
                </span>
                <div>
                  <p>{location.airportName}</p>
                  <small>{location.airportDistance}</small>
                </div>
              </div>
              <div>
                <span className="s-landmark-ico" aria-hidden>
                  <MapPin size={20} />
                </span>
                <div>
                  <p>{location.townName}</p>
                  <small>{location.townDistance}</small>
                </div>
              </div>
            </div>
          </div>
          <div className="s-islandday-card stop" aria-live={playing ? 'off' : 'polite'}>
            <p className="s-islandday-stop">{stop.title}</p>
            <p className="s-islandday-text">{stop.text}</p>
            <p className="s-islandday-time">
              <Clock size={30} aria-hidden />
              {stop.time}
            </p>
          </div>
        </div>
      </div>
      <div className={`${wrap}${autoplay ? ' s-timeline-wrap' : ''}`}>
        {autoplay && (
          <button type="button" className="s-timeline-play" onClick={() => setStopped(playing)} aria-pressed={!playing} aria-label={playing ? 'Pause the day' : 'Play the day'}>
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
        )}
        <ol className="s-timeline" style={{ '--progress': `${(active / (stops.length - 1)) * 100}%` } as React.CSSProperties}>
          {stops.map((s, i) => (
            <li key={i}>
              <button type="button" className={i === active ? 'on' : i < active ? 'done' : undefined} aria-current={i === active ? 'step' : undefined} onClick={() => (setActive(i), autoplay && setStopped(true))}>
                <span className="s-timeline-dot" aria-hidden />
                <span className="s-timeline-label">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
