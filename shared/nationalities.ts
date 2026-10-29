// Nationalities: every country (ISO 3166-1 alpha-2), the culture groups the
// boarding plan uses to seat compatible guests together, and the marina sheet's
// short codes (F, E, G…). Groups and codes are defaults the dashboard can edit.
// Each country also maps to one of the analytics markets, so the dashboards'
// nationality figures keep their eleven groups.

import type { MarketId, ProgramId } from './catalog.ts';

export const COUNTRIES: [code: string, name: string][] = [
  ['AF', 'Afghanistan'], ['AX', 'Åland Islands'], ['AL', 'Albania'], ['DZ', 'Algeria'], ['AS', 'American Samoa'], ['AD', 'Andorra'], ['AO', 'Angola'], ['AI', 'Anguilla'],
  ['AG', 'Antigua and Barbuda'], ['AR', 'Argentina'], ['AM', 'Armenia'], ['AW', 'Aruba'], ['AU', 'Australia'], ['AT', 'Austria'], ['AZ', 'Azerbaijan'], ['BS', 'Bahamas'],
  ['BH', 'Bahrain'], ['BD', 'Bangladesh'], ['BB', 'Barbados'], ['BY', 'Belarus'], ['BE', 'Belgium'], ['BZ', 'Belize'], ['BJ', 'Benin'], ['BM', 'Bermuda'],
  ['BT', 'Bhutan'], ['BO', 'Bolivia'], ['BA', 'Bosnia and Herzegovina'], ['BW', 'Botswana'], ['BR', 'Brazil'], ['VG', 'British Virgin Islands'], ['BN', 'Brunei'], ['BG', 'Bulgaria'],
  ['BF', 'Burkina Faso'], ['BI', 'Burundi'], ['CV', 'Cabo Verde'], ['KH', 'Cambodia'], ['CM', 'Cameroon'], ['CA', 'Canada'], ['BQ', 'Caribbean Netherlands'], ['KY', 'Cayman Islands'],
  ['CF', 'Central African Republic'], ['TD', 'Chad'], ['CL', 'Chile'], ['CN', 'China'], ['CO', 'Colombia'], ['KM', 'Comoros'], ['CG', 'Congo'], ['CD', 'Congo (DR)'],
  ['CK', 'Cook Islands'], ['CR', 'Costa Rica'], ['CI', 'Côte d’Ivoire'], ['HR', 'Croatia'], ['CU', 'Cuba'], ['CW', 'Curaçao'], ['CY', 'Cyprus'], ['CZ', 'Czechia'],
  ['DK', 'Denmark'], ['DJ', 'Djibouti'], ['DM', 'Dominica'], ['DO', 'Dominican Republic'], ['EC', 'Ecuador'], ['EG', 'Egypt'], ['SV', 'El Salvador'], ['GQ', 'Equatorial Guinea'],
  ['ER', 'Eritrea'], ['EE', 'Estonia'], ['SZ', 'Eswatini'], ['ET', 'Ethiopia'], ['FK', 'Falkland Islands'], ['FO', 'Faroe Islands'], ['FJ', 'Fiji'], ['FI', 'Finland'],
  ['FR', 'France'], ['GF', 'French Guiana'], ['PF', 'French Polynesia'], ['GA', 'Gabon'], ['GM', 'Gambia'], ['GE', 'Georgia'], ['DE', 'Germany'], ['GH', 'Ghana'],
  ['GI', 'Gibraltar'], ['GR', 'Greece'], ['GL', 'Greenland'], ['GD', 'Grenada'], ['GP', 'Guadeloupe'], ['GU', 'Guam'], ['GT', 'Guatemala'], ['GG', 'Guernsey'],
  ['GN', 'Guinea'], ['GW', 'Guinea-Bissau'], ['GY', 'Guyana'], ['HT', 'Haiti'], ['HN', 'Honduras'], ['HK', 'Hong Kong'], ['HU', 'Hungary'], ['IS', 'Iceland'],
  ['IN', 'India'], ['ID', 'Indonesia'], ['IR', 'Iran'], ['IQ', 'Iraq'], ['IE', 'Ireland'], ['IM', 'Isle of Man'], ['IL', 'Israel'], ['IT', 'Italy'],
  ['JM', 'Jamaica'], ['JP', 'Japan'], ['JE', 'Jersey'], ['JO', 'Jordan'], ['KZ', 'Kazakhstan'], ['KE', 'Kenya'], ['KI', 'Kiribati'], ['XK', 'Kosovo'],
  ['KW', 'Kuwait'], ['KG', 'Kyrgyzstan'], ['LA', 'Laos'], ['LV', 'Latvia'], ['LB', 'Lebanon'], ['LS', 'Lesotho'], ['LR', 'Liberia'], ['LY', 'Libya'],
  ['LI', 'Liechtenstein'], ['LT', 'Lithuania'], ['LU', 'Luxembourg'], ['MO', 'Macao'], ['MG', 'Madagascar'], ['MW', 'Malawi'], ['MY', 'Malaysia'], ['MV', 'Maldives'],
  ['ML', 'Mali'], ['MT', 'Malta'], ['MH', 'Marshall Islands'], ['MQ', 'Martinique'], ['MR', 'Mauritania'], ['MU', 'Mauritius'], ['YT', 'Mayotte'], ['MX', 'Mexico'],
  ['FM', 'Micronesia'], ['MD', 'Moldova'], ['MC', 'Monaco'], ['MN', 'Mongolia'], ['ME', 'Montenegro'], ['MS', 'Montserrat'], ['MA', 'Morocco'], ['MZ', 'Mozambique'],
  ['MM', 'Myanmar'], ['NA', 'Namibia'], ['NR', 'Nauru'], ['NP', 'Nepal'], ['NL', 'Netherlands'], ['NC', 'New Caledonia'], ['NZ', 'New Zealand'], ['NI', 'Nicaragua'],
  ['NE', 'Niger'], ['NG', 'Nigeria'], ['NU', 'Niue'], ['KP', 'North Korea'], ['MK', 'North Macedonia'], ['MP', 'Northern Mariana Islands'], ['NO', 'Norway'], ['OM', 'Oman'],
  ['PK', 'Pakistan'], ['PW', 'Palau'], ['PS', 'Palestine'], ['PA', 'Panama'], ['PG', 'Papua New Guinea'], ['PY', 'Paraguay'], ['PE', 'Peru'], ['PH', 'Philippines'],
  ['PL', 'Poland'], ['PT', 'Portugal'], ['PR', 'Puerto Rico'], ['QA', 'Qatar'], ['RE', 'Réunion'], ['RO', 'Romania'], ['RU', 'Russia'], ['RW', 'Rwanda'],
  ['BL', 'Saint Barthélemy'], ['SH', 'Saint Helena'], ['KN', 'Saint Kitts and Nevis'], ['LC', 'Saint Lucia'], ['MF', 'Saint Martin'], ['PM', 'Saint Pierre and Miquelon'], ['VC', 'Saint Vincent and the Grenadines'], ['WS', 'Samoa'],
  ['SM', 'San Marino'], ['ST', 'São Tomé and Príncipe'], ['SA', 'Saudi Arabia'], ['SN', 'Senegal'], ['RS', 'Serbia'], ['SC', 'Seychelles'], ['SL', 'Sierra Leone'], ['SG', 'Singapore'],
  ['SX', 'Sint Maarten'], ['SK', 'Slovakia'], ['SI', 'Slovenia'], ['SB', 'Solomon Islands'], ['SO', 'Somalia'], ['ZA', 'South Africa'], ['KR', 'South Korea'], ['SS', 'South Sudan'],
  ['ES', 'Spain'], ['LK', 'Sri Lanka'], ['SD', 'Sudan'], ['SR', 'Suriname'], ['SE', 'Sweden'], ['CH', 'Switzerland'], ['SY', 'Syria'], ['TW', 'Taiwan'],
  ['TJ', 'Tajikistan'], ['TZ', 'Tanzania'], ['TH', 'Thailand'], ['TL', 'Timor-Leste'], ['TG', 'Togo'], ['TK', 'Tokelau'], ['TO', 'Tonga'], ['TT', 'Trinidad and Tobago'],
  ['TN', 'Tunisia'], ['TR', 'Türkiye'], ['TM', 'Turkmenistan'], ['TC', 'Turks and Caicos Islands'], ['TV', 'Tuvalu'], ['UG', 'Uganda'], ['UA', 'Ukraine'], ['AE', 'United Arab Emirates'],
  ['GB', 'United Kingdom'], ['US', 'United States'], ['UY', 'Uruguay'], ['VI', 'U.S. Virgin Islands'], ['UZ', 'Uzbekistan'], ['VU', 'Vanuatu'], ['VA', 'Vatican City'], ['VE', 'Venezuela'],
  ['VN', 'Vietnam'], ['WF', 'Wallis and Futuna'], ['EH', 'Western Sahara'], ['YE', 'Yemen'], ['ZM', 'Zambia'], ['ZW', 'Zimbabwe'],
];

