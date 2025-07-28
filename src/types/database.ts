export interface Database {
  public: {
    Tables: {
      surf_spots: {
        Row: {
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
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
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
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          wave_type?: string;
          skill_level?: string;
          best_season?: string;
          tide_conditions?: string;
          latitude?: number;
          longitude?: number;
          forecast_url?: string;
          image_url?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}