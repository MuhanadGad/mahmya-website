// Marks a part of the website that isn't connected to mahmya-back yet: it shows
// static sample data (or a form that can't be sent), dimmed, with a "Preview" tag.
// Browsing inside it still works; only sending is switched off by the page.

import type { ReactNode } from 'react';

export function Planned({ what, children, className, inline = false }: { what: string; children: ReactNode; className?: string; inline?: boolean }) {
  const Tag = inline ? 'span' : 'div';
  return (
    <Tag className={`s-planned${inline ? ' inline' : ''}${className ? ` ${className}` : ''}`} data-planned={what}>
      <span className="s-planned-tag" title={`${what} isn’t connected to the backend yet — this is static sample content.`}>
        Preview · {what} not live
      </span>
      {children}
    </Tag>
  );
}

/** A one-line note under a disabled action. */
export function PlannedNote({ children }: { children: ReactNode }) {
  return (
    <p className="s-planned-note" role="note">
      {children}
    </p>
  );
}
