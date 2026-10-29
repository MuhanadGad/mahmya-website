// Data hooks for the website: the catalog (packages, add-ons and their times,
// from mahmya-back), plus weather and booking availability — those two aren't on
// the backend yet, so they return static sample data and their screens are dimmed.

import { setAddOns } from '../../shared/addons.ts';
import { setPackages } from '../../shared/packages.ts';
import { useEffect, useMemo, useState } from 'react';
import { FALLBACK_TRIPS } from '../../shared/cloud.ts';
import { packageOf } from '../../shared/packages.ts';
import type { ProgramId } from '../../shared/catalog.ts';
import type { CloudCatalog } from '../../shared/cloud.ts';
import type { LiveWeather, PublicDay } from '../../shared/website.ts';
import { siteFetch } from './api';
import { usePackages } from '../lib/packages';
import { toSiteCatalog, type BackendCatalog } from './backend';

/** Not on the backend yet: a typical calm, sunny week, shown as a preview. */
function sampleWeather(): LiveWeather {
  const today = islandToday();
  return {
    source: 'model',
    updatedAt: new Date().toISOString(),
    current: { temp: 27, wind: 14, condition: 'sunny' },
    days: Array.from({ length: 7 }, (_, i) => ({ date: addDays(today, i), tempMax: 28 + (i % 3), tempMin: 21 + (i % 2), wind: 12 + ((i * 5) % 11), condition: i === 3 ? 'partly-cloudy' : 'sunny' })),
    closeWind: 34,
    partialWind: 29,
  };
}

export function useWeather(): { weather: LiveWeather | null; failed: boolean; sample: true } {
  const [weather] = useState(sampleWeather);
  return { weather, failed: false, sample: true };
}

let catalogRequest: Promise<CloudCatalog> | null = null;
let catalogLoaded: CloudCatalog | null = null;

/**
 * Packages and add-ons from mahmya-back (null until loaded, or if they can't be).
 * Until then the pages show the original five packages and nine add-ons.
 */
export function useCatalog(): CloudCatalog | null {
  const [catalog, setCatalog] = useState<CloudCatalog | null>(catalogLoaded);
  useEffect(() => {
    let alive = true;
    catalogRequest ??= siteFetch<BackendCatalog>('/public/catalog').then(
      (backend) => {
        const c = toSiteCatalog(backend);
        if (c.addOns) setAddOns(c.addOns);
        if (c.packages) setPackages(c.packages);
        return (catalogLoaded = c);
      },
      (err) => {
        catalogRequest = null;
        throw err;
      },
    );
    catalogRequest.then(
      (c) => alive && setCatalog(c),
      () => undefined,
    );
    return () => {
      alive = false;
    };
  }, []);
  return catalog;
}

export interface Availability {
  days: Map<string, PublicDay>;
}

const SAMPLE_PLACES = 120;

/** Not on the backend yet: every future day open on the package's boats, with a fixed number of places. */
function sampleDay(date: string, today: string, program: ProgramId | null): PublicDay {
  const past = date < today;
  const times = program ? packageOf(program)?.times : undefined;
  const trips = Object.fromEntries(
    FALLBACK_TRIPS.map((t) => {
      const sold = !past && !times?.[t.code]?.off;
      return [t.code, { remaining: sold ? SAMPLE_PLACES : 0, bookable: sold, reason: past ? 'past' : sold ? null : 'closed' }] as const;
    }),
  );
  const bookable = Object.values(trips).some((t) => t.bookable);
  return { date, remaining: bookable ? SAMPLE_PLACES : 0, bookable, closed: false, trips, addOns: {} };
}

/**
 * Places left per day and boat between two dates, for one package or the best of
 * them. Static sample data until the backend has an availability endpoint.
 */
export function useAvailability(from: string | null, to: string | null, _refreshKey = 0, program: ProgramId | null = null): { data: Availability | null; loading: boolean; error: string | null; sample: true } {
  const packages = usePackages(); // a package's boats change when the catalog arrives
  const data = useMemo(() => {
    if (!from || !to) return null;
    const today = islandToday();
    const days = new Map<string, PublicDay>();
    for (let d = from; d <= to; d = addDays(d, 1)) days.set(d, sampleDay(d, today, program));
    return { days };
  }, [from, to, program, packages]);
  return { data, loading: false, error: null, sample: true };
}

/** Island date today (Africa/Cairo), YYYY-MM-DD. */
export function islandToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' });
}

export function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** True when the visitor has asked their system for less motion. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia?.(REDUCED_MOTION).matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.(REDUCED_MOTION);
    if (!mq) return;
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** True while the element is on screen (used to run animations only when visible). */
export function useInView<T extends Element>(ref: React.RefObject<T | null>): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return setInView(true);
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '120px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}
