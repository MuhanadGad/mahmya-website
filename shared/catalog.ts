// Product catalog and reference data shared by the server and the client.
// Packages, prices (EUR; the EGP figures are the sample history's resident prices), activities, dining
// outlets and testimonials come straight from the Mahmya website designs in Figma.
// Mix and share figures only drive the sample history. Images are attached client-side.

/** The original five packages (the sample history's). */
export type BaseProgramId = 'day-use' | 'beach-lunch' | 'full' | 'private-boat' | 'groups';
/** A package id: one of the originals or one added in the dashboard (see shared/packages.ts). */
export type ProgramId = string;
export type ChannelId = 'tour-operators' | 'hotel-desks' | 'ota' | 'direct' | 'local';
export type MarketId = 'de' | 'uk' | 'pl' | 'ru' | 'it' | 'cz' | 'eg' | 'benelux' | 'nordics' | 'ua' | 'other';
export type ActivityId = 'kayak' | 'sup' | 'sea-spi' | 'banana' | 'ringo';
export type FreeActivityId = 'volleyball' | 'football' | 'water-slide' | 'trampoline';
export type OutletId = 'buffet' | 'a-la-carte' | 'beach-bar' | 'smoothie';
/** Years covered by the model: index 0 = 2024, 1 = 2025, 2 = 2026. */
export const YEARS = [2024, 2025, 2026] as const;

export interface Program {
  id: BaseProgramId;
  name: string;
  tagline: string;
  /** Adult list price in EUR per model year. Child (3–11) pays 50%, under-3 free. */
  adult: [number, number, number];
  /** Resident price in EGP per model year (only for core programs). */
  egp: [number, number, number] | null;
  mix: [number, number, number];
  popular?: boolean;
  /** True when the name/price is taken verbatim from the website design. */
  fromDesign: boolean;
}

export const PROGRAMS: Program[] = [
  {
    id: 'day-use',
    name: 'Day Use Program',
    tagline: 'Beach day with leisure & round-trip transfer',
    adult: [34, 36, 38],
    egp: [1500, 2000, 2300],
    mix: [0.31, 0.3, 0.285],
    fromDesign: true,
  },
  {
    id: 'beach-lunch',
    name: 'Beach Day + Lunch',
    tagline: 'Our classic day program with open buffet seafood & grill',
    adult: [54, 57, 60],
    egp: [2300, 3100, 3600],
    mix: [0.42, 0.425, 0.43],
    popular: true,
    fromDesign: true,
  },
  {
    id: 'full',
    name: 'Full Program',
    tagline: 'Ultimate complete luxury island experience',
    adult: [76, 80, 85],
    egp: [3300, 4500, 5200],
    mix: [0.15, 0.16, 0.17],
    fromDesign: true,
  },
  {
    id: 'private-boat',
    name: 'Private Boat Trips',
    tagline: 'Private charter with skipper and snorkel stops',
    adult: [98, 105, 112],
    egp: null,
    mix: [0.04, 0.042, 0.045],
    fromDesign: false,
  },
  {
    id: 'groups',
    name: 'Events & Groups',
    tagline: 'Weddings, corporate days and celebrations',
    adult: [70, 74, 78],
    egp: null,
    mix: [0.08, 0.073, 0.07],
    fromDesign: false,
  },
];

export interface Channel {
  id: ChannelId;
  name: string;
  share: [number, number, number];
  /** Typical days until an agent invoice is settled (0 = paid at booking or on arrival). Sample history only. */
  terms: number;
}

export const CHANNELS: Channel[] = [
  { id: 'tour-operators', name: 'Tour operators', share: [0.46, 0.44, 0.42], terms: 60 },
  { id: 'hotel-desks', name: 'Hotel desks & reps', share: [0.26, 0.255, 0.25], terms: 30 },
  { id: 'ota', name: 'Online travel agencies', share: [0.12, 0.125, 0.13], terms: 30 },
  { id: 'direct', name: 'Direct web & app', share: [0.09, 0.105, 0.12], terms: 0 },
  { id: 'local', name: 'Residents & walk-in (EGP)', share: [0.07, 0.075, 0.08], terms: 0 },
];

