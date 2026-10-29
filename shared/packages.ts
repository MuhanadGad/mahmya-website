// The packages guests book: every one is editable in the dashboard (texts, photo,
// what's included, prices, the add-ons it offers, its boat times) and new ones can
// be added. A package is never deleted —
// set to inactive it takes no new bookings, while its bookings and history stay.
// The five original packages are the starting point; for the cloud's three, the
// price can follow the cloud system (when it publishes one) or be set here.

import { baseAddOns, getAddOns, type AddOn } from './addons.ts';
import { PROGRAMS, type ProgramId } from './catalog.ts';

export type PackageStatus = 'active' | 'inactive';

/** A package's own times on one boat schedule. Empty times follow the schedule (Fleet › Trip times). */
export interface PackageTimes {
  /** Not sold on this schedule. */
  off?: boolean;
  /** HH:MM, island time. */
  departure?: string;
  returnTime?: string;
}

export interface PackageDef {
  /** Fixed once created; used in bookings, the sheet codes and the website's links. */
  id: ProgramId;
  name: string;
  tagline: string;
  /** "What's included" on the website's package card. */
  includes: string[];
  /** A photo from the site's own library (see PACKAGE_PHOTOS). */
  photo: string;
  /** Price per adult in EUR; children 3–11 pay `childPct` % of it, under-3s are free. */
  adultPrice: number;
  childPct: number;
  /** The exact child price in EUR, when the backend sets one (takes precedence over childPct). */
  childPriceEur?: number;
  /** Cloud packages only: use the cloud system's price when it publishes one for the visit date. */
  useCloudPrice: boolean;
  /** Lunch is part of the package (no lunch extra offered). */
  lunchIncluded: boolean;
  /** Shown as "Most popular" on the website. */
  featured: boolean;
  /** The add-ons guests can add to this package (ids from shared/addons.ts). */
  addOns: string[];
  /** Its own times or "not sold" per boat schedule code; missing schedules follow the schedule's times. */
  times: Record<string, PackageTimes>;
  status: PackageStatus;
  /** Order on the website and in the dashboard (low first). */
  sort: number;
  updatedAt: string;
  updatedBy: string;
}

export type PackageInput = Omit<PackageDef, 'id' | 'updatedAt' | 'updatedBy'>;

/** The photos a package can use: the site's own pictures (external images are blocked by the site's security policy). */
export const PACKAGE_PHOTOS: { key: string; label: string }[] = [
  { key: 'program:day-use', label: 'Beach day' },
  { key: 'program:beach-lunch', label: 'Beach lunch' },
  { key: 'program:full', label: 'Snorkelling' },
  { key: 'program:private-boat', label: 'Private boat' },
  { key: 'program:groups', label: 'Events & groups' },
  { key: 'activity:kayak', label: 'Kayak' },
  { key: 'activity:sup', label: 'Stand-up paddle' },
  { key: 'activity:banana', label: 'Banana boat' },
  { key: 'dining:buffet', label: 'Island buffet' },
  { key: 'dining:beach-bar', label: 'Beach bar' },
];

const BASE_INCLUDES: Record<string, string[]> = {
  'day-use': ['Beach access & sunbed', 'Access to water park', 'Snorkeling equipment', 'Kids club access'],
  'beach-lunch': ['Everything in Day Use', 'Premium buffet lunch', 'Drinks at lunch', 'Reserved dining seating'],
  full: ['Everything in Day Use + Lunch', 'À la carte lunch upgrade', 'Full bar access & welcome drink', 'Premium sunbed location'],
  'private-boat': ['Private boat with skipper', 'Snorkel stops on the reef', 'Soft drinks on board', 'Up to 12 guests'],
  groups: ['Reserved area for your group', 'Buffet or à la carte menu', 'Décor & music on request', 'Dedicated event host'],
};
const BASE_LUNCH = new Set(['beach-lunch', 'full']);
/** Full Program already includes à la carte and the bar, so it doesn't offer them as add-ons. */
const BASE_NOT_OFFERED: Record<string, string[]> = { full: ['open-bar', 'a-la-carte'] };

/** The add-ons a package offers until someone changes it: every original add-on it doesn't already include. */
export function defaultPackageAddOns(id: string): string[] {
  return baseAddOns()
    .map((a) => a.id)
    .filter((a) => !(BASE_NOT_OFFERED[id] ?? []).includes(a));
}
/** The website's design order for the originals. */
const BASE_ORDER = ['private-boat', 'day-use', 'beach-lunch', 'full', 'groups'];
export const CLOUD_PACKAGES = new Set<string>(['day-use', 'beach-lunch', 'full']);

