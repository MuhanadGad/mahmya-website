// Reservations: guests book a package, plus the add-ons it offers (water sports,
// open bar, open à la carte). Pricing and validation are shared by the API
// (authoritative) and the booking screens (live quote).

import { CHANNELS, MARKETS, SOURCE_OF_CHANNEL, programById, type BookingSource, type ChannelId, type MarketId, type ProgramId } from './catalog.ts';
import { addOnOf, getAddOns, type AddOn } from './addons.ts';
import { childPrice, includesLunch, packageName, packageOf } from './packages.ts';
import { isCountry, marketOf } from './nationalities.ts';

export type { AddOn, AddOnUnit, PaidActivityId } from './addons.ts';
export { UNIT_LABEL } from './addons.ts';

/** Island daily guest limit (protected-area quota and boat seats). */
export const ISLAND_DAILY_CAPACITY = 1450;
export const MAX_PARTY_SIZE = 120;
export const PRIVATE_BOAT_MAX = 12;
export const MAX_DISCOUNT_PCT = 10;
export const MAX_OVERRIDE_DISCOUNT_PCT = 50;

export type ReservationStatus = 'confirmed' | 'checked-in' | 'completed' | 'cancelled' | 'no-show';
export type PaymentStatus = 'unpaid' | 'deposit' | 'paid' | 'refunded';
export type PaymentMethod = 'card' | 'cash' | 'bank-transfer' | 'invoice' | 'voucher';

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  confirmed: 'Confirmed',
  'checked-in': 'Checked in',
  completed: 'Completed',
  cancelled: 'Cancelled',
  'no-show': 'No-show',
};
export const PAYMENT_LABEL: Record<PaymentStatus, string> = { unpaid: 'Unpaid', deposit: 'Deposit', paid: 'Paid', refunded: 'Refunded' };
export const METHOD_LABEL: Record<PaymentMethod, string> = { card: 'Card', cash: 'Cash', 'bank-transfer': 'Bank transfer', invoice: 'Invoice (agent)', voucher: 'Voucher' };

/** Statuses that hold capacity. */
export const ACTIVE_STATUSES: ReservationStatus[] = ['confirmed', 'checked-in', 'completed'];

export interface GuestMix {
  adults: number;
  /** Ages 3–11, half price. */
  children: number;
  /** Ages 0–2, free. */
  infants: number;
}

export interface AddOnSelection {
  id: string;
  quantity: number;
}

/** Trip extras any package can take: guests on the snorkelling boat run, guests taking lunch. They don't change the trip. */
export interface TripExtras {
  snorkeling: number;
  lunch: number;
}

/** Per-person prices of the trip extras in EUR (0 = free). */
export type ExtraPrices = TripExtras;

export const NO_EXTRAS: TripExtras = { snorkeling: 0, lunch: 0 };
export const EXTRA_LABEL: Record<keyof TripExtras, string> = { snorkeling: 'Snorkelling trip', lunch: 'Lunch' };
/** Packages whose lunch is included, so the lunch extra isn't offered. */
/** Lunch is part of these packages (set per package in the dashboard). */
export { includesLunch };
/** Guides travelling with one company group, at most. */
export const MAX_GUIDES = 20;

export interface QuoteLine {
  id: string;
  label: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  lines: QuoteLine[];
  programTotal: number;
  addOnsTotal: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: 'EUR';
}

export interface LeadGuest {
  name: string;
  email: string;
  phone: string;
  market: MarketId;
  hotel: string;
  /** National ID (Egyptians) or passport number (foreign guests), given when booking online. */
  document?: string;
}

export interface Reservation {
  id: string;
  code: string;
  status: ReservationStatus;
  visitDate: string;
  /** Boat schedule (cloud trip code). Missing on bookings made before guests chose one: the day trip. */
  tripCode?: string;
  programId: ProgramId;
  /** The tour company that booked the group; missing or null for individual guests. A company can book several groups a day. */
  companyId?: string | null;
  /** Tells a company's groups apart: its voucher or reference, or a name like "Group B". */
  groupRef?: string;
  /** Nationalities in the party (ISO codes), main first. Missing on older bookings, which only have the lead guest's market. */
  nationalities?: string[];
  /** Guides travelling with a company group: they take adult seats on the boat and don't pay. */
  guides?: number;
  extras?: TripExtras;
  /** Set on bookings imported from the cloud system's daily sheet: re-importing the day updates them. */
  importKey?: string | null;
  guests: GuestMix;
  leadGuest: LeadGuest;
  channel: ChannelId;
  addOns: AddOnSelection[];
  discountPct: number;
  /** Priced by the server at the last change. */
  quote: Quote;
  payment: { status: PaymentStatus; method: PaymentMethod | null; paid: number; refunded: number };
  notes: string;
  cancellationReason: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  checkedInAt: string | null;
  /** Counted at the marina as the group boarded (the daily sheet's ACT columns). */
  boarding?: BoardingCount | null;
}

