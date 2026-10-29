// Today's model-based weather for Mahmya Island, served through mahmya-back.
import type { WeatherCondition } from '../../../shared/website';
import { useWeather } from '../hooks';
import pin from '../../assets/home/v2/location-dot.svg';

const EMOJI: Record<WeatherCondition, string> = { sunny: '☀️', 'partly-cloudy': '⛅', cloudy: '☁️', fog: '🌫️', rain: '🌧️', snow: '❄️', storm: '⛈️' };
const LABEL: Record<WeatherCondition, string> = { sunny: 'Sunny', 'partly-cloudy': 'Partly cloudy', cloudy: 'Cloudy', fog: 'Fog', rain: 'Rain', snow: 'Snow', storm: 'Thunderstorms' };

export function HeroWeather() {
  const { weather, failed } = useWeather();
  const now = weather?.current;
  const clearNight = now && now.condition === 'sunny' && !now.isDay;
  const label = now ? clearNight ? 'Clear' : LABEL[now.condition] : '';
  return <aside className="h-hweather" aria-label="Today’s weather on Mahmya Island" aria-busy={!weather && !failed}>
    <div className="h-hweather-place">
      <p className="h-hweather-label">Today’s Weather</p>
      <p className="h-hweather-city"><img src={pin} alt="" width={16} height={21} />Mahmya Island</p>
    </div>
    <div className="h-hweather-now">
      {now ? <>
        <span className="h-hweather-emoji" role="img" aria-label={label}>{clearNight ? '🌙' : EMOJI[now.condition]}</span>
        <span className="h-hweather-temp">{now.temp}°C</span>
        <span className="h-hweather-cond">{label}</span>
        <span className="h-hweather-meta">Wind {now.wind} km/h</span>
      </> : <span className="h-hweather-meta" role="status">{failed ? 'Weather unavailable' : 'Loading weather…'}</span>}
    </div>
  </aside>;
}
