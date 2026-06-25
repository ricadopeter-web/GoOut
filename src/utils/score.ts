import type { WeatherData, UserPreferences, ScoreFactors, FactorScore, GoOutResult } from '../types';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function scoreTemperature(temp: number): FactorScore {
  let score: number;
  let label: string;
  let description: string;

  if (temp >= 18 && temp <= 28) {
    score = 100;
    label = '完美 🌡️';
    description = '温度宜人，穿啥都舒服';
  } else if (temp >= 10 && temp < 18) {
    score = 60 + ((temp - 10) / 8) * 40;
    label = '偏凉 🧥';
    description = '建议带件外套出门';
  } else if (temp > 28 && temp <= 33) {
    score = 60 + ((33 - temp) / 5) * 40;
    label = '偏热 🥵';
    description = '有点热，注意防暑';
  } else if (temp >= 0 && temp < 10) {
    score = 20 + ((temp - 0) / 10) * 40;
    label = '冷 ❄️';
    description = '多穿点，别冻着了';
  } else if (temp > 33 && temp <= 40) {
    score = 20 + ((40 - temp) / 7) * 40;
    label = '热 🔥';
    description = '太热了，出门记得带水';
  } else {
    score = temp < 0 ? 0 : 0;
    label = temp < 0 ? '极寒 🥶' : '极热 🔥';
    description = temp < 0 ? '零下温度，建议宅家' : '高温预警，尽量别出门';
  }

  score = Math.round(clamp(score, 0, 100));
  return { score, label, description, weight: 25 };
}

function scoreWeather(weatherDesc: string, weatherCode: number): FactorScore {
  let score: number;
  let label: string;
  let description: string;

  const code = weatherCode;
  if ([113, 116].includes(code)) {
    score = 100;
    label = '天气超棒 ✨';
    description = '晴空万里，不出门可惜了！';
  } else if ([119, 122].includes(code)) {
    score = 70;
    label = '多云 ☁️';
    description = '没有太阳晒，其实也挺好';
  } else if ([143, 248, 260].includes(code)) {
    score = 45;
    label = '有雾 🌫️';
    description = '能见度一般，开车注意安全';
  } else if ([176, 263, 266, 293, 296, 353].includes(code)) {
    score = 45;
    label = '小雨 🌦️';
    description = '小雨纷飞，撑把伞也能逛';
  } else if ([299, 302, 305, 356].includes(code)) {
    score = 25;
    label = '中雨 🌧️';
    description = '雨不小，非必要不出门';
  } else if ([308, 359].includes(code)) {
    score = 10;
    label = '大雨 🌊';
    description = '暴雨天，在家最安全';
  } else if ([200, 386, 389].includes(code)) {
    score = 5;
    label = '雷暴 ⛈️';
    description = '打雷下雨，别出门了！';
  } else if ([227, 230, 323, 326, 329, 332, 335, 338, 368, 371].includes(code)) {
    score = 40;
    label = '下雪 ❄️';
    description = '下雪天，适合拍照但路滑';
  } else if ([350, 374, 377].includes(code)) {
    score = 0;
    label = '冰雹 🧊';
    description = '冰雹天！千万别出门！';
  } else if ([179, 182, 185, 281, 284, 311, 314, 317, 320, 362, 365].includes(code)) {
    score = 30;
    label = '雨雪天 🌨️';
    description = '雨雪交加，路况不好';
  } else {
    score = 50;
    label = '天气一般 😐';
    description = '天气不算好也不算坏';
  }

  score = Math.round(clamp(score, 0, 100));
  return { score, label, description, weight: 30 };
}

function scoreWind(speed: number): FactorScore {
  let score: number;
  let label: string;
  let description: string;

  if (speed <= 5) {
    score = 100;
    label = '微风和煦 🍃';
    description = '微风拂面，太舒服了';
  } else if (speed <= 15) {
    score = 85;
    label = '轻风 🎐';
    description = '有点小风，很清爽';
  } else if (speed <= 25) {
    score = 65;
    label = '大风 💨';
    description = '风有点大，发型不保';
  } else if (speed <= 40) {
    score = 35;
    label = '狂风 🌪️';
    description = '风太大了，走路都费劲';
  } else {
    score = 10;
    label = '暴风 🌀';
    description = '台风级风力，千万别出门！';
  }

  score = Math.round(clamp(score, 0, 100));
  return { score, label, description, weight: 15 };
}

function scoreHumidity(humidity: number): FactorScore {
  let score: number;
  let label: string;
  let description: string;

  if (humidity >= 40 && humidity <= 60) {
    score = 100;
    label = '湿度舒适 😊';
    description = '空气湿度刚刚好';
  } else if (humidity >= 30 && humidity < 40) {
    score = 75;
    label = '偏干燥 🌵';
    description = '有点干，记得补水';
  } else if (humidity > 60 && humidity <= 75) {
    score = 75;
    label = '偏潮湿 💧';
    description = '空气有点潮';
  } else if (humidity >= 20 && humidity < 30) {
    score = 45;
    label = '干燥 🏜️';
    description = '太干了，皮肤要起皮了';
  } else if (humidity > 75 && humidity <= 90) {
    score = 45;
    label = '潮湿 🌊';
    description = '又湿又闷，不太舒服';
  } else {
    score = 15;
    label = humidity > 90 ? '极度潮湿 🌧️' : '极度干燥 🏜️';
    description = humidity > 90 ? '跟桑拿房一样' : '干到怀疑人生';
  }

  score = Math.round(clamp(score, 0, 100));
  return { score, label, description, weight: 10 };
}