export const countryName: Record<string, string> = Object.fromEntries(COUNTRIES);

export function isCountry(code: unknown): code is string {
  return typeof code === 'string' && code in countryName;
}

/** The country's flag from its two letters (regional indicator symbols). */
export function flagOf(code: string): string {
  return isCountry(code) ? String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : '';
}

/** Countries most of the island's guests come from, shown first in pickers. */
export const COMMON_COUNTRIES = ['DE', 'GB', 'PL', 'CZ', 'IT', 'FR', 'NL', 'RU', 'UA', 'HU', 'EG', 'SE'];

// ── Analytics markets ────────────────────────────────────────────────────────

const MARKET_OF: Record<string, MarketId> = { DE: 'de', GB: 'uk', PL: 'pl', RU: 'ru', IT: 'it', CZ: 'cz', EG: 'eg', NL: 'benelux', BE: 'benelux', LU: 'benelux', SE: 'nordics', NO: 'nordics', DK: 'nordics', FI: 'nordics', IS: 'nordics', UA: 'ua' };
/** A representative country for each market, for bookings made before nationalities were recorded. */
const COUNTRY_OF_MARKET: Partial<Record<MarketId, string>> = { de: 'DE', uk: 'GB', pl: 'PL', ru: 'RU', it: 'IT', cz: 'CZ', eg: 'EG', benelux: 'NL', nordics: 'SE', ua: 'UA' };

