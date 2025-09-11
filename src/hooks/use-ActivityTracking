import { useState, useEffect, useCallback } from 'react';
import { ActivitySession, ActivityProgress, ActivityStreak, ActivityBadge, UserActivityData, ActivityType, MoodRating } from '@/types/activity';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEYS = {
  ACTIVITY_DATA: 'moodmuse_activity_data',
} as const;

const DEFAULT_ACTIVITY_DATA: UserActivityData = {
  sessions: [],
  progress: {},
  streaks: {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: '',
    totalActiveDays: 0,
    activitiesPerDay: {}
  },
  badges: [],
  preferences: {
    preferredCategories: ['mindfulness'],
    preferredDifficulty: 'easy',
    defaultDuration: 10,
    focusModeDefault: false
  }
};

export const useActivityTracking = () => {
  const [activityData, setActivityData] = useState<UserActivityData>(DEFAULT_ACTIVITY_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY_DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const processedData = {
          ...parsed,
          sessions: parsed.sessions?.map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : undefined,
            moodRating: {
              ...session.moodRating,
              timestamp: new Date(session.moodRating.timestamp)
            }
          })) || [],
          badges: parsed.badges?.map((badge: any) => ({
            ...badge,
            unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined
          })) || []
        };
        setActivityData(processedData);
      }
    } catch (error) {
      console.error('Error loading activity data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage
  const saveData = useCallback((data: UserActivityData) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_DATA, JSON.stringify(data));
      setActivityData(data);
    } catch (error) {
      console.error('Error saving activity data:', error);
    }
  }, []);

  // Start an activity session
  const startActivity = useCallback((activity: ActivityType, beforeMood: number, customizations?: any) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: ActivitySession = {
      id: sessionId,
      activityId: activity.id,
      startTime: new Date(),
      completed: false,
      moodRating: {
        before: beforeMood,
        timestamp: new Date()
      },
      customizations
    };

    const updatedData = {
      ...activityData,
      sessions: [...activityData.sessions, newSession]
    };

    saveData(updatedData);
    return sessionId;
  }, [activityData, saveData]);

  // Complete an activity session
  const completeActivity = useCallback((sessionId: string, afterMood: number, notes?: string) => {
    const sessionIndex = activityData.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return;

    const session = activityData.sessions[sessionIndex];
    const completedSession: ActivitySession = {
      ...session,
      endTime: new Date(),
      completed: true,
      moodRating: {
        ...session.moodRating,
        after: afterMood
      },
      effectiveness: calculateEffectiveness(session.moodRating.before, afterMood),
      notes
    };

    const updatedSessions = [...activityData.sessions];
    updatedSessions[sessionIndex] = completedSession;

    // Update progress
    const progress = updateActivityProgress(activityData.progress, completedSession);
    
    // Update streaks
    const streaks = updateActivityStreak(activityData.streaks);
    
    // Check for new badges
    const { badges, newBadges } = checkForNewBadges(activityData, updatedSessions, progress, streaks);

    const updatedData = {
      ...activityData,
      sessions: updatedSessions,
      progress,
      streaks,
      badges
    };

    saveData(updatedData);

    // Show achievement notifications
    if (newBadges.length > 0) {
      newBadges.forEach(badge => {
        toast({
          title: `🏆 Badge Unlocked: ${badge.title}`,
          description: badge.description,
        });
      });
    }

    // Show mood improvement feedback
    const improvement = afterMood - session.moodRating.before;
    if (improvement > 2) {
      toast({
        title: "🌟 Great Progress!",
        description: `This activity improved your mood by ${improvement} points!`,
      });
    }

    return completedSession;
  }, [activityData, saveData, toast]);

  // Calculate effectiveness from mood improvement
  const calculateEffectiveness = (beforeMood: number, afterMood: number): number => {
    const improvement = afterMood - beforeMood;
    const maxImprovement = 10 - beforeMood; // Maximum possible improvement
    const effectiveness = maxImprovement > 0 ? (improvement / maxImprovement) * 100 : 0;
    return Math.max(0, Math.min(100, effectiveness));
  };

  // Update activity progress
  const updateActivityProgress = (currentProgress: Record<string, ActivityProgress>, session: ActivitySession): Record<string, ActivityProgress> => {
    const existing = currentProgress[session.activityId] || {
      activityId: session.activityId,
      totalCompletions: 0,
      totalTime: 0,
      averageEffectiveness: 0,
      streakDays: 0
    };

    const sessionDuration = session.endTime && session.startTime
      ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))
      : 0;

    const totalEffectiveness = (existing.averageEffectiveness * existing.totalCompletions) + (session.effectiveness || 0);
    const newCompletions = existing.totalCompletions + 1;

    const updated = {
      ...existing,
      totalCompletions: newCompletions,
      totalTime: existing.totalTime + sessionDuration,
      averageEffectiveness: totalEffectiveness / newCompletions,
      lastCompleted: session.endTime,
      personalBest: {
        longestSession: Math.max(existing.personalBest?.longestSession || 0, sessionDuration),
        bestMoodImprovement: Math.max(
          existing.personalBest?.bestMoodImprovement || 0,
          (session.moodRating.after || 0) - session.moodRating.before
        )
      }
    };

    return {
      ...currentProgress,
      [session.activityId]: updated
    };
  };

  // Update activity streak
  const updateActivityStreak = (currentStreak: ActivityStreak): ActivityStreak => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    // Check if already completed activity today
    if (currentStreak.activitiesPerDay[today]) {
      return {
        ...currentStreak,
        activitiesPerDay: {
          ...currentStreak.activitiesPerDay,
          [today]: currentStreak.activitiesPerDay[today] + 1
        }
      };
    }

    // First activity today
    let newCurrentStreak = 1;
    if (currentStreak.lastActivityDate === yesterdayStr) {
      newCurrentStreak = currentStreak.currentStreak + 1;
    }

    return {
      currentStreak: newCurrentStreak,
      longestStreak: Math.max(newCurrentStreak, currentStreak.longestStreak),
      lastActivityDate: today,
      totalActiveDays: currentStreak.totalActiveDays + (currentStreak.activitiesPerDay[today] ? 0 : 1),
      activitiesPerDay: {
        ...currentStreak.activitiesPerDay,
        [today]: 1
      }
    };
  };

  // Check for new badge achievements
  const checkForNewBadges = (
    data: UserActivityData,
    sessions: ActivitySession[],
    progress: Record<string, ActivityProgress>,
    streaks: ActivityStreak
  ): { badges: ActivityBadge[], newBadges: ActivityBadge[] } => {
    const existingBadgeIds = data.badges.map(b => b.id);
    const newBadges: ActivityBadge[] = [];

    // Define all possible badges
    const allBadges: ActivityBadge[] = [
      {
        id: 'first_activity',
        title: 'First Step',
        description: 'Completed your first wellness activity',
        icon: '🌱',
        category: 'explorer',
        requirement: { type: 'activities_completed', target: 1 }
      },
      {
        id: 'activity_explorer',
        title: 'Activity Explorer',
        description: 'Tried 5 different activities',
        icon: '🗺️',
        category: 'explorer',
        requirement: { type: 'activities_completed', target: 5 }
      },
      {
        id: 'week_warrior',
        title: 'Week Warrior',
        description: 'Completed activities for 7 consecutive days',
        icon: '⚡',
        category: 'consistency',
        requirement: { type: 'streak_days', target: 7 }
      },
      {
        id: 'mindfulness_master',
        title: 'Mindfulness Master',
        description: 'Completed 10 mindfulness activities',
        icon: '🧘',
        category: 'mastery',
        requirement: { type: 'activities_completed', target: 10, categoryFilter: 'mindfulness' }
      },
      {
        id: 'mood_improver',
        title: 'Mood Improver',
        description: 'Consistently improved mood through activities',
        icon: '📈',
        category: 'improvement',
        requirement: { type: 'mood_improvement', target: 5 }
      }
    ];

    // Check each badge
    allBadges.forEach(badge => {
      if (existingBadgeIds.includes(badge.id)) return;

      let achieved = false;
      const completedSessions = sessions.filter(s => s.completed);

      switch (badge.requirement.type) {
        case 'activities_completed':
          const relevantSessions = badge.requirement.categoryFilter
            ? completedSessions.filter(s => {
                // This would need activity data to check category
                return true; // Simplified for now
              })
            : completedSessions;
          achieved = relevantSessions.length >= badge.requirement.target;
          break;

        case 'streak_days':
          achieved = streaks.currentStreak >= badge.requirement.target;
          break;

        case 'mood_improvement':
          const improvementCount = completedSessions.filter(s => 
            (s.moodRating.after || 0) > s.moodRating.before
          ).length;
          achieved = improvementCount >= badge.requirement.target;
          break;
      }

      if (achieved) {
        const unlockedBadge = { ...badge, unlockedAt: new Date() };
        newBadges.push(unlockedBadge);
      }
    });

    return {
      badges: [...data.badges, ...newBadges],
      newBadges
    };
  };

  // Get activity recommendations based on user data
  const getPersonalizedRecommendations = useCallback((activities: ActivityType[], limit = 3) => {
    const { preferences, progress, sessions } = activityData;
    
    // Score activities based on user data
    const scoredActivities = activities.map(activity => {
      let score = 0;
      
      // Prefer user's preferred categories
      if (preferences.preferredCategories.includes(activity.category)) {
        score += 3;
      }
      
      // Prefer user's preferred difficulty
      if (activity.difficulty === preferences.preferredDifficulty) {
        score += 2;
      }
      
      // Boost activities with high effectiveness
      const activityProgress = progress[activity.id];
      if (activityProgress && activityProgress.averageEffectiveness > 70) {
        score += 3;
      }
      
      // Slight penalty for recently completed activities (encourage variety)
      const recentSessions = sessions.filter(s => 
        s.activityId === activity.id && 
        s.completed &&
        s.endTime &&
        (Date.now() - s.endTime.getTime()) < 24 * 60 * 60 * 1000 // 24 hours
      );
      
      if (recentSessions.length > 0) {
        score -= 1;
      }
      
      return { activity, score };
    });
    
    // Sort by score and return top activities
    return scoredActivities
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.activity);
  }, [activityData]);

  return {
    activityData,
    isLoading,
    startActivity,
    completeActivity,
    getPersonalizedRecommendations,
    saveData
  };
};
