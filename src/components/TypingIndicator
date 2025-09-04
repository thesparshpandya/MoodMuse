import React from 'react';
import { Brain } from 'lucide-react';

interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border ${className}`}>
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-sm text-muted-foreground">MoodMuse is thinking</span>
      </div>
      
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};
