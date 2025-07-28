import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light-gray' | 'ocean-blue';
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
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light-gray' | 'ocean-blue'>('light-gray');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light-gray' | 'ocean-blue';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light-gray' ? 'ocean-blue' : 'light-gray';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const getThemeClasses = () => {
    if (theme === 'light-gray') {
      return {
        bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
        cardBg: 'bg-white border border-gray-200 shadow-lg',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        border: 'border-gray-200',
        accent: 'text-blue-600',
        button: 'bg-blue-600 text-white hover:bg-blue-700',
        buttonHover: 'hover:bg-gray-50'
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
        cardBg: 'bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-xl',
        text: 'text-slate-800',
        textSecondary: 'text-slate-600',
        border: 'border-blue-200',
        accent: 'text-cyan-600',
        button: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600',
        buttonHover: 'hover:bg-blue-50/50'
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