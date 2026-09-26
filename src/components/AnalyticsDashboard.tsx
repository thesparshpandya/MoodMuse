import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { detectMood, calculateIntensity, getMoodEmoji, MoodType, groupMessagesByDate } from '@/lib/mood-utils';
import { BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react';

interface ChatMessage {
  content: string;
  timestamp: Date;
  role: string;
}

interface AnalyticsDashboardProps {
  messages: ChatMessage[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ messages }) => {
  const analytics = useMemo(() => {
    const userMessages = messages.filter(m => m.role === 'user');
    const dailyMoods = groupMessagesByDate(userMessages);
    
    // Calculate mood distribution
    const moodCounts: Record<MoodType, number> = {
      happy: 0, sad: 0, anxious: 0, angry: 0, calm: 0, neutral: 0
    };
    
    let totalIntensity = 0;
    userMessages.forEach(message => {
      const mood = detectMood(message.content);
      moodCounts[mood]++;
      totalIntensity += calculateIntensity(message.content);
    });

    const totalMessages = userMessages.length;
    const avgIntensity = totalMessages > 0 ? totalIntensity / totalMessages : 0;
    
    // Find dominant mood
    const dominantMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0] as MoodType] > moodCounts[b[0] as MoodType] ? a : b
    )[0] as MoodType;

    // Calculate streak
    const dates = Object.keys(dailyMoods).sort();
    let currentStreak = 0;
    let maxStreak = 0;
    
    const today = new Date().toDateString();
    for (let i = dates.length - 1; i >= 0; i--) {
      if (i === dates.length - 1 && dates[i] === today) {
        currentStreak++;
      } else if (i < dates.length - 1) {
        const currentDate = new Date(dates[i]);
        const nextDate = new Date(dates[i + 1]);
        const diffTime = Math.abs(nextDate.getTime() - currentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    }

    return {
      totalEntries: totalMessages,
      dominantMood,
      avgIntensity,
      moodCounts,
      currentStreak,
      maxStreak,
      activeDays: dates.length
    };
  }, [messages]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEntries}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.currentStreak} days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dominant Mood</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {getMoodEmoji(analytics.dominantMood)}
              <span className="capitalize">{analytics.dominantMood}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeDays}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mood Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(analytics.moodCounts).map(([mood, count]) => {
            const percentage = analytics.totalEntries > 0 ? (count / analytics.totalEntries) * 100 : 0;
            return (
              <div key={mood} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{getMoodEmoji(mood)}</span>
                    <span className="capitalize font-medium">{mood}</span>
                  </div>
                  <Badge variant="secondary">{count} entries</Badge>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emotional Intensity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Average Intensity</span>
              <Badge variant={analytics.avgIntensity > 0.7 ? "destructive" : analytics.avgIntensity > 0.4 ? "default" : "secondary"}>
                {(analytics.avgIntensity * 100).toFixed(0)}%
              </Badge>
            </div>
            <Progress value={analytics.avgIntensity * 100} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {analytics.avgIntensity > 0.7 ? "High emotional intensity - consider wellness activities" :
               analytics.avgIntensity > 0.4 ? "Moderate emotional intensity" :
               "Low emotional intensity - you seem balanced"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Achievement Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analytics.totalEntries >= 1 && <Badge>First Entry 🎉</Badge>}
            {analytics.totalEntries >= 10 && <Badge>Dedicated Writer ✍️</Badge>}
            {analytics.totalEntries >= 50 && <Badge>Journal Master 📚</Badge>}
            {analytics.currentStreak >= 3 && <Badge>3-Day Streak 🔥</Badge>}
            {analytics.currentStreak >= 7 && <Badge>Weekly Warrior 💪</Badge>}
            {analytics.currentStreak >= 30 && <Badge>Monthly Marvel 🌟</Badge>}
            {analytics.maxStreak >= 7 && <Badge>Consistency Champion 🏆</Badge>}
            {analytics.activeDays >= 30 && <Badge>Month Explorer 🗓️</Badge>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
