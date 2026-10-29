// "Hero Photo" (Figma 955:6005) with the premium booking engine (914:3362).

import heroPhoto from '../../assets/site/hero/hero-photo.jpg';
import sheet from '../../assets/site/hero/sheet.svg';
import { BookingEngine } from '../components/BookingEngine';
import { WeatherCard } from '../components/WeatherCard';

export function Hero() {
  return (
    <section className="s-hero" aria-labelledby="s-hero-title">
      <div className="s-hero-photo">
        <img src={heroPhoto} alt="Aerial view of Mahmya’s beach, reef and sunshades on Big Giftun" fetchPriority="high" />
        <div className="s-hero-scrim" />
      </div>
      <img className="s-hero-sheet" src={sheet} alt="" aria-hidden />
      <div className="s-hero-body">
        <div className="s-hero-content">
          <h1 id="s-hero-title" className="s-hero-title">
            Discover the <em>Red Sea’s</em>
            <br />
            Island Escape.
          </h1>
          <p className="s-hero-text">Welcome to Mahmya, a protected island on Big Giftun. Spend the day on white sand, snorkel clear reefs, and enjoy authentic Red Sea hospitality.</p>
        </div>
        <WeatherCard />
      </div>
      <div className="s-hero-engine">
        <BookingEngine />
      </div>
    </section>
  );
}
