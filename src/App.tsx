import { useState, useEffect, useCallback } from 'react';
import { useWeather } from './hooks/useWeather';
import { calculateGoOutScore } from './utils/score';
import type { UserPreferences, GoOutResult } from './types';
import LocationInput from './components/LocationInput';
import WeatherDisplay from './components/WeatherDisplay';
import MoodSelector from './components/MoodSelector';
import ScoreMeter from './components/ScoreMeter';
import Recommendation from './components/Recommendation';
import FactorBreakdown from './components/FactorBreakdown';
import './App.css';

export default function App() {
  const { weather, location, loading, error, searchCity, detectLocation } = useWeather();
  const [preferences, setPreferences] = useState<UserPreferences>({
    mood: 7,
    hasUmbrella: false,
    hasCar: false,
  });
  const [result, setResult] = useState<GoOutResult | null>(null);
  const [autoDetected, setAutoDetected] = useState(false);

  // 页面加载时自动定位
  useEffect(() => {
    if (!autoDetected && !weather) {
      detectLocation().then(() => setAutoDetected(true)).catch(() => setAutoDetected(true));
    }
  }, []);

  // 天气或偏好变化时重新计算
  useEffect(() => {
    if (weather) {
      const r = calculateGoOutScore(weather, preferences);
      setResult(r);
    }
  }, [weather, preferences]);

  const handleSearch = useCallback((city: string) => {
    searchCity(city);
  }, [searchCity]);

  return (
    <div className="app">
      {/* 背景动态效果 */}
      <div className="bg-effects">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <header className="app-header">
        <h1>
          <span className="header-icon">🌤️</span>
          出门适宜度计算器
          <span className="header-subtitle">今天适合出门吗？</span>
        </h1>
      </header>

      <main className="app-main">
        <section className="card search-section">
          <LocationInput onSearch={handleSearch} onDetect={detectLocation} loading={loading} />
        </section>

        {error && (
          <section className="card error-card">
            <p className="error-text">⚠️ {error}</p>
          </section>
        )}

        {loading && (
          <section className="card loading-card">
            <div className="loading-spinner">
              <div className="spinner" />
              <p>正在获取天气数据...</p>
            </div>
          </section>
        )}

        {weather && location && (
          <>
            <section className="card weather-section">
              <WeatherDisplay weather={weather} location={location} />
            </section>

            <section className="card mood-section">
              <MoodSelector preferences={preferences} onChange={setPreferences} />
            </section>

            {result && (
              <>
                <section className="card result-section">
                  <h2 className="result-title">出门适宜度</h2>
                  <ScoreMeter score={result.overallScore} color={result.color} emoji={result.emoji} />
                  <Recommendation result={result} />
                </section>

                <section className="card factors-section">
                  <FactorBreakdown result={result} />
                </section>

                <section className="card share-section">
                  <p className="share-hint">💡 调整上方的心情和选项，看看评分怎么变！</p>
                </section>
              </>
            )}
          </>
        )}

        {!loading && !error && !weather && (
          <section className="card welcome-card">
            <div className="welcome-content">
              <span className="welcome-emoji">🌤️</span>
              <h2>想知道今天适不适合出门？</h2>
              <p>输入城市名或点击自动定位，结合天气、时间、心情，给你一个科学的出门建议！</p>
              <div className="welcome-features">
                <div className="feature">
                  <span>🌡️</span>
                  <span>实时天气分析</span>
                </div>
                <div className="feature">
                  <span>😊</span>
                  <span>心情调节因子</span>
                </div>
                <div className="feature">
                  <span>🎯</span>
                  <span>智能评分算法</span>
                </div>
                <div className="feature">
                  <span>✨</span>
                  <span>趣味推荐语</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by wttr.in & React · 数据仅供参考，出门开心最重要 😄</p>
      </footer>
    </div>
  );
}
