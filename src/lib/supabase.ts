import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use placeholder values if environment variables are not set
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'placeholder-key';

export const supabase = createClient(
  supabaseUrl || defaultUrl, 
  supabaseAnonKey || defaultKey
);

// Test connection
if (supabaseUrl && supabaseAnonKey) {
  supabase
    .from('surf_spots')
    .select('count')
    .then(() => {
      console.log('✅ Supabase connection established successfully');
    })
    .catch((error) => {
      console.log('⚠️ Supabase connection failed, using static data:', error.message);
    });
} else {
  console.log('⚠️ Supabase environment variables not configured, using static data');
}