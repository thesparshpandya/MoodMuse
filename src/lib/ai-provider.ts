export type AIProviderMode = 'api' | 'local';

export interface AIProviderConfig {
  mode: AIProviderMode;
  /** API key for the hosted provider (Gemini) */
  apiKey: string;
  /** Base URL of a local OpenAI-compatible server (Ollama, LM Studio, llama.cpp, ...) */
  baseUrl: string;
  /** Model name served locally */
  model: string;
}

const STORAGE_KEY = 'moodmuse_ai_provider';
const LEGACY_KEY = 'gemini_api_key';

export const GEMINI_MODEL = 'gemini-1.5-flash';
export const DEFAULT_LOCAL_BASE_URL = 'http://localhost:11434/v1';
export const DEFAULT_LOCAL_MODEL = 'llama3.1';

export const defaultAIConfig: AIProviderConfig = {
  mode: 'api',
  apiKey: '',
  baseUrl: DEFAULT_LOCAL_BASE_URL,
  model: DEFAULT_LOCAL_MODEL,
};

export function loadAIConfig(): AIProviderConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...defaultAIConfig, ...JSON.parse(raw) } as AIProviderConfig;
    }
  } catch (error) {
    console.error('Error loading AI provider config:', error);
  }

  // Migrate an older saved key
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy) {
    return { ...defaultAIConfig, apiKey: legacy };
  }
  return { ...defaultAIConfig };
}

export function saveAIConfig(config: AIProviderConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  if (config.mode === 'api' && config.apiKey) {
    localStorage.setItem(LEGACY_KEY, config.apiKey);
  }
}

export function isAIConfigured(config: AIProviderConfig | null): boolean {
  if (!config) return false;
  return config.mode === 'api'
    ? !!config.apiKey.trim()
    : !!config.baseUrl.trim() && !!config.model.trim();
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.trim().replace(/\/+$/, '');
}

export interface SimpleMessage {
  role: string;
  content: string;
}

async function generateWithGemini(config: AIProviderConfig, conversation: SimpleMessage[]) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${config.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: conversation.map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
        generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 1024 },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I'm here for you. Thank you for sharing with me."
  );
}

async function generateWithLocal(config: AIProviderConfig, conversation: SimpleMessage[]) {
  const response = await fetch(`${normalizeBaseUrl(config.baseUrl)}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: config.model,
      messages: conversation.map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
      temperature: 0.7,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return (
    data.choices?.[0]?.message?.content ||
    "I'm here for you. Thank you for sharing with me."
  );
}

export async function generateAIResponse(
  config: AIProviderConfig,
  conversation: SimpleMessage[]
): Promise<string> {
  return config.mode === 'local'
    ? generateWithLocal(config, conversation)
    : generateWithGemini(config, conversation);
}

/** Lightweight connectivity check for either provider. */
export async function validateAIConfig(config: AIProviderConfig): Promise<boolean> {
  try {
    if (config.mode === 'local') {
      const res = await fetch(`${normalizeBaseUrl(config.baseUrl)}/models`, {
        headers: config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : undefined,
      });
      if (res.ok) return true;
      // Some servers don't expose /models — fall back to a tiny completion
      await generateWithLocal(config, [{ role: 'user', content: 'Hi' }]);
      return true;
    }

    await generateWithGemini(config, [{ role: 'user', content: 'Hello' }]);
    return true;
  } catch (error) {
    console.error('AI provider validation failed:', error);
    return false;
  }
}

export function describeProvider(config: AIProviderConfig): string {
  return config.mode === 'local' ? `local model (${config.model})` : GEMINI_MODEL;
}
