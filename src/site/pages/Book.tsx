// Online booking as a four-step checkout (Figma 275:9743, 275:10054, 275:10311,
// 275:10511) and its confirmation (275:10696): 1 program, date and boat (live
// availability); 2 guests, extras and add-ons; 3 the lead guest's details; 4
// payment. The booking summary beside every step previews the price with the
// same quote and rate the server uses; the server re-prices and re-checks
// capacity with the cloud system when the booking is confirmed.

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, Lock, ShieldCheck, Wallet } from 'lucide-react';
import { COMMON_COUNTRIES, COUNTRIES, countryName, flagOf } from '../../../shared/nationalities.ts';
import { DEFAULT_TRIP, FALLBACK_TRIPS, bookingRate, checkInTime, formatTime, packageTrip, type Trip } from '../../../shared/cloud.ts';
import { UNIT_LABEL, getAddOns, type AddOn } from '../../../shared/addons.ts';
import { EXTRA_LABEL, NO_EXTRAS, PRIVATE_BOAT_MAX, maxQuantity, payingGuests, quote, type AddOnSelection, type GuestMix, type TripExtras } from '../../../shared/reservations.ts';
import { FREE_CANCELLATION_HOURS, GROUPS_MIN_PARTY, WEBSITE_MAX_PARTY, type PublicBooking, type PublicTripDay } from '../../../shared/website.ts';
import { isLive, siteFetch, track } from '../api';
import { Planned } from '../components/Planned';
import { Calendar } from '../components/Calendar';
import { formatVisitDate, usePageTitle } from '../format';
import type { ProgramId } from '../content';
import { includesLunch, packageName, packageOf } from '../../../shared/packages.ts';
import { useOfferedAddOns, usePackages } from '../../lib/packages';
import { islandToday, useAvailability, useCatalog } from '../hooks';
import { loadProfile, rememberBooking, saveProfile } from '../profile';
import logo from '../../assets/site/checkout/logo.svg';
import back from '../../assets/site/checkout/back.svg';
import next from '../../assets/site/checkout/next.svg';
import radioOn from '../../assets/site/checkout/radio-on.svg';
import radioOnWhite from '../../assets/site/checkout/radio-on-white.svg';
import scheduleDay from '../../assets/site/checkout/schedule-day.jpg';
import scheduleSunset from '../../assets/site/checkout/schedule-sunset.jpg';
import guestAdult from '../../assets/site/checkout/guest-adult.svg';
import guestChild from '../../assets/site/checkout/guest-child.svg';
import guestInfant from '../../assets/site/checkout/guest-infant.svg';
import extraWaves from '../../assets/site/checkout/extra-waves.svg';
import extraGoggles from '../../assets/site/checkout/extra-goggles.svg';
import extraCircle from '../../assets/site/checkout/extra-circle-x.svg';
import chevron from '../../assets/site/checkout/chevron-down.svg';
import decoFish from '../../assets/site/checkout/deco-fish.svg';
import decoShell from '../../assets/site/checkout/deco-shell.svg';

const TODAY = islandToday();
type Step = 1 | 2 | 3 | 4 | 5;

