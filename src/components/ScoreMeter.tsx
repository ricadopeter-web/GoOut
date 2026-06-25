import { useEffect, useState } from 'react';

interface Props {
  score: number;
  color: string;
  emoji: string;
}

export default function ScoreMeter({ score, color, emoji }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // 数字滚动动画
    const duration = 1200;
    const startTime = Date.now();
    const startScore = animatedScore;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startScore + (score - startScore) * eased);
      setAnimatedScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  // 计算圆环的偏移
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  // 根据分数确定圆环颜色
  const getGradientColors = () => {
    if (score >= 75) return ['#f43f5e', '#ec4899', '#a855f7'];
    if (score >= 50) return ['#f59e0b', '#f97316', '#ef4444'];
    return ['#6b7280', '#8b5cf6', '#6366f1'];
  };

  const gradients = getGradientColors();

  return (
    <div className="score-meter">
      <svg width="240" height="240" viewBox="0 0 240 240">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradients[0]} />
            <stop offset="50%" stopColor={gradients[1]} />
            <stop offset="100%" stopColor={gradients[2]} />
          </linearGradient>
        </defs>
        {/* 背景圆环 */}
        <circle
          cx="120" cy="120" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
        />
        {/* 分数圆环 */}
        <circle
          cx="120" cy="120" r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 120 120)"
          className="score-ring"
        />
        {/* 中心文字 */}
        <text x="120" y="105" textAnchor="middle" className="score-number" fill="white">
          {animatedScore}
        </text>
        <text x="120" y="130" textAnchor="middle" className="score-unit" fill="rgba(255,255,255,0.7)">
          分
        </text>
        <text x="120" y="160" textAnchor="middle" className="score-emoji" fill="white">
          {emoji}
        </text>
      </svg>
    </div>
  );
}
