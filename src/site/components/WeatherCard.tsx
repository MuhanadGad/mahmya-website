// Compact current weather and seven-day forecast, shared with the homepage widget.
import type { WeatherCondition } from '../../../shared/website';
import { useWeather } from '../hooks';
import { MIcon } from './ui';

const CONDITION_ICON: Record<WeatherCondition, string> = { sunny: 'sunny', 'partly-cloudy': 'partly_cloudy_day', cloudy: 'cloud', fog: 'foggy', rain: 'rainy', snow: 'cloud', storm: 'thunderstorm' };
const CONDITION_LABEL: Record<WeatherCondition, string> = { sunny: 'Sunny', 'partly-cloudy': 'Partly cloudy', cloudy: 'Cloudy', fog: 'Fog', rain: 'Rain', snow: 'Snow', storm: 'Thunderstorms' };

export function WeatherCard() {
  const { weather, failed } = useWeather();
  if (failed) return <div className="s-weather unavailable" role="status">
    <MIcon name="cloud" size={28} /><div><p className="s-weather-cond">Weather unavailable</p>
      <p className="s-weather-sub">Check again shortly.</p></div>
  </div>;
  if (!weather) return <div className="s-weather loading" aria-busy="true" aria-label="Loading the island weather">
    <div className="s-skel" style={{ width: '60%', height: 52 }} /><div className="s-weather-divider" /><div className="s-skel" style={{ width: '100%', height: 84 }} />
  </div>;
  const { current, days } = weather;
  const clearNight = current.condition === 'sunny' && !current.isDay;
  const forecast = days.filter((day) => day.date > new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(new Date())).slice(0, 6);
  return <section className="s-weather" aria-label="Weather on Mahmya Island">
    <div className="s-weather-today">
      {clearNight || current.condition === 'snow' ? <span role="img" aria-label={clearNight ? 'Clear' : 'Snow'} style={{ fontSize: 32 }}>{clearNight ? '🌙' : '❄️'}</span>
        : <MIcon name={CONDITION_ICON[current.condition]} className="sun" size={32} label={CONDITION_LABEL[current.condition]} />}
      <p className="s-weather-temp">{current.temp}°</p>
      <div className="s-weather-conditions"><p className="s-weather-cond">{clearNight ? 'Clear' : CONDITION_LABEL[current.condition]}</p>
        <p className="s-weather-sub">Wind {current.wind} km/h</p></div>
    </div>
    <div className="s-weather-divider" />
    <div className="s-weather-forecast">{forecast.map((day) => <div key={day.date} className="s-weather-day">
      <p className="s-weather-dow">{new Date(`${day.date}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'Africa/Cairo' })}</p>
      {day.condition === 'snow' ? <span role="img" aria-label="Snow">❄️</span> : <MIcon name={CONDITION_ICON[day.condition]} size={24} label={CONDITION_LABEL[day.condition]} />}
      <p className="s-weather-max">{day.tempMax}°</p><p className="s-weather-min">{day.tempMin}°</p>
    </div>)}</div>
  </section>;
}
