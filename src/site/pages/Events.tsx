import { Cake, Briefcase, Heart, School } from 'lucide-react';
import { EnquiryForm } from '../components/EnquiryForm';
import { PackageCard } from '../components/PackageCard';
import { PageHeader } from '../components/ui';
import { usePageTitle } from '../format';
import { usePackages } from '../../lib/packages';

const OCCASIONS = [
  { icon: Heart, title: 'Weddings & engagements', text: 'Barefoot ceremonies on the sand with the Red Sea behind you.' },
  { icon: Briefcase, title: 'Corporate days', text: 'Team days, incentives and launches with a private area and catering.' },
  { icon: Cake, title: 'Birthdays & celebrations', text: 'Décor, music and a cake moment — we take care of the details.' },
  { icon: School, title: 'Schools & clubs', text: 'Supervised beach days with lunch and included activities.' },
];

export default function Events() {
  // The group package: the original's id, or one named for groups or events on the backend.
  const groups = usePackages().find((p) => p.id === 'groups' || /group|event/i.test(p.name));
  usePageTitle('Events & groups');
  return (
    <>
      <PageHeader
        eyebrow="Celebrate the moments"
        title={
          <>
            Unforgettable <em>events</em> on Mahmya Island.
          </>
        }
        subtitle="Tell us about your occasion and our events team will plan the day with you — from the boat to the last dance."
      />
      <section className="s-section">
        <div className="s-container s-events-grid">
          <div className="s-occasions">
            {OCCASIONS.map(({ icon: Icon, title, text }) => (
              <article key={title} className="s-occasion">
                <span className="s-occasion-ico" aria-hidden>
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
            {groups?.status === 'active' && (
              <div className="s-events-pkg">
                <PackageCard program={groups} />
              </div>
            )}
          </div>
          <div className="s-card-panel">
            <h2 className="s-title-sm">Plan your event</h2>
            <p className="s-muted">Groups of 10–30 can also book the Events &amp; Groups package online.</p>
            <EnquiryForm type="event" />
          </div>
        </div>
      </section>
    </>
  );
}
