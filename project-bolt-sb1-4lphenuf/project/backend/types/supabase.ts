export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          username: string | null
          skill_level: string | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
          username?: string | null
          skill_level?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          username?: string | null
          skill_level?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          spot_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          spot_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          spot_id?: string
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          user_id: string
          spot_id: string
          wave_height_min: number | null
          wave_height_max: number | null
          wind_speed_max: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          spot_id: string
          wave_height_min?: number | null
          wave_height_max?: number | null
          wind_speed_max?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          spot_id?: string
          wave_height_min?: number | null
          wave_height_max?: number | null
          wind_speed_max?: number | null
          created_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          email: string
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          created_by?: string | null
        }
      }
      surf_spots: {
        Row: {
          id: string
          name: string
          description: string
          wave_type: string
          skill_level: string
          best_season: string
          tide_conditions: string
          latitude: number
          longitude: number
          forecast_url: string
          image_url: string
          created_at: string
          updated_at: string
          created_by: string | null
          is_active: boolean
        }
        Insert: {
          id: string
          name: string
          description: string
          wave_type: string
          skill_level: string
          best_season: string
          tide_conditions: string
          latitude: number
          longitude: number
          forecast_url: string
          image_url: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string
          wave_type?: string
          skill_level?: string
          best_season?: string
          tide_conditions?: string
          latitude?: number
          longitude?: number
          forecast_url?: string
          image_url?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          is_active?: boolean
        }
      }
    }
  }
}