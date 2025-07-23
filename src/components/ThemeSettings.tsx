import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from './ThemeProvider';

export const ThemeSettings: React.FC = () => {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme();

  const colorThemes = [
    { 
      id: 'lavender' as const, 
      name: 'Lavender Mist', 
      colors: ['#E6E6FA', '#D8BFD8', '#C1B1D1'],
      description: 'Soft and calming'
    },
    { 
      id: 'coral' as const, 
      name: 'Coral Dawn', 
      colors: ['#FF6F61', '#FFE5D9', '#FFB4A2'],
      description: 'Warm and energizing'
    },
    { 
      id: 'twilight' as const, 
      name: 'Twilight Blue', 
      colors: ['#2E3A59', '#4A5A77', '#8A9EBF'],
      description: 'Deep and contemplative'
    },
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Palette className="h-5 w-5" />
          Theme Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dark/Light Mode Toggle */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Mode</h4>
          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
              className="flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
          </div>
        </div>

        {/* Color Theme Selection */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Color Theme</h4>
          <div className="space-y-3">
            {colorThemes.map((themeOption) => (
              <Card
                key={themeOption.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  colorTheme === themeOption.id 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setColorTheme(themeOption.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-medium text-foreground">{themeOption.name}</h5>
                        {colorTheme === themeOption.id && (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {themeOption.description}
                      </p>
                      <div className="flex gap-2">
                        {themeOption.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
