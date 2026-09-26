import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Quote,
  Mic,
  MicOff,
  Type,
  Send,
  Loader2
} from 'lucide-react';
import { useVoiceToText } from '@/hooks/useVoiceToText';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  selectedMood: string | null;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  selectedMood,
  placeholder = "What's on your mind today? Write about your feelings, experiences, or anything you'd like to reflect on..."
}) => {
  const [isRichMode, setIsRichMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const { 
    isListening, 
    transcript, 
    isSupported: isVoiceSupported,
    startListening, 
    stopListening,
    resetTranscript 
  } = useVoiceToText({
    onResult: (text) => {
      const newValue = value + (value ? ' ' : '') + text;
      onChange(newValue);
      resetTranscript();
    }
  });

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && selectedMood) {
      onSubmit();
    }
  };

  const formatText = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleRichTextChange = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      // Convert HTML to plain text for storage
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      onChange(tempDiv.textContent || tempDiv.innerText || '');
    }
  }, [onChange]);

  const toggleRichMode = () => {
    setIsRichMode(!isRichMode);
    // Focus appropriate editor after toggle
    setTimeout(() => {
      if (!isRichMode && editorRef.current) {
        editorRef.current.focus();
      } else if (isRichMode && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Share your thoughts</h3>
        <div className="flex items-center gap-2">
          {isVoiceSupported && (
            <Button
              type="button"
              onClick={handleVoiceToggle}
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2",
                isListening && "bg-destructive/10 border-destructive/20"
              )}
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Voice
                </>
              )}
            </Button>
          )}
          
          <Button
            type="button"
            onClick={toggleRichMode}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Type className="h-4 w-4" />
            {isRichMode ? 'Plain' : 'Rich'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRichMode ? (
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              {/* Rich text toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-3 border-b border-border/50">
                <Button
                  type="button"
                  onClick={() => formatText('bold')}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => formatText('italic')}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => formatText('underline')}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border/50 mx-1" />
                <Button
                  type="button"
                  onClick={() => formatText('insertUnorderedList')}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => formatText('insertOrderedList')}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => formatText('formatBlock', 'blockquote')}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Quote className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Rich text editor */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleRichTextChange}
                className="min-h-32 p-3 outline-none text-sm text-foreground"
                style={{ whiteSpace: 'pre-wrap' }}
                suppressContentEditableWarning={true}
                data-placeholder={placeholder}
              >
                {value}
              </div>
            </CardContent>
          </Card>
        ) : (
          <textarea
            ref={textareaRef}
            value={value + (transcript ? ` ${transcript}` : '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex min-h-32 w-full rounded-md border border-border bg-card/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            disabled={isLoading}
          />
        )}

        {isListening && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            Listening... {transcript && `"${transcript}"`}
          </div>
        )}

        <Button
          type="submit"
          disabled={!value.trim() || !selectedMood || isLoading}
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
