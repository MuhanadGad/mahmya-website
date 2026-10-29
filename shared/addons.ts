// The add-ons guests can buy with a package: the paid water sports, and food &
// drink (open bar, open à la carte). Every add-on is editable in the dashboard
// (Reservations › Packages) and new ones can be added; like packages they're never
// deleted — set to inactive an add-on takes no new bookings, while bookings that
// have it keep it. Each package lists the add-ons it offers (shared/packages.ts).

import type { ActivityId } from './catalog.ts';

export type PaidActivityId = ActivityId;
export type AddOnUnit = 'person' | 'hour' | 'ride';
export type AddOnCategory = 'water' | 'dining';
export type AddOnStatus = 'active' | 'inactive';

/** A bookable add-on. */
export interface AddOn {
  /** Fixed once created; used in bookings and the analytics. */
  id: string;
  category: AddOnCategory;
  /** Water sports: the website activity it belongs to (its page, photo and the water-sports figures). */
  activityId: PaidActivityId | null;
  name: string;
  /** The option as printed on the website's activity card, e.g. "Single Kayak (1 hour)". */
  option: string;
  /** How long it lasts or when it's served, e.g. "1 hour", "15 min", "11:00 AM – 3:00 PM". */
  time: string;
  unit: AddOnUnit;
  price: number;
  /** Daily operating limit (boats, boards, riders, covers). */
  dailyCapacity: number;
  /** A photo from the site's own library (see ADD_ON_PHOTOS). */
  photo: string;
  status: AddOnStatus;
  /** Order on the website and in the dashboard (low first). */
  sort: number;
  updatedAt: string;
  updatedBy: string;
}

export type AddOnInput = Omit<AddOn, 'id' | 'updatedAt' | 'updatedBy'>;

export const UNIT_LABEL: Record<AddOnUnit, string> = { person: 'per person', hour: 'per hour', ride: 'per ride' };
export const CATEGORY_LABEL: Record<AddOnCategory, string> = { water: 'Water sports', dining: 'Food & drink' };

/** The photos an add-on can use: the site's own pictures. */
export const ADD_ON_PHOTOS: { key: string; label: string }[] = [
  { key: 'activity:kayak', label: 'Kayak' },
  { key: 'activity:sup', label: 'Stand-up paddle' },
  { key: 'activity:sea-spi', label: 'Sea-Spi' },
  { key: 'activity:banana', label: 'Banana boat' },
  { key: 'activity:ringo', label: 'Ringo' },
  { key: 'dining:beach-bar', label: 'Beach bar' },
  { key: 'dining:a-la-carte', label: 'À la carte' },
  { key: 'dining:buffet', label: 'Island buffet' },
  { key: 'dining:smoothie', label: 'Smoothie bar' },
];

const base = (a: Omit<AddOn, 'status' | 'updatedAt' | 'updatedBy'>): AddOn => ({ ...a, status: 'active', updatedAt: '', updatedBy: '' });

