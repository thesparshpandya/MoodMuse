import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ColorTheme = 'lavender' | 'coral' | 'twilight';

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const COLOR_THEMES = {
  lavender: {
    '--primary': '276 60% 55%',
    '--secondary': '285 50% 70%',
    '--accent': '290 55% 60%',
    '--gradient-purple': 'linear-gradient(135deg, hsl(276 60% 55%), hsl(285 50% 70%))',
    '--ring': '276 60% 55%',
  },
  coral: {
    '--primary': '9 100% 64%',
    '--secondary': '25 100% 91%',
    '--accent': '15 100% 82%',
    '--gradient-purple': 'linear-gradient(135deg, hsl(9 100% 64%), hsl(25 100% 91%))',
    '--ring': '9 100% 64%',
  },
  twilight: {
    '--primary': '215 32% 27%',
    '--secondary': '215 25% 40%',
    '--accent': '215 30% 60%',
    '--gradient-purple': 'linear-gradient(135deg, hsl(215 32% 27%), hsl(215 25% 40%))',
    '--ring': '215 32% 27%',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('lavender');

  useEffect(() => {
    const savedTheme = localStorage.getItem('journal-theme') as Theme;
    const savedColorTheme = localStorage.getItem('journal-color-theme') as ColorTheme;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedColorTheme) setColorTheme(savedColorTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('journal-theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('journal-color-theme', colorTheme);
    const root = document.documentElement;
    
    // Apply color theme variables
    Object.entries(COLOR_THEMES[colorTheme]).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [colorTheme]);

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, setTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
