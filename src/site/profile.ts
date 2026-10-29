// "My Profile": the guest's details and booking codes, kept only in this browser
// (nothing is stored on the server beyond the bookings themselves). Storage can be
// blocked or cleared at any time, so every read falls back to "nothing saved".

import { countryOfMarket, isCountry } from '../../shared/nationalities.ts';
import type { MarketId } from '../../shared/catalog.ts';

export interface GuestProfile {
  name: string;
  email: string;
  phone: string;
  /** Country code (ISO); profiles saved before nationalities hold a market instead, read as its main country. */
  nationality: string;
  hotel: string;
}

export interface SavedBooking {
  code: string;
  email: string;
}

const PROFILE_KEY = 'mahmya:profile';
const BOOKINGS_KEY = 'mahmya:bookings';
const MAX_SAVED = 20;

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');

export function loadProfile(): GuestProfile | null {
  const p = read<Partial<GuestProfile>>(PROFILE_KEY);
  if (!p || typeof p !== 'object') return null;
  const old = (p as { market?: unknown }).market;
  const nationality = isCountry(p.nationality) ? p.nationality : (countryOfMarket(text(old, 20) as MarketId) ?? '');
  return { name: text(p.name, 120), email: text(p.email, 254), phone: text(p.phone, 40), nationality, hotel: text(p.hotel, 120) };
}

/** Returns false when the browser won't let us save (private mode, blocked storage). */
export function saveProfile(p: GuestProfile): boolean {
  return write(PROFILE_KEY, p);
}

export function savedBookings(): SavedBooking[] {
  const list = read<SavedBooking[]>(BOOKINGS_KEY);
  return Array.isArray(list) ? list.filter((b) => b && typeof b.code === 'string' && typeof b.email === 'string') : [];
}

/** Remembers a booking code on this device (newest first, no duplicates). */
export function rememberBooking(code: string, email: string): boolean {
  const rest = savedBookings().filter((b) => b.code !== code);
  return write(BOOKINGS_KEY, [{ code, email: email.trim().toLowerCase() }, ...rest].slice(0, MAX_SAVED));
}

/** Forgets everything this site saved on the device. */
export function forgetDevice(): void {
  write(PROFILE_KEY, null);
  write(BOOKINGS_KEY, null);
}