/** The original five, as they were before any edit (current-year prices). */
export function basePackages(): PackageDef[] {
  return PROGRAMS.map((p, i) => ({
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    includes: BASE_INCLUDES[p.id] ?? [],
    photo: `program:${p.id}`,
    adultPrice: p.adult[2],
    childPct: 50,
    useCloudPrice: CLOUD_PACKAGES.has(p.id),
    lunchIncluded: BASE_LUNCH.has(p.id),
    featured: !!p.popular,
    addOns: defaultPackageAddOns(p.id),
    times: {},
    status: 'active',
    sort: BASE_ORDER.indexOf(p.id) * 10 + 10 || (i + 1) * 10,
    updatedAt: '',
    updatedBy: '',
  }));
}

/** The stored packages on top of the originals: every original is always present. */
export function mergePackages(stored: PackageDef[] | null): PackageDef[] {
  const originals = basePackages();
  const byId = new Map((stored ?? []).map((p) => [p.id, p]));
  // Packages saved before add-ons and times existed get the defaults.
  const list = [...originals.map((b) => ({ ...b, ...byId.get(b.id) })), ...(stored ?? []).filter((p) => !originals.some((b) => b.id === p.id)).map((p) => ({ ...p, addOns: p.addOns ?? defaultPackageAddOns(p.id), times: p.times ?? {} }))].map(({ egpPrice: _resident, ...p }: PackageDef & { egpPrice?: unknown }) => p);
  return list.sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));
}

export function packageProblem(p: Partial<PackageInput>): string | null {
  if (!p.name?.trim()) return 'Give the package a name.';
  if (p.name.trim().length > 60) return 'Keep the name under 60 characters.';
  if ((p.tagline ?? '').length > 160) return 'Keep the tagline under 160 characters.';
  if (!Number.isFinite(p.adultPrice) || (p.adultPrice as number) < 0 || (p.adultPrice as number) > 10_000) return 'Enter the adult price in euros.';
  if (!Number.isInteger(p.childPct) || (p.childPct as number) < 0 || (p.childPct as number) > 100) return 'The child price is a percentage of the adult price, 0–100.';
  if (!Array.isArray(p.includes) || p.includes.length > 8 || p.includes.some((t) => typeof t !== 'string' || t.trim().length === 0 || t.length > 80)) return 'List up to 8 included items, each under 80 characters.';
  if (!PACKAGE_PHOTOS.some((f) => f.key === p.photo)) return 'Choose a photo.';
  if (!Array.isArray(p.addOns) || p.addOns.length > 50 || p.addOns.some((id) => typeof id !== 'string' || !getAddOns().some((a) => a.id === id)) || new Set(p.addOns).size !== p.addOns.length) return 'Choose the add-ons from the list.';
  if (!p.times || typeof p.times !== 'object' || Array.isArray(p.times)) return 'Set the package’s times per boat schedule.';
  for (const [code, t] of Object.entries(p.times)) {
    if (!/^\w{1,12}$/.test(code) || !t || typeof t !== 'object') return 'Set the package’s times per boat schedule.';
    for (const v of [t.departure, t.returnTime]) if (v !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(v)) return 'Enter times as HH:MM.';
    if (t.departure && t.returnTime && t.returnTime <= t.departure) return 'The return time must be after the departure.';
  }
  return null;
}

/** A URL-safe id from the name, unique among the packages. */
export function packageIdFor(name: string, taken: Set<string>): string {
  const base =
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'package';
  let id = base;
  for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
  return id;
}

/** The child price for an adult price. */
export const childPrice = (p: Pick<PackageDef, 'adultPrice' | 'childPct' | 'childPriceEur'>) => p.childPriceEur ?? Math.round(p.adultPrice * p.childPct) / 100;

// ── The current packages ──────────────────────────────────────────────────────
// One list per running app: the server loads it from the store with the catalog,
// the website and dashboard receive it with the catalog. Starts as the originals.

let current: PackageDef[] = basePackages();
const listeners = new Set<() => void>();

export function setPackages(list: PackageDef[]): void {
  current = list;
  for (const l of listeners) l();
}

export function getPackages(): PackageDef[] {
  return current;
}

export function subscribePackages(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function packageOf(id: string): PackageDef | undefined {
  return current.find((p) => p.id === id);
}

export const packageName = (id: string) => packageOf(id)?.name ?? id;

/** Lunch is part of the package, so no lunch extra is offered. */
export const includesLunch = (id: string) => packageOf(id)?.lunchIncluded ?? false;

/** Packages open for new bookings. */
export const activePackages = () => current.filter((p) => p.status === 'active');

/** The add-ons a guest can add to a package now: offered by it and active. */
export function offeredAddOns(programId: string): AddOn[] {
  const offered = new Set(packageOf(programId)?.addOns ?? []);
  return getAddOns().filter((a) => a.status === 'active' && offered.has(a.id));
}

/** Sold on this boat schedule (not switched off for it). */
export const soldOn = (programId: string, tripCode: string) => !packageOf(programId)?.times?.[tripCode]?.off;
