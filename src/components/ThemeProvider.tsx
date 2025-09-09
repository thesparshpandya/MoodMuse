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
    light: {
      '--primary': '276 60% 55%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '285 50% 90%',
      '--secondary-foreground': '276 60% 20%',
      '--accent': '290 55% 85%',
      '--accent-foreground': '276 60% 20%',
      '--ring': '276 60% 55%',
      '--gradient-purple': 'linear-gradient(135deg, hsl(276 60% 55%), hsl(285 50% 70%))',
      '--gradient-warm': 'linear-gradient(135deg, hsl(276 60% 55%) 0%, hsl(285 50% 60%) 50%, hsl(295 60% 65%) 100%)',
      '--gradient-deep': 'linear-gradient(135deg, hsl(276 60% 20%) 0%, hsl(276 60% 55%) 100%)',
    },
    dark: {
      '--primary': '285 50% 70%',
      '--primary-foreground': '220 15% 8%',
      '--secondary': '276 20% 25%',
      '--secondary-foreground': '0 0% 90%',
      '--accent': '285 30% 30%',
      '--accent-foreground': '0 0% 90%',
      '--ring': '285 50% 70%',
      '--gradient-purple': 'linear-gradient(135deg, hsl(285 50% 70%), hsl(276 40% 50%))',
      '--gradient-warm': 'linear-gradient(135deg, hsl(285 50% 70%) 0%, hsl(290 50% 60%) 50%, hsl(295 50% 65%) 100%)',
      '--gradient-deep': 'linear-gradient(135deg, hsl(276 60% 20%) 0%, hsl(285 50% 40%) 100%)',
    }
  },
  coral: {
    light: {
      '--primary': '9 100% 64%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '25 100% 91%',
      '--secondary-foreground': '9 100% 30%',
      '--accent': '15 100% 82%',
      '--accent-foreground': '9 100% 30%',
      '--ring': '9 100% 64%',
      '--gradient-purple': 'linear-gradient(135deg, hsl(9 100% 64%), hsl(25 100% 75%))',
      '--gradient-warm': 'linear-gradient(135deg, hsl(9 100% 64%) 0%, hsl(20 100% 70%) 50%, hsl(30 100% 75%) 100%)',
      '--gradient-deep': 'linear-gradient(135deg, hsl(9 100% 30%) 0%, hsl(9 100% 64%) 100%)',
    },
    dark: {
      '--primary': '15 85% 65%',
      '--primary-foreground': '220 15% 8%',
      '--secondary': '15 30% 25%',
      '--secondary-foreground': '0 0% 90%',
      '--accent': '20 40% 30%',
      '--accent-foreground': '0 0% 90%',
      '--ring': '15 85% 65%',
      '--gradient-purple': 'linear-gradient(135deg, hsl(15 85% 65%), hsl(20 70% 55%))',
      '--gradient-warm': 'linear-gradient(135deg, hsl(15 85% 65%) 0%, hsl(25 75% 60%) 50%, hsl(30 75% 65%) 100%)',
      '--gradient-deep': 'linear-gradient(135deg, hsl(9 80% 30%) 0%, hsl(15 75% 45%) 100%)',
    }
  },
  twilight: {
    light: {
      '--primary': '215 32% 27%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '215 25% 85%',
      '--secondary-foreground': '215 32% 20%',
      '--accent': '215 30% 75%',
      '--accent-foreground': '215 32% 20%',
      '--ring': '215 32% 27%',
      '--gradient-purple': 'linear-gradient(135deg, hsl(215 32% 27%), hsl(215 25% 50%))',
      '--gradient-warm': 'linear-gradient(135deg, hsl(215 32% 27%) 0%, hsl(220 30% 40%) 50%, hsl(225 35% 50%) 100%)',
      '--gradient-deep': 'linear-gradient(135deg, hsl(215 32% 15%) 0%, hsl(215 32% 27%) 100%)',
    },
    dark: {
      '--primary': '220 30% 65%',
      '--primary-foreground': '220 15% 8%',
      '--secondary': '215 20% 25%',
      '--secondary-foreground': '0 0% 90%',
      '--accent': '220 25% 30%',
      '--accent-foreground': '0 0% 90%',
      '--ring': '220 30% 65%',
      '--gradient-purple': 'linear-gradient(135deg, hsl(220 30% 65%), hsl(215 25% 50%))',
      '--gradient-warm': 'linear-gradient(135deg, hsl(220 30% 65%) 0%, hsl(225 30% 60%) 50%, hsl(230 35% 65%) 100%)',
      '--gradient-deep': 'linear-gradient(135deg, hsl(215 30% 20%) 0%, hsl(220 25% 40%) 100%)',
    }
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
    
    // Get the appropriate theme colors based on current mode
    const currentMode = theme;
    const themeColors = COLOR_THEMES[colorTheme][currentMode];
    
    // Apply color theme variables
    Object.entries(themeColors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [colorTheme, theme]);

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
