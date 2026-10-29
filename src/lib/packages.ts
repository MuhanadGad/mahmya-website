// The packages and add-ons on the client: the current lists (from the catalog),
// their photos from the site's own library, and an icon for each "What's included" line.

import { useSyncExternalStore } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Armchair, Check, Fish, GlassWater, Martini, Package, Ship, Sparkles, Star, Sun, UmbrellaOff, Users, Utensils, VenetianMask, Waves } from 'lucide-react';
import { getAddOns, subscribeAddOns, type AddOn } from '../../shared/addons.ts';
import { getPackages, subscribePackages, type PackageDef } from '../../shared/packages.ts';
import { PAID_ACTIVITIES, PROGRAMS, OUTLETS } from '../data/catalog';

/** Every package, re-rendering when the list changes. */
export function usePackages(): PackageDef[] {
  return useSyncExternalStore(subscribePackages, getPackages, getPackages);
}

const PHOTOS: Record<string, string> = {
  ...Object.fromEntries(PROGRAMS.map((p) => [`program:${p.id}`, p.image])),
  ...Object.fromEntries(PAID_ACTIVITIES.map((a) => [`activity:${a.id}`, a.image])),
  ...Object.fromEntries(OUTLETS.map((o) => [`dining:${o.id}`, o.image])),
};

/** The image for a package's photo key. */
export const photoOf = (key: string): string => (/^(https?:)?\/\//.test(key) || key.startsWith('/') ? key : (PHOTOS[key] ?? PROGRAMS[0].image));

const ICONS: [RegExp, LucideIcon][] = [
  [/everything in/i, Package],
  [/buffet|lunch|menu|meal|food/i, Utensils],
  [/drink|bar|water(?! park)/i, GlassWater],
  [/cocktail|welcome drink|martini/i, Martini],
  [/boat|skipper|cruise|transfer/i, Ship],
  [/snorkel/i, VenetianMask],
  [/reef|fish|diving/i, Fish],
  [/sunbed|umbrella|beach access/i, UmbrellaOff],
  [/seat|lounge|chair/i, Armchair],
  [/guest|group|kids|family|host/i, Users],
  [/water park|pool|swim|sea/i, Waves],
  [/premium|vip|upgrade|à la carte/i, Star],
  [/sun/i, Sun],
  [/décor|music|event|party/i, Sparkles],
];

/** An icon that fits an included item's wording. */
export function includeIcon(text: string): LucideIcon {
  return ICONS.find(([re]) => re.test(text))?.[1] ?? Check;
}

const NONE = { bookings: 0, guests: 0, gross: 0 };

/** A package's figures in a period (zero when it has none, e.g. a new package in the sample history). */
export const programFacts = (f: { program: Record<string, { bookings: number; guests: number; gross: number }> }, id: string) => f.program[id] ?? NONE;

/** The packages to show in analytics: every active one, plus inactive ones that still have guests in the period or last year. */
export function analyticsPackages(list: PackageDef[], ...facts: { program: Record<string, { guests: number }> }[]): PackageDef[] {
  return list.filter((p) => p.status === 'active' || facts.some((f) => (f.program[p.id]?.guests ?? 0) > 0));
}

/** The website's note on children's prices, true for every package on sale. */
export function childNote(list: PackageDef[]): string {
  const pcts = new Set(list.filter((p) => p.status === 'active').map((p) => p.childPct));
  return pcts.size === 1 ? `Children 3–11 years pay ${[...pcts][0]}%` : 'Children 3–11 years pay a reduced price';
}

/** Every add-on, re-rendering when the list changes. */
export function useAddOns(): AddOn[] {
  return useSyncExternalStore(subscribeAddOns, getAddOns, getAddOns);
}

/** The add-ons a package offers now (active ones), re-rendering when either list changes. */
export function useOfferedAddOns(programId: string): AddOn[] {
  const addOns = useAddOns();
  const pkg = usePackages().find((p) => p.id === programId);
  const offered = new Set(pkg?.addOns ?? []);
  return addOns.filter((a) => a.status === 'active' && offered.has(a.id));
}
