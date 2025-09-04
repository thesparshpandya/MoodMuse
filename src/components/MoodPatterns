import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, Clock, Target, Activity, AlertCircle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  detectedMood?: string;
  intensity?: number;
  tags?: string[];
}

interface MoodPatternsProps {
  messages: ChatMessage[];
}

interface MoodPattern {
  mood: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  averageIntensity: number;
  bestDay: string;
  bestTime: string;
  emoji: string;
}

interface TimePattern {
  hour: number;
  moodScore: number;
  entryCount: number;
  dominantMood: string;
}

interface WeekPattern {
  day: string;
  moodScore: number;
  entryCount: number;
  dominantMood: string;
}

export const MoodPatterns: React.FC<MoodPatternsProps> = ({ messages }) => {
  const userMessages = useMemo(() => 
    messages.filter(m => m.role === 'user' && m.detectedMood), 
    [messages]
  );

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    angry: '😠',
    calm: '😌',
    neutral: '😐',
    excited: '🤩',
    tired: '😴',
    stressed: '😤'
  };

  const moodScores = {
    happy: 5,
    excited: 5,
    calm: 4,
    neutral: 3,
    tired: 2,
    sad: 1,
    anxious: 1,
    angry: 1,
    stressed: 1
  };

  // Analyze mood patterns
  const moodPatterns = useMemo((): MoodPattern[] => {
    if (userMessages.length === 0) return [];

    const moodCounts: Record<string, { count: number; intensities: number[]; dates: Date[] }> = {};
    
    userMessages.forEach(message => {
      const mood = message.detectedMood!;
      if (!moodCounts[mood]) {
        moodCounts[mood] = { count: 0, intensities: [], dates: [] };
      }
      moodCounts[mood].count++;
      moodCounts[mood].intensities.push(message.intensity || 3);
      moodCounts[mood].dates.push(message.timestamp);
    });

    const total = userMessages.length;
    const patterns = Object.entries(moodCounts).map(([mood, data]) => {
      const percentage = (data.count / total) * 100;
      const averageIntensity = data.intensities.reduce((a, b) => a + b, 0) / data.intensities.length;
      
      // Determine trend based on recent vs older entries
      const sortedDates = data.dates.sort((a, b) => a.getTime() - b.getTime());
      const midpoint = Math.floor(sortedDates.length / 2);
      const recentCount = sortedDates.slice(midpoint).length;
      const olderCount = sortedDates.slice(0, midpoint).length;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (recentCount > olderCount * 1.2) trend = 'up';
      else if (recentCount < olderCount * 0.8) trend = 'down';
      
      // Find best day and time for this mood
      const dayOfWeek = data.dates.map(d => d.toLocaleDateString('en-US', { weekday: 'long' }));
      const hours = data.dates.map(d => d.getHours());
      
      const bestDay = dayOfWeek.reduce((a, b, i, arr) => 
        arr.filter(x => x === a).length > arr.filter(x => x === b).length ? a : b
      );
      
      const bestHour = hours.reduce((a, b, i, arr) => 
        arr.filter(x => x === a).length > arr.filter(x => x === b).length ? a : b
      );
      
      const bestTime = `${bestHour}:00`;

      return {
        mood,
        count: data.count,
        percentage,
        trend,
        averageIntensity,
        bestDay,
        bestTime,
        emoji: moodEmojis[mood as keyof typeof moodEmojis] || '😐'
      };
    });

    return patterns.sort((a, b) => b.count - a.count);
  }, [userMessages]);

  // Analyze time patterns
  const timePatterns = useMemo((): TimePattern[] => {
    const hourlyData: Record<number, { scores: number[]; moods: string[]; count: number }> = {};
    
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { scores: [], moods: [], count: 0 };
    }
    
    userMessages.forEach(message => {
      const hour = message.timestamp.getHours();
      const mood = message.detectedMood!;
      const score = moodScores[mood as keyof typeof moodScores] || 3;
      
      hourlyData[hour].scores.push(score);
      hourlyData[hour].moods.push(mood);
      hourlyData[hour].count++;
    });
    
    return Object.entries(hourlyData).map(([hour, data]) => {
      const averageScore = data.count > 0 
        ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length 
        : 0;
      
      const dominantMood = data.moods.length > 0 
        ? data.moods.reduce((a, b, i, arr) => 
            arr.filter(x => x === a).length > arr.filter(x => x === b).length ? a : b
          )
        : 'neutral';
      
      return {
        hour: parseInt(hour),
        moodScore: averageScore,
        entryCount: data.count,
        dominantMood
      };
    }).filter(pattern => pattern.entryCount > 0);
  }, [userMessages]);

  // Analyze weekly patterns
  const weeklyPatterns = useMemo((): WeekPattern[] => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyData: Record<string, { scores: number[]; moods: string[]; count: number }> = {};
    
    dayNames.forEach(day => {
      weeklyData[day] = { scores: [], moods: [], count: 0 };
    });
    
    userMessages.forEach(message => {
      const day = message.timestamp.toLocaleDateString('en-US', { weekday: 'long' });
      const mood = message.detectedMood!;
      const score = moodScores[mood as keyof typeof moodScores] || 3;
      
      weeklyData[day].scores.push(score);
      weeklyData[day].moods.push(mood);
      weeklyData[day].count++;
    });
    
    return dayNames.map(day => {
      const data = weeklyData[day];
      const averageScore = data.count > 0 
        ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length 
        : 0;
      
      const dominantMood = data.moods.length > 0 
        ? data.moods.reduce((a, b, i, arr) => 
            arr.filter(x => x === a).length > arr.filter(x => x === b).length ? a : b
          )
        : 'neutral';
      
      return {
        day,
        moodScore: averageScore,
        entryCount: data.count,
        dominantMood
      };
    }).filter(pattern => pattern.entryCount > 0);
  }, [userMessages]);

  // Calculate insights
  const insights = useMemo(() => {
    if (userMessages.length === 0) return [];

    const insights: Array<{ type: 'positive' | 'warning' | 'info'; message: string; icon: React.ReactNode }> = [];

    // Most common mood insight
    if (moodPatterns.length > 0) {
      const topMood = moodPatterns[0];
      insights.push({
        type: topMood.mood === 'happy' || topMood.mood === 'calm' ? 'positive' : 'info',
        message: `Your most common mood is ${topMood.mood} (${topMood.percentage.toFixed(1)}% of entries)`,
        icon: <span className="text-lg">{topMood.emoji}</span>
      });
    }

    // Time pattern insights
    if (timePatterns.length > 0) {
      const bestTimePattern = timePatterns.reduce((best, current) => 
        current.moodScore > best.moodScore ? current : best
      );
      const worstTimePattern = timePatterns.reduce((worst, current) => 
        current.moodScore < worst.moodScore ? current : worst
      );

      if (bestTimePattern.moodScore > 3.5) {
        insights.push({
          type: 'positive',
          message: `You tend to feel best around ${bestTimePattern.hour}:00`,
          icon: <Clock className="h-4 w-4 text-green-500" />
        });
      }

      if (worstTimePattern.moodScore < 2.5) {
        insights.push({
          type: 'warning',
          message: `Consider extra self-care around ${worstTimePattern.hour}:00`,
          icon: <AlertCircle className="h-4 w-4 text-orange-500" />
        });
      }
    }

    // Weekly pattern insights
    if (weeklyPatterns.length > 0) {
      const bestDay = weeklyPatterns.reduce((best, current) => 
        current.moodScore > best.moodScore ? current : best
      );
      
      if (bestDay.moodScore > 3.5) {
        insights.push({
          type: 'positive',
          message: `${bestDay.day}s tend to be your best days`,
          icon: <Star className="h-4 w-4 text-yellow-500" />
        });
      }
    }

    // Trend insights
    const positiveTrends = moodPatterns.filter(p => p.trend === 'up' && (p.mood === 'happy' || p.mood === 'calm'));
    const negativeTrends = moodPatterns.filter(p => p.trend === 'up' && (p.mood === 'sad' || p.mood === 'anxious'));

    if (positiveTrends.length > 0) {
      insights.push({
        type: 'positive',
        message: `Your ${positiveTrends.map(p => p.mood).join(' and ')} moods are trending upward`,
        icon: <TrendingUp className="h-4 w-4 text-green-500" />
      });
    }

    if (negativeTrends.length > 0) {
      insights.push({
        type: 'warning',
        message: `Keep an eye on your ${negativeTrends.map(p => p.mood).join(' and ')} patterns`,
        icon: <TrendingDown className="h-4 w-4 text-red-500" />
      });
    }

    return insights.slice(0, 5); // Limit to 5 insights
  }, [moodPatterns, timePatterns, weeklyPatterns, userMessages.length]);

  if (userMessages.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">
            Start journaling to see your mood patterns and insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      {insights.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  insight.type === 'positive' ? 'bg-green-50 dark:bg-green-950/30' :
                  insight.type === 'warning' ? 'bg-orange-50 dark:bg-orange-950/30' :
                  'bg-blue-50 dark:bg-blue-950/30'
                }`}
              >
                {insight.icon}
                <p className="text-sm text-foreground leading-relaxed">
                  {insight.message}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Mood Distribution */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Mood Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {moodPatterns.map((pattern) => (
            <div key={pattern.mood} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{pattern.emoji}</span>
                  <span className="font-medium text-foreground capitalize">
                    {pattern.mood}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {pattern.count} entries
                  </Badge>
                  {pattern.trend !== 'stable' && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        pattern.trend === 'up' ? 'text-green-600 bg-green-50 dark:bg-green-950/30' : 
                        'text-red-600 bg-red-50 dark:bg-red-950/30'
                      }`}
                    >
                      {pattern.trend === 'up' ? '↗' : '↘'} {pattern.trend}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-medium text-foreground">
                    {pattern.percentage.toFixed(1)}%
                  </span>
                  <div className="text-xs text-muted-foreground">
                    Avg intensity: {pattern.averageIntensity.toFixed(1)}/5
                  </div>
                </div>
              </div>
              <Progress value={pattern.percentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Most common on {pattern.bestDay}s around {pattern.bestTime}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Time Patterns */}
      {timePatterns.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Daily Time Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {timePatterns.map((pattern) => (
                <div 
                  key={pattern.hour}
                  className={`p-3 rounded-lg text-center ${
                    pattern.moodScore >= 4 ? 'bg-green-50 dark:bg-green-950/30' :
                    pattern.moodScore >= 3 ? 'bg-blue-50 dark:bg-blue-950/30' :
                    'bg-orange-50 dark:bg-orange-950/30'
                  }`}
                >
                  <div className="text-xs font-medium text-foreground">
                    {pattern.hour}:00
                  </div>
                  <div className="text-lg my-1">
                    {moodEmojis[pattern.dominantMood as keyof typeof moodEmojis] || '😐'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {pattern.moodScore.toFixed(1)}/5
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {pattern.entryCount} entries
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Patterns */}
      {weeklyPatterns.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Weekly Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
              {weeklyPatterns.map((pattern) => (
                <div 
                  key={pattern.day}
                  className={`p-4 rounded-lg text-center ${
                    pattern.moodScore >= 4 ? 'bg-green-50 dark:bg-green-950/30' :
                    pattern.moodScore >= 3 ? 'bg-blue-50 dark:bg-blue-950/30' :
                    'bg-orange-50 dark:bg-orange-950/30'
                  }`}
                >
                  <div className="font-medium text-foreground text-sm mb-2">
                    {pattern.day}
                  </div>
                  <div className="text-2xl mb-2">
                    {moodEmojis[pattern.dominantMood as keyof typeof moodEmojis] || '😐'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pattern.moodScore.toFixed(1)}/5
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {pattern.entryCount} entries
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
