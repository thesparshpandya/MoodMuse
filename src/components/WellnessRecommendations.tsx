import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { detectMood, calculateIntensity, MoodType } from '@/lib/mood-utils';
import { ActivityModal } from './ActivityModal';
import { ActivityType } from '@/types/activity';
import { Heart, Lightbulb, Activity, Coffee, Music, Book } from 'lucide-react';

interface ChatMessage {
  content: string;
  timestamp: Date;
  role: string;
}

interface WellnessRecommendationsProps {
  messages: ChatMessage[];
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'mindfulness' | 'physical' | 'social' | 'creative';
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions?: string[];
  benefits?: string[];
  tips?: string[];
}

const MOOD_RECOMMENDATIONS: Record<MoodType, Recommendation[]> = {
  anxious: [
    {
      id: 'breathing',
      title: '4-7-8 Breathing Exercise',
      description: 'Inhale for 4, hold for 7, exhale for 8. Repeat 4 times to calm your nervous system.',
      icon: <Heart className="h-4 w-4" />,
      category: 'mindfulness',
      duration: '5 min',
      difficulty: 'easy',
      instructions: [
        'Find a comfortable seated position',
        'Place the tip of your tongue behind your upper teeth',
        'Inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts'
      ],
      benefits: ['Reduces anxiety and stress', 'Calms the nervous system', 'Improves focus'],
      tips: ['Don\'t worry if you feel lightheaded at first', 'Focus on making the exhale longer']
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding Technique',
      description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
      icon: <Lightbulb className="h-4 w-4" />,
      category: 'mindfulness',
      duration: '10 min',
      difficulty: 'easy'
    },
    {
      id: 'walk',
      title: 'Mindful Walking',
      description: 'Take a slow, conscious walk focusing on each step and your surroundings.',
      icon: <Activity className="h-4 w-4" />,
      category: 'physical',
      duration: '15 min',
      difficulty: 'easy'
    }
  ],
  sad: [
    {
      id: 'gratitude',
      title: 'Gratitude Practice',
      description: 'Write down 3 things you\'re grateful for, no matter how small.',
      icon: <Heart className="h-4 w-4" />,
      category: 'mindfulness',
      duration: '10 min',
      difficulty: 'easy'
    },
    {
      id: 'music',
      title: 'Uplifting Music',
      description: 'Listen to your favorite upbeat songs or discover new mood-boosting music.',
      icon: <Music className="h-4 w-4" />,
      category: 'creative',
      duration: '20 min',
      difficulty: 'easy'
    },
    {
      id: 'sunlight',
      title: 'Sunlight Exposure',
      description: 'Spend time outdoors or by a sunny window to boost vitamin D and mood.',
      icon: <Activity className="h-4 w-4" />,
      category: 'physical',
      duration: '15 min',
      difficulty: 'easy'
    }
  ],
  angry: [
    {
      id: 'journaling',
      title: 'Anger Journaling',
      description: 'Write freely about what\'s bothering you without censoring yourself.',
      icon: <Book className="h-4 w-4" />,
      category: 'creative',
      duration: '15 min',
      difficulty: 'easy'
    },
    {
      id: 'exercise',
      title: 'Physical Release',
      description: 'Do jumping jacks, push-ups, or go for a run to release tension.',
      icon: <Activity className="h-4 w-4" />,
      category: 'physical',
      duration: '20 min',
      difficulty: 'medium'
    },
    {
      id: 'timeout',
      title: 'Cooling Down',
      description: 'Take a break from the situation. Count to 10 or practice deep breathing.',
      icon: <Heart className="h-4 w-4" />,
      category: 'mindfulness',
      duration: '5 min',
      difficulty: 'easy'
    }
  ],
  happy: [
    {
      id: 'share',
      title: 'Share the Joy',
      description: 'Call a friend or family member to share your positive feelings.',
      icon: <Heart className="h-4 w-4" />,
      category: 'social',
      duration: '15 min',
      difficulty: 'easy'
    },
    {
      id: 'create',
      title: 'Creative Expression',
      description: 'Channel your positive energy into art, writing, or music.',
      icon: <Book className="h-4 w-4" />,
      category: 'creative',
      duration: '30 min',
      difficulty: 'medium'
    },
    {
      id: 'celebrate',
      title: 'Mindful Celebration',
      description: 'Take a moment to fully appreciate and savor this positive feeling.',
      icon: <Lightbulb className="h-4 w-4" />,
      category: 'mindfulness',
      duration: '10 min',
      difficulty: 'easy'
    }
  ],
  calm: [
    {
      id: 'meditation',
      title: 'Meditation Practice',
      description: 'Extend this peaceful state with a guided meditation or mindfulness exercise.',
      icon: <Heart className="h-4 w-4" />,
      category: 'mindfulness',
      duration: '20 min',
      difficulty: 'medium'
    },
    {
      id: 'reading',
      title: 'Mindful Reading',
      description: 'Read something inspiring or educational while maintaining this calm state.',
      icon: <Book className="h-4 w-4" />,
      category: 'creative',
      duration: '30 min',
      difficulty: 'easy'
    },
    {
      id: 'planning',
      title: 'Gentle Planning',
      description: 'Use this clarity to set intentions or plan positive activities.',
      icon: <Lightbulb className="h-4 w-4" />,
      category: 'mindfulness',
      duration: '15 min',
      difficulty: 'easy'
    }
  ],
  neutral: [
    {
      id: 'explore',
      title: 'Mood Exploration',
      description: 'Take time to check in with yourself and explore what you\'re truly feeling.',
      icon: <Lightbulb className="h-4 w-4" />,
      category: 'mindfulness',
      duration: '10 min',
      difficulty: 'easy'
    },
    {
      id: 'movement',
      title: 'Gentle Movement',
      description: 'Try some light stretching or yoga to connect with your body.',
      icon: <Activity className="h-4 w-4" />,
      category: 'physical',
      duration: '15 min',
      difficulty: 'easy'
    },
    {
      id: 'inspiration',
      title: 'Seek Inspiration',
      description: 'Watch an inspiring video, read quotes, or listen to a motivating podcast.',
      icon: <Book className="h-4 w-4" />,
      category: 'creative',
      duration: '20 min',
      difficulty: 'easy'
    }
  ]
};

