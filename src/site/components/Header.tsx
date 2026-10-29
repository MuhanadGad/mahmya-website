// "2_Header" (Figma 559:11689, homepage 513:9285): the glass pill navigation with
// the logo, the page links (a hand-drawn wave under the current page), My Profile
// and Book Your Day. It floats over the homepage hero and stays pinned while
// scrolling; below desktop widths the links move into a menu.

import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { NAV_MAIN } from '../content';

export function Header({ overHero }: { overHero: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);
  const link = (l: { to: string; label: string }) => (
    <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={close} className={({ isActive }) => `s-header-link${isActive ? ' current' : ''}`}>
      {l.label}
    </NavLink>
  );

  return (
    <header className={`s-header${overHero && !scrolled ? ' over-hero' : ''}${scrolled || open ? ' scrolled' : ''}`}>
      <nav className="s-header-bar" aria-label="Main">
        <Link to="/" className="s-header-logo" aria-label="Mahmya Island — home" onClick={close}>
          <Logo />
        </Link>
        <div className="s-header-links">{NAV_MAIN.map(link)}</div>
        <div className="s-header-end">
          <NavLink to="/profile" className={({ isActive }) => `s-header-profile${isActive ? ' current' : ''}`}>
            My Profile
          </NavLink>
          <Link to="/book" className="s-header-book">
            Book Your Day
          </Link>
          <button type="button" className="s-header-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="s-header-drawer" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      <div id="s-header-drawer" className={`s-header-drawer${open ? ' open' : ''}`} hidden={!open}>
        {NAV_MAIN.map(link)}
        <NavLink to="/profile" onClick={close} className={({ isActive }) => `s-header-link${isActive ? ' current' : ''}`}>
          My Profile
        </NavLink>
        <Link to="/booking" onClick={close} className="s-header-link">
          Manage booking
        </Link>
        <Link to="/book" onClick={close} className="s-header-book">
          Book Your Day
        </Link>
      </div>
    </header>
  );
}
