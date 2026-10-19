import { describeWeather } from '../weatherCodes';
import { temp, hourLabel } from '../utils';

export default function Hourly({ hourly, now, unit }) {
  const start = Math.max(0, hourly.time.findIndex((t) => t >= now.slice(0, 13) + ':00'));
  const hours = hourly.time.slice(start, start + 24);

  return (
    <section className="card span-2">
      <h2>Next 24 hours</h2>
      <div className="hourly">
        {hours.map((t, k) => {
          const i = start + k;
          const { Icon } = describeWeather(hourly.weather_code[i], hourly.is_day[i]);
          return (
            <div className="hour" key={t}>
              <span className="muted">{k === 0 ? 'Now' : hourLabel(t)}</span>
              <Icon size={26} strokeWidth={1.5} />
              <b>{temp(hourly.temperature_2m[i], unit)}°</b>
              <span className="rain">{hourly.precipitation_probability[i] ?? 0}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}