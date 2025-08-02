export interface WeatherData {
  time: string;
  airTemperature: number;
  waterTemperature: number;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  wavePeriod: number;
  cloudCover: number;
  visibility: number;
  precipitation: number;
  pressure: number;
}

export interface TideData {
  time: string;
  height: number;
  type: 'high' | 'low';
  moonPhase: string;
  sunriseTime: string;
  sunsetTime: string;
}

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData[]> => {
  try {
    // Simulate API call with realistic data patterns
    const now = new Date();
    const weatherData: WeatherData[] = [];

    for (let i = 0; i < 48; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hour = time.getHours();

      // Temperature varies with time of day (warmer during day)
      const baseTemp = 28 + Math.sin((hour - 6) * Math.PI / 12) * 4;
      const tempVariation = Math.sin(i * 0.1) * 2;

      // Wind patterns (stronger in afternoon)
      const baseWind = 8 + Math.sin((hour - 12) * Math.PI / 8) * 3;
      const windVariation = Math.sin(i * 0.15) * 2;

      // Wave patterns (related to wind)
      const baseWave = 1.2 + Math.sin(i * 0.08) * 0.8;

      weatherData.push({
        time: time.toISOString(),
        airTemperature: baseTemp + tempVariation + (Math.random() - 0.5) * 2,
        waterTemperature: baseTemp - 2 + tempVariation * 0.5 + (Math.random() - 0.5),
        windSpeed: Math.max(0, baseWind + windVariation + (Math.random() - 0.5) * 3),
        windDirection: 180 + Math.sin(i * 0.1) * 60 + (Math.random() - 0.5) * 30,
        waveHeight: Math.max(0.3, baseWave + (Math.random() - 0.5) * 0.5),
        wavePeriod: 8 + Math.sin(i * 0.05) * 3 + (Math.random() - 0.5) * 2,
        cloudCover: Math.max(0, Math.min(100, 40 + Math.sin(i * 0.12) * 30 + (Math.random() - 0.5) * 20)),
        visibility: Math.max(5, 15 + Math.sin(i * 0.08) * 5 + (Math.random() - 0.5) * 3),
        precipitation: Math.max(0, Math.sin(i * 0.2) * 2 + (Math.random() - 0.8) * 3),
        pressure: 1013 + Math.sin(i * 0.05) * 8 + (Math.random() - 0.5) * 5
      });
    }

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return getFallbackWeatherData();
  }
};

export const getFallbackWeatherData = (): WeatherData[] => {
  const now = new Date();
  const fallbackData: WeatherData[] = [];

  for (let i = 0; i < 48; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = time.getHours();

    // Realistic fallback patterns
    const baseTemp = 27 + Math.sin((hour - 6) * Math.PI / 12) * 3;
    const baseWind = 7 + Math.sin((hour - 14) * Math.PI / 10) * 2;

    fallbackData.push({
      time: time.toISOString(),
      airTemperature: baseTemp + Math.sin(i * 0.1) * 1.5,
      waterTemperature: baseTemp - 1.5 + Math.sin(i * 0.08) * 1,
      windSpeed: Math.max(2, baseWind + Math.sin(i * 0.12) * 2),
      windDirection: 200 + Math.sin(i * 0.1) * 40,
      waveHeight: 1.0 + Math.sin(i * 0.08) * 0.6,
      wavePeriod: 9 + Math.sin(i * 0.06) * 2,
      cloudCover: 35 + Math.sin(i * 0.1) * 25,
      visibility: 12 + Math.sin(i * 0.07) * 3,
      precipitation: Math.max(0, Math.sin(i * 0.15) * 1),
      pressure: 1015 + Math.sin(i * 0.04) * 6
    });
  }

  return fallbackData;
};

