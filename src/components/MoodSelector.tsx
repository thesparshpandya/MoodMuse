import React from 'react';

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodSelect }) => {
  const moods = ['😊', '😔', '😡', '😐', '😢'];

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">How are you feeling?</h2>
      <div className="flex gap-3">
        {moods.map((mood) => (
          <button
            key={mood}
            className={`text-2xl p-2 rounded-full border ${
              selectedMood === mood ? 'bg-primary text-white' : 'bg-muted'
            }`}
            onClick={() => onMoodSelect(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
};
