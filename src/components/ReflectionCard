import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Heart } from 'lucide-react';

interface ReflectionCardProps {
  reflection: string;
  mood: string;
  timestamp?: Date;
}

export const ReflectionCard: React.FC<ReflectionCardProps> = ({ 
  reflection, 
  mood, 
  timestamp = new Date() 
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card variant="glass" className="shadow-warm hover:shadow-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 glass-text-strong">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary drop-shadow-sm" />
            <span>AI Reflection</span>
          </div>
          <Heart className="h-4 w-4 text-primary ml-auto drop-shadow-sm" />
        </CardTitle>
        <p className="text-sm text-muted-foreground/80 glass-text">
          {formatTime(timestamp)} • Mood: {mood}
        </p>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="glass-text-strong leading-relaxed whitespace-pre-wrap">
            {reflection}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
