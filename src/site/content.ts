// Website copy and imagery. Copy and photos come from the Mahmya website designs
// in Figma; prices, packages and add-ons come from the shared catalog so the site
// always matches what the booking engine charges.

import { FREE_ACTIVITIES, OUTLETS, PAID_ACTIVITIES, PROGRAMS, type Outlet, type PaidActivity, type Program, type ProgramId } from '../data/catalog';
import type { AddOn } from '../../shared/addons.ts';

import imgMarinaGate from '../assets/site/island/marina-gate.jpg';
import imgCentral from '../assets/site/journey/central-image.jpg';
import imgSnorkel from '../assets/site/gallery/snorkel-day.jpg';
import imgGolden from '../assets/site/gallery/golden-hour.jpg';
import imgDiving from '../assets/site/gallery/diving-in.jpg';
import imgSunsetDrinks from '../assets/site/gallery/sunset-drinks.jpg';
import imgLunchSea from '../assets/site/gallery/lunch-by-the-sea.jpg';
import imgBoatRide from '../assets/site/gallery/boat-ride.jpg';
import imgBeachWalk from '../assets/site/gallery/beach-walk.jpg';
import imgCrystal from '../assets/site/gallery/crystal-waters.jpg';
import imgTourBeach from '../assets/site/tour/scrim.jpg';
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

export const LINKS = {
  maps: 'https://maps.app.goo.gl/2cRaFNJnidU22p2E6?g_st=ic',
  instagram: 'https://www.instagram.com/mahmya.island/?hl=en',
  facebook: 'https://www.facebook.com/Mahmya.Island/',
  tiktok: 'https://www.tiktok.com/discover/mahmya-island?is_from_webapp=1&sender_device=pc',
  tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g297549-d2331898-Reviews-Mahmya_Island-Hurghada_Red_Sea_and_Sinai.html',
  beach: 'https://mahmyabeach.com',
};

// ── Packages ─────────────────────────────────────────────────────────────────
// Packages are edited in the dashboard (shared/packages.ts); see src/lib/packages.ts.

// ── The island day (radial timeline on the homepage) ─────────────────────────

export const DAY_STEPS = [
  { time: '09:00 AM', title: 'Check-In & Departure', text: 'Includes round-trip boat transfer.' },
  { time: '09:45 AM', title: 'Arrive on the Island', text: 'Step onto Mahmya’s shore' },
  { time: '10:00 AM', title: 'Settle In', text: 'Beach access with a sunbed.' },
  { time: '10:30 AM', title: 'Beach Time', text: 'Sink into the sand, no rush' },
  { time: '11:30 AM', title: 'Snorkel the Reef', text: 'Snorkel crystal waters' },
  { time: '01:00 PM', title: 'Lunch by the Sea', text: 'Premium buffet lunch' },
  { time: '02:00 PM', title: 'Free Time, Your Way', text: 'Swim, nap, or just be still' },
  { time: '04:30 PM', title: 'Sunset Return', text: 'One last swim, then head back' },
];

/** Ten stops of the day (The Island page), each with its own photo. */
export const ISLAND_STOPS = [
  { label: 'Check-in', time: '9:00 AM', title: 'Check-in', text: 'Meet our team at Mahmya Beach Marina to confirm your reservation.', image: imgMarinaGate },
  { label: 'Departure', time: '9:30 AM', title: 'Departure', text: 'Board the boat for the short crossing to Big Giftun.', image: imgBoatRide },
  { label: 'Island Arrival', time: '9:45 AM', title: 'Island arrival', text: 'Step onto the white sand of a protected island.', image: imgCentral },
  { label: 'Aqua Center', time: '10:00 AM', title: 'Aqua Center', text: 'Floating water park, slide and trampoline — included in every visit.', image: imgCrystal },
  { label: 'Accommodation', time: '10:15 AM', title: 'Your spot on the beach', text: 'Shaded sunbeds under palm umbrellas, right by the water.', image: imgTourBeach },
  { label: 'Relax', time: '10:30 AM', title: 'Relax', text: 'Sink into the sand — no schedule, no rush.', image: imgGolden },
  { label: 'Snorkeling', time: '11:30 AM', title: 'Snorkeling', text: 'Clear, calm reefs a few steps from the beach. Equipment is included.', image: imgSnorkel },
  { label: 'Lunch', time: '1:00 PM', title: 'Lunch by the sea', text: 'Grilled seafood and island specialities at the open-air buffet.', image: imgLunchSea },
  { label: 'Relax Again', time: '2:00 PM', title: 'Relax again', text: 'Swim, nap, or try a water sport before the boats leave.', image: imgBeachWalk },
  { label: 'Return', time: '4:30 PM', title: 'Return', text: 'One last swim, then the boat takes you back to the marina.', image: imgSunsetDrinks },
];

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

