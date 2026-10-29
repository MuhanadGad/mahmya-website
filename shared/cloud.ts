// The Mahmya cloud booking system (api.pay.mahmya.com) is the source of truth for
// the boat schedules and, for the three programs it sells, for prices,
// availability and closed days. This is what the server and the pages share;
// server/cloud.ts is the only code that talks to the cloud itself.

import type { AddOn } from './addons.ts';
import { packageOf, type PackageDef } from './packages.ts';
import type { ProgramId } from './catalog.ts';
import { catalogRate, type ExtraPrices, type Rate } from './reservations.ts';

/** A boat schedule (a "trip" in the cloud system). Times are island time, HH:MM. */
export interface Trip {
  code: string;
  name: string;
  departure: string;
  returnTime: string;
  lunch: string;
  snorkeling: string;
}

/** The schedules as the cloud published them on 6 Oct 2026, used while it can't be reached. */
export const FALLBACK_TRIPS: Trip[] = [
  { code: '001', name: 'Day trip', departure: '08:30', returnTime: '15:30', lunch: '12:30', snorkeling: '11:00' },
  { code: '002', name: 'Sunset trip', departure: '10:30', returnTime: '17:30', lunch: '13:30', snorkeling: '12:20' },
];

/** Bookings made before guests chose a schedule sail on the day trip. */
export const DEFAULT_TRIP = '001';

export function tripOf(r: { tripCode?: string }): string {
  return r.tripCode ?? DEFAULT_TRIP;
}

/** A booking's schedule, even if the cloud has since withdrawn it. */
export function findTrip(trips: Trip[], code: string): Trip {
  return trips.find((t) => t.code === code) ?? FALLBACK_TRIPS.find((t) => t.code === code) ?? { ...FALLBACK_TRIPS[0], code, name: `Schedule ${code}` };
}

/** Cloud service codes of the programs the cloud sells. Private Boat Trips and Events & Groups are website-only. */
export const CLOUD_SERVICE_CODES: Readonly<Record<string, string>> = { 'day-use': '4', 'beach-lunch': '39', full: '1' };

export function isCloudProgram(id: ProgramId): boolean {
  return id in CLOUD_SERVICE_CODES;
}

/** Guests check in this long before their boat leaves (the island day on the website: check-in 9:00, boat 9:30). */
export const CHECK_IN_BEFORE_DEPARTURE_MIN = 30;
/** Same-day online bookings close this long before check-in. */
export const SAME_DAY_CLOSE_BEFORE_CHECK_IN_MIN = 90;

/** Adds minutes to an HH:MM time of day. */
export function shiftTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = (((h * 60 + m + minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** A schedule as one package sails it: the package's own departure and return times where set. */
export function packageTrip(programId: ProgramId, trip: Trip): Trip {
  const own = packageOf(programId)?.times?.[trip.code];
  return own?.departure || own?.returnTime ? { ...trip, departure: own.departure || trip.departure, returnTime: own.returnTime || trip.returnTime } : trip;
}

export const checkInTime = (trip: Trip) => shiftTime(trip.departure, -CHECK_IN_BEFORE_DEPARTURE_MIN);
export const sameDayCutoff = (trip: Trip) => shiftTime(checkInTime(trip), -SAME_DAY_CLOSE_BEFORE_CHECK_IN_MIN);

/** "08:30" → "8:30 AM". */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/** A cloud price for one program on one schedule, per person in euros. */
export interface ProgramRate extends Rate {
  /** The price period (YYYY-MM-DD, inclusive). Visits outside it have no published price. */
  validFrom: string;
  validTo: string;
  minPax: number;
  maxPax: number;
}

export interface CloudCatalog {
  /** False when no cloud token is configured: prices and capacity are then the website's own. */
  enabled: boolean;
  /** "cloud" when schedules and prices came from the cloud system, "local" when it is off or can't be reached. */
  source: 'cloud' | 'local';
  updatedAt: string;
  trips: Trip[];
  /** Cloud prices by schedule code, then program. */
  rates: Record<string, Partial<Record<ProgramId, ProgramRate>>>;
  /** The cloud's exchange rate, EGP per euro. */
  egpPerEur: number | null;
  /** Per-person prices of the trip extras, set in the dashboard (not by the cloud). */
  extraPrices: ExtraPrices;
  /** Every package, as set in the dashboard (inactive ones too, for existing bookings). */
  packages?: PackageDef[];
  /** Every add-on, as set in the dashboard (inactive ones too, for existing bookings). */
  addOns?: AddOn[];
}

export function rateCovers(rate: ProgramRate, date: string): boolean {
  return date >= rate.validFrom && date <= rate.validTo;
}

export function cloudRate(catalog: CloudCatalog | null, programId: ProgramId, tripCode: string): ProgramRate | null {
  return catalog?.rates[tripCode]?.[programId] ?? null;
}

/** The rate a booking is priced at: the cloud's for its programs when it covers the visit date, otherwise the website's catalog price. */
export function bookingRate(catalog: CloudCatalog | null, programId: ProgramId, tripCode: string, visitDate: string): Rate {
  const rate = followsCloud(programId) ? cloudRate(catalog, programId, tripCode) : null;
  return rate && rateCovers(rate, visitDate) ? { adult: rate.adult, child: rate.child } : catalogRate(programId, visitDate);
}

/** A cloud package priced by the cloud (unless set to its own price in the dashboard). */
export function followsCloud(programId: ProgramId): boolean {
  return isCloudProgram(programId) && packageOf(programId)?.useCloudPrice !== false;
}

/** The "from" price shown on package cards: the lowest cloud price across schedules, otherwise the catalog's. */
export function displayRate(catalog: CloudCatalog | null, programId: ProgramId, today: string): Rate {
  const rates = (followsCloud(programId) ? Object.values(catalog?.rates ?? {}) : [])
    .map((byProgram) => byProgram[programId])
    .filter((r): r is ProgramRate => !!r);
  if (rates.length === 0) return catalogRate(programId, today);
  const lowest = rates.reduce((a, b) => (b.adult < a.adult ? b : a));
  return { adult: lowest.adult, child: lowest.child };
}
