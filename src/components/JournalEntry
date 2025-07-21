import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface JournalEntryProps {
  entry: string;
  onEntryChange: (entry: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  selectedMood: string | null;
}

export const JournalEntry: React.FC<JournalEntryProps> = ({
  entry,
  onEntryChange,
  onSubmit,
  isLoading,
  selectedMood
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entry.trim() && selectedMood) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Share your thoughts</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={entry}
          onChange={(e) => onEntryChange(e.target.value)}
          placeholder="What's on your mind today? Write about your feelings, experiences, or anything you'd like to reflect on..."
          className="min-h-32 resize-none border-border bg-card/50 backdrop-blur-sm"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!entry.trim() || !selectedMood || isLoading}
          className="w-full bg-warm-gradient hover:opacity-90 transition-opacity"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Reflecting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Get AI Reflection
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