export const GALLERY = [
  { image: imgSnorkel, title: 'Snorkel Day', caption: 'Mahmya Reef · 10:30 AM', chip: 'Snorkeling' },
  { image: imgGolden, title: 'Golden Hour', caption: 'Red Sea Coast · 6:15 PM', chip: 'Golden Hour' },
  { image: imgDiving, title: 'Diving In', caption: 'Mahmya Reef · 11:00 AM', chip: 'Diving' },
  { image: imgSunsetDrinks, title: 'Sunset Drinks', caption: 'Beach Bar · 5:45 PM', chip: 'Sunset Drinks' },
  { image: imgLunchSea, title: 'Lunch by the Sea', caption: 'Mahmya Beach · 1:00 PM', chip: 'Seaside Lunch' },
  { image: imgBoatRide, title: 'Boat Ride', caption: 'Marina · 9:00 AM', chip: 'Boat Ride' },
  { image: imgBeachWalk, title: 'Beach Walk', caption: 'North Shore · 3:00 PM', chip: 'Beach Walk' },
  { image: imgCrystal, title: 'Crystal Waters', caption: 'Snorkel Point · 2:00 PM', chip: 'Crystal Waters' },
];

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

// ── Dining ───────────────────────────────────────────────────────────────────

export const DINING_NOTE = 'All venues open daily. Hours may vary by season.';

/**
 * Fallback menus for the dining cards' "Download Menu" buttons. Staff upload the
 * real ones in the dashboard (Website → Dining menus), served by /api/public/menus;
 * an outlet with neither offers to send the menu on request.
 */
export type MenuFiles = Partial<Record<Outlet['id'], string>>;
export const MENU_FILES: MenuFiles = {};

// ── Guest information ────────────────────────────────────────────────────────

export const FAQS = [
  { q: 'How do I get to Mahmya Island?', a: 'Boats leave from Mahmya Beach Marina in Hurghada. You choose the Day or Sunset boat when you book and check in at the marina 30 minutes before it leaves; the crossing to Big Giftun takes about 45 minutes. The round-trip transfer is included in every package.' },
  { q: 'Do children pay?', a: 'Children aged 3–11 pay 50% of the adult package price. Children under 3 are free. Add-ons such as banana boat rides are priced per person or per hour as shown.' },
  { q: 'When do I pay?', a: 'Booking online reserves your places straight away. You pay at the marina when you check in, by card or in cash. If your hotel or tour operator booked for you, they settle with us directly.' },
  { q: 'What if the weather is bad?', a: 'The marina authority suspends sailings when the wind reaches 34 km/h. If that happens on your day, we cancel your booking free of charge or move it to another date — whichever you prefer.' },
  { q: 'Can I cancel or change my booking?', a: 'Yes. You can cancel online free of charge up to 24 hours before check-in using your booking code and email. For changes, or within 24 hours, contact us and we will do our best to help.' },
  { q: 'Can I book water sports on the day?', a: 'Yes, if there is space left — but popular activities such as the ringo ride and Sea-Spi sell out on busy days, so adding them to your booking is the best way to be sure.' },
  { q: 'What should I bring?', a: 'Swimwear, sun protection, a towel and your booking code. Snorkel equipment, sunbeds and umbrellas are provided on the island.' },
  { q: 'Is Mahmya suitable for large groups and events?', a: 'Yes — weddings, birthdays, corporate days and school trips are held on the island. Send an event enquiry and our events team will put together a plan and a quote.' },
];
