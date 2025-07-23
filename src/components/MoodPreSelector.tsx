import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { emoji: '😐', label: 'Neutral', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { emoji: '😟', label: 'Worried', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { emoji: '😡', label: 'Angry', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { emoji: '😭', label: 'Sad', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
];

interface MoodPreSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string, emoji: string) => void;
}

export const MoodPreSelector: React.FC<MoodPreSelectorProps> = ({ selectedMood, onMoodSelect }) => {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">How are you feeling right now?</h4>
        <div className="flex gap-2 flex-wrap">
          {MOOD_OPTIONS.map((mood) => (
            <Button
              key={mood.label}
              variant="outline"
              size="sm"
              onClick={() => onMoodSelect(mood.label, mood.emoji)}
              className={`flex items-center gap-2 transition-all duration-200 ${
                selectedMood === mood.label 
                  ? 'ring-2 ring-primary border-primary' 
                  : mood.color
              }`}
            >
              <span className="text-lg">{mood.emoji}</span>
              <span className="text-xs font-medium">{mood.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
