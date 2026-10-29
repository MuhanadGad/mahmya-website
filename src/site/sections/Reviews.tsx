// "What Guests Saying About Mahmya Island" — feature card, stats and the review
// carousel (Figma 917:4614).

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Sun, Users } from 'lucide-react';
import { Eyebrow, Stars } from '../components/ui';
import { REVIEWS } from '../content';
import featureBg from '../../assets/site/reviews/feature-bg.jpg';
import tripadvisor from '../../assets/site/reviews/tripadvisor.svg';

export function Reviews() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;
      setIndex(Math.round(el.scrollLeft / (card.offsetWidth + 20)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const next = Math.max(0, Math.min(REVIEWS.length - 1, i));
    el.scrollTo({ left: next * (card.offsetWidth + 20), behavior: 'smooth' });
  };

  return (
    <section className="s-reviews" aria-labelledby="s-reviews-title">
      <header className="s-reviews-head s-container">
        <Eyebrow>Guest experiences</Eyebrow>
        <h2 id="s-reviews-title" className="s-title-lg">
          What Guests Saying About Mahmya Island
        </h2>
        <p className="s-reviews-sub">Thousands of travelers visit Mahmya Island to experience its natural beauty, welcoming hospitality, and unforgettable Red Sea moments.</p>
        <span className="s-accent-line" aria-hidden />
      </header>
      <div className="s-reviews-track-wrap">
        <div className="s-reviews-feature">
          <div className="s-feature-card">
            <img src={featureBg} alt="" loading="lazy" />
            <div className="s-feature-body">
              <span className="s-feature-pill">Island Experience</span>
              <p className="s-feature-title">
                More than
                <br />
                <span>a beach day.</span>
              </p>
              <p className="s-feature-text">Snorkel crystal waters, relax on pristine sands, and explore Big Giftun Island — all in one unforgettable day.</p>
              <Link to="/island" className="s-feature-cta">
                Explore the Island <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <dl className="s-stats">
            <div>
              <span className="s-stat-ico blue" aria-hidden>
                <Users size={22} />
              </span>
              <dt>Happy Guests</dt>
              <dd>2,000+</dd>
            </div>
            <div>
              <span className="s-stat-ico green" aria-hidden>
                <Star size={22} />
              </span>
              <dt>Average Rating</dt>
              <dd>5 Star</dd>
            </div>
            <div>
              <span className="s-stat-ico orange" aria-hidden>
                <Sun size={22} />
              </span>
              <dt>Verified Reviews</dt>
              <dd>500+</dd>
            </div>
          </dl>
        </div>
        <div className="s-reviews-carousel">
          <div className="s-reviews-track" ref={track} tabIndex={0} aria-label="Guest reviews" role="region">
            {REVIEWS.map((r) => (
              <article key={r.name} className="s-review">
                <header>
                  {r.avatar ? <img className="s-review-avatar" src={r.avatar} alt="" loading="lazy" /> : <span className={`s-review-avatar initials ${r.tint}`}>{r.initials}</span>}
                  <div>
                    <p className="s-review-name">{r.name}</p>
                    <p className="s-review-when">{r.when}</p>
                  </div>
                  <span className={`s-review-source ${r.source}`} title={r.source === 'google' ? 'Google review' : 'Tripadvisor review'}>
                    {r.source === 'google' ? 'G' : <img src={tripadvisor} alt="Tripadvisor" width={22} height={22} />}
                  </span>
                </header>
                <Stars rating={r.rating} />
                <p className="s-review-text">{r.text}</p>
                <div className="s-review-photos">
                  {r.photos.map((p, i) => (
                    <img key={i} src={p} alt="" loading="lazy" />
                  ))}
                </div>
              </article>
            ))}
          </div>
          <button type="button" className="s-round-nav prev" onClick={() => go(index - 1)} disabled={index <= 0} aria-label="Previous review">
            <ChevronLeft size={20} />
          </button>
          <button type="button" className="s-round-nav next" onClick={() => go(index + 1)} disabled={index >= REVIEWS.length - 1} aria-label="Next review">
            <ChevronRight size={20} />
          </button>
          <div className="s-dots" role="tablist" aria-label="Choose a review">
            {REVIEWS.map((r, i) => (
              <button key={r.name} type="button" role="tab" aria-selected={i === index} aria-label={`Review ${i + 1} of ${REVIEWS.length}`} className={i === index ? 'on' : undefined} onClick={() => go(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