export const WellnessRecommendations: React.FC<WellnessRecommendationsProps> = ({ messages }) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const recommendations = useMemo(() => {
    const recentMessages = messages
      .filter(m => m.role === 'user')
      .slice(-5); // Get last 5 messages

    if (recentMessages.length === 0) {
      return MOOD_RECOMMENDATIONS.neutral;
    }

    // Detect dominant mood from recent messages
    const moodCounts: Record<MoodType, number> = {
      happy: 0, sad: 0, anxious: 0, angry: 0, calm: 0, neutral: 0
    };

    let totalIntensity = 0;
    recentMessages.forEach(message => {
      const mood = detectMood(message.content);
      moodCounts[mood]++;
      totalIntensity += calculateIntensity(message.content);
    });

    const dominantMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0] as MoodType] > moodCounts[b[0] as MoodType] ? a : b
    )[0] as MoodType;

    const avgIntensity = totalIntensity / recentMessages.length;

    // Get recommendations based on mood and intensity
    let recs = MOOD_RECOMMENDATIONS[dominantMood];
    
    // If high intensity, prioritize calming activities
    if (avgIntensity > 0.7 && dominantMood !== 'calm') {
      recs = [...MOOD_RECOMMENDATIONS.anxious.slice(0, 1), ...recs.slice(0, 2)];
    }

    return recs.slice(0, 3);
  }, [messages]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mindfulness': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'physical': return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'social': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
      case 'creative': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
      case 'hard': return 'bg-red-500/10 text-red-700 dark:text-red-300';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const handleActivityClick = (recommendation: Recommendation) => {
    // Convert recommendation to ActivityType
    const activity: ActivityType = {
      id: recommendation.id,
      title: recommendation.title,
      description: recommendation.description,
      icon: '🧘', // Default icon as string
      category: recommendation.category,
      duration: parseInt(recommendation.duration.split(' ')[0]), // Extract number from "5 min"
      difficulty: recommendation.difficulty,
      instructions: recommendation.instructions,
      benefits: recommendation.benefits,
      tips: recommendation.tips
    };
    
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Wellness Recommendations</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                {rec.icon}
                <CardTitle className="text-base">{rec.title}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Badge className={getCategoryColor(rec.category)} variant="secondary">
                  {rec.category}
                </Badge>
                <Badge className={getDifficultyColor(rec.difficulty)} variant="secondary">
                  {rec.difficulty}
                </Badge>
                <Badge variant="outline">{rec.duration}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
              <Button 
                size="sm" 
                className="w-full glass-button" 
                onClick={() => handleActivityClick(rec)}
              >
                Try This Activity
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Daily Wellness Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Drink plenty of water throughout the day</li>
            <li>• Take regular breaks from screens</li>
            <li>• Practice deep breathing when feeling stressed</li>
            <li>• Connect with nature, even if just for a few minutes</li>
            <li>• Celebrate small wins and progress</li>
            <li>• Be kind to yourself - you're doing your best</li>
          </ul>
        </CardContent>
      </Card>

      <ActivityModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivity(null);
        }}
      />
    </div>
  );
};
