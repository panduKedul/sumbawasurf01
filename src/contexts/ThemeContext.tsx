import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  getThemeClasses: () => {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    button: string;
    buttonHover: string;
    navbar: string;
    headerBg: string;
    footerBg: string;
    footerText: string;
    footerBorder: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const getThemeClasses = () => {
    if (theme === 'light') {
      return {
        bg: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
        cardBg: 'bg-white/90 backdrop-blur-xl border border-blue-200/50 shadow-xl',
        text: 'text-slate-800',
        textSecondary: 'text-slate-600',
        border: 'border-blue-200/50',
        accent: 'text-blue-600',
        button: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-lg backdrop-blur-sm',
        buttonHover: 'hover:bg-blue-50/80 hover:backdrop-blur-sm',
        navbar: 'bg-white/90 backdrop-blur-xl border-b border-blue-200/50 shadow-xl',
        headerBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        footerBg: 'bg-white/90 backdrop-blur-xl border-t border-blue-200/50 shadow-xl',
        footerText: 'text-slate-800',
        footerBorder: 'border-blue-200/50'
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800',
        cardBg: 'bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl',
        text: 'text-white',
        textSecondary: 'text-slate-300',
        border: 'border-slate-700/50',
        accent: 'text-sky-400',
        button: 'bg-gradient-to-r from-slate-700 to-slate-600 text-white hover:from-slate-600 hover:to-slate-500 shadow-lg backdrop-blur-sm',
        buttonHover: 'hover:bg-slate-700/80 hover:backdrop-blur-sm',
        navbar: 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl',
        headerBg: 'bg-gradient-to-r from-slate-800 to-slate-700',
        footerBg: 'bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 shadow-2xl',
        footerText: 'text-white',
        footerBorder: 'border-slate-700/50'
      };
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, getThemeClasses }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}