import React, { useMemo } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  detectMood, 
  calculateIntensity, 
  getMoodEmoji, 
  getMoodColor, 
  groupMessagesByDate,
  type MoodType 
} from '@/lib/mood-utils';
import { ChartSkeleton } from '@/components/LoadingStates';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  detectedMood?: string;
  intensity?: number;
}

interface MoodChartProps {
  messages: ChatMessage[];
}

interface MoodDataPoint {
  date: string;
  mood: string;
  intensity: number;
  count: number;
  emoji: string;
}


export const MoodChart: React.FC<MoodChartProps> = React.memo(({ messages }) => {
  const moodData = useMemo(() => {
    const dailyMoods = groupMessagesByDate(messages);
    
    // Convert to chart data points
    return Object.entries(dailyMoods)
      .map(([date, data]): MoodDataPoint => {
        // Get dominant mood for the day
        const moodCounts: Record<string, number> = {};
        data.moods.forEach(mood => {
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        
        const dominantMood = Object.entries(moodCounts).reduce((a, b) => 
          moodCounts[a[0]] > moodCounts[b[0]] ? a : b
        )[0];
        
        const avgIntensity = data.intensities.reduce((a, b) => a + b, 0) / data.intensities.length;
        
        return {
          date,
          mood: dominantMood,
          intensity: Math.round(avgIntensity),
          count: data.moods.length,
          emoji: getMoodEmoji(dominantMood)
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days
  }, [messages]);

  if (messages.length === 0) {
    return <ChartSkeleton />;
  }

  if (moodData.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Mood Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground text-sm">
            Journal for a few days to see your mood trends
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <TrendingUp className="h-5 w-5 text-primary" />
          Mood Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart visualization */}
          <div className="relative">
            <div className="flex items-end justify-between h-32 border-b border-border pb-2">
              {moodData.map((point, index) => {
                const height = (point.intensity / 5) * 100;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 min-w-0 flex-1"
                  >
                    <div
                      className={`w-8 rounded-t-lg transition-all duration-300 hover:opacity-80 border-2 ${getMoodColor(point.mood)}`}
                      style={{ height: `${height}%` }}
                      title={`${point.mood} - Intensity ${point.intensity}/5`}
                      role="img"
                      aria-label={`${point.mood} mood with intensity ${point.intensity} out of 5`}
                    />
                    <div className="text-center">
                      <div className="text-lg mb-1">{point.emoji}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(point.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-xs font-medium text-foreground">
                        {point.count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-32 flex flex-col justify-between text-xs text-muted-foreground -ml-8">
              <span>5</span>
              <span>4</span>
              <span>3</span>
              <span>2</span>
              <span>1</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-muted-foreground">Intensity Scale:</span>
            <span className="text-foreground">1-Low → 5-High</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground">Numbers show entry count</span>
          </div>

          {/* Weekly summary */}
          {moodData.length >= 3 && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">This Week</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Most Common: </span>
                  <span className="text-foreground font-medium">
                    {(() => {
                      const moodCounts = moodData.reduce((acc, curr) => {
                        acc[curr.mood] = (acc[curr.mood] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);
                      
                      const mostCommonMood = Object.entries(moodCounts)
                        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
                      
                      return `${getMoodEmoji(mostCommonMood)} ${mostCommonMood}`;
                    })()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Intensity: </span>
                  <span className="text-foreground font-medium">
                    {(moodData.reduce((sum, point) => sum + point.intensity, 0) / moodData.length).toFixed(1)}/5
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
