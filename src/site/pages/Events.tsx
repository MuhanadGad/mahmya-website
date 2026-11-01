import { Briefcase, Cake, Camera, Heart, Music, School, Sparkles, Users, type LucideIcon } from 'lucide-react';
import { EnquiryForm } from '../components/EnquiryForm';
import { PackageCard } from '../components/PackageCard';
import { PageHeader } from '../components/ui';
import { usePageTitle } from '../format';
import { usePackages } from '../../lib/packages';
import { Rich } from '../components/Rich';
import { useContent } from '../hooks';
import type { OccasionIcon } from '../site-content';

const ICONS: Record<OccasionIcon, LucideIcon> = { heart: Heart, briefcase: Briefcase, cake: Cake, school: School, users: Users, sparkles: Sparkles, music: Music, camera: Camera };

export default function Events() {
  // The group package: the original's id, or one named for groups or events on the backend.
  const groups = usePackages().find((p) => p.id === 'groups' || /group|event/i.test(p.name));
  usePageTitle('Events & groups');
  const page = useContent()['events.page'];
  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={<Rich text={page.title} />}
        subtitle={page.subtitle}
      />
      <section className="s-section">
        <div className="s-container s-events-grid">
          <div className="s-occasions">
            {page.occasions.map(({ icon, title, text }, i) => {
              const Icon = ICONS[icon] ?? Sparkles;
              return (
              <article key={i} className="s-occasion">
                <span className="s-occasion-ico" aria-hidden>
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
              );
            })}
            {groups?.status === 'active' && (
              <div className="s-events-pkg">
                <PackageCard program={groups} />
              </div>
            )}
          </div>
          <div className="s-card-panel">
            <h2 className="s-title-sm">{page.formTitle}</h2>
            <p className="s-muted">{page.formNote}</p>
            <EnquiryForm type="event" />
          </div>
        </div>
      </section>
    </>
  );
}
