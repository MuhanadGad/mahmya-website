// "Weather/Card" (Figma 969:6581): compact hero weather card with Default,
// Loading and Unavailable states, fed by the live marine forecast.

import type { WeatherCondition } from '../../../shared/website.ts';
import { useWeather } from '../hooks';
import { MIcon } from './ui';
import { Planned } from './Planned';

const CONDITION_ICON: Record<WeatherCondition, string> = {
  sunny: 'sunny',
  'partly-cloudy': 'partly_cloudy_day',
  cloudy: 'cloud',
  fog: 'foggy',
  rain: 'rainy',
  storm: 'thunderstorm',
};

const CONDITION_LABEL: Record<WeatherCondition, string> = {
  sunny: 'Sunny',
  'partly-cloudy': 'Partly cloudy',
  cloudy: 'Cloudy',
  fog: 'Fog',
  rain: 'Rain',
  storm: 'Thunderstorms',
};

function seaState(wind: number, partialWind: number): string {
  return wind < 20 ? 'Sea calm' : wind < partialWind ? 'Sea moderate' : 'Sea rough';
}

export function WeatherCard() {
  const { weather, failed } = useWeather();

  if (failed) {
    return (
      <div className="s-weather unavailable" role="status">
        <MIcon name="cloud" size={28} />
        <div>
          <p className="s-weather-cond">Weather unavailable</p>
          <p className="s-weather-sub">Check again shortly — the marina confirms sailings each morning.</p>
        </div>
      </div>
    );
  }
  if (!weather) {
    return (
      <div className="s-weather loading" aria-busy="true" aria-label="Loading the island weather">
        <div className="s-skel" style={{ width: '60%', height: 52 }} />
        <div className="s-weather-divider" />
        <div className="s-skel" style={{ width: '100%', height: 84 }} />
      </div>
    );
  }

  const { current, days } = weather;
  const updated = new Date(weather.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Cairo' });
  const suspended = days[0] && days[0].wind >= weather.closeWind;
  return (
    <Planned what="Live weather">
      <section className="s-weather" aria-label="Weather on Mahmya Island">
        <div className="s-weather-today">
          <MIcon name={CONDITION_ICON[current.condition]} className="sun" size={32} label={CONDITION_LABEL[current.condition]} />
          <p className="s-weather-temp">{current.temp}°</p>
          <div className="s-weather-conditions">
            <p className="s-weather-cond">{CONDITION_LABEL[current.condition]}</p>
            <p className="s-weather-sub">
              Wind {current.wind} km/h · {seaState(current.wind, weather.partialWind)}
            </p>
            {suspended && <p className="s-weather-alert">Sailings may be suspended today</p>}
          </div>
          <p className="s-weather-updated">Updated {updated}</p>
        </div>
        <div className="s-weather-divider" />
        <div className="s-weather-forecast">
          {days.slice(1, 7).map((d) => (
            <div key={d.date} className="s-weather-day">
              <p className="s-weather-dow">{new Date(`${d.date}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })}</p>
              <MIcon name={CONDITION_ICON[d.condition]} size={24} label={CONDITION_LABEL[d.condition]} />
              <p className="s-weather-max">{d.tempMax}°</p>
              <p className="s-weather-min">{d.tempMin}°</p>
            </div>
          ))}
        </div>
      </section>
    </Planned>
  );
}
