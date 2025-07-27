import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  detectedMood?: string;
  intensity?: number;
}

interface SearchInterfaceProps {
  messages: ChatMessage[];
  onResultSelect?: (message: ChatMessage) => void;
}

interface SearchFilters {
  dateRange: 'all' | 'today' | 'week' | 'month';
  mood: 'all' | 'happy' | 'sad' | 'anxious' | 'angry' | 'calm' | 'neutral';
  intensity: 'all' | '1' | '2' | '3' | '4' | '5';
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({ 
  messages, 
  onResultSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: 'all',
    mood: 'all',
    intensity: 'all'
  });
  const [showResults, setShowResults] = useState(false);

  const detectMood = (text: string): string => {
    const moodKeywords = {
      happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'fantastic'],
      sad: ['sad', 'down', 'depressed', 'hurt', 'cry', 'tears', 'lonely', 'empty'],
      anxious: ['anxious', 'worried', 'nervous', 'stress', 'panic', 'scared', 'fear'],
      angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'rage', 'upset'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen', 'balanced']
    };

    const lowerText = text.toLowerCase();
    const moodScores: Record<string, number> = {};

    Object.entries(moodKeywords).forEach(([mood, keywords]) => {
      moodScores[mood] = keywords.filter(keyword => lowerText.includes(keyword)).length;
    });

    const dominantMood = Object.entries(moodScores).reduce((a, b) => 
      moodScores[a[0]] > moodScores[b[0]] ? a : b
    );

    return dominantMood[1] > 0 ? dominantMood[0] : 'neutral';
  };

  const calculateIntensity = (text: string): number => {
    const intensityWords = ['very', 'extremely', 'really', 'so', 'incredibly', 'absolutely'];
    const lowerText = text.toLowerCase();
    const baseIntensity = 3;
    const intensityBoost = intensityWords.filter(word => lowerText.includes(word)).length;
    return Math.min(5, baseIntensity + intensityBoost);
  };

  const getMoodEmoji = (mood: string): string => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      calm: '😌',
      neutral: '😐'
    };
    return emojis[mood as keyof typeof emojis] || emojis.neutral;
  };

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim() && filters.dateRange === 'all' && filters.mood === 'all' && filters.intensity === 'all') {
      return [];
    }

    let userMessages = messages.filter(m => m.role === 'user');

    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      userMessages = userMessages.filter(message => 
        message.content.toLowerCase().includes(query)
      );
    }

    // Apply date filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      userMessages = userMessages.filter(message => 
        message.timestamp >= filterDate
      );
    }

    // Apply mood filter
    if (filters.mood !== 'all') {
      userMessages = userMessages.filter(message => {
        const detectedMood = detectMood(message.content);
        return detectedMood === filters.mood;
      });
    }

    // Apply intensity filter
    if (filters.intensity !== 'all') {
      const targetIntensity = parseInt(filters.intensity);
      userMessages = userMessages.filter(message => {
        const intensity = calculateIntensity(message.content);
        return intensity === targetIntensity;
      });
    }

    return userMessages
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20); // Limit to 20 results
  }, [messages, searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowResults(true);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setShowResults(true);
  };

  const clearFilters = () => {
    setFilters({
      dateRange: 'all',
      mood: 'all',
      intensity: 'all'
    });
    setSearchQuery('');
    setShowResults(false);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== 'all').length + (searchQuery ? 1 : 0);

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary-foreground rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your journal entries..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">Filters</h4>
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          <X className="h-3 w-3 mr-1" />
                          Clear
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Date Range
                        </label>
                        <Select 
                          value={filters.dateRange} 
                          onValueChange={(value) => handleFilterChange('dateRange', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">Past Week</SelectItem>
                            <SelectItem value="month">Past Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Mood
                        </label>
                        <Select 
                          value={filters.mood} 
                          onValueChange={(value) => handleFilterChange('mood', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Moods</SelectItem>
                            <SelectItem value="happy">😊 Happy</SelectItem>
                            <SelectItem value="sad">😢 Sad</SelectItem>
                            <SelectItem value="anxious">😰 Anxious</SelectItem>
                            <SelectItem value="angry">😠 Angry</SelectItem>
                            <SelectItem value="calm">😌 Calm</SelectItem>
                            <SelectItem value="neutral">😐 Neutral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Intensity
                        </label>
                        <Select 
                          value={filters.intensity} 
                          onValueChange={(value) => handleFilterChange('intensity', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Intensities</SelectItem>
                            <SelectItem value="1">1 - Very Low</SelectItem>
                            <SelectItem value="2">2 - Low</SelectItem>
                            <SelectItem value="3">3 - Medium</SelectItem>
                            <SelectItem value="4">4 - High</SelectItem>
                            <SelectItem value="5">5 - Very High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Text: "{searchQuery}"
                </Badge>
              )}
              {filters.dateRange !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {filters.dateRange === 'today' ? 'Today' : 
                   filters.dateRange === 'week' ? 'Past Week' : 
                   'Past Month'}
                </Badge>
              )}
              {filters.mood !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {getMoodEmoji(filters.mood)} {filters.mood}
                </Badge>
              )}
              {filters.intensity !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Intensity {filters.intensity}/5
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {showResults && (
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">
                Search Results ({filteredResults.length})
              </h3>
              {filteredResults.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowResults(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {filteredResults.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground text-sm">
                  No entries found matching your criteria
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredResults.map((message) => {
                  const mood = detectMood(message.content);
                  const intensity = calculateIntensity(message.content);
                  const snippet = message.content.length > 150 
                    ? message.content.substring(0, 150) + '...'
                    : message.content;

                  return (
                    <Card 
                      key={message.id}
                      className="bg-muted/30 border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => onResultSelect?.(message)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getMoodEmoji(mood)}</span>
                            <Badge variant="outline" className="text-xs">
                              {mood} • {intensity}/5
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {highlightMatch(snippet, searchQuery)}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
