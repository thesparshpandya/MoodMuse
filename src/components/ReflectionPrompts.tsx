import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReflectionPrompt {
  id: string;
  text: string;
  category: 'Gratitude' | 'Anxiety' | 'Self-worth' | 'Relationships' | 'Work';
  emoji: string;
}

const PROMPTS: ReflectionPrompt[] = [
  { id: '1', text: 'What gave you joy today?', category: 'Gratitude', emoji: '✨' },
  { id: '2', text: 'Who challenged your patience today?', category: 'Relationships', emoji: '🤝' },
  { id: '3', text: 'What are you most grateful for right now?', category: 'Gratitude', emoji: '🙏' },
  { id: '4', text: 'What worry feels heaviest on your mind?', category: 'Anxiety', emoji: '💭' },
  { id: '5', text: 'How did you show kindness to yourself today?', category: 'Self-worth', emoji: '💝' },
  { id: '6', text: 'What conversation do you keep replaying?', category: 'Relationships', emoji: '💬' },
  { id: '7', text: 'What accomplishment made you proud recently?', category: 'Work', emoji: '🎯' },
  { id: '8', text: 'What fear is holding you back right now?', category: 'Anxiety', emoji: '🌊' },
  { id: '9', text: 'How has someone surprised you lately?', category: 'Relationships', emoji: '🎁' },
  { id: '10', text: 'What quality do you admire most about yourself?', category: 'Self-worth', emoji: '⭐' },
  { id: '11', text: 'What task are you avoiding and why?', category: 'Work', emoji: '🔄' },
  { id: '12', text: 'What small moment brought you peace today?', category: 'Gratitude', emoji: '🕊️' },
];

const CATEGORY_COLORS = {
  'Gratitude': 'bg-gradient-to-r from-yellow-400/20 to-amber-300/20 border-yellow-400/30',
  'Anxiety': 'bg-gradient-to-r from-blue-400/20 to-indigo-300/20 border-blue-400/30',
  'Self-worth': 'bg-gradient-to-r from-pink-400/20 to-rose-300/20 border-pink-400/30',
  'Relationships': 'bg-gradient-to-r from-green-400/20 to-emerald-300/20 border-green-400/30',
  'Work': 'bg-gradient-to-r from-purple-400/20 to-violet-300/20 border-purple-400/30',
};

interface ReflectionPromptsProps {
  onPromptSelect: (prompt: string) => void;
}

export const ReflectionPrompts: React.FC<ReflectionPromptsProps> = ({ onPromptSelect }) => {
  const [currentPrompts, setCurrentPrompts] = useState<ReflectionPrompt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const refreshPrompts = () => {
    const shuffled = [...PROMPTS].sort(() => Math.random() - 0.5);
    setCurrentPrompts(shuffled.slice(0, 5));
    setCurrentIndex(0);
  };

  useEffect(() => {
    refreshPrompts();
  }, []);

  const nextPrompt = () => {
    setCurrentIndex((prev) => (prev + 1) % currentPrompts.length);
  };

  const prevPrompt = () => {
    setCurrentIndex((prev) => (prev - 1 + currentPrompts.length) % currentPrompts.length);
  };

  if (currentPrompts.length === 0) return null;

  const currentPrompt = currentPrompts[currentIndex];

  return (
    <Card className="bg-card border-border shadow-elegant">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Reflection Prompt</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshPrompts}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Card className={`${CATEGORY_COLORS[currentPrompt.category]} transition-all duration-300 hover:shadow-md`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{currentPrompt.emoji}</span>
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {currentPrompt.category}
                  </Badge>
                  <p className="text-foreground font-medium leading-relaxed">
                    {currentPrompt.text}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevPrompt}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextPrompt}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPromptSelect(currentPrompt.text)}
                  className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Use This
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-3 gap-1">
            {currentPrompts.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
