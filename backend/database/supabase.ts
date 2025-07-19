import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced validation and error reporting
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  console.error('❌ Supabase Configuration Error:');
  console.error('Missing environment variables:', missingVars.join(', '));
  console.error('');
  console.error('📋 To fix this issue:');
  console.error('1. Create a .env file in your project root');
  console.error('2. Add the following variables:');
  console.error('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('   VITE_SUPABASE_ANON_KEY=your-anon-key');
  console.error('3. Get these values from your Supabase project dashboard');
  console.error('4. Restart your development server');
  console.error('');
  
  throw new Error(`Missing Supabase environment variables: ${missingVars.join(', ')}. Please check your .env file configuration.`);
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('❌ Invalid Supabase URL format:', supabaseUrl);
  console.error('Expected format: https://your-project.supabase.co');
  throw new Error('Invalid VITE_SUPABASE_URL format. Please check your .env file.');
}

// Validate API key format (basic check)
if (supabaseAnonKey.length < 100) {
  console.error('❌ Invalid Supabase API key format');
  console.error('The anon key should be a long JWT token (100+ characters)');
  throw new Error('Invalid VITE_SUPABASE_ANON_KEY format. Please check your .env file.');
}

// Create and export the supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'sumbawa-surf-guide'
    }
  }
});

// Test connection on initialization
supabase.auth.getSession().then(({ error }) => {
  if (error) {
    console.error('❌ Supabase connection test failed:', error.message);
  } else {
    console.log('✅ Supabase connection established successfully');
  }
}).catch((error) => {
  console.error('❌ Supabase connection error:', error.message);
});