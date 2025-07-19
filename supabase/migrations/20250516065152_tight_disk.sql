/*
  # Delete all registered users

  1. Changes
    - Removes all user data from the profiles table
    - Removes all user data from the auth.users table
    - Removes all related data from favorites and alerts tables
  
  2. Security
    - Maintains table structures and policies
    - Only removes data, not schema
*/

-- First delete dependent data
DELETE FROM favorites;
DELETE FROM alerts;

-- Then delete user profiles
DELETE FROM profiles;

-- Finally delete auth users
DELETE FROM auth.users;