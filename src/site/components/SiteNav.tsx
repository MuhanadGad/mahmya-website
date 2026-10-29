// "Hero/Nav" from Figma (972:6386): centred, mirror-symmetric navigation with the
// logo in the middle. Transparent over the homepage hero; solid (with Book now)
// everywhere else. Collapses to a menu button on small screens.

import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { NAV_LEFT, NAV_RIGHT } from '../content';

export function SiteNav({ transparent }: { transparent: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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

  const solid = !transparent || scrolled || open;
  const link = (l: { to: string; label: string }) => (
    <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={({ isActive }) => `s-nav-item${isActive ? ' current' : ''}`}>
      {l.label}
    </NavLink>
  );

  return (
    <header className={`s-nav${solid ? ' solid' : ' transparent'}`}>
      <nav className="s-nav-inner" aria-label="Main">
        <div className="s-nav-group left">{NAV_LEFT.map(link)}</div>
        <Link to="/" className="s-nav-logo" aria-label="Mahmya Island — home">
          <Logo />
        </Link>
        <div className="s-nav-group right">{NAV_RIGHT.map(link)}</div>
        <Link to="/book" className="s-btn s-btn-primary s-nav-book">
          Book now
        </Link>
        <button type="button" className="s-nav-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="s-nav-drawer" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      <div id="s-nav-drawer" className={`s-nav-drawer${open ? ' open' : ''}`} hidden={!open}>
        {[...NAV_LEFT, ...NAV_RIGHT].map(link)}
        <Link to="/booking" className="s-nav-item" onClick={() => setOpen(false)}>
          Manage booking
        </Link>
        <Link to="/book" className="s-btn s-btn-primary" onClick={() => setOpen(false)}>
          Book your day
        </Link>
      </div>
    </header>
  );
}
