// The website content staff edit in the dashboard (Website › Content): one entry per
// section, loaded from mahmya-back (GET /api/public/content). DEFAULT_CONTENT is what
// the site shows until it has loaded, or if the API can't be reached. It mirrors the
// defaults in mahmya-back's src/modules/website/content.spec.ts; keep the two in step.
//
// Photos are an uploaded file's URL or one of the site's own photos in public/content.
// Titles and longer texts use *word* to highlight, new lines, and [label](/path) links
// (see components/Rich.tsx).

import { useEffect, useState } from 'react';
import { siteFetch } from './api';

type Heading = { eyebrow: string; title: string };
export type IslandStop = { label: string; time: string; title: string; text: string; image: string };
export type DayStep = { time: string; title: string; text: string };
export type Venue = { id: string; active: boolean; name: string; description: string; hours: string; image: string; menu: string | null };
export type GalleryPhoto = { image: string; title: string; caption: string; chip: string };
export type OccasionIcon = 'heart' | 'briefcase' | 'cake' | 'school' | 'users' | 'sparkles' | 'music' | 'camera';

export interface SiteContent {
  links: { maps: string; instagram: string; facebook: string; tiktok: string; tripadvisor: string; beachSite: string };
  location: { marinaName: string; address: string; airportName: string; airportDistance: string; townName: string; townDistance: string };
  footer: {
    eventsTitle: string; tagline: string; about: string; newsletterTitle: string; newsletterText: string;
    beachLabel: string; beachTitle: string; beachText: string; beachImage: string; beachImageAlt: string; beachButton: string;
  };
  'home.hero': { tag: string; title: string };
  'home.intro': Heading & { body: string; button: string; backImage: string; backImageAlt: string; frontImage: string; frontImageAlt: string };
  'home.packages': Heading & { button: string; lead: string };
  'home.route': Heading;
  'home.facts': { title: string; facts: { text: string }[] };
  'home.dining': Heading & { lead: string; button: string };
  'home.tour': Heading & { plateTitle: string; plateText: string };
  'home.events': Heading & { body: string; button: string; image: string };
  islandStops: { stops: IslandStop[] };
  daySteps: Heading & { steps: DayStep[] };
  dining: { note: string; venues: Venue[] };
  'island.page': Heading & { subtitle: string; dayEyebrow: string; dayTitle: string; dayText: string };
  'events.page': Heading & { subtitle: string; occasions: { icon: OccasionIcon; title: string; text: string }[]; formTitle: string; formNote: string };
  gallery: Heading & { subtitle: string; photos: GalleryPhoto[] };
  'contact.page': Heading & { subtitle: string; formTitle: string };
  faqs: Heading & { items: { question: string; answer: string }[] };
  terms: Heading & { items: { heading: string; text: string }[] };
  cancellation: Heading & { items: { title: string; text: string }[] };
}