export function marketOf(code: string): MarketId {
  return MARKET_OF[code] ?? 'other';
}

export function countryOfMarket(market: MarketId): string | null {
  return COUNTRY_OF_MARKET[market] ?? null;
}

// ── Culture groups ───────────────────────────────────────────────────────────

export interface CultureGroup {
  id: string;
  name: string;
  /** Groups seated together when the same group has no room. */
  near: string[];
}

export interface CultureConfig {
  groups: CultureGroup[];
  /** Country → group. Countries not listed belong to "other". */
  countryGroup: Record<string, string>;
  updatedAt: string | null;
  updatedBy: string | null;
}

export const OTHER_GROUP = 'other';

const GROUPS: [id: string, name: string, near: string[], members: string][] = [
  ['german', 'German-speaking', ['benelux', 'nordic', 'central'], 'DE AT CH LI'],
  ['english', 'English-speaking', ['nordic', 'benelux', 'german', 'oceania'], 'GB IE US CA AU NZ ZA IM JE GG GI'],
  ['french', 'French-speaking', ['benelux', 'southern'], 'FR MC'],
  ['benelux', 'Dutch & Belgian', ['german', 'english', 'french', 'nordic'], 'NL BE LU'],
  ['nordic', 'Nordic', ['german', 'english', 'benelux', 'baltic'], 'SE NO DK FI IS FO GL AX'],
  ['central', 'Central European', ['german', 'baltic', 'ukrainian', 'balkan'], 'PL CZ SK HU SI'],
  ['baltic', 'Baltic', ['nordic', 'central'], 'EE LV LT'],
  ['ukrainian', 'Ukrainian', ['central', 'baltic'], 'UA'],
  ['russian', 'Russian-speaking', [], 'RU BY KZ KG TJ TM UZ MD AM GE'],
  ['balkan', 'Southeast European', ['central', 'southern', 'turkish'], 'RO BG RS HR BA ME MK AL XK'],
  ['southern', 'Southern European', ['french', 'balkan', 'latin'], 'IT ES PT GR CY MT SM VA AD'],
  ['arabic', 'Arabic-speaking', ['turkish'], 'EG SA AE QA KW BH OM JO LB SY IQ PS YE LY TN DZ MA SD MR EH DJ KM SO'],
  ['turkish', 'Turkish', ['arabic', 'balkan'], 'TR AZ'],
  ['persian', 'Persian-speaking', [], 'IR AF'],
  ['israeli', 'Israeli', [], 'IL'],
  ['east-asian', 'East Asian', ['southeast-asian'], 'CN JP KR KP TW HK MO MN'],
  ['south-asian', 'South Asian', ['southeast-asian'], 'IN PK BD LK NP BT MV'],
  ['southeast-asian', 'Southeast Asian', ['east-asian', 'south-asian'], 'TH VN MY SG ID PH KH LA MM BN TL'],
  ['latin', 'Latin American', ['southern'], 'MX GT BZ HN SV NI CR PA CU DO PR CO VE EC PE BO BR PY UY AR CL GY SR'],
  ['african', 'Sub-Saharan African', [], 'NG GH KE ET TZ UG RW BI CD CG CM GA GQ CF TD NE ML BF SN GM GN GW SL LR CI TG BJ AO ZM ZW MW MZ MG BW NA SZ LS ER SS CV ST MU SC RE YT'],
  ['oceania', 'Pacific', ['english'], 'FJ PG WS TO VU SB KI TV NR PW FM MH CK NU TK NC PF WF AS GU MP'],
  [OTHER_GROUP, 'Other', [], ''],
];