/** Where a booking came from — company groups, guests online, or staff in the dashboard. */
export type BookingSource = 'company' | 'website' | 'staff';

export const BOOKING_SOURCES: { id: BookingSource; name: string; note: string }[] = [
  { id: 'company', name: 'Companies', note: 'Tour company groups, from the cloud sheet or booked by staff for a company' },
  { id: 'website', name: 'Website & individuals', note: 'Guests booking themselves, on Mahmya’s website or through the cloud system' },
  { id: 'staff', name: 'Booked by staff', note: 'Bookings staff make in the dashboard for a guest' },
];

/** The sample history has no booking source, so it's estimated from the channel. */
export const SOURCE_OF_CHANNEL: Record<ChannelId, BookingSource> = { 'tour-operators': 'company', 'hotel-desks': 'staff', ota: 'website', direct: 'website', local: 'staff' };

export interface Market {
  id: MarketId;
  name: string;
  flag: string;
  share: [number, number, number];
  spendIndex: number;
}

export const MARKETS: Market[] = [
  { id: 'de', name: 'Germany', flag: '🇩🇪', share: [0.24, 0.235, 0.225], spendIndex: 1.04 },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', share: [0.09, 0.1, 0.108], spendIndex: 1.1 },
  { id: 'pl', name: 'Poland', flag: '🇵🇱', share: [0.1, 0.104, 0.106], spendIndex: 0.94 },
  { id: 'ru', name: 'Russia', flag: '🇷🇺', share: [0.11, 0.098, 0.092], spendIndex: 1.02 },
  { id: 'it', name: 'Italy', flag: '🇮🇹', share: [0.08, 0.079, 0.074], spendIndex: 1.0 },
  { id: 'cz', name: 'Czechia', flag: '🇨🇿', share: [0.06, 0.062, 0.061], spendIndex: 0.93 },
  { id: 'eg', name: 'Egypt (residents)', flag: '🇪🇬', share: [0.07, 0.07, 0.07], spendIndex: 0.82 },
  { id: 'benelux', name: 'Benelux', flag: '🇳🇱', share: [0.05, 0.053, 0.057], spendIndex: 1.06 },
  { id: 'nordics', name: 'Nordics', flag: '🇸🇪', share: [0.04, 0.043, 0.042], spendIndex: 1.12 },
  { id: 'ua', name: 'Ukraine', flag: '🇺🇦', share: [0.05, 0.043, 0.04], spendIndex: 0.9 },
  { id: 'other', name: 'Rest of world', flag: '🌍', share: [0.11, 0.113, 0.118], spendIndex: 1.0 },
];

export interface PaidActivity {
  id: ActivityId;
  name: string;
  priceLines: string[];
  attach: number;
  avgPrice: number;
  motorized: boolean;
}

// Prices are the current (2026) prices shown on the website.
export const PAID_ACTIVITIES: PaidActivity[] = [
  { id: 'kayak', name: 'Single or Double Kayak', priceLines: ['Single Kayak (1 hour) - EUR 5.00', 'Double Kayak (1 hour) - EUR 8.00'], attach: 0.075, avgPrice: 6.3, motorized: false },
  { id: 'sup', name: 'Stand-Up Paddle', priceLines: ['SUP (1 hour) - EUR 8.00'], attach: 0.042, avgPrice: 8, motorized: false },
  { id: 'sea-spi', name: 'Sea-Spi Double', priceLines: ['30 minutes - EUR 15.00', '15 minutes - EUR 10.00'], attach: 0.035, avgPrice: 12.5, motorized: true },
  { id: 'banana', name: 'Banana Boat', priceLines: ['Per person (10 min) - EUR 10.00'], attach: 0.105, avgPrice: 10, motorized: true },
  { id: 'ringo', name: 'Ringo Ride', priceLines: ['Per person (10 min) - EUR 18.00'], attach: 0.046, avgPrice: 18, motorized: true },
];

