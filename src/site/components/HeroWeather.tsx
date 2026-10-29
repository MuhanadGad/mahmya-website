// Today's weather on the homepage hero (Figma 275:9509, "Frame 152"): place,
// temperature, conditions, wind and sea state from the live marine forecast.

import type { WeatherCondition } from '../../../shared/website.ts';
import { useWeather } from '../hooks';
import pin from '../../assets/home/v2/location-dot.svg';
import { Planned } from './Planned';

const EMOJI: Record<WeatherCondition, string> = { sunny: '☀️', 'partly-cloudy': '⛅', cloudy: '☁️', fog: '🌫️', rain: '🌧️', storm: '⛈️' };
const LABEL: Record<WeatherCondition, string> = { sunny: 'Sunny', 'partly-cloudy': 'Partly cloudy', cloudy: 'Cloudy', fog: 'Fog', rain: 'Rain', storm: 'Thunderstorms' };
const seaState = (kmh: number, partialWind: number) => (kmh < 20 ? 'Sea Calm' : kmh < partialWind ? 'Sea Moderate' : 'Sea Rough');

export function HeroWeather() {
  const { weather, failed } = useWeather();
  const now = weather?.current;
  return (
    <Planned what="Live weather">
      <aside className="h-hweather" aria-label="Today’s weather in Hurghada" aria-busy={!weather && !failed}>
        <div className="h-hweather-place">
          <p className="h-hweather-label">Today’s Weather</p>
          <p className="h-hweather-city">
            <img src={pin} alt="" width={16} height={21} />
            Hurghada
          </p>
        </div>
        <div className="h-hweather-now">
          {now ? (
            <>
              <span className="h-hweather-emoji" role="img" aria-label={LABEL[now.condition]}>
                {EMOJI[now.condition]}
              </span>
              <span className="h-hweather-temp">{now.temp}°C</span>
              <span className="h-hweather-cond">{LABEL[now.condition]}</span>
              <span className="h-hweather-meta">
                Wind {now.wind} km/h · {seaState(now.wind, weather.partialWind)}
              </span>
            </>
          ) : (
            <span className="h-hweather-meta">{failed ? 'Forecast unavailable' : 'Loading…'}</span>
          )}
        </div>
      </aside>
    </Planned>
  );
}
