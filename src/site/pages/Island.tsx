import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { Rich } from '../components/Rich';
import { useContent } from '../hooks';
import { usePageTitle } from '../format';
import { Intro } from '../sections/Intro';
import { IslandDay } from '../sections/IslandDay';
import { Reviews } from '../sections/Reviews';
import { VirtualTour } from '../sections/VirtualTour';

export default function Island() {
  usePageTitle('The Island');
  const page = useContent()['island.page'];
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={<Rich text={page.title} />} subtitle={page.subtitle}>
        <div className="s-header-actions">
          <Link to="/book" className="s-btn s-btn-primary s-btn-lg">
            Book your day
          </Link>
          <Link to="/packages" className="s-btn s-btn-outline s-btn-lg">
            Compare packages
          </Link>
        </div>
      </PageHeader>
      <IslandDay />
      <Intro withButton={false} />
      <VirtualTour />
      <Reviews />
    </>
  );
}
