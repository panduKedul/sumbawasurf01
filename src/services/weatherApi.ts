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