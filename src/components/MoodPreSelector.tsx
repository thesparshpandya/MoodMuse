import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Happy', color: 'bg-accent/50 hover:bg-accent border-accent' },
  { emoji: '😐', label: 'Neutral', color: 'bg-muted hover:bg-muted/80 border-muted' },
  { emoji: '😟', label: 'Worried', color: 'bg-secondary/50 hover:bg-secondary border-secondary' },
  { emoji: '😡', label: 'Angry', color: 'bg-destructive/20 hover:bg-destructive/30 border-destructive/50' },
  { emoji: '😭', label: 'Sad', color: 'bg-primary/20 hover:bg-primary/30 border-primary/50' },
];

interface MoodPreSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string, emoji: string) => void;
}

export const MoodPreSelector: React.FC<MoodPreSelectorProps> = ({ selectedMood, onMoodSelect }) => {
  return (
    <Card className="bg-card border-border slide-up">
      <CardContent className="p-3 sm:p-4">
        <h4 className="text-xs sm:text-sm font-medium text-foreground mb-3">How are you feeling right now?</h4>
        <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
          {MOOD_OPTIONS.map((mood) => (
            <Button
              key={mood.label}
              variant="outline"
              size="sm"
              onClick={() => onMoodSelect(mood.label, mood.emoji)}
              className={`flex items-center gap-1 sm:gap-2 transition-all duration-200 hover:scale-105 active:scale-95 px-2 sm:px-3 h-8 sm:h-9 ${
                selectedMood === mood.label 
                  ? 'ring-2 ring-primary border-primary bg-primary/10 shadow-purple' 
                  : mood.color
              }`}
            >
              <span className="text-base sm:text-lg">{mood.emoji}</span>
              <span className="text-xs font-medium hidden sm:inline">{mood.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
