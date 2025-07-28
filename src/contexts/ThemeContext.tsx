import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light' | 'ocean' | 'dark';
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
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'ocean' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'ocean' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const themes: ('light' | 'ocean' | 'dark')[] = ['light', 'ocean', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const newTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const getThemeClasses = () => {
    if (theme === 'light') {
      return {
        bg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
        cardBg: 'bg-white/90 backdrop-blur-sm border border-blue-200/50 shadow-lg',
        text: 'text-slate-800',
        textSecondary: 'text-slate-600',
        border: 'border-blue-200',
        accent: 'text-blue-600',
        button: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600',
        buttonHover: 'hover:bg-blue-50/50',
        navbar: 'bg-white/95 backdrop-blur-md border-b border-blue-200/50 shadow-lg',
        headerBg: 'bg-gradient-to-r from-blue-500 to-indigo-500'
      };
    } else if (theme === 'ocean') {
      return {
        bg: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50',
        cardBg: 'bg-white/80 backdrop-blur-sm border border-cyan-200/50 shadow-xl',
        text: 'text-slate-800',
        textSecondary: 'text-slate-600',
        border: 'border-cyan-200',
        accent: 'text-cyan-600',
        button: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600',
        buttonHover: 'hover:bg-cyan-50/50',
        navbar: 'bg-white/95 backdrop-blur-md border-b border-cyan-200/50 shadow-lg',
        headerBg: 'bg-gradient-to-r from-cyan-500 to-blue-500'
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-gray-900 via-slate-900 to-black',
        cardBg: 'bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 shadow-2xl',
        text: 'text-white',
        textSecondary: 'text-gray-300',
        border: 'border-gray-700',
        accent: 'text-cyan-400',
        button: 'bg-gradient-to-r from-gray-700 to-slate-700 text-white hover:from-gray-600 hover:to-slate-600',
        buttonHover: 'hover:bg-gray-700/50',
        navbar: 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-2xl',
        headerBg: 'bg-gradient-to-r from-gray-800 to-slate-800'
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