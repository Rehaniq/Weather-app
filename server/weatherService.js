const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';


const cache = new Map();
const FORECAST_TTL = 10 * 60 * 1000;
const GEO_TTL = 24 * 60 * 60 * 1000;
function getCached(key) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;
  cache.delete(key);
  return null;
}

function setCached(key, data, ttl) {
  cache.set(key, { data, expires: Date.now() + ttl });
}

async function failWith(res, what) {
  const body = await res.text().catch(() => '');
  console.error(`Open-Meteo ${what} error`, res.status, body.slice(0, 300));
  throw new Error(
    res.status === 429
      ? 'Weather service is busy. Please try again in a minute.'
      : `${what} request failed (${res.status})`
  );
}

export async function searchCities(query) {
  const key = `geo:${query.toLowerCase()}`;
  const cached = getCached(key);
  if (cached) return cached;

  const url = new URL(GEO_URL);
  url.searchParams.set('name', query);
  url.searchParams.set('count', '5');
  url.searchParams.set('language', 'en');

  const res = await fetch(url); // fetch is built into Node 18+
  if (!res.ok) await failWith(res, 'Geocoding');
  const data = await res.json();

  const cities = (data.results ?? []).map((r) => ({
    name: r.name,
    country: r.country,
    region: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));

  setCached(key, cities, GEO_TTL);
  return cities;
}

export async function getForecast(lat, lon) {
  const key = `fc:${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = getCached(key);
  if (cached) return cached;

  const url = new URL(FORECAST_URL);
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code,is_day'
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max'
  );
  url.searchParams.set('hourly', 'temperature_2m,weather_code,precipitation_probability,is_day');
  url.searchParams.set('forecast_days', '7');
  url.searchParams.set('timezone', 'auto'); // times in the city's own timezone

  const res = await fetch(url);
  if (!res.ok) await failWith(res, 'Forecast');

  const data = await res.json();
  setCached(key, data, FORECAST_TTL);
  return data;
}