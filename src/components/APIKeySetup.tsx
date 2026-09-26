import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Key, AlertCircle, ExternalLink, Cpu, Cloud } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AIProviderConfig,
  AIProviderMode,
  defaultAIConfig,
  DEFAULT_LOCAL_BASE_URL,
  DEFAULT_LOCAL_MODEL,
} from '@/lib/ai-provider';

interface ApiKeySetupProps {
  config?: AIProviderConfig;
  onConfigSet: (config: AIProviderConfig) => void;
  isConfigured: boolean;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({
  config,
  onConfigSet,
  isConfigured,
}) => {
  const current = config ?? defaultAIConfig;
  const [mode, setMode] = useState<AIProviderMode>(current.mode);
  const [apiKey, setApiKey] = useState(current.apiKey);
  const [baseUrl, setBaseUrl] = useState(current.baseUrl || DEFAULT_LOCAL_BASE_URL);
  const [model, setModel] = useState(current.model || DEFAULT_LOCAL_MODEL);
  const [showInput, setShowInput] = useState(!isConfigured);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'api' && !apiKey.trim()) return;
    if (mode === 'local' && (!baseUrl.trim() || !model.trim())) return;

    onConfigSet({
      mode,
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim(),
      model: model.trim(),
    });
    setShowInput(false);
  };

  if (isConfigured && !showInput) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {current.mode === 'local' ? (
                <Cpu className="h-4 w-4" />
              ) : (
                <Key className="h-4 w-4" />
              )}
              {current.mode === 'local'
                ? `Local model connected — ${current.model}`
                : 'API key configured'}
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowInput(true)}>
              Change
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
          Connect an AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={mode} onValueChange={(v) => setMode(v as AIProviderMode)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="local" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Local model
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <TabsContent value="api" className="mt-0 space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  To use AI reflections, add your API key.
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Get a key
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="api-key">API key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Paste your key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="local" className="mt-0 space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Run a model on your own machine with Ollama, LM Studio or any
                  OpenAI-compatible server, then point MoodMuse at it. Nothing leaves your
                  device.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="local-url">Server address</Label>
                <Input
                  id="local-url"
                  type="text"
                  placeholder={DEFAULT_LOCAL_BASE_URL}
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Ollama: http://localhost:11434/v1 · LM Studio: http://localhost:1234/v1
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="local-model">Model name</Label>
                <Input
                  id="local-model"
                  type="text"
                  placeholder={DEFAULT_LOCAL_MODEL}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="local-key">Access token (optional)</Label>
                <Input
                  id="local-key"
                  type="password"
                  placeholder="Only if your server requires one"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </TabsContent>

            <Button
              type="submit"
              className="w-full"
              disabled={
                mode === 'api' ? !apiKey.trim() : !baseUrl.trim() || !model.trim()
              }
            >
              {mode === 'local' ? 'Connect local model' : 'Save API key'}
            </Button>
          </form>
        </Tabs>

        <p className="text-xs text-muted-foreground">
          Your settings are stored locally and never sent to our servers.
        </p>
      </CardContent>
    </Card>
  );
};
