/*
  # Add skill level to profiles table

  1. Changes
    - Add skill_level column to profiles table
*/

ALTER TABLE profiles
ADD COLUMN skill_level text;

COMMENT ON COLUMN profiles.skill_level IS 'User''s surfing skill level (Pro, Advanced, Intermediate, Beginner)';