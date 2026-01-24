import React, { createContext, useContext, useState, useCallback } from 'react';

interface DemoMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DemoContextType {
  isDemoMode: boolean;
  demoMessagesUsed: number;
  maxDemoMessages: number;
  enableDemoMode: () => void;
  exitDemoMode: () => void;
  getDemoResponse: (userMessage: string) => string;
  canUseDemoMode: boolean;
}

const DEMO_RESPONSES = [
  {
    trigger: ['anxious', 'stressed', 'worried', 'nervous'],
    response: `**I hear you.** Anxiety can feel overwhelming, but recognizing it is already a powerful first step.

> Sometimes our minds try to protect us by imagining every possible scenario, even when we don't need that protection right now.

What's one small thing that usually helps you feel more grounded? Even remembering that thing can be calming.`
  },
  {
    trigger: ['sad', 'down', 'depressed', 'lonely'],
    response: `**It takes courage to acknowledge when we're hurting.** Thank you for trusting this space with your feelings.

> Sadness, like all emotions, carries important messages. It often points to things we value deeply.

What do you think your sadness might be telling you today? There's no wrong answer here.`
  },
  {
    trigger: ['happy', 'great', 'amazing', 'good', 'excited'],
    response: `**What a beautiful energy you're carrying!** ✨ Positive emotions deserve to be savored.

> Notice how this feeling shows up in your body. Where do you feel this joy? Chest? Face? Hands?

I'm curious — what sparked this lightness in you today?`
  },
  {
    trigger: ['angry', 'frustrated', 'annoyed', 'mad'],
    response: `**Anger is valid.** It often signals that something important to us has been crossed or threatened.

> The heat of anger can actually be channeled into clarity about what matters most to you.

What boundary or value feels like it's being pushed right now? Let's explore that together.`
  },
  {
    trigger: ['tired', 'exhausted', 'burnt out', 'overwhelmed'],
    response: `**Your exhaustion is real, and it matters.** In a world that glorifies constant productivity, rest is radical self-care.

> Even acknowledging that you're tired is a form of honoring yourself.

What's one thing you could let go of today, even temporarily? Sometimes we carry more than we realize.`
  }
];

const DEFAULT_RESPONSE = `**Thank you for sharing.** Whatever you're feeling right now is completely valid.

> Every emotion carries wisdom, even the uncomfortable ones. Your willingness to explore them shows real emotional intelligence.

What else is on your mind? I'm here to listen, reflect, and help you understand yourself better.`;

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoMessagesUsed, setDemoMessagesUsed] = useState(0);
  const maxDemoMessages = 3;

  const enableDemoMode = useCallback(() => {
    setIsDemoMode(true);
    setDemoMessagesUsed(0);
  }, []);

  const exitDemoMode = useCallback(() => {
    setIsDemoMode(false);
  }, []);

  const getDemoResponse = useCallback((userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Find matching response based on triggers
    for (const demo of DEMO_RESPONSES) {
      if (demo.trigger.some(trigger => lowerMessage.includes(trigger))) {
        setDemoMessagesUsed(prev => prev + 1);
        return demo.response;
      }
    }
    
    setDemoMessagesUsed(prev => prev + 1);
    return DEFAULT_RESPONSE;
  }, []);

  const canUseDemoMode = demoMessagesUsed < maxDemoMessages;

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      demoMessagesUsed,
      maxDemoMessages,
      enableDemoMode,
      exitDemoMode,
      getDemoResponse,
      canUseDemoMode
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};
