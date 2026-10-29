// The public Mahmya Island website. Pages are lazy-loaded; the homepage sections
// come from the Figma designs, and bookings, enquiries and sign-ups go straight
// into the platform (they appear in the /admin dashboard). The current design
// (513:9285) has the pill header and the banded footer; the previous homepage
// (962:1980) stays at /olddesign with its own navigation and footer.

import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './site.css';
import './home.css';
import './checkout.css';
import { track } from './api';
import { Header } from './components/Header';
import { SiteFooter } from './components/SiteFooter';
import { SiteNav } from './components/SiteNav';
import { Home } from './pages/Home';

const OldHome = lazy(() => import('./pages/OldHome'));
const Profile = lazy(() => import('./pages/Profile'));

const Island = lazy(() => import('./pages/Island'));
const PackagesPage = lazy(() => import('./pages/PackagesPage'));
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage'));
const Events = lazy(() => import('./pages/Events'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const Contact = lazy(() => import('./pages/Contact'));
const Book = lazy(() => import('./pages/Book'));
const ManageBooking = lazy(() => import('./pages/ManageBooking'));
const Faq = lazy(() => import('./pages/Info').then((m) => ({ default: m.Faq })));
const Terms = lazy(() => import('./pages/Info').then((m) => ({ default: m.Terms })));
const Cancellation = lazy(() => import('./pages/Info').then((m) => ({ default: m.Cancellation })));
const NotFound = lazy(() => import('./pages/Info').then((m) => ({ default: m.NotFound })));

/** New page → top; links with #anchor → that section (once it has rendered). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    let tries = 0;
    const t = window.setInterval(() => {
      const el = document.getElementById(hash.slice(1));
      if (el || ++tries > 20) {
        window.clearInterval(t);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    return () => window.clearInterval(t);
  }, [pathname, hash]);
  return null;
}

function Layout() {
  const { pathname } = useLocation();
  const classic = pathname === '/olddesign';
  useEffect(() => track('visits'), []);
  return (
    <div className={`site ${classic ? 'classic' : 'current'}`}>
      <a href="#main" className="s-skip">
        Skip to content
      </a>
      {classic ? <SiteNav transparent /> : <Header overHero={pathname === '/'} />}
      <main id="main">
        <Suspense fallback={<div className="s-page-loading" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/island" element={<Island />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<Book />} />
            <Route path="/booking" element={<ManageBooking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/olddesign" element={<OldHome />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cancellation-policy" element={<Cancellation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <SiteFooter events={pathname !== '/events'} band={!classic} />
    </div>
  );
}

export default function Website() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Layout />
    </BrowserRouter>
  );
}
