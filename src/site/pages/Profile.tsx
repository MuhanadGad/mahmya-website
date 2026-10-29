// My Profile ("My Profile" in the 513:9285 navigation): the guest's bookings and
// their details. There are no guest accounts — details are saved only in this
// browser (they fill in the booking form), and one booking code with its email
// lists every booking made with that email.

import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Ticket, UserRound } from 'lucide-react';
import { COMMON_COUNTRIES, COUNTRIES, countryName } from '../../../shared/nationalities.ts';
import { formatTime } from '../../../shared/cloud.ts';
import { STATUS_LABEL } from '../../../shared/reservations.ts';
import type { PublicBooking } from '../../../shared/website.ts';
import { isLive, siteFetch } from '../api';
import { PageHeader } from '../components/ui';
import { packageName, packageOf } from '../../../shared/packages.ts';
import { photoOf } from '../../lib/packages';
import { euro, formatVisitDate, usePageTitle } from '../format';
import { islandToday } from '../hooks';
import { forgetDevice, loadProfile, rememberBooking, saveProfile, savedBookings, type GuestProfile, type SavedBooking } from '../profile';
import { toPublicBooking, type BackendPublicBooking } from '../backend';

const EMPTY: GuestProfile = { name: '', email: '', phone: '', nationality: '', hotel: '' };
const ALL_COUNTRIES = [...COUNTRIES].sort((a, b) => a[1].localeCompare(b[1]));

function guestsLabel(b: PublicBooking): string {
  const { adults, children, infants } = b.guests;
  return [`${adults} adult${adults === 1 ? '' : 's'}`, children ? `${children} child${children === 1 ? '' : 'ren'}` : '', infants ? `${infants} infant${infants === 1 ? '' : 's'}` : ''].filter(Boolean).join(', ');
}

function BookingCard({ booking }: { booking: PublicBooking }) {
  const program = { name: booking.programName ?? packageName(booking.programId), image: photoOf(packageOf(booking.programId)?.photo ?? 'program:beach-lunch') };
  return (
    <article className="s-mybooking" aria-labelledby={`mb-${booking.code}`}>
      <img src={program.image} alt="" loading="lazy" />
      <div className="s-mybooking-body">
        <p className="s-mybooking-code">{booking.code}</p>
        <h3 id={`mb-${booking.code}`}>{program.name}</h3>
        <p className="s-mybooking-meta">
          <CalendarDays size={16} aria-hidden /> {formatVisitDate(booking.visitDate)} · {booking.schedule.name}, {formatTime(booking.schedule.departure)} · {guestsLabel(booking)}
        </p>
        <div className="s-mybooking-foot">
          <span className={`s-status ${booking.status}`}>{booking.status === 'cancelled' ? 'Cancelled' : STATUS_LABEL[booking.status]}</span>
          <span className="s-mybooking-total">
            {euro(booking.quote.total)}
            <small>{booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'refunded' ? 'Refunded' : 'Pay at check-in'}</small>
          </span>
        </div>
      </div>
      <Link to="/booking" state={{ code: booking.code, email: booking.email }} className="s-btn s-btn-outline s-btn-sm" aria-label={`Manage booking ${booking.code}`}>
        Manage
      </Link>
    </article>
  );
}

