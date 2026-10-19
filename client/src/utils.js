
export const temp = (c, unit) => Math.round(unit === 'F' ? (c * 9) / 5 + 32 : c);
export const wind = (kmh, unit) =>
  unit === 'F' ? `${Math.round(kmh * 0.621371)} mph` : `${Math.round(kmh)} km/h`;


export const hourLabel = (iso) =>
  new Date(iso).toLocaleTimeString('en', { hour: 'numeric' });
export const clockLabel = (iso) =>
  new Date(iso).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' });