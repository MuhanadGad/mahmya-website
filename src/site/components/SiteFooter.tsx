// Footer from Figma: the brand tile (955:6615) with the newsletter sign-up, links
// and Mahmya Beach card, and the "celebrate the moments" events banner — above the
// tile in the classic design (955:6604), or as the tile's top band in the current
// one (574:12139, `band`).

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { siteFetch } from '../api';
import { useContent } from '../hooks';
import eventsWave from '../../assets/site/footer/events-wave.png';
import logo from '../../assets/site/footer/logo.svg';
import pin from '../../assets/site/footer/location.svg';
import instagram from '../../assets/site/footer/instagram.svg';
import facebook from '../../assets/site/footer/facebook.svg';
import tiktok from '../../assets/site/footer/tiktok.svg';
import tripadvisor from '../../assets/site/footer/tripadvisor.svg';

const YEAR = new Date().getFullYear();

export function EventsBanner() {
  return (
    <div className="s-events-banner">
      <img className="s-events-wave" src={eventsWave} alt="" width={756} height={120} loading="lazy" />
      <div className="s-events-band">
        <div>
          <p className="s-events-label">Celebrate the moments</p>
          <p className="s-events-title">Book unforgettable events in Mahmya Island</p>
        </div>
        <Link to="/events" className="s-btn s-btn-outline-dark">
          Plan Your Event
        </Link>
      </div>
    </div>
  );
}

/** The events band across the top of the footer tile (Figma 513:56236 in Footer 260:7453). */
function EventsBand({ title }: { title: string }) {
  return (
    <div className="s-footer-band">
      <div className="s-footer-band-text">
        <p className="s-footer-band-title">{title}</p>
      </div>
      <Link to="/events" className="s-btn s-btn-outline-dark">
        Plan Your Event
      </Link>
    </div>
  );
}

function Newsletter({ title, text }: { title: string; text: string }) {
  const [email, setEmail] = useState('');
  const [trap, setTrap] = useState('');
  const [state, setState] = useState<{ kind: 'idle' | 'busy' | 'done' | 'error'; message?: string }>({ kind: 'idle' });

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (state.kind === 'busy') return;
    setState({ kind: 'busy' });
    try {
      const res = await siteFetch<{ alreadySubscribed: boolean }>('/public/subscribe', { email, website: trap, source: 'footer' });
      setState({ kind: 'done', message: res.alreadySubscribed ? 'You’re already on the list — thank you!' : 'Thank you! You’ll hear from us with island news.' });
      setEmail('');
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : 'Please try again.' });
    }
  }

  return (
      <form className="s-newsletter" onSubmit={submit}>
        <p className="s-footer-strong">{title}</p>
        <p className="s-footer-muted">{text}</p>
        <div className="s-newsletter-field">
          <label htmlFor="s-newsletter-email" className="s-sr-only">
            Your email
          </label>
          <input id="s-newsletter-email" type="email" autoComplete="email" maxLength={254} placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="s-hp" tabIndex={-1} autoComplete="off" aria-hidden name="website" value={trap} onChange={(e) => setTrap(e.target.value)} />
          <button type="submit" className="s-btn s-btn-subscribe" disabled={state.kind === 'busy'}>
            {state.kind === 'busy' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </div>
        {state.message && (
          <p className={`s-form-note ${state.kind === 'error' ? 'error' : 'ok'}`} role="status">
            {state.message}
          </p>
        )}
      </form>
  );
}

export function SiteFooter({ events = true, band = false }: { events?: boolean; band?: boolean }) {
  const { links, footer } = useContent();
  return (
    <footer className={`s-footer${band ? ' band' : ''}`}>
      <div className={band ? 's-footer-wide' : 's-container'}>
        {events && !band && <EventsBanner />}
        <div className="s-footer-tile">
          {events && band ? <EventsBand title={footer.eventsTitle} /> : <div className="s-footer-divider" />}
          <div className="s-footer-grid">
            <div className="s-footer-main">
              <div className="s-footer-cols">
                <div className="s-footer-brand">
                  <div className="s-footer-logo-row">
                    <img src={logo} alt="Mahmya" width={160} height={62} />
                    <a className="s-footer-pin" href={links.maps} target="_blank" rel="noreferrer" aria-label="Mahmya on Google Maps">
                      <img src={pin} alt="" width={28} height={28} />
                    </a>
                  </div>
                  <p className="s-footer-about">
                    <strong>{footer.tagline}</strong>
                    <br />
                    {footer.about}
                  </p>
                  <div className="s-socials">
                    <a href={links.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                      <img src={instagram} alt="" width={24} height={24} />
                    </a>
                    <a href={links.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                      <img src={facebook} alt="" width={28} height={28} />
                    </a>
                    <a href={links.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
                      <img src={tiktok} alt="" width={22} height={22} />
                    </a>
                    <a href={links.tripadvisor} target="_blank" rel="noreferrer" aria-label="Tripadvisor">
                      <img src={tripadvisor} alt="" width={28} height={28} />
                    </a>
                  </div>
                </div>
                <div className="s-footer-vrule" aria-hidden />
                <div className="s-footer-right">
                  <Newsletter title={footer.newsletterTitle} text={footer.newsletterText} />
                  <div className="s-footer-hrule" aria-hidden />
                  <div className="s-footer-links">
                    <div>
                      <p className="s-footer-label">Explore</p>
                      <div className="s-footer-link-cols">
                        <ul>
                          <li>
                            <Link to="/">Discover Mahmya</Link>
                          </li>
                          <li>
                            <Link to="/island">The Island</Link>
                          </li>
                          <li>
                            <Link to="/packages">Programs</Link>
                          </li>
                        </ul>
                        <ul>
                          <li>
                            <Link to="/activities">Dining &amp; Experiences</Link>
                          </li>
                          <li>
                            <Link to="/gallery">Gallery</Link>
                          </li>
                          <li>
                            <Link to="/contact">Contact</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <p className="s-footer-label">Guest Support</p>
                      <ul>
                        <li>
                          <Link to="/faq">FAQs</Link>
                        </li>
                        <li>
                          <Link to="/contact#location">Location &amp; Maps</Link>
                        </li>
                        <li>
                          <Link to="/terms">Terms and Conditions</Link>
                        </li>
                        <li>
                          <Link to="/cancellation-policy">Cancellation Policy</Link>
                        </li>
                        <li>
                          <Link to="/booking">Manage my booking</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <p className="s-footer-copy">© {YEAR} Mahmya Island. All rights reserved.</p>
            </div>
            <aside className="s-beach-tile">
              <img src={footer.beachImage} alt={footer.beachImageAlt} loading="lazy" />
              <div>
                <p className="s-footer-label">{footer.beachLabel}</p>
                <p className="s-beach-title">{footer.beachTitle}</p>
                <p className="s-footer-muted">{footer.beachText}</p>
              </div>
              <a className="s-btn s-btn-primary s-btn-block" href={links.beachSite} target="_blank" rel="noreferrer">
                {footer.beachButton}
              </a>
            </aside>
          </div>
        </div>
      </div>
    </footer>
  );
}