export default function Profile() {
  usePageTitle('My Profile');
  const [profile, setProfile] = useState<GuestProfile>(() => loadProfile() ?? EMPTY);
  const [note, setNote] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [bookings, setBookings] = useState<PublicBooking[] | null>(null);
  const [find, setFind] = useState(() => ({ code: '', email: loadProfile()?.email ?? '' }));
  const [remember, setRemember] = useState(true);
  // Bookings remembered on this device: one per email (its newest code proves it, and the server lists the rest).
  const [remembered] = useState(() => {
    const byEmail = new Map<string, SavedBooking>();
    for (const b of savedBookings()) if (!byEmail.has(b.email)) byEmail.set(b.email, b);
    return [...byEmail.values()].slice(0, 3);
  });
  const [busy, setBusy] = useState(remembered.length > 0);
  const [error, setError] = useState<string | null>(null);

  async function load(pairs: SavedBooking[]): Promise<boolean> {
    const results = await Promise.allSettled(pairs.map((p) => siteFetch<{ bookings: BackendPublicBooking[] }>('/public/bookings/mine', p).then((r) => r.bookings.map(toPublicBooking))));
    const found = new Map<string, PublicBooking>();
    for (const r of results) if (r.status === 'fulfilled') for (const b of r.value) found.set(b.code, b);
    const failed = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
    setBusy(false);
    if (found.size === 0 && failed) {
      setError(failed.reason instanceof Error ? failed.reason.message : 'Please try again.');
      return false;
    }
    setBookings([...found.values()].sort((a, b) => b.visitDate.localeCompare(a.visitDate)));
    return true;
  }

  useEffect(() => {
    if (remembered.length) void load(remembered);
  }, [remembered]);

  async function lookup(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const pair = { code: find.code.trim().toUpperCase(), email: find.email.trim() };
    if ((await load([pair])) && remember) rememberBooking(pair.code, pair.email);
  }

  function save(e: FormEvent) {
    e.preventDefault();
    const clean = { name: profile.name.trim(), email: profile.email.trim(), phone: profile.phone.trim(), nationality: profile.nationality, hotel: profile.hotel.trim() };
    setProfile(clean);
    setNote(saveProfile(clean) ? { kind: 'ok', text: 'Saved on this device. Your next booking is filled in for you.' } : { kind: 'error', text: 'This browser doesn’t allow saving (private mode or blocked storage).' });
  }

  function forget() {
    forgetDevice();
    setProfile(EMPTY);
    setBookings(null);
    setFind({ code: '', email: '' });
    setNote({ kind: 'ok', text: 'Everything saved on this device has been removed.' });
  }

  const today = islandToday();
  const upcoming = (bookings ?? []).filter((b) => b.visitDate >= today && b.status === 'confirmed').reverse();
  const past = (bookings ?? []).filter((b) => !upcoming.includes(b));
  const set = (k: keyof GuestProfile) => (e: { target: { value: string } }) => setProfile((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <PageHeader
        eyebrow="My Profile"
        title={
          <>
            Your island day, <em>in one place</em>.
          </>
        }
        subtitle="See your bookings, manage or cancel them, and keep your details ready for the next visit. No account or password needed."
      />
      <section className="s-section">
        <div className="s-container s-profile">
          <div className="s-profile-main">
            <div className="s-card-panel">
              <h2 className="s-profile-title">
                <Ticket size={22} aria-hidden /> My bookings
              </h2>
              {busy && !bookings && <div className="s-skel" style={{ height: 120 }} aria-busy="true" aria-label="Loading your bookings" />}
              {bookings && bookings.length > 0 && (
                <>
                  {upcoming.length > 0 && (
                    <div className="s-profile-group">
                      <p className="s-profile-label">Upcoming</p>
                      {upcoming.map((b) => (
                        <BookingCard key={b.code} booking={b} />
                      ))}
                    </div>
                  )}
                  {past.length > 0 && (
                    <div className="s-profile-group">
                      <p className="s-profile-label">Past &amp; cancelled</p>
                      {past.map((b) => (
                        <BookingCard key={b.code} booking={b} />
                      ))}
                    </div>
                  )}
                </>
              )}
              {bookings && bookings.length === 0 && <p className="s-muted">No bookings found for that email.</p>}
                <form className="s-form s-profile-find" onSubmit={lookup} noValidate>
                  <p className="s-muted">{bookings ? 'Booked with another email? Add those bookings too.' : 'Enter any booking code and the email you booked with — we’ll list every booking made with that email.'}</p>
                  <div className="s-form-row">
                    <label>
                      <span>Booking code</span>
                      <input value={find.code} onChange={(e) => setFind({ ...find, code: e.target.value.toUpperCase() })} placeholder="MH-100123" autoComplete="off" required />
                    </label>
                    <label>
                      <span>Email</span>
                      <input type="email" autoComplete="email" value={find.email} onChange={(e) => setFind({ ...find, email: e.target.value })} required />
                    </label>
                  </div>
                  <label className="s-check">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    <span>Remember my bookings on this device</span>
                  </label>
                  {error && (
                    <p className="s-form-note error" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="s-profile-actions">
                    <button type="submit" className="s-btn s-btn-primary" disabled={busy || !isLive('/public/bookings/lookup') || !find.code || !find.email}>
                      {busy ? 'Looking…' : 'Find my bookings'}
                    </button>
                    <Link to="/book" className="s-btn s-btn-outline">
                      Book a new day
                    </Link>
                  </div>
                </form>
            </div>
          </div>

          <aside className="s-card-panel s-profile-details">
            <h2 className="s-profile-title">
              <UserRound size={22} aria-hidden /> My details
            </h2>
            <p className="s-muted">Saved only in this browser and used to fill in your bookings. Mahmya keeps your details only with the bookings you make.</p>
            <form className="s-form" onSubmit={save}>
              <label>
                <span>Full name</span>
                <input autoComplete="name" value={profile.name} onChange={set('name')} />
              </label>
              <label>
                <span>Email</span>
                <input type="email" autoComplete="email" value={profile.email} onChange={set('email')} />
              </label>
              <label>
                <span>Mobile phone</span>
                <input type="tel" autoComplete="tel" value={profile.phone} onChange={set('phone')} placeholder="+49 151 2345678" />
              </label>
              <label>
                <span>Nationality</span>
                <select value={profile.nationality} onChange={set('nationality')}>
                  <option value="">Select…</option>
                  <optgroup label="Most of our guests">
                    {COMMON_COUNTRIES.map((code) => (
                      <option key={code} value={code}>
                        {countryName[code]}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="All countries">
                    {ALL_COUNTRIES.map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>
              <label>
                <span>
                  Hotel in Hurghada <em>(optional)</em>
                </span>
                <input value={profile.hotel} onChange={set('hotel')} />
              </label>
              {note && (
                <p className={`s-form-note ${note.kind}`} role="status">
                  {note.text}
                </p>
              )}
              <div className="s-profile-actions">
                <button type="submit" className="s-btn s-btn-primary">
                  Save my details
                </button>
                <button type="button" className="s-link-btn" onClick={forget}>
                  Forget this device
                </button>
              </div>
            </form>
          </aside>
        </div>
      </section>
    </>
  );
}
