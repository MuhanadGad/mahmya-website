// mahmya-back → the website's catalog. The backend's public catalog
// (GET /api/public/catalog) holds the packages and add-ons; this maps them onto
// the shapes the website's pages were designed around (shared/packages.ts and
// shared/addons.ts). Anything the backend doesn't hold yet (featured flag, daily
// add-on limits, photos from the site's library) is filled in here.

import type { AddOn, AddOnUnit, PaidActivityId } from '../../shared/addons.ts';
import { FALLBACK_TRIPS, checkInTime, type CloudCatalog } from '../../shared/cloud.ts';
import type { PackageDef, PackageTimes } from '../../shared/packages.ts';
import { NO_EXTRAS, type ReservationStatus } from '../../shared/reservations.ts';
import type { PublicBooking } from '../../shared/website.ts';

type TripSlot = 'DAY' | 'SUNSET';

interface BackendAddon {
  id: string;
  name: string;
  photoUrl: string | null;
  type: 'WATER' | 'FOOD_AND_DRINK';
  time: string | null;
  price: string;
  chargeType: 'PER_PERSON' | 'PER_HOUR' | 'PER_RIDE';
  updatedAt: string;
}

interface BackendPackage {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  photoUrl: string | null;
  price: string;
  childPrice: string;
  updatedAt: string;
  slots: { slot: TripSlot; leaveTime: string; returnTime: string }[];
  includedAddons: BackendAddon[];
}

export interface BackendCatalog {
  packages: BackendPackage[];
  addons: BackendAddon[];
}

/** The website's boat schedule codes for the backend's trip slots. */
const SLOT_TRIP: Record<TripSlot, string> = { DAY: FALLBACK_TRIPS[0].code, SUNSET: FALLBACK_TRIPS[1].code };

const UNIT: Record<BackendAddon['chargeType'], AddOnUnit> = { PER_PERSON: 'person', PER_HOUR: 'hour', PER_RIDE: 'ride' };

/** Packages without their own photo get the closest picture from the site's library. */
const PACKAGE_PHOTO: [RegExp, string][] = [
  [/private|boat/i, 'program:private-boat'],
  [/group|event/i, 'program:groups'],
  [/full|snorkel/i, 'program:full'],
  [/lunch/i, 'program:beach-lunch'],
];

const ACTIVITY: [RegExp, PaidActivityId][] = [
  [/kayak/i, 'kayak'],
  [/sup\b|paddle/i, 'sup'],
  [/sea.?spi/i, 'sea-spi'],
  [/banana/i, 'banana'],
  [/ringo/i, 'ringo'],
];

const DINING_PHOTO: [RegExp, string][] = [
  [/bar|drink/i, 'dining:beach-bar'],
  [/smoothie|juice/i, 'dining:smoothie'],
  [/buffet|lunch/i, 'dining:buffet'],
];

const find = <T>(rules: [RegExp, T][], text: string): T | undefined => rules.find(([re]) => re.test(text))?.[1];

function toAddOn(a: BackendAddon, sort: number): AddOn {
  const activityId = a.type === 'WATER' ? (find(ACTIVITY, a.name) ?? null) : null;
  return {
    id: a.id,
    category: a.type === 'WATER' ? 'water' : 'dining',
    activityId,
    name: a.name,
    option: a.time ? `${a.name} (${a.time})` : a.name,
    time: a.time ?? '',
    unit: UNIT[a.chargeType],
    price: Number(a.price),
    dailyCapacity: 999, // not held by the backend yet
    photo: a.photoUrl ?? (activityId ? `activity:${activityId}` : (find(DINING_PHOTO, a.name) ?? 'dining:a-la-carte')),
    status: 'active',
    sort,
    updatedAt: a.updatedAt,
    updatedBy: '',
  };
}

function toPackage(p: BackendPackage, addOns: AddOn[], sort: number): PackageDef {
  const adult = Number(p.price);
  const child = Number(p.childPrice);
  const included = new Set(p.includedAddons.map((a) => a.id));
  const times: Record<string, PackageTimes> = {};
  for (const [slot, code] of Object.entries(SLOT_TRIP) as [TripSlot, string][]) {
    const own = p.slots.find((s) => s.slot === slot);
    times[code] = own ? { departure: own.leaveTime, returnTime: own.returnTime } : { off: true };
  }
  const includes = p.includedAddons.map((a) => a.name);
  return {
    id: p.id,
    name: p.name,
    tagline: p.tagline ?? p.description ?? '',
    includes: includes.length > 0 ? includes : p.description ? [p.description] : [],
    photo: p.photoUrl ?? find(PACKAGE_PHOTO, p.name) ?? 'program:day-use',
    adultPrice: adult,
    childPct: adult > 0 ? Math.round((child / adult) * 100) : 0,
    childPriceEur: child,
    useCloudPrice: false,
    lunchIncluded: /lunch|buffet/i.test([p.name, ...includes].join(' ')),
    featured: false,
    // Every other active add-on can be bought on top.
    addOns: addOns.filter((a) => !included.has(a.id)).map((a) => a.id),
    times,
    status: 'active',
    sort,
    updatedAt: p.updatedAt,
    updatedBy: '',
  };
}