/** Who of a group actually boarded, counted at the marina. */
export interface BoardingCount {
  adults: number;
  children: number;
  infants: number;
  guides: number;
  at: string;
  by: string;
}

/** Where a booking came from: a company group, a guest online (website or the cloud sheet's individuals), or staff in the dashboard. */
export function bookingSource(r: Pick<Reservation, 'companyId' | 'createdBy' | 'channel'>): BookingSource {
  if (r.companyId) return 'company';
  if (r.createdBy === 'website' || r.createdBy.startsWith('Sheet import')) return 'website';
  // Seeded demo bookings (local development only) carry no origin: estimated from the channel, like the sample history.
  if (r.createdBy === 'demo-data') return SOURCE_OF_CHANNEL[r.channel];
  return 'staff';
}

/** Who actually came: the marina's count, nobody for a no-show, or null while not counted. */
export function actualOf(r: Pick<Reservation, 'status' | 'boarding'>): { adults: number; children: number; infants: number; guides: number } | null {
  if (r.status === 'no-show') return { adults: 0, children: 0, infants: 0, guides: 0 };
  if (r.boarding && (r.status === 'checked-in' || r.status === 'completed')) return { adults: r.boarding.adults, children: r.boarding.children, infants: r.boarding.infants, guides: r.boarding.guides };
  return null;
}

/** What the booking screen sends; the server prices it and fills the rest. */
export interface ReservationInput {
  visitDate: string;
  tripCode: string;
  programId: ProgramId;
  companyId: string | null;
  groupRef: string;
  nationalities: string[];
  guides: number;
  extras: TripExtras;
  guests: GuestMix;
  leadGuest: LeadGuest;
  channel: ChannelId;
  addOns: AddOnSelection[];
  discountPct: number;
  /** Amount received so far; the server derives the payment status from it. */
  payment: { method: PaymentMethod | null; paid: number };
  notes: string;
  /** Allow exceeding island or add-on capacity (requires reservations:override). */
  overbook?: boolean;
}

/** Places for one package on one boat schedule. */
export interface OptionPlaces {
  remaining: number;
  /** Closed in the cloud system (no sailing, or no allotment for this package). */
  closed: boolean;
  /** "cloud" when the cloud system's count was used, "local" for the island limit alone. */
  source: 'cloud' | 'local';
}

export interface DayAvailability {
  date: string;
  capacity: number;
  booked: number;
  remaining: number;
  bookings: number;
  addOns: Record<string, { booked: number; capacity: number }>;
  /** Places by schedule code, then package. */
  options: Record<string, Record<ProgramId, OptionPlaces>>;
  /** Every schedule is closed in the cloud system. */
  closed: boolean;
}

export const round2 = (v: number) => Math.round(v * 100) / 100;

export function partySize(g: GuestMix): number {
  return g.adults + g.children + g.infants;
}

export function payingGuests(g: GuestMix): number {
  return g.adults + g.children;
}

function priceYear(visitDate: string): 0 | 1 | 2 {
  const y = Number(visitDate.slice(0, 4));
  return y <= 2024 ? 0 : y === 2025 ? 1 : 2;
}

/** Per-person package price in EUR. */
export interface Rate {
  adult: number;
  /** Ages 3–11. */
  child: number;
}

/** The website's catalog price: children 3–11 pay half. */
export function catalogRate(programId: ProgramId, visitDate: string): Rate {
  const pkg = packageOf(programId);
  const base = programById[programId as keyof typeof programById];
  // An original package nobody has edited keeps its year-by-year prices; otherwise the price set in the dashboard.
  if (pkg && (pkg.updatedAt || !base)) return { adult: pkg.adultPrice, child: childPrice(pkg) };
  if (!base) return { adult: 0, child: 0 };
  const adult = base.adult[priceYear(visitDate)];
  return { adult, child: adult / 2 };
}

/**
 * Prices a booking: adults and children 3–11 at the package rate (the cloud system's
 * for its programs, see shared/cloud.ts), infants free, add-ons per unit.
 */
