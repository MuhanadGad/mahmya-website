// "Celebrate Moments That Matter" (Figma 275:9655): the events banner — the
// island from above fading to white behind the text, with Plan Your Event.

import { Link } from 'react-router-dom';
import { Rich } from '../components/Rich';
import { useContent } from '../hooks';

export function HomeEvents() {
  const events = useContent()['home.events'];
  return (
    <section className="h-events" aria-labelledby="h-events-title">
      <div className="h-events-card">
        <img src={events.image} alt="" loading="lazy" />
        <div className="h-events-text">
          <p className="h-events-eyebrow">{events.eyebrow}</p>
          <h2 id="h-events-title" className="h-events-title">
            <Rich text={events.title} />
          </h2>
          <p className="h-events-body">
            <Rich text={events.body} />
          </p>
          <Link to="/events" className="h-events-btn">
            {events.button}
          </Link>
        </div>
      </div>
    </section>
  );
}