/** The backend's catalog in the website's shape. Prices are the backend's (there is no cloud system). */
export function toSiteCatalog(c: BackendCatalog): CloudCatalog {
  const addOns = c.addons.map((a, i) => toAddOn(a, (i + 1) * 10));
  return {
    enabled: false,
    source: 'local',
    updatedAt: new Date().toISOString(),
    trips: FALLBACK_TRIPS,
    rates: {},
    egpPerEur: null,
    extraPrices: NO_EXTRAS,
    packages: c.packages.map((p, i) => toPackage(p, addOns, (i + 1) * 10)),
    addOns,
  };
}

// ── Bookings ─────────────────────────────────────────────────────────────────

/** A website guest's booking as mahmya-back returns it (POST /api/public/bookings and the lookups). */
export interface BackendPublicBooking {
  code: string;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  tripDate: string;
  slot: TripSlot;
  leaveTime: string;
  returnTime: string;
  package: { id: string; name: string };
  guests: { adults: number; children: number; infants: number };
  included: string[];
  addons: { id: string; name: string; quantity: number; unitPrice: string; lineTotal: string }[];
  adultPrice: string;
  childPrice: string;
  totals: { packageTotal: string; addonsTotal: string; discountAmount: string; total: string };
  contactName: string;
  contactEmail: string;
  createdAt: string;
  cancellable: boolean;
}

const STATUS: Record<BackendPublicBooking['status'], ReservationStatus> = {
  PENDING: 'pending', CONFIRMED: 'confirmed', CHECKED_IN: 'checked-in', COMPLETED: 'completed', CANCELLED: 'cancelled', NO_SHOW: 'no-show',
};

/** The backend's trip slot for one of the website's boat schedule codes. */
export const slotOfTrip = (code: string): TripSlot => (code === SLOT_TRIP.SUNSET ? 'SUNSET' : 'DAY');

/** The backend's booking in the website's shape: its schedule, price lines and status. */
export function toPublicBooking(b: BackendPublicBooking): PublicBooking {
  const trip = FALLBACK_TRIPS.find((t) => t.code === SLOT_TRIP[b.slot]) ?? FALLBACK_TRIPS[0];
  const adultPrice = Number(b.adultPrice), childPrice = Number(b.childPrice);
  const lines = [
    { id: 'adult', label: 'Adults', quantity: b.guests.adults, unitPrice: adultPrice, total: adultPrice * b.guests.adults },
    ...(b.guests.children ? [{ id: 'child', label: 'Children', quantity: b.guests.children, unitPrice: childPrice, total: childPrice * b.guests.children }] : []),
    ...(b.guests.infants ? [{ id: 'infant', label: 'Infants', quantity: b.guests.infants, unitPrice: 0, total: 0 }] : []),
    ...b.included.map((name) => ({ id: `included:${name}`, label: name, quantity: 1, unitPrice: 0, total: 0 })),
    ...b.addons.map((a) => ({ id: a.id, label: a.name, quantity: a.quantity, unitPrice: Number(a.unitPrice), total: Number(a.lineTotal) })),
  ];
  const programTotal = Number(b.totals.packageTotal), addOnsTotal = Number(b.totals.addonsTotal);
  return {
    code: b.code,
    status: STATUS[b.status],
    visitDate: b.tripDate,
    schedule: { code: trip.code, name: trip.name, checkIn: checkInTime({ ...trip, departure: b.leaveTime }), departure: b.leaveTime, returnTime: b.returnTime },
    programId: b.package.id,
    programName: b.package.name,
    guests: b.guests,
    addOns: b.addons.map((a) => ({ id: a.id, quantity: a.quantity })),
    quote: { lines, programTotal, addOnsTotal, subtotal: programTotal + addOnsTotal, discount: Number(b.totals.discountAmount), total: Number(b.totals.total), currency: 'EUR' },
    paymentStatus: 'unpaid', // payments aren't recorded yet: guests pay at the marina
    leadName: b.contactName,
    email: b.contactEmail,
    createdAt: b.createdAt,
    cancellable: b.cancellable,
  };
}