const count = (v: string | null, fallback: number) => (v !== null && /^\d{1,2}$/.test(v) ? Number(v) : fallback);
const eur = (v: number) => `EUR ${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const egp = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
/** "08:30" → "08:30 AM" (the checkout writes hours with a leading zero). */
const clock = (t: string) => formatTime(t).padStart(8, '0');

/** Dialling codes for the phone field: the island's usual markets first. */
const DIAL: [string, string][] = [
  ['EG', '+20'],
  ['DE', '+49'],
  ['GB', '+44'],
  ['PL', '+48'],
  ['IT', '+39'],
  ['CZ', '+420'],
  ['RU', '+7'],
  ['UA', '+380'],
  ['NL', '+31'],
  ['BE', '+32'],
  ['FR', '+33'],
  ['AT', '+43'],
  ['CH', '+41'],
  ['ES', '+34'],
  ['SE', '+46'],
  ['NO', '+47'],
  ['DK', '+45'],
  ['FI', '+358'],
  ['HU', '+36'],
  ['RO', '+40'],
  ['SA', '+966'],
  ['AE', '+971'],
  ['US', '+1'],
];

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: 'Select Date & Program' },
  { n: 2, label: 'Guests & Extras' },
  { n: 3, label: 'Your Details' },
  { n: 4, label: 'Payment' },
];

/** Why a boat can't be booked on the chosen date, for the guest. */
function tripProblem(info: PublicTripDay, trip: Trip): string {
  if (info.reason === 'closed') return `The ${trip.name} isn’t running on this date.`;
  if (info.reason === 'past') return `Same-day bookings for the ${trip.name} have closed.`;
  if (info.reason === 'no-price') return 'Prices for this date aren’t published yet.';
  if (info.reason === 'too-far') return 'Online bookings open up to a year ahead.';
  return info.remaining > 0 ? `Only ${info.remaining} places left on the ${trip.name}.` : `The ${trip.name} is fully booked on this date.`;
}

/** A calendar file for the visit, from check-in to the boat's return (island time). */
function icsFor(b: PublicBooking): string {
  const d = b.visitDate.replace(/-/g, '');
  const at = (time: string) => `${d}T${time.replace(':', '')}00`;
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mahmya Island//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${b.code}@mahmya`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART;TZID=Africa/Cairo:${at(b.schedule.checkIn)}`,
    `DTEND;TZID=Africa/Cairo:${at(b.schedule.returnTime)}`,
    `SUMMARY:Mahmya Island — ${packageName(b.programId)} (${b.code})`,
    'LOCATION:Mahmya Beach Marina\\, Sheraton Road\\, Hurghada',
    `DESCRIPTION:${b.schedule.name}: check in at the marina by ${formatTime(b.schedule.checkIn)} with your booking code\\; the boat leaves at ${formatTime(b.schedule.departure)}. Pay at check-in by card or cash.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body.join('\r\n'))}`;
}

function StepperBar({ step }: { step: Step }) {
  const steps = step === 5 ? [...STEPS, { n: 5 as Step, label: 'Confirmation' }] : STEPS;
  return (
    <ol className={`s-co-steps${step === 5 ? ' five' : ''}`} aria-label="Booking steps">
      {steps.map((s, i) => {
        const done = s.n < step;
        const on = s.n === step;
        return (
          <li key={s.n} className={on ? 'on' : done ? 'done' : undefined} aria-current={on ? 'step' : undefined}>
            {i > 0 && <span className="s-co-line" aria-hidden />}
            <span className="s-co-step">
              <span className="s-co-circle">{done ? <Check size={16} strokeWidth={3} aria-hidden /> : s.n}</span>
              <span className="s-co-step-text">
                <b>{s.label}</b>
                <small>{done ? 'COMPLETED' : on ? 'ACTIVE' : `STEP ${s.n}`}</small>
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Counter({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <span className="s-co-counter" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label.toLowerCase()}`}>
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label.toLowerCase()}`}>
        +
      </button>
    </span>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={`s-co-toggle${on ? ' on' : ''}`} onClick={() => onChange(!on)} />;
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="s-co-field">
      <span className="s-co-label">
        {label}
        {required && <em> *</em>}
      </span>
      {children}
      {hint && <span className="s-co-hint">{hint}</span>}
    </label>
  );
}

export default function Book() {
  usePageTitle('Book your day');
  const [params] = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  // The package asked for in the link; it's resolved against the packages on sale once they've loaded.
  const [programWanted, setProgram] = useState<ProgramId>(() => params.get('program') ?? '');
  const onSale = usePackages().filter((p) => p.status === 'active');
  const program: ProgramId = (onSale.find((p) => p.id === programWanted) ?? onSale.find((p) => p.featured) ?? onSale[0])?.id ?? 'beach-lunch';
  const [guests, setGuests] = useState<GuestMix>(() => ({ adults: Math.max(1, count(params.get('adults'), 2)), children: count(params.get('children'), 0), infants: count(params.get('infants'), 0) }));
  const [date, setDate] = useState<string | null>(() => (/^\d{4}-\d{2}-\d{2}$/.test(params.get('date') ?? '') ? params.get('date') : null));
  const [tripChoice, setTrip] = useState(() => params.get('trip') ?? DEFAULT_TRIP);
  const [addOns, setAddOns] = useState<Record<string, number>>(() => {
    const id = params.get('addon');
    return id && getAddOns().some((a) => a.id === id) ? { [id]: 1 } : {};
  });
  // Details saved under My Profile on this device fill in the lead guest.
  const [saved] = useState(loadProfile);
  const savedDial = DIAL.find(([, code]) => saved?.phone.startsWith(code))?.[1];
  const [lead, setLead] = useState(() => ({ name: saved?.name ?? '', email: saved?.email ?? '', nationality: saved?.nationality ?? '', hotel: saved?.hotel ?? '', document: '', groupRef: '', notes: '' }));
  const [dial, setDial] = useState(savedDial ?? '+20');
  const [phone, setPhone] = useState(() => (saved?.phone ? saved.phone.replace(savedDial ?? '', '').trim() : ''));
  const [extrasWanted, setExtras] = useState<TripExtras>(NO_EXTRAS);
  const [remember, setRemember] = useState(!!saved);
  const [terms, setTerms] = useState(false);
  const [trap, setTrap] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<PublicBooking | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => track('booking_started'), []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const party = guests.adults + guests.children + guests.infants;
  const paying = payingGuests(guests);
  const maxParty = program === 'private-boat' ? PRIVATE_BOAT_MAX : WEBSITE_MAX_PARTY;
  const catalog = useCatalog();
  const rateEgp = catalog?.egpPerEur ?? null;
  const trips = catalog?.trips ?? FALLBACK_TRIPS;
  const { data: day } = useAvailability(date, date, refresh, program);
  const dayInfo = date ? day?.days.get(date) : undefined;
  const fits = (info: PublicTripDay | undefined) => !!info && info.bookable && info.remaining >= party;
  // If the chosen boat can't take the party on this date, offer one that can.
  const trip = dayInfo && !fits(dayInfo.trips[tripChoice]) ? (trips.find((t) => fits(dayInfo.trips[t.code]))?.code ?? tripChoice) : tripChoice;
  const tripInfo = dayInfo?.trips[trip];
  const schedule = trips.find((t) => t.code === trip);
  // The package's own times on the boat, where it has them.
  const chosenTrip = schedule && packageTrip(program, schedule);
  const offered = useOfferedAddOns(program);

  // Quantities are kept within what the party can use (e.g. after removing guests).
  const selections: AddOnSelection[] = useMemo(() => offered.map((a) => ({ id: a.id, quantity: Math.min(addOns[a.id] ?? 0, maxQuantity(a, guests)) })).filter((s) => s.quantity > 0), [addOns, guests, offered]);
  // Extras stay within the paying guests, and lunch isn't added where the package includes it.
  const lunchIncluded = includesLunch(program);
  const extras: TripExtras = { snorkeling: Math.min(extrasWanted.snorkeling, paying), lunch: lunchIncluded ? 0 : Math.min(extrasWanted.lunch, paying) };
  const extraPrices = catalog?.extraPrices ?? NO_EXTRAS;
  const rate = bookingRate(catalog, program, trip, date ?? TODAY);
  const priced = quote({ programId: program, guests, addOns: selections, extras, discountPct: 0, visitDate: date ?? TODAY }, rate, extraPrices);
  const pkg = packageOf(program);

  const partyProblem =
    party > maxParty
      ? program === 'private-boat'
        ? `Private boats take up to ${PRIVATE_BOAT_MAX} guests.`
        : `For more than ${WEBSITE_MAX_PARTY} guests, please send an event enquiry.`
      : program === 'groups' && party < GROUPS_MIN_PARTY
        ? `Events & Groups is for ${GROUPS_MIN_PARTY} guests or more.`
        : null;
  const boatProblem = tripInfo && chosenTrip && !fits(tripInfo) ? tripProblem(tripInfo, chosenTrip) : null;
  const step1Ready = !!date && !!chosenTrip && fits(tripInfo);
  const step2Ready = step1Ready && !partyProblem;
  const detailsMissing = !lead.name.trim()
    ? 'Enter your full name.'
    : !phone.trim()
      ? 'Enter your phone number.'
      : !lead.email.trim()
        ? 'Enter your email address.'
        : !lead.nationality
          ? 'Choose your nationality.'
          : !lead.document.trim()
            ? 'Enter your National ID or passport number.'
            : !terms
              ? 'Accept the terms and cancellation policy.'
              : null;
  const step3Ready = step2Ready && !detailsMissing;

  async function submit() {
    if (!date) return;
    setBusy(true);
    setError(null);
    try {
      const fullPhone = `${dial} ${phone.trim()}`;
      const result = await siteFetch<PublicBooking>('/public/bookings', {
        programId: program,
        visitDate: date,
        tripCode: trip,
        guests,
        addOns: selections,
        extras,
        groupRef: lead.groupRef,
        leadGuest: { name: lead.name, email: lead.email, phone: fullPhone, nationality: lead.nationality, hotel: lead.hotel, document: lead.document },
        notes: lead.notes,
        acceptTerms: terms,
        website: trap,
      });
      if (remember) {
        saveProfile({ name: lead.name.trim(), email: lead.email.trim(), phone: fullPhone, nationality: lead.nationality, hotel: lead.hotel.trim() });
        rememberBooking(result.code, result.email);
      }
      setBooking(result);
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
      setRefresh((r) => r + 1);
    } finally {
      setBusy(false);
    }
  }

  const go = (n: Step) => {
    setError(null);
    setStep(n);
  };
  const guestText = [plural(guests.adults, 'Adult'), guests.children ? plural(guests.children, 'Child', 'Children') : '', guests.infants ? plural(guests.infants, 'Infant') : ''].filter(Boolean).join(', ');
  const scheduleText = chosenTrip ? `${chosenTrip.name.split(' ')[0].toUpperCase()} Schedule, ${clock(chosenTrip.departure)} - ${clock(chosenTrip.returnTime)}` : '—';

  // The booking summary beside every step.
  const cta: Record<1 | 2 | 3 | 4, { label: string; ready: boolean; action: () => void; note: string | null }> = {
    1: { label: 'Continue to Step 2', ready: step1Ready, action: () => go(2), note: !date ? 'Choose a date to continue.' : boatProblem },
    2: { label: 'Continue to Step 3', ready: step2Ready, action: () => go(3), note: partyProblem ?? boatProblem },
    3: { label: 'Proceed to Payment', ready: step3Ready, action: () => go(4), note: detailsMissing },
    // Not live: mahmya-back has no public booking endpoint yet, so the last step can't be sent.
    4: {
      label: busy ? 'Confirming…' : `Confirm Booking · ${eur(priced.total)}`,
      ready: isLive('/public/bookings') && step3Ready && !busy,
      action: () => void submit(),
      note: isLive('/public/bookings') ? null : 'Preview: online booking isn’t connected to the backend yet.',
    },
  };

  const summary = (current: 1 | 2 | 3 | 4) => (
    <aside className="s-co-summary" aria-label="Booking summary">
      <img className="s-co-summary-logo" src={logo} alt="Mahmya" width={120} height={46} />
      <hr />
      <div className="s-co-summary-details">
        <p className="s-co-summary-title">Booking Summary</p>
        <dl>
          <div>
            <dt>Selected Program</dt>
            <dd>{packageName(program)}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{date ? formatVisitDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Choose a date'}</dd>
          </div>
          <div>
            <dt>Schedule &amp; Departure</dt>
            <dd>{scheduleText}</dd>
          </div>
          {current >= 3 && (
            <div>
              <dt>Guests</dt>
              <dd>{guestText}</dd>
            </div>
          )}
        </dl>
      </div>
      <hr />
      {current === 1 ? (
        <div className="s-co-total">
          <p>
            <span>Adult Ticket</span>
            <strong>{eur(rate.adult)}</strong>
          </p>
          {rateEgp && <small>Equivalent to EGP {Math.round(rate.adult * rateEgp).toLocaleString('en-US')}</small>}
        </div>
      ) : (
        <>
          <ul className="s-co-lines">
            {priced.lines.map((l) => (
              <li key={l.id}>
                <span>{l.id === 'adult' ? `${l.quantity}x Adults at ${eur(l.unitPrice)}` : l.id === 'child' ? `${l.quantity}x Children at ${eur(l.unitPrice)}` : l.id === 'infant' ? `${l.quantity}x Infants` : `${l.label} (${l.quantity}x)`}</span>
                <b>{l.total ? eur(l.total) : 'Free'}</b>
              </li>
            ))}
            {current === 2 && (
              <li className="sub">
                <span>Subtotal</span>
                <b>{eur(priced.subtotal)}</b>
              </li>
            )}
          </ul>
          {current === 2 && <p className="s-co-fine">* Pay at check-in by card or cash. Free cancellation until {FREE_CANCELLATION_HOURS} h before.</p>}
          <hr />
          <div className="s-co-total">
            <p>
              <span>{current === 4 ? 'Total Price' : 'Total Amount'}</span>
              <strong>{eur(priced.total)}</strong>
            </p>
            {rateEgp && <small>Equivalent to EGP {egp(Math.round(priced.total * rateEgp))}</small>}
          </div>
        </>
      )}
      <button type="button" className="s-co-cta" disabled={!cta[current].ready} onClick={cta[current].action}>
        {cta[current].label}
      </button>
      {cta[current].note && <p className="s-co-note">{cta[current].note}</p>}
      {current === 4 && error && (
        <p className="s-co-note error" role="alert">
          {error}
        </p>
      )}
    </aside>
  );

  const bottom = (backTo: { label: string; to?: string; step?: Step }, forward?: 1 | 2 | 3) => (
    <div className="s-co-bottom">
      {backTo.to ? (
        <Link to={backTo.to} className="s-co-back">
          <img src={back} alt="" width={14} height={14} /> {backTo.label}
        </Link>
      ) : (
        <button type="button" className="s-co-back" onClick={() => backTo.step && go(backTo.step)}>
          <img src={back} alt="" width={14} height={14} /> {backTo.label}
        </button>
      )}
      {forward && (
        <button type="button" className="s-co-next" disabled={!cta[forward].ready} onClick={cta[forward].action}>
          {cta[forward].label} <img src={next} alt="" width={14} height={14} />
        </button>
      )}
    </div>
  );

  if (step === 5 && booking)
    return (
      <Confirmation
        booking={booking}
        rateEgp={rateEgp}
        extrasText={[extras.snorkeling ? `${EXTRA_LABEL.snorkeling} ×${extras.snorkeling}` : '', extras.lunch ? `${EXTRA_LABEL.lunch} ×${extras.lunch}` : '', ...selections.map((s) => `${getAddOns().find((a) => a.id === s.id)?.name} ×${s.quantity}`)]
          .filter(Boolean)
          .join(', ')}
      />
    );

  return (
    <section className="s-co" aria-label="Book your island day">
      {(step === 3 || step === 4) && (
        <>
          <img className="s-co-deco fish" src={decoFish} alt="" width={63} height={63} />
          <img className="s-co-deco shell" src={decoShell} alt="" width={56} height={56} />
        </>
      )}
      <div className="s-co-card">
        <StepperBar step={step} />

        {step === 1 && (
          <>
            <div className="s-co-grid">
              <div className="s-co-main">
                <section className="s-co-block" aria-labelledby="co-program">
                  <p className="s-co-eyebrow">Step 01</p>
                  <h1 id="co-program" className="s-co-title">
                    Select Your Program
                  </h1>
                  <div className="s-co-programs" role="radiogroup" aria-label="Program">
                    {onSale.map((p) => {
                      const on = p.id === program;
                      const r = bookingRate(catalog, p.id, trip, date ?? TODAY);
                      return (
                        <button key={p.id} type="button" role="radio" aria-checked={on} className={`s-co-program${on ? ' on' : ''}`} onClick={() => setProgram(p.id)}>
                          {p.featured && <span className="s-co-badge">Most Popular</span>}
                          <span className="s-co-program-name">
                            {on ? <img src={radioOn} alt="" width={18} height={18} /> : <span className="s-co-radio" aria-hidden />}
                            {p.name}
                          </span>
                          <span className="s-co-program-text">{p.tagline}</span>
                          <span className="s-co-program-price">
                            <span>
                              <small>Adult</small>
                              <strong>{eur(r.adult)}</strong>
                            </span>
                            {rateEgp && (
                              <span>
                                <small className="local">Local Indicator</small>
                                <b>EGP {Math.round((r.adult * rateEgp) / 100) * 100}</b>
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="s-co-block" aria-labelledby="co-date">
                  <h2 id="co-date" className="s-co-subtitle">
                    Select Date
                  </h2>
                  <div className="s-co-bento">
                    <Calendar value={date} onChange={setDate} party={party} program={program} checkout />
                  </div>
                </section>

                <section className="s-co-block" aria-labelledby="co-boat">
                  <h2 id="co-boat" className="s-co-subtitle">
                    Select Departure Schedule
                  </h2>
                  <div className="s-co-schedules" role="radiogroup" aria-label="Departure schedule">
                    {trips.map((t0, i) => {
                      const t = packageTrip(program, t0);
                      const info = dayInfo?.trips[t.code];
                      const ok = !date || fits(info);
                      const on = trip === t.code;
                      return (
                        <button key={t.code} type="button" role="radio" aria-checked={on} disabled={!!date && !ok} className={`s-co-schedule${on ? ' on' : ''}`} onClick={() => setTrip(t.code)}>
                          <img className="bg" src={i === 0 ? scheduleDay : scheduleSunset} alt="" />
                          <span className="s-co-schedule-top">
                            <span className="s-co-pill">{t.name.split(' ')[0]} Schedule</span>
                            {on ? <img src={radioOnWhite} alt="" width={18} height={18} /> : <span className="s-co-radio white" aria-hidden />}
                          </span>
                          <span className="s-co-schedule-time">
                            <span aria-hidden>{i === 0 ? '☀️' : '🌅'}</span>
                            {clock(t.departure)} - {clock(t.returnTime)}
                          </span>
                          <span className="s-co-schedule-meta">{!date ? `Check in by ${formatTime(checkInTime(t))}` : !info ? 'Checking places…' : ok ? `Check in by ${formatTime(checkInTime(t))} · ${info.remaining} places left` : tripProblem(info, t)}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="s-co-info">
                    <span aria-hidden>i</span>
                    Arrive at the Hurghada Marina exactly 30 minutes before your selected departure time.
                  </p>
                </section>
              </div>
              {summary(1)}
            </div>
            {bottom({ label: 'Back to Programs', to: '/packages' }, 1)}
          </>
        )}

        {step === 2 && (
          <>
            <div className="s-co-grid">
              <div className="s-co-main">
                <section className="s-co-block" aria-labelledby="co-guests">
                  <p className="s-co-eyebrow small">Step 02</p>
                  <h1 id="co-guests" className="s-co-title light">
                    How Many Guests?
                  </h1>
                  <div className="s-co-rows">
                    <div className="s-co-row">
                      <span className="s-co-row-icon">
                        <img src={guestAdult} alt="" width={24} height={24} />
                      </span>
                      <span className="s-co-row-text">
                        <b>Adults</b>
                        <small>Ages 12+ years</small>
                      </span>
                      <span className="s-co-row-price">
                        <b>{eur(rate.adult)}</b>
                        <small>per person</small>
                      </span>
                      <Counter label="Adults" value={guests.adults} min={1} max={maxParty - guests.children - guests.infants} onChange={(v) => setGuests((g) => ({ ...g, adults: v }))} />
                    </div>
                    <div className="s-co-row">
                      <span className="s-co-row-icon">
                        <img src={guestChild} alt="" width={24} height={24} />
                      </span>
                      <span className="s-co-row-text">
                        <b>
                          Children <em className="s-co-tag">{pkg?.childPct ?? 50}% OFF</em>
                        </b>
                        <small>Ages 3-11 years • {pkg?.childPct ?? 50}% of adult rate</small>
                      </span>
                      <span className="s-co-row-price">
                        <b>{eur(rate.child)}</b>
                        <small>per person</small>
                      </span>
                      <Counter label="Children" value={guests.children} min={0} max={maxParty - guests.adults - guests.infants} onChange={(v) => setGuests((g) => ({ ...g, children: v }))} />
                    </div>
                    <div className="s-co-row">
                      <span className="s-co-row-icon">
                        <img src={guestInfant} alt="" width={24} height={24} />
                      </span>
                      <span className="s-co-row-text">
                        <b>
                          Infants <em className="s-co-tag">FREE</em>
                        </b>
                        <small>Ages 0-2 years</small>
                      </span>
                      <span className="s-co-row-price">
                        <b className="free">{eur(0)}</b>
                      </span>
                      <Counter label="Infants" value={guests.infants} min={0} max={maxParty - guests.adults - guests.children} onChange={(v) => setGuests((g) => ({ ...g, infants: v }))} />
                    </div>
                  </div>
                  {(partyProblem || boatProblem) && <p className="s-co-note error">{partyProblem ?? boatProblem}</p>}
                  {party >= WEBSITE_MAX_PARTY && (
                    <p className="s-co-hint">
                      Bigger group? <Link to="/events">Send an event enquiry</Link>.
                    </p>
                  )}
                </section>

                <section className="s-co-block" aria-labelledby="co-extras">
                  <p className="s-co-eyebrow small">Optional Upgrades</p>
                  <h2 id="co-extras" className="s-co-title light">
                    Add Extras to Your Experience
                  </h2>
                  <div className="s-co-rows">
                    <Planned what="Trip extras">
                      {(['snorkeling', 'lunch'] as const)
                        .filter((key) => key !== 'lunch' || !lunchIncluded)
                        .map((key) => {
                          const qty = extras[key];
                          return (
                            <div key={key} className="s-co-row extra">
                              <span className="s-co-row-icon tint">
                                <img src={key === 'snorkeling' ? extraWaves : extraGoggles} alt="" width={24} height={24} />
                              </span>
                              <span className="s-co-row-text">
                                <b>{key === 'snorkeling' ? 'Guided Snorkeling Trip' : 'Lunch'}</b>
                                <small>{key === 'snorkeling' ? 'The snorkelling boat leaves the island for the reef stop of your schedule.' : 'Lunch at the island buffet for guests whose package doesn’t include it.'}</small>
                              </span>
                              <span className="s-co-row-price">
                                <b>{extraPrices[key] ? eur(extraPrices[key]) : 'Free'}</b>
                                <small>per guest</small>
                              </span>
                              <span className="s-co-row-action">
                                {qty > 0 && <Counter label={EXTRA_LABEL[key]} value={qty} min={1} max={paying} onChange={(v) => setExtras((cur) => ({ ...cur, [key]: v }))} />}
                                <Toggle label={EXTRA_LABEL[key]} on={qty > 0} onChange={(v) => setExtras((cur) => ({ ...cur, [key]: v ? paying : 0 }))} />
                              </span>
                            </div>
                          );
                        })}
                    </Planned>
                    {offered.map((a: AddOn) => {
                      const left = dayInfo?.addOns[a.id];
                      const cap = Math.max(0, Math.min(maxQuantity(a, guests), left ?? Infinity));
                      const qty = Math.min(addOns[a.id] ?? 0, cap);
                      return (
                        <div key={a.id} className="s-co-row extra">
                          <span className="s-co-row-icon tint">
                            <img src={a.category === 'dining' ? extraGoggles : a.unit === 'ride' ? extraCircle : extraWaves} alt="" width={24} height={24} />
                          </span>
                          <span className="s-co-row-text">
                            <b>{a.name}</b>
                            <small>
                              {a.option && a.option !== a.name ? a.option : ''}
                              {a.time ? `${a.option && a.option !== a.name ? ' · ' : ''}${a.time}` : ''}
                              {left !== undefined && left <= 20 ? ` · ${left === 0 ? 'sold out' : `${left} left`}` : ''}
                            </small>
                          </span>
                          <span className="s-co-row-price">
                            <b>{eur(a.price)}</b>
                            <small>{UNIT_LABEL[a.unit]}</small>
                          </span>
                          <span className="s-co-row-action">
                            {qty > 0 && <Counter label={a.name} value={qty} min={1} max={cap} onChange={(v) => setAddOns((cur) => ({ ...cur, [a.id]: v }))} />}
                            <Toggle label={a.name} on={qty > 0} onChange={(v) => setAddOns((cur) => ({ ...cur, [a.id]: v ? Math.min(a.unit === 'person' ? paying : 1, cap) : 0 }))} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {lunchIncluded && <p className="s-co-hint">Lunch is included in {packageName(program)}.</p>}
                </section>

                <section className="s-co-block" aria-labelledby="co-notes">
                  <h2 id="co-notes" className="s-co-question">
                    Any special requests or notes?
                  </h2>
                  <textarea className="s-co-textarea" rows={4} maxLength={500} value={lead.notes} onChange={(e) => setLead({ ...lead, notes: e.target.value })} placeholder="Dietary requirements, celebrations, accessibility needs..." />
                </section>
              </div>
              {summary(2)}
            </div>
            {bottom({ label: 'Back to Step 1', step: 1 }, 2)}
          </>
        )}

        {step === 3 && (
          <>
            <div className="s-co-grid">
              <div className="s-co-main">
                <section className="s-co-block" aria-labelledby="co-details">
                  <p className="s-co-eyebrow small">Step 03</p>
                  <h1 id="co-details" className="s-co-title light">
                    Your Details
                  </h1>
                  <div className="s-co-form">
                    <Field label="Full Name" required>
                      <input className="s-co-input" autoComplete="name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="Enter your full legal name" required />
                    </Field>
                    <div className="s-co-form-row">
                      <div className="s-co-field">
                        <label className="s-co-label" htmlFor="co-phone">
                          Phone Number<em> *</em>
                        </label>
                        <span className="s-co-input s-co-phone">
                          <span className="s-co-dial">
                            <span aria-hidden>{flagOf(DIAL.find(([, c]) => c === dial)?.[0] ?? 'EG')}</span>
                            <select value={dial} onChange={(e) => setDial(e.target.value)} aria-label="Country code">
                              {DIAL.map(([iso, code]) => (
                                <option key={iso} value={code}>
                                  {code} {countryName[iso] ?? iso}
                                </option>
                              ))}
                            </select>
                            <span className="s-co-dial-code">{dial}</span>
                            <img src={chevron} alt="" width={10} height={10} />
                          </span>
                          <input id="co-phone" type="tel" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="100 123 4567" required />
                        </span>
                      </div>
                      <Field label="Email Address" required>
                        <input className="s-co-input" type="email" autoComplete="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} placeholder="you@example.com" required />
                      </Field>
                    </div>
                    <div className="s-co-form-row">
                      <Field label="Nationality" required>
                        <span className="s-co-select">
                          <select className="s-co-input" value={lead.nationality} onChange={(e) => setLead({ ...lead, nationality: e.target.value })} required>
                            <option value="">Select your nationality</option>
                            <optgroup label="Most of our guests">
                              {COMMON_COUNTRIES.map((code) => (
                                <option key={code} value={code}>
                                  {countryName[code]}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="All countries">
                              {[...COUNTRIES]
                                .sort((a, b) => a[1].localeCompare(b[1]))
                                .map(([code, name]) => (
                                  <option key={code} value={code}>
                                    {name}
                                  </option>
                                ))}
                            </optgroup>
                          </select>
                          <img src={chevron} alt="" width={14} height={14} />
                        </span>
                      </Field>
                      <Field label="National ID or Passport Number" required hint="Egyptian nationals use National ID and Foreign guests use Passport number.">
                        <input className="s-co-input" autoComplete="off" maxLength={40} value={lead.document} onChange={(e) => setLead({ ...lead, document: e.target.value })} placeholder="Enter document number" required />
                      </Field>
                    </div>
                    <Field label="Group Booking Reference (Optional)" hint="For groups booking separately, type a common reference so our team can seat you together.">
                      <input className="s-co-input" maxLength={60} value={lead.groupRef} onChange={(e) => setLead({ ...lead, groupRef: e.target.value })} placeholder="e.g. Smith Family Group" />
                    </Field>
                    <Field label="Special Notes (Optional)">
                      <textarea
                        className="s-co-textarea"
                        rows={3}
                        maxLength={500}
                        value={lead.notes}
                        onChange={(e) => setLead({ ...lead, notes: e.target.value })}
                        placeholder="Type any dietary requirements, allergies, accessibility needs, or celebrations here..."
                      />
                    </Field>
                    <input className="s-hp" tabIndex={-1} autoComplete="off" aria-hidden name="website" value={trap} onChange={(e) => setTrap(e.target.value)} />
                    <hr />
                    <label className="s-co-check">
                      <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                      <span>
                        I agree to the{' '}
                        <Link to="/terms" target="_blank">
                          Terms &amp; Conditions
                        </Link>{' '}
                        and{' '}
                        <Link to="/cancellation-policy" target="_blank">
                          Cancellation Policy
                        </Link>{' '}
                        of Mahmya Island. *
                      </span>
                    </label>
                    <label className="s-co-check">
                      <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                      <span>
                        Remember my details and this booking on this device (see <Link to="/profile">My Profile</Link>).
                      </span>
                    </label>
                    <p className="s-co-info">
                      <span aria-hidden>i</span>
                      You pay at check-in, by card or in cash. Free cancellation online until {FREE_CANCELLATION_HOURS} hours before check-in.
                    </p>
                    <p className="s-co-required">* Indicates a required field. Please ensure all details match your legal travel documents.</p>
                  </div>
                </section>
              </div>
              {summary(3)}
            </div>
            {bottom({ label: 'Back to Step 2', step: 2 })}
          </>
        )}

        {step === 4 && (
          <>
            <div className="s-co-grid">
              <div className="s-co-main">
                <Planned what="Online booking">
                  <section className="s-co-block" aria-labelledby="co-pay">
                    <p className="s-co-eyebrow small">Step 04</p>
                    <h1 id="co-pay" className="s-co-title light">
                      Secure Payment
                    </h1>
                    <div className="s-co-method on" role="radio" aria-checked>
                      <img src={radioOn} alt="" width={18} height={18} />
                      <b>Pay at the Marina</b>
                      <Wallet size={22} aria-hidden />
                    </div>
                    <div className="s-co-bento s-co-paynote">
                      <p>
                        <b>No card needed now.</b> Your places are reserved as soon as you confirm. Pay the total of <b>{eur(priced.total)}</b>
                        {rateEgp ? <> (about EGP {egp(Math.round(priced.total * rateEgp))})</> : null} at Mahmya Beach Marina when you check in — by card or in cash.
                      </p>
                    </div>
                    <div className="s-co-method disabled" aria-disabled>
                      <span className="s-co-radio" aria-hidden />
                      <b>Credit / Debit Card</b>
                      <small>Online card payment is coming soon</small>
                    </div>
                    <div className="s-co-trust">
                      <span>
                        <ShieldCheck size={14} aria-hidden /> Free cancellation until {FREE_CANCELLATION_HOURS} h before
                      </span>
                      <span>
                        <Lock size={14} aria-hidden /> Your details are sent encrypted
                      </span>
                    </div>
                  </section>
                </Planned>
              </div>
              {summary(4)}
            </div>
            {bottom({ label: 'Back to Step 3', step: 3 })}
          </>
        )}
      </div>
    </section>
  );
}

function Confirmation({ booking, rateEgp, extrasText }: { booking: PublicBooking; rateEgp: number | null; extrasText: string }) {
  const g = booking.guests;
  const guestText = [plural(g.adults, 'Adult'), g.children ? plural(g.children, 'Child', 'Children') : '', g.infants ? plural(g.infants, 'Infant') : ''].filter(Boolean).join(', ');
  const when = formatVisitDate(booking.visitDate, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <section className="s-co" aria-labelledby="co-done">
      <div className="s-co-card">
        <StepperBar step={5} />
        <div className="s-co-done">
          <span className="s-co-done-mark" aria-hidden>
            <Check size={44} strokeWidth={3} />
          </span>
          <h1 id="co-done">Booking Confirmed!</h1>
          <p>Your Mahmya Island adventure is booked! Get ready to experience paradise.</p>
          <p className="s-co-ref">
            <small>Booking reference:</small> <strong>{booking.code}</strong>
          </p>
        </div>
        <div className="s-co-grid">
          <div className="s-co-main">
            <h2 className="s-co-question">What’s Next?</h2>
            <div className="s-co-whatsnext">
              <article>
                <h3>
                  <span aria-hidden>✉</span> Keep Your Booking Code <em>Saved</em>
                </h3>
                <p>
                  Your booking code is <b>{booking.code}</b> — show it at the marina. You can find this booking any time under Manage booking with the code and {booking.email}.
                </p>
              </article>
              <article>
                <h3>
                  <span aria-hidden>☂</span> Prepare for Your Trip <em>Must Read</em>
                </h3>
                <p>Pack swimwear, high-SPF sunscreen, sunglasses and a towel. Snorkelling equipment is included on the island. Free cancellation online until {FREE_CANCELLATION_HOURS} hours before check-in.</p>
              </article>
              <article>
                <h3>
                  <span aria-hidden>⌖</span> Meeting Point <em>{formatTime(booking.schedule.departure)} Departure</em>
                </h3>
                <p>
                  Check in at Mahmya Beach Marina, Hurghada, by {formatTime(booking.schedule.checkIn)} on {when} — your boat leaves at {formatTime(booking.schedule.departure)} and is back around {formatTime(booking.schedule.returnTime)}. Bring your booking
                  code.
                </p>
              </article>
            </div>
            <a className="s-co-link" href={icsFor(booking)} download={`mahmya-${booking.code}.ics`}>
              Add to my calendar
            </a>
          </div>
          <aside className="s-co-summary" aria-label="Booking summary">
            <img className="s-co-summary-logo" src={logo} alt="Mahmya" width={120} height={46} />
            <hr />
            <div className="s-co-summary-details">
              <p className="s-co-summary-title">Booking Summary</p>
              <dl>
                <div>
                  <dt>Selected Program</dt>
                  <dd>{packageName(booking.programId)}</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd>{when}</dd>
                </div>
                <div>
                  <dt>Schedule &amp; Departure</dt>
                  <dd>
                    {booking.schedule.name.split(' ')[0].toUpperCase()} Schedule, {clock(booking.schedule.departure)} - {clock(booking.schedule.returnTime)}
                  </dd>
                </div>
                <div>
                  <dt>Guests</dt>
                  <dd>{guestText}</dd>
                </div>
                {extrasText && (
                  <div>
                    <dt>Extras</dt>
                    <dd>{extrasText}</dd>
                  </div>
                )}
              </dl>
            </div>
            <hr />
            <ul className="s-co-lines">
              {booking.quote.lines.map((l) => (
                <li key={l.id}>
                  <span>{l.id === 'adult' ? `${l.quantity}x Adults at ${eur(l.unitPrice)}` : l.id === 'child' ? `${l.quantity}x Children at ${eur(l.unitPrice)}` : l.id === 'infant' ? `${l.quantity}x Infants` : `${l.label} (${l.quantity}x)`}</span>
                  <b className={l.total ? undefined : 'ok'}>{l.total ? eur(l.total) : 'Included'}</b>
                </li>
              ))}
            </ul>
            <hr />
            <div className="s-co-total">
              <p>
                <span>Total to Pay</span>
                <strong>{eur(booking.quote.total)}</strong>
              </p>
              <small className="ok">{rateEgp ? `About EGP ${egp(Math.round(booking.quote.total * rateEgp))} · ` : ''}Pay at check-in</small>
            </div>
          </aside>
        </div>
        <div className="s-co-bottom">
          <Link to="/" className="s-co-back">
            <img src={back} alt="" width={14} height={14} /> Back to Homepage
          </Link>
          <Link to="/profile" className="s-co-next">
            View My Bookings <img src={next} alt="" width={14} height={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