export const fetchTideData = async (lat: number, lon: number): Promise<TideData[]> => {
  try {
    // Simulate API call with realistic tide data patterns
    const now = new Date();
    const tideData: TideData[] = [];

    for (let i = 0; i < 336; i++) { // 14 days * 24 hours
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hour = time.getHours();
      const day = Math.floor(i / 24);

      // Realistic tide patterns (2 high, 2 low per day with 6.2 hour intervals)
      const tidePhase = (i * 6.2) % 24;
      const baseHeight = 1.5 + Math.sin((tidePhase * Math.PI) / 12) * 1.2;
      const variation = Math.sin(day * 0.1) * 0.3;

      // Determine tide type
      const tideType = (tidePhase % 12) < 6 ? 'high' : 'low';

      // Moon phase calculation
      const moonPhases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
      const moonPhase = moonPhases[day % 8];

      // Sunrise/sunset times
      const sunriseHour = 6 + Math.sin(day * 0.1) * 1;
      const sunsetHour = 18 + Math.sin(day * 0.1) * 1;

      tideData.push({
        time: time.toISOString(),
        height: Math.max(0.2, baseHeight + variation + (Math.random() - 0.5) * 0.2),
        type: tideType,
        moonPhase,
        sunriseTime: `${Math.floor(sunriseHour)}:${String(Math.floor((sunriseHour % 1) * 60)).padStart(2, '0')}`,
        sunsetTime: `${Math.floor(sunsetHour)}:${String(Math.floor((sunsetHour % 1) * 60)).padStart(2, '0')}`
      });
    }

    return tideData;
  } catch (error) {
    console.error('Error fetching tide data:', error);
    return getFallbackTideData();
  }
};


// interface TideData {
//   time: string;
//   height: number;
//   type: 'high' | 'low';
// }

// const STORMGLASS_KEY = 'YOUR_KEY_HERE'; // Ganti saat registrasi

// export const fetchTideData = async (lat: number, lon: number): Promise<TideData[]> => {
//   const now = new Date();
//   const start = now.toISOString().split('T')[0] + 'T00:00:00Z';
//   const endDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
//   const end = endDate.toISOString().split('T')[0] + 'T23:59:59Z';

//   // Panggil extremes endpoint untuk high/low tide
//   const extremesUrl = `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lon}&start=${start}&end=${end}`;
//   const seaLevelUrl = `https://api.stormglass.io/v2/tide/sea-level/point?lat=${lat}&lng=${lon}&start=${start}&end=${end}`;

//   try {
//     const [extRes, seaRes] = await Promise.all([
//       fetch(extremesUrl, { headers: { Authorization: STORMGLASS_KEY } }),
//       fetch(seaLevelUrl, { headers: { Authorization: STORMGLASS_KEY } }),
//     ]);

//     const extremesJson = await extRes.json();
//     const seaLevelJson = await seaRes.json();

//     // Parano ke valid JSON
//     if (!extremesJson.data) throw new Error('No extremes data');
//     const tideData: TideData[] = extremesJson.data.map((item: any) => ({
//       time: item.time,
//       height: item.height.value,
//       type: item.height.type === 'HIGH' ? 'high' : 'low'
//     }));

//     return tideData;
//   } catch (err) {
//     console.error('StormGlass fetch error:', err);
//     return getFallbackTideData();
//   }
// };

export const getFallbackTideData = (): TideData[] => {
  const now = new Date();
  const fallbackData: TideData[] = [];

  for (let i = 0; i < 336; i++) { // 14 days * 24 hours
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const day = Math.floor(i / 24);

    // Simple fallback tide patterns
    const tidePhase = (i * 6.2) % 24;
    const baseHeight = 1.4 + Math.sin((tidePhase * Math.PI) / 12) * 1.1;
    const tideType = (tidePhase % 12) < 6 ? 'high' : 'low';

    const moonPhases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const moonPhase = moonPhases[day % 8];

    fallbackData.push({
      time: time.toISOString(),
      height: Math.max(0.3, baseHeight + Math.sin(i * 0.08) * 0.2),
      type: tideType,
      moonPhase,
      sunriseTime: '6:30',
      sunsetTime: '18:30'
    });
  }

  return fallbackData;
};