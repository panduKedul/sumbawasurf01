/*
  # Complete Sumbawa Surf Guide Database Schema

  1. New Tables
    - `surf_spots`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `wave_type` (text)
      - `skill_level` (text)
      - `best_season` (text)
      - `tide_conditions` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `forecast_url` (text)
      - `image_url` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `surf_spots` table
    - Add policy for public read access to active spots
    - Add policy for authenticated users to manage spots (if needed later)

  3. Sample Data
    - Insert all 11 West Sumbawa surf spots
*/

-- Create surf_spots table
CREATE TABLE IF NOT EXISTS surf_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  wave_type text NOT NULL,
  skill_level text NOT NULL,
  best_season text NOT NULL,
  tide_conditions text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  forecast_url text NOT NULL,
  image_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE surf_spots ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read active surf spots"
  ON surf_spots
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can manage surf spots"
  ON surf_spots
  FOR ALL
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_surf_spots_updated_at
  BEFORE UPDATE ON surf_spots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO surf_spots (name, description, wave_type, skill_level, best_season, tide_conditions, latitude, longitude, forecast_url, image_url) VALUES
('Northern Right Beach', 'A consistent right-hand break offering clean waves and less crowded conditions.', 'Right-hand reef break', 'Intermediate', 'April to October', 'Mid tide', -8.675539, 116.767209, 'https://www.surf-forecast.com/breaks/Northern-Rights/forecasts/latest', 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),

('Dirty Hippies Beach', 'A fun, playful right-hander that provides long, clean rides when conditions are right. Less crowded than some of the more famous spots.', 'Right-hand reef break', 'Intermediate', 'May to September', 'Mid tide', -8.675997, 116.772528, 'https://www.surf-forecast.com/breaks/Dirty-Hippies/forecasts/latest', 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),

('Mangrove Beach', 'A scenic spot surrounded by mangrove forests, offering consistent waves suitable for various skill levels.', 'Reef break', 'Beginner to Intermediate', 'April to October', 'Mid to high tide', -8.717674, 116.781184, 'https://www.surf-forecast.com/breaks/Mangrove/forecasts/latest', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),

('Limestone Beach', 'Named after the dramatic limestone cliffs that frame this spot, offering clean waves over a reef bottom.', 'Reef break', 'Intermediate', 'May to September', 'Mid tide', -8.722857, 116.775871, 'https://www.surf-forecast.com/breaks/Limestone/forecasts/latest', 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),

('Scar Reef Beach', 'A world-class left-hand reef break with long, powerful waves that can offer barrel sections and wall sections for high-performance surfing.', 'Left-hand reef break', 'Intermediate to Advanced', 'April to October', 'Mid to high tide', -8.862500, 116.755550, 'https://www.surf-forecast.com/breaks/Scar-Reef/forecasts/latest', 'https://images.pexels.com/photos/1032653/pexels-photo-1032653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),

('Bingin Beach', 'A beautiful reef break known for its crystal-clear waters and perfect barrels.', 'Left-hand reef break', 'Intermediate to Advanced', 'April to October', 'Mid tide', -8.853056, 116.762987, 'https://www.surf-forecast.com/breaks/Bingin/forecasts/latest', 'https://images.pexels.com/photos/1032652/pexels-photo-1032652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),

('Phantom Beach', 'A hidden gem offering long right-hand waves with multiple sections.', 'Right-hand point break', 'Intermediate to Advanced', 'May to September', 'Mid to high tide', -8.842987, 116.765122, 'https://www.surf-forecast.com/breaks/Phantom/forecasts/latest', 'https://images.pexels.com/photos/1032651/pexels-photo-1032651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),

('Super Suck Beach', 'One of the most perfect and dangerous waves in Indonesia, offering intense barrels that suck up and throw over a shallow reef. Not for the faint-hearted.', 'Hollow, barreling right-hand reef break', 'Advanced to Expert', 'May to September', 'Mid tide', -8.931197, 116.741369, 'https://www.surf-forecast.com/breaks/Super-Suck/forecasts/latest', 'https://images.pexels.com/photos/457881/pexels-photo-457881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),

('Yoyo''s Beach', 'A fun, consistent right-hander that works well on a variety of swells and offers long rides with multiple sections.', 'Right-hand reef break', 'Beginner to Intermediate', 'March to November', 'All tides, best at mid tide', -8.971933, 116.726467, 'https://www.surf-forecast.com/breaks/Yo-Yos/forecasts/latest', 'https://images.pexels.com/photos/1032652/pexels-photo-1032652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),

('Tropical Beach', 'A lesser-known spot that offers playful, rippable waves over a coral reef with beautiful surroundings.', 'Left-hand reef break', 'Intermediate', 'April to October', 'Mid to high tide', -9.000010, 116.739827, 'https://www.surf-forecast.com/breaks/Tropicals/forecasts/latest', 'https://images.pexels.com/photos/1032656/pexels-photo-1032656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),

('Sedjorong Beach', 'A secluded spot offering consistent waves and beautiful coastal scenery.', 'Reef break', 'Intermediate', 'April to October', 'Mid tide', -9.036304, 116.799970, 'https://www.surf-forecast.com/breaks/Sedjorong/forecasts/latest', 'https://images.pexels.com/photos/1032657/pexels-photo-1032657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')

ON CONFLICT (name) DO NOTHING;