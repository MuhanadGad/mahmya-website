// Website copy and imagery that stays in code: the navigation, the activities and
// the reviews. Everything staff edit in the dashboard (Website › Content) is in
// site-content.ts; prices, packages and add-ons come from the shared catalog so the
// site always matches what the booking engine charges.

import { FREE_ACTIVITIES, OUTLETS, PAID_ACTIVITIES, PROGRAMS, type Outlet, type PaidActivity, type Program, type ProgramId } from '../data/catalog';
import type { AddOn } from '../../shared/addons.ts';

import imgReviewAvatar from '../assets/site/reviews/avatar-sarah-james.jpg';
import imgReview1 from '../assets/site/reviews/photo-1.jpg';
import imgReview3 from '../assets/site/reviews/photo-3.jpg';
import imgReview2 from '../assets/site/reviews/photo-2.jpg';

export { FREE_ACTIVITIES, OUTLETS, PAID_ACTIVITIES, PROGRAMS };
export type { Outlet, PaidActivity, Program, ProgramId };

// ── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LEFT = [
  { to: '/island', label: 'The Island' },
  { to: '/packages', label: 'Programs' },
  { to: '/events', label: 'Events' },
];
export const NAV_RIGHT = [
  { to: '/activities', label: 'Activities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

/** Main navigation of the current design (513:9285): Home first, then the pages. */
export const NAV_MAIN = [{ to: '/', label: 'Home' }, ...NAV_LEFT, ...NAV_RIGHT];


// ── Activities ───────────────────────────────────────────────────────────────

/** Paid add-ons as shown on the website, with the booking-engine options behind each card. */
export type AddOnCard = { activity: PaidActivity; options: AddOn[] };

/** The water sports' cards from the current add-ons (active ones; an activity with none on sale is left out). */
export function addOnCards(addOns: AddOn[]): AddOnCard[] {
  return (['banana', 'ringo', 'sea-spi', 'kayak', 'sup'] as const)
    .map((id) => ({ activity: PAID_ACTIVITIES.find((a) => a.id === id)!, options: addOns.filter((o) => o.activityId === id && o.status === 'active') }))
    .filter((c) => c.options.length > 0);
}

/** Short labels for the option toggle (Sea-Spi 15/30 min, Kayak single/double). */
export const OPTION_LABEL: Record<string, string> = { 'seaspi-15': '15 min', 'seaspi-30': '30 min', 'kayak-single': 'Single', 'kayak-double': 'Double' };

// ── Gallery ──────────────────────────────────────────────────────────────────


/** Polaroid tilt per slot, from the design. */
export const POLAROID_TILT = [3, -2, 1.5, -3, 2, 3, -2, 1.5];

// ── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  name: string;
  initials: string;
  when: string;
  text: string;
  rating: number;
  source: 'google' | 'tripadvisor';
  avatar?: string;
  tint: 'teal' | 'blue';
  photos: string[];
}

export const REVIEWS: Review[] = [
  {
    name: 'Agnieszka W.',
    initials: 'AW',
    when: '8 months ago',
    text: 'We brought our children for the first time and they haven’t stopped talking about it. The water is so clear and calm — perfect for families. We enjoyed relaxing by the beach and exploring nearby trails.',
    rating: 5,
    source: 'tripadvisor',
    tint: 'teal',
    photos: [imgReview1, imgReview3, imgReview2],
  },
  {
    name: 'Rafael C.',
    initials: 'RC',
    when: '3 months ago',
    text: 'Breathtaking scenery and crystal clear water made our stay unforgettable. The staff were incredibly welcoming, always ready to help with a smile, and the food was absolutely delicious, offering a great variety of local and international dishes.',
    rating: 5,
    source: 'tripadvisor',
    tint: 'blue',
    photos: [imgReview2, imgReview1],
  },
  {
    name: 'Sarah & James T.',
    initials: 'SJ',
    when: '1 year ago',
    text: 'Mahmya is unlike anything else in Hurghada. The island, the reef, the lunch — everything came together perfectly. We came back the very next year.',
    rating: 5,
    source: 'tripadvisor',
    avatar: imgReviewAvatar,
    tint: 'teal',
    photos: [imgReview1, imgReview3, imgReview2],
  },
  {
    name: 'Lena K.',
    initials: 'LK',
    when: '2 years ago',
    text: 'The island exceeded every expectation. Pristine waters, friendly staff, and memories that will last a lifetime. Absolutely magical. From the morning boat to sunset on the beach, every moment was unforgettable.',
    rating: 4,
    source: 'google',
    tint: 'teal',
    photos: [imgReview3, imgReview1, imgReview2],
  },
];

