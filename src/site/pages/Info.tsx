// Guest information pages: FAQs, booking terms and cancellation policy (edited in the
// dashboard under Website › Content), and the 404 page.

import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Rich } from '../components/Rich';
import { PageHeader } from '../components/ui';
import { usePageTitle } from '../format';
import { useContent } from '../hooks';

export function Faq() {
  usePageTitle('FAQs');
  const page = useContent().faqs;
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={<Rich text={page.title} />} />
      <section className="s-section">
        <div className="s-container s-prose">
          {page.items.map((f, i) => (
            <details key={i} className="s-faq">
              <summary>{f.question}</summary>
              <p>
                <Rich text={f.answer} />
              </p>
            </details>
          ))}
          <p>
            Still have a question? <Link to="/contact">Send us a message</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

export function Terms() {
  usePageTitle('Booking terms');
  const page = useContent().terms;
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={<Rich text={page.title} />} />
      <section className="s-section">
        <div className="s-container s-prose">
          {page.items.map((item, i) => (
            <Fragment key={i}>
              {item.heading && <h2>{item.heading}</h2>}
              <p>
                <Rich text={item.text} />
              </p>
            </Fragment>
          ))}
        </div>
      </section>
    </>
  );
}

export function Cancellation() {
  usePageTitle('Cancellation policy');
  const page = useContent().cancellation;
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={<Rich text={page.title} />} />
      <section className="s-section">
        <div className="s-container s-prose">
          <ul>
            {page.items.map((item, i) => (
              <li key={i}>
                <strong>{item.title}</strong> <Rich text={item.text} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  usePageTitle('Page not found');
  return (
    <PageHeader eyebrow="404" title={<>This page has <em>drifted away</em>.</>} subtitle="The page you’re looking for isn’t here.">
      <div className="s-header-actions">
        <Link to="/" className="s-btn s-btn-primary s-btn-lg">
          Back to the homepage
        </Link>
      </div>
    </PageHeader>
  );
}