function scoreTimeOfDay(): FactorScore {
  const hour = new Date().getHours();
  let score: number;
  let label: string;
  let description: string;

  if (hour >= 6 && hour < 9) {
    score = 85;
    label = '清晨 🌅';
    description = '清晨空气好，适合晨跑';
  } else if (hour >= 9 && hour < 12) {
    score = 90;
    label = '上午 ☀️';
    description = '精力充沛的时段，冲！';
  } else if (hour >= 12 && hour < 14) {
    score = 60;
    label = '正午 🌞';
    description = '大中午的，太阳有点晒';
  } else if (hour >= 14 && hour < 18) {
    score = 95;
    label = '下午 🍵';
    description = '午后时光，最适合出门';
  } else if (hour >= 18 && hour < 21) {
    score = 80;
    label = '傍晚 🌆';
    description = '日落时分，浪漫又舒服';
  } else {
    score = 35;
    label = '深夜 🌙';
    description = '大晚上的，还是在家歇着吧';
  }

  score = Math.round(clamp(score, 0, 100));
  return { score, label, description, weight: 10 };
}

function scoreDayOfWeek(): FactorScore {
  const day = new Date().getDay();
  const isWeekend = day === 0 || day === 6;
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  let score: number;
  let label: string;
  let description: string;

  if (isWeekend) {
    score = 100;
    label = `${dayNames[day]} 🎉`;
    description = '周末！不出去浪等啥呢？';
  } else if (day === 5) {
    score = 80;
    label = '周五 🎊';
    description = '周五了！快下班/放学出去嗨！';
  } else {
    score = 55;
    label = `${dayNames[day]} 😑`;
    description = '工作日，但该出门还是得出门';
  }

  score = Math.round(clamp(score, 0, 100));
  return { score, label, description, weight: 10 };
}

function scoreMood(mood: number): FactorScore {
  const score = mood * 10; // 1-10 -> 10-100
  let label: string;
  let description: string;

  if (mood >= 9) {
    label = '心情超好 🤩';
    description = '今天状态爆棚！';
  } else if (mood >= 7) {
    label = '心情不错 😄';
    description = '心情美美的～';
  } else if (mood >= 5) {
    label = '还行 😐';
    description = '不好不坏，凑合过呗';
  } else if (mood >= 3) {
    label = '有点低落 😔';
    description = '也许出去走走心情会好点？';
  } else {
    label = '心情很差 😢';
    description = '在家休息一下吧，对自己好一点';
  }

  return { score, label, description, weight: 0 }; // 不作为权重因素，作为后续调整
}

const RECOMMENDATIONS = [
  { max: 15, emoji: '🛌', badge: '建议躺平', color: '#6b7280', text: '今天适合当蘑菇🍄...在角落里安静发霉那种。外面的世界太可怕了！' },
  { max: 30, emoji: '😶', badge: '不太推荐', color: '#8b5cf6', text: '还是别出门了，被窝它不香吗？今天适合追剧打游戏！' },
  { max: 45, emoji: '🤷', badge: '可以但没必要', color: '#ec4899', text: '出门可以出门，但真的有必要吗？要不你再想想？' },
  { max: 60, emoji: '😐', badge: '马马虎虎', color: '#f59e0b', text: '一般般吧，如果非得出门的话也不是不行...带上伞保险。' },
  { max: 75, emoji: '👍', badge: '适合出门', color: '#10b981', text: '天气不错！值得出去溜达一圈，呼吸新鲜空气！' },
  { max: 90, emoji: '😄', badge: '推荐出门', color: '#06b6d4', text: '好天气好心情！快出门享受生活吧，别窝在家里了！' },
  { max: 100, emoji: '🎉', badge: '完美出门日', color: '#f43f5e', text: '天时地利人和！今天是命中注定的出门日！不出门简直是暴殄天物！🔥' },
];

export function calculateGoOutScore(
  weather: WeatherData,
  preferences: UserPreferences,
): GoOutResult {
  const tempScore = scoreTemperature(weather.temp);
  const weatherScore = scoreWeather(weather.weatherDesc, weather.weatherCode);
  const windScore = scoreWind(weather.windSpeed);
  const humidityScore = scoreHumidity(weather.humidity);
  const timeScore = scoreTimeOfDay();
  const dayScore = scoreDayOfWeek();
  const moodScore = scoreMood(preferences.mood);

  // 总分 = 加权平均
  const totalWeight = tempScore.weight + weatherScore.weight + windScore.weight
    + humidityScore.weight + timeScore.weight + dayScore.weight;

  const weightedSum = tempScore.score * tempScore.weight
    + weatherScore.score * weatherScore.weight
    + windScore.score * windScore.weight
    + humidityScore.score * humidityScore.weight
    + timeScore.score * timeScore.weight
    + dayScore.score * dayScore.weight;

  let overallScore = Math.round(weightedSum / totalWeight);

  // 心情调节
  const moodMultiplier = 0.6 + (preferences.mood / 10) * 0.4; // 0.6 - 1.0
  overallScore = Math.round(overallScore * moodMultiplier);

  // 额外修正
  if (preferences.hasUmbrella) overallScore = Math.round(overallScore * 1.05);
  if (preferences.hasCar) overallScore = Math.round(overallScore * 1.08); // 有车不怕风雨

  overallScore = clamp(overallScore, 0, 100);

  // 获取推荐等级
  const rec = RECOMMENDATIONS.find(r => overallScore <= r.max) || RECOMMENDATIONS[RECOMMENDATIONS.length - 1];

  return {
    overallScore,
    factors: {
      temperature: tempScore,
      weather: weatherScore,
      wind: windScore,
      humidity: humidityScore,
      timeOfDay: timeScore,
      dayOfWeek: dayScore,
      userMood: moodScore,
    },
    recommendation: rec.text,
    emoji: rec.emoji,
    badge: rec.badge,
    color: rec.color,
  };
}

export { RECOMMENDATIONS };
