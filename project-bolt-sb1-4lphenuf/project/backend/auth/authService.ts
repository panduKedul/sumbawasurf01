import { User } from '@supabase/supabase-js';
import { supabase } from '../database/supabase';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string, skillLevel?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const signUp = async (email: string, password: string, username?: string, skillLevel?: string) => {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      throw new Error('Authentication service is not properly configured. Please contact support.');
    }
    
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          skill_level: skillLevel
        }
      }
    });

    if (signUpError) {
      console.error('Supabase signup error:', signUpError);
      
      // Handle specific Supabase errors
      if (signUpError.message?.includes('fetch')) {
        throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
      } else if (signUpError.message?.includes('Invalid API key')) {
        throw new Error('Authentication service configuration error. Please contact support.');
      } else if (signUpError.message?.includes('User already registered')) {
        throw new Error('An account with this email already exists. Please try signing in instead.');
      } else if (signUpError.message?.includes('Password')) {
        throw new Error('Password does not meet requirements. Please use at least 6 characters.');
      } else if (signUpError.message?.includes('Email')) {
        throw new Error('Please enter a valid email address.');
      } else {
        throw new Error(signUpError.message || 'Failed to create account. Please try again.');
      }
    }

    // Ensure user was created
    if (!data.user) {
      throw new Error('Account creation failed. Please try again.');
    }

    // Create profile entry for the new user
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email || email,
          username: username || null,
          skill_level: skillLevel || null
        });
      
      if (profileError) {
        console.error('Profile update error:', profileError);
        throw new Error('Account created but failed to create profile. Please try again.');
      }
    }

    // Auto sign in after registration
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      console.error('Auto sign-in error:', signInError);
      throw new Error('Account created successfully! Please try signing in manually.');
    }
    
  } catch (error: any) {
    console.error('SignUp process error:', error);
    
    // Handle network and configuration errors
    if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch')) {
      throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
    } else if (error.message?.includes('Missing Supabase') || error.message?.includes('not properly configured')) {
      throw new Error('Authentication service is not available. Please contact support.');
    } else if (error.message?.includes('Invalid') && error.message?.includes('format')) {
      throw new Error('Service configuration error. Please contact support.');
    }
    
    // Re-throw known errors
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      throw new Error('Authentication service is not properly configured. Please contact support.');
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Supabase signin error:', error);
      
      // Handle specific Supabase errors
      if (error.message?.includes('fetch')) {
        throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
      } else if (error.message?.includes('Invalid API key')) {
        throw new Error('Authentication service configuration error. Please contact support.');
      } else if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message?.includes('Email not confirmed')) {
        throw new Error('Please check your email and confirm your account before signing in.');
      } else if (error.message?.includes('Too many requests')) {
        throw new Error('Too many login attempts. Please wait a moment and try again.');
      } else {
        throw new Error(error.message || 'Failed to sign in. Please try again.');
      }
    }
    
  } catch (error: any) {
    console.error('SignIn process error:', error);
    
    // Handle network and configuration errors
    if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch')) {
      throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
    } else if (error.message?.includes('Missing Supabase') || error.message?.includes('not properly configured')) {
      throw new Error('Authentication service is not available. Please contact support.');
    } else if (error.message?.includes('Invalid') && error.message?.includes('format')) {
      throw new Error('Service configuration error. Please contact support.');
    }
    
    // Re-throw known errors
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};