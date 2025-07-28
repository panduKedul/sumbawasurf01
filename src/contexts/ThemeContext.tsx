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
        bg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
        cardBg: 'bg-white/95 backdrop-blur-sm border border-blue-200/60 shadow-sm',
        text: 'text-slate-800',
        textSecondary: 'text-slate-600',
        border: 'border-blue-200/60',
        accent: 'text-blue-600',
        button: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-sm',
        buttonHover: 'hover:bg-blue-50/70',
        navbar: 'bg-white/95 backdrop-blur-md border-b border-blue-200/60 shadow-sm',
        headerBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        footerBg: 'bg-white/95 backdrop-blur-sm border-t border-blue-200/60 shadow-sm',
        footerText: 'text-slate-800',
        footerBorder: 'border-blue-200/60'
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-gray-900 via-slate-900 to-black',
        cardBg: 'bg-gray-800/95 backdrop-blur-sm border border-gray-700/60 shadow-sm',
        text: 'text-white',
        textSecondary: 'text-gray-300',
        border: 'border-gray-700/60',
        accent: 'text-cyan-400',
        button: 'bg-gradient-to-r from-gray-700 to-slate-700 text-white hover:from-gray-600 hover:to-slate-600 shadow-sm',
        buttonHover: 'hover:bg-gray-700/70',
        navbar: 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700/60 shadow-sm',
        headerBg: 'bg-gradient-to-r from-gray-800 to-slate-800',
        footerBg: 'bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/60 shadow-sm',
        footerText: 'text-white',
        footerBorder: 'border-gray-700/60'
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