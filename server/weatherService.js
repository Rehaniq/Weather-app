const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query) {
  const url = new URL(GEO_URL);
  url.searchParams.set('name', query);
  url.searchParams.set('count', '5');
  url.searchParams.set('language', 'en');

  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding request failed');
  const data = await res.json();

  // Open-Meteo omits "results" when nothing matches, so default to []
  return (data.results ?? []).map((r) => ({
    name: r.name,
    country: r.country,
    region: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

// Coordinates -> current weather + 7-day forecast
export async function getForecast(lat, lon) {
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
  url.searchParams.set('timezone', 'auto');


  const res = await fetch(url);
  if (!res.ok) throw new Error('Forecast request failed');
  return res.json();
}