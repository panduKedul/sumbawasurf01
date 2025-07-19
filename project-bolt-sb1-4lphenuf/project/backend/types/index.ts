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

export interface DatabaseSurfSpot {
  id: string;
  name: string;
  description: string;
  wave_type: string;
  skill_level: string;
  best_season: string;
  tide_conditions: string;
  latitude: number;
  longitude: number;
  forecast_url: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_active: boolean;
}

export interface Admin {
  id: string;
  email: string;
  created_at: string;
  created_by: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  skill_level: string;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  spot_id: string;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  spot_id: string;
  wave_height_min: number | null;
  wave_height_max: number | null;
  wind_speed_max: number | null;
  created_at: string;
}