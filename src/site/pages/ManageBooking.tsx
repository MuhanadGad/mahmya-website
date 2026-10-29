// Guests find their booking with its code and the email used to book, and can
// cancel online until the free-cancellation window closes.

import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { formatTime } from '../../../shared/cloud.ts';
import { STATUS_LABEL } from '../../../shared/reservations.ts';
import { FREE_CANCELLATION_HOURS, type PublicBooking } from '../../../shared/website.ts';
import { isLive, siteFetch } from '../api';
import { PageHeader } from '../components/ui';
import { euro, formatVisitDate, usePageTitle } from '../format';
import { packageName } from '../../../shared/packages.ts';
import { loadProfile } from '../profile';
import { Planned } from '../components/Planned';

export default function ManageBooking() {
  usePageTitle('Manage your booking');
  const [params] = useSearchParams();
  // My Profile opens a booking with its code and email in the router state (never in the URL).
  const opened = useLocation().state as { code?: string; email?: string } | null;
  const [code, setCode] = useState(opened?.code ?? params.get('code') ?? '');
  const [email, setEmail] = useState(() => opened?.email ?? loadProfile()?.email ?? '');
  const [booking, setBooking] = useState<PublicBooking | null>(null);
  const [busy, setBusy] = useState(() => !!(opened?.code && opened.email));
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function lookup(pair: { code: string; email: string }) {
    try {
      setBooking(await siteFetch<PublicBooking>('/public/bookings/lookup', pair));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }

  // Opened from My Profile: show that booking straight away.
  const [autoOpen] = useState(() => (opened?.code && opened.email ? { code: opened.code, email: opened.email } : null));
  useEffect(() => {
    if (autoOpen) void lookup(autoOpen);
  }, [autoOpen]);

  function find(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    void lookup({ code, email });
  }

  async function cancel() {
    setBusy(true);
    setError(null);
    try {
      setBooking(await siteFetch<PublicBooking>('/public/bookings/cancel', { code, email }));
      setConfirming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Your booking"
        title={
          <>
            Manage your <em>booking</em>.
          </>
        }
        subtitle="Enter your booking code and the email address you booked with."
      />
      <section className="s-section">
        <div className="s-container s-manage">
          {!booking ? (
            <Planned what="Booking lookup">
              <form className="s-card-panel s-form" onSubmit={find} noValidate>
                <div className="s-form-row">
                  <label>
                    <span>Booking code</span>
                    <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="MH-100123" autoComplete="off" required />
                  </label>
                  <label>
                    <span>Email</span>
                    <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </label>
                </div>
                {error && (
                  <p className="s-form-note error" role="alert">
                    {error}
                  </p>
                )}
                <button type="submit" className="s-btn s-btn-primary s-btn-lg" disabled={busy || !isLive('/public/bookings/lookup') || !code || !email}>
                  {busy ? 'Looking…' : 'Find my booking'}
                </button>
              </form>
            </Planned>
          ) : (
            <div className="s-card-panel">
              <p className="s-eyebrow left">Booking {booking.code}</p>
              <h2 className="s-title-sm">
                {packageName(booking.programId)} · {formatVisitDate(booking.visitDate)}
              </h2>
              <p className={`s-status ${booking.status}`}>{booking.status === 'cancelled' ? 'Cancelled' : STATUS_LABEL[booking.status]}</p>
              <dl className="s-confirm-grid">
                <div>
                  <dt>Boat</dt>
                  <dd>
                    {booking.schedule.name} · check in by {formatTime(booking.schedule.checkIn)}
                  </dd>
                </div>
                <div>
                  <dt>Lead guest</dt>
                  <dd>{booking.leadName}</dd>
                </div>
                <div>
                  <dt>Guests</dt>
                  <dd>
                    {booking.guests.adults} adult{booking.guests.adults === 1 ? '' : 's'}
                    {booking.guests.children ? `, ${booking.guests.children} child${booking.guests.children === 1 ? '' : 'ren'}` : ''}
                    {booking.guests.infants ? `, ${booking.guests.infants} infant${booking.guests.infants === 1 ? '' : 's'}` : ''}
                  </dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>{euro(booking.quote.total)}</dd>
                </div>
                <div>
                  <dt>Payment</dt>
                  <dd>{booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'refunded' ? 'Refunded' : 'Pay at check-in'}</dd>
                </div>
              </dl>
              {booking.quote.lines.length > 0 && (
                <ul className="s-summary-lines">
                  {booking.quote.lines.map((l) => (
                    <li key={l.id}>
                      <span>
                        {l.label} × {l.quantity}
                      </span>
                      <span>{l.total ? euro(l.total) : 'Free'}</span>
                    </li>
                  ))}
                </ul>
              )}
              {error && (
                <p className="s-form-note error" role="alert">
                  {error}
                </p>
              )}
              {booking.status === 'confirmed' &&
                (booking.cancellable ? (
                  confirming ? (
                    <div className="s-cancel-confirm">
                      <p>Cancel this booking? This can’t be undone.</p>
                      <button type="button" className="s-btn s-btn-danger" onClick={cancel} disabled={busy}>
                        {busy ? 'Cancelling…' : 'Yes, cancel my booking'}
                      </button>
                      <button type="button" className="s-btn s-btn-outline" onClick={() => setConfirming(false)}>
                        Keep it
                      </button>
                    </div>
                  ) : (
                    <button type="button" className="s-btn s-btn-outline" onClick={() => setConfirming(true)}>
                      Cancel booking
                    </button>
                  )
                ) : (
                  <p className="s-muted">
                    Free online cancellation ends {FREE_CANCELLATION_HOURS} hours before check-in. To change this booking, <Link to="/contact">contact us</Link>.
                  </p>
                ))}
              {booking.status === 'cancelled' && <p className="s-muted">This booking is cancelled. We hope to welcome you another time.</p>}
              <button type="button" className="s-link-btn" onClick={() => (setBooking(null), setError(null))}>
                Look up another booking
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
