import React from 'react';
import { Keyboard, Command, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
}

const formatShortcutKey = (shortcut: KeyboardShortcut): string => {
  const parts = [];
  
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.shiftKey) parts.push('Shift');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.metaKey) parts.push('⌘');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(' + ');
};

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ shortcuts }) => {
  const enabledShortcuts = shortcuts.filter(s => !s.disabled);
  
  if (enabledShortcuts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Keyboard className="h-5 w-5" />
          Keyboard Shortcuts
        </CardTitle>
        <CardDescription>
          Use these shortcuts to navigate MoodMuse faster
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enabledShortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-foreground">{shortcut.description}</span>
            <Badge variant="secondary" className="font-mono text-xs">
              {formatShortcutKey(shortcut)}
            </Badge>
          </div>
        ))}
        
        <Separator className="my-4" />
        
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="mb-1">
              <strong>Pro tip:</strong> Shortcuts won't work when typing in text fields.
            </p>
            <p>
              Press <Badge variant="outline" className="text-xs">Ctrl + Enter</Badge> to send messages quickly.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Compact version for inline display
export const KeyboardShortcutsBadge: React.FC<{ shortcuts: KeyboardShortcut[] }> = ({ 
  shortcuts 
}) => {
  const enabledCount = shortcuts.filter(s => !s.disabled).length;
  
  if (enabledCount === 0) return null;
  
  return (
    <Badge variant="outline" className="text-xs">
      <Keyboard className="h-3 w-3 mr-1" />
      {enabledCount} shortcut{enabledCount !== 1 ? 's' : ''} available
    </Badge>
  );
};
