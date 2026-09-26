export type MoodType = 'happy' | 'sad' | 'anxious' | 'angry' | 'calm' | 'neutral';

export interface MoodKeywords {
  [key: string]: string[];
}

export const MOOD_KEYWORDS: MoodKeywords = {
  happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'fantastic', 'grateful', 'blessed', 'cheerful', 'delighted'],
  sad: ['sad', 'down', 'depressed', 'hurt', 'cry', 'tears', 'lonely', 'empty', 'disappointed', 'grief', 'melancholy'],
  anxious: ['anxious', 'worried', 'nervous', 'stress', 'panic', 'scared', 'fear', 'overwhelmed', 'tense', 'restless'],
  angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'rage', 'upset', 'irritated', 'livid', 'outraged'],
  calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen', 'balanced', 'centered', 'content', 'composed']
};

export const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: '😊',
  sad: '😢',
  anxious: '😰',
  angry: '😠',
  calm: '😌',
  neutral: '😐'
};

export const MOOD_COLORS: Record<MoodType, string> = {
  happy: 'hsl(43 96% 56%)', // Warm yellow
  sad: 'hsl(200 98% 39%)', // Deep blue
  anxious: 'hsl(25 95% 53%)', // Orange
  angry: 'hsl(0 84% 60%)', // Red
  calm: 'hsl(142 71% 45%)', // Green
  neutral: 'hsl(210 12% 55%)' // Gray
};

export const MOOD_BG_COLORS: Record<MoodType, string> = {
  happy: 'bg-amber-100 dark:bg-amber-900/20 border-amber-300/50 dark:border-amber-700/50 text-amber-900 dark:text-amber-100',
  sad: 'bg-blue-100 dark:bg-blue-900/20 border-blue-300/50 dark:border-blue-700/50 text-blue-900 dark:text-blue-100',
  anxious: 'bg-orange-100 dark:bg-orange-900/20 border-orange-300/50 dark:border-orange-700/50 text-orange-900 dark:text-orange-100',
  angry: 'bg-red-100 dark:bg-red-900/20 border-red-300/50 dark:border-red-700/50 text-red-900 dark:text-red-100',
  calm: 'bg-emerald-100 dark:bg-emerald-900/20 border-emerald-300/50 dark:border-emerald-700/50 text-emerald-900 dark:text-emerald-100',
  neutral: 'bg-muted/50 border-border/50 text-muted-foreground'
};

/**
 * Detects the dominant mood from text content using keyword analysis
 */
export const detectMood = (text: string): MoodType => {
  const lowerText = text.toLowerCase();
  const moodScores: Record<string, number> = {};

  Object.entries(MOOD_KEYWORDS).forEach(([mood, keywords]) => {
    moodScores[mood] = keywords.filter(keyword => 
      lowerText.includes(keyword)
    ).length;
  });

  const dominantMood = Object.entries(moodScores).reduce((a, b) => 
    moodScores[a[0]] > moodScores[b[0]] ? a : b
  );

  return dominantMood[1] > 0 ? dominantMood[0] as MoodType : 'neutral';
};

/**
 * Calculates mood intensity based on intensity words and text length
 */
export const calculateIntensity = (text: string): number => {
  const intensityWords = [
    'very', 'extremely', 'really', 'so', 'incredibly', 'absolutely',
    'completely', 'totally', 'utterly', 'deeply', 'profoundly'
  ];
  
  const lowerText = text.toLowerCase();
  const baseIntensity = 3;
  const intensityBoost = intensityWords.filter(word => 
    lowerText.includes(word)
  ).length;
  
  // Factor in text length (longer entries might indicate stronger emotions)
  const lengthFactor = Math.min(1, text.length / 200);
  
  return Math.min(5, Math.max(1, baseIntensity + intensityBoost + lengthFactor));
};

/**
 * Returns the emoji for a given mood
 */
export const getMoodEmoji = (mood: string): string => {
  return MOOD_EMOJIS[mood as MoodType] || MOOD_EMOJIS.neutral;
};

/**
 * Returns theme-aware background colors for a mood
 */
export const getMoodColor = (mood: string): string => {
  return MOOD_BG_COLORS[mood as MoodType] || MOOD_BG_COLORS.neutral;
};

/**
 * Returns a mood description for accessibility
 */
export const getMoodDescription = (mood: string, intensity: number): string => {
  const intensityLevel = intensity <= 2 ? 'mild' : intensity >= 4 ? 'intense' : 'moderate';
  return `${intensityLevel} ${mood}`;
};

/**
 * Groups messages by date and calculates daily mood statistics
 */
export const groupMessagesByDate = (messages: Array<{
  content: string;
  timestamp: Date;
  role: string;
}>) => {
  const userMessages = messages.filter(m => m.role === 'user');
  const dailyMoods: Record<string, { moods: string[], intensities: number[] }> = {};

  userMessages.forEach(message => {
    const dateKey = message.timestamp.toDateString();
    const mood = detectMood(message.content);
    const intensity = calculateIntensity(message.content);

    if (!dailyMoods[dateKey]) {
      dailyMoods[dateKey] = { moods: [], intensities: [] };
    }

    dailyMoods[dateKey].moods.push(mood);
    dailyMoods[dateKey].intensities.push(intensity);
  });

  return dailyMoods;
};
