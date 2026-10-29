// "Island Activities": included activities (Figma 917:5624) and paid water
// adventures you can add to a booking (917:5634).

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UNIT_LABEL } from '../../../shared/reservations.ts';
import { MIcon } from '../components/ui';
import { eur } from '../format';
import { useAddOns } from '../../lib/packages';
import { FREE_ACTIVITIES, OPTION_LABEL, addOnCards, type AddOnCard as Card } from '../content';

function AddOnCard({ card }: { card: Card }) {
  const [optionId, setOptionId] = useState(card.options[0].id);
  const option = card.options.find((o) => o.id === optionId) ?? card.options[0];
  // The time set on the add-on in the dashboard.
  const duration = option.time;
  return (
    <article className="s-act-card" aria-labelledby={`act-${card.activity.id}`}>
      <div className="s-act-media">
        <img src={card.activity.image} alt="" loading="lazy" />
        <span className="s-act-chip">
          <MIcon name="schedule" size={16} />
          {duration}
        </span>
      </div>
      <div className="s-act-body">
        <h3 id={`act-${card.activity.id}`} className="s-act-title">
          {card.activity.name}
        </h3>
        {card.options.length > 1 && (
          <div className="s-act-options" role="radiogroup" aria-label={`${card.activity.name} options`}>
            {card.options.map((o) => (
              <button key={o.id} type="button" role="radio" aria-checked={o.id === optionId} className={o.id === optionId ? 'on' : undefined} onClick={() => setOptionId(o.id)}>
                {o.id === optionId && <MIcon name="check" size={18} />}
                {OPTION_LABEL[o.id] ?? (card.options.length > 1 ? o.time || o.name : o.option)}
              </button>
            ))}
          </div>
        )}
        <div className="s-act-footer">
          <p className="s-act-price">
            <strong>{eur(option.price)}</strong> {UNIT_LABEL[option.unit]}
          </p>
          <Link to={`/book?addon=${option.id}`} className="s-act-go" aria-label={`Add ${option.name} to a booking`}>
            <MIcon name="arrow_outward" size={24} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function IncludedPanel() {
  return (
    <div className="s-included">
      <p className="s-included-title">
        <MIcon name="check_circle" size={24} />
        Included with every visit
      </p>
      <div className="s-included-row">
        {FREE_ACTIVITIES.map((a) => (
          <article key={a.id} className="s-act-card included" aria-label={`${a.name} — included`}>
            <div className="s-act-media">
              <img src={a.image} alt="" loading="lazy" />
            </div>
            <div className="s-act-body">
              <h3 className="s-act-title">{a.name}</h3>
              <div className="s-act-footer">
                <p className="s-act-included">
                  <MIcon name="check_circle" size={20} />
                  Included
                </p>
                <Link to="/packages" className="s-act-go outline" aria-label={`${a.name} is included in every package — see packages`}>
                  <MIcon name="arrow_outward" size={24} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function WaterAdventures() {
  const cards = addOnCards(useAddOns());
  return (
    <div className="s-water">
      <h3 className="s-water-title">
        <MIcon name="sailing" className="s-water-icon" />
        Water adventures add-ons you can book on the day
      </h3>
      <div className="s-water-row">
        {cards.map((c) => (
          <AddOnCard key={c.activity.id} card={c} />
        ))}
      </div>
    </div>
  );
}

export function Activities() {
  return (
    <section className="s-activities" aria-labelledby="s-activities-title">
      <div className="s-container">
        <h2 id="s-activities-title" className="s-title-xl center">
          Island Activities
        </h2>
        <p className="s-activities-sub">Everything included in your visit, plus water adventures you can add on the day.</p>
        <IncludedPanel />
        <WaterAdventures />
      </div>
    </section>
  );
}
