import type { GoOutResult } from '../types';

interface Props {
  result: GoOutResult;
}

export default function Recommendation({ result }: Props) {
  return (
    <div className="recommendation" style={{ borderColor: result.color }}>
      <div className="rec-badge" style={{ background: result.color }}>
        {result.emoji} {result.badge}
      </div>
      <p className="rec-text">{result.recommendation}</p>
    </div>
  );
}
