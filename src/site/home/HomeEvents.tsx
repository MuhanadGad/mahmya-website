// "Celebrate Moments That Matter" (Figma 275:9655): the events banner — the
// island from above fading to white behind the text, with Plan Your Event.

import { Link } from 'react-router-dom';
import events from '../../assets/home/v2/events.jpg';

export function HomeEvents() {
  return (
    <section className="h-events" aria-labelledby="h-events-title">
      <div className="h-events-card">
        <img src={events} alt="" loading="lazy" />
        <div className="h-events-text">
          <p className="h-events-eyebrow">Events at Mahmya</p>
          <h2 id="h-events-title" className="h-events-title">
            Celebrate Moments That Matter
          </h2>
          <p className="h-events-body">
            Create unforgettable memories surrounded by the beauty of Mahmya Island.
            <br />
            From birthdays and anniversaries to private celebrations, the Red Sea creates the perfect backdrop for your special moments.
          </p>
          <Link to="/events" className="h-events-btn">
            Plan Your Event
          </Link>
        </div>
      </div>
    </section>
  );
}
