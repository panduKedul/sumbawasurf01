/*
  # Admin System for Surf Spots Management

  1. New Tables
    - `admins` - Store admin user emails
    - `surf_spots` - Store surf spots data in database
  
  2. Security
    - Enable RLS on both tables
    - Add policies for admin access
    - Add policies for public read access to surf spots
  
  3. Admin Functions
    - Function to check if user is admin
    - Seed data with admin emails
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- Create surf_spots table to store spots in database
CREATE TABLE IF NOT EXISTS surf_spots (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  wave_type text NOT NULL,
  skill_level text NOT NULL,
  best_season text NOT NULL,
  tide_conditions text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  forecast_url text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  is_active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE surf_spots ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can read all admin records"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    email IN (
      SELECT email FROM admins WHERE email = (
        SELECT email FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can insert admin records"
  ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (
    email IN (
      SELECT email FROM admins WHERE email = (
        SELECT email FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Surf spots policies
CREATE POLICY "Everyone can read active surf spots"
  ON surf_spots
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can insert surf spots"
  ON surf_spots
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT email FROM profiles WHERE id = auth.uid()) IN (
      SELECT email FROM admins
    )
  );

CREATE POLICY "Admins can update surf spots"
  ON surf_spots
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT email FROM profiles WHERE id = auth.uid()) IN (
      SELECT email FROM admins
    )
  );

CREATE POLICY "Admins can delete surf spots"
  ON surf_spots
  FOR DELETE
  TO authenticated
  USING (
    (SELECT email FROM profiles WHERE id = auth.uid()) IN (
      SELECT email FROM admins
    )
  );

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins 
    WHERE email = (
      SELECT email FROM profiles WHERE id = auth.uid()
    )
  );
$$;

-- Insert admin emails
INSERT INTO admins (email) VALUES 
  ('greeneo.ltd@gmail.com'),
  ('pandu.kedul@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Insert existing surf spots data into database
INSERT INTO surf_spots (
  id, name, description, wave_type, skill_level, best_season, 
  tide_conditions, latitude, longitude, forecast_url, image_url
) VALUES 
  (
    'northern-right',
    'Northern Right Beach',
    'A consistent right-hand break offering clean waves and less crowded conditions.',
    'Right-hand reef break',
    'Intermediate',
    'April to October',
    'Mid tide',
    -8.675539,
    116.767209,
    'https://www.surf-forecast.com/breaks/Northern-Rights/forecasts/latest',
    'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'dirty-hippies',
    'Dirty Hippies Beach',
    'A fun, playful right-hander that provides long, clean rides when conditions are right. Less crowded than some of the more famous spots.',
    'Right-hand reef break',
    'Intermediate',
    'May to September',
    'Mid tide',
    -8.675997,
    116.772528,
    'https://www.surf-forecast.com/breaks/Dirty-Hippies/forecasts/latest',
    'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'mangrove',
    'Mangrove Beach',
    'A scenic spot surrounded by mangrove forests, offering consistent waves suitable for various skill levels.',
    'Reef break',
    'Beginner to Intermediate',
    'April to October',
    'Mid to high tide',
    -8.717674,
    116.781184,
    'https://www.surf-forecast.com/breaks/Mangrove/forecasts/latest',
    'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'limestone',
    'Limestone Beach',
    'Named after the dramatic limestone cliffs that frame this spot, offering clean waves over a reef bottom.',
    'Reef break',
    'Intermediate',
    'May to September',
    'Mid tide',
    -8.722857,
    116.775871,
    'https://www.surf-forecast.com/breaks/Limestone/forecasts/latest',
    'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'scar-reef',
    'Scar Reef Beach',
    'A world-class left-hand reef break with long, powerful waves that can offer barrel sections and wall sections for high-performance surfing.',
    'Left-hand reef break',
    'Intermediate to Advanced',
    'April to October',
    'Mid to high tide',
    -8.862500,
    116.755550,
    'https://www.surf-forecast.com/breaks/Scar-Reef/forecasts/latest',
    'https://images.pexels.com/photos/1032653/pexels-photo-1032653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'bingin',
    'Bingin Beach',
    'A beautiful reef break known for its crystal-clear waters and perfect barrels.',
    'Left-hand reef break',
    'Intermediate to Advanced',
    'April to October',
    'Mid tide',
    -8.853056,
    116.762987,
    'https://www.surf-forecast.com/breaks/Bingin/forecasts/latest',
    'https://images.pexels.com/photos/1032652/pexels-photo-1032652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'phantom',
    'Phantom Beach',
    'A hidden gem offering long right-hand waves with multiple sections.',
    'Right-hand point break',
    'Intermediate to Advanced',
    'May to September',
    'Mid to high tide',
    -8.842987,
    116.765122,
    'https://www.surf-forecast.com/breaks/Phantom/forecasts/latest',
    'https://images.pexels.com/photos/1032651/pexels-photo-1032651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'super-suck',
    'Super Suck Beach',
    'One of the most perfect and dangerous waves in Indonesia, offering intense barrels that suck up and throw over a shallow reef. Not for the faint-hearted.',
    'Hollow, barreling right-hand reef break',
    'Advanced to Expert',
    'May to September',
    'Mid tide',
    -8.931197,
    116.741369,
    'https://www.surf-forecast.com/breaks/Super-Suck/forecasts/latest',
    'https://images.pexels.com/photos/457881/pexels-photo-457881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'yoyos',
    'Yoyo''s Beach',
    'A fun, consistent right-hander that works well on a variety of swells and offers long rides with multiple sections.',
    'Right-hand reef break',
    'Beginner to Intermediate',
    'March to November',
    'All tides, best at mid tide',
    -8.971933,
    116.726467,
    'https://www.surf-forecast.com/breaks/Yo-Yos/forecasts/latest',
    'https://images.pexels.com/photos/1032652/pexels-photo-1032652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'tropical',
    'Tropical Beach',
    'A lesser-known spot that offers playful, rippable waves over a coral reef with beautiful surroundings.',
    'Left-hand reef break',
    'Intermediate',
    'April to October',
    'Mid to high tide',
    -9.000010,
    116.739827,
    'https://www.surf-forecast.com/breaks/Tropicals/forecasts/latest',
    'https://images.pexels.com/photos/1032656/pexels-photo-1032656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'sedjorong',
    'Sedjorong Beach',
    'A secluded spot offering consistent waves and beautiful coastal scenery.',
    'Reef break',
    'Intermediate',
    'April to October',
    'Mid tide',
    -9.036304,
    116.799970,
    'https://www.surf-forecast.com/breaks/Sedjorong/forecasts/latest',
    'https://images.pexels.com/photos/1032657/pexels-photo-1032657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  )
ON CONFLICT (id) DO NOTHING;