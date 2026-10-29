import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { usePageTitle } from '../format';
import { Intro } from '../sections/Intro';
import { IslandDay } from '../sections/IslandDay';
import { Reviews } from '../sections/Reviews';
import { VirtualTour } from '../sections/VirtualTour';

export default function Island() {
  usePageTitle('The Island');
  return (
    <>
      <PageHeader eyebrow="The island" title={<>Big Giftun, <em>protected</em> and close to Hurghada.</>} subtitle="A short boat ride from Mahmya Beach Marina takes you to white sand, calm reefs and an island day planned around you.">
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
