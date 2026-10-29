// Month calendar with availability (static sample until the backend has it) (best boat for the chosen package):
// closed, sold-out and unpriced days and days that can't fit the party are
// disabled; low availability is flagged.

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProgramId } from '../../../shared/catalog.ts';
import type { PublicDay } from '../../../shared/website.ts';
import { addDays, islandToday, useAvailability } from '../hooks';
import arrowLeft from '../../assets/site/checkout/arrow-left.svg';
import arrowRight from '../../assets/site/checkout/arrow-right.svg';
import { Planned } from './Planned';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const WEEKDAYS_SUN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function monthStart(date: string): string {
  return `${date.slice(0, 7)}-01`;
}

function shiftMonth(month: string, delta: number): string {
  const d = new Date(`${month}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + delta);
  return d.toISOString().slice(0, 10);
}

function unavailableLabel(day: PublicDay): string {
  if (day.closed) return 'Closed — no sailings';
  const reasons = Object.values(day.trips).map((t) => t.reason);
  return reasons.length > 0 && reasons.every((r) => r === 'no-price') ? 'Prices not published yet' : 'Not available online';
}

/** `checkout`: the booking checkout's look (Figma 275:9829) — month at the left with both arrows at the right, weeks from Sunday. */
export function Calendar({ value, onChange, party, program = null, checkout = false }: { value: string | null; onChange: (date: string) => void; party: number; program?: ProgramId | null; checkout?: boolean }) {
  const today = islandToday();
  const [month, setMonth] = useState(() => monthStart(value ?? today));
  const last = addDays(shiftMonth(month, 1), -1);
  const { data, loading, error } = useAvailability(month, last, 0, program);

  const firstWeekday = checkout ? new Date(`${month}T00:00:00Z`).getUTCDay() : (new Date(`${month}T00:00:00Z`).getUTCDay() + 6) % 7;
  const cells: (string | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let d = month; d <= last; d = addDays(d, 1)) cells.push(d);
  const label = new Date(`${month}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const canGoBack = month > monthStart(today);

  return (
    <Planned what="Availability">
      <div className={`s-cal${checkout ? ' checkout' : ''}`}>
        {checkout ? (
          <div className="s-cal-head">
            <p className="s-cal-month" aria-live="polite">
              {label}
            </p>
            <span className="s-cal-arrows">
              <button type="button" className="s-cal-nav" onClick={() => setMonth(shiftMonth(month, -1))} disabled={!canGoBack} aria-label="Previous month">
                <img src={arrowLeft} alt="" width={26} height={26} />
              </button>
              <button type="button" className="s-cal-nav" onClick={() => setMonth(shiftMonth(month, 1))} aria-label="Next month">
                <img src={arrowRight} alt="" width={26} height={26} />
              </button>
            </span>
          </div>
        ) : (
          <div className="s-cal-head">
            <button type="button" className="s-cal-nav" onClick={() => setMonth(shiftMonth(month, -1))} disabled={!canGoBack} aria-label="Previous month">
              <ChevronLeft size={18} />
            </button>
            <p className="s-cal-month" aria-live="polite">
              {label}
            </p>
            <button type="button" className="s-cal-nav" onClick={() => setMonth(shiftMonth(month, 1))} aria-label="Next month">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
        <div className="s-cal-grid" role="grid" aria-label={`Visit dates in ${label}`} aria-busy={loading}>
          {(checkout ? WEEKDAYS_SUN : WEEKDAYS).map((w) => (
            <span key={w} className="s-cal-wd" aria-hidden>
              {w}
            </span>
          ))}
          {cells.map((d, i) => {
            if (!d) return <span key={`e${i}`} />;
            const day = data?.days.get(d);
            const full = day ? day.bookable && day.remaining <= 0 : false;
            const closed = !!day?.closed && d >= today;
            const tooSmall = day ? day.remaining < party : false;
            const disabled = loading || !day || !day.bookable || tooSmall;
            const low = day && !full && day.remaining <= 60;
            const status = !day ? 'Loading' : !day.bookable ? unavailableLabel(day) : full ? 'Sold out' : tooSmall ? `Only ${day.remaining} places left` : `${day.remaining} places left`;
            return (
              <button
                key={d}
                type="button"
                className={`s-cal-day${d === value ? ' selected' : ''}${d === today ? ' today' : ''}${full || closed ? ' full' : ''}`}
                disabled={disabled}
                onClick={() => onChange(d)}
                aria-pressed={d === value}
                aria-label={`${new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })} — ${status}`}
              >
                <span>{Number(d.slice(8))}</span>
                {closed ? <small>Closed</small> : day?.bookable && (full ? <small>Full</small> : low ? <small>{day.remaining} left</small> : null)}
              </button>
            );
          })}
        </div>
        {error && <p className="s-form-note error">{error}</p>}
      </div>
    </Planned>
  );
}
