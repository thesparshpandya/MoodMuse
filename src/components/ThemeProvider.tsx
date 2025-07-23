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
    '--theme-primary': '276 40% 70%',
    '--theme-secondary': '285 30% 85%',
    '--theme-accent': '290 35% 75%',
    '--theme-gradient': 'linear-gradient(135deg, hsl(276 40% 70%), hsl(285 30% 85%))',
  },
  coral: {
    '--theme-primary': '9 100% 64%',
    '--theme-secondary': '25 100% 91%',
    '--theme-accent': '15 100% 82%',
    '--theme-gradient': 'linear-gradient(135deg, hsl(9 100% 64%), hsl(25 100% 91%))',
  },
  twilight: {
    '--theme-primary': '215 32% 27%',
    '--theme-secondary': '215 25% 40%',
    '--theme-accent': '215 30% 60%',
    '--theme-gradient': 'linear-gradient(135deg, hsl(215 32% 27%), hsl(215 25% 40%))',
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
