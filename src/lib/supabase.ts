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
  // Test connection with timeout
  const testConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      await supabase
        .from('surf_spots')
        .select('count')
        .abortSignal(controller.signal);
      
      clearTimeout(timeoutId);
      console.log('✅ Supabase connection established successfully');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('⚠️ Supabase connection timeout, using static data');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          console.log('⚠️ Network error connecting to Supabase, using static data');
        } else {
          console.log('⚠️ Supabase connection failed, using static data:', error.message);
        }
      } else {
        console.log('⚠️ Unknown Supabase connection error, using static data');
      }
    }
  };
  
  testConnection();
} else {
  console.log('⚠️ Supabase environment variables not configured, using static data');
}