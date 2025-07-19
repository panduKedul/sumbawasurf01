export interface SurfSpot {
  id: string;
  name: string;
  description: string;
  waveType: string;
  skillLevel: string;
  bestSeason: string;
  tideConditions: string;
  coordinates: [number, number]; // [latitude, longitude]
  forecastUrl: string;
  imageUrl: string;
}