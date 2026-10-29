// Public website ↔ platform contract: what the website sends in (enquiries,
// newsletter sign-ups, visit counts) and what it reads (availability, live weather,
// a guest's own booking). Bookings themselves use the reservation types.

import type { ProgramId } from './catalog.ts';
import type { AddOnSelection, GuestMix, PaymentStatus, Quote, ReservationStatus } from './reservations.ts';

// ── Leads ────────────────────────────────────────────────────────────────────

export type EnquiryType = 'event' | 'contact';
export type EnquiryStatus = 'new' | 'handled';

export const EVENT_TYPES = ['Wedding', 'Birthday', 'Corporate day', 'Private celebration', 'School or club trip', 'Other'] as const;

export interface Enquiry {
  id: string;
  type: EnquiryType;
  status: EnquiryStatus;
  name: string;
  email: string;
  phone: string;
  message: string;
  /** Event enquiries only. */
  eventType: string | null;
  eventDate: string | null;
  guests: number | null;
  createdAt: string;
  handledAt: string | null;
  handledBy: string | null;
}

export interface Subscriber {
  email: string;
  createdAt: string;
  source: string;
}

// ── Website traffic (anonymous daily counts, no cookies or personal data) ───

export const WEBSITE_METRICS = ['visits', 'booking_started', 'booking_completed', 'enquiries', 'subscribers'] as const;
export type WebsiteMetric = (typeof WEBSITE_METRICS)[number];
/** Events the browser may report; the rest are counted by the server when they happen. */
export const CLIENT_METRICS: WebsiteMetric[] = ['visits', 'booking_started'];

export interface MetricsDay {
  date: string;
  counts: Partial<Record<WebsiteMetric, number>>;
}

export interface WebsiteSummary {
  from: string;
  to: string;
  days: (MetricsDay & { bookings: number; revenue: number })[];
  totals: Record<WebsiteMetric, number> & { bookings: number; revenue: number; guests: number };
  newEnquiries: number;
  subscribers: number;
}

// ── Live weather (Open-Meteo, cached on the server) ─────────────────────────

export type WeatherCondition = 'sunny' | 'partly-cloudy' | 'cloudy' | 'fog' | 'rain' | 'storm';

export interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  /** Maximum wind speed, km/h. */
  wind: number;
  condition: WeatherCondition;
}

export interface LiveWeather {
  source: 'open-meteo' | 'model';
  updatedAt: string;
  current: { temp: number; wind: number; condition: WeatherCondition };
  days: ForecastDay[];
  closeWind: number;
  partialWind: number;
}

// ── Public booking views ─────────────────────────────────────────────────────

/** Why a schedule can't be booked online on a date. */
export type UnavailableReason = 'closed' | 'past' | 'too-far' | 'no-price';

export interface PublicTripDay {
  /** Places left on this boat for the package asked about (0 = sold out). */
  remaining: number;
  bookable: boolean;
  reason: UnavailableReason | null;
}

export interface PublicDay {
  date: string;
  /** Places left on the best schedule that can still be booked (0 = sold out or not bookable). */
  remaining: number;
  /** True when at least one schedule can still be booked online. */
  bookable: boolean;
  /** Every schedule is closed in the cloud system (no sailings). */
  closed: boolean;
  /** By schedule code. */
  trips: Record<string, PublicTripDay>;
  addOns: Record<string, number>;
}

/** What a guest sees about their own booking — never staff notes or payment internals. */
export interface PublicBooking {
  code: string;
  status: ReservationStatus;
  visitDate: string;
  /** The boat schedule, with island-time HH:MM times. */
  schedule: { code: string; name: string; checkIn: string; departure: string; returnTime: string };
  programId: ProgramId;
  guests: GuestMix;
  addOns: AddOnSelection[];
  quote: Quote;
  paymentStatus: PaymentStatus;
  leadName: string;
  email: string;
  createdAt: string;
  /** True while the guest may still cancel online (free cancellation window). */
  cancellable: boolean;
}

/** Free online cancellation until this many hours before check-in for the booked boat. */
export const FREE_CANCELLATION_HOURS = 24;
/** Larger parties are routed to the events team. */
export const WEBSITE_MAX_PARTY = 30;
export const GROUPS_MIN_PARTY = 10;