export const DEFAULT_CULTURE: CultureConfig = {
  groups: GROUPS.map(([id, name, near]) => ({ id, name, near })),
  countryGroup: Object.fromEntries(GROUPS.flatMap(([id, , , members]) => members.split(' ').filter(Boolean).map((code) => [code, id]))),
  updatedAt: null,
  updatedBy: null,
};

export function groupOf(code: string, config: CultureConfig): string {
  return config.countryGroup[code] ?? OTHER_GROUP;
}

/**
 * How well two nationalities sit together on a boat: 3 the same country, 2 the
 * same culture group, 1 a compatible group, 0 otherwise.
 */
export function compatibility(a: string, b: string, config: CultureConfig): number {
  if (a === b) return 3;
  const ga = groupOf(a, config);
  const gb = groupOf(b, config);
  if (ga === gb && ga !== OTHER_GROUP) return 2;
  const near = config.groups.find((g) => g.id === ga)?.near ?? [];
  const back = config.groups.find((g) => g.id === gb)?.near ?? [];
  return near.includes(gb) || back.includes(ga) ? 1 : 0;
}

export function cultureProblem(config: Pick<CultureConfig, 'groups' | 'countryGroup'>): string | null {
  if (!Array.isArray(config.groups) || config.groups.length === 0 || config.groups.length > 60) return 'Keep between 1 and 60 culture groups.';
  const ids = new Set<string>();
  for (const g of config.groups) {
    if (typeof g?.id !== 'string' || !/^[a-z0-9-]{1,32}$/.test(g.id) || ids.has(g.id)) return 'Each group needs its own short id (lowercase letters, digits and dashes).';
    ids.add(g.id);
    if (typeof g.name !== 'string' || !g.name.trim() || g.name.length > 60) return 'Give every group a name of up to 60 characters.';
  }
  if (!ids.has(OTHER_GROUP)) return 'The “Other” group can’t be removed.';
  for (const g of config.groups) {
    if (!Array.isArray(g.near) || g.near.some((n) => !ids.has(n) || n === g.id)) return `${g.name}: compatible groups must be other existing groups.`;
  }
  if (!config.countryGroup || typeof config.countryGroup !== 'object') return 'Invalid country groups.';
  for (const [code, id] of Object.entries(config.countryGroup)) {
    if (!isCountry(code)) return `Unknown country ${code}.`;
    if (!ids.has(id)) return `${countryName[code]} is in a group that doesn’t exist.`;
  }
  return null;
}

// ── The marina sheet's codes ─────────────────────────────────────────────────

/** Short codes the cloud system's daily sheet uses, mapped to countries and programs. */
export interface SheetCodes {
  nationalities: Record<string, string>;
  programs: Record<string, ProgramId>;
}

export const DEFAULT_SHEET_CODES: SheetCodes = {
  nationalities: { F: 'FR', E: 'GB', G: 'DE', P: 'PL', H: 'HU', R: 'RU' },
  programs: { NP: 'full', DU: 'day-use', DUB: 'beach-lunch' },
};

/**
 * The countries a sheet's nationality cell names ("G/F" → DE, FR). A code is
 * read through the sheet codes first, then as a country code itself.
 */
export function readNationalities(cell: string, codes: SheetCodes): { countries: string[]; unknown: string[] } {
  const countries: string[] = [];
  const unknown: string[] = [];
  for (const raw of cell.split(/[/,;+&\s]+/)) {
    const code = raw.trim().toUpperCase();
    if (!code) continue;
    const country = codes.nationalities[code] ?? (isCountry(code) ? code : null);
    if (country) {
      if (!countries.includes(country)) countries.push(country);
    } else if (!unknown.includes(code)) unknown.push(code);
  }
  return { countries, unknown };
}