export interface FreeActivity {
  id: FreeActivityId;
  name: string;
  participation: number;
}

export const FREE_ACTIVITIES: FreeActivity[] = [
  { id: 'volleyball', name: 'Beach Volleyball', participation: 0.12 },
  { id: 'football', name: 'Football', participation: 0.09 },
  { id: 'water-slide', name: 'Water Slide', participation: 0.28 },
  { id: 'trampoline', name: 'Trampoline', participation: 0.17 },
];

export interface Outlet {
  id: OutletId;
  name: string;
  description: string;
  hours: string;
}

export const OUTLETS: Outlet[] = [
  {
    id: 'buffet',
    name: 'Island Buffet',
    description: 'Grilled seafood, handpicked salads, and local island specialties served all-you-can-eat style with open-air Red Sea views.',
    hours: '12:30 PM - 3:00 PM Daily',
  },
  {
    id: 'a-la-carte',
    name: 'À La Carte',
    description: 'Fresh Mediterranean and Egyptian dishes made to order, including seafood, handmade pasta, and regional favorites.',
    hours: '11:00 AM - 3:00 PM Daily',
  },
  {
    id: 'beach-bar',
    name: 'Beach Bar',
    description: "Relax with refreshing drinks while enjoying Mahmya's stunning sea views.",
    hours: '10:30 AM - 5:30 PM Daily',
  },
  {
    id: 'smoothie',
    name: 'Smoothie bar',
    description: 'Fresh, healthy, and refreshing flavors made for your perfect beach day.',
    hours: '10:00 AM - 5:00 PM Daily',
  },
];

export interface Testimonial {
  name: string;
  initials: string;
  when: string;
  text: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Lena K.',
    initials: 'LK',
    when: '2 years ago',
    text: 'The island exceeded every expectation. Pristine waters, friendly staff, and memories that will last a lifetime. Absolutely magical.',
  },
  {
    name: 'Sarah & James T.',
    initials: 'SJ',
    when: '1 year ago',
    text: 'Mahmya is unlike anything else in Hurghada. The island, the reef, the lunch - everything came together perfectly. We came back the very next year.',
  },
  {
    name: 'Agnieszka W.',
    initials: 'AW',
    when: '8 months ago',
    text: "We brought our children for the first time and they haven't stopped talking about it. The water is so clear and calm - perfect for families.",
  },
  {
    name: 'Rafael C.',
    initials: 'RC',
    when: '3 months ago',
    text: 'Breathtaking scenery and crystal clear water made our stay unforgettable. The staff were incredibly welcoming, and the food was absolutely delicious.',
  },
];

export const REVIEW_THEMES: { theme: string; positive: number; negative: number; mentions: number }[] = [
  { theme: 'Water & snorkeling', positive: 0.94, negative: 0.03, mentions: 0.61 },
  { theme: 'Staff & hospitality', positive: 0.91, negative: 0.04, mentions: 0.48 },
  { theme: 'Beach & sunbeds', positive: 0.86, negative: 0.07, mentions: 0.39 },
  { theme: 'Boat transfer', positive: 0.78, negative: 0.12, mentions: 0.27 },
  { theme: 'Lunch buffet', positive: 0.8, negative: 0.11, mentions: 0.33 },
  { theme: 'Value for money', positive: 0.71, negative: 0.17, mentions: 0.22 },
  { theme: 'Crowding at peak', positive: 0.42, negative: 0.46, mentions: 0.14 },
];

/** The original five by id (the sample history's); current names and prices come from shared/packages.ts. */
export const programById = Object.fromEntries(PROGRAMS.map((p) => [p.id, p])) as Record<BaseProgramId, Program>;
export const channelById = Object.fromEntries(CHANNELS.map((c) => [c.id, c])) as Record<ChannelId, Channel>;
