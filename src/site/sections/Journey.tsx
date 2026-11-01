// "One Day, Beautifully Unfolded" — the radial island-day timeline (Figma 914:4292).
// Steps advance on their own (paused on hover/focus and for reduced motion) and
// can be chosen directly.

import { useEffect, useState } from 'react';
import { Eyebrow } from '../components/ui';
import { Rich } from '../components/Rich';
import { useContent } from '../hooks';
import central from '../../assets/site/journey/central-image.jpg';
import orbit from '../../assets/site/journey/orbit-path.png';
import halo from '../../assets/site/journey/halo.svg';
import ring1 from '../../assets/site/journey/ring-1.svg';
import ring2 from '../../assets/site/journey/ring-2.svg';
import ring3 from '../../assets/site/journey/ring-3.svg';
import ring4 from '../../assets/site/journey/ring-4.svg';
import ring5 from '../../assets/site/journey/ring-5.svg';

const RINGS = [ring5, ring4, ring3, ring2, ring1];
/** Horizontal offsets that make the cards follow the orbit (from the design). */
const SHIFT = [60, 0, 17, 58, 0, 96, 129, 17];

export function Journey() {
  const { eyebrow, title, steps } = useContent().daySteps;
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % steps.length), 4000);
    return () => window.clearInterval(t);
  }, [paused, steps.length]);

  const step = (i: number) => {
    const s = steps[i];
    const side = i < 4 ? 'left' : 'right';
    return (
      <li key={i} className={`s-step ${side}${i === active ? ' active' : ''}${i < active ? ' done' : ''}`} style={{ '--shift': SHIFT[i] } as React.CSSProperties}>
        <button type="button" onClick={() => setActive(i)} aria-current={i === active ? 'step' : undefined}>
          <span className="s-step-card">
            <span className="s-step-time">{s.time}</span>
            <span className="s-step-title">{s.title}</span>
            <span className="s-step-text">{s.text}</span>
          </span>
          <span className="s-step-dot" aria-hidden>
            {i + 1}
          </span>
        </button>
      </li>
    );
  };

  return (
    <section className="s-journey" aria-labelledby="s-journey-title">
      <div className="s-container s-journey-head">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id="s-journey-title" className="s-title-xl">
          <Rich text={title} />
        </h2>
      </div>
      <div className="s-journey-canvas" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        <div className="s-journey-rings" aria-hidden>
          {RINGS.map((r, i) => (
            <img key={r} src={r} alt="" style={{ width: `${1080 - i * 160}px` }} />
          ))}
        </div>
        <ol className="s-journey-steps left">{[0, 1, 2, 3].map(step)}</ol>
        <div className="s-journey-center">
          <img className="s-journey-halo" src={halo} alt="" aria-hidden />
          <img className="s-journey-orbit" src={orbit} alt="" aria-hidden />
          <img className="s-journey-image" src={central} alt="A boat anchored off Mahmya’s white beach and turquoise reef" loading="lazy" />
          <p className="s-journey-now" aria-live="polite">
            <span>{steps[active].time}</span> {steps[active].title}
          </p>
        </div>
        <ol className="s-journey-steps right" start={5}>
          {[4, 5, 6, 7].map(step)}
        </ol>
      </div>
    </section>
  );
}
