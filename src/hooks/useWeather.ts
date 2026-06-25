import { useState, useCallback } from 'react';
import type { WeatherData, LocationInfo } from '../types';
import { fetchWeatherByCity, fetchWeatherByCoords, detectLocationByIP } from '../api/weather';

interface UseWeatherReturn {
  weather: WeatherData | null;
  location: LocationInfo | null;
  loading: boolean;
  error: string | null;
  searchCity: (city: string) => Promise<void>;
  detectLocation: () => Promise<void>;
}

export function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCity = useCallback(async (city: string) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data.weather);
      setLocation(data.location);
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败');
      setWeather(null);
      setLocation(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const detectLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 先尝试浏览器定位
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false,
            });
          });
          const data = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
          setWeather(data.weather);
          setLocation(data.location);
          return;
        } catch {
          // 浏览器定位失败，回退到 IP 定位
        }
      }

      // 通过 IP 定位
      const ipData = await detectLocationByIP();
      const data = await fetchWeatherByCoords(ipData.lat, ipData.lon);
      setWeather(data.weather);
      setLocation(data.location);
    } catch (err) {
      setError(err instanceof Error ? err.message : '定位失败，请手动输入城市');
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, location, loading, error, searchCity, detectLocation };
}
