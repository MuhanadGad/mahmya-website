// Website → mahmya-back API calls. Same origin in development (Vite proxies /api);
// set VITE_API_URL when the API lives on another origin.
//
// Catalog and enquiry/newsletter submissions are connected. Other calls (bookings,
// availability and visit counts) fail fast with
// NOT_LIVE, and its screen is shown as a dimmed preview (components/Planned.tsx).

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

const LIVE_PATHS = ['/public/catalog', '/public/enquiries', '/public/subscribe', '/public/weather'];

export const NOT_LIVE = 501;

export const isLive = (path: string) => LIVE_PATHS.includes(path.split('?')[0]);

export class SiteApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function siteFetch<T>(path: string, body?: unknown, options: { signal?: AbortSignal } = {}): Promise<T> {
  if (!isLive(path)) throw new SiteApiError(NOT_LIVE, 'This isn’t connected yet — it’s a preview of what’s coming.');
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      signal: options.signal,
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'same-origin', // guests have no sessions
    });
  } catch {
    throw new SiteApiError(0, 'We couldn’t reach Mahmya right now. Check your connection and try again.');
  }
  // mahmya-back errors are { error: { code, message } }.
  const data = (await res.json().catch(() => ({}))) as { error?: { message?: string; issues?: { path?: (string | number)[]; message?: string }[] } };
  if (!res.ok) throw new SiteApiError(res.status, data.error?.issues?.map((issue) => `${issue.path?.join('.') || 'Input'}: ${issue.message}`).join(' · ') || data.error?.message || 'Something went wrong. Please try again.');
  return data as T;
}

const counted = new Set<string>();

/** Anonymous counts only (no cookies, no identifiers). Visits are counted once per browser session, the rest once per page load. */
export function track(event: 'visits' | 'booking_started'): void {
  if (!isLive('/public/track')) return; // no website analytics on the backend yet
  if (counted.has(event)) return;
  counted.add(event);
  try {
    if (event === 'visits') {
      if (sessionStorage.getItem('mahmya:visit')) return;
      sessionStorage.setItem('mahmya:visit', '1');
    }
  } catch {
    // Storage blocked: still count, at most once per page load.
  }
  void siteFetch('/public/track', { event }).catch(() => undefined);
}