/** The original add-ons, as they were before any edit: the website's five water sports, then open bar and open à la carte. */
export function baseAddOns(): AddOn[] {
  return [
    base({ id: 'kayak-single', category: 'water', activityId: 'kayak', name: 'Single kayak', option: 'Single Kayak (1 hour)', time: '1 hour', unit: 'hour', price: 5, dailyCapacity: 64, photo: 'activity:kayak', sort: 10 }),
    base({ id: 'kayak-double', category: 'water', activityId: 'kayak', name: 'Double kayak', option: 'Double Kayak (1 hour)', time: '1 hour', unit: 'hour', price: 8, dailyCapacity: 48, photo: 'activity:kayak', sort: 20 }),
    base({ id: 'sup', category: 'water', activityId: 'sup', name: 'Stand-up paddle', option: 'SUP (1 hour)', time: '1 hour', unit: 'hour', price: 8, dailyCapacity: 60, photo: 'activity:sup', sort: 30 }),
    base({ id: 'seaspi-15', category: 'water', activityId: 'sea-spi', name: 'Sea-Spi Double · 15 min', option: '15 minutes', time: '15 min', unit: 'ride', price: 10, dailyCapacity: 64, photo: 'activity:sea-spi', sort: 40 }),
    base({ id: 'seaspi-30', category: 'water', activityId: 'sea-spi', name: 'Sea-Spi Double · 30 min', option: '30 minutes', time: '30 min', unit: 'ride', price: 15, dailyCapacity: 32, photo: 'activity:sea-spi', sort: 50 }),
    base({ id: 'banana', category: 'water', activityId: 'banana', name: 'Banana boat', option: 'Per person (10 min)', time: '10 min', unit: 'person', price: 10, dailyCapacity: 240, photo: 'activity:banana', sort: 60 }),
    base({ id: 'ringo', category: 'water', activityId: 'ringo', name: 'Ringo ride', option: 'Per person (10 min)', time: '10 min', unit: 'person', price: 18, dailyCapacity: 120, photo: 'activity:ringo', sort: 70 }),
    base({ id: 'open-bar', category: 'dining', activityId: null, name: 'Open bar', option: 'Unlimited drinks at the beach bar', time: '11:00 AM – 4:00 PM', unit: 'person', price: 25, dailyCapacity: 400, photo: 'dining:beach-bar', sort: 80 }),
    base({ id: 'a-la-carte', category: 'dining', activityId: null, name: 'Open à la carte', option: 'Order freely from the à la carte menu', time: '12:00 PM – 3:00 PM', unit: 'person', price: 30, dailyCapacity: 150, photo: 'dining:a-la-carte', sort: 90 }),
  ];
}

/** The stored add-ons on top of the originals: every original is always present. */
export function mergeAddOns(stored: AddOn[] | null): AddOn[] {
  const originals = baseAddOns();
  const byId = new Map((stored ?? []).map((a) => [a.id, a]));
  const list = [...originals.map((b) => ({ ...b, ...byId.get(b.id) })), ...(stored ?? []).filter((a) => !originals.some((b) => b.id === a.id))];
  return list.sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));
}

const ACTIVITIES: PaidActivityId[] = ['kayak', 'sup', 'sea-spi', 'banana', 'ringo'];

export function addOnProblem(a: Partial<AddOnInput>): string | null {
  if (!a.name?.trim()) return 'Give the add-on a name.';
  if (a.name.trim().length > 60) return 'Keep the name under 60 characters.';
  if (a.category !== 'water' && a.category !== 'dining') return 'Choose water sports or food & drink.';
  if (a.activityId !== null && a.activityId !== undefined && !ACTIVITIES.includes(a.activityId)) return 'Choose the water sport it belongs to.';
  if (a.category === 'water' && !a.activityId) return 'Choose the water sport it belongs to.';
  if ((a.time ?? '').length > 40) return 'Keep the time under 40 characters.';
  if ((a.option ?? '').length > 80) return 'Keep the website text under 80 characters.';
  if (!a.unit || !(a.unit in UNIT_LABEL)) return 'Choose how it’s charged.';
  if (!Number.isFinite(a.price) || (a.price as number) < 0 || (a.price as number) > 10_000) return 'Enter the price in euros.';
  if (!Number.isInteger(a.dailyCapacity) || (a.dailyCapacity as number) < 1 || (a.dailyCapacity as number) > 10_000) return 'The daily limit is a whole number from 1 to 10,000.';
  if (!ADD_ON_PHOTOS.some((f) => f.key === a.photo)) return 'Choose a photo.';
  return null;
}

/** A URL-safe id from the name, unique among the add-ons. */
export function addOnIdFor(name: string, taken: Set<string>): string {
  const stem =
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'add-on';
  let id = stem;
  for (let n = 2; taken.has(id); n++) id = `${stem}-${n}`;
  return id;
}

// ── The current add-ons ───────────────────────────────────────────────────────
// One list per running app, like the packages: the server loads it from the store,
// the website and dashboard receive it with the catalog. Starts as the originals.

let current: AddOn[] = baseAddOns();
const listeners = new Set<() => void>();

export function setAddOns(list: AddOn[]): void {
  current = list;
  for (const l of listeners) l();
}

export function getAddOns(): AddOn[] {
  return current;
}

export function subscribeAddOns(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addOnOf(id: string): AddOn | undefined {
  return current.find((a) => a.id === id);
}

export const addOnName = (id: string) => addOnOf(id)?.name ?? id;

/** Add-ons open for new bookings. */
export const activeAddOns = () => current.filter((a) => a.status === 'active');
