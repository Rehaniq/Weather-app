import { useEffect, useState } from 'react';
import { LocateFixed, CloudSun, AlertTriangle } from 'lucide-react';
import './App.css';
import * as api from './api';
import { describeWeather } from './weatherCodes';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Details from './components/Details';
import Hourly from './components/Hourly';
import Forecast from './components/Forecast';
import Favorites from './components/Favorites';
import Skeleton from './components/Skeleton';

const DEFAULT_CITY = { name: 'London', country: 'United Kingdom', latitude: 51.5072, longitude: -0.1276 };

export default function App() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Lazy initial state: reads localStorage once, so the choice survives refresh
  const [unit, setUnit] = useState(() => localStorage.getItem('unit') || 'C');

  useEffect(() => { localStorage.setItem('unit', unit); }, [unit]);

  useEffect(() => {
    api.getFavorites().then(setFavorites).catch(() => { });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    api
      .getWeather(city.latitude, city.longitude)
      .then((data) => !cancelled && setWeather(data))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [city]);

  const saved = favorites.find(
    (f) => f.latitude === city.latitude && f.longitude === city.longitude
  );

  async function toggleFavorite() {
    try {
      if (saved) {
        await api.removeFavorite(saved.id);
        setFavorites((l) => l.filter((f) => f.id !== saved.id));
      } else {
        const created = await api.addFavorite(city);
        setFavorites((l) => [created, ...l.filter((f) => f.id !== created.id)]);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function removeFav(id) {
    await api.removeFavorite(id);
    setFavorites((l) => l.filter((f) => f.id !== id));
  }

  function locate() {
    if (!navigator.geolocation) return setError('Geolocation is not supported by this browser.');
    navigator.geolocation.getCurrentPosition(
      (p) =>
        setCity({
          name: 'My location',
          country: '',
          latitude: +p.coords.latitude.toFixed(4),
          longitude: +p.coords.longitude.toFixed(4),
        }),
      () => setError('Location permission was denied.')
    );
  }

  const theme = weather
    ? describeWeather(weather.current.weather_code, weather.current.is_day).theme
    : 'cloudy';

  return (
    <div className={`app theme-${theme}`}>
      <div className="particles" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 10) * 0.3}s` }} />
        ))}
      </div>

      <main>
        <header className="topbar">
          <div className="brand"><CloudSun size={22} /> Skycast</div>
          <SearchBar onSelect={setCity} />
          <button className="icon-btn" onClick={locate} aria-label="Use my location" title="Use my location">
            <LocateFixed size={20} />
          </button>
          <div className="seg" role="group" aria-label="Units">
            {['C', 'F'].map((u) => (
              <button key={u} className={unit === u ? 'on' : ''} onClick={() => setUnit(u)}>°{u}</button>
            ))}
          </div>
        </header>

        <Favorites items={favorites} onSelect={setCity} onRemove={removeFav} />

        {error && <div className="error"><AlertTriangle size={16} /> {error}</div>}

        {!weather && loading && <Skeleton />}

        {weather && (
          <div className={`layout ${loading ? 'is-loading' : ''}`}>
            <CurrentWeather city={city} data={weather} unit={unit} isFavorite={!!saved} onToggleFavorite={toggleFavorite} />
            <Details data={weather} unit={unit} />
            <Hourly hourly={weather.hourly} now={weather.current.time} unit={unit} />
            <Forecast daily={weather.daily} unit={unit} />
          </div>
        )}
      </main>
    </div>
  );
}