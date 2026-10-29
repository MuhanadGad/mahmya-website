// Guest information pages: FAQs, booking terms, cancellation policy and 404.

import { Link } from 'react-router-dom';
import { SAME_DAY_CLOSE_BEFORE_CHECK_IN_MIN } from '../../../shared/cloud.ts';
import { FREE_CANCELLATION_HOURS } from '../../../shared/website.ts';
import { PageHeader } from '../components/ui';
import { usePageTitle } from '../format';
import { FAQS } from '../content';

export function Faq() {
  usePageTitle('FAQs');
  return (
    <>
      <PageHeader eyebrow="Guest support" title={<>Frequently asked <em>questions</em>.</>} />
      <section className="s-section">
        <div className="s-container s-prose">
          {FAQS.map((f) => (
            <details key={f.q} className="s-faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
          <p>
            Still have a question? <Link to="/contact">Send us a message</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

export function Terms() {
  usePageTitle('Booking terms');
  return (
    <>
      <PageHeader eyebrow="Guest support" title={<>Booking <em>terms</em>.</>} />
      <section className="s-section">
        <div className="s-container s-prose">
          <h2>Your booking</h2>
          <p>A booking reserves places on the island and on our boats for the date, boat and package you choose. The lead guest books for the whole party. Bring your booking code to the marina.</p>
          <h2>Prices and payment</h2>
          <p>Prices are per person in euros and include the round-trip boat transfer. Children aged 3–11 pay 50% of the adult price; children under 3 are free. You pay at check-in by card or in cash. Prices are the same for every guest.</p>
          <h2>Online bookings</h2>
          <p>Online bookings open up to a year ahead. Same-day bookings close {SAME_DAY_CLOSE_BEFORE_CHECK_IN_MIN} minutes before check-in for your boat (Hurghada time). Parties of more than 30, and events, are arranged by our events team.</p>
          <h2>On the island</h2>
          <p>Please follow the instructions of the crew and lifeguards. Water sports run subject to safety checks and the weather on the day.</p>
          <h2>Weather</h2>
          <p>The marina authority suspends sailings when wind speeds reach 34 km/h. If sailings are suspended on your day, we cancel your booking free of charge or move it to another date.</p>
          <p>
            See also the <Link to="/cancellation-policy">cancellation policy</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

export function Cancellation() {
  usePageTitle('Cancellation policy');
  return (
    <>
      <PageHeader eyebrow="Guest support" title={<>Cancellation <em>policy</em>.</>} />
      <section className="s-section">
        <div className="s-container s-prose">
          <ul>
            <li>
              <strong>Free cancellation</strong> until {FREE_CANCELLATION_HOURS} hours before check-in for your boat. Cancel online on the <Link to="/booking">Manage booking</Link> page with your code and email.
            </li>
            <li>
              <strong>Within {FREE_CANCELLATION_HOURS} hours</strong> of check-in, please <Link to="/contact">contact us</Link> — we will do our best to move your booking to another date.
            </li>
            <li>
              <strong>Weather:</strong> if the marina suspends sailings, your booking is cancelled free of charge or moved, as you prefer.
            </li>
            <li>
              <strong>Bookings through hotels or tour operators</strong> follow the terms of the company you booked with.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  usePageTitle('Page not found');
  return (
    <PageHeader eyebrow="404" title={<>This page has <em>drifted away</em>.</>} subtitle="The page you’re looking for isn’t here.">
      <div className="s-header-actions">
        <Link to="/" className="s-btn s-btn-primary s-btn-lg">
          Back to the homepage
        </Link>
      </div>
    </PageHeader>
  );
}
