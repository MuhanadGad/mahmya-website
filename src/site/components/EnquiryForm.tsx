// Event and contact enquiries. They arrive in the dashboard's Website inbox.

import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { EVENT_TYPES, type EnquiryType } from '../../../shared/website.ts';
import { siteFetch } from '../api';
import { islandToday } from '../hooks';

export function EnquiryForm({ type, initialMessage = '' }: { type: EnquiryType; initialMessage?: string }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: initialMessage, eventType: EVENT_TYPES[0] as string, eventDate: '', guests: '' });
  const [trap, setTrap] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await siteFetch('/public/enquiries', {
        type,
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        website: trap,
        ...(type === 'event' ? { eventType: form.eventType, eventDate: form.eventDate || undefined, guests: form.guests ? Number(form.guests) : undefined } : {}),
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="s-form-success" role="status">
        <CheckCircle2 size={40} aria-hidden />
        <p className="s-title-sm">Thank you, {form.name.split(' ')[0]}.</p>
        <p>{type === 'event' ? 'Our events team will reply with ideas and a quote, usually within one working day.' : 'We’ve received your message and will reply by email, usually within one working day.'}</p>
      </div>
    );
  }

  return (
      <form className="s-form" onSubmit={submit}>
        {type === 'event' && (
          <div className="s-form-row three">
            <label>
              <span>Type of event</span>
              <select value={form.eventType} onChange={set('eventType')}>
                {EVENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Preferred date</span>
              <input type="date" min={islandToday()} value={form.eventDate} onChange={set('eventDate')} />
            </label>
            <label>
              <span>Number of guests</span>
              <input type="number" inputMode="numeric" min={1} max={2000} value={form.guests} onChange={set('guests')} placeholder="e.g. 60" />
            </label>
          </div>
        )}
        <div className="s-form-row">
          <label>
            <span>Full name</span>
            <input autoComplete="name" maxLength={200} value={form.name} onChange={set('name')} required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" autoComplete="email" maxLength={254} value={form.email} onChange={set('email')} required />
          </label>
        </div>
        <label>
          <span>
            Phone <em>(optional)</em>
          </span>
          <input type="tel" autoComplete="tel" maxLength={40} value={form.phone} onChange={set('phone')} placeholder="+20 …" />
        </label>
        <label>
          <span>{type === 'event' ? 'Tell us about your event' : 'Your message'}</span>
          <textarea rows={5} maxLength={5000} value={form.message} onChange={set('message')} required placeholder={type === 'event' ? 'Occasion, timing, catering or décor ideas…' : 'How can we help?'} />
        </label>
        <input className="s-hp" tabIndex={-1} autoComplete="off" aria-hidden name="website" value={trap} onChange={(e) => setTrap(e.target.value)} />
        {error && (
          <p className="s-form-note error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="s-btn s-btn-primary s-btn-lg" disabled={busy || !form.name.trim() || !form.email.trim() || !form.message.trim()}>
          {busy ? 'Sending…' : type === 'event' ? 'Send event enquiry' : 'Send message'}
        </button>
        <p className="s-fine">We use your details only to reply to this enquiry.</p>
      </form>
  );
}
