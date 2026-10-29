// Client view of the catalog: the shared reference data plus the Figma imagery.

import {
  FREE_ACTIVITIES as FREE_BASE,
  OUTLETS as OUTLETS_BASE,
  PAID_ACTIVITIES as PAID_BASE,
  PROGRAMS as PROGRAMS_BASE,
  type ActivityId,
  type FreeActivity as FreeActivityBase,
  type FreeActivityId,
  type Outlet as OutletBase,
  type OutletId,
  type PaidActivity as PaidActivityBase,
  type Program as ProgramBase,
  type ProgramId,
} from '../../shared/catalog.ts';

import imgDayUse from '../assets/figma/programs/day-use.jpg';
import imgBeachLunch from '../assets/figma/programs/beach-day-lunch.jpg';
import imgFull from '../assets/figma/programs/full-program.jpg';
import imgPrivateBoat from '../assets/figma/programs/private-boat.jpg';
import imgGroups from '../assets/figma/programs/groups-events.jpg';

import imgVolleyball from '../assets/figma/activities/beach-volleyball.jpg';
import imgFootball from '../assets/figma/activities/football.jpg';
import imgWaterSlide from '../assets/figma/activities/water-slide.jpg';
import imgTrampoline from '../assets/figma/activities/trampoline.jpg';
import imgKayak from '../assets/figma/activities/kayak.jpg';
import imgSup from '../assets/figma/activities/sup.jpg';
import imgSeaSpi from '../assets/figma/activities/sea-spi.jpg';
import imgBanana from '../assets/figma/activities/banana-boat.jpg';
import imgRingo from '../assets/figma/activities/ringo.jpg';

import icoKayak from '../assets/figma/icons/kayak.svg';
import icoWaves from '../assets/figma/icons/waves.svg';
import icoNavigation from '../assets/figma/icons/navigation.svg';
import icoAnchor from '../assets/figma/icons/anchor.svg';
import icoWind from '../assets/figma/icons/wind.svg';

import imgBuffet from '../assets/figma/dining/island-buffet.jpg';
import imgALaCarte from '../assets/figma/dining/a-la-carte.jpg';
import imgBeachBar from '../assets/figma/dining/beach-bar.jpg';
import imgSmoothie from '../assets/figma/dining/smoothie-bar.jpg';

export * from '../../shared/catalog.ts';

export type Program = ProgramBase & { image: string };
export type PaidActivity = PaidActivityBase & { image: string; icon: string };
export type FreeActivity = FreeActivityBase & { image: string };
export type Outlet = OutletBase & { image: string };

const PROGRAM_IMAGES: Record<ProgramId, string> = {
  'day-use': imgDayUse,
  'beach-lunch': imgBeachLunch,
  full: imgFull,
  'private-boat': imgPrivateBoat,
  groups: imgGroups,
};

const ACTIVITY_MEDIA: Record<ActivityId, { image: string; icon: string }> = {
  kayak: { image: imgKayak, icon: icoKayak },
  sup: { image: imgSup, icon: icoWaves },
  'sea-spi': { image: imgSeaSpi, icon: icoNavigation },
  banana: { image: imgBanana, icon: icoAnchor },
  ringo: { image: imgRingo, icon: icoWind },
};

const FREE_IMAGES: Record<FreeActivityId, string> = {
  volleyball: imgVolleyball,
  football: imgFootball,
  'water-slide': imgWaterSlide,
  trampoline: imgTrampoline,
};

const OUTLET_IMAGES: Record<OutletId, string> = {
  buffet: imgBuffet,
  'a-la-carte': imgALaCarte,
  'beach-bar': imgBeachBar,
  smoothie: imgSmoothie,
};

export const PROGRAMS: Program[] = PROGRAMS_BASE.map((p) => ({ ...p, image: PROGRAM_IMAGES[p.id] }));
export const PAID_ACTIVITIES: PaidActivity[] = PAID_BASE.map((a) => ({ ...a, ...ACTIVITY_MEDIA[a.id] }));
export const FREE_ACTIVITIES: FreeActivity[] = FREE_BASE.map((a) => ({ ...a, image: FREE_IMAGES[a.id] }));
export const OUTLETS: Outlet[] = OUTLETS_BASE.map((o) => ({ ...o, image: OUTLET_IMAGES[o.id] }));
