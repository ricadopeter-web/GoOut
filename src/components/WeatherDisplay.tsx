import type { WeatherData, LocationInfo } from '../types';
import { WEATHER_CODE_MAP } from '../api/weather';

interface Props {
  weather: WeatherData;
  location: LocationInfo;
}

export default function WeatherDisplay({ weather, location }: Props) {
  const weatherInfo = WEATHER_CODE_MAP[weather.weatherCode] || { label: weather.weatherDesc, emoji: '🌤️' };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <span className="weather-emoji-big">{weatherInfo.emoji}</span>
        <div className="weather-location">
          <h2>{location.city}</h2>
          <span className="country">{location.country}</span>
        </div>
      </div>

      <div className="weather-main">
        <span className="weather-temp">{weather.temp}°C</span>
        <span className="weather-desc">{weatherInfo.label}</span>
        <span className="weather-feels">体感 {weather.feelsLike}°C</span>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-icon">💨</span>
          <div>
            <span className="detail-value">{weather.windSpeed} km/h</span>
            <span className="detail-label">风速</span>
          </div>
        </div>
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <div>
            <span className="detail-value">{weather.humidity}%</span>
            <span className="detail-label">湿度</span>
          </div>
        </div>
        <div className="detail-item">
          <span className="detail-icon">👁️</span>
          <div>
            <span className="detail-value">{weather.visibility} km</span>
            <span className="detail-label">能见度</span>
          </div>
        </div>
      </div>
    </div>
  );
}
