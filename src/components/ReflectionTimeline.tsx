import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, Pin, PinOff, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  detectedMood?: string;
  intensity?: number;
}

interface ReflectionTimelineProps {
  messages: ChatMessage[];
}

interface TimelineEntry {
  id: string;
  content: string;
  timestamp: Date;
  mood: string;
  intensity: number;
  snippet: string;
  isPinned: boolean;
}

export const ReflectionTimeline: React.FC<ReflectionTimelineProps> = React.memo(({ messages }) => {
  const [pinnedEntries, setPinnedEntries] = useState<Set<string>>(new Set());

  const timelineEntries = useMemo(() => {
    const userMessages = messages.filter(m => m.role === 'user');
    
    return userMessages.map((message): TimelineEntry => {
      const words = message.content.split(' ');
      const snippet = words.length > 15 
        ? words.slice(0, 15).join(' ') + '...'
        : message.content;

      // Simple mood detection based on keywords
      let mood = '😐';
      let intensity = 3;
      
      const content = message.content.toLowerCase();
      if (content.includes('happy') || content.includes('joy') || content.includes('great')) {
        mood = '😊';
        intensity = 4;
      } else if (content.includes('sad') || content.includes('down') || content.includes('upset')) {
        mood = '😔';
        intensity = 2;
      } else if (content.includes('angry') || content.includes('mad') || content.includes('furious')) {
        mood = '😡';
        intensity = 1;
      } else if (content.includes('anxious') || content.includes('worried') || content.includes('stress')) {
        mood = '😟';
        intensity = 2;
      } else if (content.includes('love') || content.includes('grateful') || content.includes('blessed')) {
        mood = '🥰';
        intensity = 5;
      }

      return {
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        mood,
        intensity,
        snippet,
        isPinned: pinnedEntries.has(message.id),
      };
    });
  }, [messages, pinnedEntries]);

  const togglePin = useCallback((entryId: string) => {
    const newPinned = new Set(pinnedEntries);
    if (newPinned.has(entryId)) {
      newPinned.delete(entryId);
    } else {
      newPinned.add(entryId);
    }
    setPinnedEntries(newPinned);
  }, [pinnedEntries]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodColor = (intensity: number) => {
    const colors = [
      'bg-red-100 border-red-300 text-red-800',
      'bg-orange-100 border-orange-300 text-orange-800',
      'bg-yellow-100 border-yellow-300 text-yellow-800',
      'bg-green-100 border-green-300 text-green-800',
      'bg-blue-100 border-blue-300 text-blue-800',
    ];
    return colors[intensity - 1] || colors[2];
  };

  // Get most frequent emotions
  const emotionAnalysis = useMemo(() => {
    const emotions: Record<string, number> = {};
    timelineEntries.forEach(entry => {
      emotions[entry.mood] = (emotions[entry.mood] || 0) + 1;
    });
    
    return Object.entries(emotions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }, [timelineEntries]);

  if (timelineEntries.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Entries Yet</h3>
          <p className="text-muted-foreground text-sm">
            Start journaling to see your reflection timeline
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Emotion Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5" />
            Your Emotional Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {emotionAnalysis.map(([emotion, count]) => (
              <Badge key={emotion} variant="secondary" className="text-sm">
                {emotion} {count}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {timelineEntries.length} entries • {pinnedEntries.size} pinned
          </p>
        </CardContent>
      </Card>

      {/* Timeline Entries */}
      <div className="space-y-4">
        {/* Pinned Entries First */}
        {timelineEntries.filter(entry => entry.isPinned).length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Pin className="h-4 w-4" />
              Pinned Reflections
            </h3>
            <div className="space-y-3">
              {timelineEntries
                .filter(entry => entry.isPinned)
                .map((entry) => (
                  <TimelineCard 
                    key={`pinned-${entry.id}`}
                    entry={entry}
                    onTogglePin={togglePin}
                    formatDate={formatDate}
                    getMoodColor={getMoodColor}
                  />
                ))}
            </div>
          </div>
        )}

        {/* All Entries */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">All Entries</h3>
          <div className="space-y-3">
            {timelineEntries
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((entry) => (
                <TimelineCard 
                  key={entry.id}
                  entry={entry}
                  onTogglePin={togglePin}
                  formatDate={formatDate}
                  getMoodColor={getMoodColor}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
});

interface TimelineCardProps {
  entry: TimelineEntry;
  onTogglePin: (id: string) => void;
  formatDate: (date: Date) => string;
  getMoodColor: (intensity: number) => string;
}

const TimelineCard: React.FC<TimelineCardProps> = React.memo(({ 
  entry, 
  onTogglePin, 
  formatDate, 
  getMoodColor 
}) => (
  <Card className={`bg-card border-border transition-all duration-200 hover:shadow-md ${
    entry.isPinned ? 'ring-1 ring-primary/30' : ''
  }`}>
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{entry.mood}</span>
          <div>
            <Badge className={getMoodColor(entry.intensity)}>
              Intensity {entry.intensity}/5
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(entry.timestamp)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTogglePin(entry.id)}
          className="h-8 w-8 p-0"
        >
          {entry.isPinned ? (
            <PinOff className="h-4 w-4 text-primary" />
          ) : (
            <Pin className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <p className="text-sm text-foreground mb-3 leading-relaxed">
        {entry.snippet}
      </p>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Eye className="h-3 w-3" />
            Read Full Entry
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {entry.mood} Entry from {formatDate(entry.timestamp)}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96 pr-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </p>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </CardContent>
  </Card>
));
