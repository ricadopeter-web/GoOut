import { useState, type FormEvent } from 'react';

interface Props {
  onSearch: (city: string) => void;
  onDetect: () => void;
  loading: boolean;
}

export default function LocationInput({ onSearch, onDetect, loading }: Props) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) onSearch(city.trim());
  };

  return (
    <div className="location-input">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="输入城市名，如：北京、东京、London..."
            disabled={loading}
            className="city-input"
          />
        </div>
        <button type="submit" disabled={loading || !city.trim()} className="btn btn-primary">
          查询
        </button>
        <button type="button" onClick={onDetect} disabled={loading} className="btn btn-secondary">
          📡 自动定位
        </button>
      </form>
    </div>
  );
}
