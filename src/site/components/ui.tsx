// Small shared pieces of the website UI.

import type { ReactNode } from 'react';
import starFilled from '../../assets/site/reviews/star.svg';
import starEmpty from '../../assets/site/reviews/star-empty.svg';

/** Material Symbols Rounded glyph (the icon font the design uses). Decorative unless labelled. */
export function MIcon({ name, size, className, label }: { name: string; size?: number; className?: string; label?: string }) {
  return (
    <span className={`msym${className ? ` ${className}` : ''}`} style={size ? { fontSize: size } : undefined} aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label}>
      {name}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={`s-eyebrow${className ? ` ${className}` : ''}`}>{children}</p>;
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', children }: { eyebrow?: string; title: ReactNode; subtitle?: ReactNode; align?: 'center' | 'left'; children?: ReactNode }) {
  return (
    <header className={`s-heading ${align}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="s-title">{title}</h2>
      {subtitle && <p className="s-subtitle">{subtitle}</p>}
      {children}
    </header>
  );
}

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="s-stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <img key={i} src={i <= rating ? starFilled : starEmpty} alt="" width={size} height={size} />
      ))}
    </span>
  );
}

export function PageHeader({ eyebrow, title, subtitle, children }: { eyebrow: string; title: ReactNode; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <section className="s-page-header">
      <div className="s-container">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="s-display">{title}</h1>
        {subtitle && <p className="s-lead">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
