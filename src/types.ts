export interface WeatherData {
  temp: number;
  humidity: number;
  weatherDesc: string;
  weatherCode: number;
  windSpeed: number; // km/h
  feelsLike: number;
  visibility: number;
}

export interface LocationInfo {
  city: string;
  country: string;
}

export interface UserPreferences {
  mood: number; // 1-10
  hasUmbrella: boolean;
  hasCar: boolean;
}

export interface ScoreFactors {
  temperature: FactorScore;
  weather: FactorScore;
  wind: FactorScore;
  humidity: FactorScore;
  timeOfDay: FactorScore;
  dayOfWeek: FactorScore;
  userMood: FactorScore;
}

export interface FactorScore {
  score: number;
  label: string;
  description: string;
  weight: number;
}

export interface GoOutResult {
  overallScore: number;
  factors: ScoreFactors;
  recommendation: string;
  emoji: string;
  badge: string;
  color: string;
}
