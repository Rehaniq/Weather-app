import { Star, MapPin } from 'lucide-react';
import { describeWeather } from '../weatherCodes';
import { temp } from '../utils';

export default function CurrentWeather({ city, data, unit, isFavorite, onToggleFavorite }) {
  const c = data.current;
  const today = data.daily;
  const { label, Icon } = describeWeather(c.weather_code, c.is_day);

  return (
    <section className="card current">
      <div className="current-top">
        <div>
          <h1>{city.name}</h1>
          <p className="muted place">
            <MapPin size={14} />
            {[city.region, city.country].filter(Boolean).join(', ') || 'Current location'}
          </p>
        </div>
        <button
          className={`icon-btn ${isFavorite ? 'on' : ''}`}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Star size={22} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="temp-row">
        <Icon size={84} strokeWidth={1.25} className="hero-icon float" />
        <div className="temp">{temp(c.temperature_2m, unit)}<sup>°{unit}</sup></div>
      </div>

      <p className="label">{label}</p>
      <p className="muted">
        H: {temp(today.temperature_2m_max[0], unit)}° &nbsp; L: {temp(today.temperature_2m_min[0], unit)}°
      </p>
    </section>
  );
}