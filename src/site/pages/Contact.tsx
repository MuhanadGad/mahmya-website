import { Clock, Mail, MapPin, Navigation } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { FALLBACK_TRIPS, checkInTime, formatTime } from '../../../shared/cloud.ts';
import { EnquiryForm } from '../components/EnquiryForm';
import { PageHeader } from '../components/ui';
import { usePageTitle } from '../format';
import { LINKS } from '../content';
import { useCatalog } from '../hooks';
import marinaMap from '../../assets/site/island/marina-map.png';

export default function Contact() {
  usePageTitle('Contact');
  const catalog = useCatalog();
  // Other pages can start the message (e.g. "Request Menu" on the dining cards).
  const message = (useLocation().state as { message?: string } | null)?.message;
  return (
    <>
      <PageHeader eyebrow="Contact" title={<>We’re here to <em>help</em>.</>} subtitle="Questions about your visit, a booking or a special request? Send us a message and the team will reply by email." />
      <section className="s-section">
        <div className="s-container s-contact-grid">
          <div className="s-card-panel">
            <h2 className="s-title-sm">Send us a message</h2>
            <EnquiryForm type="contact" initialMessage={message} />
          </div>
          <aside className="s-contact-info" id="location">
            <a className="s-contact-map" href={LINKS.maps} target="_blank" rel="noreferrer" aria-label="Open Mahmya Beach Marina in Google Maps">
              <img src={marinaMap} alt="Map of Mahmya Beach Marina on Sheraton Road, Hurghada" loading="lazy" />
            </a>
            <ul className="s-contact-list">
              <li>
                <MapPin size={20} aria-hidden />
                <div>
                  <strong>Mahmya Beach Marina</strong>
                  <span>Sheraton Road, Hurghada — 4.2 km from the Mamsha, 18 km from Hurghada Airport.</span>
                  <a href={LINKS.maps} target="_blank" rel="noreferrer">
                    Directions <Navigation size={14} aria-hidden />
                  </a>
                </div>
              </li>
              <li>
                <Clock size={20} aria-hidden />
                <div>
                  <strong>Daily island trips</strong>
                  <span>{(catalog?.trips ?? FALLBACK_TRIPS).map((t) => `${t.name}: check in by ${formatTime(checkInTime(t))}, back around ${formatTime(t.returnTime)}`).join(' · ')}.</span>
                </div>
              </li>
              <li>
                <Mail size={20} aria-hidden />
                <div>
                  <strong>Already booked?</strong>
                  <span>
                    <Link to="/booking">Find your booking</Link> with your code and email, or read the <Link to="/faq">FAQs</Link>.
                  </span>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
