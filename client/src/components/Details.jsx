import { Thermometer, Droplets, Wind, Gauge, SunMedium, Sunrise, Sunset } from 'lucide-react';
import { temp, wind, clockLabel } from '../utils';

export default function Details({ data, unit }) {
  const c = data.current;
  const d = data.daily;

  const tiles = [
    { Icon: Thermometer, label: 'Feels like', value: `${temp(c.apparent_temperature, unit)}°` },
    { Icon: Droplets, label: 'Humidity', value: `${c.relative_humidity_2m}%` },
    { Icon: Wind, label: 'Wind', value: wind(c.wind_speed_10m, unit) },
    { Icon: Gauge, label: 'Pressure', value: `${Math.round(c.surface_pressure)} hPa` },
    { Icon: SunMedium, label: 'UV index', value: Math.round(d.uv_index_max[0]) },
    { Icon: Sunrise, label: 'Sunrise', value: clockLabel(d.sunrise[0]) },
    { Icon: Sunset, label: 'Sunset', value: clockLabel(d.sunset[0]) },
    { Icon: Droplets, label: 'Rain chance', value: `${d.precipitation_probability_max[0] ?? 0}%` },
  ];

  return (
    <section className="card details">
      {tiles.map(({ Icon, label, value }) => (
        <div className="tile" key={label}>
          <span className="tile-label"><Icon size={14} /> {label}</span>
          <b>{value}</b>
        </div>
      ))}
    </section>
  );
}