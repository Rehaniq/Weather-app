const BASE = '/api';

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.status === 204 ? null : res.json();
}

export const searchCities = (q) => request(`/geocode?q=${encodeURIComponent(q)}`);
export const getWeather = (lat, lon) => request(`/weather?lat=${lat}&lon=${lon}`);
export const getFavorites = () => request('/favorites');
export const addFavorite = (city) =>
  request('/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(city),
  });
export const removeFavorite = (id) => request(`/favorites/${id}`, { method: 'DELETE' });