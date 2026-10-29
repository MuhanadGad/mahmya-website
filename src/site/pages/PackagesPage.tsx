import { Link } from 'react-router-dom';
import { Check, Minus } from 'lucide-react';
import { PageHeader } from '../components/ui';
import { eur, usePageTitle } from '../format';
import { displayRate } from '../../../shared/cloud.ts';
import type { PackageDef } from '../../../shared/packages.ts';
import { childNote, usePackages } from '../../lib/packages';
import { islandToday, useCatalog } from '../hooks';
import { Packages } from '../sections/Packages';

/** A side-by-side row: known for the original packages, read from a new package's included items. */
const COMPARE: { label: string; match: RegExp; has: Record<string, boolean> }[] = [
  { label: 'Round-trip boat transfer', match: /boat|transfer/i, has: { 'day-use': true, 'beach-lunch': true, full: true, 'private-boat': true, groups: true } },
  { label: 'Beach access & sunbed', match: /beach access|sunbed/i, has: { 'day-use': true, 'beach-lunch': true, full: true, 'private-boat': false, groups: true } },
  { label: 'Water park, slide & trampoline', match: /water park|slide|trampoline/i, has: { 'day-use': true, 'beach-lunch': true, full: true, 'private-boat': false, groups: true } },
  { label: 'Snorkeling equipment', match: /snorkel/i, has: { 'day-use': true, 'beach-lunch': true, full: true, 'private-boat': true, groups: true } },
  { label: 'Buffet lunch', match: /buffet|lunch/i, has: { 'day-use': false, 'beach-lunch': true, full: true, 'private-boat': false, groups: true } },
  { label: 'À la carte lunch & full bar', match: /à la carte|a la carte|full bar/i, has: { 'day-use': false, 'beach-lunch': false, full: true, 'private-boat': false, groups: false } },
  { label: 'Private boat & skipper', match: /private boat|skipper/i, has: { 'day-use': false, 'beach-lunch': false, full: false, 'private-boat': true, groups: false } },
  { label: 'Reserved area & event host', match: /reserved area|event host/i, has: { 'day-use': false, 'beach-lunch': false, full: false, 'private-boat': false, groups: true } },
];

const included = (row: (typeof COMPARE)[number], p: PackageDef) => row.has[p.id] ?? (row.match.test(p.includes.join(' ')) || (row.label === 'Buffet lunch' && p.lunchIncluded));
const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

export default function PackagesPage() {
  usePageTitle('Programs & prices');
  const catalog = useCatalog();
  const packages = usePackages();
  const onSale = packages.filter((p) => p.status === 'active');
  return (
    <>
      <PageHeader eyebrow="Programs" title={<>{WORDS[onSale.length] ?? onSale.length} {onSale.length === 1 ? 'way' : 'ways'} to spend your <em>island day</em>.</>} subtitle={`Every package includes the boat from Mahmya Beach Marina. ${childNote(packages)} and under-3s go free.`} />
      <Packages seeAll={false} />
      <section className="s-section s-compare-wrap" aria-labelledby="s-compare-title">
        <div className="s-container">
          <h2 id="s-compare-title" className="s-title-md">
            What’s included, side by side
          </h2>
          <div className="s-table-scroll">
            <table className="s-compare">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="s-sr-only">Feature</span>
                  </th>
                  {onSale.map((p) => (
                    <th key={p.id} scope="col" className={p.featured ? 'popular' : undefined}>
                      {p.name}
                      <small>{eur(displayRate(catalog, p.id, islandToday()).adult)} adult</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {onSale.map((p) => (
                      <td key={p.id}>{included(row, p) ? <Check size={18} aria-label="Included" className="yes" /> : <Minus size={18} aria-label="Not included" className="no" />}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row">Highlights</th>
                  {onSale.map((p) => (
                    <td key={p.id} className="s-compare-notes">
                      {p.includes.join(' · ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">
                    <span className="s-sr-only">Book</span>
                  </th>
                  {onSale.map(({ id }) => (
                    <td key={id}>
                      <Link to={`/book?program=${id}`} className="s-btn s-btn-primary s-btn-sm">
                        Book
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="s-fine">Prices are the same for every guest. Private Boat Trips take up to 12 guests; Events &amp; Groups is for parties of 10 or more — for weddings and celebrations, <Link to="/events">send an event enquiry</Link>.</p>
        </div>
      </section>
    </>
  );
}
