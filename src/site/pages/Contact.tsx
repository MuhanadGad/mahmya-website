import { Clock, Mail, MapPin, Navigation } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { FALLBACK_TRIPS, checkInTime, formatTime } from '../../../shared/cloud.ts';
import { EnquiryForm } from '../components/EnquiryForm';
import { PageHeader } from '../components/ui';
import { usePageTitle } from '../format';
import { Rich } from '../components/Rich';
import { useCatalog, useContent } from '../hooks';
import marinaMap from '../../assets/site/island/marina-map.png';

export default function Contact() {
  usePageTitle('Contact');
  const catalog = useCatalog();
  const { links, location, 'contact.page': page } = useContent();
  // Other pages can start the message (e.g. "Request Menu" on the dining cards).
  const message = (useLocation().state as { message?: string } | null)?.message;
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={<Rich text={page.title} />} subtitle={page.subtitle} />
      <section className="s-section">
        <div className="s-container s-contact-grid">
          <div className="s-card-panel">
            <h2 className="s-title-sm">{page.formTitle}</h2>
            <EnquiryForm type="contact" initialMessage={message} />
          </div>
          <aside className="s-contact-info" id="location">
            <a className="s-contact-map" href={links.maps} target="_blank" rel="noreferrer" aria-label={`Open ${location.marinaName} in Google Maps`}>
              <img src={marinaMap} alt="Map of Mahmya Beach Marina on Sheraton Road, Hurghada" loading="lazy" />
            </a>
            <ul className="s-contact-list">
              <li>
                <MapPin size={20} aria-hidden />
                <div>
                  <strong>{location.marinaName}</strong>
                  <span>{location.address}</span>
                  <a href={links.maps} target="_blank" rel="noreferrer">
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