export function quote(
  input: { programId: ProgramId; guests: GuestMix; addOns: AddOnSelection[]; extras?: TripExtras; discountPct: number; visitDate: string },
  rate: Rate = catalogRate(input.programId, input.visitDate),
  extraPrices: ExtraPrices = NO_EXTRAS,
): Quote {
  const program = { name: packageName(input.programId) };
  const lines: QuoteLine[] = [];
  const { adults, children, infants } = input.guests;
  if (adults) lines.push({ id: 'adult', label: `${program.name} · adult`, quantity: adults, unitPrice: rate.adult, total: round2(adults * rate.adult) });
  if (children) lines.push({ id: 'child', label: `${program.name} · child (3–11)`, quantity: children, unitPrice: rate.child, total: round2(children * rate.child) });
  if (infants) lines.push({ id: 'infant', label: `${program.name} · infant (0–2)`, quantity: infants, unitPrice: 0, total: 0 });
  const programTotal = round2(lines.reduce((s, l) => s + l.total, 0));

  let addOnsTotal = 0;
  for (const sel of input.addOns) {
    const a = addOnOf(sel.id);
    if (!a || sel.quantity <= 0) continue;
    const total = round2(sel.quantity * a.price);
    addOnsTotal += total;
    lines.push({ id: a.id, label: a.name, quantity: sel.quantity, unitPrice: a.price, total });
  }
  for (const key of ['snorkeling', 'lunch'] as const) {
    const quantity = input.extras?.[key] ?? 0;
    if (quantity <= 0) continue;
    const total = round2(quantity * extraPrices[key]);
    addOnsTotal += total;
    lines.push({ id: `extra-${key}`, label: EXTRA_LABEL[key], quantity, unitPrice: extraPrices[key], total });
  }
  addOnsTotal = round2(addOnsTotal);
  const subtotal = round2(programTotal + addOnsTotal);
  const discount = round2((subtotal * input.discountPct) / 100);
  return { lines, programTotal, addOnsTotal, subtotal, discount, total: round2(subtotal - discount), currency: 'EUR' };
}

