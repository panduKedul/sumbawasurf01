/*
  # Add username field to profiles table

  1. Changes
    - Add username column to profiles table
    - Make username unique
    - Add index for faster username lookups

  2. Security
    - No changes to RLS policies needed
*/

ALTER TABLE profiles
ADD COLUMN username text UNIQUE;

CREATE INDEX profiles_username_idx ON profiles (username);