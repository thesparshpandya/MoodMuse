import React, { useState, useEffect } from 'react';
import { Tag, X, Plus, TrendingUp, Zap, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface MoodTag {
  id: string;
  name: string;
  color: string;
  category: 'emotion' | 'activity' | 'location' | 'trigger' | 'outcome';
  frequency: number;
}

interface MoodTaggerProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  currentMood?: string;
}

const PREDEFINED_TAGS: Omit<MoodTag, 'frequency'>[] = [
  // Emotions
  { id: 'excited', name: 'Excited', color: 'bg-yellow-500', category: 'emotion' },
  { id: 'peaceful', name: 'Peaceful', color: 'bg-green-500', category: 'emotion' },
  { id: 'overwhelmed', name: 'Overwhelmed', color: 'bg-red-500', category: 'emotion' },
  { id: 'grateful', name: 'Grateful', color: 'bg-purple-500', category: 'emotion' },
  { id: 'frustrated', name: 'Frustrated', color: 'bg-orange-500', category: 'emotion' },
  { id: 'hopeful', name: 'Hopeful', color: 'bg-blue-500', category: 'emotion' },
  
  // Activities
  { id: 'work', name: 'Work', color: 'bg-gray-500', category: 'activity' },
  { id: 'exercise', name: 'Exercise', color: 'bg-green-600', category: 'activity' },
  { id: 'socializing', name: 'Socializing', color: 'bg-pink-500', category: 'activity' },
  { id: 'reading', name: 'Reading', color: 'bg-indigo-500', category: 'activity' },
  { id: 'meditation', name: 'Meditation', color: 'bg-teal-500', category: 'activity' },
  { id: 'creativity', name: 'Creative Work', color: 'bg-violet-500', category: 'activity' },
  
  // Locations
  { id: 'home', name: 'At Home', color: 'bg-amber-500', category: 'location' },
  { id: 'outdoors', name: 'Outdoors', color: 'bg-emerald-500', category: 'location' },
  { id: 'office', name: 'Office', color: 'bg-slate-500', category: 'location' },
  { id: 'travel', name: 'Traveling', color: 'bg-cyan-500', category: 'location' },
  
  // Triggers
  { id: 'deadline', name: 'Deadline Pressure', color: 'bg-red-600', category: 'trigger' },
  { id: 'conflict', name: 'Interpersonal Conflict', color: 'bg-rose-500', category: 'trigger' },
  { id: 'achievement', name: 'Achievement', color: 'bg-lime-500', category: 'trigger' },
  { id: 'change', name: 'Life Change', color: 'bg-orange-600', category: 'trigger' },
  
  // Outcomes
  { id: 'productive', name: 'Productive', color: 'bg-green-700', category: 'outcome' },
  { id: 'reflective', name: 'Reflective', color: 'bg-blue-600', category: 'outcome' },
  { id: 'motivated', name: 'Motivated', color: 'bg-purple-600', category: 'outcome' },
  { id: 'tired', name: 'Tired', color: 'bg-gray-600', category: 'outcome' },
];

export const MoodTagger: React.FC<MoodTaggerProps> = ({
  selectedTags,
  onTagsChange,
  currentMood
}) => {
  const [customTagInput, setCustomTagInput] = useState('');
  const [allTags, setAllTags] = useState<MoodTag[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    // Load tags from localStorage and merge with predefined
    const savedTags = localStorage.getItem('mood-tags');
    const customTags = savedTags ? JSON.parse(savedTags) : [];
    
    const mergedTags = PREDEFINED_TAGS.map(tag => ({
      ...tag,
      frequency: customTags.find((t: MoodTag) => t.id === tag.id)?.frequency || 0
    })).concat(
      customTags.filter((tag: MoodTag) => 
        !PREDEFINED_TAGS.find(p => p.id === tag.id)
      )
    );
    
    setAllTags(mergedTags);
  }, []);

  const handleTagToggle = (tagId: string) => {
    const isSelected = selectedTags.includes(tagId);
    const newTags = isSelected
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    onTagsChange(newTags);
  };

  const handleCustomTag = () => {
    if (!customTagInput.trim()) return;
    
    const newTag: MoodTag = {
      id: `custom-${Date.now()}`,
      name: customTagInput.trim(),
      color: 'bg-indigo-500',
      category: 'emotion',
      frequency: 1
    };
    
    const updatedTags = [...allTags, newTag];
    setAllTags(updatedTags);
    localStorage.setItem('mood-tags', JSON.stringify(updatedTags));
    
    onTagsChange([...selectedTags, newTag.id]);
    setCustomTagInput('');
    setShowCustomInput(false);
  };

  const getPopularTags = () => {
    return allTags
      .filter(tag => tag.frequency > 0)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 6);
  };

  const popularTags = getPopularTags();

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">Tag This Moment</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {selectedTags.length} selected
          </Badge>
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tagId => {
              const tag = allTags.find(t => t.id === tagId);
              if (!tag) return null;
              
              return (
                <Badge 
                  key={tagId}
                  variant="secondary"
                  className="flex items-center gap-1 text-xs bg-primary/10 text-primary border-primary/20"
                >
                  <span className={`w-2 h-2 rounded-full ${tag.color}`} />
                  {tag.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleTagToggle(tagId)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Popular</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <Button
                  key={tag.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`text-xs h-7 ${
                    selectedTags.includes(tag.id) 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${tag.color} mr-1`} />
                  {tag.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* All Tags */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_TAGS.map(tag => (
              <Button
                key={tag.id}
                variant="outline"
                size="sm"
                onClick={() => handleTagToggle(tag.id)}
                className={`text-xs h-7 ${
                  selectedTags.includes(tag.id) 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'hover:bg-muted'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${tag.color} mr-1`} />
                {tag.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Tag Input */}
        <div className="space-y-2">
          {showCustomInput ? (
            <div className="flex gap-2">
              <Input
                placeholder="Create custom tag..."
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomTag()}
                className="text-xs h-8"
                autoFocus
              />
              <Button size="sm" onClick={handleCustomTag} className="h-8">
                Add
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomTagInput('');
                }}
                className="h-8"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomInput(true)}
              className="text-xs h-7 text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3 w-3 mr-1" />
              Create Custom Tag
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
