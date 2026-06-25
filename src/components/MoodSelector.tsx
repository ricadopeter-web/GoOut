import type { UserPreferences } from '../types';

interface Props {
  preferences: UserPreferences;
  onChange: (prefs: UserPreferences) => void;
}

const MOOD_EMOJIS = ['😢', '😔', '😐', '🙂', '😊', '😄', '🤩', '🥳'];
const MOOD_LABELS = ['很差', '低落', '还行', '凑合', '不错', '挺好', '超好', '爆棚'];

export default function MoodSelector({ preferences, onChange }: Props) {
  return (
    <div className="mood-selector">
      <h3>你的状态</h3>

      <div className="mood-slider-group">
        <label>今天心情如何？</label>
        <div className="mood-slider">
          <input
            type="range"
            min="1"
            max="10"
            value={preferences.mood}
            onChange={e => onChange({ ...preferences, mood: Number(e.target.value) })}
          />
          <div className="mood-indicator">
            <span className="mood-emoji">{MOOD_EMOJIS[Math.floor((preferences.mood - 1) / 10 * MOOD_EMOJIS.length)]}</span>
            <span className="mood-label">{MOOD_LABELS[Math.floor((preferences.mood - 1) / 10 * MOOD_LABELS.length)]}</span>
          </div>
        </div>
      </div>

      <div className="extra-options">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={preferences.hasUmbrella}
            onChange={e => onChange({ ...preferences, hasUmbrella: e.target.checked })}
          />
          <span>☂️ 我带了伞</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={preferences.hasCar}
            onChange={e => onChange({ ...preferences, hasCar: e.target.checked })}
          />
          <span>🚗 我有车</span>
        </label>
      </div>
    </div>
  );
}
