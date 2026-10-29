// Activities & dining: the free activities and paid water sports (513:9332), the
// island day and the four dining venues (513:9357), as on the homepage.

import { PageHeader } from '../components/ui';
import { usePageTitle } from '../format';
import { HomeActivities } from '../home/HomeActivities';
import { HomeDining } from '../home/HomeDining';
import { Journey } from '../sections/Journey';

export default function ActivitiesPage() {
  usePageTitle('Activities & dining');
  return (
    <>
      <PageHeader eyebrow="Island experiences" title={<>Play, swim, <em>eat well</em>.</>} subtitle="Beach games and the floating water park are part of every visit. Water sports can be added when you book — they sell out on busy days." />
      <HomeActivities />
      <Journey />
      <HomeDining cta={false} />
    </>
  );
}
