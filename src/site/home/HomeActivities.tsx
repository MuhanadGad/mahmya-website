// "All Activities" (Figma 513:9332): the four free activities included in every
// visit, then the five paid water sports, each with its prices. Paid cards open
// the booking page with that add-on selected.

import { Link } from 'react-router-dom';
import { useAddOns } from '../../lib/packages';
import { FREE_ACTIVITIES, PAID_ACTIVITIES } from '../content';
import check from '../../assets/home/check.svg';

/** Where each portrait photo is cropped, as framed in the design. */
const FOCUS: Record<string, string> = { 'water-slide': 'center 55%', kayak: 'center 63%', banana: 'center 85%' };

export function HomeActivities() {
  const addOns = useAddOns();
  // Prices and times as set on the add-ons in the dashboard.
  const priceLines = (id: string, fallback: string[]) => {
    const options = addOns.filter((o) => o.activityId === id && o.status === 'active');
    return options.length ? options.map((o) => `${o.option || o.name} - EUR ${o.price.toFixed(2)}`) : fallback;
  };
  return (
    <section className="h-acts" aria-labelledby="h-acts-title">
      <div className="h-wrap">
        <header className="h-acts-head">
          <div>
            <p className="h-eyebrow teal">Island Experiences</p>
            <h2 id="h-acts-title" className="h-title xl">
              All Activities
            </h2>
          </div>
          <p className="h-legend" aria-label="Legend">
            <span>
              <i className="free" aria-hidden /> Free
            </span>
            <span>
              <i className="paid" aria-hidden /> Paid
            </span>
          </p>
        </header>
        <ul className="h-acts-row free" aria-label="Free activities, included in every visit">
          {FREE_ACTIVITIES.map((a) => (
            <li key={a.id} className="h-act">
              <img className="h-act-photo" src={a.image} alt="" loading="lazy" style={{ objectPosition: FOCUS[a.id] }} />
              <span className="h-act-badge free">Free</span>
              <div className="h-act-body">
                <p className="h-act-name">
                  <span className="h-act-ico free" aria-hidden>
                    <img src={check} alt="" width={12} height={12} />
                  </span>
                  {a.name}
                </p>
                <p className="h-act-sub">Free play for all guests</p>
              </div>
            </li>
          ))}
        </ul>
        <ul className="h-acts-row paid" aria-label="Paid water sports">
          {PAID_ACTIVITIES.map((a) => {
            const option = addOns.find((o) => o.activityId === a.id && o.status === 'active');
            const lines = priceLines(a.id, a.priceLines);
            return (
              <li key={a.id} className="h-act">
                <Link to={option ? `/book?addon=${option.id}` : '/book'} className="h-act-link" aria-label={`${a.name}: ${lines.join(', ')}. Add it to a booking`}>
                  <img className="h-act-photo" src={a.image} alt="" loading="lazy" style={{ objectPosition: FOCUS[a.id] }} />
                  <span className="h-act-badge paid">Paid</span>
                  <div className="h-act-body">
                    <p className="h-act-name">
                      <span className="h-act-ico paid" aria-hidden>
                        <img src={a.icon} alt="" width={12} height={12} />
                      </span>
                      {a.name}
                    </p>
                    {lines.map((l) => (
                      <p key={l} className="h-act-price">
                        {l}
                      </p>
                    ))}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
