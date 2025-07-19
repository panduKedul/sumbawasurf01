import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      // First check if the user exists and get their profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user?.id)
        .maybeSingle();

      if (profileError || !profile) {
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        } else {
          console.warn('No profile found for user. Profile may need to be created.');
        }
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Then check if this email exists in admins table
      // Use a simpler query that doesn't rely on RLS policies
      const { data, error } = await supabase
        .rpc('check_admin_status', { user_email: profile.email });

      if (error) {
        // If the RPC doesn't exist, fall back to a direct query
        // This will fail gracefully if there are policy issues
        console.warn('Admin RPC not available, using fallback method');
        
        // For now, set admin to false to prevent infinite recursion
        // The admin functionality can be enabled once the database policies are fixed
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return { isAdmin, loading };
}