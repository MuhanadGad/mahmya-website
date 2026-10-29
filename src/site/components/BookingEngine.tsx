// The booking bar (Figma 275:9670): program, guests and date pickers that hand
// the choice to the booking page. Each picker always shows its current value.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { displayRate } from '../../../shared/cloud.ts';
import { WEBSITE_MAX_PARTY } from '../../../shared/website.ts';
import type { ProgramId } from '../content';
import { packageName } from '../../../shared/packages.ts';
import { usePackages } from '../../lib/packages';
import { islandToday, useCatalog } from '../hooks';
import { Calendar } from './Calendar';
import { Stepper } from './Stepper';
import { formatVisitDate } from '../format';
import compass from '../../assets/home/v2/compass.svg';
import users from '../../assets/home/v2/users.svg';
import calendar from '../../assets/home/v2/calendar.svg';
import arrowDown from '../../assets/home/v2/arrow-down.svg';

type Panel = 'program' | 'guests' | 'date' | null;

function Field({ id, icon, tone, label, value, open, onToggle, children }: { id: string; icon: string; tone: 'info' | 'success' | 'warning'; label: string; value: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div className={`s-engine-field${open ? ' open' : ''}`}>
      <button type="button" className="s-engine-trigger" aria-expanded={open} aria-controls={id} onClick={onToggle}>
        <span className={`s-engine-icon ${tone}`}>
          <img src={icon} alt="" width={18} height={18} />
        </span>
        <span className="s-engine-text has-value">
          <span className="s-engine-label">{label}</span>
          <span className="s-engine-value">{value}</span>
        </span>
        <img className="s-engine-caret" src={arrowDown} alt="" width={24} height={24} />
      </button>
      {open && (
        <div id={id} className="s-engine-pop" role="dialog" aria-label={label}>
          {children}
        </div>
      )}
    </div>
  );
}

export function BookingEngine() {
  const navigate = useNavigate();
  const [panel, setPanel] = useState<Panel>(null);
  const [program, setProgram] = useState<ProgramId | null>(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });
  const [date, setDate] = useState<string | null>(null);
  const catalog = useCatalog();
  const ref = useRef<HTMLFormElement>(null);
  const packages = usePackages();

  useEffect(() => {
    if (!panel) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setPanel(null);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPanel(null);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [panel]);

  const party = guests.adults + guests.children + guests.infants;
  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? null : p));
  const guestLabel = `${guests.adults} Adult${guests.adults === 1 ? '' : 's'}${guests.children ? ` · ${guests.children} Child${guests.children === 1 ? '' : 'ren'}` : ''}${guests.infants ? ` · ${guests.infants} Infant${guests.infants === 1 ? '' : 's'}` : ''}`;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (program) q.set('program', program);
    q.set('adults', String(guests.adults));
    q.set('children', String(guests.children));
    q.set('infants', String(guests.infants));
    if (date) q.set('date', date);
    navigate(`/book?${q.toString()}`);
  }

  return (
    <form ref={ref} className="s-engine" onSubmit={submit} aria-label="Check availability">
      <Field id="s-engine-program" icon={compass} tone="info" label="Program" value={program ? packageName(program) : 'Not sure yet'} open={panel === 'program'} onToggle={() => toggle('program')}>
        <ul className="s-engine-list" role="listbox" aria-label="Programs">
          {packages.filter((p) => p.status === 'active').map(({ id }) => (
            <li key={id}>
              <button
                type="button"
                role="option"
                aria-selected={program === id}
                className={program === id ? 'selected' : undefined}
                onClick={() => {
                  setProgram(id);
                  setPanel('guests');
                }}
              >
                <span>{packageName(id)}</span>
                <small>From EUR {displayRate(catalog, id, islandToday()).adult.toFixed(2)}</small>
              </button>
            </li>
          ))}
        </ul>
      </Field>
      <Field id="s-engine-guests" icon={users} tone="success" label="Guests" value={guestLabel} open={panel === 'guests'} onToggle={() => toggle('guests')}>
        <div className="s-engine-guests">
          <Stepper label="Adults" hint="12+ years" value={guests.adults} min={1} max={WEBSITE_MAX_PARTY - guests.children - guests.infants} onChange={(v) => setGuests((g) => ({ ...g, adults: v }))} />
          <Stepper label="Children" hint="3–11 years · 50%" value={guests.children} min={0} max={WEBSITE_MAX_PARTY - guests.adults - guests.infants} onChange={(v) => setGuests((g) => ({ ...g, children: v }))} />
          <Stepper label="Infants" hint="Under 3 · free" value={guests.infants} min={0} max={WEBSITE_MAX_PARTY - guests.adults - guests.children} onChange={(v) => setGuests((g) => ({ ...g, infants: v }))} />
          <button type="button" className="s-btn s-btn-primary s-btn-sm" onClick={() => setPanel('date')}>
            Done
          </button>
        </div>
      </Field>
      <Field id="s-engine-date" icon={calendar} tone="warning" label="Date" value={date ? formatVisitDate(date, { weekday: 'short', day: 'numeric', month: 'short' }) : 'Choose a date'} open={panel === 'date'} onToggle={() => toggle('date')}>
        <Calendar
          value={date}
          party={party}
          program={program}
          onChange={(d) => {
            setDate(d);
            setPanel(null);
          }}
        />
      </Field>
      <button type="submit" className="s-engine-submit">
        Check Availability
      </button>
    </form>
  );
}
