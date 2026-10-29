// Hero (Figma 275:9509 "Component 11" and the booking bar 275:9670): the looping
// island video under the white wave, the headline with its tag, today's weather,
// the "Watch Mahmya Tours" control and the booking bar across the bottom. The
// video can be paused, and doesn't autoplay for reduced motion.

import { useEffect, useRef, useState } from 'react';
import { BookingEngine } from '../components/BookingEngine';
import { HeroWeather } from '../components/HeroWeather';
import { useReducedMotion } from '../hooks';
import heroVideo from '../../assets/home/hero.mp4';
import heroPoster from '../../assets/home/hero-poster.jpg';
import watchBump from '../../assets/home/v2/watch-bump.svg';
import watchArc from '../../assets/home/v2/watch-arc.svg';
import watchPlay from '../../assets/home/v2/watch-play.svg';

export function HomeHero() {
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState<boolean | null>(null);
  const playing = paused === null ? !reduced : !paused;

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing) v.play().catch(() => setPaused(true));
    else v.pause();
  }, [playing]);

  return (
    <section className="h-hero" aria-labelledby="h-hero-title">
      <div className="h-hero-copy">
        <p className="h-hero-tag">Mahmya · Giftun Island</p>
        <h1 id="h-hero-title" className="h-hero-title">
          Your Mahmya
          <br />
          Island Escape <span>Starts Here.</span>
        </h1>
      </div>
      {/* On desktop the stage dissolves into the hero; on smaller screens it's the framed video. */}
      <div className="h-hero-stage">
        <div className="h-hero-media" aria-hidden>
          <video ref={video} src={heroVideo} poster={heroPoster} muted loop playsInline preload="auto" tabIndex={-1} />
        </div>
        <div className="h-hero-weather">
          <HeroWeather />
        </div>
        <button type="button" className="h-hero-watch" onClick={() => setPaused(playing)} aria-pressed={!playing} aria-label={playing ? 'Pause the Mahmya tour video' : 'Watch the Mahmya tour video'}>
          <img className="bump" src={watchBump} alt="" width={134} height={104} />
          <img className="arc" src={watchArc} alt="" width={82} height={28} />
          {playing ? (
            <span className="pause" aria-hidden>
              <i />
              <i />
            </span>
          ) : (
            <img className="play" src={watchPlay} alt="" width={38} height={38} />
          )}
        </button>
      </div>
      <div className="h-hero-engine">
        <BookingEngine />
      </div>
    </section>
  );
}
