import type { GoOutResult } from '../types';

interface Props {
  result: GoOutResult;
}

function FactorBar({ label, desc, score, weight }: { label: string; desc: string; score: number; weight: number }) {
  const barColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';

  return (
    <div className="factor-bar-item">
      <div className="factor-bar-header">
        <div className="factor-bar-left">
          <span className="factor-label">{label}</span>
          {weight > 0 && <span className="factor-weight">权重 {weight}%</span>}
        </div>
        <span className="factor-score" style={{ color: barColor }}>{score}</span>
      </div>
      <div className="factor-bar-track">
        <div
          className="factor-bar-fill"
          style={{ width: `${score}%`, background: barColor }}
        />
      </div>
      <p className="factor-desc">{desc}</p>
    </div>
  );
}

export default function FactorBreakdown({ result }: Props) {
  const factors = result.factors;

  // 只在桌面展开所有项目，或者用折叠？

  return (
    <div className="factor-breakdown">
      <h3>📊 详细评分</h3>
      <div className="factor-bars">
        <FactorBar label="🌡️ 温度" desc={factors.temperature.description} score={factors.temperature.score} weight={factors.temperature.weight} />
        <FactorBar label="⛅ 天气" desc={factors.weather.description} score={factors.weather.score} weight={factors.weather.weight} />
        <FactorBar label="💨 风力" desc={factors.wind.description} score={factors.wind.score} weight={factors.wind.weight} />
        <FactorBar label="💧 湿度" desc={factors.humidity.description} score={factors.humidity.score} weight={factors.humidity.weight} />
        <FactorBar label="⏰ 时段" desc={factors.timeOfDay.description} score={factors.timeOfDay.score} weight={factors.timeOfDay.weight} />
        <FactorBar label="📅 日子" desc={factors.dayOfWeek.description} score={factors.dayOfWeek.score} weight={factors.dayOfWeek.weight} />
        <FactorBar label="😊 心情" desc={factors.userMood.description} score={factors.userMood.score} weight={0} />
      </div>
    </div>
  );
}
