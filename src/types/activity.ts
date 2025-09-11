import { MoodType } from '@/lib/mood-utils';

export type ActivityCategory = 'mindfulness' | 'physical' | 'social' | 'creative';
export type ActivityDifficulty = 'easy' | 'medium' | 'hard';

export interface ActivityType {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: ActivityCategory;
  duration: number; // in minutes
  difficulty: ActivityDifficulty;
  instructions?: string[];
  benefits?: string[];
  tips?: string[];
}

export interface MoodRating {
  before: number; // 1-10 scale
  after?: number; // 1-10 scale
  timestamp: Date;
}

export interface ActivityCustomization {
  duration?: number;
  difficulty?: ActivityDifficulty;
  reminders?: boolean;
  focusMode?: boolean;
}

export interface ActivitySession {
  id: string;
  activityId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  moodRating: MoodRating;
  customizations?: ActivityCustomization;
  effectiveness?: number; // calculated from mood improvement
  notes?: string;
}

export interface ActivityProgress {
  activityId: string;
  totalCompletions: number;
  totalTime: number; // in minutes
  averageEffectiveness: number;
  lastCompleted?: Date;
  streakDays: number;
  personalBest?: {
    longestSession: number;
    bestMoodImprovement: number;
  };
}

export interface ActivityStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  totalActiveDays: number;
  activitiesPerDay: Record<string, number>; // date -> count
}

export interface ActivityBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'explorer' | 'consistency' | 'mastery' | 'improvement' | 'time';
  unlockedAt?: Date;
  progress?: number; // 0-100
  requirement: {
    type: 'activities_completed' | 'streak_days' | 'category_variety' | 'mood_improvement' | 'total_time';
    target: number;
    categoryFilter?: ActivityCategory;
  };
}

export interface ActivitySeries {
  id: string;
  title: string;
  description: string;
  duration: number; // number of days
  activities: {
    day: number;
    activityId: string;
    customInstructions?: string;
  }[];
  currentDay?: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface UserActivityData {
  sessions: ActivitySession[];
  progress: Record<string, ActivityProgress>;
  streaks: ActivityStreak;
  badges: ActivityBadge[];
  preferences: {
    preferredCategories: ActivityCategory[];
    preferredDifficulty: ActivityDifficulty;
    defaultDuration: number;
    reminderTime?: string; // HH:MM format
    focusModeDefault: boolean;
  };
  activeSeries?: ActivitySeries;
}
