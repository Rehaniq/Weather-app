import {
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog,
  CloudDrizzle, CloudRain, CloudSnow, CloudLightning, Thermometer,
} from 'lucide-react';

export function describeWeather(code, isDay = 1) {
  if (code === 0) return { label: 'Clear sky', Icon: isDay ? Sun : Moon, theme: isDay ? 'sunny' : 'night' };
  if ([1, 2].includes(code)) return { label: 'Partly cloudy', Icon: isDay ? CloudSun : CloudMoon, theme: isDay ? 'cloudy' : 'night' };
  if (code === 3) return { label: 'Overcast', Icon: Cloud, theme: 'cloudy' };
  if ([45, 48].includes(code)) return { label: 'Fog', Icon: CloudFog, theme: 'cloudy' };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', Icon: CloudDrizzle, theme: 'rainy' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Rain', Icon: CloudRain, theme: 'rainy' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snow', Icon: CloudSnow, theme: 'snowy' };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', Icon: CloudLightning, theme: 'stormy' };
  return { label: 'Unknown', Icon: Thermometer, theme: 'cloudy' };
}