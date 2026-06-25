import type { WeatherData, LocationInfo } from '../types';

const WTTR_BASE = 'https://wttr.in';

export async function fetchWeatherByCity(city: string): Promise<{ weather: WeatherData; location: LocationInfo }> {
  const url = `${WTTR_BASE}/${encodeURIComponent(city)}?format=j1&lang=zh`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`天气查询失败 (${res.status})`);
  const data = await res.json();
  return parseWttrResponse(data);
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<{ weather: WeatherData; location: LocationInfo }> {
  const url = `${WTTR_BASE}/${lat},${lon}?format=j1&lang=zh`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`天气查询失败 (${res.status})`);
  const data = await res.json();
  return parseWttrResponse(data);
}

function parseWttrResponse(data: any): { weather: WeatherData; location: LocationInfo } {
  const current = data.current_condition?.[0];
  if (!current) throw new Error('无法解析天气数据');

  const area = data.nearest_area?.[0];
  const location: LocationInfo = {
    city: area?.areaName?.[0]?.value || '未知',
    country: area?.country?.[0]?.value || '未知',
  };

  const weather: WeatherData = {
    temp: Number(current.temp_C) || 0,
    humidity: Number(current.humidity) || 0,
    weatherDesc: current.weatherDesc?.[0]?.value || current.lang_zh?.[0]?.value || '未知',
    weatherCode: Number(current.weatherCode) || 0,
    windSpeed: Number(current.windspeedKmph) || 0,
    feelsLike: Number(current.FeelsLikeC) || Number(current.temp_C) || 0,
    visibility: Number(current.visibility) || 0,
  };

  return { weather, location };
}

export async function detectLocationByIP(): Promise<{ lat: number; lon: number; city: string }> {
  const res = await fetch('https://ipapi.co/json/');
  if (!res.ok) throw new Error('无法自动定位');
  const data = await res.json();
  return { lat: data.latitude, lon: data.longitude, city: data.city };
}

// 天气代码映射到中文描述
export const WEATHER_CODE_MAP: Record<number, { label: string; emoji: string }> = {
  113: { label: '晴', emoji: '☀️' },
  116: { label: '多云', emoji: '⛅' },
  119: { label: '阴', emoji: '☁️' },
  122: { label: '阴', emoji: '☁️' },
  143: { label: '雾', emoji: '🌫️' },
  176: { label: '小雨', emoji: '🌦️' },
  179: { label: '小雪', emoji: '🌨️' },
  182: { label: '雨夹雪', emoji: '🌨️' },
  185: { label: '冻雨', emoji: '🌨️' },
  200: { label: '雷阵雨', emoji: '⛈️' },
  227: { label: '小雪', emoji: '🌨️' },
  230: { label: '中雪', emoji: '❄️' },
  248: { label: '雾', emoji: '🌫️' },
  260: { label: '大雾', emoji: '🌫️' },
  263: { label: '毛毛雨', emoji: '🌦️' },
  266: { label: '毛毛雨', emoji: '🌦️' },
  281: { label: '冻毛毛雨', emoji: '🌧️' },
  284: { label: '冻毛毛雨', emoji: '🌧️' },
  293: { label: '小雨', emoji: '🌦️' },
  296: { label: '小雨', emoji: '🌦️' },
  299: { label: '中雨', emoji: '🌧️' },
  302: { label: '中雨', emoji: '🌧️' },
  305: { label: '大雨', emoji: '🌧️' },
  308: { label: '暴雨', emoji: '🌊' },
  311: { label: '冻雨', emoji: '🌧️' },
  314: { label: '冻雨', emoji: '🌧️' },
  317: { label: '雨夹雪', emoji: '🌨️' },
  320: { label: '雨夹雪', emoji: '🌨️' },
  323: { label: '小雪', emoji: '🌨️' },
  326: { label: '小雪', emoji: '🌨️' },
  329: { label: '中雪', emoji: '❄️' },
  332: { label: '中雪', emoji: '❄️' },
  335: { label: '大雪', emoji: '❄️' },
  338: { label: '暴雪', emoji: '❄️' },
  350: { label: '冰雹', emoji: '🧊' },
  353: { label: '阵雨', emoji: '🌦️' },
  356: { label: '中阵雨', emoji: '🌧️' },
  359: { label: '大阵雨', emoji: '🌧️' },
  362: { label: '阵雨夹雪', emoji: '🌨️' },
  365: { label: '阵雨夹雪', emoji: '🌨️' },
  368: { label: '小阵雪', emoji: '🌨️' },
  371: { label: '大阵雪', emoji: '❄️' },
  374: { label: '冰雹', emoji: '🧊' },
  377: { label: '冰雹', emoji: '🧊' },
  386: { label: '雷阵雨', emoji: '⛈️' },
  389: { label: '大雷雨', emoji: '⛈️' },
  392: { label: '雷阵雪', emoji: '⛈️' },
  395: { label: '大雷雪', emoji: '⛈️' },
};