function isIsoDate(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

const isCount = (v: unknown, max: number) => Number.isInteger(v) && (v as number) >= 0 && (v as number) <= max;

/** Maximum quantity a booking may take of an add-on. */
export function maxQuantity(addOn: AddOn, guests: GuestMix): number {
  const paying = payingGuests(guests);
  return addOn.unit === 'person' ? paying : paying * 4;
}

/** Structural validation shared by the form and the API. Returns the first problem, or null. */
export function reservationProblem(input: ReservationInput, options: { canOverrideDiscount: boolean }): string | null {
  if (!isIsoDate(input.visitDate)) return 'Choose a valid visit date.';
  if (typeof input.tripCode !== 'string' || !/^\w{1,12}$/.test(input.tripCode)) return 'Choose a boat schedule.';
  if (!packageOf(input.programId)) return 'Choose a package.';
  const g = input.guests;
  if (!g || !isCount(g.adults, MAX_PARTY_SIZE) || !isCount(g.children, MAX_PARTY_SIZE) || !isCount(g.infants, MAX_PARTY_SIZE)) return 'Guest numbers must be whole numbers.';
  if (g.adults < 1) return 'Every booking needs at least one adult.';
  if (partySize(g) > MAX_PARTY_SIZE) return `Parties above ${MAX_PARTY_SIZE} guests must be booked as several reservations.`;
  if (input.programId === 'private-boat' && partySize(g) > PRIVATE_BOAT_MAX) return `Private boat trips take up to ${PRIVATE_BOAT_MAX} guests.`;
  if (input.companyId !== null && (typeof input.companyId !== 'string' || !input.companyId)) return 'Choose the tour company.';
  if (typeof input.groupRef !== 'string' || input.groupRef.length > 60) return 'The group name or reference is up to 60 characters.';
  if (!Array.isArray(input.nationalities) || input.nationalities.length > 6 || !input.nationalities.every(isCountry) || new Set(input.nationalities).size !== input.nationalities.length) return 'Choose up to 6 different nationalities from the list.';
  if (!isCount(input.guides, MAX_GUIDES)) return `Guides must be a whole number from 0 to ${MAX_GUIDES}.`;
  if (input.guides > 0 && input.companyId === null) return 'Guides travel with company groups only.';
  const extras = input.extras;
  if (!extras || !isCount(extras.snorkeling, payingGuests(g)) || !isCount(extras.lunch, payingGuests(g))) return `Snorkelling and lunch can be added for up to ${payingGuests(g)} guests (adults and children).`;
  if (extras.lunch > 0 && includesLunch(input.programId)) return `Lunch is already included in ${packageName(input.programId)}.`;
  const lead = input.leadGuest;
  if (!lead || typeof lead.name !== 'string' || !lead.name.trim() || lead.name.length > 120) return 'Enter the lead guest’s name.';
  if (typeof lead.email !== 'string' || lead.email.length > 254 || (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))) return 'Enter a valid email address or leave it empty.';
  if (typeof lead.phone !== 'string' || lead.phone.length > 32 || (lead.phone && !/^[+\d][\d\s()-]{5,}$/.test(lead.phone))) return 'Enter a valid phone number or leave it empty.';
  if (!MARKETS.some((m) => m.id === lead.market)) return 'Choose the guest’s country.';
  if (typeof lead.hotel !== 'string' || lead.hotel.length > 120) return 'Hotel name is too long.';
  if (lead.document !== undefined && (typeof lead.document !== 'string' || lead.document.length > 40 || (lead.document && !/^[A-Za-z0-9 -]{4,40}$/.test(lead.document)))) return 'Enter the National ID or passport number (letters and digits).';
  if (!CHANNELS.some((c) => c.id === input.channel)) return 'Choose a booking channel.';
  if (!Array.isArray(input.addOns) || input.addOns.length > getAddOns().length) return 'Invalid add-ons.';
  const seen = new Set<string>();
  for (const sel of input.addOns) {
    const a = addOnOf(sel?.id);
    if (!a || seen.has(a.id)) return 'Invalid add-on selection.';
    seen.add(a.id);
    if (!Number.isInteger(sel.quantity) || sel.quantity < 1) return `Choose a quantity for ${a.name}.`;
    if (sel.quantity > maxQuantity(a, g)) return `${a.name}: at most ${maxQuantity(a, g)} for this party.`;
  }
  const maxDiscount = options.canOverrideDiscount ? MAX_OVERRIDE_DISCOUNT_PCT : MAX_DISCOUNT_PCT;
  if (typeof input.discountPct !== 'number' || input.discountPct < 0 || input.discountPct > maxDiscount) return `Discount can be at most ${maxDiscount}% for your role.`;
  const p = input.payment;
  if (!p) return 'Enter the payment details.';
  if (p.method !== null && !(['card', 'cash', 'bank-transfer', 'invoice', 'voucher'] as string[]).includes(p.method)) return 'Choose a payment method.';
  if (typeof p.paid !== 'number' || p.paid < 0 || p.paid > 1_000_000) return 'Enter the amount paid.';
  if (typeof input.notes !== 'string' || input.notes.length > 1000) return 'Notes are too long.';
  return null;
}

/**
 * Add-ons new to a booking must be active and offered with its package; ones the
 * booking already had stay, even if since switched off or no longer offered.
 */
export function addOnOfferProblem(input: Pick<ReservationInput, 'programId' | 'addOns'>, current?: Pick<Reservation, 'addOns'>): string | null {
  const had = new Set((current?.addOns ?? []).map((a) => a.id));
  const offered = new Set(packageOf(input.programId)?.addOns ?? []);
  for (const sel of input.addOns) {
    if (had.has(sel.id)) continue;
    const a = addOnOf(sel.id);
    if (!a) return 'Invalid add-on selection.';
    if (a.status !== 'active') return `${a.name} isn’t available any more.`;
    if (!offered.has(a.id)) return `${a.name} isn’t offered with ${packageName(input.programId)}.`;
  }
  return null;
}

/** The analytics market follows the main nationality, when there is one. */
export function withMarket(input: ReservationInput): ReservationInput {
  return input.nationalities.length ? { ...input, leadGuest: { ...input.leadGuest, market: marketOf(input.nationalities[0]) } } : input;
}

/** Payment status follows the amount received (refunds are recorded separately). */
export function paymentStatusFor(paid: number, total: number): PaymentStatus {
  if (paid <= 0) return 'unpaid';
  return paid + 0.005 >= total ? 'paid' : 'deposit';
}

export function epochDay(date: string): number {
  return Math.round(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
}

/** Today's date on the island (Hurghada, Africa/Cairo) as YYYY-MM-DD. */
export function islandToday(now: Date = new Date()): string {
  return now.toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' });
}

export function addDaysToDate(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
}
