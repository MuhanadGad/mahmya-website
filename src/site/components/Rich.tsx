// Text staff write in the dashboard: *word* is highlighted (an <em>, or the tag the
// design uses), a new line is a line break, and [label](/path) or [label](https://…)
// is a link. Anything else is plain text: no HTML is ever read from the content.

import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

const TOKEN = /\*([^*]+)\*|\[([^\]]+)\]\(((?:\/(?!\/)|https?:\/\/)[^)\s]*)\)/g;

function line(text: string, Highlight: 'em' | 'span' | 'strong', key: number): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const [, highlighted, label, href] = match;
    const k = `${key}-${match.index}`;
    if (highlighted) out.push(<Highlight key={k}>{highlighted}</Highlight>);
    else if (href.startsWith('/')) out.push(<Link key={k} to={href}>{label}</Link>);
    else out.push(<a key={k} href={href} target="_blank" rel="noreferrer">{label}</a>);
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Rich({ text, highlight = 'em' }: { text: string; highlight?: 'em' | 'span' | 'strong' }) {
  return (
    <>
      {text.split('\n').map((l, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line(l, highlight, i)}
        </Fragment>
      ))}
    </>
  );
}

/** The text without its markup, for alt text and labels. */
export const plain = (text: string) => text.replace(TOKEN, (_m, highlighted?: string, label?: string) => highlighted ?? label ?? '').replace(/\n/g, ' ');
