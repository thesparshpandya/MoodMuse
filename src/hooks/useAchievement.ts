import { useState, useCallback, useEffect } from 'react';
import { Achievement } from '@/components/AchievementModal';

const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  {
    id: 'first_entry',
    title: 'First Steps',
    description: 'You started your emotional wellness journey. The first step is always the bravest.',
    emoji: '🌱',
    category: 'entries',
    rarity: 'common',
  },
  {
    id: 'streak_3',
    title: 'Building Momentum',
    description: '3 days of consistent journaling. You\'re creating a powerful habit.',
    emoji: '🔥',
    category: 'streak',
    rarity: 'common',
  },
  {
    id: 'streak_7',
    title: 'Weekly Warrior',
    description: '7 days straight! A full week of self-reflection and growth.',
    emoji: '⭐',
    category: 'streak',
    rarity: 'rare',
  },
  {
    id: 'streak_14',
    title: 'Fortnight Focus',
    description: '14 days of emotional awareness. You\'re developing deep insight.',
    emoji: '💎',
    category: 'streak',
    rarity: 'rare',
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: '30 days of dedication. Your emotional intelligence is flourishing.',
    emoji: '🏆',
    category: 'streak',
    rarity: 'epic',
  },
  {
    id: 'streak_100',
    title: 'Centurion',
    description: '100 days! You\'ve mastered the art of self-reflection.',
    emoji: '🌟',
    category: 'streak',
    rarity: 'legendary',
  },
  
  // Entry count achievements
  {
    id: 'entries_10',
    title: 'Dedicated Writer',
    description: '10 journal entries. Your thoughts are painting a beautiful story.',
    emoji: '✍️',
    category: 'entries',
    rarity: 'common',
  },
  {
    id: 'entries_50',
    title: 'Journal Journeyman',
    description: '50 entries of self-discovery. You\'re truly committed to growth.',
    emoji: '📚',
    category: 'entries',
    rarity: 'rare',
  },
  {
    id: 'entries_100',
    title: 'Story Weaver',
    description: '100 entries! You\'ve created a rich tapestry of your inner world.',
    emoji: '🎭',
    category: 'entries',
    rarity: 'epic',
  },
  
  // Wellness achievements
  {
    id: 'first_activity',
    title: 'Wellness Explorer',
    description: 'Completed your first wellness activity. Self-care is the best care.',
    emoji: '🧘',
    category: 'wellness',
    rarity: 'common',
  },
  {
    id: 'activities_10',
    title: 'Mindfulness Maven',
    description: '10 wellness activities completed. You\'re prioritizing your wellbeing.',
    emoji: '🌸',
    category: 'wellness',
    rarity: 'rare',
  },
  
  // Growth achievements
  {
    id: 'mood_improvement',
    title: 'Rising Spirit',
    description: 'Noticed a positive mood shift. Your self-awareness is working.',
    emoji: '🌈',
    category: 'growth',
    rarity: 'common',
  },
  {
    id: 'insight_generated',
    title: 'Pattern Seeker',
    description: 'Your first AI insight was generated. Discovery awaits.',
    emoji: '🔮',
    category: 'growth',
    rarity: 'common',
  },
];

const STORAGE_KEY = 'moodmuse_achievements';

interface AchievementState {
  unlockedIds: string[];
  lastUnlocked: string | null;
  showModal: boolean;
}

export const useAchievements = () => {
  const [state, setState] = useState<AchievementState>({
    unlockedIds: [],
    lastUnlocked: null,
    showModal: false,
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, unlockedIds: parsed.unlockedIds || [] }));
      } catch (error) {
        console.error('Error loading achievements:', error);
      }
    }
  }, []);

  // Save to localStorage
  const saveAchievements = useCallback((ids: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ unlockedIds: ids }));
  }, []);

  // Unlock an achievement
  const unlockAchievement = useCallback((achievementId: string) => {
    setState(prev => {
      if (prev.unlockedIds.includes(achievementId)) {
        return prev; // Already unlocked
      }
      
      const newUnlockedIds = [...prev.unlockedIds, achievementId];
      saveAchievements(newUnlockedIds);
      
      return {
        unlockedIds: newUnlockedIds,
        lastUnlocked: achievementId,
        showModal: true,
      };
    });
  }, [saveAchievements]);

  // Check and unlock achievements based on stats
  const checkAchievements = useCallback((stats: {
    totalEntries?: number;
    currentStreak?: number;
    activitiesCompleted?: number;
    insightsGenerated?: number;
    moodImproved?: boolean;
  }) => {
    const { totalEntries = 0, currentStreak = 0, activitiesCompleted = 0, insightsGenerated = 0, moodImproved = false } = stats;

    // Entry achievements
    if (totalEntries >= 1) unlockAchievement('first_entry');
    if (totalEntries >= 10) unlockAchievement('entries_10');
    if (totalEntries >= 50) unlockAchievement('entries_50');
    if (totalEntries >= 100) unlockAchievement('entries_100');

    // Streak achievements
    if (currentStreak >= 3) unlockAchievement('streak_3');
    if (currentStreak >= 7) unlockAchievement('streak_7');
    if (currentStreak >= 14) unlockAchievement('streak_14');
    if (currentStreak >= 30) unlockAchievement('streak_30');
    if (currentStreak >= 100) unlockAchievement('streak_100');

    // Wellness achievements
    if (activitiesCompleted >= 1) unlockAchievement('first_activity');
    if (activitiesCompleted >= 10) unlockAchievement('activities_10');

    // Growth achievements
    if (insightsGenerated >= 1) unlockAchievement('insight_generated');
    if (moodImproved) unlockAchievement('mood_improvement');
  }, [unlockAchievement]);

  // Close the modal
  const closeModal = useCallback(() => {
    setState(prev => ({ ...prev, showModal: false }));
  }, []);

  // Get the current achievement to display
  const currentAchievement = state.lastUnlocked 
    ? ACHIEVEMENTS.find(a => a.id === state.lastUnlocked) || null
    : null;

  // Get all unlocked achievements
  const unlockedAchievements = ACHIEVEMENTS.filter(a => 
    state.unlockedIds.includes(a.id)
  );

  // Get all achievements with unlock status
  const allAchievements = ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: state.unlockedIds.includes(a.id),
  }));

  return {
    currentAchievement,
    showModal: state.showModal,
    closeModal,
    checkAchievements,
    unlockedAchievements,
    allAchievements,
    unlockAchievement,
  };
};
