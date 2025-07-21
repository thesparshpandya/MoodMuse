import React from 'react';
import { Heart, Smile, Meh, Frown, Zap, CloudRain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
}

const moods = [
  { id: 'joyful', label: 'Joyful', icon: Heart, color: 'bg-red-100 text-red-600 hover:bg-red-200' },
  { id: 'happy', label: 'Happy', icon: Smile, color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'bg-blue-100 text-blue-600 hover:bg-blue-200' },
  { id: 'anxious', label: 'Anxious', icon: Zap, color: 'bg-purple-100 text-purple-600 hover:bg-purple-200' },
  { id: 'overwhelmed', label: 'Overwhelmed', icon: CloudRain, color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200' },
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">How are you feeling today?</h3>
      <div className="grid grid-cols-3 gap-3">
        {moods.map((mood) => {
          const Icon = mood.icon;
          return (
            <Button
              key={mood.id}
              variant="outline"
              onClick={() => onMoodSelect(mood.id)}
              className={cn(
                "h-20 flex flex-col gap-2 transition-all duration-200",
                selectedMood === mood.id
                  ? "ring-2 ring-primary bg-accent scale-105"
                  : "hover:scale-102"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm">{mood.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
