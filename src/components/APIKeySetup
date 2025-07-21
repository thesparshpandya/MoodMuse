import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
  hasApiKey: boolean;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet, hasApiKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [showInput, setShowInput] = useState(!hasApiKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      setShowInput(false);
    }
  };

  if (hasApiKey && !showInput) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Key className="h-4 w-4" />
              Google Gemini API key configured
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowInput(true)}
            >
              Change Key
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Google Gemini API Key Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            To use AI reflections, you'll need a Google Gemini API key. 
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-1 text-primary hover:underline"
            >
              Get your API key here
              <ExternalLink className="h-3 w-3" />
            </a>
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder="AIza..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="font-mono text-sm"
          />
          <Button type="submit" disabled={!apiKey.trim()} className="w-full">
            Save API Key
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground">
          Your API key is stored locally and never sent to our servers.
        </p>
      </CardContent>
    </Card>
  );
};