export const DEFAULT_CONTENT: SiteContent = {
  "links": {
    "maps": "https://maps.app.goo.gl/2cRaFNJnidU22p2E6?g_st=ic",
    "instagram": "https://www.instagram.com/mahmya.island/?hl=en",
    "facebook": "https://www.facebook.com/Mahmya.Island/",
    "tiktok": "https://www.tiktok.com/discover/mahmya-island?is_from_webapp=1&sender_device=pc",
    "tripadvisor": "https://www.tripadvisor.com/Attraction_Review-g297549-d2331898-Reviews-Mahmya_Island-Hurghada_Red_Sea_and_Sinai.html",
    "beachSite": "https://mahmyabeach.com"
  },
  "location": {
    "marinaName": "Mahmya Beach Marina",
    "address": "Sheraton Road, Hurghada — 4.2 km from the Mamsha, 18 km from Hurghada Airport.",
    "airportName": "Hurghada Airport",
    "airportDistance": "18 km · about 25 min drive",
    "townName": "Hurghada Mamsha",
    "townDistance": "4.2 km · about 10 min drive"
  },
  "footer": {
    "eventsTitle": "Celebrate Moments That Matter",
    "tagline": "The Soul Of The Red Sea.",
    "about": "A premium island experience in Hurghada combining nature, adventure, relaxation, and authentic Egyptian hospitality.",
    "newsletterTitle": "Keep Updated on Mahmya Island",
    "newsletterText": "Add your email to receive the latest Mahmya Island news.",
    "beachLabel": "Mahmya Beach",
    "beachTitle": "Welcome to Mahmya Beach",
    "beachText": "A beautiful red sea escape where crystal clear waters, soft sandy beaches, and unforgettable experiences come together.",
    "beachImage": "/content/photos/beach-tile.jpg",
    "beachImageAlt": "Guests relaxing on the Mahmya Beach jetty",
    "beachButton": "Visit mahmyabeach.com"
  },
  "home.hero": {
    "tag": "Mahmya · Giftun Island",
    "title": "Your Mahmya\nIsland Escape *Starts Here.*"
  },
  "home.intro": {
    "eyebrow": "Discover Mahmya",
    "title": "The Red Sea Experience\nYou’ll Remember",
    "body": "A complete Red Sea experience on Big Giftun Island.\nSet sail from Hurghada and discover a peaceful island escape with turquoise waters, beautiful beaches, unforgettable snorkeling, and authentic Egyptian hospitality.",
    "button": "Discover Mahmya Island",
    "backImage": "/content/photos/intro-speedboat.jpg",
    "backImageAlt": "A speedboat skimming across the turquoise water off Big Giftun",
    "frontImage": "/content/photos/intro-yacht.jpg",
    "frontImageAlt": "A Mahmya boat anchored in the clear shallows by the island"
  },
  "home.packages": {
    "eyebrow": "Experiences",
    "title": "Choose Your Mahmya Experience",
    "button": "Show all Programs",
    "lead": "Discover Mahmya Island designed for every traveler, from relaxing beach escapes to complete Red Sea adventures."
  },
  "home.route": {
    "eyebrow": "The Island Experience",
    "title": "Mahmya Island Experiences"
  },
  "home.facts": {
    "title": "Did You Know?",
    "facts": [
      {
        "text": "The Red Sea is famous for its vibrant marine life, hosting over 1,200 fish species, from colorful clownfish to majestic lionfish. It also boasts around 200 coral species, enriching the underwater ecosystem. With warm waters and diverse habitats, the Red Sea is a paradise for divers and marine lovers."
      },
      {
        "text": "More than one in ten of the Red Sea’s fish species live nowhere else on Earth — so some of the fish you meet on the reef at Mahmya can only be seen here."
      },
      {
        "text": "Big Giftun is part of the Giftun Islands protected area off Hurghada. Boats moor at fixed points and visitors keep to marked areas, so the reefs and beaches stay as they are."
      },
      {
        "text": "The Red Sea is one of the saltiest seas in the world. The extra salt makes the water more buoyant — floating and snorkelling feel easier than in most seas."
      }
    ]
  },
  "home.dining": {
    "eyebrow": "Island Dining",
    "title": "A Taste of Mahmya",
    "lead": "Complete your island experience with fresh flavors, refreshing drinks, and beautiful Red Sea views.",
    "button": "Explore Dining"
  },
  "home.tour": {
    "eyebrow": "Virtual Tour",
    "title": "Explore Mahmya Island Before You Arrive",
    "plateTitle": "The Main Beach",
    "plateText": "Take a virtual journey around Mahmya Island before your visit and discover the beaches, activities, dining areas, and unforgettable views waiting for you."
  },
  "home.events": {
    "eyebrow": "Events at Mahmya",
    "title": "Celebrate Moments That Matter",
    "body": "Create unforgettable memories surrounded by the beauty of Mahmya Island.\nFrom birthdays and anniversaries to private celebrations, the Red Sea creates the perfect backdrop for your special moments.",
    "button": "Plan Your Event",
    "image": "/content/photos/events.jpg"
  },
  "islandStops": {
    "stops": [
      {
        "label": "Check-in",
        "time": "9:00 AM",
        "title": "Check-in",
        "text": "Meet our team at Mahmya Beach Marina to confirm your reservation.",
        "image": "/content/photos/marina-gate.jpg"
      },
      {
        "label": "Departure",
        "time": "9:30 AM",
        "title": "Departure",
        "text": "Board the boat for the short crossing to Big Giftun.",
        "image": "/content/photos/boat-ride.jpg"
      },
      {
        "label": "Island Arrival",
        "time": "9:45 AM",
        "title": "Island arrival",
        "text": "Step onto the white sand of a protected island.",
        "image": "/content/photos/central-image.jpg"
      },
      {
        "label": "Aqua Center",
        "time": "10:00 AM",
        "title": "Aqua Center",
        "text": "Floating water park, slide and trampoline — included in every visit.",
        "image": "/content/photos/crystal-waters.jpg"
      },
      {
        "label": "Accommodation",
        "time": "10:15 AM",
        "title": "Your spot on the beach",
        "text": "Shaded sunbeds under palm umbrellas, right by the water.",
        "image": "/content/photos/tour-beach.jpg"
      },
      {
        "label": "Relax",
        "time": "10:30 AM",
        "title": "Relax",
        "text": "Sink into the sand — no schedule, no rush.",
        "image": "/content/photos/golden-hour.jpg"
      },
      {
        "label": "Snorkeling",
        "time": "11:30 AM",
        "title": "Snorkeling",
        "text": "Clear, calm reefs a few steps from the beach. Equipment is included.",
        "image": "/content/photos/snorkel-day.jpg"
      },
      {
        "label": "Lunch",
        "time": "1:00 PM",
        "title": "Lunch by the sea",
        "text": "Grilled seafood and island specialities at the open-air buffet.",
        "image": "/content/photos/lunch-by-the-sea.jpg"
      },
      {
        "label": "Relax Again",
        "time": "2:00 PM",
        "title": "Relax again",
        "text": "Swim, nap, or try a water sport before the boats leave.",
        "image": "/content/photos/beach-walk.jpg"
      },
      {
        "label": "Return",
        "time": "4:30 PM",
        "title": "Return",
        "text": "One last swim, then the boat takes you back to the marina.",
        "image": "/content/photos/sunset-drinks.jpg"
      }
    ]
  },
  "daySteps": {
    "eyebrow": "The island journey",
    "title": "One Day, Beautifully Unfolded",
    "steps": [
      {
        "time": "09:00 AM",
        "title": "Check-In & Departure",
        "text": "Includes round-trip boat transfer."
      },
      {
        "time": "09:45 AM",
        "title": "Arrive on the Island",
        "text": "Step onto Mahmya’s shore"
      },
      {
        "time": "10:00 AM",
        "title": "Settle In",
        "text": "Beach access with a sunbed."
      },
      {
        "time": "10:30 AM",
        "title": "Beach Time",
        "text": "Sink into the sand, no rush"
      },
      {
        "time": "11:30 AM",
        "title": "Snorkel the Reef",
        "text": "Snorkel crystal waters"
      },
      {
        "time": "01:00 PM",
        "title": "Lunch by the Sea",
        "text": "Premium buffet lunch"
      },
      {
        "time": "02:00 PM",
        "title": "Free Time, Your Way",
        "text": "Swim, nap, or just be still"
      },
      {
        "time": "04:30 PM",
        "title": "Sunset Return",
        "text": "One last swim, then head back"
      }
    ]
  },
  "dining": {
    "note": "All venues open daily. Hours may vary by season.",
    "venues": [
      {
        "id": "buffet",
        "active": true,
        "name": "Island Buffet",
        "description": "Grilled seafood, handpicked salads, and local island specialties served all-you-can-eat style with open-air Red Sea views.",
        "hours": "12:30 PM - 3:00 PM Daily",
        "image": "/content/photos/dine-buffet.jpg",
        "menu": null
      },
      {
        "id": "a-la-carte",
        "active": true,
        "name": "À La Carte",
        "description": "Fresh Mediterranean and Egyptian dishes made to order, including seafood, handmade pasta, and regional favorites.",
        "hours": "11:00 AM - 3:00 PM Daily",
        "image": "/content/photos/dine-alacarte.jpg",
        "menu": null
      },
      {
        "id": "beach-bar",
        "active": true,
        "name": "Beach Bar",
        "description": "Relax with refreshing drinks while enjoying Mahmya's stunning sea views.",
        "hours": "10:30 AM - 5:30 PM Daily",
        "image": "/content/photos/dine-bar.jpg",
        "menu": null
      },
      {
        "id": "smoothie",
        "active": true,
        "name": "Smoothie bar",
        "description": "Fresh, healthy, and refreshing flavors made for your perfect beach day.",
        "hours": "10:00 AM - 5:00 PM Daily",
        "image": "/content/photos/dine-smoothie.jpg",
        "menu": null
      }
    ]
  },
  "island.page": {
    "eyebrow": "The island",
    "title": "Big Giftun, *protected* and close to Hurghada.",
    "subtitle": "A short boat ride from Mahmya Beach Marina takes you to white sand, calm reefs and an island day planned around you.",
    "dayEyebrow": "The island journey",
    "dayTitle": "One day, beautifully unfolded.",
    "dayText": "From the marina to the last swim of the day — ten moments, one current. Follow the route below to see how a Mahmya day actually moves."
  },
  "events.page": {
    "eyebrow": "Celebrate the moments",
    "title": "Unforgettable *events* on Mahmya Island.",
    "subtitle": "Tell us about your occasion and our events team will plan the day with you — from the boat to the last dance.",
    "occasions": [
      {
        "icon": "heart",
        "title": "Weddings & engagements",
        "text": "Barefoot ceremonies on the sand with the Red Sea behind you."
      },
      {
        "icon": "briefcase",
        "title": "Corporate days",
        "text": "Team days, incentives and launches with a private area and catering."
      },
      {
        "icon": "cake",
        "title": "Birthdays & celebrations",
        "text": "Décor, music and a cake moment — we take care of the details."
      },
      {
        "icon": "school",
        "title": "Schools & clubs",
        "text": "Supervised beach days with lunch and included activities."
      }
    ],
    "formTitle": "Plan your event",
    "formNote": "Groups of 10–30 can also book the Events & Groups package online."
  },
  "gallery": {
    "eyebrow": "Mahmya gallery",
    "title": "Moments you will *never forget*.",
    "subtitle": "Reefs, beach days, boat rides and long lunches — a look at a day on Mahmya.",
    "photos": [
      {
        "image": "/content/photos/snorkel-day.jpg",
        "title": "Snorkel Day",
        "caption": "Mahmya Reef · 10:30 AM",
        "chip": "Snorkeling"
      },
      {
        "image": "/content/photos/golden-hour.jpg",
        "title": "Golden Hour",
        "caption": "Red Sea Coast · 6:15 PM",
        "chip": "Golden Hour"
      },
      {
        "image": "/content/photos/diving-in.jpg",
        "title": "Diving In",
        "caption": "Mahmya Reef · 11:00 AM",
        "chip": "Diving"
      },
      {
        "image": "/content/photos/sunset-drinks.jpg",
        "title": "Sunset Drinks",
        "caption": "Beach Bar · 5:45 PM",
        "chip": "Sunset Drinks"
      },
      {
        "image": "/content/photos/lunch-by-the-sea.jpg",
        "title": "Lunch by the Sea",
        "caption": "Mahmya Beach · 1:00 PM",
        "chip": "Seaside Lunch"
      },
      {
        "image": "/content/photos/boat-ride.jpg",
        "title": "Boat Ride",
        "caption": "Marina · 9:00 AM",
        "chip": "Boat Ride"
      },
      {
        "image": "/content/photos/beach-walk.jpg",
        "title": "Beach Walk",
        "caption": "North Shore · 3:00 PM",
        "chip": "Beach Walk"
      },
      {
        "image": "/content/photos/crystal-waters.jpg",
        "title": "Crystal Waters",
        "caption": "Snorkel Point · 2:00 PM",
        "chip": "Crystal Waters"
      }
    ]
  },
  "contact.page": {
    "eyebrow": "Contact",
    "title": "We’re here to *help*.",
    "subtitle": "Questions about your visit, a booking or a special request? Send us a message and the team will reply by email.",
    "formTitle": "Send us a message"
  },
  "faqs": {
    "eyebrow": "Guest support",
    "title": "Frequently asked *questions*.",
    "items": [
      {
        "question": "How do I get to Mahmya Island?",
        "answer": "Boats leave from Mahmya Beach Marina in Hurghada. You choose the Day or Sunset boat when you book and check in at the marina 30 minutes before it leaves; the crossing to Big Giftun takes about 45 minutes. The round-trip transfer is included in every package."
      },
      {
        "question": "Do children pay?",
        "answer": "Children aged 3–11 pay 50% of the adult package price. Children under 3 are free. Add-ons such as banana boat rides are priced per person or per hour as shown."
      },
      {
        "question": "When do I pay?",
        "answer": "Booking online reserves your places straight away. You pay at the marina when you check in, by card or in cash. If your hotel or tour operator booked for you, they settle with us directly."
      },
      {
        "question": "What if the weather is bad?",
        "answer": "The marina authority suspends sailings when the wind reaches 34 km/h. If that happens on your day, we cancel your booking free of charge or move it to another date — whichever you prefer."
      },
      {
        "question": "Can I cancel or change my booking?",
        "answer": "Yes. You can cancel online free of charge up to 24 hours before check-in using your booking code and email. For changes, or within 24 hours, contact us and we will do our best to help."
      },
      {
        "question": "Can I book water sports on the day?",
        "answer": "Yes, if there is space left — but popular activities such as the ringo ride and Sea-Spi sell out on busy days, so adding them to your booking is the best way to be sure."
      },
      {
        "question": "What should I bring?",
        "answer": "Swimwear, sun protection, a towel and your booking code. Snorkel equipment, sunbeds and umbrellas are provided on the island."
      },
      {
        "question": "Is Mahmya suitable for large groups and events?",
        "answer": "Yes — weddings, birthdays, corporate days and school trips are held on the island. Send an event enquiry and our events team will put together a plan and a quote."
      }
    ]
  },
  "terms": {
    "eyebrow": "Guest support",
    "title": "Booking *terms*.",
    "items": [
      {
        "heading": "Your booking",
        "text": "A booking reserves places on the island and on our boats for the date, boat and package you choose. The lead guest books for the whole party. Bring your booking code to the marina."
      },
      {
        "heading": "Prices and payment",
        "text": "Prices are per person in euros and include the round-trip boat transfer. Children aged 3–11 pay 50% of the adult price; children under 3 are free. You pay at check-in by card or in cash. Prices are the same for every guest."
      },
      {
        "heading": "Online bookings",
        "text": "Online bookings open up to a year ahead. Same-day bookings close 90 minutes before check-in for your boat (Hurghada time). Parties of more than 30, and events, are arranged by our events team."
      },
      {
        "heading": "On the island",
        "text": "Please follow the instructions of the crew and lifeguards. Water sports run subject to safety checks and the weather on the day."
      },
      {
        "heading": "Weather",
        "text": "The marina authority suspends sailings when wind speeds reach 34 km/h. If sailings are suspended on your day, we cancel your booking free of charge or move it to another date."
      },
      {
        "heading": "",
        "text": "See also the [cancellation policy](/cancellation-policy)."
      }
    ]
  },
  "cancellation": {
    "eyebrow": "Guest support",
    "title": "Cancellation *policy*.",
    "items": [
      {
        "title": "Free cancellation",
        "text": "until 24 hours before check-in for your boat. Cancel online on the [Manage booking](/booking) page with your code and email."
      },
      {
        "title": "Within 24 hours",
        "text": "of check-in, please [contact us](/contact) — we will do our best to move your booking to another date."
      },
      {
        "title": "Weather:",
        "text": "if the marina suspends sailings, your booking is cancelled free of charge or moved, as you prefer."
      },
      {
        "title": "Bookings through hotels or tour operators",
        "text": "follow the terms of the company you booked with."
      }
    ]
  }
};

let loaded: SiteContent | null = null;
let request: Promise<SiteContent> | null = null;

/** The API's sections over the defaults, section by section (a section the API doesn't know keeps its default). */
function merge(api: Partial<Record<keyof SiteContent, object>>): SiteContent {
  const out = { ...DEFAULT_CONTENT } as Record<string, object>;
  for (const key of Object.keys(DEFAULT_CONTENT)) {
    const section = api[key as keyof SiteContent];
    if (section && typeof section === 'object') out[key] = { ...out[key], ...section };
  }
  return out as unknown as SiteContent;
}

/** The website content: the defaults at first, then what staff saved (loaded once per page load). */
export function useContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(loaded ?? DEFAULT_CONTENT);
  useEffect(() => {
    let alive = true;
    request ??= siteFetch<Partial<Record<keyof SiteContent, object>>>('/public/content').then(
      (api) => (loaded = merge(api)),
      (err) => {
        request = null;
        throw err;
      },
    );
    request.then(
      (c) => alive && setContent(c),
      () => undefined,
    );
    return () => {
      alive = false;
    };
  }, []);
  return content;
}
