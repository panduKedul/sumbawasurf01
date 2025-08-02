import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  email: string;
  full_name: string;
}

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ success: boolean; error?: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // LocalStorage persistence (optional)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    setLoading(true);
    try {
      // cek jika email sudah digunakan
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        return { success: false, error: 'Email already registered' };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          email,
          full_name: fullName,
          password_hash: passwordHash,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error ? err.message : 'Unexpected registration error',
      };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data: user, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, password_hash')
        .eq('email', email)
        .single();

      if (error || !user) {
        return { success: false, error: 'Email not found' };
      }

      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return { success: false, error: 'Incorrect password' };
      }

      const cleanUser = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      };

      setUser(cleanUser);
      localStorage.setItem('user', JSON.stringify(cleanUser));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Login error',
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out');
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
