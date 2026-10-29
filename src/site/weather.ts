import { useEffect, useState } from 'react';
import type { LiveWeather } from '../../shared/website';
import { siteFetch } from './api';

const REFRESH_MS = 30 * 60_000;
const RETRY_MS = 60_000;
const MAX_AGE_MS = 6 * 60 * 60_000;
let cached: LiveWeather | null = null;
let checkedAt = -Infinity;
let lastFailed = false;
let inflight: Promise<LiveWeather> | null = null;

function loadWeather(): Promise<LiveWeather> {
  if (inflight) return inflight;
  if (Date.now() - checkedAt < (lastFailed ? RETRY_MS : REFRESH_MS)) {
    return !lastFailed && cached ? Promise.resolve(cached) : Promise.reject(new Error('Weather unavailable'));
  }
  inflight = siteFetch<LiveWeather>('/public/weather', undefined, { signal: AbortSignal.timeout(8000) })
    .then((weather) => { cached = weather; checkedAt = Date.now(); lastFailed = false; return weather; })
    .catch((error: unknown) => { checkedAt = Date.now(); lastFailed = true; throw error; })
    .finally(() => { inflight = null; });
  return inflight;
}

export function useWeather(): { weather: LiveWeather | null; failed: boolean } {
  const [state, setState] = useState({ weather: cached, failed: lastFailed });
  const [clock, setClock] = useState(Date.now);
  useEffect(() => {
    let active = true;
    const load = () => {
      void loadWeather().then(
        (weather) => { if (active) { setState({ weather, failed: false }); setClock(Date.now()); } },
        () => { if (active) { setState({ weather: cached, failed: true }); setClock(Date.now()); } },
      );
    };
    load();
    // Re-evaluate freshness/expiry and retry failures once a minute. Successful requests are
    // shared across widgets and throttled to one per 30 minutes in this browser tab.
    const timer = window.setInterval(load, RETRY_MS);
    const focus = () => { if (document.visibilityState === 'visible') load(); };
    window.addEventListener('focus', focus);
    document.addEventListener('visibilitychange', focus);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('focus', focus); document.removeEventListener('visibilitychange', focus); };
  }, []);
  const value = state.weather;
  const expired = value && (clock - Date.parse(value.updatedAt) >= MAX_AGE_MS || clock - Date.parse(value.fetchedAt) >= MAX_AGE_MS);
  if (!value || expired) return { weather: null, failed: state.failed || !!expired };
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(clock);
  return { weather: { ...value,
    stale: value.stale || state.failed || clock - Date.parse(value.updatedAt) >= REFRESH_MS || clock - Date.parse(value.fetchedAt) >= REFRESH_MS,
    days: value.days.filter((day) => day.date >= today),
  }, failed: false };
}
