const API_KEY = 'ea238450-60c5-11f0-9ea7-0242ac130006-ea2384aa-60c5-11f0-9ea7-0242ac130006';
const BASE_URL = 'https://api.stormglass.io/v2';

export interface WeatherData {
  time: string;
  airTemperature: number;
  waterTemperature: number;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  wavePeriod: number;
  waveDirection: number;
  cloudCover: number;
  precipitation: number;
  visibility: number;
}

export interface TideData {
  time: string;
  height: number;
  type: 'high' | 'low';
}

export async function fetchWeatherData(lat: number, lng: number): Promise<WeatherData[]> {
  try {
    // Note: StormGlass API requires a valid subscription
    // Falling back to static data due to API limitations
    console.log('Using fallback weather data - API key may be invalid or expired');
    return getFallbackWeatherData();
    
    /* Commented out API call - uncomment when you have a valid API key
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      params: 'airTemperature,waterTemperature,windSpeed,windDirection,waveHeight,wavePeriod,waveDirection,cloudCover,precipitation,visibility',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });

    const response = await fetch(`${BASE_URL}/weather/point?${params}`, {
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.hours?.map((hour: any) => ({
      time: hour.time,
      airTemperature: hour.airTemperature?.noaa || 0,
      waterTemperature: hour.waterTemperature?.noaa || 0,
      windSpeed: hour.windSpeed?.noaa || 0,
      windDirection: hour.windDirection?.noaa || 0,
      waveHeight: hour.waveHeight?.noaa || 0,
      wavePeriod: hour.wavePeriod?.noaa || 0,
      waveDirection: hour.waveDirection?.noaa || 0,
      cloudCover: hour.cloudCover?.noaa || 0,
      precipitation: hour.precipitation?.noaa || 0,
      visibility: hour.visibility?.noaa || 0,
    })) || [];
    */
  } catch (error) {
    console.log('Using fallback weather data due to API error');
    return [];
  }
}

export async function fetchTideData(lat: number, lng: number): Promise<TideData[]> {
  try {
    // Note: StormGlass API requires a valid subscription
    // Falling back to static data due to API limitations
    console.log('Using fallback tide data - API key may be invalid or expired');
    return getFallbackTideData();
    
    /* Commented out API call - uncomment when you have a valid API key
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      start: new Date().toISOString(),
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });

    const response = await fetch(`${BASE_URL}/tide/extremes/point?${params}`, {
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Tide API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data?.map((tide: any) => ({
      time: tide.time,
      height: tide.height,
      type: tide.type
    })) || [];
    */
  } catch (error) {
    console.log('Using fallback tide data due to API error');
    return [];
  }
}

// Fallback data for when API is not available
export const getFallbackWeatherData = (): WeatherData[] => {
  const now = new Date();
  const data: WeatherData[] = [];
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    data.push({
      time: time.toISOString(),
      airTemperature: 28 + Math.random() * 4,
      waterTemperature: 26 + Math.random() * 2,
      windSpeed: 10 + Math.random() * 15,
      windDirection: Math.random() * 360,
      waveHeight: 1 + Math.random() * 2,
      wavePeriod: 8 + Math.random() * 4,
      waveDirection: Math.random() * 360,
      cloudCover: Math.random() * 100,
      precipitation: Math.random() * 5,
      visibility: 15 + Math.random() * 10,
    });
  }
  
  return data;
};

export const getFallbackTideData = (): TideData[] => {
  const now = new Date();
  const data: TideData[] = [];
  
  // Generate 4 tides per day for 7 days
  for (let day = 0; day < 7; day++) {
    for (let tide = 0; tide < 4; tide++) {
      const time = new Date(now.getTime() + day * 24 * 60 * 60 * 1000 + tide * 6 * 60 * 60 * 1000);
      data.push({
        time: time.toISOString(),
        height: 0.5 + Math.random() * 1.5,
        type: tide % 2 === 0 ? 'high' : 'low'
      });
    }
  }
  
  return data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
};