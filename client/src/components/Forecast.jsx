import { describeWeather } from '../weatherCodes';
import { temp } from '../utils';

export default function Forecast({ daily, unit }) {
  const weekMin = Math.min(...daily.temperature_2m_min);
  const weekMax = Math.max(...daily.temperature_2m_max);
  const span = weekMax - weekMin || 1;

  return (
    <section className="card span-2">
      <h2>7-day forecast</h2>
      <ul className="days">
        {daily.time.map((date, i) => {
          const { Icon } = describeWeather(daily.weather_code[i]);
          // "T00:00" makes the browser read it as local time (avoids off-by-one-day bugs)
          const day = new Date(`${date}T00:00`).toLocaleDateString('en', { weekday: 'long' });
          const lo = daily.temperature_2m_min[i];
          const hi = daily.temperature_2m_max[i];
          return (
            <li className="day-row" key={date} style={{ animationDelay: `${i * 60}ms` }}>
              <span className="day-name">{i === 0 ? 'Today' : day}</span>
              <Icon size={22} strokeWidth={1.5} />
              <span className="rain">{daily.precipitation_probability_max[i] ?? 0}%</span>
              <span className="muted lo">{temp(lo, unit)}°</span>
              <div className="range">
                <div
                  className="range-fill"
                  style={{ left: `${((lo - weekMin) / span) * 100}%`, width: `${((hi - lo) / span) * 100}%` }}
                />
              </div>
              <b className="hi">{temp(hi, unit)}°</b>
            </li>
          );
        })}
      </ul>
    </section>
  );
}