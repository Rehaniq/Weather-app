const BASE = '/api';

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.status === 204 ? null : res.json();
}

export async function searchCities(q) {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', q);
  url.searchParams.set('count', '5');
  url.searchParams.set('language', 'en');

  const res = await fetch(url);
  if (!res.ok) throw new Error('City search failed');
  const data = await res.json();

  return (data.results ?? []).map((r) => ({
    name: r.name,
    country: r.country,
    region: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export async function getWeather(lat, lon) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
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
  url.searchParams.set('timezone', 'auto');

  const res = await fetch(url);
  if (res.status === 429) throw new Error('Weather service is busy. Please try again in a minute.');
  if (!res.ok) throw new Error(`Forecast request failed (${res.status})`);
  return res.json();
}
export const getFavorites = () => request('/favorites');
export const addFavorite = (city) =>
  request('/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(city),
  });
export const removeFavorite = (id) => request(`/favorites/${id}`, { method: 'DELETE' });