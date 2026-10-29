// Formatting and page-title helpers for the website.

import { useEffect } from 'react';

/** EUR price the way the website shows it (“EUR 38.00”). */
export function eur(value: number): string {
  return `EUR ${value.toFixed(2)}`;
}

export function euro(value: number): string {
  return `€${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function egp(value: number): string {
  return `EGP ${value.toLocaleString('en-GB')}`;
}

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · Mahmya Island` : 'Mahmya Island — Discover the Red Sea’s Island Escape';
  }, [title]);
}

export function formatVisitDate(date: string, opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });
}

