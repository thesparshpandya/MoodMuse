import React, { useState } from 'react';
import { Smile, Frown, Meh, Heart, Zap, Cloud, Sun, Moon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface MoodOption {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  icon: React.ReactNode;
}

interface MoodPreSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string, intensity: number) => void;
  className?: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'happy',
    name: 'Happy',
    emoji: '😊',
    color: 'bg-yellow-500',
    description: 'Feeling joyful and positive',
    icon: <Sun className="h-4 w-4" />
  },
  {
    id: 'excited',
    name: 'Excited',
    emoji: '🤩',
    color: 'bg-orange-500',
    description: 'Energetic and enthusiastic',
    icon: <Zap className="h-4 w-4" />
  },
  {
    id: 'calm',
    name: 'Calm',
    emoji: '😌',
    color: 'bg-green-500',
    description: 'Peaceful and relaxed',
    icon: <Cloud className="h-4 w-4" />
  },
  {
    id: 'grateful',
    name: 'Grateful',
    emoji: '🙏',
    color: 'bg-purple-500',
    description: 'Appreciative and thankful',
    icon: <Heart className="h-4 w-4" />
  },
  {
    id: 'neutral',
    name: 'Neutral',
    emoji: '😐',
    color: 'bg-gray-500',
    description: 'Neither good nor bad',
    icon: <Meh className="h-4 w-4" />
  },
  {
    id: 'tired',
    name: 'Tired',
    emoji: '😴',
    color: 'bg-indigo-500',
    description: 'Feeling drained or sleepy',
    icon: <Moon className="h-4 w-4" />
  },
  {
    id: 'anxious',
    name: 'Anxious',
    emoji: '😰',
    color: 'bg-blue-500',
    description: 'Worried or uneasy',
    icon: <Cloud className="h-4 w-4" />
  },
  {
    id: 'sad',
    name: 'Sad',
    emoji: '😢',
    color: 'bg-blue-600',
    description: 'Feeling down or melancholy',
    icon: <Frown className="h-4 w-4" />
  },
  {
    id: 'angry',
    name: 'Angry',
    emoji: '😠',
    color: 'bg-red-500',
    description: 'Frustrated or irritated',
    icon: <Zap className="h-4 w-4" />
  }
];

export const MoodPreSelector: React.FC<MoodPreSelectorProps> = ({
  selectedMood,
  onMoodSelect,
  className = ''
}) => {
  const [intensity, setIntensity] = useState([3]);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  const handleMoodClick = (moodId: string) => {
    onMoodSelect(moodId, intensity[0]);
  };

  const getIntensityLabel = (value: number) => {
    const labels = {
      1: 'Very Low',
      2: 'Low',
      3: 'Moderate',
      4: 'High',
      5: 'Very High'
    };
    return labels[value as keyof typeof labels] || 'Moderate';
  };

  return (
    <Card className={`bg-card border-border ${className}`}>
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            How are you feeling right now?
          </h3>
          <p className="text-sm text-muted-foreground">
            Select your current mood to get personalized insights
          </p>
        </div>

        {/* Mood Selection Grid */}
        <div className="grid grid-cols-3 gap-3">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            const isHovered = hoveredMood === mood.id;
            
            return (
              <Button
                key={mood.id}
                variant="outline"
                className={`relative h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200 ${
                  isSelected 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'hover:bg-muted/50'
                } ${isHovered ? 'scale-105' : ''}`}
                onClick={() => handleMoodClick(mood.id)}
                onMouseEnter={() => setHoveredMood(mood.id)}
                onMouseLeave={() => setHoveredMood(null)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{mood.emoji}</span>
                  {mood.icon}
                </div>
                <span className="text-xs font-medium">{mood.name}</span>
                {isSelected && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    ✓
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Mood Description */}
        {(selectedMood || hoveredMood) && (
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {MOOD_OPTIONS.find(m => m.id === (hoveredMood || selectedMood))?.description}
            </p>
          </div>
        )}

        {/* Intensity Slider */}
        {selectedMood && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Intensity Level
              </label>
              <Badge variant="outline" className="text-xs">
                {getIntensityLabel(intensity[0])} ({intensity[0]}/5)
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Barely</span>
                <span>Somewhat</span>
                <span>Moderately</span>
                <span>Quite</span>
                <span>Extremely</span>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Selection */}
        {selectedMood && (
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMoodSelect(selectedMood, intensity[0])}
              className="text-xs bg-primary/10 text-primary border-primary"
            >
              Confirm Selection
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
